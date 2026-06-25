import { encryptPassword, decryptPassword } from '../services/savedAccountsService.js';

async function testEncryption() {
  
  const testPassword = "SecretPassword123!@#";

  try {
    const encrypted = await encryptPassword(testPassword);

    if (!encrypted) {
      console.error("❌ Lỗi: Không tạo được chuỗi mã hóa.");
      return;
    }

    const decrypted = await decryptPassword(encrypted);

    if (decrypted === testPassword) {
    } else {
      console.error("❌ KẾT QUẢ: Giải mã sai. Mật khẩu không khớp.");
    }
    
    // Test case: Giải mã chuỗi rác
    const fakeDecrypted = await decryptPassword("SGVsbG8gV29ybGQ="); // "Hello World" in Base64
    if (fakeDecrypted === "") {
    }

  } catch (error) {
    console.error("❌ Lỗi nghiêm trọng trong quá trình test:", error);
  }
}

// Chạy test
testEncryption();
