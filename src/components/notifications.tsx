"use client";

import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bell, Bookmark, TrendingUp, TrendingDown, FolderPlus, StickyNote,
  Download, Eye, AlertTriangle, CheckCircle2, X, Settings2, type LucideIcon,
} from "lucide-react";
import { sonnerToast } from "@/lib/toast-helpers";

interface NotifItem {
  id: string;
  type: "new-ads" | "competitor" | "saved" | "alert" | "system" | "digest";
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  icon: LucideIcon;
  color: string;
}

const notifs: NotifItem[] = [
  { id: "n1", type: "new-ads", title: "Sapphire launched 12 new ads", desc: "3 video ads, 7 image, 2 carousel — fashion category", time: "2h ago", unread: true, icon: TrendingUp, color: "#EA6113" },
  { id: "n2", type: "competitor", title: "Daraz PK is running 134 active ads", desc: "+28 vs last week. Biggest jump in e-commerce tracking", time: "5h ago", unread: true, icon: TrendingUp, color: "#F88F22" },
  { id: "n3", type: "alert", title: "Khaadi ad copy changed", desc: "\"Winter Collection 2024\" ad — headline was modified", time: "8h ago", unread: true, icon: AlertTriangle, color: "#FBB931" },
  { id: "n4", type: "system", title: "Meta Ad Library layout updated", desc: "Our team auto-updated DOM selectors. v2.4.1 patch live.", time: "1d ago", unread: false, icon: CheckCircle2, color: "#10b981" },
  { id: "n5", type: "competitor", title: "JazzCash paused 8 ads", desc: "Tracking trend downward — possible budget cut", time: "1d ago", unread: false, icon: TrendingDown, color: "#B84A0E" },
  { id: "n6", type: "digest", title: "Weekly digest ready", desc: "6 competitors · 54 new ads · top performer: Daraz PK", time: "2d ago", unread: false, icon: Eye, color: "#FF9F45" },
  { id: "n7", type: "saved", title: "5 ads saved from Foodpanda", desc: "Added to \"Food & Delivery\" folder", time: "3d ago", unread: false, icon: Bookmark, color: "#7A3A0E" },
];

export function NotificationsPanel() {
  const { notifOpen, setNotifOpen, setView } = useAppStore();
  if (!notifOpen) return null;

  const unreadCount = notifs.filter((n) => n.unread).length;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
      <div className="absolute right-0 top-full mt-2 w-[min(92vw,380px)] z-50 rounded-2xl bg-card border border-border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-sunset-radial">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-sunset-gradient flex items-center justify-center">
              <Bell className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">Notifications</p>
              <p className="text-[10px] text-muted-foreground">{unreadCount} unread · {notifs.length} total</p>
            </div>
          </div>
          <button
            onClick={() => setNotifOpen(false)}
            className="h-7 w-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* filter tabs */}
        <div className="flex items-center gap-1 px-3 py-2 border-b border-border bg-muted/30">
          {["All", "New Ads", "Alerts", "System"].map((t, i) => (
            <button
              key={t}
              className={cn(
                "text-[11px] font-medium px-2 py-1 rounded-md transition-colors",
                i === 0 ? "bg-sunset-gradient text-white" : "text-muted-foreground hover:bg-muted"
              )}
            >
              {t}
            </button>
          ))}
          <button className="ml-auto text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1">
            <Settings2 className="h-3 w-3" />
            Settings
          </button>
        </div>

        {/* list */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-border/40">
          {notifs.map((n) => (
            <button
              key={n.id}
              onClick={() => { setNotifOpen(false); setView(n.type === "new-ads" || n.type === "competitor" ? "competitors" : "dashboard"); sonnerToast.info(`Opening: ${n.title}`); }}
              className={cn(
                "w-full flex items-start gap-3 p-3 text-left hover:bg-muted/40 transition-colors relative",
                n.unread && "bg-sunset-cream/10"
              )}
            >
              {n.unread && <span className="absolute left-1 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-sunset-deep" />}
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${n.color}22` }}
              >
                <n.icon className="h-4 w-4" style={{ color: n.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold leading-snug">{n.title}</p>
                  <span className="text-[10px] text-muted-foreground shrink-0">{n.time}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug line-clamp-2">{n.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* footer */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-border bg-muted/30">
          <Button variant="ghost" size="sm" className="h-8 text-xs flex-1" onClick={() => { sonnerToast.success("All marked as read"); setNotifOpen(false); }}>
            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
            Mark all read
          </Button>
          <Button size="sm" className="h-8 text-xs bg-sunset-gradient hover:opacity-90 text-white" onClick={() => { setNotifOpen(false); setView("settings"); }}>
            <Settings2 className="h-3.5 w-3.5 mr-1.5" />
            Manage
          </Button>
        </div>
      </div>
    </>
  );
}
