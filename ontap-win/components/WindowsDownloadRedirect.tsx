import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WindowsDownloadRedirect: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect logic or simple message
        const timer = setTimeout(() => {
            navigate('/download');
        }, 2000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="flex items-center justify-center h-screen">
            <p>Đang chuyển hướng đến trang tải xuống...</p>
        </div>
    );
};

export default WindowsDownloadRedirect;
