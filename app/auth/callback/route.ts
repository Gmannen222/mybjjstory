import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const nextParam = searchParams.get('next') ?? '/'

  const isSafePath =
    /^\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]*$/.test(nextParam) &&
    !nextParam.startsWith('//')
  const next = isSafePath ? nextParam : '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Check if user has completed onboarding — if so, skip onboarding redirect
      if (next.includes('/onboarding')) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username, belt_rank')
            .eq('id', user.id)
            .single()
          if (profile?.username && profile?.belt_rank) {
            const locale = next.split('/')[1] || 'no'
            return NextResponse.redirect(`${origin}/${locale}`)
          }
        }
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
