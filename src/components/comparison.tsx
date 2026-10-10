"use client";

import { useAppStore } from "@/lib/store";
import { mockAds, type SavedAd } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  GitCompare, X, Clock, TrendingUp, Heart, Eye, Facebook, Instagram,
  ImageIcon, Video, Images, LayoutGrid, Trash2, Share2, Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { sonnerToast } from "@/lib/toast-helpers";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const formatIcon: Record<string, React.ElementType> = {
  image: ImageIcon,
  video: Video,
  carousel: Images,
  collection: LayoutGrid,
};

export function ComparisonTray() {
  const { compareAds, clearCompare } = useAppStore();
  const [open, setOpen] = useState(false);

  const ads = compareAds
    .map((id) => mockAds.find((a) => a.id === id))
    .filter(Boolean) as SavedAd[];

  return (
    <>
      <AnimatePresence>
        {compareAds.length > 0 && (
          <motion.div
            key="tray"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[min(94vw,640px)]"
          >
        <div className="rounded-2xl bg-card border border-border shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-2.5 bg-sunset-gradient text-white">
            <GitCompare className="h-4 w-4" />
            <span className="text-sm font-semibold flex-1">Comparison Tray</span>
            <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">{ads.length}/4 ads</span>
            <button onClick={clearCompare} className="text-white/80 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-3">
              {ads.map((ad) => (
                <div
                  key={ad.id}
                  className="shrink-0 h-12 w-16 rounded-md relative overflow-hidden border-2 border-sunset-orange/40"
                  style={{ background: `linear-gradient(135deg, ${ad.thumbnailColor}, ${ad.thumbnailColor}aa)` }}
                >
                  <span className="absolute bottom-0.5 left-0.5 text-[8px] font-bold text-white">{ad.daysRunning}d</span>
                </div>
              ))}
              {ads.length < 2 && (
                <div className="shrink-0 h-12 w-16 rounded-md border-2 border-dashed border-border flex items-center justify-center text-[10px] text-muted-foreground">
                  + Add
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 bg-sunset-gradient hover:opacity-90 text-white h-8 text-xs"
                disabled={ads.length < 2}
                onClick={() => setOpen(true)}
              >
                <GitCompare className="h-3.5 w-3.5 mr-1.5" />
                Compare {ads.length >= 2 ? `${ads.length} ads` : "(need 2+)"}
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => sonnerToast.success("Comparison exported as PDF")}>
                <Download className="h-3.5 w-3.5 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => sonnerToast.success("Share link copied")}>
                <Share2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 py-4 border-b border-border bg-sunset-radial">
            <DialogTitle className="flex items-center gap-2">
              <GitCompare className="h-5 w-5 text-sunset-deep" />
              Side-by-Side Ad Comparison
            </DialogTitle>
            <DialogDescription>
              Comparing {ads.length} ads — analyze creative differences at a glance.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1">
            <div className="p-6">
              {/* Ad previews side by side */}
              <div className={cn("grid gap-4 mb-6", ads.length === 2 ? "grid-cols-1 md:grid-cols-2" : ads.length === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-2 lg:grid-cols-4")}>
                {ads.map((ad) => {
                  const FIcon = formatIcon[ad.format];
                  return (
                    <div key={ad.id} className="space-y-2">
                      <div
                        className="relative aspect-[4/5] rounded-xl overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${ad.thumbnailColor}, ${ad.thumbnailColor}aa)` }}
                      >
                        <div className="absolute inset-0 opacity-20" style={{
                          backgroundImage: "radial-gradient(circle at 20% 30%, white 1.5px, transparent 1.5px), radial-gradient(circle at 70% 60%, white 1.5px, transparent 1.5px)",
                          backgroundSize: "24px 24px",
                        }} />
                        <div className="absolute top-2 left-2 flex gap-1">
                          <span className="rounded-full bg-black/40 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-bold text-white flex items-center gap-0.5">
                            <FIcon className="h-2.5 w-2.5" /> {ad.format}
                          </span>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 p-3 pt-8 bg-gradient-to-t from-black/70 to-transparent">
                          <p className="text-white font-bold text-sm leading-tight mb-1">{ad.headline}</p>
                          <button className="bg-white text-black text-[10px] font-bold px-2 py-1 rounded">{ad.cta}</button>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-semibold truncate">{ad.advertiser}</p>
                        <p className="text-[10px] text-muted-foreground">{ad.daysRunning}d running</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Comparison table */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="grid" style={{ gridTemplateColumns: `180px repeat(${ads.length}, 1fr)` }}>
                  {/* Header row */}
                  <div className="bg-muted/50 p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Attribute</div>
                  {ads.map((ad) => (
                    <div key={ad.id} className="bg-muted/50 p-3 text-xs font-semibold border-l border-border">
                      {ad.advertiser}
                    </div>
                  ))}

                  {/* Rows */}
                  {[
                    { label: "Headline", get: (a: SavedAd) => a.headline },
                    { label: "CTA", get: (a: SavedAd) => a.cta, badge: true },
                    { label: "Format", get: (a: SavedAd) => a.format, capitalize: true },
                    { label: "Platform", get: (a: SavedAd) => a.platform, capitalize: true },
                    { label: "Status", get: (a: SavedAd) => a.status, capitalize: true, statusColor: true },
                    { label: "Days Running", get: (a: SavedAd) => `${a.daysRunning}d` },
                    { label: "Likes", get: (a: SavedAd) => a.likes?.toLocaleString() || "—" },
                    { label: "Tags", get: (a: SavedAd) => a.tags.join(", "), capitalize: true },
                    { label: "First Seen", get: (a: SavedAd) => new Date(a.firstSeen).toLocaleDateString("en-US", { month: "short", day: "numeric" }) },
                    { label: "Ad Copy", get: (a: SavedAd) => a.adCopy.slice(0, 80) + "…", copy: true },
                  ].map((row, i) => (
                    <div key={row.label} className="contents">
                      <div className={cn("p-3 text-xs font-medium text-muted-foreground border-t border-border", i % 2 === 1 && "bg-muted/20")}>{row.label}</div>
                      {ads.map((ad) => (
                        <div key={ad.id} className={cn("p-3 text-xs border-l border-t border-border", i % 2 === 1 && "bg-muted/20")}>
                          {row.badge ? (
                            <span className="font-bold text-sunset-deep bg-sunset-cream/40 px-1.5 py-0.5 rounded">{row.get(ad)}</span>
                          ) : row.statusColor ? (
                            <span className={cn(
                              "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                              ad.status === "active" && "bg-green-100 text-green-700",
                              ad.status === "paused" && "bg-amber-100 text-amber-700",
                              ad.status === "ended" && "bg-gray-100 text-gray-600"
                            )}>{row.get(ad)}</span>
                          ) : row.copy ? (
                            <span className="text-muted-foreground leading-snug">{row.get(ad)}</span>
                          ) : (
                            <span className={cn(row.capitalize && "capitalize")}>{row.get(ad)}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* AI insight */}
              <div className="mt-4 rounded-xl bg-sunset-radial border border-sunset-amber/30 p-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-sunset-gradient flex items-center justify-center shrink-0">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold flex items-center gap-2">
                      Comparison Insight
                      <Badge className="text-[9px] h-4 px-1 bg-sunset-gradient text-white">AI</Badge>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {ads.length >= 2 && (
                        <>
                          The longest-running ad is <span className="font-semibold text-foreground">{ads.reduce((a, b) => a.daysRunning > b.daysRunning ? a : b).advertiser}</span> ({Math.max(...ads.map(a => a.daysRunning))} days), suggesting strong performance.
                          {" "}<span className="font-semibold text-foreground">{[...ads].sort((a, b) => (b.likes || 0) - (a.likes || 0))[0].advertiser}</span> has the most engagement.
                          {new Set(ads.map(a => a.cta)).size === 1 ? " All use the same CTA — consider testing variety." : " Different CTAs used — A/B test the winner."}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
