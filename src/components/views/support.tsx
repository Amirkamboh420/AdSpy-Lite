"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  LifeBuoy,
  MessageSquare,
  Mail,
  FileText,
  ChevronDown,
  Send,
  Search,
  BookOpen,
  Video,
  ExternalLink,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { sonnerToast } from "@/lib/toast-helpers";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type SectionId = "help" | "tickets" | "contact" | "docs";

const sectionNav: {
  id: SectionId;
  label: string;
  icon: React.ElementType;
  desc: string;
}[] = [
  { id: "help", label: "Help Center", icon: HelpCircle, desc: "Articles & tutorials" },
  { id: "tickets", label: "Support Tickets", icon: LifeBuoy, desc: "Open & past tickets" },
  { id: "contact", label: "Contact Us", icon: MessageSquare, desc: "Reach the team" },
  { id: "docs", label: "Documentation", icon: BookOpen, desc: "API & extension guides" },
];

const helpCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    desc: "Install the extension, save your first ad, set up tracking.",
    articles: 12,
    icon: BookOpen,
  },
  {
    id: "saving-ads",
    title: "Saving & Organizing Ads",
    desc: "Folders, tags, bulk actions, exporting collections.",
    articles: 18,
    icon: FileText,
  },
  {
    id: "competitor-tracking",
    title: "Competitor Tracking",
    desc: "Track pages, monitor longevity, trend overlays.",
    articles: 9,
    icon: LifeBuoy,
  },
  {
    id: "billing-plans",
    title: "Billing & Plans",
    desc: "Plans, invoices, local payment methods, refunds.",
    articles: 7,
    icon: FileText,
  },
];

const popularArticles = [
  { title: "How to save ads from the Meta Ad Library", read: "4 min read", category: "Saving Ads" },
  { title: "Setting up competitor tracking for the first time", read: "6 min read", category: "Tracking" },
  { title: "Exporting your swipe file as CSV or PDF", read: "3 min read", category: "Export" },
  { title: "Understanding ad longevity & trend signals", read: "8 min read", category: "Analytics" },
  { title: "Switching plans and adding team seats", read: "5 min read", category: "Billing" },
];

const videoTutorials = [
  { title: "AdSpy Lite in 60 seconds", duration: "1:02", category: "Intro" },
  { title: "Building your first swipe file", duration: "4:28", category: "Workflow" },
  { title: "Competitor trend overlay, explained", duration: "6:15", category: "Analytics" },
];

type TicketStatus = "Open" | "In Progress" | "Resolved" | "Urgent";
type TicketPriority = "Low" | "Medium" | "High" | "Urgent";
type TicketCategory = "Bug" | "Feature Request" | "Billing Question" | "How-To" | "Other";

interface Ticket {
  id: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  updated: string;
}

const tickets: Ticket[] = [
  { id: "TKT-482", subject: "Extension not detecting carousel ads", status: "Open", priority: "High", category: "Bug", updated: "2h ago" },
  { id: "TKT-479", subject: "Request: bulk export to Notion", status: "In Progress", priority: "Medium", category: "Feature Request", updated: "1d ago" },
  { id: "TKT-471", subject: "JazzCash payment failed at checkout", status: "Urgent", priority: "Urgent", category: "Billing Question", updated: "3h ago" },
  { id: "TKT-465", subject: "How to organize ads by campaign?", status: "Resolved", priority: "Low", category: "How-To", updated: "5d ago" },
  { id: "TKT-458", subject: "Webhook delivery to my server delayed", status: "Resolved", priority: "Medium", category: "Bug", updated: "1w ago" },
];

const statusBadgeClass: Record<TicketStatus, string> = {
  Open: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  "In Progress": "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  Resolved: "bg-gray-100 text-gray-700 dark:bg-gray-800/60 dark:text-gray-300",
  Urgent: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
};

