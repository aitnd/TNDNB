import React, { useState } from 'react';
import { UserIcon3D, ArrowLeftIcon3D } from './icons';
import { triggerHaptic } from '../utils/nativeUX';

interface NameInputScreenProps {
  onNameSubmit: (name: string) => void;
  onBack: () => void;
}

const NameInputScreen: React.FC<NameInputScreenProps> = ({ onNameSubmit, onBack }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName) {
      triggerHaptic('success');
      onNameSubmit(trimmedName);
    } else {
      triggerHaptic('medium');
      onNameSubmit('Học viên');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 md:p-6 animate-slide-in-right pb-24 h-full flex flex-col justify-center">
      <div className="relative text-center mb-8">
        <button 
          onClick={() => { triggerHaptic('light'); onBack(); }} 
          className="absolute left-0 top-0 bg-card p-2 rounded-xl shadow-sm border border-border active:scale-95 transition-all text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-muted"
          aria-label="Quay lại"
        >
          <ArrowLeftIcon3D className="h-6 w-6 text-primary" />
        </button>
        
        <div className="bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-sm">
          <UserIcon3D className="h-12 w-12 text-primary" />
        </div>
        
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-tight">Chào mừng Anh/Chị!</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2 font-medium">
          Cho tôi biết tên để chúng ta bắt đầu ôn luyện nhé.
        </p>
      </div>

      <div className="bg-card text-card-foreground p-6 md:p-8 rounded-2xl shadow-sm border border-border">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 ml-1">
              Họ và tên học viên
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Văn A"
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground text-base font-semibold placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors shadow-inner"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="w-full min-h-[46px] bg-primary text-primary-foreground font-semibold rounded-xl shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all"
          >
            Bắt đầu ngay
          </button>
          <p className="text-center text-xs text-muted-foreground mt-4 font-medium">Dữ liệu được lưu trữ an toàn trên thiết bị của bạn</p>
        </form>
      </div>
    </div>
  );
};

export default NameInputScreen;
