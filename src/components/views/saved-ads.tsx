"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdCard } from "@/components/shared";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bookmark, Search, Filter, Download, FolderPlus, Grid3x3, List,
  FolderHeart, X, ChevronDown, FileText, Image as ImageIcon, Video,
  Images, Facebook, Instagram, Clock, Heart, StickyNote, Share2,
  Trash2, Tag, Plus, SortAsc, GitCompare, CheckSquare, Layers, Check, Pin,
} from "lucide-react";
import { mockAds, mockFolders, type SavedAd, type AdFormat } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { sonnerToast } from "@/lib/toast-helpers";
import { downloadAdsCsv, downloadAdsJson, downloadAdsHtmlReport } from "@/lib/export-utils";
import { useAppStore } from "@/lib/store";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

const formatIcons: Record<AdFormat, React.ElementType> = {
  image: ImageIcon,
  video: Video,
  carousel: Images,
  collection: Grid3x3,
};

type SortKey = "recent" | "oldest" | "longest" | "shortest" | "az";

export function SavedAdsView() {
  const [ads, setAds] = useState<SavedAd[]>(mockAds);
  const pinnedAds = useAppStore((s) => s.pinnedAds);
  const [search, setSearch] = useState("");
  const [activeFolder, setActiveFolder] = useState<string>("all");
  const [formatFilter, setFormatFilter] = useState<AdFormat | "all">("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<SortKey>("recent");
  const [selectedAd, setSelectedAd] = useState<SavedAd | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [showMoveDialog, setShowMoveDialog] = useState(false);

  const filtered = useMemo(() => {
    let result = ads;
    if (activeFolder !== "all") result = result.filter((a) => a.folderId === activeFolder);
    if (formatFilter !== "all") result = result.filter((a) => a.format === formatFilter);
    if (platformFilter !== "all") result = result.filter((a) => a.platform === platformFilter || a.platform === "both");
    if (statusFilter !== "all") result = result.filter((a) => a.status === statusFilter);
    if (favoritesOnly) result = result.filter((a) => a.isFavorite);
    if (pinnedOnly) result = result.filter((a) => pinnedAds.includes(a.id));
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((a) =>
        a.advertiser.toLowerCase().includes(q) ||
        a.headline.toLowerCase().includes(q) ||
        a.adCopy.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    const sorted = [...result];
    // Pinned ads always first (stable within pinned/unpinned groups by chosen sort)
    sorted.sort((a, b) => {
      const aPin = pinnedAds.includes(a.id) ? 0 : 1;
      const bPin = pinnedAds.includes(b.id) ? 0 : 1;
      if (aPin !== bPin) return aPin - bPin;
      return 0; // preserve the sort below
    });
    // Apply the user-selected sort within pinned and non-pinned groups
    const applySort = (arr: SavedAd[]) => {
      switch (sort) {
        case "recent": arr.sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()); break;
        case "oldest": arr.sort((a, b) => new Date(a.firstSeen).getTime() - new Date(b.firstSeen).getTime()); break;
        case "longest": arr.sort((a, b) => b.daysRunning - a.daysRunning); break;
        case "shortest": arr.sort((a, b) => a.daysRunning - b.daysRunning); break;
        case "az": arr.sort((a, b) => a.advertiser.localeCompare(b.advertiser)); break;
      }
    };
    const pinned = sorted.filter((a) => pinnedAds.includes(a.id));
    const unpinned = sorted.filter((a) => !pinnedAds.includes(a.id));
    applySort(pinned);
    applySort(unpinned);
    return [...pinned, ...unpinned];
  }, [ads, activeFolder, formatFilter, platformFilter, statusFilter, favoritesOnly, pinnedOnly, search, sort, pinnedAds]);

  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = { all: ads.length };
    mockFolders.forEach((f) => { counts[f.id] = ads.filter((a) => a.folderId === f.id).length; });
    return counts;
  }, [ads]);

  const activeFilters = [
    formatFilter !== "all" && { label: formatFilter, clear: () => setFormatFilter("all") },
    platformFilter !== "all" && { label: platformFilter, clear: () => setPlatformFilter("all") },
    statusFilter !== "all" && { label: statusFilter, clear: () => setStatusFilter("all") },
    favoritesOnly && { label: "favorites", clear: () => setFavoritesOnly(false) },
    pinnedOnly && { label: "pinned", clear: () => setPinnedOnly(false) },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-sunset-deep" />
            Saved Ads
          </h1>
          <p className="text-sm text-muted-foreground">{ads.length} ads across {mockFolders.length} folders</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}>
            <Download className="h-4 w-4 mr-1.5" />
            Export
          </Button>
          <Button size="sm" className="bg-sunset-gradient hover:opacity-90 text-white" onClick={() => sonnerToast.success("New folder created")}>
            <FolderPlus className="h-4 w-4 mr-1.5" />
            New Folder
          </Button>
        </div>
      </div>

      {/* Folder tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveFolder("all")}
          className={cn(
            "shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border",
            activeFolder === "all"
              ? "bg-sunset-gradient text-white border-transparent shadow-sm"
              : "bg-card border-border/60 text-muted-foreground hover:border-sunset-orange/40"
          )}
        >
          <FolderHeart className="h-3.5 w-3.5" />
          All Ads
          <Badge variant="secondary" className={cn("h-4 text-[10px] px-1", activeFolder === "all" ? "bg-white/20 text-white" : "")}>{folderCounts.all}</Badge>
        </button>
        {pinnedAds.length > 0 && (
          <button
            onClick={() => { setPinnedOnly(!pinnedOnly); }}
            className={cn(
              "shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border",
              pinnedOnly
                ? "bg-sunset-deep text-white border-transparent shadow-sm"
                : "bg-card border-border/60 text-muted-foreground hover:border-sunset-orange/40"
            )}
          >
            <Pin className={cn("h-3.5 w-3.5", pinnedOnly && "fill-white")} />
            Pinned
            <Badge variant="secondary" className={cn("h-4 text-[10px] px-1", pinnedOnly ? "bg-white/20 text-white" : "bg-sunset-cream/40 text-[#7A3A0E]")}>{pinnedAds.length}</Badge>
          </button>
        )}
        {mockFolders.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFolder(f.id)}
            className={cn(
              "shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border",
              activeFolder === f.id
                ? "text-white border-transparent shadow-sm"
                : "bg-card border-border/60 text-muted-foreground hover:border-sunset-orange/40"
            )}
            style={activeFolder === f.id ? { backgroundColor: f.color } : {}}
          >
            <FolderHeart className="h-3.5 w-3.5" />
            {f.name}
            <Badge variant="secondary" className={cn("h-4 text-[10px] px-1", activeFolder === f.id ? "bg-white/20 text-white" : "")}>{folderCounts[f.id]}</Badge>
          </button>
        ))}
      </div>

      {/* Search + filters bar */}
      <Card className="p-3">
        <div className="flex flex-col lg:flex-row gap-2 items-stretch">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by advertiser, headline, copy, or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted/40 border-border/40"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Format filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="h-3.5 w-3.5 mr-1.5" />
                  Format
                  {formatFilter !== "all" && <Badge className="ml-1 h-4 text-[9px] px-1 bg-sunset-gradient text-white">{formatFilter}</Badge>}
                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-xs">Ad Format</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked={formatFilter === "all"} onCheckedChange={() => setFormatFilter("all")}>All formats</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={formatFilter === "image"} onCheckedChange={() => setFormatFilter("image")}>Image</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={formatFilter === "video"} onCheckedChange={() => setFormatFilter("video")}>Video</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={formatFilter === "carousel"} onCheckedChange={() => setFormatFilter("carousel")}>Carousel</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={formatFilter === "collection"} onCheckedChange={() => setFormatFilter("collection")}>Collection</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Platform filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Facebook className="h-3.5 w-3.5 mr-1.5" />
                  Platform
                  {platformFilter !== "all" && <Badge className="ml-1 h-4 text-[9px] px-1 bg-sunset-gradient text-white">{platformFilter}</Badge>}
                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-xs">Platform</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked={platformFilter === "all"} onCheckedChange={() => setPlatformFilter("all")}>All platforms</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={platformFilter === "facebook"} onCheckedChange={() => setPlatformFilter("facebook")}>Facebook</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={platformFilter === "instagram"} onCheckedChange={() => setPlatformFilter("instagram")}>Instagram</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Status filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 capitalize">
                  <span className="h-2 w-2 rounded-full bg-sunset-amber mr-1.5" />
                  Status
                  {statusFilter !== "all" && <Badge className="ml-1 h-4 text-[9px] px-1 bg-sunset-gradient text-white">{statusFilter}</Badge>}
                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-xs">Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked={statusFilter === "all"} onCheckedChange={() => setStatusFilter("all")}>All statuses</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={statusFilter === "active"} onCheckedChange={() => setStatusFilter("active")}>Active</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={statusFilter === "paused"} onCheckedChange={() => setStatusFilter("paused")}>Paused</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={statusFilter === "ended"} onCheckedChange={() => setStatusFilter("ended")}>Ended</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <SortAsc className="h-3.5 w-3.5 mr-1.5" />
                  Sort
                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-xs">Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSort("recent")} className="text-xs cursor-pointer">Most recently saved</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort("oldest")} className="text-xs cursor-pointer">Oldest first</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort("longest")} className="text-xs cursor-pointer">Longest running</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort("shortest")} className="text-xs cursor-pointer">Shortest running</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort("az")} className="text-xs cursor-pointer">Advertiser A-Z</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Favorites toggle */}
            <Button
              variant={favoritesOnly ? "default" : "outline"}
              size="sm"
              className="h-9"
              onClick={() => setFavoritesOnly(!favoritesOnly)}
            >
              <Heart className={cn("h-3.5 w-3.5 mr-1.5", favoritesOnly && "fill-current")} />
              Favorites
            </Button>

            {/* Pinned filter */}
            {pinnedAds.length > 0 && (
              <Button
                variant={pinnedOnly ? "default" : "outline"}
                size="sm"
                className="h-9"
                onClick={() => setPinnedOnly(!pinnedOnly)}
              >
                <Pin className={cn("h-3.5 w-3.5 mr-1.5", pinnedOnly && "fill-current")} />
                Pinned
                <Badge className={cn("ml-1 h-4 text-[9px] px-1", pinnedOnly ? "bg-white/20 text-white" : "bg-sunset-cream/40 text-[#7A3A0E]")}>{pinnedAds.length}</Badge>
              </Button>
            )}

            {/* Compare toggle */}
            <Button
              variant={compareMode ? "default" : "outline"}
              size="sm"
              className="h-9"
              onClick={() => setCompareMode(!compareMode)}
            >
              <GitCompare className={cn("h-3.5 w-3.5 mr-1.5", compareMode && "text-white")} />
              Compare
              {compareMode && <Badge className="ml-1 h-4 text-[9px] px-1 bg-white/20 text-white">ON</Badge>}
            </Button>

            {/* Bulk select toggle */}
            <Button
              variant={bulkMode ? "default" : "outline"}
              size="sm"
              className="h-9"
              onClick={() => { setBulkMode(!bulkMode); if (bulkMode) setBulkSelected([]); }}
            >
              <CheckSquare className={cn("h-3.5 w-3.5 mr-1.5", bulkMode && "text-white")} />
              Select
              {bulkMode && <Badge className="ml-1 h-4 text-[9px] px-1 bg-white/20 text-white">{bulkSelected.length}</Badge>}
            </Button>

            {/* View toggle */}
            <div className="flex items-center rounded-lg border border-border/60 overflow-hidden">
              <button
                onClick={() => setView("grid")}
                className={cn("h-9 w-9 flex items-center justify-center transition-colors", view === "grid" ? "bg-sunset-gradient text-white" : "hover:bg-muted")}
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={cn("h-9 w-9 flex items-center justify-center transition-colors", view === "list" ? "bg-sunset-gradient text-white" : "hover:bg-muted")}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/40 flex-wrap">
            <span className="text-xs text-muted-foreground">{filtered.length} results ·</span>
            {activeFilters.map((f, i) => (
              <button
                key={i}
                onClick={f.clear}
                className="flex items-center gap-1 text-xs bg-sunset-cream/40 text-[#7A3A0E] px-2 py-0.5 rounded-md hover:bg-sunset-cream/60 capitalize"
              >
                {f.label}
                <X className="h-3 w-3" />
              </button>
            ))}
            <button onClick={() => { setFormatFilter("all"); setPlatformFilter("all"); setStatusFilter("all"); setFavoritesOnly(false); setPinnedOnly(false); setSearch(""); }} className="text-xs text-muted-foreground hover:text-foreground ml-auto">
              Clear all
            </button>
          </div>
        )}
      </Card>

      {/* Ads grid */}
      {filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="h-16 w-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-1">No ads found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms.</p>
        </Card>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((ad) => (
            <AdCard
              key={ad.id}
              ad={ad}
              onOpen={setSelectedAd}
              compareMode={compareMode}
              bulkMode={bulkMode}
              bulkSelected={bulkSelected.includes(ad.id)}
              onToggleBulk={(id) => setBulkSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])}
            />
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="divide-y divide-border/40">
            {filtered.map((ad) => {
              const FIcon = formatIcons[ad.format];
              return (
                <div
                  key={ad.id}
                  className="flex items-center gap-3 p-3 hover:bg-muted/40 transition-colors cursor-pointer"
                  onClick={() => setSelectedAd(ad)}
                >
                  <div
                    className="h-14 w-20 shrink-0 rounded-md relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${ad.thumbnailColor}, ${ad.thumbnailColor}aa)` }}
                  >
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, white 1px, transparent 1px)", backgroundSize: "12px 12px" }} />
                    <FIcon className="absolute top-1 left-1 h-3 w-3 text-white/80" />
                    {ad.isFavorite && <Heart className="absolute top-1 right-1 h-3 w-3 fill-red-500 text-red-500" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{ad.headline}</p>
                    <p className="text-xs text-muted-foreground truncate">{ad.advertiser} · {ad.adCopy.slice(0, 60)}...</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {ad.tags.slice(0, 2).map((t) => (
                        <Badge key={t} variant="secondary" className="text-[9px] h-4 px-1 capitalize bg-sunset-cream/40 text-[#7A3A0E]">{t}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-3 shrink-0 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{ad.daysRunning}d</span>
                    <Badge variant="outline" className="text-[10px] capitalize h-5">{ad.status}</Badge>
                    <span className="font-bold text-sunset-deep bg-sunset-cream/30 px-2 py-0.5 rounded">{ad.cta}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Ad detail dialog */}
      <Dialog open={!!selectedAd} onOpenChange={(o) => !o && setSelectedAd(null)}>
        {selectedAd && <AdDetailDialog ad={selectedAd} />}
      </Dialog>

      {/* Bulk action bar */}
      {bulkMode && bulkSelected.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[min(94vw,560px)]">
          <div className="rounded-2xl bg-card border border-border shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2.5 bg-sunset-gradient text-white">
              <CheckSquare className="h-4 w-4" />
              <span className="text-sm font-semibold flex-1">
                {bulkSelected.length} ad{bulkSelected.length !== 1 ? "s" : ""} selected
              </span>
              <button
                onClick={() => setBulkSelected([])}
                className="text-white/80 hover:text-white text-xs"
              >
                Clear
              </button>
            </div>
            <div className="p-2.5 flex items-center gap-2 flex-wrap">
              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => { const sel = ads.filter((a) => bulkSelected.includes(a.id)); downloadAdsCsv(sel); sonnerToast.success(`Downloaded ${sel.length} ads as CSV`); }}>
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Export CSV
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => { const sel = ads.filter((a) => bulkSelected.includes(a.id)); downloadAdsHtmlReport(sel); sonnerToast.success(`Downloaded ${sel.length} ads as PDF report`); }}>
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                Export PDF
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setShowMoveDialog(true)}>
                <FolderHeart className="h-3.5 w-3.5 mr-1.5" />
                Move to folder
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setShowTagDialog(true)}>
                <Tag className="h-3.5 w-3.5 mr-1.5" />
                Tag
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs text-red-600 hover:text-red-700 ml-auto" onClick={() => { sonnerToast.info(`Removed ${bulkSelected.length} ads`); setBulkSelected([]); }}>
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Select-all helper when bulkMode on */}
      {bulkMode && filtered.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground -mt-2">
          <button
            onClick={() => setBulkSelected(filtered.map((a) => a.id))}
            className="hover:text-foreground underline-offset-2 hover:underline"
          >
            Select all {filtered.length}
          </button>
          <span>·</span>
          <button
            onClick={() => setBulkSelected([])}
            className="hover:text-foreground underline-offset-2 hover:underline"
          >
            Deselect all
          </button>
        </div>
      )}

      {/* Bulk Tag editor dialog */}
      <BulkTagDialog
        open={showTagDialog}
        onOpenChange={setShowTagDialog}
        count={bulkSelected.length}
        onConfirm={(tags) => {
          // Actually mutate ad state: add tags to selected ads
          setAds((prev) => prev.map((a) => bulkSelected.includes(a.id)
            ? { ...a, tags: Array.from(new Set([...a.tags, ...tags])) }
            : a
          ));
          setShowTagDialog(false);
          sonnerToast.success(`Added ${tags.length} tag${tags.length !== 1 ? "s" : ""} to ${bulkSelected.length} ad${bulkSelected.length !== 1 ? "s" : ""}`);
        }}
      />

      {/* Bulk Move to folder dialog */}
      <BulkMoveDialog
        open={showMoveDialog}
        onOpenChange={setShowMoveDialog}
        count={bulkSelected.length}
        onConfirm={(folderId, folderName) => {
          // Actually mutate ad state: move selected ads to chosen folder
          setAds((prev) => prev.map((a) => bulkSelected.includes(a.id) ? { ...a, folderId } : a));
          setShowMoveDialog(false);
          sonnerToast.success(`Moved ${bulkSelected.length} ad${bulkSelected.length !== 1 ? "s" : ""} to "${folderName}"`);
          setBulkSelected([]);
        }}
      />

      {/* Export dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Download className="h-5 w-5 text-sunset-deep" /> Export Saved Ads</DialogTitle>
            <DialogDescription>Export {filtered.length} ads in your chosen format.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {[
              { fmt: "CSV", desc: "Spreadsheet-friendly. All ad metadata + tags.", icon: FileText, color: "#EA6113", download: () => downloadAdsCsv(filtered) },
              { fmt: "PDF Report", desc: "Branded printable HTML report. Opens in browser → Print to PDF.", icon: FileText, color: "#F88F22", download: () => downloadAdsHtmlReport(filtered) },
              { fmt: "JSON", desc: "For API integration. Raw structured data.", icon: FileText, color: "#FBB931", download: () => downloadAdsJson(filtered) },
            ].map((o) => (
              <button
                key={o.fmt}
                onClick={() => { o.download(); setShowExportDialog(false); sonnerToast.success(`Downloaded ${filtered.length} ads as ${o.fmt}`); }}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-border/60 hover:border-sunset-orange/40 hover:bg-muted/40 transition-all text-left group"
              >
                <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform" style={{ backgroundColor: o.color }}>
                  <o.icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold flex items-center gap-2">{o.fmt}</p>
                  <p className="text-xs text-muted-foreground">{o.desc}</p>
                </div>
                <Download className="h-4 w-4 text-muted-foreground group-hover:text-sunset-deep transition-colors" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AdDetailDialog({ ad }: { ad: SavedAd }) {
  const [note, setNote] = useState(ad.notes || "");
  const [isFavorite, setIsFavorite] = useState(ad.isFavorite);
  const FIcon = formatIcons[ad.format];

  return (
    <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
      <DialogHeader>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="capitalize bg-sunset-cream/40 text-[#7A3A0E]">{ad.format}</Badge>
          <Badge variant="outline" className="capitalize">{ad.status}</Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
            <Clock className="h-3 w-3" />
            Running {ad.daysRunning} days
          </span>
        </div>
        <DialogTitle className="text-lg leading-tight">{ad.headline}</DialogTitle>
        <DialogDescription className="flex items-center gap-2">
          <span className="font-medium text-foreground">{ad.advertiser}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            {ad.platform === "facebook" && <><Facebook className="h-3 w-3" /> Facebook</>}
            {ad.platform === "instagram" && <><Instagram className="h-3 w-3" /> Instagram</>}
            {ad.platform === "both" && <><Facebook className="h-3 w-3" /><Instagram className="h-3 w-3" /> Both</>}
          </span>
        </DialogDescription>
      </DialogHeader>

      <ScrollArea className="flex-1 -mx-6 px-6">
        <div className="grid md:grid-cols-2 gap-5 pb-4">
          {/* Ad preview */}
          <div>
            <div
              className="relative aspect-[4/5] rounded-xl overflow-hidden mb-3"
              style={{ background: `linear-gradient(135deg, ${ad.thumbnailColor}, ${ad.thumbnailColor}aa)` }}
            >
              {ad.imagePath && (
                <img src={ad.imagePath} alt={ad.headline} className="absolute inset-0 w-full h-full object-cover" />
              )}
              {!ad.imagePath && (
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: "radial-gradient(circle at 20% 30%, white 1.5px, transparent 1.5px), radial-gradient(circle at 70% 60%, white 1.5px, transparent 1.5px)",
                  backgroundSize: "30px 30px",
                }} />
              )}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-md px-2 py-1 text-[10px] font-semibold text-white">
                  <FIcon className="h-3 w-3" /> <span className="capitalize">{ad.format}</span>
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 pt-12 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white font-bold text-lg leading-tight mb-2">{ad.headline}</p>
                <button className="bg-white text-black text-sm font-bold px-4 py-2 rounded-lg">{ad.cta}</button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-muted/50 p-2">
                <p className="text-xs font-bold">{ad.likes?.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">Likes</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-2">
                <p className="text-xs font-bold">{ad.daysRunning}d</p>
                <p className="text-[10px] text-muted-foreground">Running</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-2">
                <p className="text-xs font-bold capitalize">{ad.cta}</p>
                <p className="text-[10px] text-muted-foreground">CTA</p>
              </div>
            </div>
          </div>

          {/* Details + notes */}
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Ad Copy</p>
              <p className="text-sm leading-relaxed bg-muted/40 rounded-lg p-3">{ad.adCopy}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {ad.tags.map((t) => (
                  <Badge key={t} variant="secondary" className="capitalize bg-sunset-cream/40 text-[#7A3A0E]">
                    <Tag className="h-3 w-3 mr-1" />
                    {t}
                  </Badge>
                ))}
                <button className="flex items-center gap-1 text-xs border border-dashed border-border rounded-md px-2 py-0.5 text-muted-foreground hover:border-sunset-orange/40 hover:text-foreground">
                  <Plus className="h-3 w-3" /> Add tag
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                  <StickyNote className="h-3 w-3" /> My Notes
                </p>
                <span className="text-[10px] text-muted-foreground">{note.length}/500</span>
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 500))}
                placeholder="Add your analysis... What makes this ad work? What would you test?"
                className="w-full min-h-[80px] text-sm rounded-lg border border-border/60 bg-background p-3 resize-none focus:outline-none focus:ring-2 focus:ring-sunset-orange/40"
              />
              <Button size="sm" className="mt-2 bg-sunset-gradient hover:opacity-90 text-white h-7 text-xs" onClick={() => sonnerToast.success("Note saved")}>
                Save note
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-border/60 p-2.5">
                <p className="text-muted-foreground">First seen</p>
                <p className="font-medium">{new Date(ad.firstSeen).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
              </div>
              <div className="rounded-lg border border-border/60 p-2.5">
                <p className="text-muted-foreground">Last seen</p>
                <p className="font-medium">{new Date(ad.lastSeen).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={() => { setIsFavorite(!isFavorite); sonnerToast.success(isFavorite ? "Removed from favorites" : "Added to favorites"); }}
        >
          <Heart className={cn("h-4 w-4 mr-1.5", isFavorite && "fill-red-500 text-red-500")} />
          {isFavorite ? "Favorited" : "Favorite"}
        </Button>
        <Button variant="outline" size="sm" onClick={() => sonnerToast.success("Share link copied")}>
          <Share2 className="h-4 w-4 mr-1.5" />
          Share
        </Button>
        <Button variant="outline" size="sm" onClick={() => sonnerToast.success("Moved to folder")} >
          <FolderHeart className="h-4 w-4 mr-1.5" />
          Move
        </Button>
        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 ml-auto" onClick={() => sonnerToast.info("Ad removed from collection")}>
          <Trash2 className="h-4 w-4 mr-1.5" />
          Delete
        </Button>
      </div>
    </DialogContent>
  );
}

