import React from "react";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";
import Image from "next/image";
import { AppSidebar } from "./app-sidebar";

const Header = async () => {
  await checkUser();

  return (
    <>
      {/* Landing page header — only visible when signed out */}
      <SignedOut>
        <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
          <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/">
              <Image
                src={"/logo_white.png"}
                alt="Gullak Logo"
                width={320}
                height={128}
                className="h-32 w-auto object-contain"
              />
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-orange-600">
                Features
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-orange-600"
              >
                Testimonials
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <SignInButton forceRedirectUrl="/dashboard">
                <span className={buttonVariants({ variant: "outline" })}>
                  Login
                </span>
              </SignInButton>
            </div>
          </nav>
        </header>
      </SignedOut>

      {/* App top bar — only visible when signed in */}
      <SignedIn>
        <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-background/80 backdrop-blur-md z-30 border-b flex items-center justify-between px-4">
          <AppSidebar />
          <div className="flex items-center gap-3 ml-auto">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </div>
        </header>
      </SignedIn>
    </>
  );
};

export default Header;
