import React from 'react';

const WindowsLoginScreen: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md text-center">
                <h2 className="text-2xl font-bold mb-4">Đăng nhập Windows App</h2>
                <p className="mb-4">Vui lòng đăng nhập để tiếp tục.</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Đăng nhập bằng Google</button>
            </div>
        </div>
    );
};

export default WindowsLoginScreen;
