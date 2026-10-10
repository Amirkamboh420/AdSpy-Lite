"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Shield,
  Users,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Server,
  Bell,
  Search,
  MoreVertical,
  Ban,
  Mail,
  TrendingUp,
  ArrowUpRight,
  Eye,
  RefreshCw,
  Trash2,
  Info,
  Clock,
  LifeBuoy,
  Flag,
  Megaphone,
  FileWarning,
  Send,
  ExternalLink,
  History,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Cell, PieChart, Pie,
} from "recharts";
import { mockAdminUsers, type AdminUser } from "@/lib/mock-data";
import { sonnerToast } from "@/lib/toast-helpers";
import { cn } from "@/lib/utils";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const revenueData = Array.from({ length: 12 }, (_, i) => ({
  month: months[i],
  revenue: 8000 + i * 900 + (i % 3) * 400,
  users: 1800 + i * 90,
}));

const planDistribution = [
  { name: "Free", value: 1420, color: "#FBB931" },
  { name: "Pro", value: 980, color: "#F88F22" },
  { name: "Agency", value: 220, color: "#EA6113" },
  { name: "Trial", value: 227, color: "#FFE3B3" },
];

const systemServices = [
  { name: "Extension API", uptime: "99.99%", latency: "42ms" },
  { name: "Web Dashboard", uptime: "100.00%", latency: "118ms" },
  { name: "Sync Service", uptime: "99.95%", latency: "240ms" },
  { name: "Notification Service", uptime: "99.97%", latency: "86ms" },
  { name: "Ad Library Scraper", uptime: "99.92%", latency: "1.2s" },
];

const recentAlerts = [
  {
    severity: "info" as const,
    title: "Meta Ad Library DOM change detected — auto-fixed",
    time: "2 min ago",
    source: "Scraper v2.4.1",
  },
  {
    severity: "warning" as const,
    title: "Rate limit warning on sync service",
    time: "18 min ago",
    source: "Sync Service",
  },
  {
    severity: "error" as const,
    title: "3 failed payments retrying",
    time: "1 hr ago",
    source: "Billing",
  },
  {
    severity: "info" as const,
    title: "New support ticket #482 — Pro plan upgrade question",
    time: "3 hr ago",
    source: "Support",
  },
];

const planBadgeClass: Record<AdminUser["plan"], string> = {
  free: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
  pro: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-500/15 dark:text-orange-300 dark:border-orange-500/30",
  agency: "bg-red-100 text-red-800 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30",
  team: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-500/15 dark:text-yellow-300 dark:border-yellow-500/30",
  admin: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30",
};

const statusBadgeClass: Record<AdminUser["status"], string> = {
  active: "bg-green-100 text-green-800 border-green-200 dark:bg-green-500/15 dark:text-green-300 dark:border-green-500/30",
  trial: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30",
  suspended: "bg-red-100 text-red-800 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30",
  churned: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-500/15 dark:text-gray-300 dark:border-gray-500/30",
};

