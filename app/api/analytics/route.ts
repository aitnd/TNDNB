import { NextResponse } from 'next/server';
// 1. "Triệu hồi" cái 'thợ' nói chuyện với Google
import { BetaAnalyticsDataClient } from '@google-analytics/data';

// 2. Điền "Mã Tài sản" (Property ID) của anh vào đây
// (Đây là cái mã 512039111 anh tìm thấy ở bước trước đó)
const PROPERTY_ID = '512039111';

// 3. Hàm 'bí mật' này sẽ chạy trên máy chủ (Server)
export async function GET(request: Request) {

    // 4. Lấy 'chìa khóa' từ 'két sắt' Vercel ra
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

    // (Vercel nó hay lưu \n thành \\n, mình phải 'sửa' lại cho đúng)
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!clientEmail || !privateKey) {
        console.error('Lỗi: Thiếu chìa khóa Google Service Account trong biến môi trường!');
        return NextResponse.json(
            { error: 'Lỗi cấu hình máy chủ. Không tìm thấy chìa khóa.' },
            { status: 500 }
        );
    }

    try {
        // 5. 'Khởi động' cái 'thợ' với 'chìa khóa' bí mật
        const analyticsDataClient = new BetaAnalyticsDataClient({
            credentials: {
                client_email: clientEmail,
                private_key: privateKey,
            },
        });

        // 6. 'Hỏi' Google: "Cho tui số liệu 7 ngày qua!"
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [
                {
                    startDate: '7daysAgo', // (Từ 7 ngày trước)
                    endDate: 'today',    // (Đến hôm nay)
                },
            ],
            // (Mình muốn 2 con số: Tổng người dùng, và Tổng số lần xem trang)
            metrics: [{ name: 'totalUsers' }, { name: 'screenPageViews' }],
        });

        // 7. 'Lọc' kết quả cho nó đẹp
        let totalUsers = '0';
        let totalPageViews = '0';

        if (response.rows && response.rows.length > 0) {
            // (Google trả về 1 hàng duy nhất cho tổng 7 ngày)
            totalUsers = response.rows[0].metricValues?.[0]?.value || '0';
            totalPageViews = response.rows[0].metricValues?.[1]?.value || '0';
        }

        // 8. 'Gửi' 2 con số này về cho trang Quản lý
        return NextResponse.json({
            totalUsers: totalUsers,
            totalPageViews: totalPageViews,
        });

    } catch (err: any) {
        console.error('Lỗi khi gọi API Google Analytics:', err.message);
        return NextResponse.json(
            { error: `Lỗi khi lấy dữ liệu: ${err.message}` },
            { status: 500 }
        );
    }
}
