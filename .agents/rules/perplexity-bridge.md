---
trigger: always_on
---

# Perplexity Bridge

## Mô tả
Dự án này kết nối Perplexity AI qua file bridge.
File `D:/UET/ask.py` đã tồn tại. KHÔNG tạo lại.

## Cách gọi
Chạy trong terminal:
python D:/UET/ask.py "câu hỏi"

Đọc kết quả giữa 2 dòng:
===PERPLEXITY_RESPONSE===
===END_RESPONSE===

## BẮT BUỘC hỏi Perplexity trước khi
1. Tạo implementation plan cho feature mới
2. Quyết định architecture / tech stack
3. Gặp lỗi không rõ nguyên nhân sau 1 lần fix
4. Review hoặc refactor code phức tạp

## Không được
- Tự đoán giải pháp phức tạp khi chưa hỏi
- Gọi Perplexity quá 1 lần cho cùng 1 câu hỏi
- Tạo lại ask.py hay bất kỳ file bridge nào

## Khi xong task
python -c "open('D:/UET/output.txt','w').write('[TASK_DONE] mô tả')"
Đọc báo cáo tại D:/UET/input.txt

## QUAN TRỌNG — Phân biệt 2 lệnh

### Hỏi Perplexity (dùng thường xuyên):
python D:/UET/ask.py "câu hỏi"

### Báo kết thúc toàn bộ session (CHỈ dùng khi hoàn thành MỌI task):
python -c "open('D:/UET/output.txt','w').write('[TASK_DONE] mô tả')"

KHÔNG được ghi [TASK_DONE] sau mỗi câu hỏi đơn lẻ.
Chỉ ghi [TASK_DONE] khi user xác nhận đã xong toàn bộ công việc trong session.