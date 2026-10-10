"use client";

import { useAppStore, type ViewKey } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sparkles, Bookmark, Users, BarChart3, FolderHeart, Chrome, Shield,
  Zap, TrendingUp, Eye, Download, Bell, Crown, Check, Star, ArrowRight,
  Play, Quote, Layers, Globe, Clock, FileText, Filter, Search,
} from "lucide-react";
import { planFeatures } from "@/lib/mock-data";
import { sonnerToast } from "@/lib/toast-helpers";

export function LandingView() {
  const goApp = useAppStore((s) => s.goApp);
  const setView = useAppStore((s) => s.setView);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 min-h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-sunset-gradient flex items-center justify-center shadow-lg shadow-sunset-orange/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold leading-none">AdSpy Lite</p>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Competitor Research</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {[
              { l: "Features", v: null as ViewKey | null },
              { l: "Pricing", v: "pricing" as ViewKey | null },
              { l: "Competitors", v: null as ViewKey | null },
              { l: "FAQ", v: null as ViewKey | null },
            ].map((item) => (
              <button
                key={item.l}
                onClick={() => item.v && setView(item.v)}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
              >
                {item.l}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={() => setView("login")}>Sign in</Button>
            <Button size="sm" className="bg-sunset-gradient hover:opacity-90 text-white shadow-md shadow-sunset-orange/30 px-2.5 sm:px-3" onClick={goApp}>
              <span className="sm:hidden">Get Started</span>
              <span className="hidden sm:inline">Get Started Free</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-sunset-radial" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "radial-gradient(circle at 15% 25%, #EA611333 0%, transparent 35%), radial-gradient(circle at 85% 75%, #FBB93133 0%, transparent 40%)",
        }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 xl:pt-24 pb-12 sm:pb-16">
          <div className="grid xl:grid-cols-2 gap-10 xl:gap-12 items-center">
            <div className="min-w-0 space-y-5 sm:space-y-6">
              <Badge className="bg-sunset-cream/60 text-[#7A3A0E] border-sunset-amber/30 hover:bg-sunset-cream/80">
                <Chrome className="h-3 w-3 mr-1" />
                Chrome Extension + Web Dashboard
              </Badge>
              <h1 className="text-[clamp(2.25rem,6vw,4.5rem)] font-bold tracking-tight leading-[1.05] break-words">
                Spy on competitor{" "}
                <span className="text-sunset-gradient">Facebook & Instagram ads</span>{" "}
                — without the manual work.
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                AdSpy Lite overlays on Meta Ad Library so you can{" "}
                <span className="font-semibold text-foreground">save, organize, tag & analyze</span>{" "}
                competitor ads in one click. Built for digital marketers, agencies & e-commerce sellers in South Asia.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="bg-sunset-gradient hover:opacity-90 text-white shadow-lg shadow-sunset-orange/30 h-12 px-7 text-base" onClick={goApp}>
                  <Chrome className="h-5 w-5 mr-2" />
                  Add to Chrome — Free
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-7 text-base border-sunset-orange/40 hover:bg-sunset-cream/30" onClick={goApp}>
                  <Play className="h-4 w-4 mr-2" />
                  Watch demo
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-2">
                <div className="flex -space-x-2">
                  {["#EA6113", "#F88F22", "#FBB931", "#FF9F45", "#B84A0E"].map((c, i) => (
                    <Avatar key={i} className="h-8 w-8 border-2 border-background" style={{ backgroundColor: c }}>
                      <AvatarFallback className="text-[9px] text-white font-bold bg-transparent">M{i + 1}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-sunset-amber text-sunset-amber" />)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Loved by 2,400+ marketers</p>
                </div>
              </div>
            </div>

            <div className="relative min-w-0 w-full max-w-3xl mx-auto xl:max-w-none">
              <HeroMockup />
            </div>
          </div>

          <div className="mt-16 lg:mt-24 pt-10 border-t border-border/40">
            <p className="text-center text-xs text-muted-foreground uppercase tracking-wider mb-6">Works with the tools you already research on</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              {["Meta Ad Library", "Facebook Ads", "Instagram Ads", "Chrome Web Store", "Pakistani Brands", "South Asian Markets"].map((t) => (
                <span key={t} className="text-sm font-semibold">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem section */}
      <section className="py-20 border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4 border-sunset-orange/40 text-sunset-deep">The Problem</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Meta Ad Library is free — but painful</h2>
            <p className="text-muted-foreground">Native tool gives you ad transparency, but zero workflow. Here's what marketers actually struggle with:</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Search, title: "No saving", desc: "Find a great ad, refresh the page, it's gone forever." },
              { icon: Layers, title: "No organizing", desc: "Can't group by competitor, niche, or campaign type." },
              { icon: TrendingUp, title: "No analytics", desc: "No way to see which CTAs, formats, or colors trend." },
              { icon: Clock, title: "Time-consuming", desc: "Manual screenshotting & spreadsheet tracking kills hours." },
            ].map((p) => (
              <Card key={p.title} className="p-5 border-border/60 hover:border-sunset-orange/40 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-3">
                  <p.icon className="h-5 w-5 text-red-500" />
                </div>
                <h3 className="font-semibold mb-1">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-sunset-radial border-y border-border/40">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge className="mb-4 bg-sunset-cream/60 text-[#7A3A0E] border-sunset-amber/30">
              <Zap className="h-3 w-3 mr-1" />
              Everything you need
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">From ad discovery to actionable insights</h2>
            <p className="text-muted-foreground">A complete competitor research workflow — extension-first, lightweight, and built for speed.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Bookmark, title: "1-Click Save", desc: "Overlay \"Save Ad\" button on every Meta Ad Library card. Screenshot + metadata captured instantly.", color: "#EA6113" },
              { icon: FolderHeart, title: "Folders & Tags", desc: "Organize saved ads into folders (\"Competitor A\", \"Clothing Niche\") with color-coded tags.", color: "#F88F22" },
              { icon: Users, title: "Competitor Tracking", desc: "Track unlimited competitors. See all their active ads in one list, auto-updated weekly.", color: "#FBB931" },
              { icon: BarChart3, title: "Pattern Analytics", desc: "See which CTA words, ad formats, and creative styles are trending across your saved ads.", color: "#B84A0E" },
              { icon: Clock, title: "Ad Longevity Tracker", desc: "Know exactly how long an ad has been running. Long-running = high performer. Steal the pattern.", color: "#FF9F45" },
              { icon: Download, title: "Export Anywhere", desc: "Export saved ads as CSV or branded PDF reports. Perfect for client presentations.", color: "#EA6113" },
              { icon: Bell, title: "New Ad Alerts", desc: "Get notified when a tracked competitor launches new ads. Never miss a creative pivot.", color: "#F88F22" },
              { icon: FileText, title: "Notes & Observations", desc: "Jot down your analysis on every saved ad. Build a personal swipe file of insights.", color: "#FBB931" },
              { icon: Shield, title: "Privacy-First", desc: "Only saves publicly visible metadata & screenshots. No bulk scraping. ToS-compliant by design.", color: "#7A3A0E" },
            ].map((f) => (
              <Card key={f.title} className="p-5 group hover:shadow-xl hover:shadow-sunset-orange/10 hover:-translate-y-1 transition-all duration-300 border-border/60">
                <div
                  className="h-11 w-11 rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: f.color }}
                >
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="outline" className="mb-4 border-sunset-orange/40 text-sunset-deep">How it works</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">From install to insights in 3 minutes</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "01", icon: Chrome, title: "Install the extension", desc: "Add AdSpy Lite to Chrome. It activates automatically when you visit Meta Ad Library.", color: "#EA6113" },
              { step: "02", icon: Eye, title: "Browse & save ads", desc: "A \"Save Ad\" button appears on every ad card. Click to capture screenshot, copy, and metadata.", color: "#F88F22" },
              { step: "03", icon: BarChart3, title: "Organize & analyze", desc: "Open the dashboard to organize into folders, tag, add notes, and spot creative patterns.", color: "#FBB931" },
            ].map((s) => (
              <div key={s.step} className="relative">
                <Card className="p-6 h-full border-border/60 hover:border-sunset-orange/40 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.color }}>
                      <s.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-4xl font-bold text-muted-foreground/20">{s.step}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-sunset-radial border-y border-border/40">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge className="mb-4 bg-sunset-cream/60 text-[#7A3A0E] border-sunset-amber/30">
              <Crown className="h-3 w-3 mr-1" />
              Simple pricing
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Affordable for freelancers. Powerful for agencies.</h2>
            <p className="text-muted-foreground">Start free forever. Upgrade when you're ready. Local payment methods supported (JazzCash, EasyPaisa).</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {(["free", "pro", "agency"] as const).map((planKey) => {
              const plan = planFeatures[planKey];
              const isPro = planKey === "pro";
              return (
                <Card
                  key={planKey}
                  className={cn(
                    "relative p-6 flex flex-col transition-all",
                    isPro
                      ? "border-2 border-sunset-orange shadow-xl shadow-sunset-orange/20 lg:scale-105 bg-card"
                      : "border-border/60 hover:border-sunset-orange/40"
                  )}
                >
                  {isPro && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-sunset-gradient text-white shadow-md">Most Popular</Badge>
                    </div>
                  )}
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: plan.accent }}>
                        {planKey === "free" && <Star className="h-4 w-4 text-white" />}
                        {planKey === "pro" && <Zap className="h-4 w-4 text-white" />}
                        {planKey === "agency" && <Crown className="h-4 w-4 text-white" />}
                      </div>
                      <h3 className="font-bold text-lg">{plan.name}</h3>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-sm text-muted-foreground">{plan.priceLabel}</span>
                    </div>
                  </div>
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 mt-0.5 shrink-0" style={{ color: plan.accent }} />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={cn("w-full h-11", isPro ? "bg-sunset-gradient hover:opacity-90 text-white" : "variant-outline")}
                    variant={isPro ? "default" : "outline"}
                    onClick={() => { goApp(); sonnerToast.success(`Started ${plan.name} plan — explore the dashboard!`); }}
                  >
                    {plan.price === 0 ? "Start Free" : `Choose ${plan.name}`}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Card>
              );
            })}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-8">
            Prices in USD for international users. Local pricing available for Pakistan & South Asia. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="outline" className="mb-4 border-sunset-orange/40 text-sunset-deep">Testimonials</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Marketers save 6+ hours every week</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: "Ayesha Khan", role: "Media Buyer, Lahore", color: "#EA6113", text: "Finally a tool that doesn't cost $149/month. I track 8 competitors and the weekly digest catches every new creative. Game-changer.", rating: 5 },
              { name: "Bilal Ahmed", role: "Agency Owner, Karachi", color: "#F88F22", text: "The team workspace feature lets my team track different clients separately. White-label PDF exports impress clients every meeting.", rating: 5 },
              { name: "Sana Malik", role: "E-commerce Founder, Islamabad", color: "#FBB931", text: "I used to screenshot ads manually into a folder. Now I just click save and everything is organized. Worth every rupee.", rating: 5 },
            ].map((t) => (
              <Card key={t.name} className="p-6 border-border/60 relative overflow-hidden">
                <Quote className="absolute top-4 right-4 h-8 w-8 text-muted-foreground/15" />
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-sunset-amber text-sunset-amber" />)}
                </div>
                <p className="text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10" style={{ backgroundColor: t.color }}>
                    <AvatarFallback className="text-xs text-white font-bold bg-transparent">{t.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-sunset-radial border-y border-border/40">
        <div className="mx-auto max-w-3xl px-4 lg:px-6">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-sunset-orange/40 text-sunset-deep">FAQ</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold">Questions, answered</h2>
          </div>
          <div className="space-y-3">
            {[
              { q: "Is this legal? Doesn't Meta prohibit scraping?", a: "AdSpy Lite only saves publicly visible ad data that you manually choose to save (one click at a time). We do NOT do bulk automated scraping. This is research/reference use, fully compliant with Meta Ad Library's public transparency purpose." },
              { q: "Do I need a separate account or can I use it on the Ad Library directly?", a: "Both! The Chrome extension overlays directly on Meta Ad Library. The web dashboard (this site) is for viewing, organizing, and analyzing your saved ads across devices." },
              { q: "What happens if Meta changes their Ad Library page structure?", a: "Our DOM detection logic is modular and monitored 24/7. When Meta updates their layout, we push an extension update within 24-48 hours. You'll never be stuck." },
              { q: "Can I use this for clients as an agency?", a: "Yes! The Agency plan includes multi-client workspaces, team roles (Admin/Editor/Viewer), white-label PDF reports, and API access to integrate with your own dashboards." },
              { q: "Do you support local payment methods?", a: "Yes — JazzCash and EasyPaisa are supported for Pakistani users alongside Stripe for international payments. Local pricing is also discounted for South Asian markets." },
              { q: "What's the difference between AdSpy Lite and AdSpy/BigSpy?", a: "We're extension-first (no separate platform to learn), 10x cheaper ($15 vs $149), and focused on South Asian brands. We don't try to be everything — we do save/organize/analyze exceptionally well." },
            ].map((f, i) => (
              <details key={i} className="group rounded-xl border border-border/60 bg-card overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer list-none font-medium text-sm hover:bg-muted/40 transition-colors">
                  {f.q}
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 lg:px-6">
          <div className="relative rounded-3xl bg-sunset-gradient p-6 sm:p-10 lg:p-14 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: "radial-gradient(circle at 20% 30%, white 1.5px, transparent 1.5px), radial-gradient(circle at 70% 60%, white 1.5px, transparent 1.5px)",
              backgroundSize: "40px 40px",
            }} />
            <div className="relative">
              <Globe className="h-8 w-8 sm:h-9 sm:w-9 text-white mx-auto mb-3 sm:mb-4" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-white mb-3 sm:mb-4">Start spying on competitor ads today</h2>
              <p className="text-white/95 text-base sm:text-lg mb-6 sm:mb-8 max-w-xl mx-auto">Free forever for small usage. No credit card required. Install in 30 seconds.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" variant="secondary" className="h-11 sm:h-12 w-full sm:w-auto px-5 sm:px-7 text-sm sm:text-base bg-white text-sunset-deep hover:bg-white/90" onClick={goApp}>
                  <Chrome className="h-5 w-5 mr-2" />
                  Add to Chrome — Free
                </Button>
                <Button size="lg" variant="default" className="h-11 sm:h-12 w-full sm:w-auto px-5 sm:px-7 text-sm sm:text-base bg-sunset-deep text-white hover:bg-[#c64c0d]" onClick={goApp}>
                  Explore Dashboard Demo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-sidebar/30 mt-auto">
        <div className="mx-auto max-w-7xl px-4 lg:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            <div className="col-span-2 md:col-span-3 lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-lg bg-sunset-gradient flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold">AdSpy Lite</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs mb-4">Competitor ad research made simple. Save, organize, and analyze Facebook & Instagram ads from Meta Ad Library.</p>
              <div className="flex gap-2">
                {["Twitter", "LinkedIn", "YouTube"].map((s) => (
                  <button key={s} className="h-8 w-8 rounded-lg bg-muted hover:bg-sunset-cream/40 transition-colors flex items-center justify-center text-[10px] font-bold">
                    {s.slice(0, 2)}
                  </button>
                ))}
              </div>
            </div>
            {[
              { title: "Product", links: [{ l: "Features", v: null }, { l: "Pricing", v: "pricing" }, { l: "Chrome Extension", v: null }, { l: "Roadmap", v: null }, { l: "Changelog", v: null }] },
              { title: "Company", links: [{ l: "About", v: null }, { l: "Blog", v: null }, { l: "Careers", v: null }, { l: "Contact", v: null }, { l: "Partners", v: null }] },
              { title: "Resources", links: [{ l: "Support", v: "support" }, { l: "Documentation", v: null }, { l: "API Keys", v: "api-keys" }, { l: "Sign In", v: "login" }, { l: "Status", v: null }] },
              { title: "Legal", links: [{ l: "Privacy Policy", v: null }, { l: "Terms of Service", v: null }, { l: "Cookie Policy", v: null }, { l: "Meta Compliance", v: null }, { l: "Refunds", v: null }] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-sm font-semibold mb-3">{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map((item) => (
                    <li key={item.l}>
                      <button
                        onClick={() => item.v && setView(item.v as ViewKey)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.l}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">© 2024 AdSpy Lite. Built for South Asian marketers. Not affiliated with Meta.</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              All systems operational
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HeroMockup() {
  return (
    <div className="relative">
      <div className="rounded-2xl bg-card border border-border shadow-2xl shadow-sunset-orange/20 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/60 bg-muted/40">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-amber-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 mx-2">
            <div className="h-6 rounded-md bg-background border border-border/60 px-3 flex items-center text-[10px] text-muted-foreground">
              <Shield className="h-2.5 w-2.5 mr-1.5 text-green-500" />
              facebook.com/ads/library
            </div>
          </div>
          <Sparkles className="h-4 w-4 text-sunset-orange" />
        </div>

        <div className="p-4 bg-sunset-radial">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-sunset-deep" />
              <span className="text-xs font-semibold">Active Ads — Khaadi</span>
              <Badge className="h-4 text-[9px] px-1 bg-sunset-gradient text-white">42 ads</Badge>
            </div>
            <span className="text-[10px] text-muted-foreground">AdSpy Lite overlay active</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { color: "#EA6113", cta: "Shop Now", days: 28, title: "Winter Collection 2024" },
              { color: "#F88F22", cta: "Get Offer", days: 14, title: "Eid Special — 50% Off" },
              { color: "#FBB931", cta: "Order Now", days: 45, title: "New Arrivals Weekly" },
              { color: "#B84A0E", cta: "Sign Up", days: 7, title: "Unstitched Sale" },
            ].map((ad, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-border/60 bg-card relative group">
                <div className="aspect-[4/3] relative" style={{ background: `linear-gradient(135deg, ${ad.color}, ${ad.color}aa)` }}>
                  <div className="absolute inset-0 opacity-25" style={{
                    backgroundImage: "radial-gradient(circle at 30% 40%, white 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }} />
                  <span className="absolute top-1.5 left-1.5 rounded-full bg-black/30 backdrop-blur-md px-1.5 py-0.5 text-[8px] font-bold text-white">
                    {ad.days}d
                  </span>
                  <button className="absolute top-1.5 right-1.5 rounded-full bg-sunset-deep px-1.5 py-0.5 text-[8px] font-bold text-white flex items-center gap-0.5 shadow-lg animate-sunset-glow">
                    <Bookmark className="h-2.5 w-2.5 fill-white" />
                    Save
                  </button>
                  <div className="absolute inset-x-0 bottom-0 p-1.5 pt-4 bg-gradient-to-t from-black/50 to-transparent">
                    <p className="text-[8px] font-bold text-white truncate">{ad.title}</p>
                  </div>
                </div>
                <div className="p-1.5 flex items-center justify-between">
                  <span className="text-[8px] text-muted-foreground">Khaadi</span>
                  <span className="text-[8px] font-bold text-sunset-deep bg-sunset-cream/50 px-1.5 py-0.5 rounded">{ad.cta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hidden sm:block absolute -bottom-5 -left-5 rounded-xl bg-card border border-border shadow-xl p-3 w-44 animate-float-slow">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="h-7 w-7 rounded-lg bg-sunset-gradient flex items-center justify-center">
            <TrendingUp className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <p className="text-[9px] text-muted-foreground">Saved this week</p>
            <p className="text-sm font-bold">+54 ads</p>
          </div>
        </div>
        <div className="flex items-end gap-0.5 h-8">
          {[40, 55, 45, 70, 60, 85, 95].map((h, i) => (
            <div key={i} className="flex-1 rounded-t bg-sunset-gradient" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>

      <div className="hidden sm:block absolute -top-3 -right-3 rounded-xl bg-card border border-border shadow-xl p-3 w-48 animate-float-slow" style={{ animationDelay: "1s" }}>
        <div className="flex items-start gap-2">
          <div className="h-7 w-7 rounded-lg bg-green-100 dark:bg-green-950/40 flex items-center justify-center shrink-0">
            <Bell className="h-3.5 w-3.5 text-green-600" />
          </div>
          <div>
            <p className="text-[10px] font-semibold">New ad alert!</p>
            <p className="text-[9px] text-muted-foreground">Sapphire launched 12 new ads</p>
          </div>
        </div>
      </div>
    </div>
  );
}
