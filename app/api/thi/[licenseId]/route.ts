// File: app/api/thi/[licenseId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../utils/supabaseClient';

interface ExamAnswer {
  id: string;
  text: string;
}

interface ExamQuestion {
  id: string;
  text: string;
  image?: string | null;
  correctAnswerId?: string;
  correct_answer_id?: string;
  answers: ExamAnswer[];
}

interface ExamSubject {
  id: string;
  name: string;
  questions?: ExamQuestion[];
}

interface ExamLicensePayload {
  id?: string;
  name?: string;
  subjects?: ExamSubject[];
}

// Hàm "xáo" bài
function xaoTronBai<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Fallback truy vấn trực tiếp từ Supabase khi Worker API không khả dụng hoặc lỗi mạng
async function fetchLicenseFromSupabase(licenseId: string): Promise<ExamLicensePayload | null> {
  const { data, error } = await supabase
    .from('licenses')
    .select(`
      id,
      name,
      subjects (
        id,
        name,
        questions (
          id,
          text,
          image,
          correct_answer_id,
          answers (
            id,
            text
          )
        )
      )
    `)
    .eq('id', licenseId)
    .single();

  if (error || !data) {
    return null;
  }
  return data as unknown as ExamLicensePayload;
}

async function fetchLicensePayload(licenseId: string): Promise<ExamLicensePayload> {
  const configuredWorkerUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL?.trim();
  if (configuredWorkerUrl) {
    try {
      const cleanBase = configuredWorkerUrl.replace(/\/+$/, '');
      const res = await fetch(`${cleanBase}/api/v1/licenses/${encodeURIComponent(licenseId)}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(2500),
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        return (await res.json()) as ExamLicensePayload;
      }
    } catch (workerErr) {
      console.warn(`[API Trộn Đề] Cloudflare Worker không phản hồi cho ${licenseId}, chuyển sang Supabase fallback:`, workerErr);
    }
  }

  const fallbackData = await fetchLicenseFromSupabase(licenseId);
  if (!fallbackData) {
    throw new Error(`Không tìm thấy dữ liệu hạng bằng ${licenseId}.`);
  }
  return fallbackData;
}

// --- HÀM API CHÍNH (GET) ---
export async function GET(
  request: NextRequest,
  { params }: { params: { licenseId: string } }
) {
  try {
    const licenseId = params.licenseId;

    // 1. Lấy dữ liệu đề thi (Cloudflare Worker D1 với Supabase Fallback)
    const data = await fetchLicensePayload(licenseId);
    const licenseName = data.name || licenseId;

    // 2. "LÀM PHẲNG" DỮ LIỆU (Flatten)
    // Gom hết câu hỏi từ các môn (subjects) lại thành 1 mảng
    let allQuestions: ExamQuestion[] = [];
    if (data.subjects && Array.isArray(data.subjects)) {
      data.subjects.forEach((subject) => {
        if (subject.questions && Array.isArray(subject.questions)) {
          allQuestions = allQuestions.concat(subject.questions);
        }
      });
    }

    if (allQuestions.length === 0) {
      throw new Error(`Hạng bằng ${licenseName} chưa có câu hỏi nào.`);
    }

    // 3. "TRỘN" ĐỀ
    let deThiCuoiCung = xaoTronBai(allQuestions);

    // Xử lý giới hạn câu hỏi
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
    const deThiAnToan = deThiCuoiCung.map((q) => {
      // Tách correct_answer_id / correctAnswerId ra khỏi object trả về
      const { correct_answer_id: _ca1, correctAnswerId: _ca2, ...safeQuestion } = q;

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

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Lỗi không xác định khi trộn đề.";
    console.error('[API Trộn Đề] Lỗi nghiêm trọng:', error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
