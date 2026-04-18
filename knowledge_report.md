# Báo cáo Kiến thức: Xử lý Ảnh Google Maps & UI Carousel

File báo cáo này tổng hợp các kiến thức và kỹ thuật đã được thảo luận và áp dụng trong quá trình sửa lỗi hiển thị ảnh và nâng cấp giao diện (UI) cho ứng dụng Widget Date.

## 1. Bản chất của URL Google Maps trong thẻ `<img>`

*   **Vấn đề:** Khi sao chép một đường link từ Google Maps (ví dụ: `https://www.google.com/maps/place/...`), đường link này trỏ đến một **trang web (HTML document)**, chứ không phải là một file ảnh tĩnh (như `.jpg`, `.png`).
*   **Hậu quả:** Việc nhúng trực tiếp đường link trang web này vào thuộc tính `src` của thẻ `<img>` (`<img src="link_google_maps" />`) sẽ khiến trình duyệt không thể render, dẫn đến lỗi hiển thị (broken image icon).

## 2. Kỹ thuật Trích xuất (Extract) Ảnh trực tiếp từ URL

*   Mặc dù là link trang web, nhưng URL chia sẻ của một bức ảnh cụ thể trên Google Maps thường chứa sẵn đường dẫn ảnh tĩnh (thumbnail) đã được mã hóa ở bên trong.
*   **Dấu hiệu nhận biết:** Đường dẫn ảnh này thường bắt đầu bằng chuỗi `6shttps:%2F%2Flh3.googleusercontent.com...` nằm lẫn trong chuỗi URL dài.
*   **Cách xử lý:**
    1.  Dùng biểu thức chính quy (Regex) để bắt chuỗi: `const match = imageUrl.match(/6s(https:%2F%2F[^!&]+)/);`
    2.  Giải mã URL (Decode): Sử dụng `decodeURIComponent(match[1])`.
    3.  **Nâng cấp chất lượng ảnh:** URL trích xuất thường chứa các tham số kích thước (ví dụ: `=w203-h270-k-no`). Có thể thay thế các tham số này (ví dụ: đổi thành `=s800`) để yêu cầu server Google trả về bức ảnh có độ phân giải cao hơn.

## 3. Giới hạn của việc Cào dữ liệu (Scraping) Ảnh từ Google Maps

*   **Một link = Một ảnh:** Đường link chia sẻ của một bức ảnh cụ thể trên Google Maps **chỉ chứa dữ liệu của chính bức ảnh đó**.
*   Khi tải mã nguồn HTML của trang đó (bằng Node.js `https.get` hoặc qua proxy như `allorigins`), hệ thống cũng chỉ tìm thấy đúng 1 URL ảnh (ảnh đang được xem).
*   Google Maps tải các bức ảnh khác trong bộ sưu tập (gallery) một cách động (dynamically) thông qua JavaScript và các request ẩn (XHR/Fetch). Do đó, không thể dùng phương pháp cào HTML đơn giản để lấy toàn bộ album ảnh.
*   **Giải pháp triệt để:** Để lấy danh sách nhiều ảnh thực tế của một địa điểm, bắt buộc phải sử dụng các dịch vụ API chính thức và có trả phí như **Google Places API**.

## 4. Xử lý UI/UX: Tạo Carousel (Thư viện ảnh) với dữ liệu hạn chế

*   **Yêu cầu:** Người dùng muốn xem nhiều ảnh dưới dạng Carousel (có nút sang trái/phải) nhưng hệ thống chỉ có đúng 1 ảnh thực tế.
*   **Chiến lược UX (Giải pháp thay thế):**
    *   **Ảnh chính xác (Authentic):** Đặt bức ảnh thực tế duy nhất bóc tách được từ Google Maps làm ảnh đầu tiên (Index 0) và gắn nhãn **"Ảnh gốc"**.
    *   **Ảnh bổ sung (Vibe/Aesthetic):** Bổ sung thêm 2-3 bức ảnh chất lượng cao từ các nguồn ảnh miễn phí (như Unsplash) có chủ đề tương đồng với địa điểm (ví dụ: nội thất quán cafe, nhà hàng) để điền vào Carousel. Gắn nhãn các ảnh này là **"Ảnh tham khảo"**.
    *   Cách này vừa đáp ứng được trải nghiệm UI mượt mà, "sang chảnh" mà người dùng mong muốn, vừa minh bạch về nguồn gốc dữ liệu.
*   **Thành phần UI:** Sử dụng React State (`currentImgIndex`, mảng `realImgUrls`) kết hợp với các icon (ChevronLeft, ChevronRight từ `lucide-react`) và các dấu chấm (indicators) để xây dựng logic chuyển ảnh.
