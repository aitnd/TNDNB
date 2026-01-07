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

    // Luôn dùng .png vì file local được lưu dưới dạng .png
    const ext = '.png';

    // Trả về đường dẫn local
    // Trong môi trường Dev: dùng đường dẫn tương đối /question_images/...
    // Trong môi trường Prod (Electron): dùng đường dẫn tuyệt đối file://...
    const isElectron = (window as any).electron?.isElectron;
    const resourcesPath = (window as any).electron?.resourcesPath;

    if (isElectron && resourcesPath && !import.meta.env.DEV) {
        // Chuyển đổi đường dẫn Windows sang format URL (thay \\ bằng /)
        const normalizedPath = resourcesPath.replace(/\\/g, '/');
        return `file://${normalizedPath}/question_images/${question.id}${ext}`;
    }

    return `/question_images/${question.id}${ext}`;
}

/**
 * Fallback: Nếu ảnh local không load được, dùng ảnh online
 * Có cơ chế chống retry loop bằng cách đánh dấu đã thử fallback
 */
export function handleImageError(
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    originalUrl?: string | null
) {
    const img = e.currentTarget;

    // Đánh dấu đã thử fallback để tránh vòng lặp vô hạn
    if (img.dataset.fallbackAttempted === 'true') {
        // Đã thử fallback rồi, ẩn ảnh đi
        img.style.display = 'none';
        return;
    }

    img.dataset.fallbackAttempted = 'true';

    if (originalUrl && img.src !== originalUrl) {
        img.src = originalUrl;
    } else {
        // Không có URL fallback hoặc đã thử rồi, ẩn ảnh
        img.style.display = 'none';
    }
}
