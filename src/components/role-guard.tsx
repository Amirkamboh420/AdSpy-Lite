"use client";

import { useAppStore, VIEW_ACCESS, ROLE_LIMITS } from "@/lib/store";
import type { UserRole, ViewKey } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Crown, Zap, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Checks if the current role can access the given view.
 * Returns true if access is allowed, false otherwise.
 */
export function canAccessView(role: UserRole, view: ViewKey): boolean {
  const allowed = VIEW_ACCESS[view];
  return allowed ? allowed.includes(role) : true;
}

/**
 * Renders an "access denied / upgrade required" card for views the current role can't access.
 * Used as a fallback when role-based nav filtering is bypassed (e.g. direct store.setView).
 */
export function AccessDenied({ view }: { view: ViewKey }) {
  const { role, setView } = useAppStore();
  const requiredRoles = VIEW_ACCESS[view] || [];
  const minRole = requiredRoles.includes("pro") ? "pro" : requiredRoles.includes("agency") ? "agency" : "admin";

  const upgradeConfig: Record<string, { icon: React.ElementType; label: string; color: string; price: string }> = {
    pro: { icon: Zap, label: "Pro", color: "#F88F22", price: "$15/mo" },
    agency: { icon: Crown, label: "Agency", color: "#EA6113", price: "$49/mo" },
    admin: { icon: Sparkles, label: "Admin", color: "#B84A0E", price: "internal" },
  };
  const cfg = upgradeConfig[minRole];

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 text-center border-sunset-orange/30">
        <div className="h-16 w-16 rounded-2xl bg-sunset-gradient flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sunset-orange/30">
          <Lock className="h-8 w-8 text-white" />
        </div>
        <Badge className="mb-3 bg-sunset-cream/40 text-[#7A3A0E]">{cfg.label.toUpperCase()} FEATURE</Badge>
        <h2 className="text-2xl font-bold mb-2">This feature requires {cfg.label}</h2>
        <p className="text-sm text-muted-foreground mb-6">
          You're currently signed in as <span className="font-semibold capitalize">{role}</span>.
          Upgrade to {cfg.label} to access{" "}
          <span className="font-semibold capitalize">{view.replace(/-/g, " ")}</span>
          {minRole !== "admin" && ` and unlock ${cfg.price} worth of features`}.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {minRole !== "admin" && (
            <Button className="bg-sunset-gradient hover:opacity-90 text-white" onClick={() => setView("pricing")}>
              <cfg.icon className="h-4 w-4 mr-1.5" />
              Upgrade to {cfg.label}
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          )}
          <Button variant="outline" onClick={() => setView("dashboard")}>
            Back to dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}

/**
 * Wraps a view's content. If the current role can't access the view, renders AccessDenied instead.
 */
export function RoleGuard({ view, children }: { view: ViewKey; children: React.ReactNode }) {
  const role = useAppStore((s) => s.role);
  if (!canAccessView(role, view)) {
    return <AccessDenied view={view} />;
  }
  return <>{children}</>;
}

/**
 * Returns the limit info for the current role, or null if no limit applies.
 */
export function useRoleLimit() {
  const role = useAppStore((s) => s.role);
  return ROLE_LIMITS[role];
}
