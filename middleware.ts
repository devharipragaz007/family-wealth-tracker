import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // List of public routes that don't require authentication
  const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-email',
    '/api/auth',
    '/api/register',
    '/_next',
    '/favicon.ico',
  ]

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  )

  // If it's a public route, continue
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Get the token from the request
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Redirect to login if not authenticated
  if (!token) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('callbackUrl', encodeURI(request.url))
    return NextResponse.redirect(loginUrl)
  }

  // Check if email is verified
  if (!token.emailVerified && !pathname.startsWith('/auth/verify-email')) {
    const verifyEmailUrl = new URL('/auth/verify-email', request.url)
    verifyEmailUrl.searchParams.set('callbackUrl', encodeURI(request.url))
    return NextResponse.redirect(verifyEmailUrl)
  }

  // Check if 2FA is required but not completed
  if (token.twoFactorRequired && !token.twoFactorVerified) {
    const twoFactorUrl = new URL('/auth/two-factor', request.url)
    twoFactorUrl.searchParams.set('callbackUrl', encodeURI(request.url))
    return NextResponse.redirect(twoFactorUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
