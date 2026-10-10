"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FolderHeart,
  FolderPlus,
  Share2,
  ArrowUpRight,
  Plus,
  LayoutGrid,
  Clock,
  Sparkles,
  Trophy,
  Heart,
  Bookmark,
  Layers,
  Users,
  Wand2,
} from "lucide-react";
import { mockAds, mockFolders, type SavedAd } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { sonnerToast } from "@/lib/toast-helpers";

/* ---------- types ---------- */

interface FeaturedBoard {
  id: string;
  name: string;
  description: string;
  adCount: number;
  updatedAgo: string;
  headerStyle: string;
  accent: string;
  icon: React.ElementType;
  swatchOffset: number;
}

/* ---------- curated featured boards ---------- */

const featuredBoards: FeaturedBoard[] = [
  {
    id: "fb-1",
    name: "Best CTAs",
    description: "Highest-converting call-to-action patterns",
    adCount: 14,
    updatedAgo: "2 days ago",
    headerStyle: "linear-gradient(135deg, #EA6113 0%, #F88F22 100%)",
    accent: "#EA6113",
    icon: Wand2,
    swatchOffset: 0,
  },
  {
    id: "fb-2",
    name: "High-Converting Video Ads",
    description: "Top-performing video creatives this quarter",
    adCount: 22,
    updatedAgo: "5 hours ago",
    headerStyle: "linear-gradient(135deg, #F88F22 0%, #FBB931 100%)",
    accent: "#F88F22",
    icon: Sparkles,
    swatchOffset: 4,
  },
  {
    id: "fb-3",
    name: "Eid Campaign Winners",
    description: "Standout seasonal festive creatives",
    adCount: 9,
    updatedAgo: "1 week ago",
    headerStyle: "linear-gradient(135deg, #B84A0E 0%, #EA6113 100%)",
    accent: "#B84A0E",
    icon: Trophy,
    swatchOffset: 8,
  },
  {
    id: "fb-4",
    name: "Long-Running Winners",
    description: "Ads still scaling after 60+ days",
    adCount: 18,
    updatedAgo: "3 days ago",
    headerStyle: "linear-gradient(135deg, #FBB931 0%, #F88F22 100%)",
    accent: "#FBB931",
    icon: Clock,
    swatchOffset: 12,
  },
];

/* ---------- mini stat ---------- */

function MiniStat({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 shadow-sm">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-lg text-white shadow-sm"
        style={{ backgroundColor: accent }}
      >
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="text-lg font-bold leading-tight">{value}</p>
      </div>
    </div>
  );
}

/* ---------- featured ad card (inline, simplified) ---------- */

