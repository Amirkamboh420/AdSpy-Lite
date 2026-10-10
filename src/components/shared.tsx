"use client";

import { cn } from "@/lib/utils";
import type { SavedAd, AdFormat, AdPlatform } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bookmark, Heart, Video, Images, FileImage, LayoutGrid,
  Facebook, Instagram, Share2, MoreVertical, Clock, TrendingUp, GitCompare, CheckSquare, Pin,
} from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { sonnerToast } from "@/lib/toast-helpers";

const formatIcon: Record<AdFormat, React.ElementType> = {
  image: FileImage,
  video: Video,
  carousel: Images,
  collection: LayoutGrid,
};

function PlatformIcon({ platform }: { platform: AdPlatform }) {
  if (platform === "facebook") return <Facebook className="h-3.5 w-3.5" />;
  if (platform === "instagram") return <Instagram className="h-3.5 w-3.5" />;
  return (
    <span className="flex gap-0.5">
      <Facebook className="h-3.5 w-3.5" />
      <Instagram className="h-3.5 w-3.5" />
    </span>
  );
}

interface AdCardProps {
  ad: SavedAd;
  compact?: boolean;
  onOpen?: (ad: SavedAd) => void;
  compareMode?: boolean;
  bulkMode?: boolean;
  bulkSelected?: boolean;
  onToggleBulk?: (id: string) => void;
}

