import { type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { nanoid } from 'nanoid'

export async function POST(req: NextRequest): Promise<Response> {
  // Check if demo mode is enabled
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'true' && process.env.DEMO_MODE_ALLOWED !== 'true') {
    return new Response('Demo mode not enabled', { status: 403 })
  }

  const store = await cookies()
  const demoUserId = `demo_user_${nanoid(8)}`

  // Create a demo session cookie
  store.set('session', JSON.stringify({
    user: {
      id: demoUserId,
      name: 'Demo User',
      email: 'demo@example.com',
      image: null,
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
  }), {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60,
    sameSite: 'lax',
  })

  return Response.json({ success: true, userId: demoUserId })
}
