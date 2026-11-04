// File: app/api/thi/[licenseId]/route.ts

import { NextRequest, NextResponse } from 'next/server';

// --- CÔNG THỨC TRỘN ĐỀ (Giữ nguyên) ---

// Hàm "xáo" bài (Giữ nguyên)
function xaoTronBai(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// --- HÀM API CHÍNH (GET) ---
export async function GET(
  request: NextRequest,
  { params }: { params: { licenseId: string } }
) {
  try {
    const licenseId = params.licenseId;

    // 1. 💖 LẤY "KHO" CÂU HỎI TỪ CLOUDFLARE D1 WORKER API 💖
    const cloudflareApiUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL || 'https://api.tndnb.vn';
    const res = await fetch(`${cloudflareApiUrl}/api/v1/licenses/${encodeURIComponent(licenseId)}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || `Không tìm thấy hạng bằng ${licenseId} hoặc lỗi kết nối Cloudflare D1 (HTTP ${res.status}).`);
    }

    const data = await res.json();
    const licenseName = data.name || licenseId;

    // 2. "LÀM PHẲNG" DỮ LIỆU (Flatten)
    // Gom hết câu hỏi từ các môn (subjects) lại thành 1 mảng
    let allQuestions: any[] = [];
    if (data.subjects && Array.isArray(data.subjects)) {
      data.subjects.forEach((subject: any) => {
        if (subject.questions && Array.isArray(subject.questions)) {
          allQuestions = allQuestions.concat(subject.questions);
        }
      });
    }

    if (allQuestions.length === 0) {
      throw new Error(`Hạng bằng ${licenseName} chưa có câu hỏi nào.`);
    }

    // 3. "TRỘN" ĐỀ (Giữ nguyên logic)
    let deThiCuoiCung = xaoTronBai(allQuestions);

    // 💖 XỬ LÝ GIỚI HẠN CÂU HỎI 💖
    const url = new URL(request.url);
    const limitStr = url.searchParams.get('limit');
    let limit = 30; // Mặc định 30 câu
    if (limitStr) {
      const parsedLimit = parseInt(limitStr, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        limit = parsedLimit;
      }
    }

    deThiCuoiCung = deThiCuoiCung.slice(0, limit);

    // 4. "LỌC" ĐÁP ÁN ĐÚNG & XÁO ĐÁP ÁN (Bảo mật - Zero Answer Leaks)
    const deThiAnToan = deThiCuoiCung.map((q: any) => {
      // Tách correct_answer_id / correctAnswerId ra khỏi object trả về
      const { correct_answer_id, correctAnswerId, ...safeQuestion } = q;

      // Xáo trộn thứ tự đáp án (a, b, c, d)
      if (safeQuestion.answers && Array.isArray(safeQuestion.answers)) {
        safeQuestion.answers = xaoTronBai([...safeQuestion.answers]);
      }

      return safeQuestion;
    });

    // 5. "Gửi" bộ đề
    return NextResponse.json({
      licenseName: licenseName,
      questions: deThiAnToan,
    });

  } catch (error: any) {
    console.error('[API Trộn Đề] Lỗi nghiêm trọng:', error);
    return NextResponse.json(
      { error: error.message || "Lỗi không xác định khi trộn đề." },
      { status: 500 }
    );
  }
}
