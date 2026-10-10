"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  Moon,
  Sun,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Star,
  Zap,
  Crown,
  Chrome,
  ChevronDown,
  Wallet,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { planFeatures } from "@/lib/mock-data";
import type { UserRole } from "@/lib/mock-data";
import { sonnerToast } from "@/lib/toast-helpers";

type PlanKey = "free" | "pro" | "agency";

const PLAN_ORDER: PlanKey[] = ["free", "pro", "agency"];

const PLAN_ICONS: Record<PlanKey, typeof Star> = {
  free: Star,
  pro: Zap,
  agency: Crown,
};

type BillingCycle = "monthly" | "yearly";

/** Comparison table rows. value is per-plan string; status is per-plan 'yes'|'no'|'text' */
type CompareRow = {
  label: string;
  values: { free: string; pro: string; agency: string };
  kind: "text" | "bool";
};

const COMPARE_ROWS: CompareRow[] = [
  { label: "Saved ads", kind: "text", values: { free: "20", pro: "Unlimited", agency: "Unlimited" } },
  { label: "Competitors", kind: "text", values: { free: "1", pro: "10", agency: "Unlimited" } },
  { label: "Folders & tags", kind: "text", values: { free: "2", pro: "Unlimited", agency: "Unlimited" } },
  { label: "Team members", kind: "text", values: { free: "—", pro: "—", agency: "50" } },
  { label: "Pattern analytics", kind: "bool", values: { free: "false", pro: "true", agency: "true" } },
  { label: "API access", kind: "bool", values: { free: "false", pro: "false", agency: "true" } },
  { label: "White-label reports", kind: "bool", values: { free: "false", pro: "false", agency: "true" } },
  { label: "Support", kind: "text", values: { free: "Community", pro: "Email", agency: "Priority" } },
];

const FAQ_ITEMS = [
  {
    q: "Can I switch plans later?",
    a: "Yes — upgrade or downgrade at any time from Settings → Billing. We prorate the difference automatically. Annual plans get credit toward the new plan.",
  },
  {
    q: "Which local payment methods do you support?",
    a: "For Pakistan & South Asia, we support JazzCash and EasyPaisa alongside Stripe for international cards. Local pricing is also discounted to match regional purchasing power.",
  },
  {
    q: "Is there a free trial for Pro or Agency?",
    a: "The Free plan is free forever — no credit card required. Pro and Agency don't have a separate trial, but you can upgrade and cancel anytime within the first 7 days for a full refund.",
  },
  {
    q: "Do you offer team / multi-client workspaces?",
    a: "Yes — the Agency plan includes up to 50 team members, multi-client workspaces, role-based access (Admin/Editor/Viewer), and shareable swipe files. Perfect for agencies and freelancers managing multiple brands.",
  },
];

const PAYMENT_METHODS = [
  { name: "JazzCash", color: "#E4002B", bg: "linear-gradient(135deg, #E4002B, #FF4D6D)" },
  { name: "EasyPaisa", color: "#00A551", bg: "linear-gradient(135deg, #00A551, #2ECC71)" },
  { name: "Stripe", color: "#635BFF", bg: "linear-gradient(135deg, #635BFF, #8A82FF)" },
  { name: "Visa", color: "#1A1F71", bg: "linear-gradient(135deg, #1A1F71, #4250A8)" },
  { name: "Mastercard", color: "#EB001B", bg: "linear-gradient(135deg, #EB001B, #F79E1B)" },
];

