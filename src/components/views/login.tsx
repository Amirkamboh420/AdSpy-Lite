"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Sparkles,
  ArrowLeft,
  Moon,
  Sun,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Star,
  Quote,
  Bookmark,
  TrendingUp,
  Bell,
  ShieldCheck,
  Check,
  Chrome,
} from "lucide-react";
import type { UserRole } from "@/lib/mock-data";
import { sonnerToast } from "@/lib/toast-helpers";

type PlanOption = {
  key: Exclude<UserRole, "team" | "admin">;
  label: string;
  price: string;
  tagline: string;
  accent: string;
};

const PLAN_OPTIONS: PlanOption[] = [
  { key: "free", label: "Free", price: "$0", tagline: "Forever", accent: "#FBB931" },
  { key: "pro", label: "Pro", price: "$15", tagline: "/mo", accent: "#F88F22" },
  { key: "agency", label: "Agency", price: "$49", tagline: "/mo", accent: "#EA6113" },
];

const HERO_BULLETS = [
  { icon: Bookmark, title: "1-Click Ad Saving", desc: "Capture screenshots & metadata from Meta Ad Library instantly." },
  { icon: TrendingUp, title: "Pattern Analytics", desc: "Spot trending CTAs, formats, and creative styles across saved ads." },
  { icon: Bell, title: "New Ad Alerts", desc: "Get notified the moment a tracked competitor launches new creative." },
  { icon: ShieldCheck, title: "Privacy-First", desc: "Only saves publicly visible ads. ToS-compliant by design." },
];

