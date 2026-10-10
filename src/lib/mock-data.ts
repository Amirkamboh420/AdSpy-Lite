// Mock data for AdSpy Lite dashboard
// All data is in-memory mock data for demonstration purposes

export type AdFormat = "image" | "video" | "carousel" | "collection";
export type AdPlatform = "facebook" | "instagram" | "both";
export type AdStatus = "active" | "paused" | "ended";
export type UserRole = "free" | "pro" | "agency" | "team" | "admin";

export interface SavedAd {
  id: string;
  advertiser: string;
  advertiserAvatar: string;
  adCopy: string;
  headline: string;
  cta: string;
  format: AdFormat;
  platform: AdPlatform;
  status: AdStatus;
  firstSeen: string; // ISO date
  lastSeen: string;
  daysRunning: number;
  folderId: string;
  tags: string[];
  thumbnailColor: string;
  imagePath?: string; // optional real ad thumbnail image (from /ads/*.png)
  notes?: string;
  likes?: number;
  isFavorite: boolean;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  adCount: number;
  createdAt: string;
}

export interface Competitor {
  id: string;
  name: string;
  handle: string;
  avatarColor: string;
  pageId: string;
  category: string;
  activeAds: number;
  totalSaved: number;
  lastChecked: string;
  status: "tracking" | "paused";
  trend: number[]; // ad count over time
  newAdsThisWeek: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  avatarColor: string;
  status: "active" | "invited" | "suspended";
  lastActive: string;
  workspace: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  plan: UserRole;
  status: "active" | "trial" | "suspended" | "churned";
  savedAds: number;
  competitors: number;
  joinedAt: string;
  mrr: number;
}

export const mockFolders: Folder[] = [
  { id: "f1", name: "Clothing Niche", color: "#EA6113", adCount: 24, createdAt: "2024-09-12" },
  { id: "f2", name: "Competitor A — Khaadi", color: "#F88F22", adCount: 18, createdAt: "2024-09-20" },
  { id: "f3", name: "E-commerce Drops", color: "#FBB931", adCount: 31, createdAt: "2024-10-01" },
  { id: "f4", name: "Beauty & Skincare", color: "#B84A0E", adCount: 12, createdAt: "2024-10-15" },
  { id: "f5", name: "Food & Delivery", color: "#FF9F45", adCount: 9, createdAt: "2024-11-02" },
  { id: "f6", name: "SaaS / Apps", color: "#7A3A0E", adCount: 7, createdAt: "2024-11-18" },
];

const thumbnailColors = [
  "#EA6113", "#F88F22", "#FBB931", "#FFE3B3", "#B84A0E", "#FF9F45",
];

const advertisers = [
  { name: "Khaadi", handle: "@khaadi", cat: "Fashion" },
  { name: "Sapphire", handle: "@sapphirepk", cat: "Fashion" },
  { name: "Gul Ahmed", handle: "@gulahmed", cat: "Fashion" },
  { name: "Daraz PK", handle: "@darazpk", cat: "E-commerce" },
  { name: "Foodpanda", handle: "@foodpanda", cat: "Food Delivery" },
  { name: "Careem", handle: "@careem", cat: "Ride Hailing" },
  { name: "JazzCash", handle: "@jazzcash", cat: "Fintech" },
  { name: "Sana Safinaz", handle: "@sanasafinaz", cat: "Fashion" },
  { name: "Nike Pakistan", handle: "@nikepk", cat: "Sports" },
  { name: "Connatural", handle: "@connatural", cat: "Skincare" },
  { name: "Bareeze", handle: "@bareeze", cat: "Fashion" },
  { name: "Tapal Danedar", handle: "@tapaltea", cat: "FMCG" },
];

const headlines = [
  "Mega Sale — Up to 70% Off",
  "New Winter Collection 2024",
  "Free Delivery on Your First Order",
  "Limited Time Offer — Shop Now",
  "Unbeatable Prices This Season",
  "Fresh Arrivals Every Week",
  "Buy 2 Get 1 Free Today",
  "Premium Quality at Affordable Prices",
  "Eid Special Collection Launched",
  "Flash Sale Ends Tonight",
  "Discover Your Perfect Style",
  "Cash on Delivery Available",
];

