"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Check,
  Download,
  Plus,
  Sparkles,
  Crown,
  Receipt,
  ShieldCheck,
  Wallet,
  AlertCircle,
} from "lucide-react";
import { planFeatures } from "@/lib/mock-data";
import { sonnerToast } from "@/lib/toast-helpers";
import { cn } from "@/lib/utils";

type PlanKey = "free" | "pro" | "agency";

const CURRENT_PLAN: PlanKey = "agency";

const usageBars = [
  { label: "Saved Ads", used: 101, total: Infinity, color: "#EA6113" },
  { label: "Competitors", used: 6, total: Infinity, color: "#F88F22" },
  { label: "Team Members", used: 6, total: 50, color: "#FBB931" },
];

const paymentMethods = [
  {
    id: "pm1",
    brand: "Visa",
    last4: "4242",
    expiry: "08/27",
    isDefault: true,
    color: "#1A1F71",
    bg: "linear-gradient(135deg, #1A1F71, #4250A8)",
  },
  {
    id: "pm2",
    brand: "JazzCash",
    last4: "1234",
    expiry: "—",
    isDefault: false,
    color: "#E4002B",
    bg: "linear-gradient(135deg, #E4002B, #FF4D6D)",
  },
];

type InvoiceStatus = "paid" | "failed" | "pending";

const invoices: {
  id: string;
  date: string;
  amount: string;
  plan: string;
  status: InvoiceStatus;
}[] = [
  { id: "INV-2025-0006", date: "Jan 15, 2025", amount: "$49.00", plan: "Agency", status: "paid" },
  { id: "INV-2024-0005", date: "Dec 15, 2024", amount: "$49.00", plan: "Agency", status: "paid" },
  { id: "INV-2024-0004", date: "Nov 15, 2024", amount: "$49.00", plan: "Agency", status: "paid" },
  { id: "INV-2024-0003", date: "Oct 15, 2024", amount: "$15.00", plan: "Pro", status: "paid" },
  { id: "INV-2024-0002", date: "Sep 15, 2024", amount: "$15.00", plan: "Pro", status: "failed" },
  { id: "INV-2024-0001", date: "Aug 15, 2024", amount: "$15.00", plan: "Pro", status: "pending" },
];

const statusBadgeClass: Record<InvoiceStatus, string> = {
  paid: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
};

