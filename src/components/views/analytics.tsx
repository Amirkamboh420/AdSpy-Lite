"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3, TrendingUp, Type, Palette, Clock, Target, Zap, Award,
  Download, Calendar, Filter, ArrowUpRight, Sparkles, Flame,
} from "lucide-react";
import {
  ctaWordFrequency, formatDistribution, adsSavedOverTime, platformSplit,
  adLongevityBuckets, topCompetitorsByAds, mockAds, mockCompetitors,
} from "@/lib/mock-data";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  PieChart, Pie, RadialBarChart, RadialBar, LineChart, Line, Area, AreaChart,
  Legend, CartesianGrid,
} from "recharts";
import { cn } from "@/lib/utils";
import { sonnerToast } from "@/lib/toast-helpers";
import { useState } from "react";

export function AnalyticsView() {
  const [range, setRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  // Top performing ads by longevity
  const topAds = [...mockAds].sort((a, b) => b.daysRunning - a.daysRunning).slice(0, 5);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-sunset-deep" />
            Analytics & Insights
          </h1>
          <p className="text-sm text-muted-foreground">Discover creative patterns across {mockAds.length} saved ads</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border/60 overflow-hidden">
            {(["7d", "30d", "90d", "all"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn("px-3 py-1.5 text-xs font-medium transition-colors", range === r ? "bg-sunset-gradient text-white" : "hover:bg-muted")}
              >
                {r === "all" ? "All time" : r}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => sonnerToast.success("Analytics report exported")}>
            <Download className="h-4 w-4 mr-1.5" /> Export
          </Button>
        </div>
      </div>

      {/* AI insight banner */}
      <Card className="p-4 bg-sunset-radial border-sunset-amber/30">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-sunset-gradient flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold flex items-center gap-2">
              AI Insight
              <Badge className="text-[9px] h-4 px-1 bg-sunset-gradient text-white">BETA</Badge>
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              <span className="font-medium text-foreground">"Shop Now"</span> is your most-saved CTA (22% of ads). Competitors in fashion are favoring video format (+18% this month). 3 of your tracked brands run the same ad for 45+ days — likely high performers worth modeling.
            </p>
          </div>
          <Button size="sm" variant="outline" className="shrink-0 border-sunset-orange/40" onClick={() => sonnerToast.info("Full AI report coming to Pro plan")}>
            View full report
          </Button>
        </div>
      </Card>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total saved", value: "101", icon: BarChart3, trend: "+12%", color: "#EA6113" },
          { label: "Avg longevity", value: "34d", icon: Clock, trend: "+5d", color: "#F88F22" },
          { label: "Top CTA", value: "Shop Now", icon: Type, trend: "22%", color: "#FBB931" },
          { label: "Top format", value: "Image", icon: Target, trend: "42%", color: "#B84A0E" },
        ].map((k) => (
          <Card key={k.label} className="p-4 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-10" style={{ backgroundColor: k.color }} />
            <div className="relative flex items-center justify-between mb-2">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">{k.label}</p>
              <k.icon className="h-4 w-4" style={{ color: k.color }} />
            </div>
            <p className="text-2xl font-bold relative">{k.value}</p>
            <p className="text-[11px] text-green-600 flex items-center gap-0.5 mt-1 relative">
              <ArrowUpRight className="h-3 w-3" /> {k.trend} vs prev
            </p>
          </Card>
        ))}
      </div>

      {/* CTA word frequency + Format distribution */}
      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2"><Type className="h-4 w-4 text-sunset-deep" /> CTA Word Frequency</h3>
              <p className="text-xs text-muted-foreground">Which call-to-action buttons appear most in saved ads</p>
            </div>
            <Badge variant="outline" className="text-[10px]"><Filter className="h-3 w-3 mr-1" /> {mockAds.length} ads</Badge>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={ctaWordFrequency} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="word" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} width={80} />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                cursor={{ fill: "#FBB93122" }}
                formatter={(v: number) => [`${v} ads (${ctaWordFrequency.find(d => d.count === v)?.pct}%)`, "Frequency"]}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18}>
                {ctaWordFrequency.map((_, i) => (
                  <Cell key={i} fill={["#EA6113", "#F88F22", "#FBB931", "#B84A0E", "#FF9F45", "#7A3A0E", "#D97A2E", "#A85618", "#E8A050"][i % 9]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-1 flex items-center gap-2"><Target className="h-4 w-4 text-sunset-deep" /> Format Mix</h3>
          <p className="text-xs text-muted-foreground mb-3">Image vs video vs carousel</p>
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
              <p className="text-2xl font-bold">{formatDistribution[0].value}%</p>
              <p className="text-[10px] text-muted-foreground">{formatDistribution[0].name}</p>
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

      {/* Saved over time + Platform split */}
      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2"><TrendingUp className="h-4 w-4 text-sunset-deep" /> Ads Saved vs Tracked</h3>
              <p className="text-xs text-muted-foreground">12-month trend</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={adsSavedOverTime} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="aSaved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EA6113" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#EA6113" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="aTracked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FBB931" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#FBB931" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="saved" stroke="#EA6113" strokeWidth={2.5} fill="url(#aSaved)" />
              <Area type="monotone" dataKey="tracked" stroke="#FBB931" strokeWidth={2.5} fill="url(#aTracked)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-1 flex items-center gap-2"><Palette className="h-4 w-4 text-sunset-deep" /> Platform Split</h3>
          <p className="text-xs text-muted-foreground mb-3">Facebook vs Instagram</p>
          <ResponsiveContainer width="100%" height={180}>
            <RadialBarChart data={platformSplit} innerRadius="40%" outerRadius="100%" startAngle={90} endAngle={-270}>
              <RadialBar dataKey="value" cornerRadius={8} background>
                {platformSplit.map((e, i) => <Cell key={i} fill={e.color} />)}
              </RadialBar>
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {platformSplit.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  {p.name}
                </span>
                <span className="font-medium">{p.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Longevity buckets + Top performers */}
      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="font-semibold mb-1 flex items-center gap-2"><Clock className="h-4 w-4 text-sunset-deep" /> Ad Longevity Distribution</h3>
          <p className="text-xs text-muted-foreground mb-3">How long saved ads have been running</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={adLongevityBuckets} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="range" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} cursor={{ fill: "#FBB93122" }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={50}>
                {adLongevityBuckets.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 p-3 rounded-lg bg-sunset-cream/20 border border-sunset-amber/20">
            <p className="text-xs flex items-start gap-2">
              <Zap className="h-3.5 w-3.5 text-sunset-deep shrink-0 mt-0.5" />
              <span><span className="font-semibold">Insight:</span> 13 ads have run 90+ days — these are likely top performers. Study their creative structure.</span>
            </p>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2"><Award className="h-4 w-4 text-sunset-amber" /> Longest-Running Ads</h3>
            <Badge variant="outline" className="text-[10px]">Top 5</Badge>
          </div>
          <div className="space-y-2">
            {topAds.map((ad, i) => (
              <div key={ad.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer">
                <div className={cn(
                  "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                  i === 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40" : "bg-muted text-muted-foreground"
                )}>
                  {i + 1}
                </div>
                <div
                  className="h-10 w-14 shrink-0 rounded-md relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${ad.thumbnailColor}, ${ad.thumbnailColor}aa)` }}
                >
                  {i === 0 && <Flame className="absolute top-0.5 right-0.5 h-3 w-3 text-yellow-300" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium truncate">{ad.headline}</p>
                  <p className="text-[10px] text-muted-foreground">{ad.advertiser} · {ad.format}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-sunset-deep">{ad.daysRunning}d</p>
                  <p className="text-[10px] text-muted-foreground">running</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Competitor comparison */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold flex items-center gap-2"><BarChart3 className="h-4 w-4 text-sunset-deep" /> Competitor Comparison</h3>
            <p className="text-xs text-muted-foreground">Active ad count across tracked competitors</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => sonnerToast.info("Side-by-side dashboard coming soon")}>
            <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Compare side-by-side
          </Button>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={topCompetitorsByAds} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} cursor={{ fill: "#FBB93122" }} />
            <Bar dataKey="ads" radius={[6, 6, 0, 0]} barSize={50}>
              {topCompetitorsByAds.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Color palette analysis */}
      <Card className="p-5">
        <h3 className="font-semibold mb-1 flex items-center gap-2"><Palette className="h-4 w-4 text-sunset-deep" /> Creative Color Analysis</h3>
        <p className="text-xs text-muted-foreground mb-4">Dominant colors in saved ad thumbnails</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            { color: "#EA6113", name: "Sunset Orange", pct: 28, ads: 28 },
            { color: "#F88F22", name: "Tangerine", pct: 22, ads: 22 },
            { color: "#FBB931", name: "Amber", pct: 18, ads: 18 },
            { color: "#B84A0E", name: "Rust", pct: 14, ads: 14 },
            { color: "#FFE3B3", name: "Cream", pct: 10, ads: 10 },
            { color: "#7A3A0E", name: "Brown", pct: 8, ads: 8 },
          ].map((c) => (
            <div key={c.name} className="text-center">
              <div
                className="h-20 rounded-xl mb-2 relative overflow-hidden group cursor-pointer hover:scale-105 transition-transform"
                style={{ backgroundColor: c.color }}
              >
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, white 1px, transparent 1px)", backgroundSize: "14px 14px" }} />
                <span className="absolute bottom-1 left-1 text-[9px] font-bold text-white/90">{c.pct}%</span>
              </div>
              <p className="text-xs font-medium">{c.name}</p>
              <p className="text-[10px] text-muted-foreground">{c.ads} ads</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