export function LoginView() {
  const { login, goLanding, toggleTheme, theme } = useAppStore();
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  // Sign-in form state
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [showSigninPw, setShowSigninPw] = useState(false);

  // Sign-up form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignupPw, setShowSignupPw] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanOption["key"]>("pro");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    login("agency");
    sonnerToast.success("Welcome back!");
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedPlan);
    sonnerToast.success("Account created!");
  };

  const handleSocial = (provider: "Google" | "Meta") => {
    login("agency");
    sonnerToast.success(`Signed in with ${provider}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 lg:px-6 h-14 flex items-center justify-between">
          <button
            onClick={goLanding}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </button>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <div className="h-7 w-7 rounded-lg bg-sunset-gradient flex items-center justify-center shadow-md shadow-sunset-orange/30">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-sm">AdSpy Lite</span>
            </div>
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

      {/* Main split layout */}
      <main className="flex-1 grid lg:grid-cols-2">
        {/* LEFT: Sunset hero */}
        <section className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-sunset-gradient text-white p-10 xl:p-14">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, white 1.5px, transparent 1.5px), radial-gradient(circle at 70% 60%, white 1.5px, transparent 1.5px)",
            backgroundSize: "44px 44px",
          }} />
          <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-sunset-cream/20 blur-3xl" />

          {/* Brand */}
          <div className="relative flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg ring-1 ring-white/30">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg leading-none">AdSpy Lite</p>
              <p className="text-[11px] text-white/80 leading-none mt-1">Competitor Research</p>
            </div>
          </div>

          {/* Hero copy + bullets */}
          <div className="relative space-y-7">
            <div className="space-y-4">
              <Badge className="bg-white/15 text-white border-white/30 backdrop-blur-sm">
                <Chrome className="h-3 w-3 mr-1" />
                Chrome Extension + Web Dashboard
              </Badge>
              <h1 className="text-3xl xl:text-4xl font-bold tracking-tight leading-tight">
                Spy on competitor Facebook & Instagram ads
              </h1>
              <p className="text-white/90 max-w-md leading-relaxed">
                Save, organize, tag & analyze competitor ads in one click.
                Built for digital marketers, agencies & e-commerce sellers in South Asia.
              </p>
            </div>

            <ul className="space-y-3">
              {HERO_BULLETS.map((b) => (
                <li key={b.title} className="flex items-start gap-3">
                  <div className="h-9 w-9 shrink-0 rounded-lg bg-white/15 backdrop-blur-sm ring-1 ring-white/25 flex items-center justify-center">
                    <b.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm leading-tight">{b.title}</p>
                    <p className="text-xs text-white/80 leading-snug mt-0.5">{b.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Testimonial */}
          <div className="relative rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/25 p-5">
            <Quote className="h-6 w-6 text-white/60 mb-2" />
            <p className="text-sm leading-relaxed text-white/95">
              "Finally a tool that doesn't cost $149/month. I track 8 competitors
              and the weekly digest catches every new creative. Game-changer."
            </p>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-full bg-white/20 ring-1 ring-white/40 flex items-center justify-center text-xs font-bold">
                  AK
                </div>
                <div>
                  <p className="text-sm font-semibold leading-none">Ayesha Khan</p>
                  <p className="text-[11px] text-white/75 mt-1">Media Buyer, Lahore</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-white text-white" />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT: Auth card */}
        <section className="relative flex items-center justify-center p-5 sm:p-8 bg-sunset-radial">
          <div className="w-full max-w-md">
            {/* Mobile brand */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
              <div className="h-9 w-9 rounded-xl bg-sunset-gradient flex items-center justify-center shadow-lg shadow-sunset-orange/30">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">AdSpy Lite</span>
            </div>

            <Card className="p-6 sm:p-8 border-border/60 shadow-xl shadow-sunset-orange/5">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold">Welcome</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Sign in to your dashboard or create a new account
                </p>
              </div>

              <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
                <TabsList className="grid w-full grid-cols-2 h-10">
                  <TabsTrigger value="signin" className="text-sm">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="text-sm">Create Account</TabsTrigger>
                </TabsList>

                {/* Sign In */}
                <TabsContent value="signin" className="mt-5">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="signin-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-9"
                          value={signinEmail}
                          onChange={(e) => setSigninEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="signin-password">Password</Label>
                        <button
                          type="button"
                          className="text-xs font-medium text-sunset-deep hover:underline"
                          onClick={() => sonnerToast.info("Password reset link sent to your email")}
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signin-password"
                          type={showSigninPw ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-9 pr-9"
                          value={signinPassword}
                          onChange={(e) => setSigninPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowSigninPw((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          aria-label={showSigninPw ? "Hide password" : "Show password"}
                        >
                          {showSigninPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-11 bg-sunset-gradient hover:opacity-90 text-white shadow-md shadow-sunset-orange/30"
                    >
                      Sign In
                    </Button>
                  </form>
                </TabsContent>

                {/* Sign Up */}
                <TabsContent value="signup" className="mt-5">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Ayesha Khan"
                          className="pl-9"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-9"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type={showSignupPw ? "text" : "password"}
                          placeholder="Create a password"
                          className="pl-9 pr-9"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPw((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          aria-label={showSignupPw ? "Hide password" : "Show password"}
                        >
                          {showSignupPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Plan selector */}
                    <div className="space-y-1.5">
                      <Label>Choose a plan</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {PLAN_OPTIONS.map((p) => {
                          const active = selectedPlan === p.key;
                          return (
                            <button
                              type="button"
                              key={p.key}
                              onClick={() => setSelectedPlan(p.key)}
                              className={cn(
                                "relative rounded-lg border p-2.5 text-left transition-all",
                                active
                                  ? "border-2 bg-sunset-cream/30 shadow-sm"
                                  : "border-border/60 hover:border-sunset-orange/40 bg-card"
                              )}
                              style={active ? { borderColor: p.accent } : undefined}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold">{p.label}</span>
                                {active && (
                                  <span
                                    className="h-3.5 w-3.5 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: p.accent }}
                                  >
                                    <Check className="h-2.5 w-2.5 text-white" />
                                  </span>
                                )}
                              </div>
                              <div className="mt-1 flex items-baseline gap-0.5">
                                <span className="text-sm font-bold">{p.price}</span>
                                <span className="text-[10px] text-muted-foreground">{p.tagline}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 bg-sunset-gradient hover:opacity-90 text-white shadow-md shadow-sunset-orange/30"
                    >
                      Create Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Social auth */}
              <div className="mt-6 space-y-3">
                <div className="relative">
                  <Separator />
                  <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-card px-2 text-[11px] text-muted-foreground uppercase tracking-wider">
                    or continue with
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 border-border/70 hover:bg-muted/40"
                    onClick={() => handleSocial("Google")}
                  >
                    <GoogleIcon className="h-4 w-4" />
                    <span className="text-sm">Google</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 border-border/70 hover:bg-[#0866FF]/5 hover:border-[#0866FF]/40"
                    onClick={() => handleSocial("Meta")}
                  >
                    <MetaIcon className="h-4 w-4" />
                    <span className="text-sm">Meta</span>
                  </Button>
                </div>
              </div>
            </Card>

            <p className="text-center text-xs text-muted-foreground mt-5">
              By continuing you agree to our{" "}
              <button className="underline hover:text-foreground">Terms</button> &{" "}
              <button className="underline hover:text-foreground">Privacy Policy</button>
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-4">
        <div className="mx-auto max-w-7xl px-4 lg:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© 2024 AdSpy Lite. Built for South Asian marketers. Not affiliated with Meta.</p>
          <p className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            All systems operational
          </p>
        </div>
      </footer>
    </div>
  );
}

/* Inline brand SVGs (so we don't depend on extra icon packages) */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function MetaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        fill="#0866FF"
        d="M6.92 3C3.94 3 1.5 5.43 1.5 8.42c0 2.62 1.7 4.8 4.02 7.16 1.96 2 4.36 4.04 6.48 6.42 2.12-2.38 4.52-4.42 6.48-6.42 2.32-2.36 4.02-4.54 4.02-7.16 0-2.99-2.44-5.42-5.42-5.42-1.84 0-3.46.92-4.46 2.32A5.6 5.6 0 0 0 6.92 3Z"
      />
      <path
        fill="url(#metaGrad)"
        d="M6.92 3C3.94 3 1.5 5.43 1.5 8.42c0 2.62 1.7 4.8 4.02 7.16 1.96 2 4.36 4.04 6.48 6.42 2.12-2.38 4.52-4.42 6.48-6.42 2.32-2.36 4.02-4.54 4.02-7.16 0-2.99-2.44-5.42-5.42-5.42-1.84 0-3.46.92-4.46 2.32A5.6 5.6 0 0 0 6.92 3Z"
        opacity={0.85}
      />
      <defs>
        <linearGradient id="metaGrad" x1="2" y1="6" x2="22" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0082FB" />
          <stop offset="0.5" stopColor="#0064E0" />
          <stop offset="1" stopColor="#0082FB" />
        </linearGradient>
      </defs>
    </svg>
  );
}
