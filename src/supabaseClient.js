import { createClient } from '@supabase/supabase-js'
const rawUrl = import.meta.env.VITE_SUPABASE_URL || ''
const url = rawUrl.replace(/\/rest\/v1\/?$/,'').replace(/\/$/,'')
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
export const ready = Boolean(url && key)
export const supabase = ready ? createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true }}) : null
