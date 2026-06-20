# MoryTory 2.0 — Khung ảnh gỗ thủ công, sống lại bằng AR

**MoryTory 2.0** là nền tảng thiết kế khung ảnh gỗ thủ công tích hợp công nghệ **AR (Thực tế tăng cường)**. Người dùng có thể tải ảnh lên, chọn kích thước khung, chọn hiệu ứng AR (tuyết rơi, hoa anh đào, lấp lánh), viết lời nhắn và đặt hàng. Khi nhận khung, chỉ cần quét mã QR bằng điện thoại để xem kỷ niệm sống động.

## 🎨 Thiết kế

Dự án sử dụng hệ màu ấm áp, thủ công lấy cảm hứng từ gỗ tự nhiên:

| Màu | Mã Hex | Vai trò |
|------|--------|---------|
| Cream | `#FDFBF7` | Nền chính |
| Walnut | `#8B6914` | Màu chủ đạo (gỗ) |
| Sage | `#9CAF88` | Màu nhấn (thiên nhiên) |
| Sun | `#F5C542` | Điểm nhấn (ấm áp) |
| Ink | `#2D2A26` | Văn bản chính |

Fonts: **Playfair Display** (serif), **Dancing Script** (script), **Inter** (sans-serif).

## 🚀 Công nghệ

- **React 19** + **TypeScript** — UI framework
- **Vite** — Build tool
- **Tailwind CSS** — Styling
- **React Router** — Điều hướng SPA
- **A-Frame** + **MindAR** — AR trên web
- **Lucide React** — Icon
- **QRCode.react** — Mã QR
- **Cloudflare Functions** — Backend API

## 📁 Cấu trúc dự án

```
MoryTory2.0/
├── index.html              # Entry HTML với meta tags & fonts
├── package.json            # Dependencies & scripts
├── vite.config.ts          # Vite config với SSL
├── tailwind.config.js      # Hệ màu thiết kế
├── src/
│   ├── main.jsx            # React entry point
│   ├── App.jsx             # Router + providers
│   ├── index.css           # Global styles + animations
│   ├── assets/             # Ảnh (family-hero, moments, frame-hands...)
│   ├── components/
│   │   ├── HomePage.jsx    # Landing page đầy đủ (hero, steps, reviews, CTA)
│   │   ├── DesignPage.jsx  # Trang thiết kế khung ảnh
│   │   ├── LeftColumnPreview.jsx  # Xem trước khung
│   │   ├── Step1Upload.jsx        # Tải ảnh lên
│   │   ├── Step2FrameSize.jsx     # Chọn kích thước
│   │   ├── Step3ARSelection.jsx   # Chọn hiệu ứng AR
│   │   ├── Step4AREditor.jsx      # Tùy chỉnh thông điệp
│   │   ├── Step5Summary.jsx       # Tổng kết & giá
│   │   ├── CartIcon.jsx           # Icon giỏ hàng
│   │   ├── CartModal.jsx          # Modal giỏ hàng
│   │   ├── CheckoutModal.jsx      # Thanh toán + QR
│   │   ├── ARRoute.jsx            # AR experience route
│   │   └── ARViewer.jsx           # MindAR viewer
│   ├── store/
│   │   ├── DesignContext.jsx      # Context thiết kế
│   │   ├── CartContext.jsx        # Context giỏ hàng
│   │   ├── designReducer.js       # Reducer thiết kế
│   │   └── draftService.js        # Auto-save draft
│   ├── data/
│   │   └── arEffects.js           # Danh sách hiệu ứng AR
│   └── utils/
│       ├── fileUtils.js           # Validate file
│       ├── imageUtils.js          # Xử lý ảnh
│       └── ar-effects.js          # Custom A-Frame components
└── functions/
    └── api/
        └── orders.js              # Cloudflare API (lưu/truy xuất đơn hàng)
```

## 🔧 Cài đặt & Chạy

```bash
# Cài đặt dependencies
npm install

# Chạy development server (với HTTPS cho AR)
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

## 📱 Trải nghiệm AR

1. Thiết kế khung ảnh tại `/design`
2. Thêm vào giỏ hàng và thanh toán
3. Nhận mã QR (in sẵn sau khung)
4. Quét mã QR bằng điện thoại → mở `/ar?orderId=...`
5. Hướng camera vào khung ảnh → hiệu ứng AR kích hoạt

> **Lưu ý:** Trình duyệt Zalo thường chặn camera. Hãy mở link bằng Chrome/Safari.

---

© 2026 MoryTory. Thủ công tại Việt Nam.