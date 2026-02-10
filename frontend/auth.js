import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            name: "Clinical Staff Login",
            credentials: {
                username: { label: "Username or Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }

                try {
                    // Call backend login API
                    const response = await axios.post(`${API_URL}/api/auth/login`, {
                        identifier: credentials.username,
                        password: credentials.password,
                    });

                    if (response.status === 200 && response.data.user) {
                        const userData = response.data.user;

                        // Check if user has staff info (as this is the staff login provider)
                        if (userData.staffInfo) {
                            return {
                                id: userData.id,
                                name: userData.username,
                                email: userData.email,
                                clinicId: userData.staffInfo.clinicId,
                                clinicSlug: userData.staffInfo.clinicSlug,
                                staffRole: userData.staffInfo.role,
                            };
                        }
                    }
                    return null;
                } catch (error) {
                    console.error("Auth error:", error.response?.data || error.message);
                    return null;
                }
            },
        }),
    ],
});
