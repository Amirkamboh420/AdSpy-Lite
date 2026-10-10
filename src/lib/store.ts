import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserRole } from "@/lib/mock-data";

export type ViewKey =
  | "landing"
  | "login"
  | "pricing"
  | "dashboard"
  | "saved-ads"
  | "competitors"
  | "analytics"
  | "swipe-file"
  | "team"
  | "api-keys"
  | "support"
  | "admin"
  | "settings"
  | "billing"
  | "search";

/** Views that render standalone (no app shell) */
export const STANDALONE_VIEWS: ViewKey[] = ["landing", "login", "pricing"];

/** Role-based view access map. A view is accessible if the role is in its list. */
export const VIEW_ACCESS: Record<ViewKey, UserRole[]> = {
  landing: ["free", "pro", "agency", "team", "admin"],
  login: ["free", "pro", "agency", "team", "admin"],
  pricing: ["free", "pro", "agency", "team", "admin"],
  dashboard: ["free", "pro", "agency", "team", "admin"],
  "saved-ads": ["free", "pro", "agency", "team", "admin"],
  competitors: ["free", "pro", "agency", "team", "admin"],
  analytics: ["pro", "agency", "team", "admin"],
  "swipe-file": ["pro", "agency", "admin"],
  team: ["agency", "admin"],
  "api-keys": ["agency", "admin"],
  support: ["free", "pro", "agency", "team", "admin"],
  admin: ["admin"],
  settings: ["free", "pro", "agency", "team", "admin"],
  billing: ["free", "pro", "agency", "admin"],
  search: ["free", "pro", "agency", "team", "admin"],
};

/** Role permission checks */
export const ROLE_LIMITS: Record<UserRole, { savedAds: number; competitors: number; folders: number; teamMembers: number; apiAccess: boolean; analytics: boolean; teamMgmt: boolean; multiClient: boolean }> = {
  free: { savedAds: 20, competitors: 1, folders: 2, teamMembers: 0, apiAccess: false, analytics: false, teamMgmt: false, multiClient: false },
  pro: { savedAds: Infinity, competitors: 10, folders: Infinity, teamMembers: 0, apiAccess: false, analytics: true, teamMgmt: false, multiClient: false },
  agency: { savedAds: Infinity, competitors: Infinity, folders: Infinity, teamMembers: 50, apiAccess: true, analytics: true, teamMgmt: true, multiClient: true },
  team: { savedAds: Infinity, competitors: 10, folders: Infinity, teamMembers: 0, apiAccess: false, analytics: true, teamMgmt: false, multiClient: false },
  admin: { savedAds: Infinity, competitors: Infinity, folders: Infinity, teamMembers: Infinity, apiAccess: true, analytics: true, teamMgmt: true, multiClient: true },
};

interface AppState {
  view: ViewKey;
  role: UserRole;
  isAuthenticated: boolean;
  theme: "light" | "dark";
  sidebarOpen: boolean;
  commandOpen: boolean;
  notifOpen: boolean;
  onboardingSeen: boolean;
  compareAds: string[];
  selectedFolder: string;
  selectedWorkspace: string;
  bulkSelected: string[];
  helpOpen: boolean;
  searchQuery: string;
  changelogOpen: boolean;
  lastSeenVersion: string;
  recentSearches: string[];
  pinnedAds: string[];
  setView: (v: ViewKey) => void;
  setRole: (r: UserRole) => void;
  setAuthenticated: (a: boolean) => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCommandOpen: (open: boolean) => void;
  setNotifOpen: (open: boolean) => void;
  setOnboardingSeen: (seen: boolean) => void;
  toggleCompareAd: (id: string) => void;
  clearCompare: () => void;
  setSelectedFolder: (id: string) => void;
  setSelectedWorkspace: (id: string) => void;
  toggleBulkSelected: (id: string) => void;
  clearBulkSelected: () => void;
  setHelpOpen: (open: boolean) => void;
  setSearchQuery: (q: string) => void;
  setChangelogOpen: (open: boolean) => void;
  markVersionSeen: (version: string) => void;
  addRecentSearch: (q: string) => void;
  clearRecentSearches: () => void;
  togglePinAd: (id: string) => void;
  goLanding: () => void;
  goApp: () => void;
  login: (r: UserRole) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      view: "landing",
      role: "agency",
      isAuthenticated: true,
      theme: "light",
      sidebarOpen: false,
      commandOpen: false,
      notifOpen: false,
      onboardingSeen: false,
      compareAds: [],
      selectedFolder: "all",
      selectedWorkspace: "khaadi",
      bulkSelected: [],
      helpOpen: false,
      searchQuery: "",
      changelogOpen: false,
      lastSeenVersion: "",
      recentSearches: [],
      pinnedAds: [],
      setView: (view) => set({ view, sidebarOpen: false }),
      setRole: (role) => set({ role }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setCommandOpen: (commandOpen) => set({ commandOpen }),
      setNotifOpen: (notifOpen) => set({ notifOpen }),
      setOnboardingSeen: (onboardingSeen) => set({ onboardingSeen }),
      toggleCompareAd: (id) =>
        set((s) => ({
          compareAds: s.compareAds.includes(id)
            ? s.compareAds.filter((x) => x !== id)
            : s.compareAds.length >= 4
              ? s.compareAds
              : [...s.compareAds, id],
        })),
      clearCompare: () => set({ compareAds: [] }),
      setSelectedFolder: (selectedFolder) => set({ selectedFolder }),
      setSelectedWorkspace: (selectedWorkspace) => set({ selectedWorkspace }),
      toggleBulkSelected: (id) =>
        set((s) => ({
          bulkSelected: s.bulkSelected.includes(id)
            ? s.bulkSelected.filter((x) => x !== id)
            : [...s.bulkSelected, id],
        })),
      clearBulkSelected: () => set({ bulkSelected: [] }),
      setHelpOpen: (helpOpen) => set({ helpOpen }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setChangelogOpen: (changelogOpen) => set({ changelogOpen }),
      markVersionSeen: (version) => set({ lastSeenVersion: version }),
      addRecentSearch: (q) => set((s) => {
        const trimmed = q.trim();
        if (!trimmed) return s;
        const filtered = s.recentSearches.filter((x) => x.toLowerCase() !== trimmed.toLowerCase());
        return { recentSearches: [trimmed, ...filtered].slice(0, 5) };
      }),
      clearRecentSearches: () => set({ recentSearches: [] }),
      togglePinAd: (id) => set((s) => ({
        pinnedAds: s.pinnedAds.includes(id)
          ? s.pinnedAds.filter((x) => x !== id)
          : [...s.pinnedAds, id],
      })),
      goLanding: () => set({ view: "landing" }),
      goApp: () => set({ view: "dashboard" }),
      login: (r) => set({ role: r, isAuthenticated: true, view: "dashboard" }),
      logout: () => set({ isAuthenticated: false, view: "landing" }),
    }),
    {
      name: "adspy-lite-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        role: s.role,
        theme: s.theme,
        onboardingSeen: s.onboardingSeen,
        lastSeenVersion: s.lastSeenVersion,
        recentSearches: s.recentSearches,
        pinnedAds: s.pinnedAds,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
);
