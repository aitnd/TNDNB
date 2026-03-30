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
    <div className="w-full max-w-md mx-auto p-6 animate-slide-in-right pb-24 h-full flex flex-col justify-center">
      <div className="relative text-center mb-12">
        <button 
          onClick={() => { triggerHaptic('light'); onBack(); }} 
          className="absolute left-0 top-0 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 active:scale-90 transition-all font-bold text-slate-600"
          aria-label="Quay lại"
        >
            <ArrowLeftIcon3D className="h-8 w-8 text-slate-800 dark:text-white" />
        </button>
        
        <div className="bg-indigo-100 dark:bg-indigo-900/30 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <UserIcon3D className="h-14 w-14 text-indigo-600" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tight leading-tight">Chào mừng Anh/Chị!</h1>
        <p className="text-base text-slate-500 mt-2 font-medium">
          Cho tôi biết tên để chúng ta bắt đầu ôn luyện nhé.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
              Họ và tên học viên
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Văn A"
              className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-white text-lg font-bold placeholder:text-slate-300 focus:outline-none focus:border-indigo-500 transition-all duration-300 shadow-inner"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="w-full py-5 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-500/30 hover:bg-indigo-700 active:scale-95 transition-all"
          >
            Bắt đầu ngay
          </button>
          <p className="text-center text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest">Dữ liệu được lưu trữ an toàn trên máy</p>
        </form>
      </div>
    </div>
  );
};

export default NameInputScreen;