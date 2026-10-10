"use client";

import { useEffect } from "react";
import { useAppStore, type ViewKey } from "@/lib/store";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Keyboard, Command, CircleHelp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Shortcut {
  keys: { icon?: React.ElementType; label: string }[];
  desc: string;
  group: string;
}

const shortcuts: Shortcut[] = [
  { keys: [{ icon: Command, label: "K" }], desc: "Open command palette", group: "Global" },
  { keys: [{ icon: Command, label: "/" }], desc: "Focus search (opens palette)", group: "Global" },
  { keys: [{ label: "?" }], desc: "Show this keyboard shortcuts help", group: "Global" },
  { keys: [{ label: "G" }, { label: "D" }], desc: "Go to Dashboard", group: "Navigation" },
  { keys: [{ label: "G" }, { label: "S" }], desc: "Go to Saved Ads", group: "Navigation" },
  { keys: [{ label: "G" }, { label: "C" }], desc: "Go to Competitors", group: "Navigation" },
  { keys: [{ label: "G" }, { label: "A" }], desc: "Go to Analytics", group: "Navigation" },
  { keys: [{ label: "G" }, { label: "T" }], desc: "Go to Team", group: "Navigation" },
  { keys: [{ label: "G" }, { label: "B" }], desc: "Go to Billing", group: "Navigation" },
  { keys: [{ label: "G" }, { label: "K" }], desc: "Go to API Keys", group: "Navigation" },
  { keys: [{ label: "G" }, { label: "H" }], desc: "Go to Support", group: "Navigation" },
  { keys: [{ label: "G" }, { label: "P" }], desc: "Go to Pricing", group: "Navigation" },
  { keys: [{ label: "T" }], desc: "Toggle light/dark theme", group: "Global" },
  { keys: [{ label: "N" }], desc: "Toggle notifications panel", group: "Global" },
  { keys: [{ label: "P" }], desc: "Pin/unpin the focused ad card", group: "Global" },
  { keys: [{ label: "Esc" }], desc: "Close any open dialog/panel", group: "Global" },
];

const viewMap: Record<string, ViewKey> = {
  d: "dashboard",
  s: "saved-ads",
  c: "competitors",
  a: "analytics",
  t: "team",
  b: "billing",
  k: "api-keys",
  h: "support",
  p: "pricing",
};

export function KeyboardShortcuts() {
  const { helpOpen, setHelpOpen, setCommandOpen, setNotifOpen, notifOpen, toggleTheme, setView, togglePinAd } = useAppStore();

  useEffect(() => {
    let gPressed = false;
    let gTimer: ReturnType<typeof setTimeout> | null = null;

    const handler = (e: KeyboardEvent) => {
      // Ignore if typing in an input/textarea/select or contentEditable
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable ||
        target.closest("[cmdk-root]");

      // Always allow Escape
      if (e.key === "Escape") {
        setHelpOpen(false);
        return;
      }

      if (isTyping) return;

      // ? → help
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setHelpOpen(!helpOpen);
        return;
      }

      // Cmd/Ctrl + / → command palette
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        setCommandOpen(true);
        return;
      }

      // Don't trigger single-key shortcuts with modifiers
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.toLowerCase();

      // g + letter → navigation
      if (key === "g") {
        gPressed = true;
        if (gTimer) clearTimeout(gTimer);
        gTimer = setTimeout(() => { gPressed = false; }, 800);
        return;
      }
      if (gPressed && viewMap[key]) {
        e.preventDefault();
        setView(viewMap[key]);
        gPressed = false;
        if (gTimer) clearTimeout(gTimer);
        return;
      }

      // t → theme toggle
      if (key === "t") {
        e.preventDefault();
        toggleTheme();
        return;
      }

      // n → notifications
      if (key === "n") {
        e.preventDefault();
        setNotifOpen(!notifOpen);
        return;
      }

      // p → pin/unpin the focused ad card (or first ad card if none focused)
      if (key === "p") {
        // Find the focused element, walk up to a [data-slot=card] ancestor
        const focused = document.activeElement as HTMLElement | null;
        let card = focused?.closest("[data-slot=card]") as HTMLElement | null;
        // If no card focused, use the first ad card in the main content
        if (!card) {
          card = document.querySelector("main [data-slot=card]") as HTMLElement | null;
        }
        if (card) {
          // Find the pin button inside this card and click it
          const pinBtn = card.querySelector("button[title*='Pin']") as HTMLButtonElement | null;
          if (pinBtn) {
            e.preventDefault();
            pinBtn.click();
            return;
          }
        }
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      if (gTimer) clearTimeout(gTimer);
    };
  }, [helpOpen, notifOpen, setHelpOpen, setCommandOpen, setNotifOpen, toggleTheme, setView, togglePinAd]);

  const groups = Array.from(new Set(shortcuts.map((s) => s.group)));

  return (
    <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-border bg-sunset-radial">
          <DialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-sunset-gradient flex items-center justify-center">
              <Keyboard className="h-4 w-4 text-white" />
            </div>
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>Press these keys anywhere in the app for quick actions.</DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {groups.map((group) => (
            <div key={group}>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">{group}</p>
              <div className="space-y-1.5">
                {shortcuts.filter((s) => s.group === group).map((s, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 py-1">
                    <span className="text-sm text-muted-foreground">{s.desc}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      {s.keys.map((k, j) => (
                        <kbd key={j} className={cn(
                          "min-w-[24px] h-6 px-1.5 inline-flex items-center justify-center gap-0.5 rounded-md border border-border bg-muted text-[11px] font-semibold text-foreground",
                          j > 0 && "ml-0.5"
                        )}>
                          {k.icon ? <k.icon className="h-3 w-3" /> : null}
                          {k.label}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 border-t border-border bg-muted/30 flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <CircleHelp className="h-3 w-3" />
            Press Esc to close
          </span>
          <Badge variant="outline" className="text-[10px]">AdSpy Lite v2.4.1</Badge>
        </div>
      </DialogContent>
    </Dialog>
  );
}
