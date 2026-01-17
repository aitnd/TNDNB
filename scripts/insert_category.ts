
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load env from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function main() {
    console.log('Inserting category...')
    const { error } = await supabase
        .from('categories')
        .upsert({ id: 'gioi-thieu-viec-lam', name: 'Giới thiệu việc làm' })

    if (error) {
        console.error('Error:', error.message)
    } else {
        console.log('Success! Category inserted.')
    }
}

main()
