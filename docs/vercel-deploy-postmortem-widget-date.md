# Widget Date Vercel Deployment Postmortem

## Mục tiêu
Tài liệu này ghi lại nguyên nhân, cách sửa, và checklist phòng tránh cho lỗi deploy của dự án `Widget_Date` trên Vercel để tránh lặp lại trong các lần release sau.

## Triệu chứng đã gặp
Deployment từng thất bại vì Vercel không tìm thấy output directory đúng sau khi build, đồng thời endpoint `/api/auth/login` trả về 404 trên production.

Trong lần debug này, build log cuối cùng đã chạy thành công: Vite build hoàn tất, output được tạo ở `dist`, quá trình deploy hoàn tất, và build cache được tạo lại thành công sau deployment.

## Root cause
Nguyên nhân gốc là cấu hình monorepo trên Vercel không đồng nhất giữa **Root Directory**, **outputDirectory**, và vị trí thật của frontend/API trong repo. Với monorepo, Vercel yêu cầu phải xác định đúng Root Directory của project và output path phải khớp với nơi build thực sự sinh ra artifact.

Khi project bị đẩy về chế độ custom/other mà không có `outputDirectory` đúng, Vercel có thể fallback sang `public`, từ đó gây lỗi kiểu `No Output Directory named "public" found after the Build completed`.

Ngoài ra, việc cố khai báo runtime function sai format trong `vercel.json` cũng làm build fail với lỗi `Function Runtimes must have a valid version`.

## Cấu hình đã chốt
Phương án ổn định là để Vercel project chạy từ **repo root**, sau đó chỉ định build frontend qua root script và trỏ output về `client/dist`. Cách này phù hợp với monorepo có cả `client/` và `api/` cùng nằm ở root repo.

`vercel.json` nên giữ tối giản theo hướng custom build, có `framework: null`, `buildCommand`, `installCommand`, `outputDirectory`, và `rewrites`; không cần block `functions` nếu API TypeScript trong `/api` đã dùng Node.js runtime mặc định của Vercel.

## Cấu hình khuyến nghị
```json
{
  "framework": null,
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "outputDirectory": "client/dist",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ]
}
```

## Checklist phòng tránh
- Root Directory trên Vercel phải khớp với kiến trúc repo; nếu frontend và API cùng dùng trong một project thì ưu tiên để ở repo root.
- `outputDirectory` phải trỏ đúng đến nơi artifact frontend thực sự được sinh ra; với repo này là `client/dist`.
- Không khai báo `functions.runtime` bằng format không còn phù hợp, vì Vercel đã tự nhận Node.js runtime cho file trong `/api`.
- Không dùng Ignored Build Step để skip nhầm build; nếu cần ép build thì command phải trả mã lỗi khác 0, còn trả `0` là bỏ qua build.
- Sau mỗi lần đổi cấu hình deployment, phải kiểm tra lại tab Functions và gọi thử endpoint `/api/auth/login` trên production.

## Cảnh báo hiệu năng hiện tại
Build hiện đã thành công nhưng Vite vẫn cảnh báo một chunk JavaScript sau minify lớn hơn 500 kB. Vite khuyến nghị xử lý bằng `dynamic import()`, hoặc `build.rollupOptions.output.manualChunks`, hoặc chỉ tăng `chunkSizeWarningLimit` nếu muốn ẩn cảnh báo mà không tối ưu thật sự.

Với bundle hiện tại, hướng nên làm là ưu tiên code-splitting theo route hoặc theo feature trước, chỉ dùng `manualChunks` khi đã biết rõ nhóm dependency nào nên tách riêng để tránh tạo lỗi tải module phụ thuộc sai thứ tự.

## Hành động tiếp theo
1. Giữ nguyên cấu hình deploy hiện tại đã chạy ổn định.
2. Thêm tài liệu này vào repo, ví dụ `docs/vercel-deployment-postmortem.md`, để team tra cứu khi deploy lại.
3. Tạo task tối ưu bundle của client vì file `index-D8UXbpAj.js` vẫn đang lớn và Vite đã cảnh báo rõ ràng trong build log.
4. Trong các lần release sau, luôn kiểm tra đồng thời ba thứ: Root Directory, output directory, và vị trí của `/api` trong repo trước khi redeploy.