const FOOTER_COLUMNS = [
  { title: "Product", links: ["Features", "Pricing", "Chrome Extension", "Roadmap", "Changelog"] },
  { title: "Company", links: ["About", "Blog", "Careers", "Contact", "Partners"] },
  { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Meta Compliance", "Refunds"] },
];

export function PricingView() {
  const { role, theme, toggleTheme, setView, login, goLanding } = useAppStore();
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  const isYearly = cycle === "yearly";

  /** Yearly = 20% off the monthly price (billed annually). Display the per-month equivalent. */
  const discountedPrice = (price: number) =>
    price === 0 ? 0 : Math.round(price * 0.8 * 100) / 100;

  const handleChoosePlan = (planKey: PlanKey) => {
    if (role === planKey) {
      sonnerToast.info(`You're already on the ${planFeatures[planKey].name} plan`);
      setView("dashboard");
      return;
    }
    login(planKey);
    sonnerToast.success(`Started ${planFeatures[planKey].name} plan!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 lg:px-6 h-16 flex items-center justify-between">
          <button
            onClick={goLanding}
            className="flex items-center gap-2"
            title="Back to home"
          >
            <div className="h-9 w-9 rounded-xl bg-sunset-gradient flex items-center justify-center shadow-lg shadow-sunset-orange/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-bold leading-none">AdSpy Lite</p>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Pricing</p>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex"
              onClick={goLanding}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Home
            </Button>
            <Button
              size="sm"
              className="bg-sunset-gradient hover:opacity-90 text-white shadow-md shadow-sunset-orange/30"
              onClick={() => setView("dashboard")}
            >
              Back to app
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
              title="Toggle theme"
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-sunset-radial" />
        <div className="relative mx-auto max-w-3xl px-4 lg:px-6 pt-16 lg:pt-20 pb-10 text-center">
          <Badge className="mb-4 bg-sunset-cream/60 text-[#7A3A0E] border-sunset-amber/30">
            <Crown className="h-3 w-3 mr-1" />
            Pricing
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05] mb-4">
            Simple, <span className="text-sunset-gradient">transparent pricing</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Affordable for freelancers. Powerful for agencies. Local payment methods supported.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center gap-3">
            <div className="inline-flex h-10 items-center rounded-lg bg-muted p-1">
              <button
                onClick={() => setCycle("monthly")}
                className={cn(
                  "h-8 px-4 rounded-md text-sm font-medium transition-all",
                  !isYearly ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setCycle("yearly")}
                className={cn(
                  "h-8 px-4 rounded-md text-sm font-medium transition-all inline-flex items-center gap-1.5",
                  isYearly ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                )}
              >
                Yearly
                <Badge className="h-4 text-[9px] px-1 bg-sunset-gradient text-white">-20%</Badge>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Plan cards */}
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {PLAN_ORDER.map((planKey) => {
              const plan = planFeatures[planKey];
              const isPro = planKey === "pro";
              const isCurrent = role === planKey;
              const Icon = PLAN_ICONS[planKey];
              const shown = isYearly ? discountedPrice(plan.price) : plan.price;
              const isPaid = plan.price > 0;

              return (
                <Card
                  key={planKey}
                  className={cn(
                    "relative p-6 flex flex-col transition-all",
                    isPro
                      ? "border-2 border-sunset-orange shadow-xl shadow-sunset-orange/20 lg:scale-105 bg-card z-10"
                      : "border-border/60 hover:border-sunset-orange/40"
                  )}
                >
                  {isPro && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-sunset-gradient text-white shadow-md">Most Popular</Badge>
                    </div>
                  )}

                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="h-9 w-9 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: plan.accent }}
                      >
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="font-bold text-lg">{plan.name}</h3>
                      {isCurrent && (
                        <Badge variant="outline" className="ml-auto border-sunset-orange/40 text-sunset-deep">
                          Current
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-4xl font-bold">${shown}</span>
                      <span className="text-sm text-muted-foreground">
                        {plan.price === 0 ? plan.priceLabel : isYearly ? "/mo, billed yearly" : plan.priceLabel}
                      </span>
                    </div>
                    {isYearly && isPaid && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground line-through">${plan.price}/mo</span>
                        <Badge className="h-5 text-[10px] px-1.5 bg-sunset-cream/70 text-[#7A3A0E] border-sunset-amber/40">
                          Save ${Math.round((plan.price - shown) * 12)}/yr
                        </Badge>
                      </div>
                    )}
                  </div>

                  <Separator className="mb-4" />

                  <ul className="space-y-2.5 mb-6 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <span
                          className="mt-0.5 shrink-0 h-4 w-4 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${plan.accent}20`, color: plan.accent }}
                        >
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={cn(
                      "w-full h-11",
                      isPro
                        ? "bg-sunset-gradient hover:opacity-90 text-white"
                        : isCurrent
                          ? "variant-outline"
                          : "variant-outline hover:border-sunset-orange/40"
                    )}
                    variant={isPro ? "default" : "outline"}
                    disabled={isCurrent}
                    onClick={() => handleChoosePlan(planKey)}
                  >
                    {isCurrent ? (
                      <>Current plan</>
                    ) : (
                      <>
                        Choose {plan.name}
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>
                </Card>
              );
            })}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8">
            Prices in USD for international users. Local pricing available for Pakistan &amp; South Asia.
            Cancel anytime. 7-day money-back guarantee on paid plans.
          </p>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-14 bg-sunset-radial border-y border-border/40">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge variant="outline" className="mb-4 border-sunset-orange/40 text-sunset-deep">
              <HelpCircle className="h-3 w-3 mr-1" />
              Compare plans
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-3">Every feature, side by side</h2>
            <p className="text-muted-foreground">A detailed breakdown so you can pick the right plan.</p>
          </div>

          {/* Desktop table */}
          <Card className="overflow-hidden border-border/60 hidden md:block">
            <div className="grid grid-cols-4 bg-muted/40">
              <div className="p-4 text-sm font-semibold text-muted-foreground">Feature</div>
              {PLAN_ORDER.map((pk) => (
                <div
                  key={pk}
                  className={cn(
                    "p-4 text-center",
                    pk === "pro" && "bg-sunset-cream/30"
                  )}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <div
                      className="h-6 w-6 rounded-md flex items-center justify-center"
                      style={{ backgroundColor: planFeatures[pk].accent }}
                    >
                      {(() => {
                        const I = PLAN_ICONS[pk];
                        return <I className="h-3 w-3 text-white" />;
                      })()}
                    </div>
                    <span className="font-bold text-sm">{planFeatures[pk].name}</span>
                  </div>
                </div>
              ))}
            </div>

            {COMPARE_ROWS.map((row, idx) => (
              <div
                key={row.label}
                className={cn(
                  "grid grid-cols-4 border-t border-border/40",
                  idx % 2 === 1 && "bg-muted/20"
                )}
              >
                <div className="p-4 text-sm font-medium">{row.label}</div>
                {PLAN_ORDER.map((pk) => {
                  const v = row.values[pk];
                  return (
                    <div
                      key={pk}
                      className={cn(
                        "p-4 text-center text-sm flex items-center justify-center",
                        pk === "pro" && "bg-sunset-cream/15"
                      )}
                    >
                      {row.kind === "bool" ? (
                        v === "true" ? (
                          <Check className="h-4 w-4 text-green-600" strokeWidth={3} />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground/40" strokeWidth={2.5} />
                        )
                      ) : (
                        <span className={cn(v === "—" && "text-muted-foreground/50")}>{v}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </Card>

          {/* Mobile stacked cards */}
          <div className="md:hidden space-y-4">
            {PLAN_ORDER.map((pk) => {
              const plan = planFeatures[pk];
              const isPro = pk === "pro";
              const Icon = PLAN_ICONS[pk];
              return (
                <Card
                  key={pk}
                  className={cn(
                    "p-5",
                    isPro ? "border-2 border-sunset-orange" : "border-border/60"
                  )}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: plan.accent }}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold">{plan.name}</span>
                    {isPro && <Badge className="ml-auto bg-sunset-gradient text-white text-[10px]">Popular</Badge>}
                  </div>
                  <dl className="space-y-2.5">
                    {COMPARE_ROWS.map((row) => {
                      const v = row.values[pk];
                      return (
                        <div key={row.label} className="flex items-center justify-between text-sm">
                          <dt className="text-muted-foreground">{row.label}</dt>
                          <dd className="font-medium flex items-center gap-1">
                            {row.kind === "bool" ? (
                              v === "true" ? (
                                <Check className="h-4 w-4 text-green-600" strokeWidth={3} />
                              ) : (
                                <X className="h-4 w-4 text-muted-foreground/40" strokeWidth={2.5} />
                              )
                            ) : (
                              <span className={cn(v === "—" && "text-muted-foreground/50")}>{v}</span>
                            )}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Local payment methods */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4 lg:px-6">
          <Card className="p-6 lg:p-8 border-border/60 bg-sunset-cream/20">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="h-5 w-5 text-sunset-deep" />
                  <h3 className="font-bold text-lg">Local payment methods supported</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Pay the way that works for you. We support mobile wallets popular in Pakistan &amp;
                  South Asia alongside global card processors. Local PK pricing is discounted vs USD —
                  switch billing to PKR in Settings.
                </p>
                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  Secured by 256-bit TLS encryption. PCI-DSS compliant.
                </div>
              </div>
              <div className="flex flex-wrap gap-2 lg:max-w-[280px]">
                {PAYMENT_METHODS.map((m) => (
                  <div
                    key={m.name}
                    className="h-10 px-3 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm min-w-[80px]"
                    style={{ background: m.bg }}
                  >
                    {m.name}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-sunset-radial border-y border-border/40">
        <div className="mx-auto max-w-3xl px-4 lg:px-6">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-4 border-sunset-orange/40 text-sunset-deep">FAQ</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold">Pricing questions, answered</h2>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((f, i) => (
              <details
                key={i}
                className="group rounded-xl border border-border/60 bg-card overflow-hidden"
              >
                <summary className="flex items-center justify-between p-4 cursor-pointer list-none font-medium text-sm hover:bg-muted/40 transition-colors">
                  {f.q}
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 lg:px-6">
          <div className="relative rounded-3xl bg-sunset-gradient p-10 lg:p-14 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, white 1.5px, transparent 1.5px), radial-gradient(circle at 70% 60%, white 1.5px, transparent 1.5px)",
              backgroundSize: "40px 40px",
            }} />
            <div className="relative">
              <Sparkles className="h-10 w-10 text-white mx-auto mb-4" />
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                Start spying on competitor ads today
              </h2>
              <p className="text-white/90 text-base lg:text-lg mb-7 max-w-xl mx-auto">
                Free forever for small usage. No credit card required. Install in 30 seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-12 px-8 text-base bg-white text-sunset-deep hover:bg-white/90"
                  onClick={() => login("free")}
                >
                  <Chrome className="h-5 w-5 mr-2" />
                  Add to Chrome — Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base border-white/40 text-white hover:bg-white/10 hover:text-white"
                  onClick={() => setView("dashboard")}
                >
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
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-lg bg-sunset-gradient flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold">AdSpy Lite</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs mb-4">
                Competitor ad research made simple. Save, organize, and analyze
                Facebook &amp; Instagram ads from Meta Ad Library.
              </p>
              <div className="flex gap-2">
                {["Twitter", "LinkedIn", "YouTube"].map((s) => (
                  <button
                    key={s}
                    className="h-8 w-8 rounded-lg bg-muted hover:bg-sunset-cream/40 transition-colors flex items-center justify-center text-[10px] font-bold"
                  >
                    {s.slice(0, 2)}
                  </button>
                ))}
              </div>
            </div>
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="text-sm font-semibold mb-3">{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}>
                      <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {l}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © 2024 AdSpy Lite. Built for South Asian marketers. Not affiliated with Meta.
            </p>
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