const priorityBadgeClass: Record<TicketPriority, string> = {
  Low: "bg-sunset-cream/40 text-[#7A3A0E]",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  High: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
  Urgent: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
};

const faqItems = [
  {
    q: "How do I install the Chrome extension?",
    a: "Open the Chrome Web Store listing from the Extension Guide section, click 'Add to Chrome', then sign in with your AdSpy Lite account. The extension icon will appear in your toolbar — pin it for easy access.",
  },
  {
    q: "How many ads can I save on the Free plan?",
    a: "Free users can save up to 20 ads and track 1 competitor. Upgrade to Pro for unlimited saved ads and 10 tracked competitors, or Agency for unlimited everything plus team seats.",
  },
  {
    q: "Why isn't the extension detecting ads on a page?",
    a: "Make sure you're on a supported Meta Ad Library page (facebook.com/ads/library or instagram.com). Refresh the page after installing. If ads still don't appear, check that you haven't blocked third-party scripts.",
  },
  {
    q: "Can I pay in PKR with local payment methods?",
    a: "Yes — we support JazzCash, EasyPaisa, and local bank transfers (HBL, Meezan). Go to Billing → Payment Methods → Connect wallet to set up local payments converted at live FX rates.",
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a 7-day money-back guarantee on first purchases of Pro and Agency plans. Contact our billing team via the Contact Us tab to start a refund request.",
  },
];

const docCategories = [
  { title: "API Reference", desc: "REST endpoints, auth, rate limits", articles: 24, icon: FileText },
  { title: "Extension Guide", desc: "Install, configure, permissions", articles: 11, icon: BookOpen },
  { title: "Webhooks", desc: "Events, payloads, retries, signing", articles: 8, icon: Send },
  { title: "Changelog", desc: "Version history & breaking changes", articles: 16, icon: AlertCircle },
];

const quickLinks = [
  { title: "Quick Start Guide", desc: "Get running in under 5 minutes", icon: BookOpen },
  { title: "Video Tutorials", desc: "Watch walkthroughs of every feature", icon: Video },
  { title: "Migration Guide", desc: "Migrating from v1 to v2", icon: FileText },
  { title: "FAQ", desc: "Common questions answered", icon: HelpCircle },
];

const contactMethods = [
  {
    title: "Email Support",
    detail: "support@adspy.lite",
    sub: "Avg response time: under 24 hours",
    icon: Mail,
    accent: "#EA6113",
  },
  {
    title: "Live Chat",
    detail: "Mon–Fri, 9am–6pm PKT",
    sub: "Real-time help from our team",
    icon: MessageSquare,
    accent: "#F88F22",
  },
  {
    title: "Community Forum",
    detail: "forum.adspy.lite",
    sub: "Discuss with 4,200+ marketers",
    icon: BookOpen,
    accent: "#FBB931",
  },
];

