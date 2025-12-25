/**
 * Helper để lấy đường dẫn ảnh câu hỏi từ local
 * Ưu tiên ảnh offline đã tải về trong folder question_images
 */

/**
 * Chuyển đổi URL ảnh online thành đường dẫn local
 * @param question - Đối tượng câu hỏi có id và image
 * @returns Đường dẫn ảnh local hoặc null nếu không có ảnh
 */
export function getLocalImageSrc(question: { id: string; image?: string | null }): string | null {
    if (!question.image) return null;

    // Lấy extension từ URL gốc
    let ext = '.webp';
    try {
        const urlObj = new URL(question.image);
        const pathname = urlObj.pathname;
        const match = pathname.match(/\.(png|jpg|jpeg|webp|gif)$/i);
        if (match) {
            ext = match[0].toLowerCase();
        }
    } catch {
        // URL không hợp lệ, giữ extension mặc định
    }

    // Trả về đường dẫn local
    // Trong môi trường Dev: dùng đường dẫn tương đối /question_images/...
    // Trong môi trường Prod (Electron): dùng đường dẫn tuyệt đối file://...
    const isElectron = (window as any).electron?.isElectron;
    const resourcesPath = (window as any).electron?.resourcesPath;

    if (isElectron && resourcesPath && !import.meta.env.DEV) {
        // Chuyển đổi đường dẫn Windows sang format URL (thay \ bằng /)
        const normalizedPath = resourcesPath.replace(/\\/g, '/');
        return `file://${normalizedPath}/question_images/${question.id}${ext}`;
    }

    return `/question_images/${question.id}${ext}`;
}

/**
 * Fallback: Nếu ảnh local không load được, dùng ảnh online
 */
export function handleImageError(
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    originalUrl?: string | null
) {
    const img = e.currentTarget;
    if (originalUrl && img.src !== originalUrl) {
        img.src = originalUrl;
    }
}
