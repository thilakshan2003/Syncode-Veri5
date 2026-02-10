import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isStaffRoute = nextUrl.pathname.startsWith("/staff") && nextUrl.pathname !== "/staff/login";

    if (isStaffRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/staff/login", nextUrl));
    }

    if (isStaffRoute && isLoggedIn) {
        const user = req.auth.user;
        const clinicSlug = nextUrl.pathname.split("/")[2];

        // Ensure the staff member is accessing THEIR clinic
        if (user.clinicSlug !== clinicSlug && user.staffRole !== "admin") {
            // Redirect to their own dashboard if they try to access another
            return NextResponse.redirect(new URL(`/staff/${user.clinicSlug}`, nextUrl));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
