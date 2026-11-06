import React, { useMemo } from 'react';
import type { License } from '../types';
import { Award, BookOpen, FileText, ChevronRight, Users, ArrowLeft, Star, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface GiamKhaoSelectionScreenProps {
  licenses: License[];
  onSelectLicense: (license: License) => void;
  onBack: () => void;
}

const GiamKhaoSelectionScreen: React.FC<GiamKhaoSelectionScreenProps> = ({ licenses, onSelectLicense, onBack }) => {
  const GK_NAMES = ['lý thuyết chung', 'chuyên môn'];
  const gkLicenses = useMemo(() => 
    licenses.filter(l => l.id.includes('giam-khao') || l.name.toLowerCase().includes('giám khảo') || GK_NAMES.includes(l.name.toLowerCase())),
  [licenses]);

  const stats = useMemo(() => {
    let totalSubjects = 0, totalQuestions = 0;
    gkLicenses.forEach(lic => {
      totalSubjects += lic.subjects.length;
      lic.subjects.forEach(s => { totalQuestions += s.questions.length; });
    });
    return { totalSubjects, totalQuestions };
  }, [gkLicenses]);

  // ANIMATION VARIANTS
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  if (gkLicenses.length === 0) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-8 bg-card text-card-foreground border border-border rounded-2xl text-center shadow-sm max-w-md w-full relative overflow-hidden"
        >
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 border border-primary/20">
            <Award className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Chưa có dữ liệu Giám khảo</h2>
          <p className="text-sm text-muted-foreground mb-6">Hệ thống chưa tìm thấy bộ đề nào dành riêng cho cấp bậc Giám khảo của bạn.</p>
          <button 
            onClick={onBack} 
            className="w-full min-h-[44px] py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại trang chủ
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* HEADER SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <button 
            onClick={onBack} 
            className="group flex items-center gap-2 px-4 py-2 bg-card hover:bg-muted border border-border rounded-xl text-sm font-medium transition-all shadow-sm z-10 self-start md:self-auto min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="text-foreground">Trở về</span>
          </button>

          <div className="flex flex-col items-center justify-center text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-sm mb-3">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Tập Huấn Giám Khảo
            </h1>
          </div>
          
          <div className="hidden md:block w-24" /> {/* Spacer for flex balance */}
        </motion.div>

        {/* STATS BANNER */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-border">
            <div className="flex flex-col items-center justify-center pt-4 sm:pt-0">
              <Users className="w-5 h-5 text-primary mb-1.5 opacity-80" />
              <div className="text-2xl md:text-3xl font-extrabold text-foreground tabular-nums">{gkLicenses.length}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">Chương trình</div>
            </div>
            <div className="flex flex-col items-center justify-center pt-4 sm:pt-0">
              <BookOpen className="w-5 h-5 text-primary mb-1.5 opacity-80" />
              <div className="text-2xl md:text-3xl font-extrabold text-foreground tabular-nums">{stats.totalSubjects}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">Môn học</div>
            </div>
            <div className="flex flex-col items-center justify-center pt-4 sm:pt-0">
              <FileText className="w-5 h-5 text-primary mb-1.5 opacity-80" />
              <div className="text-2xl md:text-3xl font-extrabold text-foreground tabular-nums">{stats.totalQuestions}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">Câu hỏi</div>
            </div>
          </div>
        </motion.div>

        {/* LIST OF LICENSES */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {gkLicenses.map((lic) => {
            const subjectCount = lic.subjects.length;
            const questionCount = lic.subjects.reduce((s, sub) => s + sub.questions.length, 0);
            
            return (
              <motion.button
                key={lic.id}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSelectLicense(lic)}
                className="group relative flex flex-col text-left bg-card text-card-foreground border border-border rounded-2xl overflow-hidden shadow-sm hover:border-primary/60 hover:shadow-md transition-all p-6 md:p-8"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform duration-200">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200 text-muted-foreground">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-3 leading-snug group-hover:text-primary transition-colors">
                  {lic.name}
                </h3>
                
                <div className="mt-auto pt-4 flex flex-wrap items-center gap-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-semibold text-foreground tabular-nums">{subjectCount} môn</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-border hidden sm:block" />
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-semibold text-foreground tabular-nums">{questionCount} câu hỏi</span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default GiamKhaoSelectionScreen;