export function BillingView() {
  const planOrder: PlanKey[] = ["free", "pro", "agency"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-sunset-gradient flex items-center justify-center shrink-0 shadow-sm">
          <CreditCard className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Billing &amp; Subscription</h1>
          <p className="text-sm text-muted-foreground">
            Manage your plan, payment methods &amp; invoices
          </p>
        </div>
      </div>

      {/* Current plan banner */}
      <Card className="relative overflow-hidden border-0 p-6 lg:p-8 bg-sunset-gradient text-white">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              <span className="text-sm font-medium opacity-90">Current Plan</span>
              <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                {planFeatures.agency.name}
              </Badge>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold">
              ${planFeatures.agency.price}
              <span className="text-base font-normal opacity-80">{planFeatures.agency.priceLabel}</span>
            </h2>
            <p className="text-sm text-white/85">
              Renews on <span className="font-semibold">Jan 15, 2025</span> · Next charge $49.00
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-white text-sunset-deep hover:bg-white/90"
                onClick={() => sonnerToast.info("Opening subscription manager…")}
              >
                Manage subscription
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 hover:text-white"
                onClick={() => sonnerToast.warning("Cancellation requested — your plan stays active until Jan 15")}
              >
                Cancel
              </Button>
            </div>
          </div>

          {/* Usage bars */}
          <div className="w-full lg:w-[300px] space-y-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-xs font-medium opacity-90 uppercase tracking-wide">Usage this cycle</p>
            {usageBars.map((u) => {
              const pct = u.total === Infinity ? 35 : Math.min(100, (u.used / u.total) * 100);
              const label = u.total === Infinity ? `${u.used} / ∞` : `${u.used} / ${u.total}`;
              return (
                <div key={u.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="opacity-90">{u.label}</span>
                    <span className="font-semibold">{label}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all bg-white"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Plans comparison */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-sunset-orange" />
          <h2 className="font-semibold">Compare Plans</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {planOrder.map((key) => {
            const p = planFeatures[key];
            const isCurrent = key === CURRENT_PLAN;
            return (
              <Card
                key={key}
                className={cn(
                  "p-5 relative flex flex-col transition-all hover:-translate-y-0.5",
                  isCurrent
                    ? "border-2 bg-sunset-cream/20"
                    : "border hover:border-sunset-orange/40 hover:shadow-sm"
                )}
                style={isCurrent ? { borderColor: p.accent } : undefined}
              >
                {isCurrent && (
                  <Badge
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-sunset-gradient text-white border-0 shadow-sm"
                  >
                    <Crown className="h-3 w-3 mr-1" /> Current Plan
                  </Badge>
                )}

                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: p.accent }}
                    />
                    <h3 className="font-semibold text-lg">{p.name}</h3>
                  </div>
                  <p className="text-2xl font-bold">
                    ${p.price}
                    <span className="text-sm font-normal text-muted-foreground">{p.priceLabel}</span>
                  </p>
                </div>

                <Separator className="mb-3" />

                <ul className="space-y-2 flex-1 mb-4">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check
                        className="h-4 w-4 shrink-0 mt-0.5"
                        style={{ color: p.accent }}
                      />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  size="sm"
                  disabled={isCurrent}
                  variant={isCurrent ? "outline" : "default"}
                  className={
                    isCurrent
                      ? "w-full cursor-default"
                      : "w-full bg-sunset-gradient text-white hover:opacity-90"
                  }
                  onClick={() =>
                    sonnerToast.success(`Switching to ${p.name} plan…`)
                  }
                >
                  {isCurrent ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1.5" /> Current
                    </>
                  ) : (
                    `Switch to ${p.name}`
                  )}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Payment methods */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold flex items-center gap-2">
              <Wallet className="h-4 w-4 text-sunset-deep" /> Payment Methods
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Default card is charged on each renewal date
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => sonnerToast.success("Add payment method dialog opened")}
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add payment method
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {paymentMethods.map((pm) => (
            <div
              key={pm.id}
              className="relative flex items-center gap-3 p-4 rounded-xl border border-border/60 hover:border-sunset-orange/40 hover:bg-muted/30 transition-all overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 8px, currentColor 8px, currentColor 9px)",
                }}
              />
              <div
                className="h-10 w-14 rounded-md flex items-center justify-center shrink-0 text-white text-[10px] font-bold tracking-wide shadow-sm"
                style={{ background: pm.bg }}
              >
                {pm.brand === "Visa" ? "VISA" : "JC"}
              </div>
              <div className="min-w-0 flex-1 relative">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{pm.brand}</p>
                  {pm.isDefault && (
                    <Badge className="bg-sunset-cream/50 text-[#7A3A0E] text-[9px] h-4 px-1.5">
                      Default
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  •••• {pm.last4}
                  {pm.expiry !== "—" && <span className="ml-2">Exp {pm.expiry}</span>}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 text-xs h-7 relative"
                onClick={() => sonnerToast.success(`${pm.brand} •••• ${pm.last4} ${pm.isDefault ? "is default" : "set as default"}`)}
              >
                {pm.isDefault ? "Manage" : "Set default"}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Billing history */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold flex items-center gap-2">
              <Receipt className="h-4 w-4 text-sunset-deep" /> Billing History
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Download invoices for your records or tax filing
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => sonnerToast.success("All invoices exported as ZIP")}
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export all
          </Button>
        </div>

        {/* Table header (desktop only) */}
        <div className="hidden sm:grid grid-cols-[1fr_1fr_1fr_120px_100px_90px] gap-3 px-3 pb-2 text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
          <span>Invoice</span>
          <span>Date</span>
          <span>Plan</span>
          <span>Amount</span>
          <span>Status</span>
          <span className="text-right">Receipt</span>
        </div>

        <div className="divide-y">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_1fr_120px_100px_90px] gap-3 px-3 py-3 items-center hover:bg-muted/30 rounded-lg transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-mono font-medium truncate">{inv.id}</p>
                <p className="text-[11px] text-muted-foreground sm:hidden">
                  {inv.date} · {inv.plan}
                </p>
              </div>
              <span className="hidden sm:block text-sm text-muted-foreground">{inv.date}</span>
              <div className="hidden sm:block">
                <Badge variant="secondary" className="bg-sunset-cream/40 text-[#7A3A0E] text-[10px]">
                  {inv.plan}
                </Badge>
              </div>
              <span className="text-sm font-semibold">{inv.amount}</span>
              <div className="flex items-center sm:justify-start justify-end">
                <Badge className={cn("text-[10px] capitalize", statusBadgeClass[inv.status])}>
                  {inv.status}
                </Badge>
              </div>
              <div className="hidden sm:flex justify-end">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs text-sunset-deep hover:text-sunset-deep hover:bg-sunset-cream/40"
                  onClick={() => sonnerToast.success("Invoice downloaded")}
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="col-span-2 sm:hidden">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full h-7 text-xs"
                  onClick={() => sonnerToast.success("Invoice downloaded")}
                >
                  <Download className="h-3 w-3 mr-1.5" />
                  Download invoice
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Local payment methods info */}
      <Card className="p-5 bg-sunset-cream/20 border-sunset-cream/60">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="h-10 w-10 rounded-lg bg-sunset-gradient flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold flex items-center gap-2">
              Local Payment Methods for Pakistan
              <Badge className="bg-sunset-gradient text-white text-[10px]">PK</Badge>
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Pay in PKR without an international credit card. We support local wallets
              &amp; bank transfers — converted at live FX rates with no hidden fees.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg, #E4002B, #FF4D6D)" }}>
                JazzCash
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg, #13795B, #2DBE8C)" }}>
                EasyPaisa
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg, #0A6C3D, #1DB954)" }}>
                HBL
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg, #1A1F71, #4250A8)" }}>
                Meezan Bank
              </span>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 border-sunset-deep/40 text-sunset-deep hover:bg-sunset-deep hover:text-white"
            onClick={() => sonnerToast.success("Connecting local payment provider…")}
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Connect wallet
          </Button>
        </div>
      </Card>

      {/* Failed payment alert */}
      <Card className="p-4 border-red-300/40 bg-red-50/60 dark:bg-red-950/10">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-red-100 dark:bg-red-950/40 flex items-center justify-center shrink-0">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">
              1 failed payment detected (Sep 15, 2024)
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your Pro plan charge was declined. We retried successfully on Oct 15.
              No action needed — but you can update your default card to prevent future failures.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 border-red-300/60 text-red-600 hover:bg-red-50 dark:text-red-400"
            onClick={() => sonnerToast.info("Opening payment update form…")}
          >
            Update card
          </Button>
        </div>
      </Card>
    </div>
  );
}
