import { Inter } from "next/font/google";
import "./globals.css";

import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Veri5 - Secure Health Status",
  description: "Verified sexual health testing and sharing.",
};

import { AuthProvider } from "@/context/AuthContext";
import AuthGate from "@/components/AuthGate";
import { ThemeProvider } from "@/components/ThemeProvider";
import ChatBot from "@/components/ChatBot";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <SessionProvider>
              <AuthGate>{children}</AuthGate>
              <Footer />
              <ChatBot />
            </SessionProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
