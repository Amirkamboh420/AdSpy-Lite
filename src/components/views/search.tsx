"use client";

import { useState, useMemo, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { mockAds, mockCompetitors, mockFolders, type SavedAd } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdCard } from "@/components/shared";
import {
  Search, X, Filter, Bookmark, Users, FolderHeart, ArrowRight,
  TrendingUp, Clock, Sparkles, SearchX, ChevronDown, Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

type SearchResultType = "ad" | "competitor" | "folder";

interface SearchHit {
  type: SearchResultType;
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  color: string;
  icon: React.ElementType;
  data: SavedAd | undefined;
}

export function SearchView() {
  const { searchQuery, setSearchQuery, setView, recentSearches, addRecentSearch, clearRecentSearches } = useAppStore();
  const [query, setQuery] = useState(searchQuery);
  const [typeFilter, setTypeFilter] = useState<SearchResultType | "all">("all");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Sync local query with store on mount
  useEffect(() => {
    setQuery(searchQuery);
    setDebouncedQuery(searchQuery);
  }, [searchQuery]);

  // Debounce the actual search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  // Sync to store + record recent search when query is non-empty (debounced)
  useEffect(() => {
    setSearchQuery(query);
    if (debouncedQuery.trim().length >= 2) {
      addRecentSearch(debouncedQuery.trim());
    }
  }, [query, setSearchQuery, debouncedQuery, addRecentSearch]);

  const results = useMemo<SearchHit[]>(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return [];
    const hits: SearchHit[] = [];

    // Ads
    if (typeFilter === "all" || typeFilter === "ad") {
      mockAds.forEach((a) => {
        if (
          a.advertiser.toLowerCase().includes(q) ||
          a.headline.toLowerCase().includes(q) ||
          a.adCopy.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)) ||
          a.cta.toLowerCase().includes(q)
        ) {
          hits.push({
            type: "ad",
            id: a.id,
            title: a.headline,
            subtitle: a.advertiser,
            meta: `${a.daysRunning}d running · ${a.format} · ${a.cta}`,
            color: a.thumbnailColor,
            icon: Bookmark,
            data: a,
          });
        }
      });
    }

    // Competitors
    if (typeFilter === "all" || typeFilter === "competitor") {
      mockCompetitors.forEach((c) => {
        if (
          c.name.toLowerCase().includes(q) ||
          c.handle.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
        ) {
          hits.push({
            type: "competitor",
            id: c.id,
            title: c.name,
            subtitle: c.handle,
            meta: `${c.category} · ${c.activeAds} active ads · +${c.newAdsThisWeek} new`,
            color: c.avatarColor,
            icon: Users,
            data: undefined,
          });
        }
      });
    }

    // Folders
    if (typeFilter === "all" || typeFilter === "folder") {
      mockFolders.forEach((f) => {
        if (f.name.toLowerCase().includes(q)) {
          hits.push({
            type: "folder",
            id: f.id,
            title: f.name,
            subtitle: `${f.adCount} ads`,
            meta: `Created ${new Date(f.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
            color: f.color,
            icon: FolderHeart,
            data: undefined,
          });
        }
      });
    }

    return hits;
  }, [debouncedQuery, typeFilter]);

  const adResults = results.filter((r) => r.type === "ad");
  const competitorResults = results.filter((r) => r.type === "competitor");
  const folderResults = results.filter((r) => r.type === "folder");

  // Suggested searches when empty
  const suggestions = [
    "khaadi", "sale", "video", "shop now", "fashion", "foodpanda", "carousel",
  ];

  const handleHitClick = (hit: SearchHit) => {
    if (hit.type === "ad") setView("saved-ads");
    else if (hit.type === "competitor") setView("competitors");
    else setView("saved-ads");
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Search className="h-6 w-6 text-sunset-deep" />
          Search
        </h1>
        <p className="text-sm text-muted-foreground">Find ads, competitors, and folders across your entire collection</p>
      </div>

      {/* Search input */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            autoFocus
            placeholder="Search by advertiser, headline, copy, tag, CTA, category…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 pr-24 h-11 text-base bg-muted/40 border-border/40 focus:bg-background"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter + result count */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="h-3.5 w-3.5 mr-1.5" />
                {typeFilter === "all" ? "All types" : typeFilter + "s"}
                <ChevronDown className="h-3.5 w-3.5 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel className="text-xs">Filter by type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={typeFilter === "all"} onCheckedChange={() => setTypeFilter("all")}>All types</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={typeFilter === "ad"} onCheckedChange={() => setTypeFilter("ad")}>Saved Ads</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={typeFilter === "competitor"} onCheckedChange={() => setTypeFilter("competitor")}>Competitors</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={typeFilter === "folder"} onCheckedChange={() => setTypeFilter("folder")}>Folders</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {debouncedQuery && (
            <span className="text-xs text-muted-foreground">
              {results.length} result{results.length !== 1 ? "s" : ""} for <span className="font-semibold text-foreground">"{debouncedQuery}"</span>
              {results.length > 0 && (
                <span className="ml-2 text-muted-foreground/70">
                  · {adResults.length} ads, {competitorResults.length} competitors, {folderResults.length} folders
                </span>
              )}
            </span>
          )}
        </div>

        {/* Suggestions when empty */}
        {!debouncedQuery && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-sunset-orange" />
              Try searching for
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="text-xs px-2.5 py-1 rounded-full border border-border/60 hover:border-sunset-orange/40 hover:bg-sunset-cream/30 transition-all capitalize"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-sunset-deep" />
                    Recent searches
                  </p>
                  <button
                    onClick={clearRecentSearches}
                    className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(s)}
                      className="text-xs px-2.5 py-1 rounded-full bg-muted/60 hover:bg-sunset-cream/40 transition-all flex items-center gap-1.5 group"
                    >
                      <Clock className="h-2.5 w-2.5 text-muted-foreground group-hover:text-sunset-deep" />
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Results */}
      {debouncedQuery && results.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="h-16 w-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
            <SearchX className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-1">No results for "{debouncedQuery}"</h3>
          <p className="text-sm text-muted-foreground mb-4">Try a different keyword or check your spelling.</p>
          <Button size="sm" variant="outline" onClick={() => setQuery("")}>Clear search</Button>
        </Card>
      ) : debouncedQuery ? (
        <div className="space-y-6">
          {/* Ads results as cards */}
          {adResults.length > 0 && (typeFilter === "all" || typeFilter === "ad") && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold flex items-center gap-2">
                  <Bookmark className="h-4 w-4 text-sunset-deep" />
                  Saved Ads
                  <Badge variant="secondary" className="text-[10px] h-5">{adResults.length}</Badge>
                </h2>
                <Button variant="ghost" size="sm" className="text-xs text-sunset-deep" onClick={() => setView("saved-ads")}>
                  View all <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {adResults.slice(0, 8).map((hit) => (
                  <AdCard key={hit.id} ad={hit.data!} onOpen={() => setView("saved-ads")} />
                ))}
              </div>
            </section>
          )}

          {/* Competitors results */}
          {competitorResults.length > 0 && (typeFilter === "all" || typeFilter === "competitor") && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4 text-sunset-deep" />
                  Competitors
                  <Badge variant="secondary" className="text-[10px] h-5">{competitorResults.length}</Badge>
                </h2>
                <Button variant="ghost" size="sm" className="text-xs text-sunset-deep" onClick={() => setView("competitors")}>
                  View all <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {competitorResults.map((hit) => (
                  <button
                    key={hit.id}
                    onClick={() => handleHitClick(hit)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border/60 hover:border-sunset-orange/40 hover:bg-muted/40 transition-all text-left group"
                  >
                    <div
                      className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm"
                      style={{ backgroundColor: hit.color }}
                    >
                      {hit.title.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate group-hover:text-sunset-deep transition-colors">{hit.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{hit.subtitle}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{hit.meta}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Folders results */}
          {folderResults.length > 0 && (typeFilter === "all" || typeFilter === "folder") && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold flex items-center gap-2">
                  <FolderHeart className="h-4 w-4 text-sunset-deep" />
                  Folders
                  <Badge variant="secondary" className="text-[10px] h-5">{folderResults.length}</Badge>
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {folderResults.map((hit) => (
                  <button
                    key={hit.id}
                    onClick={() => handleHitClick(hit)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border/60 hover:border-sunset-orange/40 hover:bg-muted/40 transition-all text-left"
                  >
                    <div
                      className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${hit.color}22` }}
                    >
                      <FolderHeart className="h-4 w-4" style={{ color: hit.color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">{hit.title}</p>
                      <p className="text-xs text-muted-foreground">{hit.subtitle} · {hit.meta}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      ) : null}
    </div>
  );
}
