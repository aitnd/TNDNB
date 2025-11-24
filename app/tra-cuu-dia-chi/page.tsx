'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Định nghĩa kiểu dữ liệu cho một dòng địa chỉ
interface AddressRecord {
  tinhCu: string;
  huyenCu: string;
  xaCu: string;
  tinhMoi: string;
  huyenMoi: string;
  xaMoi: string;
  nghiQuyet?: string;
  ngayHieuLuc?: string;
}

export default function TraCuuDiaChiPage() {
  // --- 1. STATE QUẢN LÝ DỮ LIỆU ---
  const [data, setData] = useState<AddressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State cho các ô chọn (Dropdown)
  const [selectedTinh, setSelectedTinh] = useState('');
  const [selectedHuyen, setSelectedHuyen] = useState('');
  const [selectedXa, setSelectedXa] = useState('');
  
  // State kết quả tìm thấy
  const [result, setResult] = useState<AddressRecord | null>(null);

  // --- 2. HÀM TẢI DỮ LIỆU TỪ FILE CSV ---
  useEffect(() => {
    // Hàm đọc file CSV (giả lập file Excel anh đã export ra CSV)
    // Anh nhớ đổi tên file CSV trong thư mục public/tra-cuu thành 'data.csv' cho gọn nhé, 
    // hoặc sửa đường dẫn bên dưới đúng tên file hiện tại.
    const fetchData = async () => {
      try {
        // Đường dẫn file CSV trong thư mục public
        const response = await fetch('/tra-cuu/sap nhap.xlsx - DATA.csv'); 
        const text = await response.text();
        
        // Parse CSV đơn giản (tách dòng, tách dấu phẩy)
        // Lưu ý: Nếu file CSV có dấu phẩy trong nội dung, cần thư viện xịn hơn như PapaParse.
        // Ở đây em làm code nhẹ (lightweight) giả định CSV chuẩn.
        const rows = text.split('\n').slice(1); // Bỏ dòng tiêu đề
        const parsedData: AddressRecord[] = rows.map(row => {
          const cols = row.split(',').map(c => c.trim().replace(/^"|"$/g, '')); // Xóa dấu ngoặc kép thừa
          if (cols.length < 6) return null;
          return {
            tinhCu: cols[0],
            huyenCu: cols[1],
            xaCu: cols[2],
            tinhMoi: cols[3],
            huyenMoi: cols[4],
            xaMoi: cols[5],
            nghiQuyet: cols[6] || '',
            ngayHieuLuc: cols[7] || ''
          };
        }).filter(Boolean) as AddressRecord[];

        setData(parsedData);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- 3. LOGIC LỌC DỮ LIỆU ---
  
  // Lấy danh sách Tỉnh (duy nhất)
  const listTinh = Array.from(new Set(data.map(item => item.tinhCu))).sort();

  // Lấy danh sách Huyện (theo Tỉnh đã chọn)
  const listHuyen = Array.from(new Set(
    data.filter(item => item.tinhCu === selectedTinh).map(item => item.huyenCu)
  )).sort();

  // Lấy danh sách Xã (theo Tỉnh & Huyện đã chọn)
  const listXa = Array.from(new Set(
    data.filter(item => item.tinhCu === selectedTinh && item.huyenCu === selectedHuyen).map(item => item.xaCu)
  )).sort();

  // Hàm xử lý khi bấm nút "Tra cứu" (hoặc tự động hiện khi chọn xong xã)
  useEffect(() => {
    if (selectedTinh && selectedHuyen && selectedXa) {
      const found = data.find(item => 
        item.tinhCu === selectedTinh && 
        item.huyenCu === selectedHuyen && 
        item.xaCu === selectedXa
      );
      setResult(found || null);
    } else {
      setResult(null);
    }
  }, [selectedTinh, selectedHuyen, selectedXa, data]);


  // --- 4. GIAO DIỆN (UI) ---
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Header trang */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          Tra Cứu Thông Tin Địa Giới Hành Chính
        </h1>
        <p className="text-gray-600">
          Cập nhật thông tin thay đổi địa chỉ sau sáp nhập các đơn vị hành chính.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CỘT TRÁI: FORM NHẬP LIỆU */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Thông tin địa chỉ cũ</h2>
          </div>

          <div className="space-y-4">
            {/* Chọn Tỉnh */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh / Thành phố</label>
              <select 
                value={selectedTinh}
                onChange={(e) => {
                  setSelectedTinh(e.target.value);
                  setSelectedHuyen('');
                  setSelectedXa('');
                }}
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm"
                disabled={loading}
              >
                <option value="">-- Chọn Tỉnh/TP --</option>
                {listTinh.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Chọn Huyện */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quận / Huyện</label>
              <select 
                value={selectedHuyen}
                onChange={(e) => {
                  setSelectedHuyen(e.target.value);
                  setSelectedXa('');
                }}
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm disabled:bg-gray-100"
                disabled={!selectedTinh}
              >
                <option value="">-- Chọn Quận/Huyện --</option>
                {listHuyen.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>

            {/* Chọn Xã */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phường / Xã</label>
              <select 
                value={selectedXa}
                onChange={(e) => setSelectedXa(e.target.value)}
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm disabled:bg-gray-100"
                disabled={!selectedHuyen}
              >
                <option value="">-- Chọn Phường/Xã --</option>
                {listXa.map(x => <option key={x} value={x}>{x}</option>)}
              </select>
            </div>
          </div>

          {loading && <p className="text-center text-sm text-gray-500 mt-4">Đang tải dữ liệu...</p>}
        </div>

        {/* CỘT PHẢI: KẾT QUẢ */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg border border-green-100 p-6 h-full flex flex-col justify-center animate-fade-in-up">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-green-800">Kết quả chuyển đổi</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Đơn vị hành chính mới</p>
                  <p className="text-lg font-bold text-gray-800">
                    {result.xaMoi}, {result.huyenMoi}, {result.tinhMoi}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/60 p-3 rounded-lg border border-green-50">
                    <p className="text-xs text-gray-500">Căn cứ pháp lý</p>
                    <p className="font-medium text-gray-700">{result.nghiQuyet || "Đang cập nhật"}</p>
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg border border-green-50">
                    <p className="text-xs text-gray-500">Ngày hiệu lực</p>
                    <p className="font-medium text-gray-700">{result.ngayHieuLuc || "Đang cập nhật"}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-green-200 text-center">
                   <p className="text-green-700 italic text-sm">
                     "Địa chỉ của bạn đã được cập nhật thành công theo quy định mới nhất."
                   </p>
                </div>
              </div>
            </div>
          ) : (
            /* TRẠNG THÁI CHỜ (EMPTY STATE) */
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col items-center justify-center text-center opacity-70">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Vui lòng chọn đầy đủ thông tin bên trái để xem kết quả.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center mt-12 text-sm text-gray-400">
        <p>Dữ liệu được cập nhật từ các Nghị quyết của Ủy ban Thường vụ Quốc hội.</p>
      </div>
    </div>
  );
}