const adCopies = [
  "Transform your wardrobe with our latest seasonal collection. Handcrafted designs that blend tradition with modern aesthetics. Shop now and enjoy free delivery across Pakistan.",
  "Don't miss our biggest sale of the year! Get up to 70% off on premium fabrics. Limited stock available — hurry before your favorites are gone!",
  "Experience the future of online shopping. Fast delivery, easy returns, and unbeatable prices. Download our app today and get PKR 500 off your first order.",
  "Introducing our new skincare line, formulated with natural ingredients. Say goodbye to dull skin and hello to a radiant glow. Order now for exclusive launch pricing.",
  "Craving something delicious? Order from your favorite restaurants and get 50% off on your first 3 orders. Use code WELCOME50 at checkout.",
  "Book your ride in seconds. Safe, reliable, and affordable. New users get 3 free rides up to PKR 200 each. Download the app now.",
  "Send money, pay bills, and recharge your phone — all in one app. Zero fees on your first 10 transactions. Join 5M+ happy users today.",
  "Elevate your everyday look with our minimalist jewelry collection. Tarnish-free, hypoallergenic, and designed to last. Free shipping on orders above PKR 2000.",
];

const ctas = ["Shop Now", "Learn More", "Sign Up", "Download", "Order Now", "Get Offer", "Book Now", "Subscribe"];

const formats: AdFormat[] = ["image", "video", "carousel", "collection"];
const platforms: AdPlatform[] = ["facebook", "instagram", "both"];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

export const mockAds: SavedAd[] = Array.from({ length: 48 }, (_, i) => {
  const adv = pick(advertisers, i);
  const firstSeen = new Date(Date.now() - (5 + (i * 3) % 90) * 86400000);
  const daysRunning = Math.max(1, Math.floor((Date.now() - firstSeen.getTime()) / 86400000));
  const folderIdx = i % mockFolders.length;
  return {
    id: `ad-${i + 1}`,
    advertiser: adv.name,
    advertiserAvatar: adv.name.slice(0, 2).toUpperCase(),
    adCopy: pick(adCopies, i),
    headline: pick(headlines, i),
    cta: pick(ctas, i + 2),
    format: pick(formats, i),
    platform: pick(platforms, i),
    status: i % 7 === 0 ? "ended" : i % 5 === 0 ? "paused" : "active",
    firstSeen: firstSeen.toISOString(),
    lastSeen: new Date(Date.now() - (i % 10) * 86400000).toISOString(),
    daysRunning,
    folderId: mockFolders[folderIdx].id,
    tags: [adv.cat.toLowerCase().split(" ")[0], pick(["winter", "sale", "launch", "evergreen"], i)],
    thumbnailColor: thumbnailColors[i % thumbnailColors.length],
    imagePath: i < 9 ? `/ads/ad-${i + 1}.png` : undefined,
    notes: i % 3 === 0 ? "Strong CTA. Test similar headline structure for our Q4 campaign." : undefined,
    likes: Math.floor(1200 + (i * 137) % 15000),
    isFavorite: i % 6 === 0,
  };
});

export const mockCompetitors: Competitor[] = [
  {
    id: "c1", name: "Khaadi", handle: "@khaadi", avatarColor: "#EA6113", pageId: "khaadi.official",
    category: "Fashion", activeAds: 42, totalSaved: 18, lastChecked: "2024-12-10T08:00:00Z",
    status: "tracking", newAdsThisWeek: 7, trend: [28, 31, 35, 38, 40, 41, 42],
  },
  {
    id: "c2", name: "Sapphire", handle: "@sapphirepk", avatarColor: "#F88F22", pageId: "sapphirestores",
    category: "Fashion", activeAds: 56, totalSaved: 22, lastChecked: "2024-12-10T06:30:00Z",
    status: "tracking", newAdsThisWeek: 12, trend: [40, 44, 48, 51, 53, 55, 56],
  },
  {
    id: "c3", name: "Daraz PK", handle: "@darazpk", avatarColor: "#FBB931", pageId: "daraz.pk",
    category: "E-commerce", activeAds: 134, totalSaved: 31, lastChecked: "2024-12-09T22:00:00Z",
    status: "tracking", newAdsThisWeek: 28, trend: [98, 105, 112, 120, 125, 130, 134],
  },
  {
    id: "c4", name: "Foodpanda", handle: "@foodpanda", avatarColor: "#B84A0E", pageId: "foodpanda.pk",
    category: "Food Delivery", activeAds: 67, totalSaved: 9, lastChecked: "2024-12-10T10:00:00Z",
    status: "tracking", newAdsThisWeek: 4, trend: [58, 60, 62, 64, 65, 66, 67],
  },
  {
    id: "c5", name: "JazzCash", handle: "@jazzcash", avatarColor: "#FF9F45", pageId: "jazzcash",
    category: "Fintech", activeAds: 23, totalSaved: 7, lastChecked: "2024-12-09T18:00:00Z",
    status: "paused", newAdsThisWeek: 0, trend: [25, 24, 23, 23, 23, 23, 23],
  },
  {
    id: "c6", name: "Connatural", handle: "@connatural", avatarColor: "#7A3A0E", pageId: "connatural.skincare",
    category: "Skincare", activeAds: 19, totalSaved: 12, lastChecked: "2024-12-10T07:15:00Z",
    status: "tracking", newAdsThisWeek: 3, trend: [12, 14, 15, 16, 17, 18, 19],
  },
];

