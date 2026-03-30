import { encryptPassword, decryptPassword } from '../services/savedAccountsService.js';

async function testEncryption() {
  console.log("🧪 Bắt đầu kiểm tra hệ thống mã hóa AES-GCM...");
  
  const testPassword = "SecretPassword123!@#";
  console.log(`- Mật khẩu gốc: ${testPassword}`);

  try {
    const encrypted = await encryptPassword(testPassword);
    console.log(`- Chuỗi mã hóa (Base64): ${encrypted}`);

    if (!encrypted) {
      console.error("❌ Lỗi: Không tạo được chuỗi mã hóa.");
      return;
    }

    const decrypted = await decryptPassword(encrypted);
    console.log(`- Mật khẩu sau khi giải mã: ${decrypted}`);

    if (decrypted === testPassword) {
      console.log("✅ KẾT QUẢ: Mã hóa và giải mã thành công! Khớp 100%.");
    } else {
      console.error("❌ KẾT QUẢ: Giải mã sai. Mật khẩu không khớp.");
    }
    
    // Test case: Giải mã chuỗi rác
    const fakeDecrypted = await decryptPassword("SGVsbG8gV29ybGQ="); // "Hello World" in Base64
    if (fakeDecrypted === "") {
        console.log("✅ KẾT QUẢ: Xử lý chuỗi rác chính xác (trả về chuỗi rỗng).");
    }

  } catch (error) {
    console.error("❌ Lỗi nghiêm trọng trong quá trình test:", error);
  }
}

// Chạy test
testEncryption();
