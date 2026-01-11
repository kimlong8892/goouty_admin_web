import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/signin",
        error: "/signin",
    },
    debug: true,
    trustHost: true,
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnSignin = nextUrl.pathname.startsWith("/signin");
            const isOnSignup = nextUrl.pathname.startsWith("/signup");

            if (isOnSignin || isOnSignup) {
                if (isLoggedIn) return Response.redirect(new URL("/", nextUrl));
                return true;
            }

            return isLoggedIn;
        },
    },
    providers: [], // Add empty providers to satisfy NextAuthConfig, we'll override in auth.ts
} satisfies NextAuthConfig;
