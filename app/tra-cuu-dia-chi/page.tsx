'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DATABASE, AddressRecord } from './data';

export default function TraCuuDiaChiPage() {
  const [data] = useState<AddressRecord[]>(DATABASE); 
  
  // --- STATE QUẢN LÝ ---
  
  // 1. Tỉnh
  const [selectedTinh, setSelectedTinh] = useState('');
  const [searchTinhTerm, setSearchTinhTerm] = useState(''); // Từ khóa tìm Tỉnh
  const [showTinhSuggestions, setShowTinhSuggestions] = useState(false);
  
  // 2. Xã (Giờ cũng có tìm kiếm luôn)
  const [selectedXa, setSelectedXa] = useState('');
  const [searchXaTerm, setSearchXaTerm] = useState(''); // Từ khóa tìm Xã
  const [showXaSuggestions, setShowXaSuggestions] = useState(false);
  
  // 3. Kết quả
  const [result, setResult] = useState<AddressRecord | null>(null);

  // Ref để xử lý click ra ngoài
  const wrapperTinhRef = useRef<HTMLDivElement>(null);
  const wrapperXaRef = useRef<HTMLDivElement>(null);

  // --- LOGIC LỌC DỮ LIỆU ---
  
  // A. Lọc Tỉnh
  const listTinhFull = Array.from(new Set(data.map(i => i.tinhCu))).sort();
  const listTinhFiltered = listTinhFull.filter(t => 
    t.toLowerCase().includes(searchTinhTerm.toLowerCase())
  );

  // B. Lọc Xã (Theo Tỉnh đã chọn + Từ khóa tìm kiếm)
  const listXaFull = Array.from(new Set(
    data.filter(i => i.tinhCu === selectedTinh).map(i => i.xaCu)
  )).sort();
  
  const listXaFiltered = listXaFull.filter(x => 
    x.toLowerCase().includes(searchXaTerm.toLowerCase())
  );

  // C. Tìm kết quả
  useEffect(() => {
    if (selectedTinh && selectedXa) {
      const found = data.find(i => i.tinhCu === selectedTinh && i.xaCu === selectedXa);
      setResult(found || null);
    } else {
      setResult(null);
    }
  }, [selectedTinh, selectedXa, data]);

  // Xử lý click ra ngoài để đóng gợi ý
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperTinhRef.current && !wrapperTinhRef.current.contains(event.target as Node)) {
        setShowTinhSuggestions(false);
      }
      if (wrapperXaRef.current && !wrapperXaRef.current.contains(event.target as Node)) {
        setShowXaSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- HÀM XỬ LÝ (HANDLERS) ---
  
  // Chọn Tỉnh
  const handleSelectTinh = (tinh: string) => {
    setSelectedTinh(tinh);
    setSearchTinhTerm(tinh);
    setShowTinhSuggestions(false);
    
    // Reset Xã khi đổi Tỉnh
    setSelectedXa('');
    setSearchXaTerm('');
  };

  // Chọn Xã
  const handleSelectXa = (xa: string) => {
    setSelectedXa(xa);
    setSearchXaTerm(xa);
    setShowXaSuggestions(false);
  };

  // --- GIAO DIỆN ---
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      
      <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        
        {/* HEADER */}
        <div style={{ backgroundColor: '#0056b3', padding: '30px 20px', textAlign: 'center', color: 'white' }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Tra Cứu Đơn Vị Hành Chính
          </h1>
          <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
            Dữ liệu sáp nhập mới nhất (2024 - 2025)
          </p>
        </div>

        <div style={{ padding: '40px 30px' }}>
          
          {data.length === 0 && (
            <div style={{ padding: '15px', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
              ⚠️ Chưa có dữ liệu. Vui lòng kiểm tra file data.ts
            </div>
          )}

          {/* GRID 2 CỘT */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '30px',
            marginBottom: '40px'
          }}>
            
            {/* Ô 1: TỈNH (SEARCHABLE) */}
            <div ref={wrapperTinhRef} style={{ position: 'relative' }}>
              <label style={labelStyle}>1. Nhập Tỉnh / Thành phố cũ</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text"
                  placeholder="Gõ tên tỉnh (vd: Nam Định)..."
                  value={searchTinhTerm}
                  onChange={(e) => {
                    setSearchTinhTerm(e.target.value);
                    setSelectedTinh(''); // Reset chọn lại
                    setSelectedXa('');
                    setSearchXaTerm('');
                    setShowTinhSuggestions(true);
                  }}
                  onFocus={() => setShowTinhSuggestions(true)}
                  style={inputStyle}
                />
                <span style={iconSearchStyle}>🔍</span>
              </div>

              {/* Gợi ý Tỉnh */}
              {showTinhSuggestions && (
                <ul style={suggestionListStyle}>
                  {listTinhFiltered.length > 0 ? (
                    listTinhFiltered.map((t, index) => (
                      <li 
                        key={index} 
                        onClick={() => handleSelectTinh(t)}
                        style={suggestionItemStyle}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        {t}
                      </li>
                    ))
                  ) : (
                    <li style={{ padding: '12px', color: '#999', textAlign: 'center' }}>Không tìm thấy</li>
                  )}
                </ul>
              )}
            </div>

            {/* Ô 2: XÃ (SEARCHABLE - GIỜ ĐÃ CÓ TÌM KIẾM) */}
            <div ref={wrapperXaRef} style={{ position: 'relative' }}>
              <label style={labelStyle}>2. Nhập Phường / Xã cũ</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text"
                  placeholder={!selectedTinh ? "Chọn Tỉnh trước..." : "Gõ tên xã (vd: Hòa Xá)..."}
                  value={searchXaTerm}
                  onChange={(e) => {
                    setSearchXaTerm(e.target.value);
                    setSelectedXa(''); // Reset chọn lại
                    setShowXaSuggestions(true);
                  }}
                  onFocus={() => setShowXaSuggestions(true)}
                  disabled={!selectedTinh}
                  style={!selectedTinh ? disabledInputStyle : inputStyle}
                />
                <span style={iconSearchStyle}>🔍</span>
              </div>

              {/* Gợi ý Xã */}
              {showXaSuggestions && selectedTinh && (
                <ul style={suggestionListStyle}>
                  {listXaFiltered.length > 0 ? (
                    listXaFiltered.map((x, index) => (
                      <li 
                        key={index} 
                        onClick={() => handleSelectXa(x)}
                        style={suggestionItemStyle}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        {x}
                      </li>
                    ))
                  ) : (
                    <li style={{ padding: '12px', color: '#999', textAlign: 'center' }}>
                      {searchXaTerm ? "Không tìm thấy xã này" : "Nhập tên xã để tìm"}
                    </li>
                  )}
                </ul>
              )}
            </div>

          </div>

          <div style={{ borderTop: '1px dashed #e0e0e0', margin: '30px 0' }}></div>

          {/* KẾT QUẢ */}
          <div style={{ textAlign: 'center', minHeight: '200px' }}>
            {result ? (
              <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                <div style={{ 
                  backgroundColor: '#f0fff4', 
                  border: '2px solid #28a745', 
                  borderRadius: '16px', 
                  padding: '40px 20px',
                  boxShadow: '0 10px 30px rgba(40, 167, 69, 0.15)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', backgroundColor: '#dcfce7', borderRadius: '50%', opacity: 0.5 }}></div>

                  <p style={{ color: '#28a745', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', marginBottom: '15px', letterSpacing: '1px' }}>
                    ✅ Đơn vị hành chính mới
                  </p>
                  
                  <h2 style={{ color: '#166534', fontSize: '32px', fontWeight: '800', margin: '0 0 10px 0', lineHeight: '1.2' }}>
                    {result.xaMoi}
                  </h2>
                  
                  <p style={{ fontSize: '20px', color: '#374151', margin: 0, fontWeight: '500' }}>
                    {result.tinhMoi}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '30px', paddingTop: '20px', borderTop: '1px dashed #bbf7d0' }}>
                    <div>
                      <span style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Căn cứ pháp lý</span>
                      <strong style={{ color: '#1f2937' }}>{result.nghiQuyet}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Ngày hiệu lực</span>
                      <strong style={{ color: '#1f2937' }}>{result.ngayHieuLuc}</strong>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af', padding: '20px' }}>
                 <div style={{ fontSize: '60px', marginBottom: '15px', opacity: 0.5 }}>📂</div>
                 <p style={{ fontSize: '16px' }}>Vui lòng nhập Tỉnh và Xã để xem kết quả.</p>
              </div>
            )}
          </div>

        </div>
      </div>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// --- STYLE OBJECTS ---
const labelStyle: React.CSSProperties = { 
  display: 'block', fontWeight: '600', marginBottom: '10px', color: '#374151', fontSize: '15px' 
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '14px 40px 14px 16px', fontSize: '16px', borderRadius: '10px',
  border: '1px solid #d1d5db', outline: 'none', backgroundColor: '#fff',
  boxShadow: '0 2px 5px rgba(0,0,0,0.03)', transition: 'all 0.2s', height: '54px'
};

const disabledInputStyle: React.CSSProperties = {
  ...inputStyle, backgroundColor: '#f9fafb', color: '#9ca3af', cursor: 'not-allowed', border: '1px solid #e5e7eb', boxShadow: 'none'
};

const iconSearchStyle: React.CSSProperties = {
  position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#999', pointerEvents: 'none'
};

const suggestionListStyle: React.CSSProperties = {
  position: 'absolute', top: '100%', left: 0, right: 0, 
  backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '10px',
  marginTop: '5px', maxHeight: '250px', overflowY: 'auto', zIndex: 50,
  listStyle: 'none', padding: 0, margin: '5px 0 0 0',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
};

const suggestionItemStyle: React.CSSProperties = {
  padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6', color: '#374151', fontSize: '15px'
};