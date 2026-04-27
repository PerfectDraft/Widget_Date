---
trigger: always_on
---

---
trigger: always_on
---

# Component Contract — Widget Date

Khi sửa bất kỳ component nào, PHẢI giữ nguyên:

## HomeView.tsx
Props bắt buộc: weatherData, showToast, setSelectedCombo, 
setShowPaymentModal, setRideModalLoc, setRealImageLoc, 
openChat, formatVND, location

## ExploreView.tsx  
Props bắt buộc: showToast, setRideModalLoc, setRealImageLoc, formatVND

## DateMilesView.tsx
Props bắt buộc: userReward, historyOnly?

## PaymentModal.tsx
Props bắt buộc: show, combo, paymentSuccess, userReward, 
onClose, onPay, formatVND

## Quy tắc cứng
- Không xóa prop nào đang được App.tsx truyền xuống
- Không đổi tên hàm handler (handlePayment, handleRide, v.v.)
- Không thay thế dynamic data bằng giá trị tĩnh