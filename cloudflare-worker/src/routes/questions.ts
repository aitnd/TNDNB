import {
  WorkerEnv,
  LicenseDTO,
  AnswerDTO,
  QuestionDTO,
  SubjectDTO,
  LicenseRow,
  SubjectRow,
  QuestionRow,
  AnswerRow
} from '../types';

const naturalSortById = (a: { id: string }, b: { id: string }): number => {
  const getTrailingNum = (id: string): number => {
    const match = id.match(/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  };
  return getTrailingNum(a.id) - getTrailingNum(b.id);
};

export function assembleLicensesTree(
  licenses: LicenseRow[],
  subjects: SubjectRow[],
  questions: QuestionRow[],
  answers: AnswerRow[]
): LicenseDTO[] {
  const answersByQuestion = new Map<string, AnswerDTO[]>();
  for (const ans of answers) {
    const list = answersByQuestion.get(ans.question_id) || [];
    list.push({ id: ans.id, text: ans.text });
    answersByQuestion.set(ans.question_id, list);
  }

  const questionsBySubject = new Map<string, QuestionDTO[]>();
  for (const q of questions) {
    const list = questionsBySubject.get(q.subject_id) || [];
    list.push({
      id: q.id,
      text: q.text,
      image: q.image ?? null,
      correctAnswerId: q.correct_answer_id,
      answers: answersByQuestion.get(q.id) || []
    });
    questionsBySubject.set(q.subject_id, list);
  }

  const subjectsByLicense = new Map<string, SubjectDTO[]>();
  for (const s of subjects) {
    const qList = (questionsBySubject.get(s.id) || []).sort(naturalSortById);
    const list = subjectsByLicense.get(s.license_id) || [];
    list.push({
      id: s.id,
      name: s.name,
      displayOrder: s.display_order ?? 0,
      questions: qList
    });
    subjectsByLicense.set(s.license_id, list);
  }

  return licenses.map((lic) => ({
    id: lic.id,
    name: lic.name,
    displayOrder: lic.display_order ?? 0,
    subjects: subjectsByLicense.get(lic.id) || []
  }));
}

export async function handleQuestionsRoutes(
  request: Request,
  env: WorkerEnv,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const url = new URL(request.url);
  const { pathname } = url;

  if (pathname === '/api/v1/meta/version' && request.method === 'GET') {
    const row: any = await env.DB.prepare(
      `SELECT id, version, content_hash, total_questions, updated_at FROM sync_meta WHERE id = 'questions_bank'`
    ).first();

    const payload = row
      ? {
          id: row.id,
          version: Number(row.version),
          contentHash: String(row.content_hash),
          totalQuestions: Number(row.total_questions),
          updatedAt: Number(row.updated_at)
        }
      : {
          id: 'questions_bank',
          version: 1,
          contentHash: 'initial',
          totalQuestions: 0,
          updatedAt: Date.now()
        };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });
  }

  if (pathname === '/api/v1/questions/snapshot' && request.method === 'GET') {
    const [licRes, subRes, qRes, ansRes, metaRow] = await Promise.all([
      env.DB.prepare(`SELECT id, name, display_order FROM licenses ORDER BY display_order ASC`).all<LicenseRow>(),
      env.DB.prepare(`SELECT id, license_id, name, display_order FROM subjects ORDER BY display_order ASC`).all<SubjectRow>(),
      env.DB.prepare(`SELECT id, subject_id, text, image, correct_answer_id FROM questions`).all<QuestionRow>(),
      env.DB.prepare(`SELECT id, question_id, text, display_order FROM answers ORDER BY display_order ASC`).all<AnswerRow>(),
      env.DB.prepare(`SELECT version, content_hash, updated_at FROM sync_meta WHERE id = 'questions_bank'`).first<{
        version: number;
        content_hash: string;
        updated_at: number;
      }>()
    ]);

    const licenses = assembleLicensesTree(
      licRes.results || [],
      subRes.results || [],
      qRes.results || [],
      ansRes.results || []
    );

    return new Response(
      JSON.stringify({
        version: metaRow?.version ?? 1,
        contentHash: metaRow?.content_hash ?? 'initial',
        updatedAt: metaRow?.updated_at ?? Date.now(),
        licenses
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
        }
      }
    );
  }

  if (pathname.startsWith('/api/v1/licenses/') && request.method === 'GET') {
    const licenseId = decodeURIComponent(pathname.replace('/api/v1/licenses/', '').split('/')[0]);
    const licRow = await env.DB.prepare(
      `SELECT id, name, display_order FROM licenses WHERE id = ?`
    )
      .bind(licenseId)
      .first<LicenseRow>();

    if (!licRow) {
      return new Response(JSON.stringify({ error: `Không tìm thấy hạng bằng ${licenseId}` }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    const subRes = await env.DB.prepare(
      `SELECT id, license_id, name, display_order FROM subjects WHERE license_id = ? ORDER BY display_order ASC`
    )
      .bind(licenseId)
      .all<SubjectRow>();
    const qRes = await env.DB.prepare(
      `SELECT q.id, q.subject_id, q.text, q.image, q.correct_answer_id
       FROM questions q
       INNER JOIN subjects s ON q.subject_id = s.id
       WHERE s.license_id = ?`
    )
      .bind(licenseId)
      .all<QuestionRow>();
    const ansRes = await env.DB.prepare(
      `SELECT a.id, a.question_id, a.text, a.display_order
       FROM answers a
       INNER JOIN questions q ON a.question_id = q.id
       INNER JOIN subjects s ON q.subject_id = s.id
       WHERE s.license_id = ?
       ORDER BY a.display_order ASC`
    )
      .bind(licenseId)
      .all<AnswerRow>();

    const [licenseTree] = assembleLicensesTree(
      [licRow],
      subRes.results || [],
      qRes.results || [],
      ansRes.results || []
    );

    return new Response(JSON.stringify(licenseTree), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600'
      }
    });
  }

  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
    status: 405,
    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
  });
}
