import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)
export const supabaseBrowserClient = createPagesBrowserClient({ supabaseUrl, supabaseKey: supabaseAnonKey })

// export function createClient() {
//   return createSupabaseClient(supabaseUrl, supabaseAnonKey)
// }
