import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const requestUrl = new URL(request.url)

  console.log('Cookies', request.headers.get('cookie'))


  // Skip middleware for .well-known and other non-application routes
  if (requestUrl.pathname.startsWith('/.well-known/') ||
    requestUrl.pathname.startsWith('/_next/') ||
    requestUrl.pathname.includes('.')) {
    return NextResponse.next()
  }

  // Create a response object that will be used to set cookies
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  try {
    // Create a Supabase client configured to use cookies
    const supabase = await createMiddlewareClient({ req: request, res: response })

    // Get the session from the Supabase client
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Error getting session:', error)
      return response
    }

    // If the user is not signed in and the current path is under /admin, redirect to /admin
    console.log('Session', session)
    console.log('Session', requestUrl.pathname)
    console.log('Session', requestUrl)
    console.log('Session', session == null && requestUrl.pathname.startsWith('/admin'))
    if (!session && requestUrl.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }


    // If the user is signed in and the current path is /admin, redirect to /admin/dashboard
    if (session && requestUrl.pathname === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  } catch (error) {
    console.error('Middleware error:', error)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth/callback (auth callbacks)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth/callback).*)',
  ],
}
