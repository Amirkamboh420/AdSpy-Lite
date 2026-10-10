"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  UsersRound, UserPlus, Mail, Shield, Edit, Eye, MoreVertical, Trash2, Crown,
  Check, X, Clock, Building2,
} from "lucide-react";
import { mockTeamMembers, type TeamMember } from "@/lib/mock-data";
import { sonnerToast } from "@/lib/toast-helpers";
import { cn } from "@/lib/utils";

interface Workspace {
  name: string;
  color: string;
  members: number;
}

const workspaces: Workspace[] = [
  { name: "Khaadi Account", color: "#EA6113", members: 2 },
  { name: "Daraz Account", color: "#F88F22", members: 1 },
  { name: "Sapphire Account", color: "#FBB931", members: 1 },
  { name: "Foodpanda Account", color: "#B84A0E", members: 1 },
];

const roleConfig: Record<
  TeamMember["role"],
  { label: string; color: string; text: string; icon: typeof Crown }
> = {
  admin: { label: "Admin", color: "#EA6113", text: "#ffffff", icon: Crown },
  editor: { label: "Editor", color: "#F88F22", text: "#ffffff", icon: Edit },
  viewer: { label: "Viewer", color: "#FBB931", text: "#5C2A0B", icon: Eye },
};

const statusConfig: Record<
  TeamMember["status"],
  { label: string; className: string; dot: string }