const avatarColors = ["#EA6113", "#F88F22", "#FBB931", "#B84A0E", "#FF9F45", "#7A3A0E"];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function AdminView() {
  const [search, setSearch] = useState("");

  const filteredUsers = mockAdminUsers
    .filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()),
    )
    .slice(0, 10);

  const totalPlanCount = planDistribution.reduce((sum, p) => sum + p.value, 0);

  const handleAction = (action: string, user: AdminUser) => {
    const map: Record<string, () => void> = {
      view: () => sonnerToast.info(`Opening profile for ${user.name}`),
      suspend: () => sonnerToast.warning(`${user.name} suspended`),
      refund: () => sonnerToast.success(`Refund issued to ${user.email}`),
      delete: () => sonnerToast.error(`${user.name} deleted from workspace`),
      email: () => sonnerToast.info(`Email composed to ${user.email}`),
    };
    map[action]?.();
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="h-9 w-9 rounded-xl bg-sunset-gradient flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5 text-white" />
            </span>
            Admin Panel
          </h1>
          <p className="text-sm text-muted-foreground mt-1 ml-11">System overview & user management</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-red-500 text-white hover:bg-red-600 border-transparent gap-1">
            <AlertTriangle className="h-3 w-3" /> INTERNAL
          </Badge>
          <Button variant="outline" size="sm" onClick={() => sonnerToast.info("No new system alerts")}>
            <Bell className="h-4 w-4 mr-1.5" /> Alerts
          </Button>
          <Button size="sm" className="bg-sunset-gradient hover:opacity-90 text-white" onClick={() => sonnerToast.success("Admin report exported")}>
            <TrendingUp className="h-4 w-4 mr-1.5" /> Export Report
          </Button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: "2,847", icon: Users, trend: "+8.2%", color: "#EA6113" },
          { label: "MRR", value: "$18,420", icon: DollarSign, trend: "+12.4%", color: "#F88F22" },
          { label: "Active Subscriptions", value: "1,203", icon: Activity, trend: "+5.1%", color: "#FBB931" },
          { label: "System Uptime", value: "99.98%", icon: Server, trend: "30d", color: "#B84A0E" },
        ].map((k) => (
          <Card key={k.label} className="p-4 relative overflow-hidden rounded-xl">
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-10" style={{ backgroundColor: k.color }} />
            <div className="relative flex items-center justify-between mb-2">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">{k.label}</p>
              <k.icon className="h-4 w-4" style={{ color: k.color }} />
            </div>
            <p className="text-2xl font-bold relative">{k.value}</p>
            <p className="text-[11px] text-green-600 flex items-center gap-0.5 mt-1 relative">
              <ArrowUpRight className="h-3 w-3" /> {k.trend} {k.label === "System Uptime" ? "rolling" : "vs last month"}
            </p>
          </Card>
        ))}
      </div>

      {/* Revenue + Plan distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <Card className="lg:col-span-2 p-5 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-sunset-deep" />
                Revenue Growth
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Monthly recurring revenue & new users</p>
            </div>
            <Badge className="bg-sunset-cream/40 text-[#7A3A0E] border-transparent">$18,420 this month</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EA6113" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#FBB931" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F88F22" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#F88F22" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12, background: "hsl(var(--popover))" }}
                  formatter={(value: number, name: string) => (name === "revenue" ? [`$${value.toLocaleString()}`, "Revenue"] : [value.toLocaleString(), "Users"])}
                />
                <Area type="monotone" dataKey="revenue" stroke="#EA6113" strokeWidth={2.5} fill="url(#revGrad)" />
                <Area type="monotone" dataKey="users" stroke="#F88F22" strokeWidth={1.5} fill="url(#userGrad)" strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Plan distribution donut */}
        <Card className="p-5 rounded-xl bg-sunset-cream/40">
          <p className="text-sm font-semibold flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-sunset-deep" />
            Plan Distribution
          </p>
          <p className="text-[11px] text-muted-foreground mb-2">Active subscriptions by tier</p>
          <div className="h-44 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={planDistribution} dataKey="value" nameKey="name" innerRadius={48} outerRadius={70} paddingAngle={3} stroke="none">
                  {planDistribution.map((p) => (
                    <Cell key={p.name} fill={p.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", fontSize: 12, background: "hsl(var(--popover))" }}
                  formatter={(value: number, name: string) => [value.toLocaleString(), name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-xl font-bold">{totalPlanCount.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {planDistribution.map((p) => (
              <div key={p.name} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                <span className="text-[11px] text-muted-foreground">{p.name}</span>
                <span className="text-[11px] font-semibold ml-auto">{p.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* System health + Recent alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* System health */}
        <Card className="p-5 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold flex items-center gap-2">
              <Server className="h-4 w-4 text-sunset-deep" />
              System Health
            </p>
            <Badge className="bg-green-100 text-green-700 border-transparent dark:bg-green-500/15 dark:text-green-300 gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> All systems go
            </Badge>
          </div>
          <div className="space-y-3">
            {systemServices.map((s) => (
              <div key={s.name} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{s.name}</p>
                  <p className="text-[10px] text-muted-foreground">avg {s.latency}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-semibold text-muted-foreground">{s.uptime}</span>
                  <Badge className="bg-green-100 text-green-700 border-transparent dark:bg-green-500/15 dark:text-green-300 text-[9px] h-4 px-1.5 gap-0.5">
                    <CheckCircle2 className="h-2.5 w-2.5" /> Operational
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent alerts */}
        <Card className="lg:col-span-2 p-5 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold flex items-center gap-2">
              <Bell className="h-4 w-4 text-sunset-deep" />
              Recent Alerts & Issues
            </p>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => sonnerToast.info("Viewing all alerts in log stream")}>
              View all
            </Button>
          </div>
          <div className="space-y-3">
            {recentAlerts.map((a, idx) => {
              const conf = {
                info: { icon: Info, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-500/15", badge: "INFO" },
                warning: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-500/15", badge: "WARN" },
                error: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100 dark:bg-red-500/15", badge: "ERROR" },
              }[a.severity];
              const Icon = conf.icon;
              return (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-border/60 hover:bg-muted/40 transition-colors">
                  <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", conf.bg)}>
                    <Icon className={cn("h-4 w-4", conf.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">{a.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-2">
                      <span className="font-medium">{a.source}</span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="h-2.5 w-2.5" /> {a.time}
                      </span>
                    </p>
                  </div>
                  <Badge variant="outline" className={cn("text-[9px] h-4 px-1.5 shrink-0", conf.color, "border-current/30")}>
                    {conf.badge}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Users management table */}
      <Card className="rounded-xl overflow-hidden">
        <div className="p-5 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60">
          <div>
            <p className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-sunset-deep" />
              User Management
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Showing first 10 of {mockAdminUsers.length} users</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email..."
              className="pl-8 h-9 text-sm"
            />
          </div>
        </div>

        {/* Table header */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_0.8fr_0.8fr_1fr_44px] gap-3 px-5 py-2.5 bg-muted/40 text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
          <span>User</span>
          <span>Plan</span>
          <span>Status</span>
          <span className="text-right">Saved Ads</span>
          <span className="text-right">MRR</span>
          <span>Joined</span>
          <span />
        </div>

        <div className="divide-y divide-border/60">
          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">No users match your search.</div>
          )}
          {filteredUsers.map((u, idx) => (
            <div
              key={u.id}
              className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_0.8fr_0.8fr_1fr_44px] gap-3 px-5 py-3 items-center hover:bg-muted/30 transition-colors"
            >
              {/* User */}
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar className="h-8 w-8 border border-border/60">
                  <AvatarFallback className="text-[10px] font-semibold text-white" style={{ backgroundColor: avatarColors[idx % avatarColors.length] }}>
                    {getInitials(u.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate">{u.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{u.email}</p>
                </div>
              </div>
              {/* Plan */}
              <div>
                <Badge variant="outline" className={cn("text-[10px] h-5 px-1.5 capitalize", planBadgeClass[u.plan])}>
                  {u.plan}
                </Badge>
              </div>
              {/* Status */}
              <div>
                <Badge variant="outline" className={cn("text-[10px] h-5 px-1.5 capitalize", statusBadgeClass[u.status])}>
                  {u.status}
                </Badge>
              </div>
              {/* Saved Ads */}
              <p className="text-xs font-medium text-right tabular-nums">{u.savedAds}</p>
              {/* MRR */}
              <p className="text-xs font-semibold text-right tabular-nums text-sunset-deep">${u.mrr}</p>
              {/* Joined */}
              <p className="text-[11px] text-muted-foreground">{formatDate(u.joinedAt)}</p>
              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleAction("view", u)}>
                    <Eye className="h-3.5 w-3.5 mr-2" /> View profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction("email", u)}>
                    <Mail className="h-3.5 w-3.5 mr-2" /> Send email
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleAction("suspend", u)} className="text-amber-600 focus:text-amber-700">
                    <Ban className="h-3.5 w-3.5 mr-2" /> Suspend
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction("refund", u)} className="text-blue-600 focus:text-blue-700">
                    <RefreshCw className="h-3.5 w-3.5 mr-2" /> Refund
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction("delete", u)} className="text-red-600 focus:text-red-700">
                    <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-border/60 flex items-center justify-between bg-muted/20">
          <p className="text-[11px] text-muted-foreground">{filteredUsers.length} of {mockAdminUsers.length} users</p>
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => sonnerToast.info("Loading next page...")}>
            View all users
          </Button>
        </div>
      </Card>

      {/* Support Tickets Management */}
      <AdminSupportTickets />

      {/* Content Moderation + Announcements */}
      <div className="grid lg:grid-cols-2 gap-5">
        <AdminContentModeration />
        <AdminAnnouncements />
      </div>

      {/* Audit Logs */}
      <AdminAuditLogs />
    </div>
  );
}

/* ---------------- Admin: Support Tickets ---------------- */

const mockTickets = [
  { id: "T-482", subject: "Export to PDF not working", user: "ayesha@example.com", priority: "High", status: "Open", category: "Bug", time: "2h ago" },
  { id: "T-481", subject: "Upgrade plan billing question", user: "bilal@example.com", priority: "Medium", status: "In Progress", category: "Billing", time: "5h ago" },
  { id: "T-480", subject: "How to track multiple competitors?", user: "sana@example.com", priority: "Low", status: "Open", category: "How-To", time: "8h ago" },
  { id: "T-479", subject: "API access request", user: "hamza@example.com", priority: "Medium", status: "Resolved", category: "Feature", time: "1d ago" },
  { id: "T-478", subject: "Chrome extension not saving ads", user: "zainab@example.com", priority: "Urgent", status: "Open", category: "Bug", time: "1d ago" },
];

function AdminSupportTickets() {
  const [filter, setFilter] = useState<"all" | "open" | "resolved">("all");
  const filtered = mockTickets.filter((t) =>
    filter === "all" ? true : filter === "open" ? t.status !== "Resolved" : t.status === "Resolved"
  );

  const priorityColor: Record<string, string> = {
    Urgent: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
    High: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    Medium: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    Low: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };
  const statusColor: Record<string, string> = {
    Open: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
    "In Progress": "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    Resolved: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold flex items-center gap-2"><LifeBuoy className="h-4 w-4 text-sunset-deep" /> Support Tickets</h3>
          <p className="text-xs text-muted-foreground">{mockTickets.filter((t) => t.status !== "Resolved").length} open · {mockTickets.length} total</p>
        </div>
        <div className="flex items-center rounded-lg border border-border/60 overflow-hidden">
          {(["all", "open", "resolved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn("px-3 py-1.5 text-xs font-medium capitalize transition-colors", filter === f ? "bg-sunset-gradient text-white" : "hover:bg-muted")}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {filtered.map((t) => (
          <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/40 transition-colors border border-border/40">
            <div className="shrink-0">
              <div className="h-9 w-9 rounded-lg bg-sunset-cream/40 flex items-center justify-center">
                <LifeBuoy className="h-4 w-4 text-sunset-deep" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">{t.id}</span>
                <p className="text-sm font-medium truncate">{t.subject}</p>
              </div>
              <p className="text-[11px] text-muted-foreground truncate">{t.user} · {t.category} · {t.time}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Badge variant="secondary" className={cn("text-[9px] h-5 capitalize", priorityColor[t.priority])}>{t.priority}</Badge>
              <Badge variant="secondary" className={cn("text-[9px] h-5", statusColor[t.status])}>{t.status}</Badge>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => sonnerToast.info(`Opening ticket ${t.id}`)}>
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ---------------- Admin: Content Moderation ---------------- */

const mockReports = [
  { id: "R-101", adId: "ad-12", advertiser: "Daraz PK", reason: "Misleading claims", reporter: "user_2841", time: "3h ago", severity: "High", status: "Pending" },
  { id: "R-100", adId: "ad-34", advertiser: "JazzCash", reason: "Copyright infringement", reporter: "user_1923", time: "6h ago", severity: "Medium", status: "Reviewing" },
  { id: "R-099", adId: "ad-8", advertiser: "Sapphire", reason: "Inappropriate content", reporter: "user_3310", time: "1d ago", severity: "Low", status: "Resolved" },
];

function AdminContentModeration() {
  const severityColor: Record<string, string> = {
    High: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
    Medium: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    Low: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };
  const statusColor: Record<string, string> = {
    Pending: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    Reviewing: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    Resolved: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold flex items-center gap-2"><Flag className="h-4 w-4 text-sunset-deep" /> Content Moderation</h3>
          <p className="text-xs text-muted-foreground">Reported ads & flagged content</p>
        </div>
        <Badge variant="outline" className="text-[10px]">{mockReports.filter((r) => r.status !== "Resolved").length} pending</Badge>
      </div>
      <div className="space-y-2">
        {mockReports.map((r) => (
          <div key={r.id} className="flex items-start gap-3 p-2.5 rounded-lg border border-border/40 hover:bg-muted/40 transition-colors">
            <div className="h-8 w-8 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center shrink-0">
              <FileWarning className="h-4 w-4 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">{r.id}</span>
                <p className="text-sm font-medium truncate">{r.advertiser} <span className="text-muted-foreground font-normal">· {r.adId}</span></p>
              </div>
              <p className="text-[11px] text-muted-foreground truncate">{r.reason} · by {r.reporter} · {r.time}</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <Badge variant="secondary" className={cn("text-[9px] h-4 px-1", severityColor[r.severity])}>{r.severity}</Badge>
              <Badge variant="secondary" className={cn("text-[9px] h-4 px-1", statusColor[r.status])}>{r.status}</Badge>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <Button variant="outline" size="sm" className="h-7 text-xs flex-1" onClick={() => sonnerToast.success("Reviewing next pending report")}>
          <Eye className="h-3.5 w-3.5 mr-1" /> Review next
        </Button>
        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => sonnerToast.info("Moderation queue opened")}>
          View all
        </Button>
      </div>
    </Card>
  );
}

/* ---------------- Admin: Announcements / Broadcast ---------------- */

function AdminAnnouncements() {
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");

  const mockAnnouncements = [
    { id: "A-12", title: "New: AI-powered ad copy analysis", sent: "2,847 users", time: "3 days ago", openRate: "68%" },
    { id: "A-11", title: "Meta Ad Library DOM update v2.4.1", sent: "2,847 users", time: "1 week ago", openRate: "82%" },
    { id: "A-10", title: "Holiday special: 20% off Pro plans", sent: "Free users only", time: "2 weeks ago", openRate: "45%" },
  ];

  return (
    <Card className="p-5">
      <div className="mb-4">
        <h3 className="font-semibold flex items-center gap-2"><Megaphone className="h-4 w-4 text-sunset-deep" /> Announcements & Broadcast</h3>
        <p className="text-xs text-muted-foreground">Send in-app announcements to users</p>
      </div>

      {/* Compose */}
      <div className="rounded-lg border border-border/60 p-3 mb-4 bg-sunset-radial">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type an announcement message…"
          className="w-full min-h-[60px] text-sm rounded-md border border-border/40 bg-background p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-sunset-orange/40 mb-2"
        />
        <div className="flex items-center gap-2">
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="text-xs h-8 rounded-md border border-border/60 bg-background px-2 focus:outline-none"
          >
            <option value="all">All users (2,847)</option>
            <option value="free">Free users (1,420)</option>
            <option value="pro">Pro users (980)</option>
            <option value="agency">Agency users (220)</option>
          </select>
          <Button
            size="sm"
            className="h-8 text-xs ml-auto bg-sunset-gradient hover:opacity-90 text-white"
            disabled={!message.trim()}
            onClick={() => { sonnerToast.success(`Announcement sent to ${audience} users`); setMessage(""); }}
          >
            <Send className="h-3.5 w-3.5 mr-1" /> Send broadcast
          </Button>
        </div>
      </div>

      {/* Recent announcements */}
      <div className="space-y-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Recent broadcasts</p>
        {mockAnnouncements.map((a) => (
          <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-border/40 hover:bg-muted/40 transition-colors">
            <div className="h-8 w-8 rounded-lg bg-sunset-cream/40 flex items-center justify-center shrink-0">
              <Megaphone className="h-4 w-4 text-sunset-deep" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{a.title}</p>
              <p className="text-[11px] text-muted-foreground">{a.sent} · {a.time} · {a.openRate} open rate</p>
            </div>
            <Badge variant="secondary" className="text-[9px] h-5 bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400">{a.openRate}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ---------------- Admin: Audit Logs ---------------- */

const mockAuditLogs = [
  { id: 1, action: "User suspended", actor: "admin@adspy.lite", target: "usman@example.com", time: "15 min ago", icon: Ban, color: "#ef4444" },
  { id: 2, action: "Subscription refunded", actor: "admin@adspy.lite", target: "bilal@example.com ($49)", time: "1h ago", icon: RefreshCw, color: "#3b82f6" },
  { id: 3, action: "Manual plan upgrade", actor: "admin@adspy.lite", target: "sana@example.com → Pro", time: "2h ago", icon: TrendingUp, color: "#10b981" },
  { id: 4, action: "Announcement broadcast", actor: "admin@adspy.lite", target: "All users (2,847)", time: "3h ago", icon: Megaphone, color: "#EA6113" },
  { id: 5, action: "Content report resolved", actor: "admin@adspy.lite", target: "Report R-099", time: "5h ago", icon: CheckCircle2, color: "#10b981" },
  { id: 6, action: "API key revoked", actor: "ayesha@example.com", target: "key-3 (Legacy)", time: "8h ago", icon: Trash2, color: "#ef4444" },
];

function AdminAuditLogs() {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold flex items-center gap-2"><History className="h-4 w-4 text-sunset-deep" /> Audit Logs</h3>
          <p className="text-xs text-muted-foreground">Recent admin & system actions</p>
        </div>
        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => sonnerToast.info("Full audit log opened")}>
          <ExternalLink className="h-3.5 w-3.5 mr-1" /> Export logs
        </Button>
      </div>
      <div className="space-y-1">
        {mockAuditLogs.map((log) => (
          <div key={log.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/40 transition-colors">
            <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${log.color}22` }}>
              <log.icon className="h-3.5 w-3.5" style={{ color: log.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs">
                <span className="font-semibold">{log.action}</span>
                <span className="text-muted-foreground"> · {log.target}</span>
              </p>
              <p className="text-[10px] text-muted-foreground">by {log.actor} · {log.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
