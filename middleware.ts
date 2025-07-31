// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const merchantToken = request.cookies.get('merchant-token')?.value
  const pathname = request.nextUrl.pathname

  const protectedRoutes = [
    '/Roles/Merchant',
  ]

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtected && !merchantToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

// Only run middleware on these routes
export const config = {
  matcher: ['/Roles/Merchant/:path*'],
}
