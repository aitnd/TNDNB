/**
 * Tối ưu hóa hình ảnh client-side:
 * 1. Resize về kích thước hợp lý (Max width 1200px)
 * 2. Chuyển đổi sang định dạng WebP
 * 3. Nén chất lượng (0.8)
 */
export const optimizeImage = (file: File, maxWidth = 1200, quality = 0.8): Promise<File> => {
    return new Promise((resolve, reject) => {
        // 1. Kiểm tra nếu không phải ảnh thì trả về nguyên gốc
        if (!file.type.startsWith('image/')) {
            resolve(file);
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                // 2. Tính toán kích thước mới
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                // 3. Vẽ lên Canvas
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject(new Error('Không thể tạo context canvas'));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                // 4. Xuất ra Blob (WebP)
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Lỗi khi nén ảnh'));
                            return;
                        }

                        // Tạo File mới từ Blob
                        const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                        const optimizedFile = new File([blob], newFileName, {
                            type: 'image/webp',
                            lastModified: Date.now(),
                        });

                        console.log(`[ImageOptimizer] Đã tối ưu: ${file.name} (${(file.size / 1024).toFixed(2)}KB) -> ${newFileName} (${(optimizedFile.size / 1024).toFixed(2)}KB)`);
                        resolve(optimizedFile);
                    },
                    'image/webp',
                    quality
                );
            };

            img.onerror = (err) => {
                reject(err);
            };
        };

        reader.onerror = (err) => {
            reject(err);
        };
    });
};
