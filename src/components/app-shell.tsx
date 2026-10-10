"use client";

import { useEffect } from "react";
import { useAppStore, type ViewKey } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard, Bookmark, Users, BarChart3, FolderHeart, UsersRound,
  Shield, Settings, CreditCard, Sparkles, Sun, Moon, Menu, X, LogOut,
  ChevronDown, Bell, Search, Crown, Zap, Star, Keyboard, KeyRound, LifeBuoy,
} from "lucide-react";
import { sonnerToast } from "@/lib/toast-helpers";
import type { UserRole } from "@/lib/mock-data";
import { CommandPalette } from "@/components/command-palette";
import { NotificationsPanel } from "@/components/notifications";
import { OnboardingModal } from "@/components/onboarding";
import { ComparisonTray } from "@/components/comparison";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import { ChangelogModal, APP_VERSION } from "@/components/changelog";

interface NavItem {
  key: ViewKey;
  label: string;
  icon: React.ElementType;
  roles: UserRole[];
  badge?: string;
}

const navItems: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["free", "pro", "agency", "team", "admin"] },
  { key: "search", label: "Search", icon: Search, roles: ["free", "pro", "agency", "team", "admin"] },
  { key: "saved-ads", label: "Saved Ads", icon: Bookmark, roles: ["free", "pro", "agency", "team", "admin"] },
  { key: "competitors", label: "Competitors", icon: Users, roles: ["free", "pro", "agency", "team", "admin"] },
  { key: "analytics", label: "Analytics", icon: BarChart3, roles: ["pro", "agency", "team", "admin"] },
  { key: "swipe-file", label: "Swipe File", icon: FolderHeart, roles: ["pro", "agency", "admin"] },
  { key: "team", label: "Team", icon: UsersRound, roles: ["agency", "admin"] },
  { key: "api-keys", label: "API Keys", icon: KeyRound, roles: ["agency", "admin"] },
  { key: "support", label: "Support", icon: LifeBuoy, roles: ["free", "pro", "agency", "team", "admin"] },
  { key: "admin", label: "Admin Panel", icon: Shield, roles: ["admin"] },
  { key: "billing", label: "Billing", icon: CreditCard, roles: ["free", "pro", "agency", "admin"] },
  { key: "settings", label: "Settings", icon: Settings, roles: ["free", "pro", "agency", "team", "admin"] },
];

