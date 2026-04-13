const axios = require('axios');
const cheerio = require('cheerio');
const randomUseragent = require('random-useragent');
const db = require('./database');

// Khởi tạo Database nếu chưa có
db.initDB();

// Danh sách các URL mục tiêu (Sẽ liên tục được mở rộng ở Production)
const TARGET_URLS = [
    'https://vincom.com.vn/tin-tuc/dia-diem-kham-pha/dia-diem-hen-ho-ha-noi',
    // 'https://vincom.com.vn/tin-tuc/dia-diem-kham-pha/quan-cafe-dep', // Mở comment nếu cần cào thêm
];

async function fetchHtmlWithBackoff(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            // Xoay vòng User Agent để tránh bị Firewall khoá IP
            const ua = randomUseragent.getRandom(ua => parseFloat(ua.browserVersion) >= 20);
            
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': ua,
                    'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Referer': 'https://google.com'
                },
                timeout: 10000 // 10s Timeout
            });
            return response.data;
        } catch (error) {
            if (i === retries - 1) throw error;
            console.log(`⚠️ Lỗi kết nối URL ${url}. Thử lại lần ${i + 1}...`);
            await new Promise(res => setTimeout(res, 2000)); // Sleep 2s
        }
    }
}

async function scrapeDateSpots() {
    console.log('\n==========================================');
    console.log('🚀 KHỞI ĐỘNG WIDGET DATE CRAWLER JOB...');
    console.log(`Bắt đầu cào ${TARGET_URLS.length} URL mục tiêu.`);
    console.log('==========================================\n');

    let totalDiscovered = 0;
    let totalInserted = 0;

    // Dùng Promise.allSettled để tránh 1 URL chết làm chết toàn bộ Job
    const scrapePromises = TARGET_URLS.map(async (url) => {
        try {
            console.log(`[GET] Đang tải trang: ${url}`);
            const html = await fetchHtmlWithBackoff(url);
            const $ = cheerio.load(html);
            
            const placesFound = [];
            const elements = $('h2, h3'); // Các blog hay nhét tên địa điểm vào H2, H3

            elements.each((index, element) => {
                let text = $(element).text().trim();
                text = text.replace(/^[0-9]+\.\s*/, ''); // Xoá số thứ tự ở đầu (vd "1. Hồ Tây" -> "Hồ Tây")

                if (text && text.length >= 4 && text.length <= 100) {
                    placesFound.push({
                        title: text,
                        sourceUrl: url
                    });
                }
            });

            console.log(`[PARSE] Đã tìm thấy ${placesFound.length} chuỗi tiềm năng từ ${url}.`);
            totalDiscovered += placesFound.length;

            // Ghi vào SQLite ngay lập tức
            const inserted = db.insertPlaces(placesFound);
            console.log(`[INSERT] Đã lưu thành công ${inserted} địa điểm MỚI vào Database (bỏ qua trùng lặp).`);
            totalInserted += inserted;

        } catch (error) {
            console.error(`[ERROR] Thất bại khi cào ${url} - ${error.message}`);
        }
    });

    await Promise.allSettled(scrapePromises);

    console.log('\n==========================================');
    console.log('✅ CRAWLER JOB HOÀN TẤT!');
    console.log(`> Tổng số thực thể tìm thấy: ${totalDiscovered}`);
    console.log(`> Thực thể MỚI nạp vào DB: ${totalInserted}`);
    console.log(`> TỔNG CỘNG DATA TRONG DB: ${db.getStats()}`);
    console.log('==========================================\n');
}

module.exports = { scrapeDateSpots };