export function SupportView() {
  const [section, setSection] = useState<SectionId>("help");
  const role = useAppStore((s) => s.role);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-sunset-gradient flex items-center justify-center shrink-0 shadow-sm">
          <LifeBuoy className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Support &amp; Help</h1>
          <p className="text-sm text-muted-foreground">
            Get help, browse docs, or contact our team
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        {/* Left vertical section nav */}
        <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {sectionNav.map((item) => {
            const active = section === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-all whitespace-nowrap lg:whitespace-normal group",
                  active
                    ? "bg-sunset-gradient text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", active ? "text-white" : "text-sunset-deep")} />
                <div className="min-w-0">
                  <p className={cn("text-sm font-medium", active && "text-white")}>{item.label}</p>
                  <p
                    className={cn(
                      "text-[10px] leading-tight hidden lg:block",
                      active ? "text-white/80" : "text-muted-foreground/70"
                    )}
                  >
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Active section content */}
        <div className="min-w-0">
          {section === "help" && <HelpCenterSection />}
          {section === "tickets" && <TicketsSection />}
          {section === "contact" && <ContactSection />}
          {section === "docs" && <DocsSection />}
        </div>
      </div>

      {/* Role-aware footer note */}
      <Card className="p-4 bg-sunset-cream/30 border-sunset-amber/30">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-sunset-gradient flex items-center justify-center shrink-0">
            <HelpCircle className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">
              You&apos;re browsing as <span className="text-sunset-gradient font-bold capitalize">{role}</span> — plan-aware support
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Some features (analytics, team, API access) are gated by plan. Visit Billing to compare plans or reach out if you hit a limit.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ---------------- Help Center ---------------- */

function HelpCenterSection() {
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card className="p-5 bg-sunset-radial border-sunset-amber/30">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search help articles — e.g. 'export csv', 'tracking competitors'"
              className="pl-9 h-10 bg-background/70"
            />
          </div>
          <Button
            className="bg-sunset-gradient text-white hover:opacity-90 h-10"
            onClick={() => sonnerToast.info(query ? `Searching for "${query}"…` : "Type a query to search")}
          >
            <Search className="h-4 w-4 mr-1.5" />
            Search
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {["install extension", "export ads", "competitor tracking", "billing", "tags"].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="text-[11px] px-2 py-0.5 rounded-full bg-white/60 hover:bg-white text-muted-foreground hover:text-sunset-deep border border-sunset-amber/20 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </Card>

      {/* Category cards */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-4 w-4 text-sunset-deep" />
          <h2 className="font-semibold">Browse by Category</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {helpCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Card
                key={cat.id}
                className="p-5 hover:border-sunset-orange/40 hover:shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer group"
                onClick={() => sonnerToast.info(`Opening ${cat.title} category`)}
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-sunset-cream/60 flex items-center justify-center shrink-0 group-hover:bg-sunset-gradient transition-colors">
                    <Icon className="h-5 w-5 text-sunset-deep group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-sm">{cat.title}</h3>
                      <Badge variant="secondary" className="bg-sunset-cream/40 text-[#7A3A0E] text-[10px] h-5">
                        {cat.articles} articles
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{cat.desc}</p>
                    <button className="mt-2.5 inline-flex items-center gap-1 text-xs font-medium text-sunset-deep hover:gap-1.5 transition-all">
                      Browse articles
                      <ChevronDown className="h-3 w-3 -rotate-90" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Popular articles */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-sunset-deep" /> Popular Articles
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Most-read help articles this week
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="hidden sm:flex"
            onClick={() => sonnerToast.info("Showing all articles")}
          >
            View all
          </Button>
        </div>
        <div className="divide-y">
          {popularArticles.map((art, i) => (
            <button
              key={art.title}
              onClick={() => sonnerToast.info(`Opening article: ${art.title}`)}
              className="w-full flex items-center gap-3 py-3 text-left hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors"
            >
              <span className="h-7 w-7 rounded-md bg-sunset-cream/50 text-sunset-deep text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{art.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {art.read}
                  </span>
                </div>
              </div>
              <Badge variant="secondary" className="bg-sunset-cream/40 text-[#7A3A0E] text-[10px] hidden sm:flex">
                {art.category}
              </Badge>
              <ChevronDown className="h-4 w-4 text-muted-foreground -rotate-90 shrink-0" />
            </button>
          ))}
        </div>
      </Card>

      {/* Video tutorials */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold flex items-center gap-2">
              <Video className="h-4 w-4 text-sunset-deep" /> Video Tutorials
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Short walkthroughs to get you productive fast
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="hidden sm:flex"
            onClick={() => sonnerToast.info("Opening full video library")}
          >
            <Video className="h-3.5 w-3.5 mr-1.5" />
            All videos
          </Button>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {videoTutorials.map((v) => (
            <button
              key={v.title}
              onClick={() => sonnerToast.success(`Playing: ${v.title}`)}
              className="text-left group"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-sunset-gradient flex items-center justify-center shadow-sm">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 30% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <div className="relative h-12 w-12 rounded-full bg-white/95 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                  <ChevronDown className="h-5 w-5 text-sunset-deep -rotate-90 translate-x-0.5" />
                </div>
                <Badge className="absolute bottom-2 right-2 bg-black/60 text-white border-0 text-[10px] h-5">
                  {v.duration}
                </Badge>
                <Badge className="absolute top-2 left-2 bg-white/90 text-sunset-deep border-0 text-[10px] h-5">
                  {v.category}
                </Badge>
              </div>
              <p className="text-sm font-medium mt-2.5 group-hover:text-sunset-deep transition-colors">
                {v.title}
              </p>
            </button>
          ))}
        </div>
      </Card>

      {/* FAQ accordion */}
      <Card className="p-5">
        <div className="mb-2">
          <h2 className="font-semibold flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-sunset-deep" /> Frequently Asked Questions
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Quick answers to common questions
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  );
}

/* ---------------- Support Tickets ---------------- */

function TicketsSection() {
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "open" | "resolved">("all");

  const filtered = tickets.filter((t) => {
    if (filter === "open") return t.status === "Open" || t.status === "In Progress" || t.status === "Urgent";
    if (filter === "resolved") return t.status === "Resolved";
    return true;
  });

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="font-semibold flex items-center gap-2">
              <LifeBuoy className="h-4 w-4 text-sunset-deep" /> Your Tickets
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Track open issues and review past resolutions
            </p>
          </div>
          <Button
            className="bg-sunset-gradient text-white hover:opacity-90"
            onClick={() => setTicketDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New Ticket
          </Button>
        </div>

        {/* Filter tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mb-4">
          <TabsList>
            <TabsTrigger value="all">
              All <Badge variant="secondary" className="ml-1.5 h-4 text-[9px] px-1 bg-sunset-cream/40 text-[#7A3A0E]">{tickets.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="open">
              Open <Badge variant="secondary" className="ml-1.5 h-4 text-[9px] px-1 bg-green-100 text-green-700">{tickets.filter((t) => t.status !== "Resolved").length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="resolved">
              Resolved <Badge variant="secondary" className="ml-1.5 h-4 text-[9px] px-1 bg-gray-100 text-gray-700">{tickets.filter((t) => t.status === "Resolved").length}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Desktop table */}
        <div className="hidden md:block">
          <div className="grid grid-cols-[90px_1fr_110px_90px_120px_110px_70px] gap-3 px-3 pb-2 text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
            <span>Ticket</span>
            <span>Subject</span>
            <span>Status</span>
            <span>Priority</span>
            <span>Category</span>
            <span>Updated</span>
            <span className="text-right">Action</span>
          </div>
          <div className="divide-y">
            {filtered.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-[90px_1fr_110px_90px_120px_110px_70px] gap-3 px-3 py-3 items-center hover:bg-muted/30 rounded-lg transition-colors"
              >
                <span className="text-xs font-mono font-medium text-sunset-deep">{t.id}</span>
                <span className="text-sm truncate">{t.subject}</span>
                <div><Badge className={cn("text-[10px]", statusBadgeClass[t.status])}>{t.status}</Badge></div>
                <div><Badge className={cn("text-[10px]", priorityBadgeClass[t.priority])}>{t.priority}</Badge></div>
                <span className="text-xs text-muted-foreground">{t.category}</span>
                <span className="text-xs text-muted-foreground">{t.updated}</span>
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs text-sunset-deep hover:text-sunset-deep hover:bg-sunset-cream/40"
                    onClick={() => sonnerToast.info(`Opening ticket ${t.id}`)}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No tickets in this filter.
              </div>
            )}
          </div>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="rounded-xl border border-border/60 p-3 hover:border-sunset-orange/40 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-mono font-medium text-sunset-deep">{t.id}</span>
                <Badge className={cn("text-[10px]", statusBadgeClass[t.status])}>{t.status}</Badge>
              </div>
              <p className="text-sm font-medium mb-2">{t.subject}</p>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                <Badge className={cn("text-[10px]", priorityBadgeClass[t.priority])}>{t.priority}</Badge>
                <span>{t.category}</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{t.updated}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="ml-auto h-6 px-2 text-xs text-sunset-deep hover:text-sunset-deep hover:bg-sunset-cream/40"
                  onClick={() => sonnerToast.info(`Opening ticket ${t.id}`)}
                >
                  View
                </Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No tickets in this filter.
            </div>
          )}
        </div>
      </Card>

      {/* Support status banner */}
      <Card className="p-4 bg-sunset-cream/30 border-sunset-amber/30">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-green-100 dark:bg-green-950/40 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">All systems operational</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Average first-response time is 4h 12m over the last 7 days. Urgent tickets are prioritized within 1 hour.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="hidden sm:flex shrink-0"
            onClick={() => sonnerToast.info("Opening status page")}
          >
            Status page
            <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
          </Button>
        </div>
      </Card>

      <NewTicketDialog open={ticketDialogOpen} onOpenChange={setTicketDialogOpen} />
    </div>
  );
}

function NewTicketDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<TicketCategory | "">("");
  const [priority, setPriority] = useState<TicketPriority | "">("");
  const [description, setDescription] = useState("");

  const reset = () => {
    setSubject("");
    setCategory("");
    setPriority("");
    setDescription("");
  };

  const handleSubmit = () => {
    if (!subject.trim() || !category || !priority || !description.trim()) {
      sonnerToast.warning("Please fill in all fields");
      return;
    }
    sonnerToast.success("Ticket #482 created. We'll respond within 24h.");
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LifeBuoy className="h-4 w-4 text-sunset-deep" />
            Open a Support Ticket
          </DialogTitle>
          <DialogDescription>
            Tell us what&apos;s going on. Our team responds within 24 hours — sooner for urgent priorities.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ticket-subject" className="text-xs">Subject</Label>
            <Input
              id="ticket-subject"
              placeholder="Brief summary of your issue"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as TicketCategory)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bug">Bug</SelectItem>
                  <SelectItem value="Feature Request">Feature Request</SelectItem>
                  <SelectItem value="Billing Question">Billing Question</SelectItem>
                  <SelectItem value="How-To">How-To</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TicketPriority)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ticket-desc" className="text-xs">Description</Label>
            <Textarea
              id="ticket-desc"
              placeholder="Describe the issue in detail. Include steps to reproduce, expected vs actual behavior, and any error messages."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
            <p className="text-[10px] text-muted-foreground">
              Tip: attach screenshots in your follow-up email for faster triage.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            className="bg-sunset-gradient text-white hover:opacity-90"
            onClick={handleSubmit}
          >
            <Send className="h-3.5 w-3.5 mr-1.5" />
            Submit Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Contact Us ---------------- */

