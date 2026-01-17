# Hướng Dẫn Tạo API Keys Cho Hệ Thống MMO Automation

> **Mục đích:** Tài liệu này hướng dẫn chi tiết cách lấy tất cả API keys cần thiết để vận hành hệ thống n8n MMO Automation.

---

## 📋 Danh Sách API Cần Thiết

| API | Module Sử Dụng | Mức Độ | Chi Phí |
|-----|---------------|--------|---------|
| Facebook Graph API | Social Publisher, Auto Responder | Bắt buộc | Miễn phí |
| YouTube Data API v3 | Trend Hunter | Bắt buộc | Miễn phí (10,000 quota/ngày) |
| Google Gemini API | AI Agent | Bắt buộc | Miễn phí (60 req/phút) |
| OpenAI API | AI Agent (thay thế) | Tùy chọn | Trả phí |
| Shopee Affiliate API | Affiliate Bot | Tùy chọn | Miễn phí |

---

## 1. Facebook Graph API

### 1.1 Tạo Facebook App

1. Truy cập: https://developers.facebook.com/apps
2. Click **"Create App"** → Chọn **"Business"**
3. Đặt tên App: `MMO Automation`
4. Tạo xong → vào **App Dashboard**

### 1.2 Lấy Page Access Token (Permanent)

**Bước 1: Vào Graph API Explorer**
- URL: https://developers.facebook.com/tools/explorer/

**Bước 2: Chọn App và Permissions**
- User or Page: Chọn **Page** của bạn
- Permissions cần thêm:
  - `pages_show_list`
  - `pages_read_engagement`
  - `pages_manage_posts`
  - `pages_manage_metadata`
  - `pages_read_user_content`

**Bước 3: Generate Token**
- Click **"Generate Access Token"**
- Authorize qua popup

**Bước 4: Extend Token (Permanent)**
- Vào: https://developers.facebook.com/tools/debug/accesstoken
- Paste token → Click **"Extend Access Token"**
- Copy token mới (hạn 60 ngày hoặc permanent)

**Bước 5: Lấy Page Token từ User Token**
```
GET /me/accounts?access_token={USER_TOKEN}
```
- Tìm Page cần dùng → Copy `access_token` của Page đó

### 1.3 Cấu hình trong n8n

1. **Settings** → **Credentials** → **Add Credential**
2. Type: **Header Auth**
3. Name: `FB_PAGE_TOKEN`
4. Header Name: `Authorization`
5. Header Value: `Bearer {PAGE_ACCESS_TOKEN}`

---

## 2. YouTube Data API v3

### 2.1 Tạo Project trên Google Cloud

1. Truy cập: https://console.cloud.google.com
2. Click **"Select Project"** → **"New Project"**
3. Đặt tên: `MMO Automation`
4. Click **Create**

### 2.2 Bật YouTube Data API

1. Vào **APIs & Services** → **Library**
2. Tìm **"YouTube Data API v3"**
3. Click **Enable**

### 2.3 Tạo API Key

1. Vào **APIs & Services** → **Credentials**
2. Click **"+ Create Credentials"** → **"API Key"**
3. Copy API Key

### 2.4 Tạo OAuth 2.0 Client (cho n8n YouTube node)

1. **Credentials** → **"+ Create Credentials"** → **"OAuth client ID"**
2. Application type: **Web application**
3. Authorized redirect URIs: 
   ```
   http://localhost:5678/rest/oauth2-credential/callback
   ```
4. Click **Create** → Copy **Client ID** và **Client Secret**

### 2.5 Cấu hình trong n8n

**Cách 1: Environment Variable**
1. **Settings** → **Variables**
2. Thêm: `GOOGLE_API_KEY` = `{API_KEY}`

**Cách 2: OAuth2 Credential**
1. Trong workflow → Node YouTube → **Create New Credential**
2. Paste Client ID và Client Secret
3. Click **Connect** để authorize

---

## 3. Google Gemini API

### 3.1 Lấy API Key

1. Truy cập: https://aistudio.google.com/app/apikey
2. Click **"Create API Key"**
3. Chọn Project (hoặc tạo mới)
4. Copy API Key

### 3.2 Cấu hình trong n8n

1. Trong workflow → Node **Google Gemini Chat Model**
2. **Create New Credential** → Type: **Google AI (Gemini)**
3. Paste API Key
4. Model đề xuất: `gemini-2.0-flash-exp` (miễn phí, nhanh)

---

## 4. OpenAI API (Tùy chọn)

### 4.1 Lấy API Key

1. Truy cập: https://platform.openai.com/api-keys
2. Click **"Create new secret key"**
3. Copy API Key (chỉ hiển thị 1 lần!)

### 4.2 Cấu hình trong n8n

1. Node **OpenAI Chat Model** → **Create New Credential**
2. Type: **OpenAI API**
3. Paste API Key

---

## 5. Shopee Affiliate API (Tùy chọn)

### 5.1 Đăng ký Shopee Affiliate

1. Truy cập: https://affiliate.shopee.vn
2. Đăng ký tài khoản Affiliate
3. Vào **Dashboard** → **API Settings**
4. Copy **App ID** và **Secret Key**

### 5.2 Cấu hình trong n8n

1. Sử dụng **HTTP Request** node
2. Authentication: **Header Auth**
3. Headers:
   - `X-Shopee-App-ID`: `{APP_ID}`
   - `X-Shopee-Signature`: `{SIGNATURE}` (cần tính toán)

---

## 📁 Lưu Trữ Credentials

### File .env (Bảo mật)

```env
# Facebook
FB_PAGE_ACCESS_TOKEN=EAAxxxxxx

# Google
GOOGLE_API_KEY=AIzaSyxxxxxx
GEMINI_API_KEY=AIzaSyxxxxxx
YOUTUBE_CLIENT_ID=xxxxx.apps.googleusercontent.com
YOUTUBE_CLIENT_SECRET=GOCSPX-xxxxx

# OpenAI (nếu dùng)
OPENAI_API_KEY=sk-xxxxx

# Shopee (nếu dùng)
SHOPEE_APP_ID=xxxxx
SHOPEE_SECRET_KEY=xxxxx
```

> ⚠️ **Lưu ý:** KHÔNG commit file `.env` lên Git!

---

## 🔄 Cập Nhật Token

| Token | Thời hạn | Cách gia hạn |
|-------|----------|--------------|
| Facebook Page Token | 60 ngày / Permanent | Extend qua Debug Tool |
| YouTube OAuth | Tự động refresh | n8n tự xử lý |
| Gemini API Key | Không hết hạn | - |
| OpenAI API Key | Không hết hạn | - |

---

## ✅ Checklist Sau Khi Cấu Hình

- [ ] Facebook Page Token hoạt động (test POST /me/feed)
- [ ] YouTube API Key hoạt động (test search videos)
- [ ] YouTube OAuth2 đã authorize
- [ ] Gemini API Key hoạt động
- [ ] Tất cả credentials đã lưu trong n8n
- [ ] File .env đã backup

---

*Cập nhật lần cuối: 2026-01-11*
