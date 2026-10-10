"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Users, Plus, Search, TrendingUp, TrendingDown, Clock, Eye, MoreVertical,
  Pause, Play, Trash2, Bell, ExternalLink, ChevronRight, Filter, Sparkles,
  Flame, Target, GitCompare, Check, X,
} from "lucide-react";
import { mockCompetitors, type Competitor } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { sonnerToast } from "@/lib/toast-helpers";
import { downloadCompetitorHtmlReport } from "@/lib/export-utils";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Area, AreaChart, Legend, CartesianGrid,
} from "recharts";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CompetitorsView() {
  const [competitors, setCompetitors] = useState<Competitor[]>(mockCompetitors);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [compareSel, setCompareSel] = useState<string[]>([]);
  const [selected, setSelected] = useState<Competitor | null>(null);
  const [newUrl, setNewUrl] = useState("");

  const filtered = competitors.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalActiveAds = competitors.reduce((s, c) => s + c.activeAds, 0);
  const totalNew = competitors.reduce((s, c) => s + c.newAdsThisWeek, 0);

  const toggleStatus = (id: string) => {
    setCompetitors((prev) => prev.map((c) => c.id === id ? { ...c, status: c.status === "tracking" ? "paused" : "tracking" } : c));
    const c = competitors.find((x) => x.id === id);
    sonnerToast.success(`${c?.name} ${c?.status === "tracking" ? "paused" : "tracking resumed"}`);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-sunset-deep" />
            Competitor Tracker
          </h1>
          <p className="text-sm text-muted-foreground">{competitors.length} competitors · {totalActiveAds} active ads · {totalNew} new this week</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowCompare(true)}>
            <GitCompare className="h-4 w-4 mr-1.5" />
            Compare
          </Button>
          <Button size="sm" className="bg-sunset-gradient hover:opacity-90 text-white" onClick={() => setShowAdd(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Track Competitor
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search competitors by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-card border-border/60 max-w-md"
        />
      </div>

      {/* Trend overlay chart */}
      <TrendOverlayCard competitors={filtered} />

      {/* Competitor cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((c) => (
          <Card key={c.id} className="p-5 hover:shadow-lg hover:shadow-sunset-orange/10 transition-all group">
            <div className="flex items-start gap-3 mb-4">
              <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-offset-background" style={{ "--tw-ring-color": c.avatarColor } as React.CSSProperties}>
                <AvatarFallback className="text-sm text-white font-bold bg-transparent" style={{ backgroundColor: c.avatarColor }}>
                  {c.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{c.name}</h3>
                  {c.status === "tracking" ? (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 text-[10px] h-5">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1 animate-pulse" />
                      Tracking
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px] h-5">
                      <Pause className="h-2.5 w-2.5 mr-1" />
                      Paused
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{c.handle} · {c.category}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSelected(c)} className="cursor-pointer text-xs">
                    <Eye className="h-3.5 w-3.5 mr-2" /> View details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleStatus(c.id)} className="cursor-pointer text-xs">
                    {c.status === "tracking" ? <><Pause className="h-3.5 w-3.5 mr-2" /> Pause tracking</> : <><Play className="h-3.5 w-3.5 mr-2" /> Resume tracking</>}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => sonnerToast.success("Opening Meta Ad Library...")} className="cursor-pointer text-xs">
                    <ExternalLink className="h-3.5 w-3.5 mr-2" /> Open in Ad Library
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => sonnerToast.info(`${c.name} removed from tracking`)} className="cursor-pointer text-xs text-red-600">
                    <Trash2 className="h-3.5 w-3.5 mr-2" /> Stop tracking
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="rounded-lg bg-muted/40 p-2.5 text-center">
                <p className="text-lg font-bold text-sunset-deep">{c.activeAds}</p>
                <p className="text-[10px] text-muted-foreground">Active ads</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-2.5 text-center">
                <p className="text-lg font-bold">{c.totalSaved}</p>
                <p className="text-[10px] text-muted-foreground">Saved by you</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-2.5 text-center">
                <p className="text-lg font-bold text-green-600">+{c.newAdsThisWeek}</p>
                <p className="text-[10px] text-muted-foreground">New this week</p>
              </div>
            </div>

            {/* Trend chart */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">7-day ad count trend</span>
                <span className={cn("text-[10px] font-semibold flex items-center gap-0.5", c.trend[c.trend.length - 1] >= c.trend[0] ? "text-green-600" : "text-red-600")}>
                  {c.trend[c.trend.length - 1] >= c.trend[0] ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(c.trend[c.trend.length - 1] - c.trend[0])} ads
                </span>
              </div>
              <ResponsiveContainer width="100%" height={56}>
                <AreaChart data={c.trend.map((v, i) => ({ day: dayLabels[i], ads: v }))} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                  <defs>
                    <linearGradient id={`grad-${c.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={c.avatarColor} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={c.avatarColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="ads" stroke={c.avatarColor} strokeWidth={2} fill={`url(#grad-${c.id})`} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-border/40">
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Checked {timeAgo(c.lastChecked)}
              </span>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-sunset-deep hover:text-sunset-deep" onClick={() => setSelected(c)}>
                View ads <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="p-12 text-center">
          <div className="h-16 w-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-1">No competitors found</h3>
          <p className="text-sm text-muted-foreground mb-4">Start tracking a competitor to see their ads here.</p>
          <Button size="sm" className="bg-sunset-gradient hover:opacity-90 text-white" onClick={() => setShowAdd(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Add competitor
          </Button>
        </Card>
      )}

      {/* Add competitor dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-sunset-deep" /> Track a New Competitor</DialogTitle>
            <DialogDescription>Paste a Meta Ad Library URL or search by page name.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium mb-1.5 block">Meta Ad Library URL</label>
              <Input
                placeholder="https://www.facebook.com/ads/library/?ad_type=all..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="bg-muted/40"
              />
              <p className="text-[10px] text-muted-foreground mt-1">Tip: Open Meta Ad Library, filter by advertiser, copy the URL.</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center"><span className="bg-card px-3 text-xs text-muted-foreground">or search</span></div>
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block">Popular pages to track</label>
              <div className="flex flex-wrap gap-1.5">
                {["Junaid Jamshed", "Maria B", "Limelight", "Ethnic by Outfitters", "ShopHive", "Telemart"].map((s) => (
                  <button key={s} onClick={() => setNewUrl(s)} className="text-xs border border-border/60 rounded-md px-2 py-1 hover:border-sunset-orange/40 hover:bg-muted/40 transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button className="bg-sunset-gradient hover:opacity-90 text-white" onClick={() => { setShowAdd(false); setNewUrl(""); sonnerToast.success("Competitor added! We'll start tracking their ads."); }}>
              <Bell className="h-4 w-4 mr-1.5" /> Start tracking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && <CompetitorDetail competitor={selected} />}
      </Dialog>

      {/* Compare dialog */}
      <CompetitorCompareDialog
        open={showCompare}
        onOpenChange={setShowCompare}
        competitors={competitors}
        selected={compareSel}
        onToggle={(id) => setCompareSel((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 3 ? prev : [...prev, id])}
      />
    </div>
  );
}

function CompetitorDetail({ competitor }: { competitor: Competitor }) {
  return (
    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
      <DialogHeader>
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12" style={{ backgroundColor: competitor.avatarColor }}>
            <AvatarFallback className="text-white font-bold bg-transparent">{competitor.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <DialogTitle className="text-xl">{competitor.name}</DialogTitle>
            <DialogDescription>{competitor.handle} · {competitor.category} · Page ID: {competitor.pageId}</DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="space-y-4 overflow-y-auto -mx-6 px-6 pb-2">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Active", value: competitor.activeAds, color: "#EA6113" },
            { label: "Saved", value: competitor.totalSaved, color: "#F88F22" },
            { label: "New (7d)", value: `+${competitor.newAdsThisWeek}`, color: "#FBB931" },
            { label: "Status", value: competitor.status, color: "#B84A0E" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-border/60 p-3 text-center">
              <p className="text-xl font-bold capitalize" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Trend chart */}
        <div>
          <p className="text-xs font-semibold mb-2">Active ads — last 7 days</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={competitor.trend.map((v, i) => ({ day: dayLabels[i], ads: v }))}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} width={30} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
              <Line type="monotone" dataKey="ads" stroke={competitor.avatarColor} strokeWidth={3} dot={{ fill: competitor.avatarColor, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Tracking settings */}
        <div className="rounded-lg border border-border/60 p-3 space-y-2">
          <p className="text-xs font-semibold flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-sunset-orange" /> Tracking preferences</p>
          {[
            { label: "New ad alerts", on: true },
            { label: "Weekly digest email", on: true },
            { label: "Ad copy change alerts", on: false },
            { label: "Status change alerts", on: true },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{s.label}</span>
              <Badge variant={s.on ? "default" : "secondary"} className={cn("text-[9px] h-4", s.on && "bg-sunset-gradient text-white")}>
                {s.on ? "ON" : "OFF"}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-3 border-t border-border">
        <Button variant="outline" size="sm" onClick={() => sonnerToast.success("Opening Meta Ad Library...")}>
          <ExternalLink className="h-4 w-4 mr-1.5" /> View in Ad Library
        </Button>
        <Button size="sm" className="bg-sunset-gradient hover:opacity-90 text-white ml-auto">
          <Flame className="h-4 w-4 mr-1.5" /> Save all active ads
        </Button>
      </div>
    </DialogContent>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/* ---------------- Competitor Comparison Dialog ---------------- */

function CompetitorCompareDialog({
  open, onOpenChange, competitors, selected, onToggle,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  competitors: Competitor[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  const selectedComps = competitors.filter((c) => selected.includes(c.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border bg-sunset-radial">
          <DialogTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-sunset-deep" />
            Compare Competitors
          </DialogTitle>
          <DialogDescription>
            Select up to 3 competitors to compare side-by-side. {selected.length}/3 selected.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-5">
            {/* Selector chips */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Select competitors to compare</p>
              <div className="flex flex-wrap gap-2">
                {competitors.map((c) => {
                  const isSel = selected.includes(c.id);
                  const disabled = !isSel && selected.length >= 3;
                  return (
                    <button
                      key={c.id}
                      onClick={() => onToggle(c.id)}
                      disabled={disabled}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                        isSel
                          ? "bg-sunset-gradient text-white border-transparent shadow-sm"
                          : disabled
                            ? "border-border/40 text-muted-foreground/40 cursor-not-allowed"
                            : "border-border/60 hover:border-sunset-orange/40 hover:bg-muted/40"
                      )}
                    >
                      {isSel ? <Check className="h-3 w-3" /> : <X className="h-3 w-3 opacity-0" />}
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedComps.length < 2 ? (
              <div className="py-12 text-center">
                <div className="h-14 w-14 rounded-full bg-muted mx-auto flex items-center justify-center mb-3">
                  <GitCompare className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold mb-1">Select at least 2 competitors</p>
                <p className="text-xs text-muted-foreground">Choose competitors from above to see a side-by-side comparison.</p>
              </div>
            ) : (
              <>
                {/* Comparison grid */}
                <div className={cn("grid gap-4", selectedComps.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3")}>
                  {selectedComps.map((c) => (
                    <div key={c.id} className="rounded-xl border border-border/60 overflow-hidden">
                      <div className="p-4 text-white" style={{ backgroundColor: c.avatarColor }}>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="h-9 w-9 rounded-lg bg-white/20 flex items-center justify-center text-sm font-bold">
                            {c.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm truncate">{c.name}</p>
                            <p className="text-[10px] opacity-80 truncate">{c.handle}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 space-y-2 text-xs">
                        <div className="flex justify-between"><span className="text-muted-foreground">Category</span><span className="font-medium">{c.category}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Active ads</span><span className="font-bold text-sunset-deep">{c.activeAds}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Saved by you</span><span className="font-medium">{c.totalSaved}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">New this week</span><span className="font-medium text-green-600">+{c.newAdsThisWeek}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="font-medium capitalize">{c.status}</span></div>
                        {/* Mini trend */}
                        <div className="pt-2">
                          <p className="text-[10px] text-muted-foreground mb-1">7-day trend</p>
                          <ResponsiveContainer width="100%" height={40}>
                            <AreaChart data={c.trend.map((v, i) => ({ day: dayLabels[i], ads: v }))} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                              <defs>
                                <linearGradient id={`cmp-${c.id}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor={c.avatarColor} stopOpacity={0.4} />
                                  <stop offset="100%" stopColor={c.avatarColor} stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <Area type="monotone" dataKey="ads" stroke={c.avatarColor} strokeWidth={2} fill={`url(#cmp-${c.id})`} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comparison summary */}
                <div className="rounded-xl bg-sunset-radial border border-sunset-amber/30 p-4">
                  <p className="text-xs font-semibold flex items-center gap-2 mb-2">
                    <Sparkles className="h-3.5 w-3.5 text-sunset-orange" />
                    Comparison Summary
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    {(() => {
                      const topAds = [...selectedComps].sort((a, b) => b.activeAds - a.activeAds)[0];
                      const topNew = [...selectedComps].sort((a, b) => b.newAdsThisWeek - a.newAdsThisWeek)[0];
                      const topSaved = [...selectedComps].sort((a, b) => b.totalSaved - a.totalSaved)[0];
                      return [
                        { label: "Most active ads", value: topAds.name, sub: `${topAds.activeAds} ads`, color: topAds.avatarColor },
                        { label: "Most new this week", value: topNew.name, sub: `+${topNew.newAdsThisWeek}`, color: topNew.avatarColor },
                        { label: "Most saved by you", value: topSaved.name, sub: `${topSaved.totalSaved} saved`, color: topSaved.avatarColor },
                      ].map((s) => (
                        <div key={s.label} className="rounded-lg bg-card border border-border/60 p-2.5">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.label}</p>
                          <p className="font-semibold text-sm truncate" style={{ color: s.color }}>{s.value}</p>
                          <p className="text-[10px] text-muted-foreground">{s.sub}</p>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <div className="flex items-center gap-2 px-6 py-3 border-t border-border bg-muted/30">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Close</Button>
          {selectedComps.length >= 2 && (
            <Button size="sm" className="ml-auto bg-sunset-gradient hover:opacity-90 text-white" onClick={() => { downloadCompetitorHtmlReport(selectedComps); sonnerToast.success(`Downloaded comparison report for ${selectedComps.length} competitors`); }}>
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              Export report
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Trend Overlay Card ---------------- */

function TrendOverlayCard({ competitors }: { competitors: Competitor[] }) {
  const [visible, setVisible] = useState<string[]>(competitors.slice(0, 4).map((c) => c.id));

  // Build chart data: array of { day, [competitorName]: adCount, ... }
  const chartData = dayLabels.map((day, i) => {
    const row: Record<string, string | number> = { day };
    competitors.forEach((c) => {
      if (c.id in (Object.fromEntries(competitors.map((cc) => [cc.id, cc.trend[i]])))) {
        row[c.name] = c.trend[i];
      }
      row[c.name] = c.trend[i];
    });
    return row;
  });

  const toggleVisible = (id: string) => {
    setVisible((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const shownCompetitors = competitors.filter((c) => visible.includes(c.id));

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-sunset-deep" />
            Active Ads Trend — Overlay
          </h3>
          <p className="text-xs text-muted-foreground">7-day active ad count across all tracked competitors</p>
        </div>
        <Badge variant="outline" className="text-[10px]">{visible.length} of {competitors.length} shown</Badge>
      </div>

      {/* Competitor legend toggles */}
      <div className="flex flex-wrap gap-2 mb-4">
        {competitors.map((c) => {
          const isVisible = visible.includes(c.id);
          return (
            <button
              key={c.id}
              onClick={() => toggleVisible(c.id)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all",
                isVisible
                  ? "border-transparent text-white shadow-sm"
                  : "border-border/60 text-muted-foreground hover:bg-muted/40"
              )}
              style={isVisible ? { backgroundColor: c.avatarColor } : {}}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: isVisible ? "#fff" : c.avatarColor }} />
              {c.name}
            </button>
          );
        })}
      </div>

      {/* Line chart */}
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
            cursor={{ stroke: "#F88F22", strokeWidth: 1, strokeDasharray: "4 4" }}
          />
          {shownCompetitors.length > 1 && (
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} iconType="circle" />
          )}
          {shownCompetitors.map((c) => (
            <Line
              key={c.id}
              type="monotone"
              dataKey={c.name}
              stroke={c.avatarColor}
              strokeWidth={2.5}
              dot={{ fill: c.avatarColor, r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {shownCompetitors.length === 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Click a competitor chip above to show their trend.
        </div>
      )}
    </Card>
  );
}
