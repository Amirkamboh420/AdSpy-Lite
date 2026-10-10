"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Settings,
  User,
  Bell,
  RefreshCw,
  Puzzle,
  Shield,
  Trash2,
  Check,
  Mail,
  Download,
  Database,
  Chrome,
  Lock,
  AlertTriangle,
  Save,
  KeyRound,
  Eye,
  HardDrive,
  Sparkles,
  Keyboard,
  RotateCcw,
  Info,
} from "lucide-react";
import { sonnerToast } from "@/lib/toast-helpers";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type SectionId =
  | "account"
  | "notifications"
  | "sync"
  | "extension"
  | "privacy"
  | "about"
  | "danger";

const navItems: {
  id: SectionId;
  label: string;
  icon: React.ElementType;
  desc: string;
}[] = [
  { id: "account", label: "Account", icon: User, desc: "Profile & connected accounts" },
  { id: "notifications", label: "Notifications", icon: Bell, desc: "Email & alert preferences" },
  { id: "sync", label: "Sync & Data", icon: RefreshCw, desc: "Auto-sync & exports" },
  { id: "extension", label: "Extension", icon: Puzzle, desc: "Chrome extension status" },
  { id: "privacy", label: "Privacy", icon: Shield, desc: "Data retention & GDPR" },
  { id: "about", label: "About & Help", icon: Info, desc: "Onboarding, shortcuts, version" },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle, desc: "Account deletion" },
];

export function SettingsView() {
  const [section, setSection] = useState<SectionId>("account");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-sunset-gradient flex items-center justify-center shrink-0 shadow-sm">
          <Settings className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account, notifications &amp; sync preferences
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        {/* Left vertical nav */}
        <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {navItems.map((item) => {
            const active = section === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-all whitespace-nowrap lg:whitespace-normal group",
                  active
                    ? "bg-sunset-gradient text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", active ? "text-white" : "text-sunset-deep")} />
                <div className="min-w-0">
                  <p className={cn("text-sm font-medium", active && "text-white")}>{item.label}</p>
                  <p
                    className={cn(
                      "text-[10px] leading-tight hidden lg:block",
                      active ? "text-white/80" : "text-muted-foreground/70"
                    )}
                  >
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Active section content */}
        <div className="min-w-0">
          {section === "account" && <AccountSection />}
          {section === "notifications" && <NotificationsSection />}
          {section === "sync" && <SyncSection />}
          {section === "extension" && <ExtensionSection />}
          {section === "privacy" && <PrivacySection />}
          {section === "about" && <AboutSection />}
          {section === "danger" && <DangerSection />}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Account ---------------- */

function AccountSection() {
  const [metaConnected, setMetaConnected] = useState(true);
  const [googleConnected, setGoogleConnected] = useState(false);

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <User className="h-4 w-4 text-sunset-deep" /> Profile
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Update your personal information and avatar
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-5">
          <Avatar className="h-16 w-16 bg-sunset-gradient">
            <AvatarFallback className="bg-transparent text-white text-xl font-bold">AK</AvatarFallback>
          </Avatar>
          <div className="space-y-1.5">
            <Button size="sm" variant="outline" onClick={() => sonnerToast.success("Avatar upload started")}>
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Upload new
            </Button>
            <p className="text-[11px] text-muted-foreground">PNG or JPG. Max 2MB.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="settings-name" className="text-xs">Full name</Label>
            <Input id="settings-name" defaultValue="Ayesha Khan" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="settings-email" className="text-xs">Email address</Label>
            <Input id="settings-email" type="email" defaultValue="ayesha@adspy.agency" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="settings-company" className="text-xs">Company / Agency</Label>
            <Input id="settings-company" defaultValue="AdSpy Agency" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="settings-role" className="text-xs">Role</Label>
            <Input id="settings-role" defaultValue="Performance Marketer" />
          </div>
        </div>

        <Separator className="my-5" />

        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => sonnerToast.info("Changes discarded")}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-sunset-gradient text-white hover:opacity-90"
            onClick={() => sonnerToast.success("Profile saved successfully")}
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save changes
          </Button>
        </div>
      </Card>

      <Card className="p-5">
        <div className="mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-sunset-deep" /> Connected Accounts
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Link accounts to enable ad scraping and single sign-on
          </p>
        </div>

        <div className="space-y-3">
          <ConnectedAccountRow
            name="Meta (Facebook)"
            handle="@khaadi.official"
            color="#1877F2"
            connected={metaConnected}
            onToggle={(v) => {
              setMetaConnected(v);
              sonnerToast.success(v ? "Meta account connected" : "Meta account disconnected");
            }}
          />
          <Separator />
          <ConnectedAccountRow
            name="Google"
            handle="ayesha@adspy.agency"
            color="#EA4335"
            connected={googleConnected}
            onToggle={(v) => {
              setGoogleConnected(v);
              sonnerToast.success(v ? "Google account connected" : "Google account disconnected");
            }}
          />
        </div>
      </Card>
    </div>
  );
}

