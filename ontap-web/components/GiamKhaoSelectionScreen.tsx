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
          className="p-10 bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-3xl text-center shadow-2xl max-w-md w-full relative overflow-hidden"
        >
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
          <div className="mx-auto w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
            <Award className="h-12 w-12 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Chưa có dữ liệu Giám khảo</h2>
          <p className="text-muted-foreground mb-8">Hệ thống chưa tìm thấy bộ đề nào dành riêng cho cấp bậc Giám khảo của bạn.</p>
          <button 
            onClick={onBack} 
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
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
          className="relative mb-12 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <button 
            onClick={onBack} 
            className="group flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-white/10 border border-black/5 dark:border-white/10 rounded-full text-sm font-medium transition-all shadow-sm backdrop-blur-md z-10 self-start md:self-auto"
          >
            <ArrowLeft className="w-4 h-4 text-foreground/70 group-hover:text-foreground transition-colors" />
            <span className="text-foreground/80 group-hover:text-foreground">Trở về</span>
          </button>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20 mb-4 ring-4 ring-white dark:ring-background">
              <ShieldCheck className="w-8 h-8 text-white relative z-10" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-500 dark:from-amber-400 dark:to-orange-400">
              Tập Huấn Giám Khảo
            </h1>
          </div>
          
          <div className="hidden md:block w-24" /> {/* Spacer for flex balance */}
        </motion.div>

        {/* STATS BANNER - GLASSMORPHISM */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-32 md:mt-24 mb-12 bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl p-6 shadow-xl shadow-black/5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-black/5 dark:divide-white/10">
            <div className="flex flex-col items-center justify-center pt-4 sm:pt-0">
              <Users className="w-6 h-6 text-amber-500 mb-2 opacity-80" />
              <div className="text-3xl font-black text-foreground">{gkLicenses.length}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">Chương trình</div>
            </div>
            <div className="flex flex-col items-center justify-center pt-4 sm:pt-0">
              <BookOpen className="w-6 h-6 text-blue-500 mb-2 opacity-80" />
              <div className="text-3xl font-black text-foreground">{stats.totalSubjects}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">Môn học</div>
            </div>
            <div className="flex flex-col items-center justify-center pt-4 sm:pt-0">
              <FileText className="w-6 h-6 text-emerald-500 mb-2 opacity-80" />
              <div className="text-3xl font-black text-foreground">{stats.totalQuestions}</div>
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
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectLicense(lic)}
                className="group relative flex flex-col text-left bg-white dark:bg-card border border-black/5 dark:border-white/10 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300"
              >
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-amber-500/10 blur-3xl rounded-full group-hover:bg-amber-500/20 transition-all duration-500" />
                
                <div className="p-8 relative z-10 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 dark:from-amber-500/10 dark:to-orange-500/10 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                      <Star className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 text-muted-foreground z-20">
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-3 leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {lic.name}
                  </h3>
                  
                  <div className="mt-auto pt-6 flex flex-wrap items-center gap-4 border-t border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{subjectCount} môn</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-black/20 dark:bg-white/20 hidden sm:block" />
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{questionCount} câu hỏi</span>
                    </div>
                  </div>
                </div>
                
                {/* Bottom line active indicator */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-amber-400 to-orange-500 group-hover:w-full transition-all duration-500" />
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default GiamKhaoSelectionScreen;

