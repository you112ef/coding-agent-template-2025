import { type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { saveSession } from '@/lib/session/create-github'
import { nanoid } from 'nanoid'
import type { Session } from '@/lib/session/types'
import { SESSION_COOKIE_NAME } from '@/lib/session/constants'
import { encryptJWE } from '@/lib/jwe/encrypt'
import ms from 'ms'

export async function GET(req: NextRequest): Promise<Response> {
  // GitHub demo mode - creates a session without actual OAuth
  // This is for testing purposes only

  const store = await cookies()
  let redirectTo = '/'

  try {
    // Create a demo GitHub session
    const session = createDemoGitHubSession()

    if (!session) {
      console.error('[GitHub Demo] Failed to create GitHub demo session')
      return Response.redirect(new URL('/?error=demo_failed', req.url))
    }

    console.log('[GitHub Demo] GitHub demo session created for user:', session.user.id)

    // Create response with redirect
    const response = Response.redirect(new URL(redirectTo, req.url))

    // Save session to cookie
    await saveSession(response, session)

    return response
  } catch (error) {
    console.error('[GitHub Demo] Error:', error)
    return Response.redirect(new URL('/?error=demo_failed', req.url))
  }
}

function createDemoGitHubSession(): Session {
  const demoUserId = `github_demo_${nanoid(8)}`

  // Create a session with mock GitHub data
  const session: Session = {
    created: Date.now(),
    authProvider: 'github',
    user: {
      id: demoUserId,
      username: 'demo-github-user',
      email: 'demo@github.example.com',
      name: 'Demo GitHub User',
      avatar: `https://github.com/identicons/${demoUserId}.png`,
    },
  }

  return session
}
