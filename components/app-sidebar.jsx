"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PenBox,
  BarChart3,
  Target,
  Repeat,
  FileSpreadsheet,
  Settings,
  Menu,
  Sparkles,
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
import { useLanguage } from "@/components/language-provider";

export function AppSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetTitle className="sr-only">{t("sidebar.navigationMenu")}</SheetTitle>
        <SidebarContent pathname={pathname} onNavigate={() => setOpen(false)} t={t} />
      </SheetContent>
    </Sheet>);

}

export function DesktopSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 border-r bg-card z-40">
      <SidebarContent pathname={pathname} t={t} />
    </aside>);

}

function SidebarContent({ pathname, onNavigate, t }) {
  const navGroups = [
  {
    title: t("sidebar.workspace"),
    items: [
    {
      label: t("sidebar.dashboard"),
      href: "/dashboard",
      icon: LayoutDashboard
    },
    {
      label: t("sidebar.analytics"),
      href: "/account-analytics",
      icon: BarChart3
    },
    {
      label: t("sidebar.goals"),
      href: "/goals",
      icon: Target
    },
    {
      label: t("sidebar.recurringCenter"),
      href: "/recurring-transactions",
      icon: Repeat
    },
    {
      label: t("sidebar.reports"),
      href: "/reports",
      icon: FileSpreadsheet
    }]
  },
  {
    title: t("sidebar.actions"),
    items: [
    {
      label: t("sidebar.quickAdd"),
      href: "/transaction/create",
      icon: PenBox
    },
    {
      label: t("sidebar.preferences"),
      href: "/settings",
      icon: Settings
    }]
  }];

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
      <nav className="flex-1 px-3 py-4 space-y-5">
        <div className="rounded-xl border bg-gradient-to-r from-orange-100/70 to-amber-100/70 p-3 dark:from-orange-900/20 dark:to-amber-900/10">
          <p className="flex items-center gap-2 text-sm font-medium text-orange-800 dark:text-orange-300">
            <Sparkles className="h-4 w-4" />
            {t("sidebar.weekFocus")}
          </p>
          <p className="mt-1 text-xs text-orange-700/90 dark:text-orange-200/80">
            {t("sidebar.weekFocusHint")}
          </p>
        </div>

        {navGroups.map((group) =>
        <div key={group.title} className="space-y-1">
            <p className="px-3 pb-1 text-[11px] uppercase tracking-wide text-muted-foreground">
              {group.title}
            </p>
            {group.items.map((item) => {
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
          </div>
        )}
      </nav>

      {}
      <div className="px-3 py-4 border-t">
        <Link
          href="/settings"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
          
          <Mail className="h-4 w-4" />
          {t("sidebar.contactUs")}
        </Link>
        <p className="text-xs text-muted-foreground px-3 mt-2">
          {t("sidebar.versionLabel")}
        </p>
      </div>
    </div>);

}