/* ---------------- Bulk Tag Editor Dialog ---------------- */

function BulkTagDialog({
  open, onOpenChange, count, onConfirm,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  count: number;
  onConfirm: (tags: string[]) => void;
}) {
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const suggestedTags = ["winter", "sale", "launch", "evergreen", "high-cta", "video", "carousel", "winner", "test"];

  const addTag = (t: string) => {
    const trimmed = t.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) setTags([...tags, trimmed]);
    setTagInput("");
  };

  const reset = () => { setTags([]); setTagInput(""); };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Tag className="h-5 w-5 text-sunset-deep" /> Add Tags to {count} Ads</DialogTitle>
          <DialogDescription>Tags help you organize and filter your saved ads. Add one or more tags to apply to all selected ads.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {/* Current tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-muted/40 min-h-[40px]">
              {tags.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 text-xs bg-sunset-gradient text-white px-2 py-0.5 rounded-full">
                  {t}
                  <button onClick={() => setTags(tags.filter((x) => x !== t))} className="hover:bg-white/20 rounded-full">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          {/* Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Type a tag and press Enter…"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(tagInput); } }}
              className="flex-1"
            />
            <Button size="sm" variant="outline" onClick={() => addTag(tagInput)} disabled={!tagInput.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {/* Suggestions */}
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5">Suggested</p>
            <div className="flex flex-wrap gap-1.5">
              {suggestedTags.filter((s) => !tags.includes(s)).map((s) => (
                <button
                  key={s}
                  onClick={() => addTag(s)}
                  className="text-xs px-2 py-1 rounded-full border border-border/60 hover:border-sunset-orange/40 hover:bg-sunset-cream/30 transition-all"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" className="bg-sunset-gradient hover:opacity-90 text-white" disabled={tags.length === 0} onClick={() => { onConfirm(tags); reset(); }}>
            <Tag className="h-3.5 w-3.5 mr-1.5" />
            Apply {tags.length} tag{tags.length !== 1 ? "s" : ""} to {count} ads
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Bulk Move to Folder Dialog ---------------- */

function BulkMoveDialog({
  open, onOpenChange, count, onConfirm,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  count: number;
  onConfirm: (folderId: string, folderName: string) => void;
}) {
  const [selectedFolder, setSelectedFolder] = useState<string>("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><FolderHeart className="h-5 w-5 text-sunset-deep" /> Move {count} Ads</DialogTitle>
          <DialogDescription>Choose a destination folder. The selected ads will be moved there.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {mockFolders.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFolder(f.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                selectedFolder === f.id
                  ? "border-sunset-orange bg-sunset-cream/30"
                  : "border-border/60 hover:border-sunset-orange/40 hover:bg-muted/40"
              )}
            >
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${f.color}22` }}>
                <FolderHeart className="h-4 w-4" style={{ color: f.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{f.name}</p>
                <p className="text-xs text-muted-foreground">{f.adCount} ads · created {new Date(f.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
              </div>
              {selectedFolder === f.id && (
                <div className="h-5 w-5 rounded-full bg-sunset-gradient flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
            </button>
          ))}
          <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-dashed border-border text-muted-foreground hover:border-sunset-orange/40 hover:bg-muted/40 transition-all text-left">
            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
              <FolderPlus className="h-4 w-4" />
            </div>
            <span className="text-sm">Create new folder…</span>
          </button>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" className="bg-sunset-gradient hover:opacity-90 text-white" disabled={!selectedFolder} onClick={() => { const f = mockFolders.find((x) => x.id === selectedFolder); onConfirm(f?.id || "", f?.name || ""); }}>
            <FolderHeart className="h-3.5 w-3.5 mr-1.5" />
            Move {count} ads
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