const roleConfig: Record<UserRole, { label: string; color: string; icon: React.ElementType }> = {
  free: { label: "Free User", color: "#FBB931", icon: Star },
  pro: { label: "Pro User", color: "#F88F22", icon: Zap },
  agency: { label: "Agency Owner", color: "#EA6113", icon: Crown },
  team: { label: "Team Member", color: "#FF9F45", icon: UsersRound },
  admin: { label: "Admin", color: "#B84A0E", icon: Shield },
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const { view, role, theme, sidebarOpen, setView, setRole, toggleTheme, setSidebarOpen, goLanding, setCommandOpen, notifOpen, setNotifOpen, setHelpOpen, setChangelogOpen, lastSeenVersion, markVersionSeen } = useAppStore();
  const visibleNav = navItems.filter((n) => n.roles.includes(role));
  const rc = roleConfig[role];

  // Mark version seen on first ever app entry (so auto-open only fires on real updates)
  useEffect(() => {
    if (lastSeenVersion === "") {
      markVersionSeen(APP_VERSION);
    }
  }, [lastSeenVersion, markVersionSeen]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 h-16 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="flex h-full items-center gap-3 px-4 lg:px-6">
          {/* Mobile menu */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo */}
          <button onClick={goLanding} className="flex items-center gap-2 shrink-0 group">
            <div className="relative h-9 w-9 rounded-xl bg-sunset-gradient flex items-center justify-center shadow-lg shadow-sunset-orange/30 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold leading-none">AdSpy Lite</p>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Competitor Research</p>
            </div>
          </button>

          {/* Search — opens command palette on click, navigates to full search on Enter */}
          <button
            onClick={() => setCommandOpen(true)}
            className="hidden md:flex flex-1 max-w-md mx-auto items-center gap-2 h-9 px-3 rounded-lg bg-muted/60 border border-border/40 text-sm text-muted-foreground hover:bg-muted hover:border-sunset-orange/40 transition-all group"
          >
            <Search className="h-4 w-4 shrink-0 group-hover:text-sunset-deep transition-colors" />
            <span className="flex-1 text-left">Search ads, competitors, folders…</span>
            <kbd className="hidden lg:flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground group-hover:border-sunset-orange/40">⌘K</kbd>
          </button>
          {/* Mobile search icon — goes straight to search view */}
          <Button variant="ghost" size="icon" className="md:hidden h-9 w-9" onClick={() => setView("search")}>
            <Search className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1.5 ml-auto">
            {/* What's New / Changelog */}
            <Button variant="ghost" size="icon" onClick={() => setChangelogOpen(true)} className="h-9 w-9 hidden sm:flex relative" title="What's new">
              <Sparkles className="h-4 w-4" />
              {lastSeenVersion !== APP_VERSION && lastSeenVersion !== "" && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-sunset-deep ring-2 ring-background animate-pulse" />
              )}
            </Button>

            {/* Keyboard shortcuts help */}
            <Button variant="ghost" size="icon" onClick={() => setHelpOpen(true)} className="h-9 w-9 hidden sm:flex" title="Keyboard shortcuts (?)">
              <Keyboard className="h-4 w-4" />
            </Button>

            {/* Theme toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9" title="Toggle theme (T)">
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="icon" className="h-9 w-9 relative" onClick={() => setNotifOpen(!notifOpen)}>
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-sunset-deep ring-2 ring-background animate-pulse" />
              </Button>
              <NotificationsPanel />
            </div>

            {/* Role switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 gap-2 px-2 hover:bg-muted">
                  <Avatar className="h-7 w-7 border-2" style={{ borderColor: rc.color }}>
                    <AvatarFallback className="text-[10px] font-bold text-white" style={{ backgroundColor: rc.color }}>
                      {rc.label.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold leading-none flex items-center gap-1">
                      <rc.icon className="h-3 w-3" style={{ color: rc.color }} />
                      {rc.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Switch role</p>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs text-muted-foreground">Demo as role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(Object.keys(roleConfig) as UserRole[]).map((r) => {
                  const cfg = roleConfig[r];
                  return (
                    <DropdownMenuItem
                      key={r}
                      onClick={() => { setRole(r); sonnerToast.success(`Now viewing as ${cfg.label}`); }}
                      className={cn("gap-2 cursor-pointer", role === r && "bg-accent")}
                    >
                      <cfg.icon className="h-4 w-4" style={{ color: cfg.color }} />
                      <span className="flex-1">{cfg.label}</span>
                      {role === r && <Badge variant="secondary" className="h-4 text-[9px] px-1">active</Badge>}
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setView("pricing")} className="gap-2 cursor-pointer text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  View pricing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setView("login")} className="gap-2 cursor-pointer text-muted-foreground">
                  <LogOut className="h-4 w-4" />
                  Sign out / Switch account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={goLanding} className="gap-2 cursor-pointer text-muted-foreground">
                  <Sparkles className="h-4 w-4" />
                  Back to landing page
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - desktop */}
        <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border/60 bg-sidebar/50">
          <SidebarContent visibleNav={visibleNav} view={view} setView={setView} role={role} />
        </aside>

        {/* Sidebar - mobile drawer */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <aside className="relative w-64 max-w-[80vw] flex flex-col bg-sidebar border-r border-border animate-in slide-in-from-left duration-200">
              <SidebarContent visibleNav={visibleNav} view={view} setView={setView} role={role} />
            </aside>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1 p-4 lg:p-6">
            {children}
          </div>
          {/* Footer */}
          <Footer />
        </main>
      </div>

      {/* Global overlays */}
      <CommandPalette />
      <OnboardingModal />
      <ComparisonTray />
      <KeyboardShortcuts />
      <ChangelogModal />
    </div>
  );
}

function SidebarContent({ visibleNav, view, setView, role }: {
  visibleNav: NavItem[];
  view: ViewKey;
  setView: (v: ViewKey) => void;
  role: UserRole;
}) {
  const { goLanding } = useAppStore();
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 space-y-1">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Workspace</p>
        {visibleNav.map((item) => {
          const active = view === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all relative group",
                active
                  ? "bg-sunset-gradient text-white shadow-md shadow-sunset-orange/25"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0", active ? "text-white" : "text-muted-foreground group-hover:text-foreground")} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="h-4 text-[9px] px-1">{item.badge}</Badge>
              )}
              {!active && item.key === "admin" && role === "admin" && (
                <span className="h-1.5 w-1.5 rounded-full bg-sunset-deep" />
              )}
            </button>
          );
        })}

        {/* Upgrade card */}
        {role === "free" && (
          <div className="mt-4 mx-1 rounded-xl bg-sunset-radial border border-sunset-amber/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-4 w-4 text-sunset-deep" />
              <p className="text-xs font-bold">Upgrade to Pro</p>
            </div>
            <p className="text-[11px] text-muted-foreground mb-3">Unlock unlimited ads, analytics & 10 competitors.</p>
            <Button size="sm" className="w-full h-8 bg-sunset-gradient hover:opacity-90 text-xs" onClick={() => setView("billing")}>
              View Plans
            </Button>
          </div>
        )}
      </div>

      {/* Bottom: back to landing */}
      <div className="border-t border-border/60 p-3">
        <button
          onClick={goLanding}
          className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          Back to landing page
        </button>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-sidebar/30">
      <div className="px-4 lg:px-6 py-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-6 w-6 rounded-md bg-sunset-gradient flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span>© 2024 AdSpy Lite — Competitor research made simple.</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <button className="hover:text-foreground transition-colors">Privacy</button>
            <button className="hover:text-foreground transition-colors">Terms</button>
            <button className="hover:text-foreground transition-colors">Support</button>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
