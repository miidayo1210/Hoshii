import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// ✅ 通常クライアント（フロント用）
export const supabase: SupabaseClient = createSupabaseClient(supabaseUrl, supabaseAnonKey)

// ✅ APIやサーバー側で使う createClient（これをroute.tsがimportする）
export function createClient(): SupabaseClient {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}