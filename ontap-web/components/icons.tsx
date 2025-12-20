import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

// --- NEW 3D ICONS ---

export const ClipboardListIcon3D: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const { theme } = useTheme();
    if (theme === 'tri-an') {
        return <img src="https://i.postimg.cc/8PDn1wfM/favicon.png" alt="Online Exam Icon" {...props as any} />;
    }
    if (theme === 'noel') {
        return <img src="/assets/img/gift3.png" alt="Gift Icon" {...props as any} className="h-16 w-16 object-contain" />;
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path fillRule="evenodd" d="M3.75 4.5a3 3 0 00-3 3v10.5a3 3 0 003 3h16.5a3 3 0 003-3V7.5a3 3 0 00-3-3H3.75zm.75 4.5a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H5.25a.75.75 0 01-.75-.75zm0 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm0 2.25a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75z" clipRule="evenodd" />
        </svg>
    );
};

export const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


export const PaletteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm.25 4.5a.75.75 0 00-1.5 0v5.337a2.25 2.25 0 00-1.5 2.063v.75a.75.75 0 001.5 0v-.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 001.5 0v-.75a2.25 2.25 0 00-1.5-2.063V6.75z" />
        <path d="M6.163 15.25a.75.75 0 011.06-1.06l1.25 1.25a.75.75 0 01-1.06 1.06l-1.25-1.25zm10.617 0a.75.75 0 011.06 1.06l-1.25 1.25a.75.75 0 01-1.06 1.06l1.25-1.25z" />
    </svg>
);


export const CheckIcon3D: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const { theme } = useTheme();
    if (theme === 'noel') {
         // Dùng ngôi sao vàng hoặc chuông nhỏ cho dấu check cũng được, nhưng để nguyên SVG hoặc dùng ball.png
         // Dùng ball.png cho lạ mắt
         return <img src="/assets/img/ball.png" alt="Check" {...props as any} className={`${props.className} object-contain`} />;
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
    );
};

export const XIcon3D: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
    </svg>
);

export const ClockIcon3D: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
    </svg>
);

export const ArrowLeftIcon3D: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-4.28 9.22a.75.75 0 000 1.06l3 3a.75.75 0 101.06-1.06L10.81 12l1.47-1.47a.75.75 0 10-1.06-1.06l-3 3z" clipRule="evenodd" />
    </svg>
);

export const ChevronRightIcon3D: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-3 3a.75.75 0 01-1.06-1.06L14.44 12l-2.22-2.22a.75.75 0 011.06-1.06l3 3z" clipRule="evenodd" />
    </svg>
);

export const UserIcon3D: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const { theme } = useTheme();
    if (theme === 'tri-an') {
        return <img src="https://i.postimg.cc/J0JwWn5p/Mattahan-Buuf-One-of-those-ugly-pens-you-just-find-lying-around-128.png" alt="Pen Icon" {...props as any} />;
    }
    if (theme === 'noel') {
        return <img src="/assets/img/celebrate.png" alt="Santa" {...props as any} className={`${props.className} object-contain`} />;
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM9 12a3 3 0 116 0 3 3 0 01-6 0zm-2.121 4.212a.75.75 0 01.688-1.228 5.253 5.253 0 018.866 0 .75.75 0 11-.688 1.228 3.753 3.753 0 00-7.49 0z" clipRule="evenodd" />
        </svg>
    );
};

export const ArrowPathIcon3D: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-4.5a.75.75 0 000 1.5h6a.75.75 0 00.75-.75V4.5a.75.75 0 00-1.5 0v2.253a9 9 0 00-15.06 4.042.75.75 0 00.75.75h1.5a.75.75 0 00.75-.75zM19.245 13.941a7.5 7.5 0 01-12.548 3.364l-1.903-1.903h4.5a.75.75 0 000-1.5h-6a.75.75 0 00-.75.75v6a.75.75 0 001.5 0v-2.253a9 9 0 0015.06-4.042.75.75 0 00-.75-.75h-1.5a.75.75 0 00-.75.75z" clipRule="evenodd" />
    </svg>
);

