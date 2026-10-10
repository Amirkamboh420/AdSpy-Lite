"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  Sparkles, Chrome, Bookmark, Users, BarChart3, FolderHeart,
  ArrowRight, Check, X, Zap, Crown, Star, Shield, type LucideIcon,
  Rocket, Target, TrendingUp,
} from "lucide-react";
import { sonnerToast } from "@/lib/toast-helpers";

const steps = [
  {
    icon: Chrome,
    title: "Install the Chrome Extension",
    desc: "Add AdSpy Lite to Chrome. It activates automatically when you visit the Meta Ad Library page.",
    color: "#EA6113",
    cta: "Add to Chrome",
  },
  {
    icon: Bookmark,
    title: "Save Ads with One Click",
    desc: "A \"Save Ad\" button overlays on every ad card. Click to capture screenshot, copy, and metadata instantly.",
    color: "#F88F22",
    cta: "Browse Ad Library",
  },
  {
    icon: FolderHeart,
    title: "Organize & Tag",
    desc: "Group saved ads into folders (\"Competitor A\", \"Clothing Niche\") with color-coded tags for easy retrieval.",
    color: "#FBB931",
    cta: "Create your first folder",
  },
  {
    icon: BarChart3,
    title: "Analyze Patterns",
    desc: "See which CTAs, formats, and creative styles trend across your saved ads. Spot winners before competitors do.",
    color: "#B84A0E",
    cta: "View analytics",
  },
];

