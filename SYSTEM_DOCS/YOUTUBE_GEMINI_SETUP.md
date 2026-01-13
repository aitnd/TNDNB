# Hướng Dẫn Cấu Hình YouTube Data API & Gemini

## Phần 1: Lấy YouTube Data API Key

### Bước 1: Truy cập Google Cloud Console
1. Mở: https://console.cloud.google.com
2. Đăng nhập bằng tài khoản Google

### Bước 2: Tạo Project mới (nếu chưa có)
1. Click **"Select Project"** → **"New Project"**
2. Đặt tên: `MMO Automation`
3. Click **Create**

### Bước 3: Bật YouTube Data API
1. Vào **APIs & Services** → **Library**
2. Tìm **"YouTube Data API v3"**
3. Click **Enable**

### Bước 4: Tạo API Key
1. Vào **APIs & Services** → **Credentials**
2. Click **"+ Create Credentials"** → **"API Key"**
3. Copy API Key được tạo

### Bước 5: Thêm vào n8n
1. Mở n8n → **Settings** → **Variables**
2. Thêm biến: `GOOGLE_API_KEY` = `<API_KEY_VỪA_COPY>`

---

## Phần 2: Đổi OpenAI sang Gemini (Miễn phí)

### Bước 1: Lấy Gemini API Key
1. Truy cập: https://aistudio.google.com/app/apikey
2. Click **"Create API Key"**
3. Copy API Key

### Bước 2: Cấu hình trong n8n
1. Mở workflow **Trend Hunter - YouTube**
2. Double-click vào node **"openai_llm"**
3. Đổi loại node thành **"Google Gemini Chat Model"**
4. Tạo credential mới:
   - Type: **Google AI (Gemini)**
   - API Key: `<GEMINI_API_KEY>`
5. Model: `gemini-2.0-flash-exp` (miễn phí, nhanh)
6. Save

---

## Phần 3: Cấu hình YouTube OAuth (cho node get_videos)

### Bước 1: Tạo OAuth Client
1. Vào **Google Cloud Console** → **APIs & Services** → **Credentials**
2. Click **"+ Create Credentials"** → **"OAuth client ID"**
3. Application type: **Web application**
4. Authorized redirect URIs: `http://localhost:5678/rest/oauth2-credential/callback`
5. Click Create, copy **Client ID** và **Client Secret**

### Bước 2: Thêm vào n8n
1. Trong workflow, double-click node **"get_videos1"**
2. Click **"Create New Credential"** → **"YouTube OAuth2 API"**
3. Paste Client ID và Client Secret
4. Click **"Connect"** để authorize

---

## Kiểm tra nhanh
- [ ] GOOGLE_API_KEY đã thêm vào n8n Variables
- [ ] Gemini credential đã tạo
- [ ] YouTube OAuth2 đã authorize
- [ ] Workflow chạy không lỗi
