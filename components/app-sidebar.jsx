"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PenBox,
  BarChart3,
  Settings,
  Menu,
  X,
  Mail } from
"lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle } from
"@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
{
  label: "Dashboard",
  href: "/dashboard",
  icon: LayoutDashboard
},
{
  label: "Add Transaction",
  href: "/transaction/create",
  icon: PenBox
},
{
  label: "Account Analytics",
  href: "/account-analytics",
  icon: BarChart3
},
{
  label: "Settings",
  href: "/settings",
  icon: Settings
}];


export function AppSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SidebarContent pathname={pathname} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>);

}

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 border-r bg-card z-40">
      <SidebarContent pathname={pathname} />
    </aside>);

}

function SidebarContent({ pathname, onNavigate }) {
  return (
    <div className="flex flex-col h-full">
      {}
      <div className="flex items-center px-4 py-4 border-b">
        <Link href="/dashboard" onClick={onNavigate}>
          <Image
            src="/logo_white.png"
            alt="Gullak Logo"
            width={160}
            height={64}
            className="h-12 w-auto object-contain dark:invert" />
          
        </Link>
      </div>

      {}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive ?
                "bg-primary text-primary-foreground" :
                "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}>
              
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>);

        })}
      </nav>

      {}
      <div className="px-3 py-4 border-t">
        <Link
          href="/settings"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
          
          <Mail className="h-4 w-4" />
          Contact Us
        </Link>
        <p className="text-xs text-muted-foreground px-3 mt-2">
          Gullak v1.0
        </p>
      </div>
    </div>);

}
