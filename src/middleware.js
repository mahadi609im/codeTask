import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = token?.role;

  const instructorOnlyPaths = [
    '/assignments/new',
    '/instructor',
    '/analytics',
    '/instructor-dashboard',
  ];

  if (
    instructorOnlyPaths.some(path => pathname.startsWith(path)) &&
    role !== 'instructor'
  ) {
    return NextResponse.redirect(new URL('/assignments', req.url));
  }

  const studentOnlyPaths = [
    '/assignments/my-submissions',
    '/my-submissions',
    '/student-dashboard',
  ];

  if (
    studentOnlyPaths.some(path => pathname.startsWith(path)) &&
    role !== 'student'
  ) {
    return NextResponse.redirect(new URL('/assignments', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/assignments/new',
    '/assignments/new/:path*',
    '/assignments/my-submissions',
    '/assignments/my-submissions/:path*',
    '/my-submissions',
    '/my-submissions/:path*',
    '/instructor/:path*',
    '/analytics/:path*',
    '/instructor-dashboard/:path*',
    '/student-dashboard/:path*',
  ],
};