export function OnboardingModal() {
  const { onboardingSeen, setOnboardingSeen, setView, role } = useAppStore();
  const [step, setStep] = useState(0);
  const [skipped, setSkipped] = useState(false);

  // Show onboarding when entering the app for the first time (not seen & not skipped & not on landing)
  const shouldShow = !onboardingSeen && !skipped;

  if (!shouldShow) return null;

  const current = steps[step];
  const isLast = step === steps.length - 1;

  const next = () => {
    if (isLast) {
      setOnboardingSeen(true);
      sonnerToast.success("Onboarding complete! Start saving ads.");
    } else {
      setStep(step + 1);
    }
  };

  const skip = () => {
    setSkipped(true);
    setOnboardingSeen(true);
  };

  return (
    <Dialog open={shouldShow} onOpenChange={(o) => !o && skip()}>
      <DialogContent className="sm:max-w-lg overflow-hidden p-0 gap-0" showCloseButton={false}>
        {/* Top banner with sunset gradient */}
        <div className="relative bg-sunset-gradient p-6 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "radial-gradient(circle at 20% 30%, white 1.5px, transparent 1.5px), radial-gradient(circle at 70% 60%, white 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }} />
          <button
            onClick={skip}
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors z-10"
          >
            <X className="h-4 w-4 text-white" />
          </button>
          <div className="relative flex items-center gap-2 mb-2">
            <div className="h-9 w-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <Badge className="bg-white/20 text-white border-0">
              <Rocket className="h-3 w-3 mr-1" />
              Welcome aboard
            </Badge>
          </div>
          <h2 className="relative text-2xl font-bold mb-1">Let's get you spying in 4 steps</h2>
          <p className="relative text-white/80 text-sm">Takes less than a minute. You're viewing as <span className="font-semibold capitalize">{role}</span>.</p>

          {/* Progress dots */}
          <div className="relative flex items-center gap-1.5 mt-4">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === step ? "w-8 bg-white" : i < step ? "w-4 bg-white/80" : "w-4 bg-white/30"}`}
              />
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="p-6">
          <DialogHeader className="mb-4">
            <div className="flex items-center gap-3">
              <div
                className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: current.color }}
              >
                <current.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg">Step {step + 1}: {current.title}</DialogTitle>
                <DialogDescription>{current.desc}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Visual mockup per step */}
          <div className="rounded-xl border border-border bg-sunset-radial p-4 mb-4 min-h-[120px] flex items-center justify-center">
            <StepVisual step={step} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {step > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            <Button variant="ghost" size="sm" className="ml-auto text-muted-foreground" onClick={skip}>
              Skip tour
            </Button>
            <Button
              size="sm"
              className="bg-sunset-gradient hover:opacity-90 text-white"
              onClick={() => {
                if (current.cta.includes("Chrome")) sonnerToast.success("Chrome Web Store opening…");
                else if (current.cta.includes("Ad Library")) { sonnerToast.info("Opening Meta Ad Library"); }
                else if (current.cta.includes("folder")) { setView("saved-ads"); }
                else if (current.cta.includes("analytics")) { setView("analytics"); }
                next();
              }}
            >
              {current.cta}
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StepVisual({ step }: { step: number }) {
  if (step === 0) {
    // Chrome install visual
    return (
      <div className="flex items-center gap-3 w-full">
        <div className="h-14 w-14 rounded-xl bg-white shadow-md flex items-center justify-center border border-border">
          <Chrome className="h-7 w-7 text-sunset-deep" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold">AdSpy Lite — Meta Ad Library Scraper</span>
            <Badge className="text-[9px] h-4 px-1 bg-green-100 text-green-700">Free</Badge>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-sunset-amber text-sunset-amber" />)}</div>
            <span className="text-[10px] text-muted-foreground">2,400+ users</span>
          </div>
        </div>
        <Button size="sm" className="bg-sunset-gradient text-white h-8">Add to Chrome</Button>
      </div>
    );
  }
  if (step === 1) {
    // Save ad button overlay visual
    return (
      <div className="grid grid-cols-3 gap-2 w-full">
        {["#EA6113", "#F88F22", "#FBB931"].map((c, i) => (
          <div key={i} className="relative aspect-[4/3] rounded-md overflow-hidden" style={{ background: `linear-gradient(135deg, ${c}, ${c}aa)` }}>
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, white 1px, transparent 1px)", backgroundSize: "10px 10px" }} />
            <span className="absolute top-1 right-1 rounded-full bg-sunset-deep px-1 py-0.5 text-[7px] font-bold text-white flex items-center gap-0.5 animate-sunset-glow">
              <Bookmark className="h-2 w-2 fill-white" /> Save
            </span>
            <span className="absolute bottom-1 left-1 text-[7px] font-bold text-white">{i * 7 + 14}d</span>
          </div>
        ))}
      </div>
    );
  }
  if (step === 2) {
    // Folders visual
    return (
      <div className="flex flex-wrap gap-2 w-full">
        {[
          { n: "Clothing Niche", c: "#EA6113" },
          { n: "Competitor A", c: "#F88F22" },
          { n: "E-commerce", c: "#FBB931" },
          { n: "Beauty", c: "#B84A0E" },
          { n: "Food", c: "#FF9F45" },
        ].map((f) => (
          <div key={f.n} className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-medium text-white" style={{ backgroundColor: f.c }}>
            <FolderHeart className="h-3 w-3" />
            {f.n}
            <span className="bg-white/25 rounded px-1 text-[9px]">{Math.floor(Math.random() * 20) + 5}</span>
          </div>
        ))}
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] border border-dashed border-border text-muted-foreground">
          <FolderHeart className="h-3 w-3" /> New folder
        </div>
      </div>
    );
  }
  // Analytics visual
  return (
    <div className="flex items-end gap-1.5 w-full h-16">
      {[40, 65, 50, 80, 70, 95, 60].map((h, i) => (
        <div key={i} className="flex-1 rounded-t bg-sunset-gradient" style={{ height: `${h}%` }} />
      ))}
      <div className="flex-1 flex flex-col items-center justify-center text-[9px] text-muted-foreground">
        <TrendingUp className="h-4 w-4 text-sunset-deep" />
        <span>+34%</span>
      </div>
    </div>
  );
}
