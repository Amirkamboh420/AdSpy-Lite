"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
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
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  KeyRound,
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Code,
  Webhook,
  Shield,
  Check,
  Clock,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  MoreVertical,
  Activity,
  Zap,
} from "lucide-react";
import { sonnerToast } from "@/lib/toast-helpers";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types & mock data                                                  */
/* ------------------------------------------------------------------ */

type ApiKeyStatus = "active" | "revoked";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  requests: number;
  status: ApiKeyStatus;
  scopes: string[];
}

const mockApiKeys: ApiKey[] = [
  { id: "key-1", name: "Production Dashboard", key: "adspy_live_sk_8f2a9b3c4d5e6f7g8h9i0j", created: "2024-11-15", lastUsed: "2 hours ago", requests: 15420, status: "active", scopes: ["read:ads", "read:competitors", "export:ads"] },
  { id: "key-2", name: "Staging Environment", key: "adspy_live_sk_2x3y4z5a6b7c8d9e0f1g2h", created: "2024-12-01", lastUsed: "1 day ago", requests: 320, status: "active", scopes: ["read:ads"] },
  { id: "key-3", name: "Legacy Integration", key: "adspy_live_sk_9a8b7c6d5e4f3g2h1i0j9k", created: "2024-08-20", lastUsed: "3 months ago", requests: 8901, status: "revoked", scopes: ["read:ads", "read:competitors"] },
];

const allScopes: { id: string; label: string; desc: string }[] = [
  { id: "read:ads", label: "read:ads", desc: "View saved ads" },
  { id: "read:competitors", label: "read:competitors", desc: "View tracked competitors" },
  { id: "read:analytics", label: "read:analytics", desc: "Access analytics data" },
  { id: "export:ads", label: "export:ads", desc: "Export ad reports" },
  { id: "write:tags", label: "write:tags", desc: "Create & edit tags" },
];

const scopeBadgeClass: Record<string, string> = {
  "read:ads": "border-sunset-deep/30 bg-sunset-deep/10 text-sunset-deep",
  "read:competitors": "border-sunset-orange/30 bg-sunset-orange/10 text-sunset-orange",
  "read:analytics": "border-sunset-amber/40 bg-sunset-amber/15 text-amber-700 dark:text-amber-300",
  "export:ads": "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  "write:tags": "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
};

