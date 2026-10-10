"use client";

import { useEffect, useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { useAppStore, type ViewKey } from "@/lib/store";
import { mockAds, mockCompetitors, mockFolders } from "@/lib/mock-data";
import {
  LayoutDashboard, Bookmark, Users, BarChart3, FolderHeart, UsersRound,
  Shield, Settings, CreditCard, Search, ArrowRight, CornerDownLeft,
  Sun, Moon, Crown, Bell, Eye, Download, FolderPlus, Sparkles, Chrome,
  Zap, TrendingUp, Plus, KeyRound, LifeBuoy, type LucideIcon,
} from "lucide-react";
import { sonnerToast } from "@/lib/toast-helpers";

interface CmdItem {
  id: string;
  label: string;
  hint?: string;
  icon: LucideIcon;
  group: string;
  action: () => void;
  keywords?: string;
}

export function CommandPalette() {
  const { commandOpen, setCommandOpen, setView, setRole, role, toggleTheme, theme, goLanding, setSearchQuery } = useAppStore();
  const [searchValue, setSearchValueLocal] = useState("");

  // ⌘K / Ctrl+K to toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(!commandOpen);
        if (commandOpen) setSearchValueLocal("");
      }
      if (e.key === "Escape" && commandOpen) setCommandOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [commandOpen, setCommandOpen]);

  if (!commandOpen) return null;

  const navItems: { key: ViewKey; label: string; icon: LucideIcon; hint: string }[] = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, hint: "Overview & stats" },
    { key: "search", label: "Search", icon: Search, hint: "Find ads, competitors, folders" },
    { key: "saved-ads", label: "Saved Ads", icon: Bookmark, hint: "Your ad collection" },
    { key: "competitors", label: "Competitors", icon: Users, hint: "Tracked pages" },
    { key: "analytics", label: "Analytics", icon: BarChart3, hint: "Pattern insights" },
    { key: "swipe-file", label: "Swipe File", icon: FolderHeart, hint: "Inspiration boards" },
    { key: "team", label: "Team", icon: UsersRound, hint: "Workspace members" },
    { key: "api-keys", label: "API Keys", icon: KeyRound, hint: "API access & webhooks" },
    { key: "support", label: "Support", icon: LifeBuoy, hint: "Help, tickets, docs" },
    { key: "admin", label: "Admin Panel", icon: Shield, hint: "System admin" },
    { key: "billing", label: "Billing", icon: CreditCard, hint: "Plans & invoices" },
    { key: "pricing", label: "Pricing", icon: CreditCard, hint: "View plans & pricing" },
    { key: "settings", label: "Settings", icon: Settings, hint: "Preferences" },
  ];

  const quickActions: CmdItem[] = [
    {
      id: "qa-save",
      label: "Save a new ad",
      hint: "From Meta Ad Library",
      icon: Bookmark,
      group: "Actions",
      action: () => { setView("saved-ads"); setCommandOpen(false); sonnerToast.info("Open the Chrome extension on Meta Ad Library to save ads"); },
    },
    {
      id: "qa-add-competitor",
      label: "Add a competitor to track",
      icon: Plus,
      group: "Actions",
      action: () => { setView("competitors"); setCommandOpen(false); sonnerToast.info("Opening competitor tracker…"); },
    },
    {
      id: "qa-new-folder",
      label: "Create a new folder",
      icon: FolderPlus,
      group: "Actions",
      action: () => { setView("saved-ads"); setCommandOpen(false); sonnerToast.success("Folder creator ready"); },
    },
    {
      id: "qa-export",
      label: "Export saved ads",
      hint: "CSV / PDF / JSON",
      icon: Download,
      group: "Actions",
      action: () => { setView("saved-ads"); setCommandOpen(false); sonnerToast.success("Export dialog ready"); },
    },
  ];

  const roleItems: { role: typeof role; label: string; icon: LucideIcon }[] = [
    { role: "free", label: "Free User", icon: Sparkles },
    { role: "pro", label: "Pro User", icon: Zap },
    { role: "agency", label: "Agency Owner", icon: Crown },
    { role: "team", label: "Team Member", icon: UsersRound },
    { role: "admin", label: "Admin", icon: Shield },
  ];

  const adResults = mockAds
    .filter((a) => {
      if (!searchValue.trim()) return true;
      const q = searchValue.toLowerCase();
      return (
        a.advertiser.toLowerCase().includes(q) ||
        a.headline.toLowerCase().includes(q) ||
        a.adCopy.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)) ||
        a.cta.toLowerCase().includes(q)
      );
    })
    .slice(0, 6)
    .map((a) => ({
      id: `ad-${a.id}`,
      label: a.headline,
      hint: `${a.advertiser} · ${a.daysRunning}d running`,
      icon: Bookmark,
      group: "Saved Ads",
      action: () => { setView("saved-ads"); setCommandOpen(false); },
      keywords: a.advertiser + " " + a.adCopy,
    }));

  const competitorResults = mockCompetitors
    .filter((c) => {
      if (!searchValue.trim()) return true;
      const q = searchValue.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.handle.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
    })
    .map((c) => ({
      id: `comp-${c.id}`,
      label: c.name,
      hint: `${c.category} · ${c.activeAds} active ads`,
      icon: Users,
      group: "Competitors",
      action: () => { setView("competitors"); setCommandOpen(false); },
      keywords: c.handle + " " + c.category,
    }));

  const allItems: CmdItem[] = [
    ...quickActions,
    ...adResults,
    ...competitorResults,
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={() => setCommandOpen(false)}
      />
      {/* command dialog */}
      <div className="relative w-full max-w-xl rounded-2xl bg-card border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <Command className="rounded-2xl" shouldFilter={false} onValueChange={(v) => setSearchValueLocal(v)}>
          <div className="flex items-center gap-2 border-b border-border px-4">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <CommandInput
              placeholder="Search ads, competitors, or jump to a page…"
              className="flex-1 h-12 bg-transparent border-0 focus:ring-0 text-sm placeholder:text-muted-foreground"
            />
            <button
              onClick={() => { setSearchQuery(searchValue); setView("search"); setCommandOpen(false); sonnerToast.info(`Searching for "${searchValue}"`); }}
              disabled={!searchValue.trim()}
              className="text-[11px] px-2 py-1 rounded-md border border-border bg-muted hover:bg-sunset-cream/40 hover:border-sunset-orange/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Search all ↵
            </button>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">ESC</kbd>
          </div>
          <CommandList className="max-h-[400px] overflow-y-auto">
            <CommandEmpty className="py-8 text-center text-sm text-muted-foreground">
              No results found. Try a different search term.
            </CommandEmpty>

            {/* Navigation */}
            <CommandGroup heading="Navigate" className="text-xs text-muted-foreground px-2">
              {navItems.map((n) => (
                <CommandItem
                  key={n.key}
                  value={`${n.label} ${n.hint} navigate page`}
                  onSelect={() => { setView(n.key); setCommandOpen(false); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg aria-selected:bg-sunset-cream/40 aria-selected:text-foreground cursor-pointer text-sm"
                >
                  <n.icon className="h-4 w-4 text-sunset-deep shrink-0" />
                  <span className="flex-1">{n.label}</span>
                  <span className="text-[10px] text-muted-foreground">{n.hint}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            {/* Quick actions */}
            <CommandGroup heading="Quick Actions" className="text-xs text-muted-foreground px-2">
              {quickActions.map((a) => (
                <CommandItem
                  key={a.id}
                  value={`${a.label} action`}
                  onSelect={() => a.action()}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg aria-selected:bg-sunset-cream/40 cursor-pointer text-sm"
                >
                  <a.icon className="h-4 w-4 text-sunset-orange shrink-0" />
                  <span className="flex-1">{a.label}</span>
                  {a.hint && <span className="text-[10px] text-muted-foreground">{a.hint}</span>}
                  <CornerDownLeft className="h-3 w-3 text-muted-foreground" />
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            {/* Ads search results */}
            {adResults.length > 0 && (
            <CommandGroup heading="Saved Ads" className="text-xs text-muted-foreground px-2">
              {adResults.map((a) => (
                <CommandItem
                  key={a.id}
                  value={`ad ${a.label} ${a.hint} ${a.keywords}`}
                  onSelect={() => a.action()}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg aria-selected:bg-sunset-cream/40 cursor-pointer text-sm"
                >
                  <a.icon className="h-4 w-4 text-sunset-amber shrink-0" />
                  <span className="flex-1 truncate">{a.label}</span>
                  <span className="text-[10px] text-muted-foreground truncate max-w-[160px]">{a.hint}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            )}

            {/* Competitors */}
            {competitorResults.length > 0 && (
            <CommandGroup heading="Competitors" className="text-xs text-muted-foreground px-2">
              {competitorResults.map((c) => (
                <CommandItem
                  key={c.id}
                  value={`competitor ${c.label} ${c.hint} ${c.keywords}`}
                  onSelect={() => c.action()}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg aria-selected:bg-sunset-cream/40 cursor-pointer text-sm"
                >
                  <c.icon className="h-4 w-4 text-sunset-deep shrink-0" />
                  <span className="flex-1 truncate">{c.label}</span>
                  <span className="text-[10px] text-muted-foreground truncate max-w-[160px]">{c.hint}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            )}

            <CommandSeparator />

            {/* Theme & role */}
            <CommandGroup heading="Preferences" className="text-xs text-muted-foreground px-2">
              <CommandItem
                value={`switch ${theme} theme toggle dark light`}
                onSelect={() => { toggleTheme(); setCommandOpen(false); sonnerToast.success(`Switched to ${theme === "light" ? "dark" : "light"} mode`); }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg aria-selected:bg-sunset-cream/40 cursor-pointer text-sm"
              >
                {theme === "light" ? <Moon className="h-4 w-4 text-sunset-deep" /> : <Sun className="h-4 w-4 text-sunset-deep" />}
                <span className="flex-1">Switch to {theme === "light" ? "Dark" : "Light"} Mode</span>
              </CommandItem>
              {roleItems.map((r) => (
                <CommandItem
                  key={r.role}
                  value={`switch role ${r.label} demo as`}
                  onSelect={() => { setRole(r.role); setCommandOpen(false); sonnerToast.success(`Now viewing as ${r.label}`); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg aria-selected:bg-sunset-cream/40 cursor-pointer text-sm"
                >
                  <r.icon className="h-4 w-4 text-sunset-deep shrink-0" />
                  <span className="flex-1">View as {r.label}</span>
                  {role === r.role && <span className="text-[10px] text-sunset-deep font-semibold">CURRENT</span>}
                </CommandItem>
              ))}
              <CommandItem
                value="back to landing page home exit"
                onSelect={() => { goLanding(); setCommandOpen(false); }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg aria-selected:bg-sunset-cream/40 cursor-pointer text-sm"
              >
                <Chrome className="h-4 w-4 text-sunset-deep shrink-0" />
                <span className="flex-1">Back to Landing Page</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
              </CommandItem>
            </CommandGroup>
          </CommandList>

          {/* footer */}
          <div className="border-t border-border px-4 py-2 flex items-center justify-between text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-sunset-orange" />
              AdSpy Lite Command Palette
            </span>
            <span className="flex items-center gap-3">
              <span className="flex items-center gap-1"><kbd className="rounded border border-border bg-muted px-1">↑↓</kbd> navigate</span>
              <span className="flex items-center gap-1"><kbd className="rounded border border-border bg-muted px-1">↵</kbd> select</span>
            </span>
          </div>
        </Command>
      </div>
    </div>
  );
}
