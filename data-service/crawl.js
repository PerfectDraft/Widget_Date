const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Các URL mẫu bài báo "Top địa điểm hẹn hò"
const TARGET_URLS = [
  'https://vincom.com.vn/tin-tuc/dia-diem-kham-pha/dia-diem-hen-ho-ha-noi',
];

async function scrapeDateSpots() {
  console.log('🚀 Bắt đầu khởi chạy Widget Date - Local Crawler...');
  const allPlaces = [];

  for (const url of TARGET_URLS) {
    try {
      console.log(`\n⏳ Đang cào dữ liệu từ: ${url}`);
      // Giả mạo User-Agent để tránh bị chặn 403
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
          'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
        },
        timeout: 10000,
      });

      const html = response.data;
      const $ = cheerio.load(html);

      // Thuật toán bóc tách cơ bản cho các dạng bài "Top List":
      // Các tên quán thường nằm trong thẻ h2 hoặc h3
      
      const elements = $('h2, h3');
      let count = 0;

      elements.each((index, element) => {
        const text = $(element).text().trim();
        // Lọc bỏ rác: text quá ngắn hoặc quá dài thường không phải tên quán
        if (text && text.length > 3 && text.length < 100) {
          allPlaces.push({
            title: text,
            sourceUrl: url,
            extractedAt: new Date().toISOString(),
          });
          count++;
          console.log(`   📍 Tìm thấy tiềm năng: ${text}`);
        }
      });

      console.log(`✅ Cào thành công ${count} mục từ trang này.`);

    } catch (error) {
      console.error(`❌ Lỗi khi bóc tách URL ${url}:`, error.message);
    }
  }

  // Khởi tạo thư mục data
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  // Lưu lại vào DB dạng JSON (Raw Data)
  const outputPath = path.join(dataDir, 'raw_places.json');
  fs.writeFileSync(outputPath, JSON.stringify(allPlaces, null, 2), 'utf-8');

  console.log(`\n🎉 Xong Phase 1: Hệ thống Crawler đã hoàn tất việc bóc tách!`);
  console.log(`💾 Data thô được lưu thành công tại: ${outputPath}`);
  console.log(`Tổng số địa điểm tìm thấy: ${allPlaces.length}`);
}

scrapeDateSpots();
