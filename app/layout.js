import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { getLocaleFromCookie } from "@/lib/i18n/server";
import { LanguageProvider } from "@/components/language-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Gullak",
  description: "One stop Finance Platform"
};

export default async function RootLayout({ children }) {
  const locale = await getLocaleFromCookie();

  return (
    <ClerkProvider>
      <html lang={locale} suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo_white.png" sizes="any" />
        </head>
        <body className={`${inter.className}`}>
          <LanguageProvider initialLocale={locale}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange>
              <Header locale={locale} />
              <main className="min-h-screen">{children}</main>
              <Toaster richColors />
            </ThemeProvider>
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>);

}
