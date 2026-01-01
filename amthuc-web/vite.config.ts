import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Cấu hình Vite cho project Ẩm Thực
export default defineConfig({
    plugins: [react()],
    base: '/amthuc/', // Đường dẫn cơ sở khi deploy
    build: {
        outDir: '../public/amthuc', // Output vào thư mục public của Next.js
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
            },
        },
    },
    server: {
        port: 5174, // Port khác để không xung đột với ontap-web
    },
})
