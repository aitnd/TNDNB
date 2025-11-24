'use client';

import React, { useState, useEffect } from 'react';

// --- 1. LOGIC XỬ LÝ DỮ LIỆU (Giữ nguyên vì đã chạy tốt) ---
interface AddressRecord {
  tinhCu: string; huyenCu: string; xaCu: string;
  tinhMoi: string; huyenMoi: string; xaMoi: string;
  nghiQuyet?: string; ngayHieuLuc?: string;
}

export default function TraCuuDiaChiPage() {
  const [data, setData] = useState<AddressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [selectedTinh, setSelectedTinh] = useState('');
  const [selectedHuyen, setSelectedHuyen] = useState('');
  const [selectedXa, setSelectedXa] = useState('');
  const [result, setResult] = useState<AddressRecord | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Link file CSV (Ưu tiên file data.csv ngắn gọn)
        const filePaths = ['/tra-cuu/data.csv', '/tra-cuu/sap%20nhap.xlsx%20-%20DATA.csv'];
        let text = '', success = false;

        for (const path of filePaths) {
          try {
            const res = await fetch(path);
            if (res.ok) { text = await res.text(); success = true; break; }
          } catch (e) {}
        }

        if (!success || !text) throw new Error("Không tìm thấy file data.csv");

        const rows = text.split(/\r?\n/);
        const delimiter = rows[0].includes(';') ? ';' : ','; 
        
        const parsedData = rows.slice(1).map(row => {
          if (!row.trim()) return null;
          const cols = row.split(delimiter).map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols.length < 6) return null;
          return {
            tinhCu: cols[0], huyenCu: cols[1], xaCu: cols[2],
            tinhMoi: cols[3], huyenMoi: cols[4], xaMoi: cols[5],
            nghiQuyet: cols[6] || '', ngayHieuLuc: cols[7] || ''
          };
        }).filter(Boolean) as AddressRecord[];

        setData(parsedData);
        setLoading(false);
      } catch (error: any) {
        setErrorMsg(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const listTinh = Array.from(new Set(data.map(i => i.tinhCu))).sort();
  const listHuyen = Array.from(new Set(data.filter(i => i.tinhCu === selectedTinh).map(i => i.huyenCu))).sort();
  const listXa = Array.from(new Set(data.filter(i => i.tinhCu === selectedTinh && i.huyenCu === selectedHuyen).map(i => i.xaCu))).sort();

  useEffect(() => {
    if (selectedTinh && selectedHuyen && selectedXa) {
      setResult(data.find(i => i.tinhCu === selectedTinh && i.huyenCu === selectedHuyen && i.xaCu === selectedXa) || null);
    } else setResult(null);
  }, [selectedTinh, selectedHuyen, selectedXa]);


  // --- 2. GIAO DIỆN (Đã sửa lại theo phong cách Form Ngang) ---
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* KHUNG CHÍNH */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        
        {/* HEADER XANH */}
        <div style={{
          backgroundColor: '#0056b3',
          padding: '20px',
          textAlign: 'center',
          color: 'white'
        }}>
          <h1 style={{ margin: 0, fontSize: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Tra Cứu Thông Tin Địa Giới Hành Chính
          </h1>
          <p style={{ margin: '8px 0 0 0', opacity: 0.8, fontSize: '14px' }}>
            Cập nhật dữ liệu sáp nhập mới nhất năm 2024-2025
          </p>
        </div>

        <div style={{ padding: '30px' }}>
          
          {/* THÔNG BÁO LỖI (NẾU CÓ) */}
          {errorMsg && (
            <div style={{ padding: '15px', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '6px', marginBottom: '20px', border: '1px solid #ffeeba' }}>
              ⚠️ <strong>Lỗi tải dữ liệu:</strong> {errorMsg}
            </div>
          )}

          {/* HÀNG 3 Ô CHỌN (GRID LAYOUT) */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px',
            marginBottom: '30px'
          }}>
            
            {/* Ô 1: TỈNH */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#333' }}>Tỉnh / Thành phố cũ</label>
              <select 
                style={selectStyle} 
                value={selectedTinh}
                onChange={e => { setSelectedTinh(e.target.value); setSelectedHuyen(''); setSelectedXa(''); }}
              >
                <option value="">-- Chọn Tỉnh --</option>
                {listTinh.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Ô 2: HUYỆN */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#333' }}>Quận / Huyện cũ</label>
              <select 
                style={!selectedTinh ? disabledSelectStyle : selectStyle} 
                value={selectedHuyen}
                onChange={e => { setSelectedHuyen(e.target.value); setSelectedXa(''); }}
                disabled={!selectedTinh}
              >
                <option value="">-- Chọn Huyện --</option>
                {listHuyen.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>

            {/* Ô 3: XÃ */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#333' }}>Phường / Xã cũ</label>
              <select 
                style={!selectedHuyen ? disabledSelectStyle : selectStyle} 
                value={selectedXa}
                onChange={e => setSelectedXa(e.target.value)}
                disabled={!selectedHuyen}
              >
                <option value="">-- Chọn Xã --</option>
                {listXa.map(x => <option key={x} value={x}>{x}</option>)}
              </select>
            </div>
          </div>

          {loading && <p style={{ textAlign: 'center', color: '#0056b3', fontStyle: 'italic' }}>Đang tải dữ liệu...</p>}

          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '30px 0' }} />

          {/* KHUNG KẾT QUẢ */}
          <div style={{ textAlign: 'center' }}>
            {result ? (
              <div style={{ 
                backgroundColor: '#f8fff9', 
                border: '1px solid #28a745', 
                borderRadius: '8px', 
                padding: '30px' 
              }}>
                <p style={{ color: '#28a745', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', marginBottom: '10px' }}>
                  ✅ Kết quả chuyển đổi
                </p>
                <h2 style={{ color: '#333', fontSize: '28px', margin: '0 0 5px 0' }}>{result.xaMoi}</h2>
                <p style={{ fontSize: '18px', color: '#555', margin: 0 }}>
                  {result.huyenMoi}, {result.tinhMoi}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '20px', paddingTop: '20px', borderTop: '1px dashed #c3e6cb' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>Căn cứ</span>
                    <div style={{ fontWeight: '600', color: '#333' }}>{result.nghiQuyet || '-'}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>Ngày hiệu lực</span>
                    <div style={{ fontWeight: '600', color: '#333' }}>{result.ngayHieuLuc || '-'}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '40px', color: '#999', backgroundColor: '#fafafa', borderRadius: '8px', border: '1px dashed #ddd' }}>
                Vui lòng chọn đầy đủ thông tin ở trên để xem kết quả.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// --- STYLE OBJECTS (Để code gọn hơn) ---
const selectStyle = {
  width: '100%',
  padding: '12px',
  fontSize: '16px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  outline: 'none',
  backgroundColor: '#fff',
  cursor: 'pointer',
  height: '48px' // Chiều cao cố định
};

const disabledSelectStyle = {
  ...selectStyle,
  backgroundColor: '#f5f5f5',
  color: '#aaa',
  cursor: 'not-allowed',
  border: '1px solid #eee'
};