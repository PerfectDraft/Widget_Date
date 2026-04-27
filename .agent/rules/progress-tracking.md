---
trigger: always_on
---

---
trigger: always_on
description: Đọc PROGRESS.md trước khi làm việc, cập nhật sau mỗi task
---

# Progress Tracking Protocol — Widget Date

Trước khi bắt đầu bất kỳ thay đổi nào trong phiên làm việc:

1. Đọc toàn bộ nội dung `PROGRESS.md` ở thư mục gốc
2. Xác nhận với người dùng task sẽ xử lý trong phiên này
3. Nếu `PROGRESS.md` chưa tồn tại, tạo mới theo cấu trúc hiện có trong repo

***

## Sau khi hoàn thành thay đổi code

Cập nhật `PROGRESS.md` theo thứ tự sau:

**Bước 1 — Chuyển task sang Đã hoàn thành**

Tìm task trong bảng `Đang làm` hoặc `Lỗi cần sửa`, xóa khỏi bảng đó và thêm dòng mới vào phần `Đã hoàn thành`:
```
- [x] Tên task (file liên quan)
```

**Bước 2 — Ghi Changelog**

Thêm vào cuối mục `Changelog theo session`, không xóa session cũ:
```
### Session #N — YYYY-MM-DD
- Mô tả thay đổi bằng tiếng Việt
- Files đã sửa: path/to/file.ts
- Bugs đã fix: B1, B3 (nếu có)
- Tasks hoàn thành: W1, W4 (nếu có)
```

**Bước 3 — Cập nhật phần "Cập nhật lần cuối"**
```
| Ngày           | YYYY-MM-DD          |
| Phiên làm việc | #N — tên session    |
| Nhánh Git      | tên branch          |
```

**Bước 4 — Cập nhật progress bar** nếu một mảng tính năng thay đổi đáng kể (>10%)

**Bước 5 — Sync PROJECT_CONTEXT.md**

Sau mỗi session, kiểm tra xem các file sau có thay đổi không:
- `client/package.json`
- `server/package.json`
- `PROGRESS.md` (tech stack section)

Nếu có thay đổi liên quan đến stack, dependencies, hoặc kiến trúc:
→ Tự động update `.agent/.shared/PROJECT_CONTEXT.md` cho khớp.
→ Không cần hỏi user, chỉ cần log: "PROJECT_CONTEXT.md synced."

***

## Quy tắc cứng

- Không xóa Changelog cũ — chỉ thêm vào
- Chỉ đánh dấu xong sau khi kiểm tra thực tế, không đánh dấu suy đoán
- Nếu phát hiện task mới trong quá trình làm, thêm vào bảng `Đang làm` ngay
- `PROGRESS.md` phải được commit cùng với code

***

## Nhắc nhở khi kết thúc

Sau khi task hoàn thành, thông báo với người dùng:

> "Đã cập nhật PROGRESS.md. Nhớ commit: `git add PROGRESS.md && git commit -m 'docs: update progress'`"

***

## File tham chiếu

| File | Vai trò |
|---|---|
| `PROGRESS.md` | Nhật ký tiến độ — đọc và ghi mỗi phiên |
| `.agent/rules/GEMINI.md` | Rules kỹ thuật chung của project |
| `docs/PLAN-client-server.md` | Kế hoạch kiến trúc client-server |
| `TaskList.ini` | Legacy — không dùng nữa, thay bằng PROGRESS.md |
