import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  featuresData,
  howItWorksData,
  testimonialsData } from
"@/data/landing";
import HeroSection from "@/components/hero";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const LandingPage = () => {
  const topFeatures = featuresData.slice(0, 4);

  return (
    <div className="landing-shell min-h-screen pt-24 md:pt-20">
      <section className="landing-section px-2 md:px-4">
        <HeroSection />
      </section>

      <section id="features" className="landing-section px-4 py-14 md:flex md:items-center md:py-0">
        <div className="container mx-auto">
          <div className="landing-fade-up mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-orange-600">Product signal</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">Everything essential. Nothing noisy.</h2>
            <p className="mt-4 text-muted-foreground">
              Built for short attention spans: fast capture, clear analytics, and actionable feedback.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {topFeatures.map((feature, index) =>
            <Card key={index} className={`landing-fade-up landing-hover-lift border-orange-100/80 bg-card/80 backdrop-blur dark:border-orange-900/40 ${index % 2 === 0 ? "landing-delay-1" : "landing-delay-2"}`}>
                <CardContent className="space-y-3 p-5">
                  <div className="inline-flex rounded-lg bg-orange-100 p-2 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <section id="proof" className="landing-section px-4 py-14 md:flex md:items-center md:py-0">
        <div className="container mx-auto space-y-10">
          <div className="landing-fade-up mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-orange-600">Trust and conversion</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">See the value in under a minute.</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {howItWorksData.map((step, index) =>
            <div key={index} className={`landing-fade-up landing-hover-lift rounded-2xl border bg-card/70 p-5 text-center landing-delay-${Math.min(index + 1, 3)}`}>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </div>
            )}
          </div>

          <div id="testimonials" className="grid gap-4 md:grid-cols-2">
            {testimonialsData.slice(0, 2).map((testimonial, index) =>
            <Card key={index} className={`landing-fade-up landing-hover-lift border bg-card/80 ${index === 0 ? "landing-delay-1" : "landing-delay-2"}`}>
                <CardContent className="p-5">
                  <p className="text-sm leading-relaxed text-muted-foreground">"{testimonial.quote}"</p>
                  <p className="mt-3 text-sm font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="landing-fade-up landing-delay-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 p-6 text-center text-white md:p-8">
            <h3 className="text-2xl font-bold">Ready to run your money like a control room?</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-orange-50 md:text-base">
              Jump in, log your first transactions, and watch real insights kick in.
            </p>
            <Link href="/dashboard" className="mt-5 inline-flex">
              <Button size="lg" className="landing-pulse bg-white text-orange-700 hover:bg-orange-100">
                Launch Gullak
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>);

};

export default LandingPage;
