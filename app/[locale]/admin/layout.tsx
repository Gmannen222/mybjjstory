import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/admin'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !(await isAdmin(supabase, user.id))) {
    redirect(`/${locale}`)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-6 mb-8 border-b border-white/10 pb-4">
        <h1 className="text-2xl font-bold text-primary">Admin</h1>
        <nav className="flex gap-4 text-sm">
          <Link
            href={`/${locale}/admin`}
            className="text-muted hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href={`/${locale}/admin/feedback`}
            className="text-muted hover:text-foreground transition-colors"
          >
            Tilbakemeldinger
          </Link>
        </nav>
      </div>
      {children}
    </div>
  )
}
