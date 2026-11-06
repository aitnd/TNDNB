import React from 'react';
import { HelmIcon3D } from './icons';
import { CheckCircle2, BookOpen, ShieldCheck, Award } from 'lucide-react';

export interface WelcomeModalProps {
  onStart: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onStart, onLoginClick, onRegisterClick }) => {
  return (
    <div className="min-h-[78vh] flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full bg-card text-card-foreground border border-border rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Cột trái (7/12): Thông điệp học thuật & Hành động chính */}
        <div className="md:col-span-7 p-6 md:p-10 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-5">
              <HelmIcon3D className="h-4 w-4 text-primary" />
              <span>Hệ thống Đào tạo &amp; Sát hạch Thủy nội địa</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
              Ôn tập Trắc nghiệm Phương tiện Thủy nội địa
            </h1>

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
              Ngân hàng câu hỏi chuẩn hóa theo chương trình đào tạo thuyền viên, người lái phương tiện thủy nội địa kèm chế độ thi thử sát đề thực tế.
            </p>

            <ul className="space-y-2.5 mb-8 text-sm text-foreground">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>Ôn luyện theo từng môn chuyên ngành có giải thích trực quan</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>Tự động lưu câu hay sai để ôn tập củng cố trọng tâm</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>Hỗ trợ làm bài ngoại tuyến (Offline-First) tốc độ cao</span>
              </li>
            </ul>
          </div>

          <div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onStart}
                className="min-h-[46px] px-6 py-3 rounded-xl font-semibold text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                Bắt đầu ôn tập ngay
              </button>
              <button
                onClick={onLoginClick}
                className="min-h-[46px] px-6 py-3 rounded-xl font-semibold text-base border border-border bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
              >
                Đăng nhập học viên
              </button>
            </div>
            <div className="mt-4">
              <button
                onClick={onRegisterClick}
                className="text-sm font-medium text-primary hover:underline min-h-[36px]"
              >
                Chưa có tài khoản học viên? Đăng ký ngay →
              </button>
            </div>
          </div>
        </div>

        {/* Cột phải (5/12): Thống kê học vụ chuẩn tabular-nums */}
        <div className="md:col-span-5 bg-muted/50 border-t md:border-t-0 md:border-l border-border p-6 md:p-8 flex flex-col justify-between gap-6">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Thông số Hệ thống Học liệu
            </h2>
            <div className="space-y-3">
              <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3.5 shadow-xs">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground tabular-nums">100%</p>
                  <p className="text-xs text-muted-foreground">Bám sát bộ câu hỏi sát hạch hiện hành</p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3.5 shadow-xs">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground tabular-nums">30 câu / đề</p>
                  <p className="text-xs text-muted-foreground">Cấu trúc đề thi thử chuẩn thời gian thực</p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3.5 shadow-xs">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground tabular-nums">24/7</p>
                  <p className="text-xs text-muted-foreground">Đồng bộ lịch sử làm bài đa thiết bị</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border text-xs text-muted-foreground leading-relaxed">
            Đơn vị đào tạo: <strong className="text-foreground font-semibold">Công ty CP Tư vấn và Giáo dục Ninh Bình</strong> • Hotline: <span className="font-semibold text-foreground tabular-nums">0229 628 2969</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
