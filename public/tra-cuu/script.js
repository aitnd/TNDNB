document.addEventListener("DOMContentLoaded", () => {
    const provinceSelect = document.getElementById("provinceSelect");
    const districtSelect = document.getElementById("districtSelect"); // Thêm cái này nếu có
    const wardSelect = document.getElementById("wardSelect");
    
    const selectedInfo = document.getElementById("selectedInfo");
    const selectedProvince = document.getElementById("selectedProvince");
    const selectedWard = document.getElementById("selectedWard");
    const selectedWardCode = document.getElementById("selectedWardCode");
    const oldUnitsInfo = document.getElementById("oldUnitsInfo"); // Thêm hiển thị danh sách cũ

    // Biến lưu toàn bộ dữ liệu (tải 1 lần dùng mãi)
    let allData = [];

    // 1. Tải dữ liệu từ API "Ruột" mình vừa làm
    fetch('/api/search?q=all') // Hoặc đường dẫn file json nếu anh muốn load trực tiếp
        .then(res => res.json())
        .then(data => {
            allData = data;
            initProvinces();
        })
        .catch(err => console.error("Lỗi tải dữ liệu:", err));

    // 2. Khởi tạo danh sách Tỉnh
    function initProvinces() {
        // Lọc danh sách tỉnh duy nhất
        const provinces = [...new Set(allData.map(item => item.province_name))].sort();
        
        provinceSelect.innerHTML = '<option value="">-- Chọn Tỉnh/Thành phố --</option>';
        provinces.forEach(prov => {
            const option = document.createElement("option");
            option.value = prov;
            option.textContent = prov;
            provinceSelect.appendChild(option);
        });
    }

    // 3. Khi chọn Tỉnh -> Lọc Huyện (Nếu giao diện có) hoặc Lọc Xã
    provinceSelect.addEventListener("change", () => {
        const selectedProv = provinceSelect.value;
        
        // Reset Xã
        wardSelect.innerHTML = '<option value="">-- Chọn Xã/Phường (Tên Cũ) --</option>';
        wardSelect.disabled = !selectedProv;
        
        // Ẩn kết quả
        selectedInfo.style.display = "none";

        if (!selectedProv) return;

        // Lọc các đơn vị thuộc tỉnh này
        // 💖 LOGIC QUAN TRỌNG: Lấy danh sách TÊN CŨ để hiển thị trong Dropdown
        const unitsInProv = allData.filter(item => item.province_name === selectedProv);
        
        let wardOptions = [];
        
        unitsInProv.forEach(unit => {
            // Nếu có tên cũ (do sáp nhập), ưu tiên hiển thị tên cũ
            if (unit.old_units && unit.old_units.length > 0) {
                unit.old_units.forEach(oldName => {
                    wardOptions.push({
                        name: oldName, // Tên hiển thị trong dropdown (Tên Cũ)
                        newName: unit.ward_name, // Giá trị thực (Tên Mới)
                        ...unit // Giữ lại thông tin khác
                    });
                });
            }
            // Vẫn thêm tên hiện tại (để ai tìm tên mới cũng thấy)
            wardOptions.push({
                name: unit.ward_name,
                newName: unit.ward_name,
                ...unit
            });
        });

        // Sắp xếp A-Z
        wardOptions.sort((a, b) => a.name.localeCompare(b.name));

        // Đổ vào Dropdown
        wardOptions.forEach(opt => {
            const option = document.createElement("option");
            option.value = opt.newName; // Giá trị là Tên Mới
            option.textContent = opt.name; // Hiển thị là Tên Cũ (hoặc Mới)
            // Lưu data ẩn để dùng khi chọn
            option.dataset.oldList = JSON.stringify(opt.old_units || []);
            option.dataset.mergerDetails = opt.merger_details || "";
            wardSelect.appendChild(option);
        });
    });

    // 4. Khi chọn Xã -> Hiển thị Kết quả (Tên Mới)
    wardSelect.addEventListener("change", () => {
        const selectedOption = wardSelect.options[wardSelect.selectedIndex];
        const newWardName = selectedOption.value;
        
        if (!newWardName) {
            selectedInfo.style.display = "none";
            return;
        }

        // Hiển thị bảng kết quả
        selectedInfo.style.display = "block";
        
        // 💖 LOGIC NGƯỢC: Bên phải hiện Tên Mới
        selectedProvince.textContent = provinceSelect.value; // Tỉnh
        selectedWard.textContent = newWardName; // Xã Mới
        
        // Hiển thị thêm thông tin sáp nhập (nếu có)
        const oldList = JSON.parse(selectedOption.dataset.oldList || '[]');
        const mergerDetails = selectedOption.dataset.mergerDetails;
        
        let infoHtml = '';
        if (oldList.length > 0) {
            infoHtml += `<div class="selected-info-label" style="color:#d9534f; margin-top:10px;">⚠️ Đã sáp nhập từ:</div>`;
            infoHtml += `<div class="selected-info-value">${oldList.join(', ')}</div>`;
        }
        if (mergerDetails) {
            infoHtml += `<div class="selected-info-label" style="margin-top:5px;">ℹ️ Chi tiết:</div>`;
            infoHtml += `<div class="selected-info-value" style="font-size:0.9em; font-style:italic;">${mergerDetails}</div>`;
        }
        
        // Gán vào ô Mã (hoặc ô thông tin phụ)
        selectedWardCode.innerHTML = infoHtml;
    });

    // ... (Các phần xử lý theme, clear button... giữ nguyên nếu cần)
});