> = {
  active: {
    label: "Active",
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  invited: {
    label: "Invited",
    className: "border-sunset-amber/40 bg-sunset-amber/15 text-amber-700 dark:text-amber-300",
    dot: "bg-sunset-amber",
  },
  suspended: {
    label: "Suspended",
    className: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
    dot: "bg-red-500",
  },
};

const rolePermissions = [
  {
    role: "Admin",
    icon: Crown,
    color: "#EA6113",
    desc: "Full access",
    abilities: ["Manage members", "Edit workspaces", "Delete content", "Billing & plan"],
  },
  {
    role: "Editor",
    icon: Edit,
    color: "#F88F22",
    desc: "Save & edit",
    abilities: ["Save & tag ads", "Edit notes", "Manage folders", "Export reports"],
  },
  {
    role: "Viewer",
    icon: Eye,
    color: "#FBB931",
    desc: "Read-only",
    abilities: ["View saved ads", "Read notes", "View analytics", "No edits"],
  },
];

export function TeamView() {
  const [activeWorkspace, setActiveWorkspace] = useState(0);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamMember["role"]>("editor");
  const [inviteWorkspace, setInviteWorkspace] = useState(workspaces[0].name);

  const totalMembers = mockTeamMembers.length;
  const activeCount = mockTeamMembers.filter((m) => m.status === "active").length;
  const workspaceCount = workspaces.length;

  const formatDate = (iso: string) => {
    if (iso === "—" || !iso) return "—";
    const d = new Date(iso);
    const now = new Date();
    const diffSec = (now.getTime() - d.getTime()) / 1000;
    if (diffSec < 0) return "—";
    if (diffSec < 60) return "just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const sendInvite = () => {
    if (!inviteEmail.trim()) {
      sonnerToast.error("Please enter an email address");
      return;
    }
    sonnerToast.success(`Invitation sent to ${inviteEmail}`);
    setShowInvite(false);
    setInviteEmail("");
    setInviteRole("editor");
    setInviteWorkspace(workspaces[0].name);
  };

  const handleAction = (action: string, member: TeamMember) => {
    const messages: Record<string, string> = {
      "Change role": `Role change dialog opened for ${member.name}`,
      "Resend invite": `Invite resent to ${member.email}`,
      Suspend: `${member.name} has been suspended`,
      Remove: `${member.name} removed from workspace`,
    };
    sonnerToast.success(messages[action] ?? action);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UsersRound className="h-6 w-6 text-sunset-deep" />
            Team &amp; Workspaces
          </h1>
          <p className="text-sm text-muted-foreground">Manage members across client workspaces</p>
        </div>
        <Button
          size="sm"
          className="bg-sunset-gradient hover:opacity-90 text-white shadow-sm"
          onClick={() => setShowInvite(true)}
        >
          <UserPlus className="h-4 w-4 mr-1.5" />
          Invite Member
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-10 bg-sunset-deep" />
          <div className="relative flex items-center justify-between mb-2">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
              Total Members
            </p>
            <div className="h-8 w-8 rounded-lg bg-sunset-deep/10 flex items-center justify-center">
              <UsersRound className="h-4 w-4 text-sunset-deep" />
            </div>
          </div>
          <p className="text-3xl font-bold relative text-sunset-gradient">{totalMembers}</p>
          <p className="text-[11px] text-muted-foreground mt-1 relative">across all workspaces</p>
        </Card>

        <Card className="p-5 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-10 bg-emerald-500" />
          <div className="relative flex items-center justify-between mb-2">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
              Active Now
            </p>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
            </div>
          </div>
          <p className="text-3xl font-bold relative text-emerald-600 dark:text-emerald-400">
            {activeCount}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1 relative">online in last 24h</p>
        </Card>

        <Card className="p-5 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-10 bg-sunset-amber" />
          <div className="relative flex items-center justify-between mb-2">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
              Client Workspaces
            </p>
            <div className="h-8 w-8 rounded-lg bg-sunset-amber/20 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-sunset-amber" />
            </div>
          </div>
          <p className="text-3xl font-bold relative text-sunset-deep">{workspaceCount}</p>
          <p className="text-[11px] text-muted-foreground mt-1 relative">client accounts managed</p>
        </Card>
      </div>

      {/* Workspaces chips */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Building2 className="h-4 w-4 text-sunset-deep" />
            Client Workspaces
          </h2>
          <span className="text-xs text-muted-foreground">Click to filter members</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {workspaces.map((w, i) => {
            const isActive = activeWorkspace === i;
            return (
              <button
                key={w.name}
                onClick={() => setActiveWorkspace(i)}
                className={cn(
                  "text-left rounded-xl p-4 border bg-card transition-all relative overflow-hidden hover:shadow-md group",
                  isActive
                    ? "bg-sunset-cream/40 border-sunset-amber/60 shadow-sm"
                    : "border-border/60 hover:border-sunset-amber/40"
                )}
                style={{ borderLeftWidth: 4, borderLeftColor: w.color }}
              >
                {isActive && (
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-sunset-deep animate-pulse" />
                )}
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${w.color}20` }}
                  >
                    <Building2 className="h-3.5 w-3.5" style={{ color: w.color }} />
                  </div>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wide"
                    style={{ color: w.color }}
                  >
                    Workspace
                  </span>
                </div>
                <p className="text-sm font-semibold leading-tight mb-1">{w.name}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <UsersRound className="h-3 w-3" />
                  <span>{w.members} member{w.members !== 1 ? "s" : ""}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Team members table */}
      <Card className="p-0 overflow-hidden">
        {/* Table header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
          <div>
            <h2 className="font-semibold flex items-center gap-2">
              <UsersRound className="h-4 w-4 text-sunset-deep" />
              Team Members
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {totalMembers} members in {workspaces[activeWorkspace].name}
            </p>
          </div>
          <Badge variant="outline" className="text-[10px] border-sunset-amber/40 text-sunset-deep">
            {workspaces[activeWorkspace].members} shown
          </Badge>
        </div>

        {/* Column headers */}
        <div className="hidden md:grid grid-cols-[1.6fr_1fr_1.2fr_1fr_1fr_56px] gap-3 px-5 py-2.5 bg-muted/30 text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
          <span>Member</span>
          <span>Role</span>
          <span>Workspace</span>
          <span>Status</span>
          <span>Last Active</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border/60">
          {mockTeamMembers.map((m) => {
            const role = roleConfig[m.role];
            const status = statusConfig[m.status];
            const RoleIcon = role.icon;
            return (
              <div
                key={m.id}
                className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1.2fr_1fr_1fr_56px] gap-3 px-5 py-3.5 items-center hover:bg-muted/30 transition-colors group"
              >
                {/* Member */}
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-9 w-9 shrink-0 ring-2 ring-background" style={{ background: `${m.avatarColor}22` }}>
                    <AvatarFallback
                      className="text-xs font-bold"
                      style={{ backgroundColor: `${m.avatarColor}33`, color: m.avatarColor }}
                    >
                      {initials(m.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate flex items-center gap-1.5">
                      {m.name}
                      {m.role === "admin" && (
                        <Crown className="h-3 w-3 text-sunset-deep shrink-0" />
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                      <Mail className="h-3 w-3 shrink-0" />
                      {m.email}
                    </p>
                  </div>
                </div>

                {/* Role */}
                <div>
                  <Badge
                    variant="outline"
                    className="gap-1 px-2 py-0.5 text-[11px] font-medium border-transparent"
                    style={{ backgroundColor: `${role.color}20`, color: role.color }}
                  >
                    <RoleIcon className="h-3 w-3" />
                    {role.label}
                  </Badge>
                </div>

                {/* Workspace */}
                <div className="flex items-center gap-1.5 text-xs min-w-0">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">{m.workspace}</span>
                </div>

                {/* Status */}
                <div>
                  <Badge
                    variant="outline"
                    className={cn("gap-1.5 px-2 py-0.5 text-[11px] font-medium", status.className)}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
                    {status.label}
                  </Badge>
                </div>

                {/* Last Active */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 shrink-0" />
                  <span>{formatDate(m.lastActive)}</span>
                </div>

                {/* Actions */}
                <div className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-sunset-cream/40 hover:text-sunset-deep"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => handleAction("Change role", m)}>
                        <Shield className="h-3.5 w-3.5 mr-2" />
                        Change role
                      </DropdownMenuItem>
                      {m.status === "invited" && (
                        <DropdownMenuItem onClick={() => handleAction("Resend invite", m)}>
                          <Mail className="h-3.5 w-3.5 mr-2" />
                          Resend invite
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      {m.status !== "suspended" ? (
                        <DropdownMenuItem
                          onClick={() => handleAction("Suspend", m)}
                          className="text-amber-700 dark:text-amber-400 focus:text-amber-700"
                        >
                          <Clock className="h-3.5 w-3.5 mr-2" />
                          Suspend
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleAction("Reinstate", m)}
                          className="text-emerald-700 dark:text-emerald-400"
                        >
                          <Check className="h-3.5 w-3.5 mr-2" />
                          Reinstate
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleAction("Remove", m)}
                        className="text-red-600 dark:text-red-400 focus:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Role permissions info card */}
      <Card className="p-5 bg-sunset-radial border-sunset-amber/30">
        <div className="mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4 text-sunset-deep" />
            Role Permissions
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            What each role can do across workspaces
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {rolePermissions.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.role}
                className="rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${r.color}22` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: r.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: r.color }}>
                      {r.role}
                    </p>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                      {r.desc}
                    </p>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {r.abilities.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check
                        className="h-3 w-3 shrink-0"
                        style={{ color: r.color }}
                      />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Invite dialog */}
      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-sunset-gradient flex items-center justify-center">
                <UserPlus className="h-4 w-4 text-white" />
              </div>
              Invite Team Member
            </DialogTitle>
            <DialogDescription>
              Send an invitation to join a client workspace. They&apos;ll receive an email with
              onboarding instructions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="invite-email" className="text-xs">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="teammate@agency.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="pl-9"
                  onKeyDown={(e) => e.key === "Enter" && sendInvite()}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Role</Label>
              <Select
                value={inviteRole}
                onValueChange={(v) => setInviteRole(v as TeamMember["role"])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <span className="flex items-center gap-2">
                      <Crown className="h-3.5 w-3.5 text-sunset-deep" />
                      Admin — full access
                    </span>
                  </SelectItem>
                  <SelectItem value="editor">
                    <span className="flex items-center gap-2">
                      <Edit className="h-3.5 w-3.5 text-sunset-orange" />
                      Editor — save &amp; edit
                    </span>
                  </SelectItem>
                  <SelectItem value="viewer">
                    <span className="flex items-center gap-2">
                      <Eye className="h-3.5 w-3.5 text-sunset-amber" />
                      Viewer — read-only
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Workspace</Label>
              <Select value={inviteWorkspace} onValueChange={setInviteWorkspace}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a workspace" />
                </SelectTrigger>
                <SelectContent>
                  {workspaces.map((w) => (
                    <SelectItem key={w.name} value={w.name}>
                      <span className="flex items-center gap-2">
                        <Building2
                          className="h-3.5 w-3.5"
                          style={{ color: w.color }}
                        />
                        {w.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border border-sunset-amber/30 bg-sunset-cream/30 p-3 flex items-start gap-2">
              <Shield className="h-3.5 w-3.5 text-sunset-deep shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground">
                Invited members will have access to all ads, folders, and analytics within the
                selected workspace. You can change permissions anytime.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvite(false)}>
              <X className="h-4 w-4 mr-1.5" />
              Cancel
            </Button>
            <Button
              className="bg-sunset-gradient hover:opacity-90 text-white"
              onClick={sendInvite}
            >
              <Mail className="h-4 w-4 mr-1.5" />
              Send invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
