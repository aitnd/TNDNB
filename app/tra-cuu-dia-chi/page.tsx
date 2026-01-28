'use client';

import React, { useState, useEffect, useRef } from 'react';

// --- ĐỊNH NGHĨA KIỂU DỮ LIỆU TỪ API ---
interface Province {
  province_code: string;
  name: string;
}

interface Ward {
  ward_code: string;
  ward_name: string;
  province_code: string;
  // Các trường dự đoán có thể trả về từ API để hiển thị chi tiết
  old_units?: string[]; 
  merger_details?: string;
  is_merged?: boolean;
}

export default function TraCuuDiaChiPage() {
  // --- STATE ---
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingWards, setLoadingWards] = useState(false);

  // State cho ô tìm kiếm Tỉnh
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [searchProvinceTerm, setSearchProvinceTerm] = useState('');
  const [showProvinceSuggestions, setShowProvinceSuggestions] = useState(false);

  // State cho ô tìm kiếm Xã
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [searchWardTerm, setSearchWardTerm] = useState('');
  const [showWardSuggestions, setShowWardSuggestions] = useState(false);

  // Ref để đóng gợi ý khi click ra ngoài
  const wrapperProvinceRef = useRef<HTMLDivElement>(null);
  const wrapperWardRef = useRef<HTMLDivElement>(null);

  // --- 1. LẤY DANH SÁCH TỈNH (Khi mới vào trang) ---
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch('https://34tinhthanh.com/api/provinces');
        if (!res.ok) throw new Error('Lỗi kết nối API');
        const data = await res.json();
        setProvinces(data);
      } catch (error) {
        console.error("Không tải được danh sách tỉnh:", error);
      } finally {
        setLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);

  // --- 2. LẤY DANH SÁCH XÃ (Khi chọn Tỉnh) ---
  useEffect(() => {
    if (selectedProvince) {
      setLoadingWards(true);
      const fetchWards = async () => {
        try {
          // Gọi API lấy xã theo mã tỉnh
          const res = await fetch(`https://34tinhthanh.com/api/wards?province_code=${selectedProvince.province_code}`);
          if (!res.ok) throw new Error('Lỗi kết nối API');
          const data = await res.json();
          setWards(data);
        } catch (error) {
          console.error("Không tải được danh sách xã:", error);
          setWards([]);
        } finally {
          setLoadingWards(false);
        }
      };
      fetchWards();
    } else {
      setWards([]);
    }
  }, [selectedProvince]);

  // --- LOGIC LỌC TÌM KIẾM (Client-side Filter) ---
  const filteredProvinces = provinces.filter(p => 
    p.name.toLowerCase().includes(searchProvinceTerm.toLowerCase())
  );

  const filteredWards = wards.filter(w => 
    w.ward_name.toLowerCase().includes(searchWardTerm.toLowerCase())
  );

  // --- XỬ LÝ SỰ KIỆN CLICK RA NGOÀI ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperProvinceRef.current && !wrapperProvinceRef.current.contains(event.target as Node)) {
        setShowProvinceSuggestions(false);
      }
      if (wrapperWardRef.current && !wrapperWardRef.current.contains(event.target as Node)) {
        setShowWardSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- GIAO DIỆN ---
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      
      <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        
        {/* HEADER */}
        <div style={{ background: 'linear-gradient(135deg, #0056b3 0%, #004494 100%)', padding: '35px 20px', textAlign: 'center', color: 'white' }}>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Tra Cứu Đơn Vị Hành Chính
          </h1>
          <p style={{ margin: '10px 0 0 0', opacity: 0.9, fontSize: '15px' }}>
            Dữ liệu trực tuyến từ hệ thống 34tinhthanh.com
          </p>
        </div>

        <div style={{ padding: '40px 30px' }}>
          
          {/* GRID 2 CỘT */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '30px',
            marginBottom: '40px'
          }}>
            
            {/* Ô 1: CHỌN TỈNH */}
            <div ref={wrapperProvinceRef} style={{ position: 'relative' }}>
              <label style={labelStyle}>1. Chọn Tỉnh / Thành phố</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text"
                  placeholder={loadingProvinces ? "Đang tải danh sách..." : "Gõ tên tỉnh (vd: Hà Nội)..."}
                  value={searchProvinceTerm}
                  onChange={(e) => {
                    setSearchProvinceTerm(e.target.value);
                    setSelectedProvince(null);
                    setSelectedWard(null);
                    setSearchWardTerm('');
                    setShowProvinceSuggestions(true);
                  }}
                  onFocus={() => setShowProvinceSuggestions(true)}
                  style={inputStyle}
                  disabled={loadingProvinces}
                />
                <span style={iconSearchStyle}>{loadingProvinces ? '⏳' : '🔍'}</span>
              </div>

              {showProvinceSuggestions && (
                <ul style={suggestionListStyle}>
                  {filteredProvinces.length > 0 ? (
                    filteredProvinces.map((p) => (
                      <li 
                        key={p.province_code} 
                        onClick={() => {
                          setSelectedProvince(p);
                          setSearchProvinceTerm(p.name);
                          setShowProvinceSuggestions(false);
                          // Reset Ward
                          setSelectedWard(null);
                          setSearchWardTerm('');
                        }}
                        style={suggestionItemStyle}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        {p.name}
                      </li>
                    ))
                  ) : (
                    <li style={{ padding: '12px', color: '#999', textAlign: 'center' }}>Không tìm thấy</li>
                  )}
                </ul>
              )}
            </div>

            {/* Ô 2: CHỌN XÃ */}
            <div ref={wrapperWardRef} style={{ position: 'relative' }}>
              <label style={labelStyle}>2. Chọn Phường / Xã</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text"
                  placeholder={
                    !selectedProvince ? "Vui lòng chọn Tỉnh trước..." :
                    loadingWards ? "Đang tải dữ liệu xã..." : "Gõ tên xã (vd: Phúc Xá)..."
                  }
                  value={searchWardTerm}
                  onChange={(e) => {
                    setSearchWardTerm(e.target.value);
                    setSelectedWard(null);
                    setShowWardSuggestions(true);
                  }}
                  onFocus={() => setShowWardSuggestions(true)}
                  disabled={!selectedProvince || loadingWards}
                  style={(!selectedProvince || loadingWards) ? disabledInputStyle : inputStyle}
                />
                <span style={iconSearchStyle}>{loadingWards ? '⏳' : '🔍'}</span>
              </div>

              {showWardSuggestions && selectedProvince && (
                <ul style={suggestionListStyle}>
                  {filteredWards.length > 0 ? (
                    filteredWards.map((w) => (
                      <li 
                        key={w.ward_code} 
                        onClick={() => {
                          setSelectedWard(w);
                          setSearchWardTerm(w.ward_name);
                          setShowWardSuggestions(false);
                        }}
                        style={suggestionItemStyle}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        {w.ward_name}
                      </li>
                    ))
                  ) : (
                    <li style={{ padding: '12px', color: '#999', textAlign: 'center' }}>
                      {loadingWards ? "Đang tải..." : "Không tìm thấy xã này"}
                    </li>
                  )}
                </ul>
              )}
            </div>

          </div>

          <div style={{ borderTop: '1px dashed #e0e0e0', margin: '30px 0' }}></div>

          {/* KẾT QUẢ HIỂN THỊ */}
          <div style={{ textAlign: 'center', minHeight: '200px' }}>
            {selectedWard && selectedProvince ? (
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
                  {/* Trang trí nền */}
                  <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', backgroundColor: '#dcfce7', borderRadius: '50%', opacity: 0.6 }}></div>

                  <p style={{ color: '#28a745', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', marginBottom: '15px', letterSpacing: '1px' }}>
                    ✅ Thông tin đơn vị hành chính
                  </p>
                  
                  <h2 style={{ color: '#166534', fontSize: '32px', fontWeight: '800', margin: '0 0 10px 0', lineHeight: '1.2' }}>
                    {selectedWard.ward_name}
                  </h2>
                  
                  <p style={{ fontSize: '20px', color: '#374151', margin: 0, fontWeight: '500' }}>
                    {selectedProvince.name}
                  </p>
                  
                  {/* Hiển thị chi tiết sáp nhập nếu API trả về */}
                  {(selectedWard.merger_details || (selectedWard.old_units && selectedWard.old_units.length > 0)) && (
                    <div style={{ marginTop: '25px', padding: '15px', backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: '8px', border: '1px dashed #28a745' }}>
                       <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#166534' }}>Thông tin sáp nhập:</span>
                       <p style={{ margin: '5px 0 0 0', color: '#333' }}>
                         {selectedWard.merger_details || `Bao gồm: ${selectedWard.old_units?.join(', ')}`}
                       </p>
                    </div>
                  )}

                  <div style={{ marginTop: '20px', fontSize: '12px', color: '#888' }}>
                    Mã đơn vị: {selectedWard.ward_code} | Nguồn: 34tinhthanh.com
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af', padding: '20px' }}>
                 <div style={{ fontSize: '60px', marginBottom: '15px', opacity: 0.5 }}>🌐</div>
                 <p style={{ fontSize: '16px' }}>Kết nối API thành công.<br/>Vui lòng chọn địa phương để xem kết quả.</p>
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

// --- STYLE OBJECTS (Giữ nguyên style đẹp cũ) ---
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