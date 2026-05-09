import { createClient } from '@supabase/supabase-js'

const url = 'https://fjjunslhljfpnoldcssw.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqanVuc2xobGpmcG5vbGRjc3N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNDUxNjYsImV4cCI6MjA5MzkyMTE2Nn0.D0jpg3GG3M0tCLrbt-5lkUgYcqjh9ZZ4jmqlH0HoOf4'

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
