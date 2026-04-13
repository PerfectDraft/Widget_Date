const cron = require('node-cron');
const { scrapeDateSpots } = require('./scraper');

console.log('⏳ Đang khởi tạo Node-Cron Scheduler...');

// Run crawler immediately on startup for testing / sync
scrapeDateSpots().then(() => {
    console.log('⏰ Cronjob đã sẵn sàng! Worker sẽ ngủ và thức dậy cào tiếp vào lúc 00:00 mỗi đêm.');
});

// Configure Cron Job (00:00 every day)
// Tham số: " Phút Giờ Ngày Tháng Thứ "
cron.schedule('0 20 * * *', () => {
    console.log('\n⏰ [CRON TRIGGERED] Nửa đêm! Đã đến lúc Crawler chạy...');
    require('./database').initDB(); // Ensure DB connection is alive
    scrapeDateSpots();
}, {
    timezone: "Asia/Ho_Chi_Minh"
});

// Lắng nghe tín hiệu tắt server để ngắt kết nối DB an toàn
process.on('SIGINT', () => {
    console.log('Tắt Cronjob an toàn...');
    process.exit(0);
});
