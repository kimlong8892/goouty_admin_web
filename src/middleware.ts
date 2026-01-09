import { auth } from "@/auth"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { pathname } = req.nextUrl

    // Public paths that do not require authentication
    if (pathname.startsWith('/signin') ||
        pathname.startsWith('/signup') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname === '/favicon.ico') {

        if (isLoggedIn && (pathname.startsWith('/signin') || pathname.startsWith('/signup'))) {
            return Response.redirect(new URL('/', req.nextUrl))
        }
        return
    }

    if (!isLoggedIn) {
        return Response.redirect(new URL('/signin', req.nextUrl))
    }
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
