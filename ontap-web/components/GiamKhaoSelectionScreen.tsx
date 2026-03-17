import React, { useMemo } from 'react';
import type { License } from '../types';
import { Award, BookOpen, FileText, ChevronRight, Users, ArrowLeft } from 'lucide-react';

interface GiamKhaoSelectionScreenProps {
  licenses: License[];
  onSelectLicense: (license: License) => void;
  onBack: () => void;
}

/**
 * Trang landing Giám khảo: /ontap/giamkhao
 * Hiển thị danh sách hạng bằng Giám khảo để chọn.
 */
const GiamKhaoSelectionScreen: React.FC<GiamKhaoSelectionScreenProps> = ({ licenses, onSelectLicense, onBack }) => {
  
  // Filter các bằng dành cho Giám khảo
  const GK_NAMES = ['lý thuyết chung', 'chuyên môn'];
  const gkLicenses = useMemo(() => 
    licenses.filter(l => l.id.includes('giam-khao') || l.name.toLowerCase().includes('giám khảo') || GK_NAMES.includes(l.name.toLowerCase())),
  [licenses]);

  // Tổng số môn + câu hỏi
  const stats = useMemo(() => {
    let totalSubjects = 0, totalQuestions = 0;
    gkLicenses.forEach(lic => {
      totalSubjects += lic.subjects.length;
      lic.subjects.forEach(s => { totalQuestions += s.questions.length; });
    });
    return { totalSubjects, totalQuestions };
  }, [gkLicenses]);

  // === EMPTY STATE ===
  if (gkLicenses.length === 0) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center p-6">
        <div className="p-12 bg-card rounded-2xl border border-dashed border-yellow-500/50 text-center shadow-lg max-w-md">
          <Award className="h-16 w-16 mx-auto text-yellow-500/50 mb-4" />
          <p className="text-xl font-bold text-foreground mb-2">Chưa có bộ đề Giám khảo</p>
          <p className="text-sm text-muted-foreground">Vui lòng liên hệ quản trị viên để cập nhật dữ liệu.</p>
          <button onClick={onBack} className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 animate-slide-in-right">
      
      {/* HEADER */}
      <div className="relative text-center mb-8">
        <button 
          onClick={onBack} 
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-card p-3 rounded-xl shadow-md hover:bg-muted transition-all"
          aria-label="Quay lại"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        
        <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg mb-4">
          <Award className="h-10 w-10 text-white" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
          Tập Huấn Giám Khảo
        </h1>
        <p className="text-base text-muted-foreground mt-2">
          Chọn chương trình ôn tập phù hợp với hạng bằng của bạn
        </p>
      </div>

      {/* STATS BANNER */}
      <div className="flex items-center justify-center gap-6 mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4 text-amber-500" />
          <span><strong className="text-foreground">{gkLicenses.length}</strong> hạng bằng</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4 text-blue-500" />
          <span><strong className="text-foreground">{stats.totalSubjects}</strong> môn học</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4 text-emerald-500" />
          <span><strong className="text-foreground">{stats.totalQuestions}</strong> câu hỏi</span>
        </div>
      </div>

      {/* LICENSE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {gkLicenses.map((lic) => {
          const subjectCount = lic.subjects.length;
          const questionCount = lic.subjects.reduce((s, sub) => s + sub.questions.length, 0);
          
          return (
            <button
              key={lic.id}
              onClick={() => onSelectLicense(lic)}
              className="group relative bg-card rounded-2xl p-8 text-left border border-border hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-500/10 group-hover:bg-amber-200 dark:group-hover:bg-amber-500/20 transition-colors">
                  <Award className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-1">{lic.name}</h3>
                  <div className="flex items-center gap-3 mt-3 text-xs font-medium text-amber-600 dark:text-amber-400">
                    <span>{subjectCount} môn</span>
                    <span>•</span>
                    <span>{questionCount} câu hỏi</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-amber-500 group-hover:translate-x-1 transition-all mt-2" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GiamKhaoSelectionScreen;