function ConnectedAccountRow({
  name,
  handle,
  color,
  connected,
  onToggle,
}: {
  name: string;
  handle: string;
  color: string;
  connected: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold"
          style={{ backgroundColor: color }}
        >
          {name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{name}</p>
          <p className="text-xs text-muted-foreground truncate">{handle}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {connected && (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 text-[10px]">
            Connected
          </Badge>
        )}
        <Switch checked={connected} onCheckedChange={onToggle} />
      </div>
    </div>
  );
}

/* ---------------- Notifications ---------------- */

function NotificationsSection() {
  const [prefs, setPrefs] = useState({
    alerts: true,
    digest: true,
    product: true,
    security: true,
    marketing: false,
  });

  const items: { key: keyof typeof prefs; label: string; desc: string; icon: React.ElementType }[] = [
    { key: "alerts", label: "New ad alerts from competitors", desc: "Get notified when a tracked competitor launches new ads", icon: Bell },
    { key: "digest", label: "Weekly digest email", desc: "Summary of saved ads, top trends & competitor activity every Monday", icon: Mail },
    { key: "product", label: "Product updates", desc: "New features, changelog & roadmap announcements", icon: Puzzle },
    { key: "security", label: "Security alerts", desc: "Login attempts, password changes & API key activity", icon: Shield },
    { key: "marketing", label: "Marketing emails", desc: "Tips, case studies & occasional promotional offers", icon: Mail },
  ];

  return (
    <Card className="p-5">
      <div className="mb-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Bell className="h-4 w-4 text-sunset-deep" /> Notification Preferences
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Choose what we email you and when
        </p>
      </div>

      <div className="divide-y">
        {items.map((item) => {
          const Icon = item.icon;
          const checked = prefs[item.key];
          return (
            <div key={item.key} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
              <div className="h-8 w-8 rounded-lg bg-sunset-cream/40 flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4 text-sunset-deep" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <Switch
                checked={checked}
                onCheckedChange={(v) => {
                  setPrefs((p) => ({ ...p, [item.key]: v }));
                  sonnerToast.success(`${item.label} ${v ? "enabled" : "disabled"}`);
                }}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ---------------- Sync & Data ---------------- */

function SyncSection() {
  const [autoSync, setAutoSync] = useState(true);
  const [frequency, setFrequency] = useState("30m");

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-sunset-deep" /> Auto-Sync
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Keep your saved ads and competitor data fresh automatically
          </p>
        </div>

        <div className="flex items-start gap-3 py-3">
          <div className="h-8 w-8 rounded-lg bg-sunset-cream/40 flex items-center justify-center shrink-0">
            <RefreshCw className="h-4 w-4 text-sunset-deep" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Enable auto-sync</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Periodically re-check active ads and pull new creatives from tracked competitors
            </p>
          </div>
          <Switch
            checked={autoSync}
            onCheckedChange={(v) => {
              setAutoSync(v);
              sonnerToast.success(`Auto-sync ${v ? "enabled" : "disabled"}`);
            }}
          />
        </div>

        <Separator className="my-2" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3">
          <div>
            <Label className="text-sm font-medium">Sync frequency</Label>
            <p className="text-xs text-muted-foreground mt-0.5">How often we check for new ads</p>
          </div>
          <Select
            value={frequency}
            onValueChange={(v) => {
              setFrequency(v);
              sonnerToast.success(`Sync frequency updated`);
            }}
            disabled={!autoSync}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15m">Every 15 minutes</SelectItem>
              <SelectItem value="30m">Every 30 minutes</SelectItem>
              <SelectItem value="1h">Every hour</SelectItem>
              <SelectItem value="6h">Every 6 hours</SelectItem>
              <SelectItem value="24h">Once a day</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="p-5">
        <div className="mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Database className="h-4 w-4 text-sunset-deep" /> Data Management
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Export your data or free up local storage
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <button
            onClick={() => sonnerToast.success("Export started — we'll email you a download link")}
            className="flex items-start gap-3 p-4 rounded-lg border border-border/60 hover:border-sunset-orange/40 hover:bg-muted/30 transition-all text-left"
          >
            <div className="h-9 w-9 rounded-lg bg-sunset-gradient flex items-center justify-center shrink-0">
              <Download className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Export all my data</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Download every saved ad, note, folder &amp; tag as JSON
              </p>
            </div>
          </button>

          <button
            onClick={() => sonnerToast.success("Cache cleared — freed 38.4 MB")}
            className="flex items-start gap-3 p-4 rounded-lg border border-border/60 hover:border-sunset-orange/40 hover:bg-muted/30 transition-all text-left"
          >
            <div className="h-9 w-9 rounded-lg bg-sunset-cream/60 flex items-center justify-center shrink-0">
              <HardDrive className="h-4 w-4 text-sunset-deep" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Clear cache</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Remove cached thumbnails &amp; metadata. Saved ads stay intact
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">Currently using 38.4 MB</p>
            </div>
          </button>
        </div>
      </Card>
    </div>
  );
}

/* ---------------- Extension ---------------- */

function ExtensionSection() {
  const permissions = [
    { label: "Access Meta Ad Library pages", desc: "Read ad creatives & metadata on facebook.com/ads/library", granted: true },
    { label: "Storage", desc: "Save ad screenshots & metadata locally in your browser", granted: true },
    { label: "Notifications", desc: "Show desktop alerts for new competitor ads", granted: true },
    { label: "Tabs", desc: "Detect when you're viewing a tracked advertiser's page", granted: false },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-semibold flex items-center gap-2">
              <Puzzle className="h-4 w-4 text-sunset-deep" /> Chrome Extension
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Status, updates &amp; permissions for the AdSpy Lite scraper
            </p>
          </div>
          <Badge className="bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
            Installed v2.4.1
          </Badge>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-lg bg-sunset-cream/30 border border-sunset-cream/60">
          <div className="h-10 w-10 rounded-lg bg-sunset-gradient flex items-center justify-center shrink-0">
            <Chrome className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">AdSpy Lite Scraper</p>
            <p className="text-xs text-muted-foreground">
              Last sync 2 minutes ago · Connected to this browser
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => sonnerToast.success("You're on the latest version ✓")}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Check for updates
          </Button>
        </div>
      </Card>

      <Card className="p-5">
        <div className="mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Lock className="h-4 w-4 text-sunset-deep" /> Permissions
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            What the extension is allowed to access
          </p>
        </div>

        <div className="divide-y">
          {permissions.map((p) => (
            <div key={p.label} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <div
                className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center shrink-0",
                  p.granted
                    ? "bg-green-100 dark:bg-green-950/40"
                    : "bg-muted"
                )}
              >
                {p.granted ? (
                  <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                ) : (
                  <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{p.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
              </div>
              <Badge
                variant={p.granted ? "secondary" : "outline"}
                className={cn(
                  "text-[10px] shrink-0",
                  p.granted && "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                )}
              >
                {p.granted ? "Granted" : "Not granted"}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ---------------- Privacy ---------------- */

function PrivacySection() {
  const [retention, setRetention] = useState("90d");

  return (
    <Card className="p-5">
      <div className="mb-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Shield className="h-4 w-4 text-sunset-deep" /> Privacy &amp; Data
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Control how long we keep your data and exercise your GDPR rights
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3">
        <div>
          <Label className="text-sm font-medium">Data retention period</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Saved ads &amp; metadata are auto-deleted after this window
          </p>
        </div>
        <Select
          value={retention}
          onValueChange={(v) => {
            setRetention(v);
            sonnerToast.success("Retention period updated");
          }}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30d">30 days</SelectItem>
            <SelectItem value="90d">90 days</SelectItem>
            <SelectItem value="180d">6 months</SelectItem>
            <SelectItem value="365d">1 year</SelectItem>
            <SelectItem value="forever">Keep forever</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="my-4" />

      <div className="grid sm:grid-cols-2 gap-3">
        <button
          onClick={() => sonnerToast.success("Data export requested — ready within 24h")}
          className="flex items-start gap-3 p-4 rounded-lg border border-border/60 hover:border-sunset-orange/40 hover:bg-muted/30 transition-all text-left"
        >
          <div className="h-9 w-9 rounded-lg bg-sunset-gradient flex items-center justify-center shrink-0">
            <Download className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Download my data</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              GDPR Article 20 — full machine-readable export of your data
            </p>
          </div>
        </button>

        <button
          onClick={() => sonnerToast.warning("Deletion request submitted — you have 14 days to cancel")}
          className="flex items-start gap-3 p-4 rounded-lg border border-border/60 hover:border-red-400/60 hover:bg-red-50/40 dark:hover:bg-red-950/10 transition-all text-left"
        >
          <div className="h-9 w-9 rounded-lg bg-red-100 dark:bg-red-950/40 flex items-center justify-center shrink-0">
            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Request deletion</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              GDPR Article 17 — permanently erase your account &amp; data
            </p>
          </div>
        </button>
      </div>
    </Card>
  );
}

/* ---------------- About & Help ---------------- */

function AboutSection() {
  const { setOnboardingSeen, setHelpOpen } = useAppStore();
  const [openReplay, setOpenReplay] = useState(false);

  return (
    <div className="space-y-4">
      {/* Replay onboarding */}
      <Card className="p-5">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-sunset-gradient flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold mb-1">Replay Onboarding Tour</h2>
            <p className="text-sm text-muted-foreground mb-3">
              New to AdSpy Lite or want a refresher? Replay the 4-step welcome tour to revisit how to save ads, organize folders, and analyze patterns.
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpenReplay(true)}
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Replay tour
              </Button>
              <Button variant="ghost" size="sm" onClick={() => sonnerToast.info("Onboarding marked as seen")}>
                Mark as seen
              </Button>
            </div>
          </div>
        </div>
        <Dialog open={openReplay} onOpenChange={setOpenReplay}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-sunset-deep" /> Replay onboarding?</DialogTitle>
              <DialogDescription>
                The welcome tour will appear next time you enter the dashboard. Continue?
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 pt-2">
              <DialogClose asChild>
                <Button variant="outline" size="sm">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  size="sm"
                  className="bg-sunset-gradient hover:opacity-90 text-white"
                  onClick={() => {
                    setOnboardingSeen(false);
                    sonnerToast.success("Onboarding will replay on next dashboard visit");
                  }}
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  Replay
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </Card>

      {/* Keyboard shortcuts */}
      <Card className="p-5">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-sunset-cream/60 flex items-center justify-center shrink-0">
            <Keyboard className="h-5 w-5 text-sunset-deep" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold mb-1">Keyboard Shortcuts</h2>
            <p className="text-sm text-muted-foreground mb-3">
              AdSpy Lite supports keyboard shortcuts for power users. Press <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[10px] font-semibold">?</kbd> anywhere to see them, or open the command palette with <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[10px] font-semibold">⌘K</kbd>.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { k: "⌘K", d: "Command palette" },
                { k: "?", d: "Shortcuts help" },
                { k: "G then D", d: "Go to Dashboard" },
                { k: "G then S", d: "Go to Saved Ads" },
                { k: "T", d: "Toggle theme" },
                { k: "N", d: "Notifications" },
              ].map((s) => (
                <div key={s.k} className="flex items-center justify-between rounded-md border border-border/60 px-2.5 py-1.5">
                  <span className="text-muted-foreground">{s.d}</span>
                  <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-semibold">{s.k}</kbd>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => setHelpOpen(true)}>
              <Keyboard className="h-3.5 w-3.5 mr-1.5" />
              View all shortcuts
            </Button>
          </div>
        </div>
      </Card>

      {/* Version info */}
      <Card className="p-5 bg-sunset-radial">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-sunset-gradient flex items-center justify-center shrink-0">
            <Info className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold mb-1">About AdSpy Lite</h2>
            <div className="grid grid-cols-2 gap-2 text-xs mt-2">
              <div className="rounded-md bg-card border border-border/60 px-3 py-2">
                <p className="text-muted-foreground">Version</p>
                <p className="font-semibold">v2.4.1 (web)</p>
              </div>
              <div className="rounded-md bg-card border border-border/60 px-3 py-2">
                <p className="text-muted-foreground">Extension</p>
                <p className="font-semibold">v2.4.1 — Installed</p>
              </div>
              <div className="rounded-md bg-card border border-border/60 px-3 py-2">
                <p className="text-muted-foreground">Last sync</p>
                <p className="font-semibold">2 min ago</p>
              </div>
              <div className="rounded-md bg-card border border-border/60 px-3 py-2">
                <p className="text-muted-foreground">Region</p>
                <p className="font-semibold">South Asia</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-3 text-xs">
              <button className="text-sunset-deep hover:underline">Changelog</button>
              <span className="text-muted-foreground">·</span>
              <button className="text-sunset-deep hover:underline">Documentation</button>
              <span className="text-muted-foreground">·</span>
              <button className="text-sunset-deep hover:underline">Support</button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ---------------- Danger Zone ---------------- */

function DangerSection() {
  const [confirmText, setConfirmText] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <Card className="p-5 border-red-300/60 dark:border-red-900/40">
      <div className="mb-4">
        <h2 className="font-semibold flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-4 w-4" /> Danger Zone
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Irreversible &amp; destructive actions — proceed with caution
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg bg-red-50/60 dark:bg-red-950/10 border border-red-200/60 dark:border-red-900/40">
        <div className="min-w-0">
          <p className="text-sm font-medium">Delete this account</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            All 101 saved ads, 6 competitors &amp; team membership will be permanently removed.
            This action cannot be undone.
          </p>
        </div>

        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setConfirmText(""); }}>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm" className="shrink-0">
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Delete account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Delete account permanently?
              </DialogTitle>
              <DialogDescription>
                This will erase everything associated with{" "}
                <span className="font-medium text-foreground">ayesha@adspy.agency</span> —
                saved ads, folders, competitor trackers, notes, billing history &amp; team access.
                <br />
                <br />
                To confirm, type <span className="font-mono font-semibold text-red-600 dark:text-red-400">DELETE MY ACCOUNT</span> below.
              </DialogDescription>
            </DialogHeader>

            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE MY ACCOUNT"
              className="font-mono text-sm"
            />

            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                variant="destructive"
                disabled={confirmText !== "DELETE MY ACCOUNT"}
                onClick={() => {
                  setOpen(false);
                  setConfirmText("");
                  sonnerToast.error("Account scheduled for deletion — goodbye");
                }}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Delete forever
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}
