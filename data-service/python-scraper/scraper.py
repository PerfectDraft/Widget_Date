import sqlite3
import requests
import re
import json
import random
import time
import os
from typing import List, Optional
from datetime import datetime, timedelta
import logging

# Thiết lập file logs
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Danh sách User-Agents ngẫu nhiên để tránh chặn từ server (429 Too Many Requests)
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/121.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15"
]

class GoogleMapsPhotoScraper:
    def __init__(self, db_path: str = "place_photos_cache.db"):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        """Khởi tạo cơ sở dữ liệu SQLite nếu chưa tồn tại bảng."""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS place_photos (
                    place_id TEXT PRIMARY KEY,
                    photo_urls TEXT,
                    updated_at TIMESTAMP
                )
            """)
            conn.commit()

    def _get_from_cache(self, place_id: str) -> Optional[List[str]]:
        """Lấy danh sách URL ảnh từ Cache nếu dữ liệu dưới 30 ngày."""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT photo_urls, updated_at FROM place_photos WHERE place_id = ?", (place_id,))
            row = cursor.fetchone()

            if row:
                photo_urls_raw, updated_at_str = row
                updated_at = datetime.fromisoformat(updated_at_str)
                
                # Logic TTL = 30 days
                if datetime.now() - updated_at < timedelta(days=30):
                    logging.info(f"Cache HIT cho place_id: {place_id}")
                    return json.loads(photo_urls_raw)
                else:
                    logging.info(f"Cache EXPIRED cho place_id: {place_id}")
        
        logging.info(f"Cache MISS cho place_id: {place_id}")
        return None

    def _save_to_cache(self, place_id: str, photo_urls: List[str]):
        """Cập nhật dữ liệu ảnh vào DB."""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            now = datetime.now().isoformat()
            cursor.execute("""
                INSERT INTO place_photos (place_id, photo_urls, updated_at) 
                VALUES (?, ?, ?)
                ON CONFLICT(place_id) 
                DO UPDATE SET photo_urls=excluded.photo_urls, updated_at=excluded.updated_at
            """, (place_id, json.dumps(photo_urls), now))
            conn.commit()
            logging.info(f"Đã lưu {len(photo_urls)} ảnh vào cache cho place_id: {place_id}")

    def _extract_photos_from_html(self, html: str) -> List[str]:
        """Trích xuất ID ảnh của Google Maps bằng Regex và trả về URLs."""
        # Biểu thức Regex tìm các mã định dạng AF1Qip (chuẩn ảnh dạng User Content của Google)
        # Sửa: mở rộng regex bắt nhiều định dạng photo google maps hơn nếu cần.
        # Ở format JS, IDs có thể được ẩn dưới dạng ["AF1Qip...", ...
        matches = re.findall(r'(AF1Qip[\w\-]+)', html)
        
        # Loại bỏ trùng lặp và giữ nguyên thứ tự với dict.fromkeys
        unique_ids = list(dict.fromkeys(matches))
        
        # Parse ra list chứa những URL ảnh chất lượng cao nhất (s1600)
        # Google Maps có thể dùng mã format AF1Qip, hoặc đôi khi có thể bị block cookie consent redirect.
        # Ta sẽ bỏ qua nếu ko tìm thấy
        photo_urls = [f"https://lh3.googleusercontent.com/p/{photo_id}=s1600" for photo_id in unique_ids]
        return photo_urls

    def scrape_google_maps_photos(self, place_id: str, max_retries: int = 3) -> List[str]:
        """
        Cào ảnh của place_id trên Google Maps:
        1. Query cache trước.
        2. Chạy requests cào trang nếu cache chưa có/hết hạn.
        3. Sử dụng Exponential Backoff để tránh bị khóa (Retry khi gặp lỗi 429).
        """
        
        # Bước 1: Kiểm tra cache SQLite
        cached_photos = self._get_from_cache(place_id)
        if cached_photos is not None:
            return cached_photos

        url = f"https://www.google.com/maps/search/?api=1&query=Google&query_place_id={place_id}"
        
        # Thêm cookies mặc định để bypass trang Google Consent (nếu có)
        bypass_cookies = {
            "CONSENT": "YES+cb.20230501-14-p0.en+FX+414"
        }

        # Bước 2: Request tới máy chủ của Google
        for attempt in range(max_retries):
            headers = {"User-Agent": random.choice(USER_AGENTS), "Accept-Language": "en-US,en;q=0.9,vi;q=0.8"}
            
            try:
                logging.info(f"Lần cào thứ {attempt+1}/{max_retries} cho URL: {url}")
                response = requests.get(url, headers=headers, cookies=bypass_cookies, timeout=10)
                
                if response.status_code == 200:
                    photos = self._extract_photos_from_html(response.text)
                    
                    if photos:
                        # Bước 3: Lưu vào cache nếu cào thành công
                        self._save_to_cache(place_id, photos)
                        return photos
                    else:
                        logging.warning(f"Không lấy được ảnh cho {place_id}. Có thể mã bị sai hoặc Google Maps chỉnh sửa bố cục hiển thị.")
                        return []

                elif response.status_code == 429:
                    # Exponential Backoff Time = 2^attempt + random(0, 1) giây
                    wait_time = 2 ** attempt + random.uniform(0, 1)
                    logging.warning(f"Bị giới hạn (Lỗi 429). Retry sau {wait_time:.2f} giây...")
                    time.sleep(wait_time)
                else:
                    logging.error(f"Lỗi phản hồi HTTP: {response.status_code}")
                    response.raise_for_status()
            
            except requests.RequestException as e:
                logging.error(f"Lỗi kết nối Request: {e}")
                if attempt < max_retries - 1:
                    wait_time = 2 ** attempt + random.uniform(0, 1)
                    logging.warning(f"Retry sau {wait_time:.2f} giây...")
                    time.sleep(wait_time)
                else:
                    logging.error("Vượt quá số lần thử lại tối đa. Hủy bỏ.")
                    return []
        
        return []

if __name__ == "__main__":
    # Đây là Place ID ví dụ cho Lotte Center Hà Nội
    sample_place_id = "ChIJIW-Hh0jNdTERo0s1rNwqDcw"
    
    # Path tương đối cho SQLite
    db_file_path = os.path.join(os.path.dirname(__file__), "place_photos_cache.db")
    scraper = GoogleMapsPhotoScraper(db_file_path)
    
    print(f"\\n--- [LẦN 1] Tìm kiếm ảnh cho Place ID: {sample_place_id} ---")
    start_time = time.time()
    photos = scraper.scrape_google_maps_photos(sample_place_id)
    duration1 = time.time() - start_time
    print(f"-> Found {len(photos)} photos. Mất: {duration1:.2f}s (Cào thực tế)")
    if photos:
        print(f"Ví dụ một vài URL:")
        for p in photos[:3]:
            print(" -", p)

    print(f"\\n--- [LẦN 2] Tìm kiếm lại cùng Place ID: {sample_place_id} ---")
    start_time = time.time()
    cached_photos = scraper.scrape_google_maps_photos(sample_place_id)
    duration2 = time.time() - start_time
    print(f"-> Found {len(cached_photos)} photos. Mất: {duration2:.2f}s (Lấy từ DB Cache)\\n")
