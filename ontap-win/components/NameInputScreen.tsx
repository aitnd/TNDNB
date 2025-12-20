import React, { useState } from 'react';
import { UserIcon3D, ArrowLeftIcon3D } from './icons';

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
      onNameSubmit(trimmedName);
    } else {
      onNameSubmit('Học viên');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 animate-slide-in-right">
      <div className="text-center mb-10">
        <UserIcon3D className="h-20 w-20 mx-auto text-primary mb-4" />

        <div className="relative flex justify-center items-center">
            <div className="absolute left-0">
               <button 
                 onClick={onBack} 
                 className="bg-card/50 p-3 rounded-full shadow-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-300 transform hover:scale-110"
                 aria-label="Quay lại"
               >
                   <ArrowLeftIcon3D className="h-10 w-10 text-primary" />
               </button>
            </div>
            <h1 className="text-4xl font-bold text-foreground">Thông tin của anh/chị</h1>
        </div>
        
        <p className="text-lg text-muted-foreground mt-2">
          Nhập tên để tôi có thể lưu lại tiến độ học tập cho anh/chị.
        </p>
      </div>

      <div className="bg-card p-8 rounded-2xl shadow-lg">
        <form onSubmit={handleSubmit}>
          <label htmlFor="name" className="block text-sm font-medium text-card-foreground mb-2">
            Tên của anh/chị
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Nguyễn Văn A (có thể bỏ trống)"
            className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-300"
            autoFocus
          />
          <button
            type="submit"
            className="mt-6 w-full bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-ring transition-all duration-300"
          >
            Xác nhận
          </button>
        </form>
      </div>
    </div>
  );
};

export default NameInputScreen;