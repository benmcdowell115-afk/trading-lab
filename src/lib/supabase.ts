import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!url || !key) {
  console.warn('[Trading Lab] Supabase env vars not set — running in local-only mode')
}

export const supabase = createClient(url ?? '', key ?? '')

// ── Helpers used by hooks ─────────────────────────────────────────────────────

/** Upsert a single field on the user_data row */
export async function syncUserDataField(field: string, value: unknown, userId: string | null) {
  if (!userId || !url) return
  await supabase
    .from('user_data')
    .upsert({ user_id: userId, [field]: value }, { onConflict: 'user_id' })
}
