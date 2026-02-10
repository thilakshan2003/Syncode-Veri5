
export const authConfig = {
    pages: {
        signIn: "/staff/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.clinicId = user.clinicId;
                token.clinicSlug = user.clinicSlug;
                token.staffRole = user.staffRole;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.clinicId = token.clinicId;
                session.user.clinicSlug = token.clinicSlug;
                session.user.staffRole = token.staffRole;
            }
            return session;
        },
    },
    providers: [], // Add providers with an empty array for now
};