const statusBadgeClass: Record<ApiKeyStatus, { label: string; className: string; dot: string }> = {
  active: {
    label: "Active",
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  revoked: {
    label: "Revoked",
    className: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
    dot: "bg-red-500",
  },
};

interface Webhook {
  id: string;
  url: string;
  events: string[];
  enabled: boolean;
  lastDelivery: string;
}

const initialWebhooks: Webhook[] = [
  { id: "wh-1", url: "https://hooks.example.com/adspy/saved", events: ["ad.saved", "competitor.new"], enabled: true, lastDelivery: "12 min ago" },
  { id: "wh-2", url: "https://api.myagency.com/webhooks/adspy", events: ["ad.saved", "ad.ended", "competitor.new"], enabled: false, lastDelivery: "3 days ago" },
];

type CodeLang = "curl" | "js" | "python";

const codeExamples: Record<CodeLang, { label: string; code: string }> = {
  curl: {
    label: "cURL",
    code: `# Fetch your saved ads (newest first)
curl -X GET https://api.adspy.lite/v1/ads \\
  -H "Authorization: Bearer adspy_live_sk_8f2a9b3c4d5e6f7g8h9i0j" \\
  -H "Content-Type: application/json" \\
  -G --data-urlencode "limit=50" \\
  --data-urlencode "sort=-saved_at"

# Response (200 OK)
# {
#   "data": [{ "id": "ad_1", "headline": "Summer Sale" }],
#   "next_cursor": "eyJwYWdlIjoxfQ=="
# }`,
  },
  js: {
    label: "JavaScript",
    code: `// Browser or Node 18+
const res = await fetch(
  "https://api.adspy.lite/v1/ads?limit=50&sort=-saved_at",
  {
    headers: {
      Authorization: "Bearer adspy_live_sk_8f2a9b3c4d5e6f7g8h9i0j",
      "Content-Type": "application/json",
    },
  }
);

if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
const { data, next_cursor } = await res.json();
console.log(\`Loaded \${data.length} ads\`);`,
  },
  python: {
    label: "Python",
    code: `import requests

API_BASE = "https://api.adspy.lite/v1"
TOKEN = "adspy_live_sk_8f2a9b3c4d5e6f7g8h9i0j"

resp = requests.get(
    f"{API_BASE}/ads",
    params={"limit": 50, "sort": "-saved_at"},
    headers={"Authorization": f"Bearer {TOKEN}"},
)
resp.raise_for_status()
payload = resp.json()
print(f"Loaded {len(payload['data'])} ads")`,
  },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function maskKey(key: string): string {
  return `adspy_live_sk_${"•".repeat(8)}${key.slice(-4)}`;
}

function generateKey(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let body = "";
  for (let i = 0; i < 22; i += 1) {
    body += chars[Math.floor(Math.random() * chars.length)];
  }
  return `adspy_live_sk_${body}`;
}

async function copyToClipboard(text: string, label: string) {
  try {
    await navigator.clipboard.writeText(text);
    sonnerToast.success(`${label} copied to clipboard`);
  } catch {
    sonnerToast.error("Failed to copy — clipboard unavailable");
  }
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: typeof KeyRound;
  label: string;
  value: string;
  sub?: React.ReactNode;
  accent: string;
}) {
  return (
    <Card className="rounded-xl p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">{value}</p>
          {sub ? <div className="mt-2">{sub}</div> : null}
        </div>
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-white shadow-sm"
          style={{ background: accent }}
        >
          <Icon className="size-5" />
        </div>
      </div>
    </Card>
  );
}

function UsageBar({
  label,
  current,
  max,
  unit,
  color,
}: {
  label: string;
  current: number;
  max: number;
  unit?: string;
  color: string;
}) {
  const pct = Math.min(100, Math.round((current / max) * 100));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="tabular-nums text-muted-foreground">
          {current.toLocaleString()}
          <span className="text-muted-foreground/70"> / {max.toLocaleString()}{unit ? ` ${unit}` : ""}</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <div className="text-right text-xs tabular-nums text-muted-foreground">{pct}%</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main view                                                          */
/* ------------------------------------------------------------------ */

export function ApiKeysView() {
  const role = useAppStore((s) => s.role);

  const [keys, setKeys] = useState<ApiKey[]>(mockApiKeys);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>(["read:ads"]);
  const [newKeyExpiration, setNewKeyExpiration] = useState("never");
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

  const [webhooks, setWebhooks] = useState<Webhook[]>(initialWebhooks);

  const [activeTab, setActiveTab] = useState<CodeLang>("curl");

  const activeCount = keys.filter((k) => k.status === "active").length;
  const monthRequests = keys.reduce((sum, k) => sum + (k.status === "active" ? k.requests : 0), 0);
  const rateLimitPct = Math.round((420 / 1000) * 100);

  /* ---------------- handlers ---------------- */

  function toggleReveal(id: string) {
    setRevealed((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleScope(id: string) {
    setNewKeyScopes((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  function handleCreateKey() {
    const trimmed = newKeyName.trim();
    if (!trimmed) {
      sonnerToast.error("Please enter a name for your API key");
      return;
    }
    if (newKeyScopes.length === 0) {
      sonnerToast.error("Select at least one scope");
      return;
    }
    const raw = generateKey();
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: trimmed,
      key: raw,
      created: new Date().toISOString().slice(0, 10),
      lastUsed: "Never",
      requests: 0,
      status: "active",
      scopes: newKeyScopes,
    };
    setKeys((prev) => [newKey, ...prev]);
    setShowCreateDialog(false);
    setNewlyCreatedKey(raw);
    sonnerToast.success(`API key "${trimmed}" created`);
  }

  function closeNewKeyDialog() {
    setNewlyCreatedKey(null);
    setNewKeyName("");
    setNewKeyScopes(["read:ads"]);
    setNewKeyExpiration("never");
  }

  function handleRotate(id: string) {
    const k = keys.find((x) => x.id === id);
    if (!k) return;
    const rotated = generateKey();
    setKeys((prev) => prev.map((x) => (x.id === id ? { ...x, key: rotated } : x)));
    sonnerToast.success(`Key for "${k.name}" rotated`);
  }

  function handleRevoke(id: string) {
    const k = keys.find((x) => x.id === id);
    if (!k) return;
    setKeys((prev) => prev.map((x) => (x.id === id ? { ...x, status: "revoked" as ApiKeyStatus } : x)));
    sonnerToast.warning(`"${k.name}" has been revoked`);
  }

  function handleViewUsage(id: string) {
    const k = keys.find((x) => x.id === id);
    if (!k) return;
    sonnerToast.info(`"${k.name}" — ${k.requests.toLocaleString()} requests, last used ${k.lastUsed}`);
  }

  function toggleWebhook(id: string, enabled: boolean) {
    setWebhooks((prev) => prev.map((w) => (w.id === id ? { ...w, enabled } : w)));
    sonnerToast[enabled ? "success" : "warning"](
      enabled ? "Webhook enabled" : "Webhook disabled"
    );
  }

  function testWebhook(wh: Webhook) {
    sonnerToast.success("Test webhook delivered");
  }

  function addWebhook() {
    sonnerToast.info("Add webhook form coming soon");
  }

  /* ---------------- render ---------------- */

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* 1. Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="bg-sunset-gradient flex size-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm">
            <KeyRound className="size-6" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-sunset-gradient text-2xl font-bold tracking-tight sm:text-3xl">
                API Keys &amp; Access
              </h1>
              <Badge className="border-sunset-amber/40 bg-sunset-amber/15 text-amber-800 dark:text-amber-200">
                <Shield className="size-3" />
                AGENCY FEATURE
              </Badge>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Manage API keys for integrating AdSpy Lite with your own dashboards and tools.
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-lg border border-border bg-sunset-cream/40 px-3 py-1.5 text-xs font-medium text-sunset-deep sm:flex">
          <Shield className="size-3.5" />
          Signed in as <span className="capitalize">{role}</span>
        </div>
      </header>

      {/* 2. Info banner */}
      <Card className="bg-sunset-radial overflow-hidden rounded-xl border-sunset-amber/30 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="bg-sunset-gradient flex size-10 shrink-0 items-center justify-center rounded-lg text-white shadow-sm">
              <Code className="size-5" />
            </div>
            <div className="min-w-0 space-y-1.5">
              <h2 className="text-base font-semibold text-foreground">
                Programmatic access to your AdSpy Lite workspace
              </h2>
              <p className="max-w-3xl text-sm text-muted-foreground">
                Use the AdSpy Lite REST API to pull saved ads, competitors, and analytics
                into your own tools. Rate limit: <span className="font-semibold text-foreground">1000 req/hour</span>.
                Base URL:{" "}
                <code className="rounded bg-sunset-cream/70 px-1.5 py-0.5 font-mono text-xs text-sunset-deep">
                  https://api.adspy.lite/v1
                </code>
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="border-sunset-orange/40 text-sunset-deep hover:bg-sunset-cream/40 hover:text-sunset-deep"
            onClick={() => sonnerToast.info("Opening API documentation…")}
          >
            <ExternalLink className="size-4" />
            View full docs
          </Button>
        </div>
      </Card>

      {/* 3. Quick stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={KeyRound}
          label="Active keys"
          value={String(activeCount)}
          accent="linear-gradient(135deg, #EA6113 0%, #F88F22 100%)"
        />
        <StatCard
          icon={Activity}
          label="Total requests this month"
          value={monthRequests.toLocaleString()}
          accent="linear-gradient(135deg, #F88F22 0%, #FBB931 100%)"
        />
        <StatCard
          icon={Zap}
          label="Rate limit usage"
          value={`${rateLimitPct}%`}
          accent="linear-gradient(135deg, #FBB931 0%, #F88F22 100%)"
          sub={
            <div className="space-y-1">
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="bg-sunset-gradient h-full rounded-full"
                  style={{ width: `${rateLimitPct}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">420 / 1000 req this hour</p>
            </div>
          }
        />
      </section>

      {/* 4. API keys table */}
      <Card className="rounded-xl p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <KeyRound className="size-5 text-sunset-deep" />
              API Keys
            </h2>
            <p className="text-sm text-muted-foreground">
              Create, rotate, and revoke keys used to authenticate API requests.
            </p>
          </div>
          <Button
            className="bg-sunset-gradient text-white shadow-sm hover:opacity-90"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="size-4" />
            Create New Key
          </Button>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-hidden rounded-lg border border-border lg:block">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Key</th>
                <th className="px-4 py-3 text-left font-medium">Scopes</th>
                <th className="px-4 py-3 text-right font-medium">Requests</th>
                <th className="px-4 py-3 text-left font-medium">Last Used</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Created</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {keys.map((k) => (
                <tr key={k.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{k.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-xs text-muted-foreground">
                        {revealed[k.id] ? k.key : maskKey(k.key)}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground hover:text-sunset-deep"
                        onClick={() => toggleReveal(k.id)}
                        aria-label={revealed[k.id] ? "Hide key" : "Reveal key"}
                        disabled={k.status === "revoked"}
                      >
                        {revealed[k.id] ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground hover:text-sunset-deep"
                        onClick={() => copyToClipboard(k.key, "API key")}
                        aria-label="Copy key"
                      >
                        <Copy className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex max-w-[220px] flex-wrap gap-1">
                      {k.scopes.map((s) => (
                        <Badge
                          key={s}
                          variant="outline"
                          className={cn("text-[10px] font-mono", scopeBadgeClass[s] ?? "text-muted-foreground")}
                        >
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-foreground">
                    {k.requests.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-3.5" />
                      {k.lastUsed}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={cn("gap-1.5", statusBadgeClass[k.status].className)}
                    >
                      <span className={cn("size-1.5 rounded-full", statusBadgeClass[k.status].dot)} />
                      {statusBadgeClass[k.status].label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{k.created}</td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreVertical className="size-4" />
                          <span className="sr-only">Open actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => handleViewUsage(k.id)}>
                          <Activity className="size-4" />
                          View usage
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRotate(k.id)}
                          disabled={k.status === "revoked"}
                        >
                          <RefreshCw className="size-4" />
                          Rotate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleRevoke(k.id)}
                          disabled={k.status === "revoked"}
                          className="text-red-600 focus:text-red-700 dark:text-red-400"
                        >
                          <Trash2 className="size-4" />
                          Revoke
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="space-y-3 lg:hidden">
          {keys.map((k) => (
            <div key={k.id} className="rounded-lg border border-border p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{k.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <code className="font-mono text-xs text-muted-foreground">
                      {revealed[k.id] ? k.key : maskKey(k.key)}
                    </code>
                    <button
                      type="button"
                      onClick={() => toggleReveal(k.id)}
                      disabled={k.status === "revoked"}
                      className="text-muted-foreground hover:text-sunset-deep disabled:opacity-40"
                      aria-label={revealed[k.id] ? "Hide key" : "Reveal key"}
                    >
                      {revealed[k.id] ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(k.key, "API key")}
                      className="text-muted-foreground hover:text-sunset-deep"
                      aria-label="Copy key"
                    >
                      <Copy className="size-3.5" />
                    </button>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn("gap-1.5", statusBadgeClass[k.status].className)}
                >
                  <span className={cn("size-1.5 rounded-full", statusBadgeClass[k.status].dot)} />
                  {statusBadgeClass[k.status].label}
                </Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {k.scopes.map((s) => (
                  <Badge
                    key={s}
                    variant="outline"
                    className={cn("text-[10px] font-mono", scopeBadgeClass[s] ?? "text-muted-foreground")}
                  >
                    {s}
                  </Badge>
                ))}
              </div>
              <Separator className="my-3" />
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Requests</p>
                  <p className="font-semibold tabular-nums text-foreground">{k.requests.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last used</p>
                  <p className="font-semibold text-foreground">{k.lastUsed}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-semibold text-foreground">{k.created}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => handleViewUsage(k.id)}>
                  <Activity className="size-3.5" />
                  Usage
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRotate(k.id)}
                  disabled={k.status === "revoked"}
                >
                  <RefreshCw className="size-3.5" />
                  Rotate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRevoke(k.id)}
                  disabled={k.status === "revoked"}
                  className="border-red-500/40 text-red-600 hover:bg-red-500/10 hover:text-red-700 dark:text-red-400"
                >
                  <Trash2 className="size-3.5" />
                  Revoke
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 5. Webhooks */}
      <Card className="rounded-xl p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Webhook className="size-5 text-sunset-deep" />
              Webhooks
            </h2>
            <p className="text-sm text-muted-foreground">
              Receive real-time events when ads are saved, competitors are added, or ads end.
            </p>
          </div>
          <Button
            className="bg-sunset-gradient text-white shadow-sm hover:opacity-90"
            onClick={addWebhook}
          >
            <Plus className="size-4" />
            Add Webhook
          </Button>
        </div>

        <div className="space-y-3">
          {webhooks.map((wh) => (
            <div
              key={wh.id}
              className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/30"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <code className="truncate font-mono text-xs text-foreground sm:text-sm">
                      {wh.url}
                    </code>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {wh.events.map((ev) => (
                      <Badge
                        key={ev}
                        variant="outline"
                        className="border-sunset-orange/30 bg-sunset-orange/10 font-mono text-[10px] text-sunset-orange"
                      >
                        {ev}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3.5" />
                    Last delivery: {wh.lastDelivery}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={wh.enabled}
                      onCheckedChange={(checked) => toggleWebhook(wh.id, checked)}
                      aria-label="Toggle webhook"
                    />
                    <span className="text-xs font-medium text-muted-foreground">
                      {wh.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <Separator orientation="vertical" className="hidden h-8 sm:block" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testWebhook(wh)}
                    disabled={!wh.enabled}
                  >
                    <Zap className="size-3.5" />
                    Test
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 6. Code examples */}
      <Card className="rounded-xl p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Code className="size-5 text-sunset-deep" />
              Code Examples
            </h2>
            <p className="text-sm text-muted-foreground">
              Authenticate and fetch your saved ads in three quick ways.
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as CodeLang)}>
          <TabsList className="bg-muted/60">
            <TabsTrigger value="curl">cURL</TabsTrigger>
            <TabsTrigger value="js">JavaScript</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
          </TabsList>

          {(["curl", "js", "python"] as CodeLang[]).map((lang) => (
            <TabsContent key={lang} value={lang} className="mt-3">
              <div className="group relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 z-10 size-8 p-0 text-muted-foreground hover:bg-sunset-cream/40 hover:text-sunset-deep"
                  onClick={() => copyToClipboard(codeExamples[lang].code, `${codeExamples[lang].label} snippet`)}
                  aria-label="Copy code"
                >
                  <Copy className="size-3.5" />
                </Button>
                <pre className="bg-muted/40 overflow-x-auto rounded-lg border border-border p-4 text-xs leading-relaxed">
                  <code className="font-mono text-foreground">{codeExamples[lang].code}</code>
                </pre>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      {/* 7. Rate limit & quota */}
      <Card className="rounded-xl p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Shield className="size-5 text-sunset-deep" />
              Rate Limit &amp; Quota
            </h2>
            <p className="text-sm text-muted-foreground">
              Current usage against your Agency plan limits.
            </p>
          </div>
          <Badge className="border-sunset-amber/40 bg-sunset-amber/15 text-amber-800 dark:text-amber-200">
            Agency plan
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <UsageBar
            label="API requests (this hour)"
            current={420}
            max={1000}
            unit="req"
            color="linear-gradient(90deg, #EA6113 0%, #F88F22 100%)"
          />
          <UsageBar
            label="Ads exported (this month)"
            current={90}
            max={500}
            color="linear-gradient(90deg, #F88F22 0%, #FBB931 100%)"
          />
          <UsageBar
            label="Webhooks"
            current={2}
            max={10}
            color="linear-gradient(90deg, #FBB931 0%, #F88F22 100%)"
          />
        </div>

        <Separator className="my-5" />

        <div className="bg-sunset-cream/40 flex flex-col items-start justify-between gap-3 rounded-lg p-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <div className="bg-sunset-gradient flex size-9 shrink-0 items-center justify-center rounded-lg text-white">
              <AlertTriangle className="size-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Approaching a limit? Upgrade for higher throughput.
              </p>
              <p className="text-xs text-muted-foreground">
                Scale plan unlocks 10,000 req/hr, unlimited exports, and 50 webhooks.
              </p>
            </div>
          </div>
          <Button
            className="bg-sunset-gradient shrink-0 text-white shadow-sm hover:opacity-90"
            onClick={() => sonnerToast.info("Opening billing — Scale plan")}
          >
            <RefreshCw className="size-4" />
            Upgrade for higher limits
          </Button>
        </div>
      </Card>

      {/* Create Key Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="size-5 text-sunset-deep" />
              Create new API key
            </DialogTitle>
            <DialogDescription>
              Generate a new secret key with scoped permissions. You can revoke or rotate it anytime.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="new-key-name">Key name</Label>
              <Input
                id="new-key-name"
                placeholder="e.g. Production Dashboard"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Scopes</Label>
              <div className="grid gap-2">
                {allScopes.map((scope) => {
                  const checked = newKeyScopes.includes(scope.id);
                  return (
                    <label
                      key={scope.id}
                      htmlFor={`scope-${scope.id}`}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                        checked
                          ? "border-sunset-orange/50 bg-sunset-cream/40"
                          : "border-border hover:bg-muted/40"
                      )}
                    >
                      <Checkbox
                        id={`scope-${scope.id}`}
                        checked={checked}
                        onCheckedChange={() => toggleScope(scope.id)}
                        className="mt-0.5"
                      />
                      <div className="min-w-0">
                        <p className="font-mono text-sm font-medium text-foreground">{scope.label}</p>
                        <p className="text-xs text-muted-foreground">{scope.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Expiration</Label>
              <Select value={newKeyExpiration} onValueChange={setNewKeyExpiration}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose expiration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="90d">90 days</SelectItem>
                  <SelectItem value="1y">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-sunset-gradient text-white shadow-sm hover:opacity-90"
              onClick={handleCreateKey}
            >
              <Check className="size-4" />
              Create key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New key success dialog (shown once) */}
      <Dialog
        open={newlyCreatedKey !== null}
        onOpenChange={(open) => {
          if (!open) closeNewKeyDialog();
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="size-5 text-emerald-600" />
              API key created
            </DialogTitle>
            <DialogDescription>
              Copy your new key now. For security, it will not be shown again.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="rounded-lg border border-sunset-amber/40 bg-sunset-cream/40 p-3">
              <code className="block break-all font-mono text-xs text-sunset-deep">
                {newlyCreatedKey}
              </code>
            </div>
            <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-200">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>
                <strong>You won&apos;t see this key again.</strong> Store it somewhere safe —
                if you lose it, you&apos;ll need to rotate this key and update your integration.
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button
              className="bg-sunset-gradient text-white shadow-sm hover:opacity-90"
              onClick={() =>
                newlyCreatedKey && copyToClipboard(newlyCreatedKey, "New API key")
              }
            >
              <Copy className="size-4" />
              Copy key
            </Button>
            <Button variant="outline" onClick={closeNewKeyDialog}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ApiKeysView;
