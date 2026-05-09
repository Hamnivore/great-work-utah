import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(url, key)

export async function logQuery(query: string) {
  await supabase.from('queries').insert({ query })
}

export async function logRaiseHand(data: {
  flavor: string
  name: string
  email: string
  want: string
  offer: string
}) {
  await supabase.from('raise_hand_submissions').insert(data)
}
