'use client'

import React, { useState, useEffect } from 'react'
import styles from './page.module.css' // (Anh dùng lại css hoặc tạo mới nhé)

type Unit = {
  ward_name: string;
  ward_code: string;
  province_name: string;
  district_name?: string; // (Trong file data-new có thể thiếu cái này, mình dùng province đỡ)
  old_units: string[];
  has_merger: boolean;
  merger_details: string;
}

export default function TraCuuDiaChiPage() {
  const [data, setData] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<any[]>([]);

  // 1. Tải "Kho dữ liệu" về khi vào trang
  useEffect(() => {
    async function loadData() {
      try {
        // Nhớ copy file data-new.json vào public/data/ nhé anh
        const res = await fetch('/data/data-new.json'); 
        if (!res.ok) throw new Error('Không tải được dữ liệu');
        const jsonData = await res.json();
        setData(jsonData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // 2. Hàm Tìm kiếm "Thần thánh" (Tìm cả tên cũ và tên mới)
  const handleSearch = () => {
    if (!keyword.trim()) {
      setResults([]);
      return;
    }
    
    const lowerKey = keyword.toLowerCase();
    
    const found = data.filter(item => {
      // Cách 1: Tìm xem từ khóa có trùng với Tên Mới không?
      const matchNew = item.ward_name.toLowerCase().includes(lowerKey);
      
      // Cách 2: Tìm xem từ khóa có nằm trong danh sách Tên Cũ không? (Cái này mới quan trọng)
      const matchOld = item.old_units && item.old_units.some(old => old.toLowerCase().includes(lowerKey));
      
      return matchNew || matchOld;
    });

    // Ưu tiên hiển thị kết quả có sáp nhập (has_merger = true)
    found.sort((a, b) => (b.has_merger ? 1 : 0) - (a.has_merger ? 1 : 0));
    
    setResults(found.slice(0, 20)); // Lấy 20 kết quả đầu tiên cho đỡ lag
  };

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#0056b3' }}>Tra Cứu Đơn Vị Hành Chính (Cũ - Mới)</h1>
        <p>Dữ liệu cập nhật theo phương án sắp xếp 34 tỉnh thành (Demo)</p>
      </div>

      {/* KHUNG TÌM KIẾM */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Nhập tên xã/phường cũ hoặc mới (VD: Thị trấn Thứ Ba, Phường 2...)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px' }}
        />
        <button 
          onClick={handleSearch}
          style={{ padding: '12px 24px', background: '#0056b3', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
        >
          {loading ? 'Đang tải...' : 'Tra cứu'}
        </button>
      </div>

      {/* KẾT QUẢ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {results.map((item, index) => (
          <div key={index} style={{ 
            background: '#fff', 
            padding: '1.5rem', 
            borderRadius: '10px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderLeft: item.has_merger ? '5px solid #ff9800' : '5px solid #4caf50'
          }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                {item.has_merger ? '🔄 Đơn vị Mới: ' : '✅ Đơn vị: '} 
                <span style={{ color: '#d32f2f' }}>{item.ward_name}</span>
              </h3>
              <span style={{ background: '#eee', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                {item.province_name}
              </span>
            </div>

            {/* Nếu có lịch sử sáp nhập thì hiện ra */}
            {item.has_merger && item.old_units && item.old_units.length > 0 && (
              <div style={{ background: '#fff8e1', padding: '10px', borderRadius: '6px', marginTop: '10px' }}>
                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#f57c00' }}>
                  <i className="fas fa-history"></i> Đã sáp nhập từ các đơn vị cũ:
                </p>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#555' }}>
                  {item.old_units.map((old: string, idx: number) => (
                    <li key={idx}>{old}</li>
                  ))}
                </ul>
              </div>
            )}

            {!item.has_merger && (
              <p style={{ margin: '5px 0 0 0', color: '#666', fontStyle: 'italic' }}>
                Đơn vị này giữ nguyên, không có thay đổi.
              </p>
            )}
          </div>
        ))}

        {results.length === 0 && keyword && !loading && (
          <div style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>
            Không tìm thấy kết quả nào.
          </div>
        )}
      </div>

    </div>
  )
}