import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user || !(await isAdmin(supabase, user.id))) {
    return NextResponse.json({ error: 'Ingen tilgang' }, { status: 403 })
  }

  const body = await request.json()
  const { feedbackId, reply, sendEmail } = body as {
    feedbackId: string
    reply: string
    sendEmail: boolean
  }

  if (!feedbackId || !reply?.trim()) {
    return NextResponse.json({ error: 'Mangler feedback-ID eller svar' }, { status: 400 })
  }

  // Save reply to database
  const now = new Date().toISOString()
  const updateData: Record<string, string> = {
    admin_reply: reply.trim(),
    replied_at: now,
    status: 'resolved',
  }

  // Fetch feedback to get contact_email
  const { data: feedback } = await supabase
    .from('feedback')
    .select('contact_email')
    .eq('id', feedbackId)
    .single()

  // Send email if requested and contact_email exists
  let emailSent = false
  if (sendEmail && feedback?.contact_email) {
    try {
      const resendApiKey = process.env.RESEND_API_KEY
      if (resendApiKey) {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: 'MyBJJStory <noreply@mybjjstory.no>',
            to: [feedback.contact_email],
            subject: 'Svar på din tilbakemelding — MyBJJStory',
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #c9a84c;">MyBJJStory</h2>
                <p>Hei!</p>
                <p>Vi har svart på tilbakemeldingen din:</p>
                <blockquote style="border-left: 3px solid #c9a84c; padding-left: 12px; margin: 16px 0; color: #333;">
                  ${reply.trim().replace(/\n/g, '<br>')}
                </blockquote>
                <p>Du kan også se svaret i appen under <strong>Tilbakemeldinger</strong>.</p>
                <p style="color: #888; font-size: 12px; margin-top: 32px;">— MyBJJStory-teamet</p>
              </div>
            `,
          }),
        })

        if (emailRes.ok) {
          emailSent = true
          updateData.email_sent_at = now
        }
      }
    } catch (err) {
      console.error('Failed to send feedback email:', err)
    }
  }

  const { error: updateError } = await supabase
    .from('feedback')
    .update(updateData)
    .eq('id', feedbackId)

  if (updateError) {
    console.error('Failed to save feedback reply:', updateError)
    return NextResponse.json({ error: 'Kunne ikke lagre svaret' }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    emailSent,
    hasContactEmail: !!feedback?.contact_email,
  })
}