export const mockTeamMembers: TeamMember[] = [
  { id: "t1", name: "Ayesha Khan", email: "ayesha@adspy.agency", role: "admin", avatarColor: "#EA6113", status: "active", lastActive: "2024-12-10T09:30:00Z", workspace: "All Workspaces" },
  { id: "t2", name: "Bilal Ahmed", email: "bilal@adspy.agency", role: "editor", avatarColor: "#F88F22", status: "active", lastActive: "2024-12-10T08:15:00Z", workspace: "Khaadi Account" },
  { id: "t3", name: "Sana Malik", email: "sana@adspy.agency", role: "editor", avatarColor: "#FBB931", status: "active", lastActive: "2024-12-09T17:45:00Z", workspace: "Daraz Account" },
  { id: "t4", name: "Hamza Raza", email: "hamza@adspy.agency", role: "viewer", avatarColor: "#B84A0E", status: "active", lastActive: "2024-12-10T11:00:00Z", workspace: "Sapphire Account" },
  { id: "t5", name: "Zainab Ali", email: "zainab@adspy.agency", role: "viewer", avatarColor: "#FF9F45", status: "invited", lastActive: "—", workspace: "Khaadi Account" },
  { id: "t6", name: "Usman Tariq", email: "usman@adspy.agency", role: "editor", avatarColor: "#7A3A0E", status: "suspended", lastActive: "2024-11-28T14:20:00Z", workspace: "Foodpanda Account" },
];

export const mockAdminUsers: AdminUser[] = Array.from({ length: 24 }, (_, i) => {
  const plans: UserRole[] = ["free", "pro", "agency", "free", "pro", "free"];
  const statuses: AdminUser["status"][] = ["active", "active", "trial", "active", "suspended", "churned"];
  const plan = plans[i % plans.length];
  const status = statuses[i % statuses.length];
  const names = ["Ayesha", "Bilal", "Sana", "Hamza", "Zainab", "Usman", "Fatima", "Ali", "Hira", "Daniyal", "Maryam", "Omar", "Rabia", "Fahad", "Nida", "Kamran", "Saba", "Asad", "Hina", "Waqas", "Laiba", "Imran", "Nosheen", "Saad"];
  return {
    id: `u-${i + 1}`,
    name: `${names[i]} ${pick(["Khan", "Ahmed", "Malik", "Raza", "Ali", "Tariq", "Sheikh", "Iqbal"], i)}`,
    email: `${names[i].toLowerCase()}${i + 1}@example.com`,
    plan,
    status,
    savedAds: Math.floor(5 + (i * 17) % 250),
    competitors: Math.floor(1 + (i * 3) % 15),
    joinedAt: new Date(Date.now() - (i * 12) * 86400000).toISOString(),
    mrr: plan === "agency" ? 49 : plan === "pro" ? 15 : 0,
  };
});

// Analytics data
export const ctaWordFrequency = [
  { word: "Shop Now", count: 34, pct: 22 },
  { word: "Learn More", count: 21, pct: 14 },
  { word: "Sign Up", count: 18, pct: 12 },
  { word: "Order Now", count: 15, pct: 10 },
  { word: "Get Offer", count: 12, pct: 8 },
  { word: "Download", count: 11, pct: 7 },
  { word: "Book Now", count: 9, pct: 6 },
  { word: "Subscribe", count: 8, pct: 5 },
  { word: "Other", count: 24, pct: 16 },
];

export const formatDistribution = [
  { name: "Image", value: 42, color: "#EA6113" },
  { name: "Video", value: 35, color: "#F88F22" },
  { name: "Carousel", value: 18, color: "#FBB931" },
  { name: "Collection", value: 5, color: "#FFE3B3" },
];

