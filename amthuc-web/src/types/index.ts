// TypeScript Interfaces cho ứng dụng Ẩm Thực

// Thông tin quán ăn
export interface Restaurant {
    id: string
    name: string           // Tên quán
    address: string        // Địa chỉ
    phone: string          // Số điện thoại
    categories: string[]   // Danh mục món ăn (Đồ ăn vặt, Gà, Mỳ cay...)
    imageUrl?: string      // Ảnh đại diện quán
    description?: string   // Mô tả quán
    openTime?: string      // Giờ mở cửa
    closeTime?: string     // Giờ đóng cửa
    isOpen?: boolean       // Đang mở cửa không
    createdAt: Date
    updatedAt?: Date
}

// Món ăn trong menu
export interface MenuItem {
    id: string
    restaurantId: string   // ID của quán ăn chứa món này
    name: string           // Tên món
    price: number          // Giá tiền (VNĐ)
    category: string       // Loại món (Nem nướng, Gà rán, Đồ uống...)
    description?: string   // Mô tả món
    imageUrl?: string      // Ảnh món ăn
    isPopular: boolean     // Món được yêu thích
    isAvailable: boolean   // Còn phục vụ không
    createdAt: Date
}

// Bộ lọc tìm kiếm
export interface SearchFilters {
    query: string          // Từ khóa tìm kiếm
    category?: string      // Lọc theo danh mục
    minPrice?: number      // Giá tối thiểu
    maxPrice?: number      // Giá tối đa
    isOpen?: boolean       // Chỉ quán đang mở
}

// Khoảng giá
export interface PriceRange {
    min: number
    max: number
    label: string          // "Dưới 30k", "30k-50k", "Trên 50k"
}

// ============ PHẦN ĐỊA ĐIỂM DU LỊCH ============

// Loại hình vé
export interface TicketType {
    name: string           // "Người lớn", "Trẻ em", "Sinh viên"
    condition?: string     // "cao trên 1.3m", "1m - 1.3m"
    price: number          // Giá tiền (VNĐ), 0 = miễn phí
}

// Loại hình địa điểm
export type AttractionCategory = 'nature' | 'culture' | 'adventure' | 'relax'

// Cách mua vé
export type PurchaseMethod = 'online' | 'quay' | 'both'

// Điểm tham quan
export interface Attraction {
    id: string
    name: string               // Tên địa điểm
    distance: number           // Khoảng cách từ TP (km)
    description?: string       // Mô tả
    imageUrl?: string          // Ảnh đại diện
    ticketTypes: TicketType[]  // Các loại vé và giá
    purchaseMethod: PurchaseMethod  // Cách mua vé
    onlineUrl?: string         // Link mua vé online
    phone?: string             // Số điện thoại liên hệ
    openTime?: string          // Giờ mở cửa
    closeTime?: string         // Giờ đóng cửa
    category: AttractionCategory  // Loại hình: thiên nhiên, văn hóa...
    createdAt: Date
    updatedAt?: Date
}
