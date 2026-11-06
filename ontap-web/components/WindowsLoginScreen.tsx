import React from 'react';
import { HelmIcon3D } from './icons';

const WindowsLoginScreen: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background text-foreground px-4 py-8">
            <div className="max-w-md w-full bg-card text-card-foreground border border-border rounded-2xl shadow-sm p-8 text-center">
                <HelmIcon3D className="h-16 w-16 mx-auto text-primary mb-4" />
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">Đăng nhập Windows App</h2>
                <p className="text-sm text-muted-foreground mb-6">Vui lòng đăng nhập để tiếp tục ôn tập và sát hạch.</p>
                <button className="w-full min-h-[44px] bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
                    Đăng nhập bằng Google
                </button>
            </div>
        </div>
    );
};

export default WindowsLoginScreen;