function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      sonnerToast.warning("Please complete all fields");
      return;
    }
    sonnerToast.success("Message sent! We'll get back to you soon.");
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="space-y-6">
      {/* Contact method cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {contactMethods.map((m) => {
          const Icon = m.icon;
          return (
            <Card
              key={m.title}
              className="p-5 hover:border-sunset-orange/40 hover:shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer"
              onClick={() => sonnerToast.info(`Opening ${m.title}`)}
            >
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0 mb-3"
                style={{ backgroundColor: `${m.accent}20` }}
              >
                <Icon className="h-5 w-5" style={{ color: m.accent }} />
              </div>
              <h3 className="font-semibold text-sm">{m.title}</h3>
              <p className="text-sm font-medium text-sunset-deep mt-0.5">{m.detail}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{m.sub}</p>
            </Card>
          );
        })}
      </div>

      {/* Contact form */}
      <Card className="p-5">
        <div className="mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Send className="h-4 w-4 text-sunset-deep" /> Send us a message
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            We typically reply within 24 hours. For urgent issues, open a ticket with Urgent priority.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="space-y-1.5">
            <Label htmlFor="contact-name" className="text-xs">Name</Label>
            <Input
              id="contact-name"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contact-email" className="text-xs">Email</Label>
            <Input
              id="contact-email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5 mb-4">
          <Label htmlFor="contact-subject" className="text-xs">Subject</Label>
          <Input
            id="contact-subject"
            placeholder="What's this about?"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="space-y-1.5 mb-4">
          <Label htmlFor="contact-message" className="text-xs">Message</Label>
          <Textarea
            id="contact-message"
            placeholder="Tell us how we can help…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            Or email us directly at <span className="font-medium text-sunset-deep">support@adspy.lite</span>
          </p>
          <Button
            className="bg-sunset-gradient text-white hover:opacity-90 w-full sm:w-auto"
            onClick={handleSend}
          >
            <Send className="h-3.5 w-3.5 mr-1.5" />
            Send Message
          </Button>
        </div>
      </Card>
    </div>
  );
}

