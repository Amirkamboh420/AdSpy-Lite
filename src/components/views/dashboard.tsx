"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatCard } from "@/components/shared";
import {
  Bookmark, Users, BarChart3, FolderHeart, TrendingUp, Clock, Bell,
  Download, FolderPlus, StickyNote, Eye, ArrowRight, Zap, Sparkles,
  Flame, Trophy, AlertCircle, CheckCircle2, Pin, Crown,
} from "lucide-react";
import {
  mockAds, mockCompetitors, mockFolders, activityFeed, kpiData,
  adsSavedOverTime, topCompetitorsByAds, upcomingFeatures, formatDistribution,
} from "@/lib/mock-data";
import { useAppStore, ROLE_LIMITS } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
  BarChart, Bar, Cell, PieChart, Pie,
} from "recharts";
import { sonnerToast } from "@/lib/toast-helpers";

const activityIcons: Record<string, React.ElementType> = {
  bookmark: Bookmark,
  "trending-up": TrendingUp,
  "trending-down": TrendingUp,
  "folder-plus": FolderPlus,
  "sticky-note": StickyNote,
  download: Download,
  eye: Eye,
};

export function DashboardView() {
  const setView = useAppStore((s) => s.setView);
  const role = useAppStore((s) => s.role);

  const recentAds = mockAds.slice(0, 4);
  const topCompetitors = topCompetitorsByAds;

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-sunset-gradient p-6 lg:p-8 text-white">
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium opacity-90">Welcome back to your workspace</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-1">54 new competitor ads this week</h1>
            <p className="text-white/80 text-sm">Sapphire, Daraz & Khaadi launched new creatives. Review them before they're gone.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="secondary" size="sm" className="bg-white text-sunset-deep hover:bg-white/90" onClick={() => setView("saved-ads")}>
              <Bookmark className="h-4 w-4 mr-1.5" />
              View Saved
            </Button>
            <Button variant="outline" size="sm" className="border-white/40 text-white hover:bg-white/10 hover:text-white" onClick={() => setView("analytics")}>
              <BarChart3 className="h-4 w-4 mr-1.5" />
              Analytics
            </Button>
          </div>
        </div>
      </div>

      {/* Free user upgrade banner */}
      {role === "free" && <FreeUpgradeBanner />}

      {/* Live activity ticker */}
      <LiveActivityTicker />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Saved Ads" value={kpiData.totalSaved} icon={Bookmark} trend={{ value: "+12", up: true }} accent="#EA6113" sub={`${role === "free" ? "20 limit" : "unlimited"}`} />
        <StatCard label="Tracked Competitors" value={kpiData.totalCompetitors} icon={Users} trend={{ value: "+1", up: true }} accent="#F88F22" sub={`${kpiData.newAdsThisWeek} new ads`} />
        <StatCard label="Folders" value={kpiData.totalFolders} icon={FolderHeart} accent="#FBB931" sub="6 tags" />
        <StatCard label="Avg Ad Longevity" value={`${kpiData.avgAdLongevity}d`} icon={Clock} trend={{ value: "+5d", up: true }} accent="#B84A0E" sub="longer = better" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Saved ads over time - chart */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Ads Saved & Tracked</h3>
              <p className="text-xs text-muted-foreground">Last 12 months activity</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-sunset-deep" />Saved</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-sunset-amber" />Tracked</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={adsSavedOverTime} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="gSaved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EA6113" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#EA6113" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gTracked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FBB931" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#FBB931" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                cursor={{ stroke: "#F88F22", strokeWidth: 1, strokeDasharray: "4 4" }}
              />
              <Area type="monotone" dataKey="saved" stroke="#EA6113" strokeWidth={2.5} fill="url(#gSaved)" />
              <Area type="monotone" dataKey="tracked" stroke="#FBB931" strokeWidth={2.5} fill="url(#gTracked)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Format distribution - donut */}
        <Card className="p-5">
          <h3 className="font-semibold mb-1">Ad Format Mix</h3>
          <p className="text-xs text-muted-foreground mb-3">Across all saved ads</p>
          <div className="relative">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={formatDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3}>
                  {formatDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-2xl font-bold">101</p>
              <p className="text-[10px] text-muted-foreground">total ads</p>
            </div>
          </div>
          <div className="space-y-1.5 mt-3">
            {formatDistribution.map((f) => (
              <div key={f.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: f.color }} />
                  {f.name}
                </span>
                <span className="font-medium">{f.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent saved ads */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Recently Saved Ads</h3>
              <p className="text-xs text-muted-foreground">Latest additions to your collection</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setView("saved-ads")} className="text-sunset-deep hover:text-sunset-deep">
              View all <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
          <div className="space-y-2">
            {recentAds.map((ad) => (
              <div
                key={ad.id}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                onClick={() => setView("saved-ads")}
              >
                <div
                  className="h-12 w-16 shrink-0 rounded-md relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${ad.thumbnailColor}, ${ad.thumbnailColor}aa)` }}
                >
                  {ad.imagePath && (
                    <img src={ad.imagePath} alt={ad.advertiser} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                  )}
                  {!ad.imagePath && (
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: "radial-gradient(circle at 30% 40%, white 1px, transparent 1px)",
                      backgroundSize: "12px 12px",
                    }} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{ad.headline}</p>
                  <p className="text-xs text-muted-foreground truncate">{ad.advertiser} · {ad.daysRunning}d running</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="secondary" className="text-[10px] bg-sunset-cream/40 text-[#7A3A0E] capitalize">{ad.format}</Badge>
                  <span className="text-xs font-bold text-sunset-deep bg-sunset-cream/30 px-2 py-0.5 rounded">{ad.cta}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Activity feed */}
        <Card className="p-5">
          <h3 className="font-semibold mb-1">Activity</h3>
          <p className="text-xs text-muted-foreground mb-4">Your recent actions</p>
          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {activityFeed.map((a, i) => {
              const Icon = activityIcons[a.icon] || Bell;
              return (
                <div key={a.id} className="flex gap-3">
                  <div className="relative flex flex-col items-center">
                    <div className="h-7 w-7 rounded-full bg-sunset-cream/40 flex items-center justify-center shrink-0">
                      <Icon className="h-3.5 w-3.5 text-sunset-deep" />
                    </div>
                    {i < activityFeed.length - 1 && <div className="w-px flex-1 bg-border my-1" />}
                  </div>
                  <div className="flex-1 min-w-0 pb-1">
                    <p className="text-xs leading-snug">{a.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top competitors */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2"><Trophy className="h-4 w-4 text-sunset-amber" /> Top Competitors by Active Ads</h3>
              <p className="text-xs text-muted-foreground">Who's running the most creatives right now</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setView("competitors")} className="text-sunset-deep hover:text-sunset-deep">
              All <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topCompetitors} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} width={70} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} cursor={{ fill: "#FBB93122" }} />
              <Bar dataKey="ads" radius={[0, 6, 6, 0]} barSize={20}>
                {topCompetitors.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Quick actions & limits */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Zap className="h-4 w-4 text-sunset-orange" /> Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Bookmark, label: "Save Ad", view: "saved-ads" as const, color: "#EA6113" },
                { icon: Users, label: "Add Competitor", view: "competitors" as const, color: "#F88F22" },
                { icon: Download, label: "Export", view: "saved-ads" as const, color: "#FBB931" },
                { icon: FolderPlus, label: "New Folder", view: "saved-ads" as const, color: "#B84A0E" },
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={() => setView(a.view)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border/60 hover:border-sunset-orange/40 hover:bg-muted/40 transition-all group"
                >
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: a.color }}>
                    <a.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-[11px] font-medium">{a.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Plan usage */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2"><Flame className="h-4 w-4 text-sunset-deep" /> Plan Usage</h3>
              <Badge className="bg-sunset-cream/40 text-[#7A3A0E] capitalize">{role}</Badge>
            </div>
            <div className="space-y-3">
              {[
                { label: "Saved Ads", used: 101, total: role === "free" ? 20 : Infinity, color: "#EA6113" },
                { label: "Competitors", used: 6, total: role === "free" ? 1 : role === "pro" ? 10 : Infinity, color: "#F88F22" },
                { label: "Folders", used: 6, total: role === "free" ? 2 : Infinity, color: "#FBB931" },
              ].map((u) => {
                const pct = u.total === Infinity ? 35 : Math.min(100, (u.used / u.total) * 100);
                const capped = u.total === Infinity ? `${u.used} / ∞` : `${u.used} / ${u.total}`;
                return (
                  <div key={u.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{u.label}</span>
                      <span className="font-medium">{capped}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: u.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
            {role === "free" && (
              <Button size="sm" className="w-full mt-4 bg-sunset-gradient hover:opacity-90 text-white h-8 text-xs" onClick={() => setView("billing")}>
                <Zap className="h-3.5 w-3.5 mr-1.5" />
                Upgrade for unlimited
              </Button>
            )}
          </Card>
        </div>
      </div>

      {/* Ad Performance Leaderboard */}
      <AdPerformanceLeaderboard />

      {/* Recently Pinned */}
      <RecentlyPinnedSection />

      {/* Tracked competitors mini list */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Tracked Competitors</h3>
            <p className="text-xs text-muted-foreground">Live status of your watchlist</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setView("competitors")} className="text-sunset-deep hover:text-sunset-deep">
            Manage <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {mockCompetitors.slice(0, 6).map((c) => (
            <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/60 hover:border-sunset-orange/40 hover:bg-muted/30 transition-all">
              <Avatar className="h-10 w-10" style={{ backgroundColor: c.avatarColor }}>
                <AvatarFallback className="text-xs text-white font-bold bg-transparent">{c.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.activeAds} active ads</p>
              </div>
              <div className="text-right shrink-0">
                {c.newAdsThisWeek > 0 ? (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 text-[10px] h-5">+{c.newAdsThisWeek}</Badge>
                ) : (
                  <Badge variant="secondary" className="text-[10px] h-5">0 new</Badge>
                )}
                <p className="text-[10px] text-muted-foreground mt-0.5">this week</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Upcoming features */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-sunset-orange" /> Product Roadmap</h3>
            <p className="text-xs text-muted-foreground">What's coming next to AdSpy Lite</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {upcomingFeatures.map((f) => (
            <div key={f.name} className={cn("p-3 rounded-lg border", f.progress === 100 ? "border-green-500/30 bg-green-50/40 dark:bg-green-950/10" : "border-border/60")}>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-[9px] h-4 px-1">{f.phase}</Badge>
                {f.progress === 100 ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <Clock className="h-3.5 w-3.5 text-muted-foreground" />}
              </div>
              <p className="text-xs font-semibold mb-1">{f.name}</p>
              <p className="text-[10px] text-muted-foreground mb-2">{f.eta}</p>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className={cn("h-full rounded-full", f.progress === 100 ? "bg-green-500" : "bg-sunset-gradient")} style={{ width: `${f.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Alert banner */}
      <Card className="p-4 border-amber-300/40 bg-amber-50/60 dark:bg-amber-950/10">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center shrink-0">
            <AlertCircle className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Meta Ad Library layout update detected</p>
            <p className="text-xs text-muted-foreground mt-0.5">Our team has already updated the DOM selectors. Extension v2.4.1 is live — no action needed from you.</p>
          </div>
          <Button variant="outline" size="sm" className="shrink-0" onClick={() => sonnerToast.success("Extension up to date ✓")}>
            Check status
          </Button>
        </div>
      </Card>
    </div>
  );
}

/* ---------------- Live Activity Ticker ---------------- */

const liveEvents = [
  { text: "Sapphire launched 3 new video ads", color: "#EA6113", time: "2m" },
  { text: "You saved \"Mega Sale — 70% Off\" from Khaadi", color: "#F88F22", time: "8m" },
  { text: "Daraz PK crossed 130 active ads", color: "#FBB931", time: "15m" },
  { text: "JazzCash paused 2 ads", color: "#B84A0E", time: "32m" },
  { text: "Foodpanda new carousel ad detected", color: "#FF9F45", time: "1h" },
  { text: "Connatural ad copy changed", color: "#7A3A0E", time: "2h" },
  { text: "Weekly digest sent to your email", color: "#EA6113", time: "5h" },
];

function LiveActivityTicker() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card group">
      <div className="absolute inset-y-0 left-0 z-10 flex items-center gap-2 px-3 bg-sunset-gradient text-white">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wide hidden sm:inline">Live</span>
      </div>
      <div className="flex items-center gap-6 py-2.5 pl-16 pr-4 whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]">
        {liveEvents.concat(liveEvents).map((e, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-xs text-muted-foreground shrink-0">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: e.color }} />
            {e.text}
            <span className="text-muted-foreground/60">· {e.time}</span>
            <span className="text-border">|</span>
          </span>
        ))}
      </div>
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-card to-transparent pointer-events-none" />
    </div>
  );
}

/* ---------------- Ad Performance Leaderboard ---------------- */

function AdPerformanceLeaderboard() {
  const setView = useAppStore((s) => s.setView);
  // Score = likes * (daysRunning / 7) — rewards both engagement and longevity
  const leaderboard = [...mockAds]
    .map((a) => ({
      ...a,
      score: Math.round((a.likes || 0) * Math.max(1, a.daysRunning / 7) / 1000),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const maxScore = leaderboard[0]?.score || 1;
  const medalColors = ["#FBB931", "#9ca3af", "#b45309", "transparent", "transparent"];
  const medalLabels = ["1st", "2nd", "3rd", "4th", "5th"];

  return (
    <Card className="p-5 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <Trophy className="h-4 w-4 text-sunset-amber" />
            Ad Performance Leaderboard
          </h3>
          <p className="text-xs text-muted-foreground">Top ads by engagement × longevity score</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setView("saved-ads")} className="text-sunset-deep hover:text-sunset-deep">
          View all <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </div>
      <div className="space-y-2">
        {leaderboard.map((ad, i) => (
          <div
            key={ad.id}
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer group"
            onClick={() => setView("saved-ads")}
          >
            {/* Rank medal */}
            <div
              className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
              style={{
                backgroundColor: i < 3 ? `${medalColors[i]}33` : "transparent",
                color: i < 3 ? medalColors[i] : "hsl(var(--muted-foreground))",
              }}
            >
              {i < 3 ? (i === 0 ? "1st" : i === 1 ? "2nd" : "3rd") : `#${i + 1}`}
            </div>
            {/* Thumbnail */}
            <div
              className="h-10 w-14 shrink-0 rounded-md relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${ad.thumbnailColor}, ${ad.thumbnailColor}aa)` }}
            >
              {ad.imagePath && (
                <img src={ad.imagePath} alt={ad.advertiser} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              )}
            </div>
            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate group-hover:text-sunset-deep transition-colors">{ad.headline}</p>
              <p className="text-[11px] text-muted-foreground truncate">{ad.advertiser} · {ad.daysRunning}d · {(ad.likes || 0).toLocaleString()} likes</p>
            </div>
            {/* Score bar */}
            <div className="hidden sm:flex items-center gap-2 shrink-0 w-32">
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-sunset-gradient transition-all"
                  style={{ width: `${(ad.score / maxScore) * 100}%` }}
                />
              </div>
            </div>
            {/* Score */}
            <div className="text-right shrink-0 w-16">
              <p className="text-sm font-bold text-sunset-deep">{ad.score}</p>
              <p className="text-[10px] text-muted-foreground">score</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ---------------- Recently Pinned Section ---------------- */

function RecentlyPinnedSection() {
  const { pinnedAds, setView } = useAppStore();
  const pinned = mockAds.filter((a) => pinnedAds.includes(a.id)).slice(0, 3);

  if (pinned.length === 0) return null;

  return (
    <Card className="p-5 overflow-hidden bg-sunset-radial">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <Pin className="h-4 w-4 text-sunset-deep fill-sunset-deep" />
            Recently Pinned
          </h3>
          <p className="text-xs text-muted-foreground">Your pinned ads — quick access to favorites</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setView("saved-ads")} className="text-sunset-deep hover:text-sunset-deep">
          View all <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {pinned.map((ad) => (
          <button
            key={ad.id}
            onClick={() => setView("saved-ads")}
            className="flex items-center gap-3 p-3 rounded-lg bg-card border border-sunset-orange/20 hover:border-sunset-orange/50 hover:shadow-md transition-all text-left group"
          >
            <div
              className="h-14 w-14 shrink-0 rounded-md relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${ad.thumbnailColor}, ${ad.thumbnailColor}aa)` }}
            >
              {ad.imagePath && (
                <img src={ad.imagePath} alt={ad.advertiser} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate group-hover:text-sunset-deep transition-colors">{ad.headline}</p>
              <p className="text-[10px] text-muted-foreground truncate">{ad.advertiser}</p>
              <div className="flex items-center gap-1 mt-1">
                <Pin className="h-2.5 w-2.5 fill-sunset-deep text-sunset-deep" />
                <span className="text-[9px] font-bold text-sunset-deep">PINNED</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}

/* ---------------- Free User Upgrade Banner ---------------- */

function FreeUpgradeBanner() {
  const setView = useAppStore((s) => s.setView);
  const limits = ROLE_LIMITS.free;
  const usage = {
    savedAds: Math.min(101, limits.savedAds),
    competitors: Math.min(6, limits.competitors),
    folders: Math.min(6, limits.folders),
  };
  const savedPct = (usage.savedAds / limits.savedAds) * 100;
  const compPct = (usage.competitors / limits.competitors) * 100;

  return (
    <Card className="p-5 border-sunset-orange/30 bg-sunset-radial overflow-hidden relative">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-sunset-gradient opacity-10" />
      <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-sunset-gradient flex items-center justify-center shrink-0 shadow-lg shadow-sunset-orange/30">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              You're on the Free plan
              <Badge className="bg-sunset-cream/40 text-[#7A3A0E]">LIMITED</Badge>
            </h3>
            <p className="text-xs text-muted-foreground">Upgrade to Pro for unlimited ads, 10 competitors, analytics & more.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 lg:ml-auto">
          <div className="hidden sm:flex flex-col gap-1 w-32">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Saved ads</span>
              <span className="font-semibold text-red-600">{usage.savedAds}/{limits.savedAds}</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-red-500" style={{ width: `${Math.min(100, savedPct)}%` }} />
            </div>
          </div>
          <Button size="sm" className="bg-sunset-gradient hover:opacity-90 text-white shrink-0" onClick={() => setView("pricing")}>
            <Crown className="h-4 w-4 mr-1.5" />
            Upgrade now
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