export const HelmIcon3D: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const { theme } = useTheme();
    if (theme === 'tri-an') {
        return <img src="https://i.postimg.cc/xjbVmxDW/Oxygen-Icons-org-Oxygen-Categories-applications-education-university-256.png" alt="Graduation Cap Icon" {...props as any} />;
    }
    if (theme === 'noel') {
        return <img src="/assets/img/home.png" alt="Home Icon" {...props as any} className={`${props.className} object-contain`} />;
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm0 3a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z"/>
            <path d="M12 3v2m0 14v2M3 12h2m14 0h-2m-8-8L6.414 5.414m11.172 11.172L16.243 15.12m0-9.706l-1.121 1.121M5.414 17.586L6.536 16.464"/>
        </svg>
    );
};

export const AnchorIcon3D: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const { theme } = useTheme();
    if (theme === 'tri-an') {
        return <img src="https://i.postimg.cc/66GxZjxN/school-114359.png" alt="School Bag Icon" {...props as any} />;
    }
    if (theme === 'noel') {
        return <img src="/assets/img/bell.png" alt="Bell Icon" {...props as any} className={`${props.className} object-contain`} />;
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M12 2a1 1 0 011 1v7.683a4.502 4.502 0 012.722 2.054 3 3 0 01-1.33 3.963 3.003 3.003 0 01-4.783-3.963A4.502 4.502 0 0111 10.683V3a1 1 0 011-1zm-3.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm7 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/>
            <path d="M12 22a8.956 8.956 0 01-6-2.583V18h12v1.417A8.956 8.956 0 0112 22z"/>
        </svg>
    );
};

export const EngineerIcon3D: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const { theme } = useTheme();
    if (theme === 'tri-an') {
        return <img src="https://i.postimg.cc/h47RmyWN/Mattahan-Buuf-They-reply-technosorcery-128.png" alt="Wrench Icon" {...props as any} />;
    }
    if (theme === 'noel') {
        return <img src="/assets/img/gift4.png" alt="Gift Icon" {...props as any} className={`${props.className} object-contain`} />;
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.981A10.503 10.503 0 0112 21a10.5 10.5 0 01-10.5-10.5c0-4.368 2.667-8.162 6.43-9.742a.75.75 0 01.819.162z" clipRule="evenodd"/>
            <path d="M12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"/>
        </svg>
    );
};

export const CaptainIcon3D: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const { theme } = useTheme();
    if (theme === 'tri-an') {
        return <img src="https://i.postimg.cc/zvWm1BFk/book-512x512-35977.png" alt="Book Icon" {...props as any} />;
    }
    if (theme === 'noel') {
        return <img src="/assets/img/hat.png" alt="Hat Icon" {...props as any} className={`${props.className} object-contain`} />;
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M12 2L3 8v2h18V8l-9-6zm-1.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm3 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/>
            <path d="M4 14v6h16v-6H4zm6 2h4v2h-4v-2z"/>
        </svg>
    );
};

export const LifebuoyIcon3D: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const { theme } = useTheme();
    if (theme === 'tri-an') {
        return <img src="https://i.postimg.cc/2yvpf67d/Mattahan-Buuf-A-Proper-Journal-Icon-128.png" alt="Journal Icon" {...props as any} />;
    }
    if (theme === 'noel') {
        return <img src="/assets/img/gift5.png" alt="Gift Icon" {...props as any} className={`${props.className} object-contain`} />;
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path fillRule="evenodd" d="M12 2a10 10 0 100 20 10 10 0 000-20zM4 12a8 8 0 1116 0 8 8 0 01-16 0z" clipRule="evenodd" />
            <path d="M16.95 7.05l-1.414 1.414-2.122-2.122 1.414-1.414 2.122 2.122zm-9.9 9.9l1.414-1.414 2.122 2.122-1.414 1.414-2.122-2.122zm9.9 0l-1.414-1.414-2.122 2.122 1.414 1.414 2.122-2.122zm-9.9-9.9l1.414 1.414-2.122 2.122L5.636 9.172l2.122-2.122z"/>
        </svg>
    );
};