export const adsSavedOverTime = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  saved: Math.floor(15 + (i * 13) % 60 + (i > 8 ? 25 : 0)),
  tracked: Math.floor(20 + (i * 9) % 45 + (i > 6 ? 15 : 0)),
}));

export const platformSplit = [
  { name: "Facebook", value: 58, color: "#EA6113" },
  { name: "Instagram", value: 42, color: "#FBB931" },
];

export const adLongevityBuckets = [
  { range: "1-7 days", count: 22, color: "#FFE3B3" },
  { range: "8-30 days", count: 38, color: "#FBB931" },
  { range: "31-90 days", count: 27, color: "#F88F22" },
  { range: "90+ days", count: 13, color: "#EA6113" },
];

export const topCompetitorsByAds = mockCompetitors
  .slice()
  .sort((a, b) => b.activeAds - a.activeAds)
  .slice(0, 5)
  .map((c) => ({ name: c.name, ads: c.activeAds, color: c.avatarColor }));

// KPI data
export const kpiData = {
  totalSaved: 101,
  totalCompetitors: 6,
  totalFolders: 6,
  newAdsThisWeek: 54,
  avgAdLongevity: 34,
  topPerformer: "Daraz PK",
};

export const planFeatures = {
  free: {
    name: "Free",
    price: 0,
    priceLabel: "Forever",
    accent: "#FBB931",
    features: [
      "Save up to 20 ads",
      "Track 1 competitor",
      "2 folders / tags",
      "Basic CSV export",
      "Ad screenshot capture",
      "Search within saved ads",
    ],
    limits: { savedAds: 20, competitors: 1, folders: 2, teamMembers: 0, apiAccess: false, analytics: false },
  },
  pro: {
    name: "Pro",
    price: 15,
    priceLabel: "/month",
    accent: "#F88F22",
    features: [
      "Unlimited saved ads",
      "Track up to 10 competitors",
      "Unlimited folders & tags",
      "Full export (CSV + PDF)",
      "Weekly digest email",
      "Pattern analytics",
      "Ad longevity tracker",
      "Notes & advanced tagging",
    ],
    limits: { savedAds: Infinity, competitors: 10, folders: Infinity, teamMembers: 0, apiAccess: false, analytics: true },
  },
  agency: {
    name: "Agency",
    price: 49,
    priceLabel: "/month",
    accent: "#EA6113",
    features: [
      "Everything in Pro",
      "Unlimited competitors",
      "Team collaboration",
      "Multi-client workspaces",
      "Shareable swipe files",
      "API access",
      "White-label reports",
      "Priority support",
    ],
    limits: { savedAds: Infinity, competitors: Infinity, folders: Infinity, teamMembers: 50, apiAccess: true, analytics: true },
  },
};

export const activityFeed = [
  { id: "a1", type: "saved", text: "Saved 3 ads from Daraz PK", time: "2 hours ago", icon: "bookmark" },
  { id: "a2", type: "competitor", text: "Sapphire launched 12 new ads this week", time: "5 hours ago", icon: "trending-up" },
  { id: "a3", type: "folder", text: "Created folder \"Winter Campaign 2024\"", time: "1 day ago", icon: "folder-plus" },
  { id: "a4", type: "note", text: "Added note to Khaadi — Eid Collection ad", time: "1 day ago", icon: "sticky-note" },
  { id: "a5", type: "export", text: "Exported 18 ads as PDF report", time: "2 days ago", icon: "download" },
  { id: "a6", type: "tracking", text: "Started tracking Connatural", time: "3 days ago", icon: "eye" },
  { id: "a7", type: "saved", text: "Saved 5 ads from Foodpanda", time: "4 days ago", icon: "bookmark" },
  { id: "a8", type: "competitor", text: "JazzCash paused 8 ads", time: "5 days ago", icon: "trending-down" },
];

export const upcomingFeatures = [
  { name: "AI Ad Copy Analysis", phase: "Phase 4", eta: "Q1 2025", progress: 35 },
  { name: "TikTok Ad Library Support", phase: "Phase 4", eta: "Q2 2025", progress: 18 },
  { name: "Cross-platform Tracking", phase: "Phase 4", eta: "Q2 2025", progress: 22 },
  { name: "Team Workspaces", phase: "Phase 2", eta: "Live", progress: 100 },
];
