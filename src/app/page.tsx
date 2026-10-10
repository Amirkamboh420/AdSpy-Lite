"use client";

import { useAppStore } from "@/lib/store";
import { AppShell } from "@/components/app-shell";
import { LandingView } from "@/components/views/landing";
import { LoginView } from "@/components/views/login";
import { PricingView } from "@/components/views/pricing";
import { DashboardView } from "@/components/views/dashboard";
import { SavedAdsView } from "@/components/views/saved-ads";
import { CompetitorsView } from "@/components/views/competitors";
import { AnalyticsView } from "@/components/views/analytics";
import { SwipeFileView } from "@/components/views/swipe-file";
import { TeamView } from "@/components/views/team";
import { AdminView } from "@/components/views/admin";
import { SettingsView } from "@/components/views/settings";
import { BillingView } from "@/components/views/billing";
import { SearchView } from "@/components/views/search";
import { SupportView } from "@/components/views/support";
import { ApiKeysView } from "@/components/views/api-keys";
import { RoleGuard } from "@/components/role-guard";
import { motion } from "framer-motion";

export default function Home() {
  const view = useAppStore((s) => s.view);

  // Standalone views render full-page (no app shell) — like the landing page
  if (view === "landing") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <LandingView />
      </motion.div>
    );
  }

  if (view === "login") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <LoginView />
      </motion.div>
    );
  }

  if (view === "pricing") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <PricingView />
      </motion.div>
    );
  }

  const viewContent = (() => {
    switch (view) {
      case "dashboard": return <DashboardView />;
      case "saved-ads": return <SavedAdsView />;
      case "competitors": return <CompetitorsView />;
      case "analytics": return <AnalyticsView />;
      case "swipe-file": return <SwipeFileView />;
      case "team": return <TeamView />;
      case "admin": return <AdminView />;
      case "settings": return <SettingsView />;
      case "billing": return <BillingView />;
      case "search": return <SearchView />;
      case "support": return <SupportView />;
      case "api-keys": return <ApiKeysView />;
      default: return <DashboardView />;
    }
  })();

  return (
    <AppShell>
      <motion.div
        key={view}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <RoleGuard view={view}>{viewContent}</RoleGuard>
      </motion.div>
    </AppShell>
  );
}