/* ---------------- Documentation ---------------- */

function DocsSection() {
  return (
    <div className="space-y-6">
      {/* Doc category cards */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-4 w-4 text-sunset-deep" />
          <h2 className="font-semibold">Documentation</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {docCategories.map((d) => {
            const Icon = d.icon;
            return (
              <Card
                key={d.title}
                className="p-5 hover:border-sunset-orange/40 hover:shadow-sm hover:-translate-y-0.5 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-sunset-cream/60 flex items-center justify-center shrink-0 group-hover:bg-sunset-gradient transition-colors">
                    <Icon className="h-5 w-5 text-sunset-deep group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-sm">{d.title}</h3>
                      <Badge variant="secondary" className="bg-sunset-cream/40 text-[#7A3A0E] text-[10px] h-5">
                        {d.articles} entries
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{d.desc}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-3 group-hover:bg-sunset-cream/40 group-hover:text-sunset-deep group-hover:border-sunset-orange/40"
                  onClick={() => sonnerToast.info(`Opening ${d.title} docs`)}
                >
                  Open
                  <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick links */}
      <Card className="p-5">
        <div className="mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-sunset-deep" /> Quick Links
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Jump straight to the most useful docs
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {quickLinks.map((q) => {
            const Icon = q.icon;
            return (
              <button
                key={q.title}
                onClick={() => sonnerToast.info(`Opening: ${q.title}`)}
                className="flex items-center gap-3 p-3 rounded-xl border border-border/60 hover:border-sunset-orange/40 hover:bg-muted/30 transition-all text-left group"
              >
                <div className="h-9 w-9 rounded-lg bg-sunset-cream/50 flex items-center justify-center shrink-0 group-hover:bg-sunset-gradient transition-colors">
                  <Icon className="h-4 w-4 text-sunset-deep group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{q.title}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{q.desc}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground -rotate-90 shrink-0 group-hover:text-sunset-deep transition-colors" />
              </button>
            );
          })}
        </div>
      </Card>

      {/* Version info */}
      <Card className="p-5 bg-sunset-radial border-sunset-amber/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-sunset-gradient flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">AdSpy Lite Dashboard</h3>
                <Badge className="bg-sunset-gradient text-white text-[10px]">v2.5.0</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Last updated <span className="font-medium text-foreground">Jan 15, 2025</span> · Chrome extension v2.4.1
              </p>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                  Stable channel
                </span>
                <span className="inline-flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                  1 known issue
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="border-sunset-deep/40 text-sunset-deep hover:bg-sunset-deep hover:text-white shrink-0"
            onClick={() => sonnerToast.info("Opening full changelog")}
          >
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            View Changelog
          </Button>
        </div>
      </Card>
    </div>
  );
}
