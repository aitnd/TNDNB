import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';

interface FooterProps {
  onVersionClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onVersionClick }) => {
  const versionText = "Phiên bản v3.5.0 - Chúc anh/chị ôn thi hiệu quả!";

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 flex h-14 w-full items-center justify-between border-t border-border bg-card/80 px-4 backdrop-blur-sm sm:px-6">
      <button
        onClick={onVersionClick}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {versionText}
      </button>
      <ThemeSwitcher />
    </footer>
  );
};

export default Footer;
