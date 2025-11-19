// app/tra-cuu-dia-chi/page.tsx
'use client'

import React, { useState, useEffect, useMemo } from 'react'
import styles from './page.module.css'

type Unit = {
  ward_name: string;
  province_name: string;
  district_name: string;
  old_units: string[];
  has_merger: boolean;
  merger_details?: string;
}

export default function TraCuuDiaChiPage() {
  const [data, setData] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [keyword, setKeyword] = useState('');
  
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState(''); // Lưu tên xã (Cũ hoặc Mới) được chọn

  const [results, setResults] = useState<Unit[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // 1. Tải dữ liệu
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/data/data-new.json'); 
        if (!res.ok) throw new Error(`Lỗi tải file: ${res.status}`);
        const jsonData = await res.json();
        
        let finalList: Unit[] = [];
        if (Array.isArray(jsonData)) finalList = jsonData;
        else if (jsonData.data && Array.isArray(jsonData.data)) finalList = jsonData.data;
        
        finalList = finalList.map(item => ({
            ...item,
            province_name: item.province_name?.trim() || '',
            district_name: item.district_name?.trim() || '',
            ward_name: item.ward_name?.trim() || ''
        }));

        setData(finalList);
        setLoading(false);
      } catch (error: any) {
        setErrorMsg(error.message);
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // --- LOGIC DROPDOWN ---
  
  // Lấy danh sách Tỉnh
  const provinces = useMemo(() => {
    const unique = new Set(data.map(item => item.province_name).filter(Boolean));
    return Array.from(unique).sort();
  }, [data]);

  // Lấy danh sách Huyện
  const districts = useMemo(() => {
    if (!selectedProvince) return [];
    const filtered = data.filter(item => item.province_name === selectedProvince);
    const unique = new Set(filtered.map(item => item.district_name).filter(Boolean));
    return Array.from(unique).sort();
  }, [data, selectedProvince]);

  // 💖 LẤY DANH SÁCH XÃ (LOGIC MỚI: ƯU TIÊN HIỂN THỊ TÊN CŨ) 💖
  const wardOptions = useMemo(() => {
    if (!selectedDistrict) return [];
    
    // Lấy tất cả đơn vị thuộc huyện này
    const unitsInDistrict = data.filter(item => 
        item.province_name === selectedProvince && 
        item.district_name === selectedDistrict
    );

    let options: string[] = [];
    
    unitsInDistrict.forEach(unit => {
        if (unit.has_merger && unit.old_units && unit.old_units.length > 0) {
            // Nếu có sáp nhập -> Bung lụa danh sách TÊN CŨ vào dropdown
            options.push(...unit.old_units);
        } else {
            // Nếu không sáp nhập -> Dùng tên hiện tại
            options.push(unit.ward_name);
        }
    });

    // Lọc trùng và sắp xếp A-Z cho dễ tìm
    return Array.from(new Set(options)).sort((a, b) => a.localeCompare(b));
  }, [data, selectedProvince, selectedDistrict]);


  // Xử lý khi chọn Dropdown
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvince(e.target.value);
    setSelectedDistrict('');
    setSelectedWard('');
    setResults([]);
    setKeyword('');
    setHasSearched(false);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(e.target.value);
    setSelectedWard('');
    setResults([]);
    setHasSearched(false);
  };

  // 💖 XỬ LÝ KHI CHỌN XÃ (TÌM NGƯỢC TỪ TÊN CŨ RA TÊN MỚI) 💖
  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedWard(val);
    
    if (val) {
        // Tìm đơn vị hành chính nào chứa cái tên vừa chọn (trong old_units HOẶC ward_name)
        const found = data.find(item => 
            item.province_name === selectedProvince && 
            item.district_name === selectedDistrict && 
            (
                item.ward_name === val || // Trùng tên mới
                (item.old_units && item.old_units.includes(val)) // Hoặc nằm trong danh sách cũ
            )
        );
        
        if (found) {
            setResults([found]);
            setHasSearched(true);
        }
    }
  };

  // Hàm tìm kiếm từ khóa (Giữ nguyên)
  const handleSearch = () => {
    if (!keyword.trim()) return;
    setSelectedProvince('');
    setSelectedDistrict('');
    setSelectedWard('');
    setHasSearched(true);
    const lowerKey = keyword.toLowerCase().trim();
    
    const found = data.filter(item => {
      const matchNew = item.ward_name && item.ward_name.toLowerCase().includes(lowerKey);
      const matchOld = Array.isArray(item.old_units) && item.old_units.some(old => old.toLowerCase().includes(lowerKey));
      const matchProv = item.province_name && item.province_name.toLowerCase().includes(lowerKey);
      return matchNew || matchOld || matchProv;
    });

    found.sort((a, b) => (b.has_merger ? 1 : 0) - (a.has_merger ? 1 : 0));
    setResults(found.slice(0, 50)); 
  };

  const ResultCard = ({ item }: { item: Unit }) => (
    <div className={`${styles.card} ${item.has_merger ? styles.cardMerger : styles.cardStable}`}>
        <div className={styles.cardHeader}>
            <div>
            <h3 className={styles.unitTitle}>
                {item.has_merger ? '📍 Đơn vị Mới: ' : '✅ Đơn vị: '} 
                <span>{item.ward_name}</span>
            </h3>
            <div className={styles.unitLocation}>
                {item.district_name} - {item.province_name}
            </div>
            </div>
            {item.has_merger ? (
                <span className={`${styles.badge} ${styles.badgeMerger}`}>⚠️ Đã sáp nhập</span>
            ) : (
                <span className={`${styles.badge} ${styles.badgeStable}`}>Ổn định</span>
            )}
        </div>

        {item.has_merger && Array.isArray(item.old_units) && item.old_units.length > 0 && (
            <div className={styles.historyBox}>
            <p className={styles.historyTitle}>⬇️ Sáp nhập từ các đơn vị cũ:</p>
            <ul className={styles.historyList}>
                {item.old_units.map((old, idx) => (
                  /* Highlight tên xã nếu nó trùng với cái người dùng đang chọn trong dropdown */
                  <li key={idx} className={selectedWard === old ? styles.matchHighlight : ''}>
                    {old} {selectedWard === old ? '👈 (Bạn chọn cái này)' : ''}
                  </li>
                ))}
            </ul>
            {item.merger_details && <p style={{fontSize: '0.85rem', color: '#666', marginTop: '5px'}}>ℹ️ {item.merger_details}</p>}
            </div>
        )}
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Tra Cứu Đơn Vị Hành Chính</h1>
        {loading && <p>⏳ Đang tải dữ liệu...</p>}
        {errorMsg && <p style={{color:'red'}}>❌ {errorMsg}</p>}
      </div>

      {/* BỘ LỌC DROPDOWN */}
      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
            <label className={styles.label}>Tỉnh / Thành phố</label>
            <select className={styles.select} value={selectedProvince} onChange={handleProvinceChange} disabled={loading}>
                <option value="">-- Chọn Tỉnh --</option>
                {provinces.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
        </div>

        <div className={styles.filterGroup}>
            <label className={styles.label}>Quận / Huyện</label>
            <select className={styles.select} value={selectedDistrict} onChange={handleDistrictChange} disabled={!selectedProvince}>
                <option value="">-- Chọn Huyện --</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
        </div>

        <div className={styles.filterGroup}>
            <label className={styles.label}>Phường / Xã (Tên Cũ)</label> {/* Đã đổi label */}
            <select className={styles.select} value={selectedWard} onChange={handleWardChange} disabled={!selectedDistrict}>
                <option value="">-- Chọn Xã Cũ/Mới --</option>
                {wardOptions.map((name, idx) => (
                    <option key={idx} value={name}>{name}</option>
                ))}
            </select>
        </div>
      </div>

      <div className={styles.divider}><span>HOẶC TÌM KIẾM TỰ DO</span></div>

      {/* TÌM KIẾM TỪ KHÓA */}
      <div className={styles.searchBox}>
        <input
          type="text"
          className={styles.input}
          placeholder="Nhập tên xã cũ/mới (VD: Phường 2, Quỳnh Sơn)..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className={styles.button} onClick={handleSearch} disabled={loading}>
          Tra cứu
        </button>
      </div>

      {/* KẾT QUẢ */}
      <div className={styles.resultList}>
        {results.map((item, index) => <ResultCard key={index} item={item} />)}
        
        {hasSearched && results.length === 0 && !loading && (
            <div className={styles.emptyState}>
                Không tìm thấy kết quả nào.
            </div>
        )}
      </div>
    </div>
  )
}