"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Rocket, Zap, GitCompare, Search, Bell, Download, Keyboard, Palette, X } from "lucide-react";

export const APP_VERSION = "2.5.0";

interface ChangeEntry {
  version: string;
  date: string;
  type: "feature" | "improvement" | "fix";
  title: string;
  desc: string;
  icon: React.ElementType;
}

const changelog: ChangeEntry[] = [
  {
    version: "2.5.0",
    date: "Dec 12, 2024",
    type: "feature",
    title: "Real ad thumbnail images",
    desc: "Top saved ads now show AI-generated visual previews instead of solid color placeholders. Easier to scan your collection at a glance.",
    icon: Palette,
  },
  {
    version: "2.5.0",
    date: "Dec 12, 2024",
    type: "feature",
    title: "Global Search view",
    desc: "Search across all ads, competitors, and folders from one place. Filter by type, see result counts, and click through to details.",
    icon: Search,
  },
  {
    version: "2.5.0",
    date: "Dec 12, 2024",
    type: "feature",
    title: "Real file exports",
    desc: "Export saved ads as real CSV, JSON, or branded HTML report files that download to your device. No more fake toasts!",
    icon: Download,
  },
  {
    version: "2.4.1",
    date: "Dec 8, 2024",
    type: "feature",
    title: "Command Palette (⌘K)",
    desc: "Jump to any page, run quick actions, and search ads/competitors with a single keyboard shortcut.",
    icon: Zap,
  },
  {
    version: "2.4.1",
    date: "Dec 8, 2024",
    type: "feature",
    title: "Ad Comparison side-by-side",
    desc: "Select up to 4 ads and compare them attribute-by-attribute in a dedicated comparison dialog with AI insights.",
    icon: GitCompare,
  },
  {
    version: "2.4.1",
    date: "Dec 8, 2024",
    type: "feature",
    title: "Keyboard shortcuts",
    desc: "Press ? anywhere to see all shortcuts. Navigate with G+D/S/C/A/T/B, toggle theme with T, notifications with N.",
    icon: Keyboard,
  },
  {
    version: "2.4.0",
    date: "Dec 1, 2024",
    type: "improvement",
    title: "Notifications dropdown panel",
    desc: "The bell icon now opens a real notifications panel with filter tabs, unread indicators, and mark-all-read.",
    icon: Bell,
  },
  {
    version: "2.4.0",
    date: "Dec 1, 2024",
    type: "improvement",
    title: "Onboarding welcome tour",
    desc: "New users get a 4-step guided tour on first entry. Replay anytime from Settings → About & Help.",
    icon: Rocket,
  },
];

const typeStyles: Record<ChangeEntry["type"], { color: string; label: string; bg: string }> = {
  feature: { color: "#EA6113", label: "New", bg: "bg-sunset-cream/40 text-[#7A3A0E]" },
  improvement: { color: "#F88F22", label: "Improved", bg: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300" },
  fix: { color: "#10b981", label: "Fixed", bg: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300" },
};

export function ChangelogModal() {
  const { changelogOpen, setChangelogOpen, lastSeenVersion, markVersionSeen } = useAppStore();

  // Auto-open on version change (when entering app for the first time after an update)
  useEffect(() => {
    if (lastSeenVersion !== APP_VERSION && changelogOpen === false) {
      // Only auto-open if user has seen onboarding (i.e., not first ever visit)
      // We check lastSeenVersion !== "" OR onboardingSeen via a small delay
      const timer = setTimeout(() => {
        if (lastSeenVersion !== "" && lastSeenVersion !== APP_VERSION) {
          setChangelogOpen(true);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [lastSeenVersion, changelogOpen, setChangelogOpen]);

  const handleDismiss = () => {
    markVersionSeen(APP_VERSION);
    setChangelogOpen(false);
  };

  // Group by version
  const versions = Array.from(new Set(changelog.map((c) => c.version)));

  return (
    <Dialog open={changelogOpen} onOpenChange={(o) => { if (!o) handleDismiss(); }}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden" showCloseButton={false}>
        {/* Visually-hidden accessible title + description for screen readers (DialogContent a11y requirement) */}
        <DialogHeader className="sr-only">
          <DialogTitle>What's new in AdSpy Lite</DialogTitle>
          <DialogDescription>
            Changelog for AdSpy Lite version {APP_VERSION}. Real ad thumbnails, global search, real exports, and more.
          </DialogDescription>
        </DialogHeader>
        {/* Header with sunset gradient */}
        <div className="relative bg-sunset-gradient p-6 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "radial-gradient(circle at 20% 30%, white 1.5px, transparent 1.5px), radial-gradient(circle at 70% 60%, white 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }} />
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors z-10"
          >
            <X className="h-4 w-4 text-white" />
          </button>
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-9 w-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <Badge className="bg-white/20 text-white border-0">v{APP_VERSION}</Badge>
            </div>
            <h2 className="text-2xl font-bold mb-1">What's new in AdSpy Lite</h2>
            <p className="text-white/80 text-sm">Real ad thumbnails, global search, real exports, and more.</p>
          </div>
        </div>

        {/* Changelog entries */}
        <div className="p-6 max-h-[55vh] overflow-y-auto space-y-6">
          {versions.map((version) => (
            <div key={version}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-bold">v{version}</span>
                <span className="text-[11px] text-muted-foreground">· {changelog.find((c) => c.version === version)?.date}</span>
                {version === APP_VERSION && (
                  <Badge className="ml-auto text-[9px] h-4 px-1 bg-sunset-gradient text-white">LATEST</Badge>
                )}
              </div>
              <div className="space-y-3">
                {changelog.filter((c) => c.version === version).map((entry, i) => {
                  const ts = typeStyles[entry.type];
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${ts.color}22` }}
                      >
                        <entry.icon className="h-4 w-4" style={{ color: ts.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold">{entry.title}</p>
                          <Badge variant="secondary" className={`text-[9px] h-4 px-1 ${ts.bg}`}>{ts.label}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{entry.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-muted/30 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">You won't see this again until the next update</span>
          <Button size="sm" className="bg-sunset-gradient hover:opacity-90 text-white h-8" onClick={handleDismiss}>
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
