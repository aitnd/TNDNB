import { adminDb } from '@/utils/firebaseAdmin';
import ClassHeader from '@/components/ClassDetail/ClassHeader';
import ClassDetailClient from '@/components/ClassDetail/ClassDetailClient';
import { notFound } from 'next/navigation';
import { Course } from '@/types/classManagement';

interface PageProps {
  params: {
    classId: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  // Fix: In Next.js 14/15, params might need to be awaited or accessed directly depending on config
  // For safety in this environment, we access it directly.
  const { classId } = params;
  
  if (!adminDb) return { title: 'Thiếu cấu hình Database' };

  try {
    const classDoc = await adminDb.collection('courses').doc(classId).get();
    if (!classDoc.exists) return { title: 'Không tìm thấy lớp học' };
    
    const data = classDoc.data() as Course;
    return {
      title: `Quản lý Lớp: ${data.name} | TNDNB`,
      description: data.description || `Chi tiết quản lý lớp học ${data.name}`,
    };
  } catch (e) {
    return { title: 'Lỗi truy cập dữ liệu' };
  }
}

export default async function ClassDetailPage({ params }: PageProps) {
  const { classId } = params;

  if (!adminDb) {
    return (
      <div className="p-10 text-center text-red-500 font-bold">
        Lỗi: Firebase Admin chưa được cấu hình (Thiếu Service Account Key).
      </div>
    );
  }

  const classDoc = await adminDb.collection('courses').doc(classId).get();

  if (!classDoc.exists) {
    notFound();
  }

  // Chuyển đổi Firestore Timestamp sang chuỗi ISO để truyền vào Client Component
  const rawData = classDoc.data();
  const classData = { 
    ...rawData,
    id: classDoc.id,
    createdAt: rawData?.createdAt?.toDate ? rawData.createdAt.toDate().toISOString() : null
  } as Course;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <ClassHeader classData={classData} />
        <ClassDetailClient classData={classData} />
      </div>
    </main>
  );
}