export const CertificateIcon3D: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const { theme } = useTheme();
    if (theme === 'tri-an') {
        return <img src="https://i.postimg.cc/2yvpf67d/Mattahan-Buuf-A-Proper-Journal-Icon-128.png" alt="Journal Icon" {...props as any} />;
    }
    if (theme === 'noel') {
        return <img src="/assets/img/star-gold.png" alt="Star Icon" {...props as any} className={`${props.className} object-contain`} />;
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path fillRule="evenodd" d="M8.25 2.25A.75.75 0 019 3v.257a3.75 3.75 0 013 0V3a.75.75 0 011.5 0v.257a3.75 3.75 0 013 0V3a.75.75 0 01.75.75h-.008v.016c.361.32.622.754.74 1.232A23.953 23.953 0 0112 6c-2.305 0-4.52-.42-6.502-1.195a2.5 2.5 0 01.74-1.232H6a.75.75 0 01.75-.75h1.5zm-2.784 4.542a25.474 25.474 0 0013.068 0 .75.75 0 01.443.923 23.92 23.92 0 01-13.954 0 .75.75 0 01.443-.923zM8.25 10.5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zm3.75 0a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zm3.75 0a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
            <path d="M4.145 9.421a.75.75 0 01.558-.923 25.483 25.483 0 0114.594 0 .75.75 0 01.558.923l-.36.99a25.01 25.01 0 01-14.832 0l-.36-.99z" />
            <path fillRule="evenodd" d="M3 15.75A2.25 2.25 0 015.25 13.5h13.5A2.25 2.25 0 0121 15.75v3A2.25 2.25 0 0118.75 21H5.25A2.25 2.25 0 013 18.75v-3z" clipRule="evenodd" />
        </svg>
    );
};

export const TrophyIcon3D: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const { theme } = useTheme();
    if (theme === 'tri-an') {
        return <img src="https://i.postimg.cc/xjbVmxDW/Oxygen-Icons-org-Oxygen-Categories-applications-education-university-256.png" alt="Graduation Cap Icon" {...props as any} />;
    }
    if (theme === 'noel') {
        return <img src="/assets/img/star-gold.png" alt="Gold Star Icon" {...props as any} className={`${props.className} object-contain`} />;
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path fillRule="evenodd" d="M11.25 4.5A.75.75 0 0112 5.25v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0111.25 4.5zM12.75 6a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0V6zM11.25 7.5A.75.75 0 0112 8.25v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0111.25 7.5zM12.75 9a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0V9z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM6.262 6.072a8.25 8.25 0 1011.476 11.476A8.25 8.25 0 006.262 6.072zM12 18.75a.75.75 0 01-.75-.75V15a.75.75 0 011.5 0v3a.75.75 0 01-.75.75z" clipRule="evenodd" />
            <path d="M14.25 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
    );
};

export const BookOpenIcon3D: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const { theme } = useTheme();
    if (theme === 'tri-an') {
        return <img src="https://i.postimg.cc/FFJXSWXv/study-learning-knowledge-education-book-notebook-icon-256768.png" alt="Book and Glasses Icon" {...props as any} />;
    }
    if (theme === 'noel') {
        return <img src="/assets/img/gift1.png" alt="Gift Icon" {...props as any} className={`${props.className} object-contain`} />;
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M11.25 4.533A9.708 9.708 0 006 3.75c-1.052 0-2.062.18-3 .512V17.25a8.987 8.987 0 013.75-.82V9.75a.75.75 0 011.5 0v7.5a.75.75 0 01-1.5 0V15a6.726 6.726 0 00-3-.585V18.75C3.393 18.932 3.69 19.1 4 19.29c2.023.784 4.18 1.093 6.364 1.294a.75.75 0 00.872-.725V4.534z" />
            <path d="M12.75 4.533V19.86a.75.75 0 00.872.725 49.33 49.33 0 006.364-1.294c.31-.19.607-.358.914-.54V5.25c-1.084-.308-2.18-.46-3.25-.46-1.637 0-3.235.32-4.75.922V4.534z" />
        </svg>
    );
};

export const PracticeIcon3D: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    const { theme } = useTheme();
    if (theme === 'tri-an') {
        return <img src="https://i.postimg.cc/kG8rd4vv/Limpa-Curriculum-Vitae-Education-256.png" alt="Blackboard Icon" {...props as any} />;
    }
    if (theme === 'noel') {
        return <img src="/assets/img/gift2.png" alt="Gift Icon" {...props as any} className={`${props.className} object-contain`} />;
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path fillRule="evenodd" d="M2.25 6a3 3 0 013-3h13.5a3 3 0 013 3v12a3 3 0 01-3-3H5.25a3 3 0 01-3-3V6zm3.75 3a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H7.5a.75.75 0 01-.75-.75zM7.5 12a.75.75 0 000 1.5h6a.75.75 0 000-1.5h-6z" clipRule="evenodd" />
        </svg>
    );
};


// --- OLD ICON (Kept for compatibility if needed) ---
export const InformationCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
  </svg>
);