function FeaturedAdCard({
  ad,
  onSave,
}: {
  ad: SavedAd;
  onSave: (advertiser: string) => void;
}) {
  return (
    <Card className="group relative w-72 shrink-0 gap-0 overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sunset-orange/15">
      {/* Thumbnail */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${ad.thumbnailColor} 0%, ${ad.thumbnailColor}cc 55%, ${ad.thumbnailColor}88 100%)`,
        }}
      >
        {/* decorative dots */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        {/* format badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="rounded-full bg-black/35 px-2 py-0.5 text-[10px] font-semibold uppercase text-white backdrop-blur-md">
            {ad.format}
          </span>
        </div>
        {/* longevity */}
        <div className="absolute top-2.5 right-2.5">
          <span className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
            <Clock className="h-3 w-3" />
            {ad.daysRunning}d
          </span>
        </div>
        {/* headline overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 pt-8">
          <p className="line-clamp-2 text-sm font-bold text-white drop-shadow">
            {ad.headline}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-2 p-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 border-2 border-white shadow-sm">
            <AvatarFallback
              className="text-[9px] font-bold text-white"
              style={{ backgroundColor: ad.thumbnailColor }}
            >
              {ad.advertiserAvatar}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">{ad.advertiser}</p>
            <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Heart className="h-2.5 w-2.5" />
              {ad.likes?.toLocaleString()} likes
            </p>
          </div>
          <Badge
            variant="secondary"
            className="bg-sunset-cream/40 text-[9px] text-[#7A3A0E]"
          >
            {ad.cta}
          </Badge>
        </div>

        {/* Save to board button — appears on hover */}
        <Button
          size="sm"
          className="w-full bg-sunset-gradient opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          onClick={() => onSave(ad.advertiser)}
        >
          <Bookmark className="h-3.5 w-3.5" />
          Save to board
        </Button>
      </div>
    </Card>
  );
}

/* ---------- board card ---------- */

function BoardCard({
  board,
  onShare,
  onOpen,
}: {
  board: FeaturedBoard;
  onShare: (name: string) => void;
  onOpen: (name: string) => void;
}) {
  const Icon = board.icon;
  const swatches = mockAds.slice(board.swatchOffset, board.swatchOffset + 4);

  return (
    <Card className="group gap-0 overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sunset-orange/10">
      {/* Gradient header strip */}
      <div
        className="relative h-24 overflow-hidden px-4 py-3"
        style={{ background: board.headerStyle }}
      >
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 20%, white 1px, transparent 1px), radial-gradient(circle at 20% 80%, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              <Icon className="h-4 w-4 text-white" />
            </span>
            <Badge className="border-none bg-white/25 text-[10px] font-semibold text-white backdrop-blur-sm">
              Featured
            </Badge>
          </div>
          <span className="rounded-full bg-black/25 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
            {board.adCount} ads
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-3 p-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold leading-tight">{board.name}</h3>
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {board.description}
          </p>
          <p className="flex items-center gap-1 pt-0.5 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            Updated {board.updatedAgo}
          </p>
        </div>

        {/* 2x2 swatch grid */}
        <div className="grid grid-cols-2 gap-1.5">
          {swatches.map((ad) => (
            <div
              key={ad.id}
              className="group/swatch relative aspect-square overflow-hidden rounded-md ring-1 ring-black/5"
              style={{
                background: `linear-gradient(135deg, ${ad.thumbnailColor} 0%, ${ad.thumbnailColor}cc 100%)`,
              }}
            >
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 30%, white 1px, transparent 1px)",
                  backgroundSize: "12px 12px",
                }}
              />
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="h-8 flex-1 gap-1.5"
            onClick={() => onShare(board.name)}
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
          <Button
            size="sm"
            className="h-8 flex-1 gap-1.5 text-white"
            style={{ background: board.headerStyle }}
            onClick={() => onOpen(board.name)}
          >
            Open
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

/* ---------- main view ---------- */

export function SwipeFileView() {
  const [createOpen, setCreateOpen] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [myBoards, setMyBoards] = useState(mockFolders.slice(0, 3));

  const featuredAds = [...mockAds]
    .sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
    .slice(0, 6);

  function handleCreateBoard() {
    const name = boardName.trim();
    if (!name) {
      sonnerToast.error("Please enter a board name");
      return;
    }
    setMyBoards((prev) => [
      {
        id: `nb-${Date.now()}`,
        name,
        color: "#F88F22",
        adCount: 0,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    sonnerToast.success(`Board "${name}" created!`);
    setBoardName("");
    setCreateOpen(false);
  }

  function handleShareBoard(name: string) {
    sonnerToast.success("Shareable link copied!");
  }

  function handleOpenBoard(name: string) {
    sonnerToast.info(`Opening "${name}" board…`);
  }

  function handleSaveToBoard(advertiser: string) {
    sonnerToast.success(`Saved "${advertiser}" ad to your board!`);
  }

  function handleNewBoardFromEmpty() {
    setCreateOpen(true);
  }

  return (
    <div className="bg-sunset-radial min-h-screen space-y-8 p-6 lg:p-8">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="bg-sunset-gradient flex h-12 w-12 items-center justify-center rounded-2xl shadow-md shadow-sunset-orange/30">
            <FolderHeart className="h-6 w-6 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
              <span className="text-sunset-gradient">Swipe File</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Curated inspiration boards from your best saved ads
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Badge
                variant="secondary"
                className="bg-sunset-cream/40 text-[#7A3A0E]"
              >
                <Sparkles className="h-3 w-3" />
                Agency / Pro feature
              </Badge>
            </div>
          </div>
        </div>
        <Button
          className="bg-sunset-gradient shrink-0 text-white shadow-md shadow-sunset-orange/30 hover:opacity-90"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Create Board
        </Button>
      </header>

      {/* Stats strip */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MiniStat
          label="Total boards"
          value={8}
          icon={Layers}
          accent="#EA6113"
        />
        <MiniStat
          label="Shared boards"
          value={3}
          icon={Share2}
          accent="#F88F22"
        />
        <MiniStat
          label="Ads in boards"
          value={47}
          icon={LayoutGrid}
          accent="#FBB931"
        />
      </section>

      {/* Featured boards row */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-sunset-orange" />
            <h2 className="text-lg font-bold">Featured Boards</h2>
          </div>
          <Badge variant="outline" className="gap-1 text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            Curated by AdSpy
          </Badge>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredBoards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              onShare={handleShareBoard}
              onOpen={handleOpenBoard}
            />
          ))}
        </div>
      </section>

      {/* Featured Ads horizontal scroll */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-sunset-orange" />
            <h2 className="text-lg font-bold">Featured Ads</h2>
            <Badge variant="secondary" className="bg-sunset-cream/40 text-[#7A3A0E]">
              Top performers
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            Hover a card to save →
          </span>
        </div>
        <div className="overflow-x-auto no-scrollbar -mx-1 px-1 pb-2">
          <div className="flex gap-4">
            {featuredAds.map((ad) => (
              <FeaturedAdCard
                key={ad.id}
                ad={ad}
                onSave={handleSaveToBoard}
              />
            ))}
          </div>
        </div>
      </section>

      {/* My Boards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderHeart className="h-5 w-5 text-sunset-orange" />
            <h2 className="text-lg font-bold">My Boards</h2>
            <Badge variant="outline" className="text-muted-foreground">
              {myBoards.length} boards
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            New Board
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {myBoards.map((board) => {
            const swatches = mockAds.slice(0, 4);
            return (
              <Card
                key={board.id}
                className="group gap-0 overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className="relative h-16 overflow-hidden px-4 py-2"
                  style={{
                    background: `linear-gradient(135deg, ${board.color} 0%, ${board.color}cc 100%)`,
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <div className="relative flex h-full items-center justify-between">
                    <span className="text-sm font-bold text-white drop-shadow">
                      {board.name}
                    </span>
                    <span className="rounded-full bg-black/25 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                      {board.adCount} ads
                    </span>
                  </div>
                </div>
                <div className="space-y-3 p-4">
                  <div className="grid grid-cols-4 gap-1.5">
                    {swatches.map((ad) => (
                      <div
                        key={ad.id}
                        className="aspect-square overflow-hidden rounded ring-1 ring-black/5"
                        style={{
                          background: `linear-gradient(135deg, ${ad.thumbnailColor} 0%, ${ad.thumbnailColor}cc 100%)`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 flex-1 gap-1.5"
                      onClick={() => handleShareBoard(board.name)}
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      Share
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 flex-1 gap-1.5 bg-sunset-gradient text-white"
                      onClick={() => handleOpenBoard(board.name)}
                    >
                      Open
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}

          {/* Empty-state CTA card */}
          <button
            type="button"
            onClick={handleNewBoardFromEmpty}
            className="group flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-sunset-orange/40 bg-sunset-cream/20 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-sunset-orange hover:bg-sunset-cream/40 hover:shadow-lg"
          >
            <div className="bg-sunset-gradient flex h-12 w-12 items-center justify-center rounded-2xl shadow-md transition-transform group-hover:scale-110">
              <FolderPlus className="h-6 w-6 text-white" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold">Create your first board</p>
              <p className="text-xs text-muted-foreground">
                Group your best ads into shareable inspiration boards
              </p>
            </div>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-sunset-cream/60 px-3 py-1 text-[11px] font-semibold text-[#7A3A0E]">
              <Plus className="h-3 w-3" />
              New Board
            </span>
          </button>
        </div>
      </section>

      {/* Create Board Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="bg-sunset-gradient mb-2 flex h-11 w-11 items-center justify-center rounded-xl shadow-md">
              <FolderPlus className="h-5 w-5 text-white" />
            </div>
            <DialogTitle>Create a new board</DialogTitle>
            <DialogDescription>
              Give your inspiration board a name. You can add ads to it from any
              saved ad card.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label
              htmlFor="board-name"
              className="text-xs font-medium text-muted-foreground"
            >
              Board name
            </label>
            <Input
              id="board-name"
              placeholder="e.g. Q4 Holiday Winners"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateBoard();
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setBoardName("");
                setCreateOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-sunset-gradient text-white"
              onClick={handleCreateBoard}
            >
              <Plus className="h-4 w-4" />
              Create board
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
