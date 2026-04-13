import React from "react";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { getCachedUser } from "@/lib/cachedUser";
import Image from "next/image";
import { AppSidebar } from "./app-sidebar";

import { getTranslator } from "@/lib/i18n/translations";

const Header = async ({ locale = "en" }) => {
  await getCachedUser();
  const t = getTranslator(locale);

  return (
    <>
      {}
      <SignedOut>
        <header className="fixed top-0 w-full bg-background/75 backdrop-blur-xl z-50 border-b border-orange-100/70 dark:border-orange-900/30">
          <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/">
              <Image
                src={"/logo_white.png"}
                alt="Gullak Logo"
                width={320}
                height={128}
                className="h-20 w-auto object-contain" />
              
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-orange-600">
                {t("header.features")}
              </a>
              <a
                href="#proof"
                className="text-muted-foreground hover:text-orange-600">
                {t("header.proof")}
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <SignInButton forceRedirectUrl="/dashboard">
                <span className={buttonVariants({ variant: "outline" })}>
                  {t("header.login")}
                </span>
              </SignInButton>
            </div>
          </nav>
        </header>
      </SignedOut>

      {}
      <SignedIn>
        <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-background/80 backdrop-blur-md z-30 border-b flex items-center justify-between px-4">
          <AppSidebar />
          <div className="flex items-center gap-3 ml-auto">
            <ClerkLoading>
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse"></div>
            </ClerkLoading>
            <ClerkLoaded>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10"
                  }
                }} />
            </ClerkLoaded>
            
          </div>
        </header>
      </SignedIn>
    </>);

};

export default Header;
