"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, ShieldCheck, Zap, ArrowRight } from "lucide-react";

const HeroSection = ({ copy }) => {
  return (
    <section className="relative flex min-h-[calc(100vh-5rem)] items-center px-4 py-8 md:py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-120px] top-[12%] h-72 w-72 rounded-full bg-orange-300/25 blur-3xl" />
        <div className="absolute right-[-140px] top-[28%] h-80 w-80 rounded-full bg-amber-300/25 blur-3xl" />
        <div className="absolute bottom-[-120px] left-[35%] h-72 w-72 rounded-full bg-cyan-200/25 blur-3xl" />
      </div>

      <div className="container mx-auto grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6 text-center lg:text-left">
          <div className="landing-fade-up inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50/70 px-3 py-1 text-xs font-medium text-orange-700 dark:border-orange-900/50 dark:bg-orange-950/30 dark:text-orange-300">
            <Sparkles className="h-3.5 w-3.5" />
            {copy.badge}
          </div>

          <h1 className="landing-fade-up landing-delay-1 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            {copy.titleFirst}
            <br />
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-700 bg-clip-text text-transparent">
              {copy.titleSecond}
            </span>
          </h1>

          <p className="landing-fade-up landing-delay-2 mx-auto max-w-xl text-base text-muted-foreground sm:text-lg lg:mx-0">
            {copy.subtitle}
          </p>

          <div className="landing-fade-up landing-delay-2 flex flex-wrap justify-center gap-2 lg:justify-start">
            <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5 text-green-600" />{copy.secureAuth}</span>
            <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs text-muted-foreground"><Zap className="h-3.5 w-3.5 text-orange-500" />{copy.realtimeInsights}</span>
            <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs text-muted-foreground"><Sparkles className="h-3.5 w-3.5 text-cyan-600" />{copy.smartAutomation}</span>
          </div>

          <div className="landing-fade-up landing-delay-3 flex flex-wrap justify-center gap-3 lg:justify-start">
          <Link href="/dashboard">
            <Button size="lg" className="group px-8">
              {copy.enterDashboard}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>

          <div className="landing-fade-up landing-delay-3 grid grid-cols-3 gap-3 rounded-2xl border bg-card/70 p-3 text-left">
            <div>
              <p className="text-xs text-muted-foreground">{copy.users}</p>
              <p className="text-lg font-bold">{copy.usersValue}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{copy.tracked}</p>
              <p className="text-lg font-bold">{copy.trackedValue}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{copy.uptime}</p>
              <p className="text-lg font-bold">{copy.uptimeValue}</p>
            </div>
          </div>
        </div>

        <div className="hero-image-wrapper">
          <div className="hero-image landing-fade-up landing-delay-2 rounded-2xl border bg-card/70 p-3 shadow-xl">
            <Image
              src="/banner.jpeg"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-xl border mx-auto"
              priority />
          </div>
        </div>
      </div>
    </section>);

};

export default HeroSection;
