
import React from 'react';
import { FaAndroid, FaDownload, FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';

export default function DownloadAppPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 font-sans text-gray-800">
            <div className="max-w-2xl mx-auto mt-10 bg-white rounded-2xl shadow-xl overflow-hidden">

                {/* Header Section */}
                <div className="bg-[#0056b3] p-8 text-center text-white">
                    <div className="mx-auto bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                        <FaAndroid className="text-4xl text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Tải Ứng Dụng Ôn Tập</h1>
                    <p className="text-blue-100">Học mọi lúc, mọi nơi ngay trên điện thoại của bạn</p>
                </div>

                {/* Content Section */}
                <div className="p-8 space-y-8">

                    {/* Main Download Button */}
                    {/* Main Download Button */}
                    <div className="text-center flex flex-col items-center gap-4">
                        <a
                            href="https://drive.google.com/file/d/1z0eAPNfDbpg2-T6BGrnVEgRbsF2tK7tQ/view?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                        >
                            <FaDownload className="animate-bounce" />
                            Tải File APK (Cài Ngay)
                        </a>

                        <p className="text-sm text-gray-500 mt-1 italic">
                            Phiên bản 1.5 • Cập nhật mới nhất
                        </p>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Guide Section */}
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-6">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-orange-800 mb-3">
                            <FaInfoCircle />
                            Hướng dẫn cài đặt
                        </h3>
                        <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
                            <li>Tải file <strong>.apk</strong> ở trên về máy.</li>
                            <li>Mở file vừa tải lên.</li>
                            <li>Nếu điện thoại hỏi bảo mật, chọn <strong>&quot;Cài đặt&quot;</strong> (hoặc &quot;Cho phép từ nguồn này&quot;).</li>
                            <li>Đợi cài xong và mở App lên học thôi! 🎉</li>
                        </ol>
                    </div>

                    {/* Footer Link */}
                    <div className="text-center pt-4">
                        <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
                            ← Quay lại trang chủ
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
