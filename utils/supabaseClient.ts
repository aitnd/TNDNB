import { createClient } from '@supabase/supabase-js'

// 1. Lấy "chìa khóa" từ "két sắt" (.env.local) ra
//    (Phải chắc chắn là 2 cái tên này y chang cái cưng đặt)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 2. "Cắm điện" và tạo "tổng đài"
//    Cái biến "supabase" này là "siêu năng lực" của mình đó
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// (Cái dấu "!" là mình "hứa" với TypeScript là:
// "Yên tâm đi, tui chắc 100% là 2 biến này có trong .env.local!")