export function AdCard({ ad, compact, onOpen, compareMode, bulkMode, bulkSelected, onToggleBulk }: AdCardProps) {
  const [fav, setFav] = useState(ad.isFavorite);
  const FormatIcon = formatIcon[ad.format];
  const { compareAds, toggleCompareAd, pinnedAds, togglePinAd } = useAppStore();
  const inCompare = compareAds.includes(ad.id);
  const isPinned = pinnedAds.includes(ad.id);

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-border/60 transition-all duration-300 hover:shadow-xl hover:shadow-sunset-orange/10 hover:-translate-y-1",
        bulkSelected ? "ring-2 ring-sunset-orange border-sunset-orange/40 cursor-pointer" : "cursor-pointer",
        "bg-card"
      )}
      onClick={() => bulkMode ? onToggleBulk?.(ad.id) : onOpen?.(ad)}
    >
      {/* Thumbnail */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${ad.thumbnailColor} 0%, ${ad.thumbnailColor}cc 50%, ${ad.thumbnailColor}99 100%)`,
        }}
      >
        {/* Real ad image (if available) */}
        {ad.imagePath && (
          <img
            src={ad.imagePath}
            alt={`${ad.advertiser} ad: ${ad.headline}`}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        )}
        {/* Decorative pattern (only when no real image) */}
        {!ad.imagePath && (
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }} />
        )}

        {/* Top row */}
        <div className="absolute top-0 left-0 right-0 p-3 flex items-start justify-between">
          <div className="flex items-center gap-2">
            {bulkMode ? (
              <span className={cn(
                "flex items-center justify-center h-6 w-6 rounded-md border-2 transition-all",
                bulkSelected
                  ? "bg-sunset-deep border-sunset-deep text-white"
                  : "bg-black/30 backdrop-blur-md border-white/60 text-transparent"
              )}>
                <CheckSquare className="h-3.5 w-3.5" />
              </span>
            ) : (
              <>
                <span className="flex items-center gap-1 rounded-full bg-black/30 backdrop-blur-md px-2 py-1 text-[10px] font-semibold text-white">
                  <FormatIcon className="h-3 w-3" />
                  <span className="capitalize">{ad.format}</span>
                </span>
                <span className="flex items-center gap-1 rounded-full bg-black/30 backdrop-blur-md px-2 py-1 text-[10px] font-semibold text-white">
                  <PlatformIcon platform={ad.platform} />
                </span>
              </>
            )}
          </div>
          {!bulkMode && (
            <button
              onClick={(e) => { e.stopPropagation(); setFav(!fav); }}
              className="rounded-full bg-black/30 backdrop-blur-md p-1.5 text-white hover:bg-black/50 transition-colors"
            >
              <Heart className={cn("h-3.5 w-3.5", fav && "fill-red-500 text-red-500")} />
            </button>
          )}
        </div>

        {/* Compare toggle (only in compareMode) */}
        {compareMode && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCompareAd(ad.id);
              sonnerToast.success(inCompare ? "Removed from comparison" : "Added to comparison tray");
            }}
            className={cn(
              "absolute top-3 right-14 rounded-full px-2 py-1 text-[10px] font-bold flex items-center gap-1 backdrop-blur-md transition-all",
              inCompare
                ? "bg-sunset-deep text-white"
                : "bg-black/30 text-white hover:bg-black/50"
            )}
          >
            <GitCompare className="h-3 w-3" />
            {inCompare ? "In tray" : "Compare"}
          </button>
        )}

        {/* Pin toggle (top-right corner, below favorite) */}
        {!bulkMode && (
          <button
            onClick={(e) => { e.stopPropagation(); togglePinAd(ad.id); sonnerToast.success(isPinned ? "Unpinned ad" : "Pinned to top"); }}
            className={cn(
              "absolute bottom-3 right-3 rounded-full p-1.5 backdrop-blur-md transition-all",
              isPinned
                ? "bg-sunset-deep text-white"
                : "bg-black/30 text-white opacity-0 group-hover:opacity-100 hover:bg-black/50"
            )}
            title={isPinned ? "Unpin" : "Pin to top"}
          >
            <Pin className={cn("h-3.5 w-3.5", isPinned && "fill-white")} />
          </button>
        )}

        {/* Pinned indicator (always visible when pinned, bottom-left next to status) */}
        {isPinned && !bulkMode && (
          <div className="absolute bottom-3 left-3 -translate-y-7">
            <span className="flex items-center gap-0.5 rounded-full bg-sunset-deep px-1.5 py-0.5 text-[9px] font-bold text-white">
              <Pin className="h-2.5 w-2.5 fill-white" />
              PINNED
            </span>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute bottom-3 left-3">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide backdrop-blur-md",
              ad.status === "active" && "bg-green-500/90 text-white",
              ad.status === "paused" && "bg-amber-500/90 text-white",
              ad.status === "ended" && "bg-gray-700/90 text-white"
            )}
          >
            {ad.status}
          </span>
        </div>

        {/* Longevity */}
        <div className="absolute bottom-3 right-3">
          <span className="flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-md px-2 py-1 text-[10px] font-semibold text-white">
            <Clock className="h-3 w-3" />
            {ad.daysRunning}d
          </span>
        </div>

        {/* Headline overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 pt-8 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white font-bold text-sm line-clamp-1 drop-shadow">{ad.headline}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5 space-y-2.5">
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ backgroundColor: ad.thumbnailColor }}
          >
            {ad.advertiserAvatar}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold truncate">{ad.advertiser}</p>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-2.5 w-2.5" />
              {ad.likes?.toLocaleString()} likes
            </p>
          </div>
          <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={(e) => e.stopPropagation()}>
            <MoreVertical className="h-3.5 w-3.5" />
          </Button>
        </div>

        {!compact && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{ad.adCopy}</p>
        )}

        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap gap-1">
            {ad.tags.slice(0, 2).map((t) => (
              <Badge key={t} variant="secondary" className="text-[9px] px-1.5 py-0 h-4 capitalize bg-sunset-cream/40 text-[#7A3A0E]">
                {t}
              </Badge>
            ))}
          </div>
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
            {ad.cta}
          </span>
        </div>
      </div>
    </Card>
  );
}

export function StatCard({
  label, value, icon: Icon, trend, accent = "#EA6113", sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: { value: string; up: boolean };
  accent?: string;
  sub?: string;
}) {
  return (
    <Card className="relative overflow-hidden p-5 group hover:shadow-lg transition-shadow">
      <div
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
        style={{ backgroundColor: accent }}
      />
      <div className="relative flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm"
          style={{ backgroundColor: accent }}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && (
        <div className="relative mt-3 flex items-center gap-1.5">
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md",
              trend.up ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
            )}
          >
            <TrendingUp className={cn("h-3 w-3", !trend.up && "rotate-180")} />
            {trend.value}
          </span>
          <span className="text-[11px] text-muted-foreground">vs last week</span>
        </div>
      )}
    </Card>
  );
}

export { Bookmark };
