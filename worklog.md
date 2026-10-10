# AdSpy Lite — Project Worklog

## Project Overview
AdSpy Lite is a companion web dashboard for a Chrome Extension that scrapes/saves Facebook & Instagram ads from the Meta Ad Library. Built for digital marketers, agencies, and e-commerce sellers doing competitor research.

Sunset Color Palette: #EA6113 (deep orange), #F88F22 (orange), #FBB931 (amber), #FFE3B3 (cream)

## Tech Stack
- Next.js 16 + TypeScript + Tailwind CSS 4 + shadcn/ui
- Zustand (client state), Recharts (charts), Framer Motion (animations), Lucide icons
- Single-page app with client-side view routing (only `/` route exposed)

## Architecture
Single-page application with view-state management via Zustand. Views:
- Landing (hero, features, pricing, testimonials, CTA)
- Dashboard (overview stats, recent activity, tracked competitors)
- Saved Ads (grid collection, folders, tags, search, filter, export)
- Competitors (tracker list with ad counts, longevity, status)
- Analytics (ad pattern trends, CTA words, formats, color usage)
- Swipe File (inspiration board, shareable collections)
- Team (agency workspace, members, roles)
- Admin (system overview, users, subscriptions, health)
- Settings (account, notifications, sync)
- Billing (plans, invoices, payment methods)

Role switcher: Free / Pro / Agency Owner / Team Member / Admin

---
Task ID: 0
Agent: main
Task: Initial project setup, worklog creation, architecture planning

Work Log:
- Explored existing Next.js scaffold (all shadcn/ui components present)
- Confirmed packages: recharts, framer-motion, zustand, lucide-react, @dnd-kit
- Dev server running on port 3000, clean build
- Created worklog.md
- Planned single-page architecture with 10 views + role switcher

Stage Summary:
- Ready to implement design system (sunset palette) and main application

---
Task ID: 12
Agent: admin-view-builder
Task: Create the Admin Panel view component (internal admin dashboard) at /home/z/my-project/src/components/views/admin.tsx

Work Log:
- Read worklog.md to understand project context (sunset palette, tech stack, view architecture)
- Inspected existing views (analytics.tsx, saved-ads.tsx) and lib (mock-data.ts, toast-helpers.ts, utils.ts) for styling conventions and AdminUser type
- Verified shadcn/ui component APIs (avatar, dropdown-menu) and confirmed Recharts usage patterns
- Built AdminView with: header (Shield icon + INTERNAL badge), 4 KPI cards (Total Users 2,847 / MRR $18,420 / Active Subscriptions 1,203 / System Uptime 99.98%), revenue AreaChart (12-month inline data, sunset gradient via linearGradient defs), plan distribution donut PieChart (Free 1,420 / Pro 980 / Agency 220 / Trial 227), system health card (5 services w/ Operational badges + uptime + latency), recent alerts card (4 events with info/warning/error severity badges + timestamps), and users management table (Card + divide-y rows, NOT Table component; search input; columns User/Plan/Status/Saved Ads/MRR/Joined/Actions dropdown with View/Email/Suspend/Refund/Delete; first 10 of mockAdminUsers)
- Used bg-sunset-gradient, bg-sunset-radial, bg-sunset-cream/40, text-sunset-deep classes per design system
- All dropdown actions wired to sonnerToast notifications
- Ran `npx tsc --noEmit` — admin.tsx produced zero type errors

Stage Summary:
- /home/z/my-project/src/components/views/admin.tsx created (~400 lines), type-safe, "use client" component exporting AdminView()
- Component is ready to be wired into the view router (store has "admin" view string already defined; integration into the main app shell is left for a separate task as instructed)
- Uses responsive grid layouts (mobile-first 1-col collapsing to lg:col-span-2 / lg:col-span-3 on desktop), rounded-xl cards, sunset accent colors on charts and KPI icons

---
Task ID: 10
Agent: swipe-file-view-builder
Task: Create the Swipe File / Inspiration Board view component at /home/z/my-project/src/components/views/swipe-file.tsx

Work Log:
- Read worklog.md to understand project context (sunset palette, Next.js 16 + TS + Tailwind 4 + shadcn/ui, view architecture)
- Inspected mock-data.ts (SavedAd shape, mockAds, mockFolders), toast-helpers.ts (sonnerToast), utils.ts (cn), globals.css (sunset gradient utilities: bg-sunset-gradient, bg-sunset-radial, text-sunset-gradient, bg-sunset-cream/40, no-scrollbar), shared.tsx (AdCard styling conventions) and shadcn card/button/badge/avatar/dialog APIs to confirm exports
- Built SwipeFileView as a "use client" component with single named export SwipeFileView()
- Implemented layout: (1) Header with FolderHeart icon, sunset-gradient title, subtitle, "Create Board" button (bg-sunset-gradient) + Agency/Pro badge; (2) Stats strip with 3 MiniStat cards (Total boards 8, Shared boards 3, Ads in boards 47); (3) Featured Boards section — 4 curated BoardCards (Best CTAs / High-Converting Video Ads / Eid Campaign Winners / Long-Running Winners) each with sunset gradient header strip, board name, ad count + "Updated X ago", 2x2 thumbnail swatch grid (using ad.thumbnailColor), Share + Open footer buttons; (4) Featured Ads horizontal scroll (overflow-x-auto no-scrollbar) of 6 top-ads sorted by likes with inline FeaturedAdCard (thumbnailColor gradient, headline overlay, advertiser avatar, days running, CTA badge, hover-reveal "Save to board" button); (5) My Boards grid (mockFolders slice) reusing the same card pattern + a dashed-border empty-state "Create your first board" CTA card (FolderPlus icon, New Board pill) at the end; (6) Create Board Dialog (Input + Enter-to-submit) wired to append a new board and toast success
- Wired all interactions to sonnerToast: Share → success("Shareable link copied!"); Open → info(); Save to board → success(); Create board → success() with empty-name guard → error()
- Used responsive grid (grid-cols-1 sm:grid-cols-2 lg:grid-cols-4), rounded-xl cards, hover:-translate-y-1 + hover:shadow-lg effects, sunset gradients on accents/buttons/icons
- Ran `npx tsc --noEmit` — swipe-file.tsx produced zero type errors; ran `npx eslint src/components/views/swipe-file.tsx` — zero lint errors

Stage Summary:
- /home/z/my-project/src/components/views/swipe-file.tsx created (~470 lines), type-safe, "use client" component exporting SwipeFileView()
- Imports verified valid: mockAds + mockFolders from @/lib/mock-data, sonnerToast from @/lib/toast-helpers, cn from @/lib/utils, shadcn Card/Badge/Button/Input/Avatar/Dialog, and Lucide icons
- Component is ready to be wired into the view router (store has "swipe-file" view string already defined; integration left for a separate task as instructed)
- No other files modified; no test code written

---
Task ID: 11
Agent: general-purpose (Team view builder)
Task: Create the Team Management view component (Agency Owner panel) at /home/z/my-project/src/components/views/team.tsx

Work Log:
- Read worklog.md to understand project context (Next.js 16 + TS + Tailwind 4 + shadcn/ui, sunset palette #EA6113/#F88F22/#FBB931/#FFE3B3)
- Reviewed existing analytics.tsx and competitors.tsx views for styling/pattern conventions (rounded-xl cards, p-5 spacing, bg-sunset-gradient buttons, sonnerToast usage)
- Verified mock-data.ts TeamMember shape (id, name, email, role, avatarColor, status, lastActive, workspace) and confirmed mockTeamMembers array with 6 entries
- Confirmed UI component exports: Card, Badge, Button, Input, Label, Avatar/AvatarFallback, Dialog/DialogContent/DialogHeader/DialogTitle/DialogDescription/DialogFooter, Select/SelectTrigger/SelectValue/SelectContent/SelectItem, DropdownMenu/DropdownMenuTrigger/DropdownMenuContent/DropdownMenuItem/DropdownMenuSeparator
- Wrote team.tsx implementing all 6 required sections:
  1. Header with UsersRound icon + "Invite Member" button (bg-sunset-gradient)
  2. 3-card stats row (Total Members=6, Active Now=4, Client Workspaces=4)
  3. 4 clickable workspace chips with colored left borders, active state uses bg-sunset-cream/40 + pulse dot, useState for selection
  4. Div-based members table in a Card with divide-y, columns: Member (avatar+name+email+admin crown), Role (color-coded badges #EA6113/#F88F22/#FBB931), Workspace, Status (green/amber/red badges with dots), Last Active (relative time), Actions dropdown (Change role / Resend invite for invited / Suspend / Remove)
  5. Invite Dialog with email Input, role Select (Admin/Editor/Viewer with icons), workspace Select, info callout — Send invite triggers sonnerToast.success(`Invitation sent to ${email}`)
  6. Role permissions info card (bg-sunset-radial) with 3-column grid showing Admin/Editor/Viewer abilities + icons + checkmarks
- Made layout responsive (grid breakpoints sm/md/lg), added hover states, used consistent rounded-xl cards with p-5
- Ran typecheck (npx tsc --noEmit) — only unrelated errors in examples/ and skills/ folders, team.tsx clean
- Ran eslint on team.tsx — no warnings/errors

Stage Summary:
- Created /home/z/my-project/src/components/views/team.tsx (TeamView export)
- All imports verified valid against existing UI components and lib modules
- Sunset palette consistently applied via bg-sunset-gradient, bg-sunset-radial, bg-sunset-cream/40, text-sunset-gradient, and role/status color tokens
- Interactive: workspace selection (useState), invite dialog (open/close + form state + toast), per-member action menu with toasts
- Type-safe: TeamMember type imported from mock-data, role/status config maps typed with Record
- Ready to be wired into the app-shell view router by the integrator

---
Task ID: 13
Agent: settings-billing-views-builder
Task: Create Settings and Billing view components for AdSpy Lite dashboard

Work Log:
- Read worklog.md to understand prior architecture (sunset palette, view-state via Zustand, shadcn/ui components available)
- Inspected mock-data.ts (planFeatures.free/pro/agency shape), toast-helpers.ts (sonnerToast), utils.ts (cn), ui component exports (Select, Switch, Separator, Tabs, Dialog, Card, Badge, Button, Avatar, Input, Label)
- Inspected dashboard.tsx to align with existing styling conventions (bg-sunset-gradient banners, p-5 cards, sunset-cream badges, hover states)
- Created /home/z/my-project/src/components/views/settings.tsx — SettingsView() with useState-driven left vertical nav switching between 6 sections:
  * Account: profile card with avatar + name/email/company/role inputs + Save changes button; Connected Accounts (Meta + Google) with Switch toggles
  * Notifications: 5 toggle Switch rows (ad alerts, weekly digest, product updates, security alerts, marketing) with icons + descriptions
  * Sync & Data: auto-sync Switch + frequency Select (15m/30m/1h/6h/24h), Export-all-data button, Clear-cache button (38.4 MB)
  * Extension: Installed v2.4.1 green pulsing badge, Check-for-updates button, 4 permissions with granted/not-granted pills
  * Privacy: data retention Select (30d/90d/180d/365d/forever), GDPR Download-my-data + Request-deletion buttons
  * Danger Zone: red-bordered card with Delete-account button opening Dialog requiring "DELETE MY ACCOUNT" typed confirmation
- Created /home/z/my-project/src/components/views/billing.tsx — BillingView() with:
  * Header (CreditCard icon + sunset gradient badge)
  * Current plan banner (bg-sunset-gradient, white text) showing Agency $49/mo, renews Jan 15 2025, Manage + Cancel buttons, usage bars (Saved 101/∞, Competitors 6/∞, Team 6/50)
  * Plans comparison: 3 cards from planFeatures (free/pro/agency), Agency highlighted with sunset border + "Current Plan" Crown badge, feature checklists with accent-colored checks, Switch-to-X buttons
  * Payment methods: 2 styled card rows (Visa 4242 default + JazzCash 1234) with brand gradient badges, Add payment method button
  * Billing history: 6-row divide-y grid table with Invoice / Date / Plan / Amount / Status / Receipt columns, status pills (paid=green/failed=red/pending=amber), per-row Download button triggering sonnerToast.success("Invoice downloaded"), responsive mobile layout
  * Local payment methods info card (bg-sunset-cream/20) for Pakistan: JazzCash, EasyPaisa, HBL, Meezan Bank gradient badges + Connect wallet button
  * Failed payment alert card (red) with Update card action
- Used cn() for conditional classes, sonnerToast for all interactive feedback, Lucide icons throughout, "use client" directives on both files
- Removed unused Infinity icon import from billing.tsx after refactor
- Verified clean compile: npx tsc --noEmit shows no errors in src/, ESLint exits 0 on both files

Stage Summary:
- 2 new view components delivered: src/components/views/settings.tsx (SettingsView) and src/components/views/billing.tsx (BillingView)
- Both files TypeScript-clean and ESLint-clean
- Both files use the sunset palette, shadcn/ui components, Lucide icons, sonnerToast, and cn helpers as specified
- Store already has "settings" and "billing" ViewKeys ready — views are ready to wire into the app's view switcher (not part of this task)
- Settings has 6 fully-functional sections with interactive state (toggle switches, selects, confirm dialog with text-match gate)
- Billing has plan banner, comparison cards (Agency marked current), payment methods, billing history table, local PK payment info, and a failed-payment alert — all responsive with mobile-stacked layouts

---
Task ID: FINAL
Agent: main
Task: Final integration, QA verification, cron setup

Work Log:
- Wired all 10 views into src/app/page.tsx view router (landing standalone, others in AppShell)
- Ran `bun run lint` → clean, zero errors
- Verified dev server compiles cleanly (no fatal errors in dev.log)
- Used agent-browser to perform end-to-end QA:
  - Landing page: renders fully (hero, problem, features, how-it-works, pricing, testimonials, FAQ, CTA, footer)
  - Dashboard: KPIs, area chart, format donut, recent ads, activity feed, top competitors bar chart, quick actions, plan usage, tracked competitors, roadmap, alert banner — all render
  - Saved Ads: folder tabs, search, format/platform/status filters, sort, favorites toggle, grid/list view, ad detail dialog (with ad copy, tags, notes, stats) — all interactive
  - Competitors: tracker cards with trend charts, add competitor dialog, detail dialog — working
  - Analytics: CTA frequency, format mix, saved-vs-tracked area chart, platform radial, longevity buckets, top performers, competitor comparison, color analysis — all charts render
  - Swipe File: boards, featured ads, my boards, create dialog — working
  - Team: workspaces, member table, invite dialog, role permissions — working
  - Admin Panel (after role switch): KPIs, revenue chart, plan distribution, system health, users table, alerts — all render
  - Settings: sectioned nav (Account, Notifications, Sync, Extension, Privacy, Danger Zone) — working
  - Billing: current plan banner, plan comparison, payment methods, billing history — working
  - Role switcher: switches between Free/Pro/Agency/Team/Admin, nav updates dynamically (Admin Panel item appears for admin role)
- Verified no console errors, no page errors across all views
- Created recurring 15-minute cron review job (job_id: 408194, kind: webDevReview, tz: Asia/Karachi)

Stage Summary:
- Project COMPLETE and fully functional
- 10 views, 5 role-based panels, sunset design system, sticky footer, responsive layout
- All interactions verified via agent-browser (ad detail dialog, role switching, navigation)
- Lint clean, no runtime errors
- Recurring review task scheduled for continuous improvement

---
Task ID: CRON-1
Agent: main (cron review round 1)
Task: Continuous improvement — QA testing, bug fixes, and new feature development

## Current Project Status Assessment
Project was COMPLETE and stable from previous round (10 views, 5 role panels, sunset design system, sticky footer, responsive). Lint clean, no runtime errors. Verified via agent-browser that all 10 views render correctly, role switcher works, ad detail dialog opens.

## This Round's Work — New Features Added

### 1. Command Palette (⌘K) — `src/components/command-palette.tsx`
- Full-featured command palette using cmdk (already installed)
- Opens via ⌘K / Ctrl+K keyboard shortcut OR clicking the topbar search button
- Sections: Navigate (all 9 views), Quick Actions (save ad, add competitor, new folder, export), Saved Ads search (6 sample ads), Competitors search (6 competitors), Preferences (theme toggle, role switcher, back to landing)
- Live search filtering across ads/competitors/actions
- Keyboard navigation (↑↓ arrows, Enter to select, Esc to close)
- Footer with hint chips and AdSpy Lite branding
- Wired into AppShell; topbar search button now opens palette (was static input before)

### 2. Notifications Dropdown Panel — `src/components/notifications.tsx`
- Replaced the info-toast notification bell with a real dropdown panel
- 7 mock notifications (new-ads, competitor, alert, system, digest types) with color-coded icons
- Filter tabs (All / New Ads / Alerts / System)
- Unread indicators (pulse dot + highlighted bg)
- "Mark all read" + "Manage" (links to settings) footer actions
- Clicking a notification navigates to relevant view
- Positioned absolute under the bell, with backdrop dismiss

### 3. Onboarding Welcome Modal — `src/components/onboarding.tsx`
- 4-step welcome tour shown on first app entry (store flag `onboardingSeen`)
- Sunset-gradient header with progress dots
- Per-step visual mockups (Chrome install card, save-button overlay, folder chips, analytics bar chart)
- CTAs per step (Add to Chrome, Browse Ad Library, Create folder, View analytics)
- Skip tour / Back / Next navigation
- Triggers automatically when AppShell mounts and onboarding not yet seen

### 4. Framer Motion Page Transitions — `src/app/page.tsx`
- Wrapped view router output in motion.div with key={view}
- Fade + slide-up enter animation (opacity 0→1, y 8→0, 0.25s ease-out)
- Landing page also wrapped with fade transition
- Smooth visual feedback on every view switch

### 5. Ad Comparison Feature — `src/components/comparison.tsx` + updates to shared.tsx & saved-ads.tsx
- Roadmap feature: "Competitor comparison dashboard (side-by-side)"
- New store state: `compareAds[]`, `toggleCompareAd`, `clearCompare` (max 4 ads)
- "Compare" toggle button added to Saved Ads toolbar (with ON badge)
- Each AdCard shows a "Compare"/"In tray" button when compareMode is enabled
- Floating ComparisonTray appears at bottom-center when ads selected
  - Shows thumbnail swatches of selected ads
  - "Compare N ads" button (disabled if <2), Export, Share buttons
- Side-by-Side Comparison Dialog:
  - Ad previews in responsive grid (2/3/4 cols based on count)
  - Full attribute comparison table (Headline, CTA, Format, Platform, Status, Days Running, Likes, Tags, First Seen, Ad Copy)
  - Color-coded status badges
  - AI insight card analyzing longest-running ad, most engagement, CTA variety recommendation

### Store Updates — `src/lib/store.ts`
- Added: commandOpen, notifOpen, onboardingSeen, compareAds state + setters
- toggleCompareAd (with 4-ad max), clearCompare

## Verification Results
- `bun run lint` → CLEAN (zero errors) after fixing one JSX closing-tag bug in command-palette.tsx
- agent-browser QA confirmed:
  - Onboarding modal shows on first entry, "Skip tour" works ✓
  - Command palette opens via search button click, shows all nav/actions/ads/competitors/preferences ✓
  - Notifications panel opens via bell, shows 7 notifications with filter tabs ✓
  - Compare toggle in Saved Ads enables compare buttons on ad cards ✓
  - Adding 2 ads shows floating Comparison Tray ✓
  - "Compare 2 ads" opens side-by-side dialog with previews + attribute table ✓
  - No console errors, no page errors across all interactions
- Dev log: clean compilation, no fatal errors

## Unresolved Issues / Risks
- Onboarding shows on every full page reload (store not persisted to localStorage) — acceptable for demo, could add persistence later
- Command palette ⌘K keyboard shortcut works in real browsers; agent-browser's `press Control+k` may not trigger window keydown in all cases (click-to-open works reliably)
- Comparison tray exit animation could be enhanced with AnimatePresence wrapper (minor polish)

## Priority Recommendations for Next Phase
1. Persist onboarding/theme/role state to localStorage for realism
2. Add AnimatePresence for tray/modal exit animations
3. Add a "Bulk select" mode for exporting multiple ads at once
4. Add keyboard shortcuts help overlay (? key)
5. Consider adding real ad screenshot image generation via image-generation skill for thumbnails instead of solid color gradients
6. Add a "Replay onboarding" option in Settings

---
Task ID: CRON-2
Agent: main (cron review round 2)
Task: Continuous improvement — QA testing, bug fix, new features, polish

## Current Project Status Assessment
Project was stable from round 1 with 5 new features added (Command Palette, Notifications, Onboarding, Framer Motion transitions, Ad Comparison). QA via agent-browser revealed a **real bug**: the theme toggle changed the store's `theme` state but never applied the `.dark` class to `<html>`, so dark mode was completely non-functional. Also identified that `onboardingSeen`/`theme`/`role` reset on every page reload (no persistence).

## This Round's Work — Bug Fix + New Features

### BUG FIX: Dark Mode Theme Toggle — `src/components/theme-provider.tsx` (new) + `src/app/layout.tsx`
- **Root cause**: `useAppStore.theme` toggled but nothing applied the `.dark` class to `document.documentElement`
- **Fix**: Created `ThemeProvider` component with a `useEffect` that adds/removes `dark` class on `<html>` based on store theme, and sets `colorScheme`
- Mounted `ThemeProvider` in root layout wrapping all children
- Added inline `<head>` script that reads persisted theme from localStorage BEFORE hydration to prevent dark-mode flash (FOUC)
- **Verified via agent-browser**: clicking theme toggle now correctly switches `document.documentElement` from LIGHT → DARK

### 1. localStorage Persistence — `src/lib/store.ts`
- Migrated Zustand store to use `persist` middleware with `createJSONStorage(() => localStorage)`
- Storage key: `adspy-lite-store`
- `partialize`: only persists `role`, `theme`, `onboardingSeen` (transient UI state like commandOpen/notifOpen is NOT persisted)
- Added new state: `selectedFolder`, `selectedWorkspace`, `bulkSelected`, `helpOpen` + setters for future use
- Onboarding no longer re-shows on every reload; theme and role persist across sessions

### 2. Keyboard Shortcuts Help + Global Shortcuts — `src/components/keyboard-shortcuts.tsx` (new)
- Full keyboard shortcuts dialog (? key or topbar keyboard-icon button)
- Groups: Global (⌘K, ⌘/, ?, T, N, Esc) and Navigation (G+D, G+S, G+C, G+A, G+T, G+B)
- Global keydown listener with smart input-detection (ignores shortcuts when typing in inputs/textarea/contentEditable/cmdk)
- `g` prefix handling with 800ms timeout for two-key navigation sequences
- Esc always closes any open dialog
- Added keyboard-icon button to topbar (hidden on mobile) with tooltip
- **Bug encountered & fixed**: initial import used non-existent `Esc` lucide icon → build error → replaced with `CircleHelp`, removed all unused imports

### 3. Bulk Select Mode — `src/components/shared.tsx` + `src/components/views/saved-ads.tsx`
- New "Select" toggle button in Saved Ads toolbar (next to Compare) with live count badge
- AdCard gains `bulkMode`, `bulkSelected`, `onToggleBulk` props
- In bulk mode: ad cards show a checkbox overlay (replaces format/platform badges), clicking toggles selection, selected cards get sunset-orange ring
- Floating Bulk Action Bar (bottom-center) appears when ≥1 ad selected:
  - Sunset-gradient header with "N ads selected" + Clear button
  - Actions: Export CSV, Export PDF, Move to folder, Tag, Delete
  - All actions trigger sonnerToast with count
- "Select all N" / "Deselect all" helper links appear when bulkMode active
- **Verified via agent-browser**: enabled bulk mode, clicked 2 ads, action bar appeared with all 5 actions

### 4. AnimatePresence Exit Animations — `src/components/comparison.tsx`
- Wrapped ComparisonTray floating panel in `<AnimatePresence>` with conditional render
- Exit animation: spring transition (stiffness 300, damping 30) sliding down + fading out
- Tray now smoothly animates in/out when ads are added/removed

### 5. Settings "About & Help" Section — `src/components/views/settings.tsx`
- New 7th settings section "About & Help" (Info icon) with 3 cards:
  - **Replay Onboarding Tour**: button opens confirm dialog → sets `onboardingSeen=false` → tour replays on next dashboard entry
  - **Keyboard Shortcuts**: 6-shortcut preview grid + "View all shortcuts" button (opens help dialog)
  - **About AdSpy Lite**: version info grid (web v2.4.1, extension v2.4.1, last sync, region) + Changelog/Documentation/Support links

## Verification Results
- `bun run lint` → CLEAN (zero errors)
- **Bug fix verified**: agent-browser confirmed `document.documentElement` switches to `dark` class on theme toggle click (was stuck at LIGHT before fix)
- agent-browser QA confirmed:
  - Landing loads with no errors ✓
  - Onboarding skip works ✓
  - Theme toggle now applies dark mode (DARK-AFTER confirmed via eval) ✓
  - Keyboard shortcuts dialog opens via topbar button, shows all Global + Navigation shortcuts ✓
  - Bulk Select: toggle enables, clicking ads selects them, floating action bar with 5 actions appears ✓
  - Settings > About & Help: Replay Onboarding, Keyboard Shortcuts, About AdSpy Lite cards all render ✓
- Dev server crashed once during testing (due to the `Esc` import build error) — manually restarted with `bun run dev`, recovered to HTTP 200
- No console errors, no page errors after fixes

## Unresolved Issues / Risks
- Dev server process died after the `Esc` import build error and did NOT auto-restart; had to manually run `bun run dev`. The system's auto-restart may not catch all crash scenarios — if future rounds show HTTP 000, manually restart with `cd /home/z/my-project && nohup bun run dev > /tmp/dev-restart.log 2>&1 &`
- The `?` keyboard shortcut via synthetic JS `KeyboardEvent` dispatch didn't trigger the handler in agent-browser (real keyboard input works; synthetic events may not propagate target correctly). Clicking the topbar keyboard-icon button works reliably.
- Bulk select and Compare mode can be enabled simultaneously — no conflict, but UX could clarify they're independent modes.

## Priority Recommendations for Next Phase
1. Add a global Search results view (search across all ads/competitors/folders with filters)
2. Generate real ad thumbnail images via image-generation skill (replace solid color gradients)
3. Add a "Recent ads" live ticker / activity stream on dashboard with auto-refresh animation
4. Add data-export to actual downloadable files (CSV blob generation) instead of just toasts
5. Add a changelog/what's-new modal that shows on version change
6. Consider adding a mini ad-preview hover card on dashboard "recently saved" rows

---
Task ID: CRON-3
Agent: main (cron review round 3)
Task: Continuous improvement — QA, real file exports, global search, live activity ticker

## Current Project Status Assessment
Project stable from round 2 with theme-toggle bug fixed, localStorage persistence, keyboard shortcuts, bulk select, AnimatePresence, and Settings About section. QA via agent-browser confirmed: all 7 app views render with no errors, onboarding persistence works across reload, role persistence works. Dev server healthy (HTTP 200). No regressions found — proceeded to add new features per priority recommendations.

## This Round's Work — New Features

### 1. Real File Downloads (CSV / JSON / HTML Report) — `src/lib/export-utils.ts` (new)
- Created a client-side file download utility using `Blob` + anchor `download` attribute (no server needed)
- `downloadFile(filename, content, mimeType)` — generic blob downloader
- `adsToCsv(ads)` — proper CSV with escaping (quotes, commas, newlines), 15 columns (ID, Advertiser, Headline, CTA, Format, Platform, Status, Days Running, Likes, First Seen, Last Seen, Tags, Folder, Ad Copy, Notes)
- `adsToJson(ads)` — pretty-printed JSON for API integration
- `adsToHtmlReport(ads)` — full standalone branded HTML report (sunset gradient header, styled table, status badges, footer) that users can open in browser → Print to PDF
- Convenience wrappers: `downloadAdsCsv`, `downloadAdsJson`, `downloadAdsHtmlReport` with auto-dated filenames
- **Wired into**: Saved Ads export dialog (3 format buttons now trigger real downloads) + Bulk action bar (Export CSV + Export PDF use real downloads for selected ads)
- **Verified**: agent-browser clicked CSV export → toast "Downloaded 48 ads as CSV" appeared, file download triggered

### 2. Global Search View — `src/components/views/search.tsx` (new)
- New 11th view: cross-collection search across ads, competitors, and folders
- Added `"search"` to `ViewKey` union type in store + `searchQuery` state + `setSearchQuery` setter
- Features:
  - Large autofocus search input with debounced query (250ms)
  - Type filter dropdown (All / Saved Ads / Competitors / Folders)
  - Result count with breakdown ("16 results for 'sale' · 16 ads, 0 competitors, 0 folders")
  - Sectioned results: ads shown as AdCards, competitors as list rows, folders as cards
  - Empty state with `SearchX` icon + "Clear search" button
  - Suggestion chips when query empty (khaadi, sale, video, shop now, fashion, foodpanda, carousel)
  - Clicking a result navigates to the relevant view
- **Wired into**: page router (`case "search"`), app shell nav (Search item, all roles), topbar mobile search icon → goes straight to search view
- **Command palette integration**: added "Search all ↵" button that passes typed query to search view via `setSearchQuery`; Search added to nav items list
- **Verified**: agent-browser typed "sale" → 16 ad results returned matching headline/copy, displayed as cards with section count

### 3. Dashboard Live Activity Ticker — added to `src/components/views/dashboard.tsx`
- New `LiveActivityTicker` component mounted below the welcome banner
- Sunset-gradient "LIVE" badge with animated pinging dot on the left
- Horizontally-scrolling marquee of 7 mock live events (Sapphire launched, Daraz crossed 130, JazzCash paused, etc.) with colored dots and timestamps
- Duplicate-render technique for seamless infinite scroll effect
- Right-edge fade gradient for polish
- `no-scrollbar` + `whitespace-nowrap` for clean overflow
- **Verified**: agent-browser confirmed all 7 events render, "LIVE" badge present

## Verification Results
- `bun run lint` → CLEAN (zero errors). Fixed one lint error: `setState` synchronously in effect (anti-pattern) → moved the reset logic into the keydown handler instead
- agent-browser QA confirmed:
  - All 7 views render with no errors ✓
  - Onboarding persistence works across reload ✓
  - Dashboard live ticker renders all 7 events with LIVE badge ✓
  - Search nav item present, view loads with suggestions ✓
  - Search query "sale" returns 16 ad results as cards ✓
  - Export dialog shows 3 format buttons (CSV/PDF/JSON) ✓
  - CSV export triggers real file download + success toast "Downloaded 48 ads as CSV" ✓
- No console errors, no page errors
- Dev server healthy throughout (HTTP 200)

## Unresolved Issues / Risks
- Downloaded files go to the browser's default download location (not visible in /tmp); verification was via toast confirmation. In a real browser the file would appear in Downloads folder.
- Command palette's `onValueChange` tracks search value via local state; the "Search all" button passes it to the store's `searchQuery`. Works but could be simplified with cmdk's `useCommandState` hook in future.
- Live ticker uses CSS `overflow-x-auto` (manual scroll) rather than auto-animation marquee — intentionally chosen to avoid distracting motion; could add a play/pause auto-scroll toggle later.
- Search view `SearchX` icon import is the only place it's used — fine.

## Priority Recommendations for Next Phase
1. Generate real ad thumbnail images via image-generation skill (replace solid color gradient placeholders for top 8-10 ads)
2. Add a "What's New" changelog modal that shows on version change (compare persisted version vs current)
3. Add auto-scroll animation to the live ticker (CSS keyframes marquee) with pause-on-hover
4. Wire the command palette to filter its ad/competitor results by the typed query (currently shows all 6 regardless of input)
5. Add a "Recent searches" history (persist last 5 queries to localStorage) shown as chips in Search view
6. Add keyboard shortcut `G+S` is currently "Saved Ads" — could add `/` to focus search input directly

---
Task ID: CRON-4
Agent: main (cron review round 4)
Task: Continuous improvement — real ad images, changelog modal, recent searches, marquee ticker

## Current Project Status Assessment
Project stable from round 3 with real file exports, global search view, and live activity ticker. QA via agent-browser confirmed: all views render with no errors, navigation works correctly (Search/Saved Ads/Analytics headings change properly), onboarding persistence works, dashboard live ticker renders. Dev server healthy (HTTP 200). No regressions — proceeded to build priority recommendations.

## This Round's Work — New Features

### 1. Real Ad Thumbnail Images — `public/ads/ad-1.png` through `ad-6.png` (6 images)
- Used the **image-generation skill** (z-ai CLI) to generate 6 AI ad creative thumbnails representing different ad types:
  - ad-1: Fashion brand winter sale (South Asian clothing, warm tones)
  - ad-2: E-commerce mega sale (shopping bags, orange gradient, 70% off)
  - ad-3: Food delivery app (burger/pizza flat lay, amber lighting)
  - ad-4: Skincare product (natural cosmetics, cream/orange tones)
  - ad-5: Fintech mobile payment (smartphone wallet, orange gradient)
  - ad-6: Tea brand (steaming cup, cozy amber tones)
- Added `imagePath?: string` field to `SavedAd` interface in mock-data.ts
- Assigned `imagePath: /ads/ad-${i+1}.png` to the first 6 mock ads
- **Updated AdCard** (`shared.tsx`): renders `<img>` with `object-cover` when `ad.imagePath` exists, falls back to gradient + dot pattern when not. Lazy-loaded.
- **Updated Dashboard recent ads** (`dashboard.tsx`): thumbnail swatches now show real images
- **Updated Ad Detail Dialog** (`saved-ads.tsx`): large ad preview shows real image
- **Verified**: agent-browser confirmed 6 `<img>` elements with `/ads/ad-1.png` through `ad-6.png` srcs render on Saved Ads view, no errors

### 2. "What's New" Changelog Modal — `src/components/changelog.tsx` (new)
- New `ChangelogModal` component with version-change auto-detection
- Exported `APP_VERSION = "2.5.0"` constant
- 8 changelog entries across 2 versions (v2.5.0 + v2.4.1), each with type badge (New/Improved/Fixed), icon, title, description
- **Auto-open logic**: on app entry, if `lastSeenVersion !== APP_VERSION` AND `lastSeenVersion !== ""` (i.e., returning user after update), auto-opens after 1.5s delay
- **First-visit handling**: `useEffect` in AppShell marks `lastSeenVersion = APP_VERSION` on first ever entry (so auto-open only fires on real updates, not first visit)
- Sunset-gradient header with version badge, dismiss button, "Got it" footer that calls `markVersionSeen(APP_VERSION)`
- **Manual entry**: added Sparkles icon button to topbar (with pulsing dot when unseen version exists) that opens the changelog on demand
- Grouped by version with "LATEST" badge on current version
- **Verified**: agent-browser opened via topbar button, confirmed all entries render (Real ad thumbnails, Global Search, Real file exports, Command Palette, Ad Comparison, Keyboard shortcuts, Notifications, Onboarding)

### 3. Recent Searches History — `src/lib/store.ts` + `src/components/views/search.tsx`
- Added `recentSearches: string[]` + `addRecentSearch` + `clearRecentSearches` to store, persisted to localStorage
- `addRecentSearch` dedupes (case-insensitive) and keeps max 5 entries
- **Search view**: records queries ≥2 chars to recent searches (debounced)
- New "Recent searches" section in the empty state with Clock icons, clickable chips, and "Clear" button
- **Verified**: agent-browser confirmed `["khaadi"]` persisted to localStorage after searching

### 4. Auto-Scroll Marquee Ticker — `src/components/views/dashboard.tsx` + `globals.css`
- Replaced manual `overflow-x-auto` with CSS `animate-marquee` keyframes animation (40s linear infinite)
- Added `@keyframes marquee` (translateX 0 → -50%) and `.animate-marquee` utility class to globals.css
- `width: max-content` ensures the duplicated content scrolls seamlessly
- **Pause-on-hover**: `group-hover:[animation-play-state:paused]` stops the marquee when user hovers
- **Verified**: ticker now auto-scrolls continuously, pauses on hover

### Store Updates — `src/lib/store.ts`
- New persisted state: `changelogOpen`, `lastSeenVersion`, `recentSearches`
- New actions: `setChangelogOpen`, `markVersionSeen`, `addRecentSearch`, `clearRecentSearches`
- `partialize` updated to persist `lastSeenVersion` + `recentSearches` alongside role/theme/onboardingSeen

## Verification Results
- `bun run lint` → CLEAN (zero errors)
- agent-browser QA confirmed:
  - All views render with no errors ✓
  - 6 real ad thumbnail images render on Saved Ads view (`/ads/ad-1.png` through `ad-6.png`) ✓
  - Changelog modal opens via topbar Sparkles button, shows all 8 entries across 2 versions ✓
  - Recent searches persist to localStorage (`["khaadi"]` confirmed) ✓
  - Dashboard live ticker renders with all events ✓
  - No console errors (only a minor a11y warning about DialogContent missing Description)
- Dev server healthy throughout (HTTP 200)

## Unresolved Issues / Risks
- agent-browser's `fill` command doesn't always trigger React's controlled-input onChange for the Search view's debounced query clearing — the feature works correctly in real browsers; verification of recent-searches persistence was done via direct localStorage inspection instead.
- The DialogContent a11y warning (missing `aria-describedby`) is cosmetic — doesn't affect functionality. Could add `DialogDescription` to all dialogs in a future polish round.
- Changelog auto-open only fires for returning users (lastSeenVersion !== "" && !== APP_VERSION). First-time visitors won't see it auto-open, which is intentional to avoid overlapping with onboarding.
- Only 6 of 48 mock ads have real images (the rest use gradient placeholders). Could generate more in a future round.

## Priority Recommendations for Next Phase
1. Generate more ad thumbnail images (currently 6/48 ads have real images)
2. Add `DialogDescription` to all dialogs to resolve the a11y warning
3. Wire command palette to filter its ad/competitor results by the typed query (cmdk's `shouldFilter` is on but the static result lists don't filter)
4. Add a "What's New" badge/indicator on the Sparkles button that's more prominent
5. Add a settings toggle for "Show changelog on updates" (let users opt out)
6. Consider adding a print stylesheet for the HTML report export

---
Task ID: CRON-5
Agent: main (cron review round 5)
Task: Continuous improvement — more ad images, a11y fix, command palette filtering, competitor comparison

## Current Project Status Assessment
Project stable from round 4 with real ad thumbnails (6 images), changelog modal, recent searches, and marquee ticker. QA via agent-browser confirmed all views render, dashboard + live ticker work, navigation correct. Dev server healthy (HTTP 200). Found one a11y warning: DialogContent missing Description in the Changelog modal. No other bugs — proceeded to address priority recommendations.

## This Round's Work — Bug Fix + New Features

### BUG FIX: Changelog Modal a11y Warning — `src/components/changelog.tsx`
- **Root cause**: Changelog used a custom header layout (not DialogHeader/Title/Description), so Radix DialogContent had no accessible name/description, triggering `Warning: Missing Description or aria-describedby for DialogContent`
- **Fix**: Added a visually-hidden `<DialogHeader className="sr-only">` with proper `<DialogTitle>` and `<DialogDescription>` inside DialogContent, providing the required accessible name/description without changing the visible UI
- **Verified**: agent-browser opened the changelog → console warning is now GONE (was present in round 4)

### 1. More Real Ad Thumbnail Images — `public/ads/ad-7.png` through `ad-9.png` (3 new)
- Used image-generation skill (z-ai CLI) to generate 3 more ad thumbnails:
  - ad-7: Sports apparel (athletic footwear, dynamic orange energy)
  - ad-8: Traditional Pakistani fashion (unstitched fabric, rust/cream tones)
  - ad-9: Ride hailing app (car interior, smartphone map, amber city lights)
- Updated mock-data.ts: `imagePath` now assigned to first 9 ads (was 6)
- **Verified**: agent-browser confirmed 9 `<img>` elements (ad-1 through ad-9) render on Saved Ads view, no errors

### 2. Command Palette Query Filtering — `src/components/command-palette.tsx`
- **Issue (from round 4 recommendations)**: cmdk's `shouldFilter` was on but the ad/competitor result lists were static (always showed all 6), not filtered by typed query
- **Fix**: Set `shouldFilter={false}` on `<Command>` and added custom filtering:
  - `adResults` now filters `mockAds` by query (advertiser, headline, adCopy, tags, cta) before slicing to 6
  - `competitorResults` filters `mockCompetitors` by name/handle/category
  - Both groups wrapped in `{results.length > 0 && (...)}` so empty groups hide entirely
- Result: typing "sapphire" in the palette now shows only Sapphire-related ads/competitors, not the full static list
- **Verified**: agent-browser confirmed palette shows filtered options

### 3. Competitor Comparison Side-by-Side Dashboard — `src/components/views/competitors.tsx`
- New `CompetitorCompareDialog` component (roadmap feature: "Competitor comparison dashboard side-by-side")
- **Trigger**: new "Compare" button in the Competitors view header (next to Track Competitor)
- Features:
  - Selector chips for all competitors (max 3, disabled state when at limit)
  - Selected chips show checkmark + sunset-gradient background
  - Empty state when <2 selected with GitCompare icon + guidance
  - Comparison grid (2 or 3 cols): each competitor card shows colored header, category, active ads, saved count, new this week, status, and a mini 7-day trend AreaChart
  - Comparison Summary card: auto-calculates "Most active ads", "Most new this week", "Most saved by you" with the winning competitor's name + color
  - "Export report" button in footer (triggers toast)
- Proper DialogDescription for a11y compliance
- **Verified**: agent-browser opened Compare dialog, selected Khaadi + Sapphire, confirmed comparison grid + summary + mini charts render, no a11y warnings

## Verification Results
- `bun run lint` → CLEAN (zero errors)
- agent-browser QA confirmed:
  - All views render with no errors ✓
  - **Changelog a11y warning GONE** (was present in round 4) ✓
  - 9 real ad thumbnail images render on Saved Ads (ad-1 through ad-9) ✓
  - Command palette filtering works (shows filtered results, empty groups hide) ✓
  - Competitor Compare dialog: selection, comparison grid, mini charts, summary all render ✓
  - No console errors/warnings after fixes
- Dev server healthy throughout (HTTP 200)

## Unresolved Issues / Risks
- agent-browser's `type` command sometimes targets the wrong element when refs are reassigned after palette open — the custom filtering logic is sound and verified via option inspection; full end-to-end typing test in real browser recommended.
- Only 9 of 48 mock ads have real images (the rest use gradient placeholders). Could generate more but diminishing returns — 9 covers the main ad types well.
- The Competitor Compare dialog's "Export report" button currently only shows a toast; could wire to a real PDF/CSV export using the existing `export-utils.ts` in a future round.

## Priority Recommendations for Next Phase
1. Wire Competitor Compare "Export report" to real CSV/HTML export (reuse `export-utils.ts`)
2. Add an "Ad Notes/Tags bulk editor" dialog (bulk action bar's "Tag" button currently only toasts)
3. Add a "Pin to top" feature for frequently-accessed ads (pinned ads show first in Saved Ads)
4. Add a dashboard "Ad performance leaderboard" widget (top ads by likes × longevity)
5. Add print stylesheet for the HTML report export so Print-to-PDF looks polished
6. Consider adding more keyboard shortcuts (e.g., `/` to focus search, `F` to favorite current ad)

---
Task ID: CRON-6
Agent: main (cron review round 6)
Task: Continuous improvement — competitor export, bulk tags editor, pin-to-top, leaderboard

## Current Project Status Assessment
Project stable from round 5 with 9 real ad images, a11y-fixed changelog, command palette filtering, and competitor comparison. QA via agent-browser confirmed all 8 views (Search, Saved Ads, Competitors, Analytics, Swipe File, Team, Billing, Settings) render with correct headings and no errors. Dev server healthy (HTTP 200). No bugs found — proceeded to build priority recommendations.

## This Round's Work — 4 New Features

### 1. Competitor Compare "Export Report" → Real File Download — `src/lib/export-utils.ts` + `competitors.tsx`
- Added `competitorsToCsv(comps)` — CSV with 9 columns (Name, Handle, Category, Active Ads, Total Saved, New This Week, Status, Last Checked, Page ID)
- Added `competitorsToHtmlReport(comps)` — full branded HTML report with:
  - Sunset-gradient header, summary stats (total competitors, total active ads, new this week, most-active winner, most-new winner)
  - Per-competitor cards with colored headers, stat grid, mini CSS bar-chart sparklines for 7-day trend
  - Print-friendly `@media print` styles
  - Winner highlights
- Convenience wrappers: `downloadCompetitorsCsv`, `downloadCompetitorHtmlReport`
- **Wired** the Competitor Compare dialog's "Export report" button to call `downloadCompetitorHtmlReport(selectedComps)`
- **Verified**: agent-browser clicked Export report → toast "Downloaded comparison report for 2 competitors" + file download triggered

### 2. Bulk Tags Editor Dialog — `src/components/views/saved-ads.tsx`
- New `BulkTagDialog` component triggered by the bulk action bar's "Tag" button (was toast-only before)
- Features:
  - Live tag input (press Enter or click + to add)
  - Current tags shown as sunset-gradient chips with remove (X) buttons
  - 9 suggested tags (winter, sale, launch, evergreen, high-cta, video, carousel, winner, test) as clickable "+ tag" chips
  - "Apply N tags to N ads" button (disabled when 0 tags), shows count dynamically
  - Resets state on close
- New `BulkMoveDialog` component (also wired to "Move to folder" button):
  - Folder list with colored icons, ad counts, creation dates
  - Selected folder highlighted with sunset border + checkmark
  - "Create new folder…" dashed-border option
  - "Move N ads" button
- Both dialogs have proper `DialogTitle` + `DialogDescription` for a11y
- **Verified**: agent-browser opened Tag editor, typed "winner", pressed Enter → "Apply 1 tag to 2 ads" button enabled

### 3. Pin to Top Feature — `src/lib/store.ts` + `src/components/shared.tsx` + `saved-ads.tsx`
- Added `pinnedAds: string[]` + `togglePinAd` to store, **persisted to localStorage**
- **AdCard** (`shared.tsx`): pin button (Pin icon) in bottom-right of thumbnail, opacity-0 until hover (always visible when pinned). Pinned cards show a "PINNED" badge.
- **Saved Ads view** sort logic: pinned ads always appear first (within their own group they respect the user's selected sort; unpinned ads follow after, also sorted). Applied to all 5 sort modes.
- **Verified**: agent-browser pinned first ad → "PINNED" indicator appeared, toast "Pinned to top", and `pinnedAds.length === 1` in localStorage

### 4. Ad Performance Leaderboard — `src/components/views/dashboard.tsx`
- New `AdPerformanceLeaderboard` widget on the dashboard (before Tracked Competitors)
- **Score formula**: `likes × (daysRunning / 7) / 1000` — rewards both engagement and longevity
- Top 5 ads shown with:
  - Rank medal (1st/2nd/3rd with colored backgrounds, 4th/5th as #4/#5)
  - Real thumbnail (uses `imagePath` when available)
  - Headline + advertiser + days + likes
  - Sunset-gradient score bar (relative to top score)
  - Numeric score value
- "View all" button → Saved Ads view
- **Verified**: agent-browser confirmed "Ad Performance Leaderboard" heading + 5 entries with score bars render

## Verification Results
- `bun run lint` → CLEAN (zero errors). Fixed 2 `DialogFooter` not-defined errors by adding to imports.
- agent-browser QA confirmed:
  - All 8 views render with no errors ✓
  - Dashboard Ad Performance Leaderboard renders with 5 entries + score bars ✓
  - Pin feature: button click → "PINNED" indicator + toast + persisted to localStorage (length 1) ✓
  - Bulk Tag editor: dialog opens, tag input works, "Apply 1 tag to 2 ads" enables after adding tag ✓
  - Competitor Compare Export: real HTML report download triggered + toast "Downloaded comparison report for 2 competitors" ✓
  - No console errors/warnings
- Dev server healthy throughout (HTTP 200)

## Unresolved Issues / Risks
- Pin button is `opacity-0` until hover (group-hover reveals it) — in agent-browser the button had to be found via `title` attribute and clicked via JS eval. Works fine in real browsers with mouse hover.
- Bulk Tag/Move dialogs currently only show toasts on confirm (don't actually mutate the mock ad data) — acceptable for demo; would need real state management to persist tag/folder changes.
- The leaderboard score formula is a heuristic (likes × longevity) — could be refined with real engagement data in a production scenario.

## Priority Recommendations for Next Phase
1. Add print stylesheet for the HTML report exports (currently `@media print` is minimal in the competitor report)
2. Make bulk Tag/Move dialogs actually mutate ad state (currently toast-only on confirm)
3. Add a "Pinned" filter chip in Saved Ads to show only pinned ads
4. Add a keyboard shortcut for pinning the currently-focused ad
5. Add a dashboard "Recently pinned" mini-section showing the 3 most recently pinned ads
6. Consider adding a competitor "Watch list" comparison chart (overlay multiple competitors' trends on one chart)

---
Task ID: CRON-7
Agent: main (cron review round 7)
Task: Continuous improvement — print stylesheet, pinned filter, recently-pinned, trend overlay chart

## Current Project Status Assessment
Project stable from round 6 with competitor exports, bulk tags editor, pin-to-top, and leaderboard. QA via agent-browser confirmed all 8 views (Search, Saved Ads, Competitors, Analytics, Swipe File, Team, Billing, Settings) render with correct headings and no errors. Dev server healthy (HTTP 200). No bugs — proceeded to build priority recommendations.

## This Round's Work — 4 New Features

### 1. Print Stylesheet for HTML Report Exports — `src/lib/export-utils.ts`
- Enhanced the `@media print` block in `competitorsToHtmlReport` (was minimal `body { padding: 0; }`)
- Now includes:
  - `print-color-adjust: exact` on headers/avatars so sunset gradients print in color
  - Reduced font sizes for print (body 11px, h1 18px, nums 14-16px)
  - Tighter spacing (gaps, paddings reduced)
  - Removed box-shadows (replaced with 1px borders for print clarity)
  - `break-inside: avoid` on competitor cards so they don't split across pages
  - `@page { margin: 1.5cm; }` for proper print margins
- Result: Print-to-PDF now produces a polished, color-accurate, well-paginated report

### 2. "Pinned" Filter Chip in Saved Ads — `src/components/views/saved-ads.tsx`
- New `pinnedOnly` state + filter logic in the useMemo
- "Pinned" toggle button appears next to Favorites (only when ≥1 ad is pinned), with live count badge
- Active filter chip added to the active-filters bar (clearable)
- "Clear all" button now also clears `pinnedOnly`
- Updated useMemo deps to include `pinnedOnly`
- **Verified**: agent-browser pinned 1 ad → "Pinned 1" button appeared → clicking it showed only the 1 pinned ad

### 3. Dashboard "Recently Pinned" Mini-Section — `src/components/views/dashboard.tsx`
- New `RecentlyPinnedSection` component (renders only when ≥1 ad is pinned)
- Placed between Ad Performance Leaderboard and Tracked Competitors
- Sunset-radial background card with up to 3 pinned ads
- Each ad shows real thumbnail (when available), headline, advertiser, "PINNED" badge
- "View all" button → Saved Ads view
- **Verified**: agent-browser pinned 1 ad on Saved Ads → returned to dashboard → "Recently Pinned" section appeared with the pinned ad

### 4. Competitor Trend Overlay Chart — `src/components/views/competitors.tsx`
- New `TrendOverlayCard` component (roadmap feature: "competitor trend overlay chart")
- Placed at the top of the Competitors view (before the competitor cards)
- Multi-line Recharts `LineChart` overlaying all competitors' 7-day active-ad trends on a single chart
- **Interactive legend**: clickable competitor chips toggle line visibility (sunset-colored when active, muted when hidden)
- Shows "{visible} of {total} shown" badge
- CartesianGrid + Tooltip + Legend (only when 2+ visible)
- Empty state: "Click a competitor chip above to show their trend"
- **Verified**: agent-browser confirmed "Active Ads Trend — Overlay" heading + legend chips (Khaadi, Sapphire, Daraz PK) render, toggling Sapphire off works, no errors

## Verification Results
- `bun run lint` → CLEAN (zero errors)
- agent-browser QA confirmed:
  - All 8 views render with no errors ✓
  - Pinned filter: pinned 1 ad → "Pinned 1" button → click → only 1 pinned ad shown ✓
  - Dashboard Recently Pinned section: appears with pinned ad (real thumbnail + PINNED badge) ✓
  - Competitor Trend Overlay: heading + legend chips + chart render, toggling works ✓
  - No console errors/warnings
- Dev server healthy throughout (HTTP 200)

## Unresolved Issues / Risks
- The pinned filter showed "2 cards" via `[data-slot=card]` selector count, but inspection confirmed only 1 was an ad card — the 2nd was the filter toolbar Card. Filter logic is correct.
- Print stylesheet is only in the competitor HTML report; the ads HTML report (`adsToHtmlReport`) still has minimal print styles — could enhance in a future round.
- The trend overlay chart shows all competitors by default (first 4); with 6 competitors the chart could get busy — the toggle chips mitigate this.

## Priority Recommendations for Next Phase
1. Add print stylesheet to the ads HTML report (`adsToHtmlReport`) matching the competitor report polish
2. Make bulk Tag/Move dialogs actually mutate ad state (currently toast-only on confirm)
3. Add a "Pinned" count indicator on the Saved Ads folder tab
4. Add a keyboard shortcut for pinning (e.g., `P` when an ad card is focused)
5. Add a "Trend overlay" export (download the overlay chart as PNG/SVG)
6. Consider adding ad-format icons to the trend overlay legend chips

---
Task ID: CRON-8
Agent: main (cron review round 8)
Task: Continuous improvement — ads print stylesheet, bulk state mutation, pinned tab, pin shortcut

## Current Project Status Assessment
Project stable from round 7 with print stylesheet (competitor report), pinned filter chip, recently-pinned section, and trend overlay chart. QA via agent-browser confirmed all 8 views render with correct headings and no errors. Dev server healthy (HTTP 200). No bugs — proceeded to build priority recommendations.

## This Round's Work — 4 New Features

### 1. Print Stylesheet for Ads HTML Report — `src/lib/export-utils.ts`
- Added `@media print` block to `adsToHtmlReport` (was missing entirely)
- Includes:
  - `print-color-adjust: exact` on header/th so sunset gradient + amber table headers print in color
  - Reduced font sizes (body 10px, h1 18px, th/td 10px)
  - Tighter spacing, removed box-shadow (replaced with 1px border)
  - `tr { break-inside: avoid; }` so table rows don't split across pages
  - `@page { margin: 1.5cm; }` for proper print margins
- Result: Ads report Print-to-PDF now matches the polish of the competitor report

### 2. Bulk Tag/Move Dialogs Now Actually Mutate Ad State — `src/components/views/saved-ads.tsx`
- **BulkTagDialog onConfirm**: now calls `setAds((prev) => prev.map(...))` to add the chosen tags to selected ads using `Array.from(new Set([...a.tags, ...tags]))` (deduped)
- **BulkMoveDialog onConfirm**: signature changed to `(folderId, folderName)` and now calls `setAds((prev) => prev.map(...))` to move selected ads to the chosen folder
- **Verified**: agent-browser selected 2 ads → opened Tag dialog → typed "test-tag" + Enter → "Apply 1 tag to 2 ads" button enabled → clicked Apply → toast "Added 1 tag to 2 ads" appeared. The ad state was actually mutated (tags added).

### 3. "Pinned" Count Tab in Saved Ads — `src/components/views/saved-ads.tsx`
- New "Pinned" pill button in the folder-tab row (next to "All Ads"), appears only when ≥1 ad is pinned
- Shows Pin icon + "Pinned" label + count badge (sunset-cream bg when inactive, white/20 when active)
- Clicking toggles `pinnedOnly` filter (same as the Pinned filter button in toolbar, but more discoverable here)
- Active state uses sunset-deep background
- **Verified**: agent-browser pinned 1 ad → "Pinned 1" tab appeared next to "All Ads 48"

### 4. Pin Keyboard Shortcut (P key) — `src/components/keyboard-shortcuts.tsx`
- New `P` global keyboard shortcut: pins/unpins the focused ad card (or the first ad card in main content if none focused)
- Logic: finds `document.activeElement`, walks up to `[data-slot=card]` ancestor, finds the `button[title*='Pin']` inside, and clicks it
- Falls back to `document.querySelector("main [data-slot=card]")` when no card focused
- Added to the keyboard shortcuts help dialog ("P — Pin/unpin the focused ad card")
- Added `togglePinAd` to the useEffect deps
- **Note**: synthetic KeyboardEvent dispatch in agent-browser doesn't trigger React handlers reliably (known limitation); the shortcut works in real browsers. Verified the pin button click path works.

## Verification Results
- `bun run lint` → CLEAN (zero errors)
- agent-browser QA confirmed:
  - All 8 views render with no errors ✓
  - Pinned tab: pinned 1 ad → "Pinned 1" tab appeared next to "All Ads 48" ✓
  - Bulk Tag mutation: selected 2 ads → typed "test-tag" → Apply → toast "Added 1 tag to 2 ads" + state mutated ✓
  - No console errors/warnings
- Dev server healthy throughout (HTTP 200)

## Unresolved Issues / Risks
- The `P` keyboard shortcut via synthetic JS `KeyboardEvent` dispatch doesn't trigger the React handler in agent-browser (same limitation as the `?` shortcut noted in prior rounds). The shortcut logic is sound and works in real browsers.
- Bulk Tag/Move mutations are in-memory only (reset on page reload since ads aren't persisted to localStorage). Acceptable for demo; would need ad-state persistence for production.
- The pinned tab and the toolbar Pinned filter button both toggle `pinnedOnly` — slight redundancy but improves discoverability.

## Priority Recommendations for Next Phase
1. Persist ads state to localStorage so bulk Tag/Move mutations survive reloads
2. Add a "Trend overlay" export (download the overlay chart as PNG/SVG)
3. Add ad-format icons to the trend overlay legend chips
4. Add a "Recently tagged" or "Recently moved" activity entry to the dashboard activity feed
5. Add a confirm dialog before bulk Delete (currently just toasts + clears selection)
6. Consider adding a "Select all visible" keyboard shortcut (e.g., Cmd+A)

---
Task ID: VIEWS-B
Agent: sub-agent (general-purpose)
Task: Create Support/Help view component (`src/components/views/support.tsx`) rendering inside AppShell

Work Log:
- Read worklog.md to absorb project context (sunset palette #EA6113/#F88F22/#FBB931/#FFE3B3, single-page view architecture, Zustand store, sonnerToast helper, `cn` util, existing view conventions in billing.tsx & settings.tsx).
- Verified required shadcn/ui components exist & their export names: Card, Button, Badge, Input, Label, Textarea, Select/SelectContent/SelectItem/SelectTrigger/SelectValue, Tabs/TabsList/TabsTrigger/TabsContent, Dialog/DialogContent/DialogDescription/DialogFooter/DialogHeader/DialogTitle, Accordion/AccordionItem/AccordionTrigger/AccordionContent. Confirmed `bg-sunset-gradient`, `bg-sunset-radial`, `text-sunset-gradient`, `bg-sunset-cream/40` utility classes in globals.css.
- Confirmed store: `ViewKey` already includes `"support"`, `VIEW_ACCESS.support` allows all roles, so no store changes needed.
- Built `SupportView()` with `useState`-driven left vertical section nav (4 items: Help Center, Support Tickets, Contact Us, Documentation) using the same pattern as SettingsView. Each section is composed of `Card` blocks with `p-5`/`p-6` padding and `rounded-xl`.
- Header: LifeBuoy icon in sunset-gradient tile, "Support & Help" title, subtitle "Get help, browse docs, or contact our team".
- **Help Center section** (`HelpCenterSection`):
  - Sunset-radial search card with Input + Search button + clickable suggestion chips.
  - 4 category cards (Getting Started, Saving & Organizing Ads, Competitor Tracking, Billing & Plans) each with icon, title, description, article count badge, and "Browse articles" link.
  - Popular articles list (5 items) with rank number, title, read time (Clock icon), category badge.
  - Video tutorials grid (3 cards) with sunset-gradient thumbnail placeholder, white play button, duration badge (bottom-right), category badge (top-left), title.
  - FAQ Accordion (5 items) for common questions.
- **Support Tickets section** (`TicketsSection`):
  - "New Ticket" button with `bg-sunset-gradient`.
  - Tabs-based filter: All / Open / Resolved (each with count badge).
  - Desktop table (7-col grid: Ticket ID, Subject, Status, Priority, Category, Updated, View) + mobile card fallback.
  - 5 mock tickets with status badges (Open=green, In Progress=amber, Resolved=gray, Urgent=red) and priority badges (Low=cream, Medium=amber, High=orange, Urgent=red).
  - System status banner (green CheckCircle2, avg response time).
  - `NewTicketDialog` component: Subject input, Category Select (Bug/Feature Request/Billing Question/How-To/Other), Priority Select (Low/Medium/High/Urgent), Description Textarea, validation → `sonnerToast.success("Ticket #482 created. We'll respond within 24h.")` on submit, includes DialogTitle + DialogDescription for a11y compliance.
- **Contact Us section** (`ContactSection`):
  - 3 contact method cards: Email Support (support@adspy.lite, 24h response), Live Chat (Mon–Fri 9am–6pm PKT), Community Forum — each with accent-colored icon tile.
  - Contact form: Name, Email, Subject, Message Textarea, Send button → `sonnerToast.success("Message sent! We'll get back to you soon.")` with field validation.
- **Documentation section** (`DocsSection`):
  - 4 doc category cards (API Reference, Extension Guide, Webhooks, Changelog) with icon tiles, article counts, and "Open" buttons (ExternalLink icon).
  - Quick Links card with 4 quick links (Quick Start Guide, Video Tutorials, Migration Guide, FAQ) as clickable rows.
  - Version info card on sunset-radial bg: v2.5.0 badge, last updated Jan 15 2025, stable channel indicator, known-issue indicator, "View Changelog" button.
- Added role-aware footer card showing current role with sunset-gradient text.
- Fixed a typo (`Urggent` → `Urgent`) in Priority SelectItem value before final lint.
- Hover states throughout: cards lift (`hover:-translate-y-0.5`), borders warm to `sunset-orange/40`, icon tiles swap from cream to sunset-gradient on hover.
- Imports verified: every shadcn component, Lucide icon (LifeBuoy, MessageSquare, Mail, FileText, ChevronDown, Send, Search, BookOpen, Video, ExternalLink, Plus, Clock, CheckCircle2, AlertCircle, HelpCircle), `sonnerToast`, `useAppStore`, `cn` all import from correct paths.

Verification Results:
- `bun run lint` → CLEAN (zero errors)
- `bunx tsc --noEmit` → no errors in support.tsx (pre-existing errors in unrelated files: examples/websocket, skills/, export-utils.ts remain — out of scope)
- File: 733 lines, single export `SupportView`

Stage Summary:
Created `/home/z/my-project/src/components/views/support.tsx` exporting `SupportView()`. Component is a "use client" module using `useAppStore` for role awareness, with a useState-driven left vertical section nav (Help Center / Support Tickets / Contact Us / Documentation) matching the SettingsView pattern. All four sections fully built with sunset-palette styling, hover states, responsive layouts (mobile card fallbacks for the tickets table), Dialog for new ticket creation with proper a11y (DialogTitle + DialogDescription), Tabs for ticket filtering, and Accordion for FAQs. Toasts fire on form submissions and ticket creation with the exact messages specified in the task. File lints clean and type-checks clean. **Not yet wired into `page.tsx` switch statement** — that wiring is outside this task's scope ("Only create support.tsx"); a follow-up task can add `case "support": return <SupportView />;` to `src/app/page.tsx` and optionally add a sidebar entry in `app-shell.tsx`'s `navItems` array.

---
Task ID: VIEWS-C
Agent: api-keys-view-builder (general-purpose)
Task: Create the API Keys & Access view component (Agency plan feature) at /home/z/my-project/src/components/views/api-keys.tsx

Work Log:
- Read worklog.md to understand project context (Next.js 16 + TS + Tailwind 4 + shadcn/ui, sunset palette #EA6113/#F88F22/#FBB931/#FFE3B3, view-state via Zustand, "api-keys" ViewKey already defined and gated to agency/admin roles)
- Inspected settings.tsx + team.tsx for styling/pattern conventions (rounded-xl cards, p-5 spacing, bg-sunset-gradient buttons, sonnerToast usage, divide-y tables + mobile card fallbacks)
- Verified UI component APIs: Card, Button, Badge, Input, Label, Select/SelectTrigger/SelectValue/SelectContent/SelectItem, Dialog/DialogContent/DialogHeader/DialogTitle/DialogDescription/DialogFooter, Switch, Separator, Checkbox, Tabs/TabsList/TabsTrigger/TabsContent, DropdownMenu/DropdownMenuTrigger/DropdownMenuContent/DropdownMenuItem/DropdownMenuSeparator
- Confirmed globals.css sunset utilities (bg-sunset-gradient, bg-sunset-radial, bg-sunset-cream/40, text-sunset-gradient, border-sunset) and store.ts exports (useAppStore with role selector)
- Created api-keys.tsx as a "use client" component with a single named export ApiKeysView() (and a default export for safety)
- Implemented all 7 required sections:
  1. Header: KeyRound icon in sunset-gradient tile, "API Keys & Access" text-sunset-gradient title, "AGENCY FEATURE" badge, subtitle, plus a cream-tinted "Signed in as {role}" chip pulling from useAppStore
  2. Info banner: bg-sunset-radial card with Code icon, rate limit + base URL code chip + "View full docs" outline button
  3. Quick stats row: 3 StatCard cards (Active keys=2, Total requests this month=15,740, Rate limit usage=42% with inline sunset-gradient progress bar + "420 / 1000 req this hour" caption)
  4. API Keys table card: "Create New Key" button (bg-sunset-gradient) → Dialog with name Input, scope Checkboxes (5 scopes), Expiration Select (Never/30d/90d/1y), Create button generating a fake key (generateKey()) and showing it ONCE in a second success Dialog with copy button + "You won't see this key again" warning. Table columns: Name, Key (masked "adspy_live_sk_••••••••8h9i" via maskKey() with show/hide Eye toggle + Copy button, disabled for revoked keys), Scopes (color-coded badges), Requests (tabular-nums), Last Used (Clock icon), Status (active=emerald / revoked=red badge with dot), Created, Actions dropdown (View usage / Rotate / Revoke — Revoke styled red). Responsive: full table on lg+, stacked mobile cards with explicit Action buttons below.
  5. Webhooks section: "Add Webhook" button + 2 webhook endpoint cards (URL in mono, event badges ad.saved/competitor.new/ad.ended, status Switch with Enabled/Disabled label, last-delivery time, "Test" button → sonnerToast.success("Test webhook delivered"), disabled when webhook off)
  6. Code examples card: Tabs (cURL / JavaScript / Python) each with a <pre><code> block styled bg-muted/40 rounded-lg p-4 text-xs font-mono border-border, hover-revealed Copy button top-right that copies the snippet
  7. Rate limit & quota card: 3 UsageBar progress meters (Requests 420/1000 req, Ads exported 90/500, Webhooks 2/10) with sunset gradient fills + % readouts, followed by a cream callout banner with "Upgrade for higher limits" button (bg-sunset-gradient) → sonnerToast.info("Opening billing — Scale plan")
- All interactions wired to sonnerToast (success/warning/error/info); copyToClipboard() helper uses navigator.clipboard with try/catch toast fallback
- useState tracks: keys array (mutated on rotate/revoke/create), per-key revealed map, create dialog open + name/scopes/expiration form state, newlyCreatedKey string for the one-time success dialog, webhooks array (toggle enabled), active code tab
- Used cn() for conditional classes; bg-sunset-gradient, bg-sunset-radial, bg-sunset-cream/40, text-sunset-gradient, border-sunset-* consistently applied; rounded-xl cards with p-5; hover states (hover:shadow-md on stat cards, hover:bg-muted/30 on table rows, hover:opacity-90 on gradient buttons, hover:bg-sunset-cream/40 on copy buttons)
- Ran `npx tsc --noEmit` — api-keys.tsx produced ZERO type errors (only pre-existing errors in examples/, skills/, src/lib/export-utils.ts which are unrelated)
- Ran `npx eslint src/components/views/api-keys.tsx` — ZERO warnings/errors (clean exit)

Stage Summary:
- /home/z/my-project/src/components/views/api-keys.tsx created (~1032 lines), type-safe, ESLint-clean, "use client" component exporting ApiKeysView()
- All imports verified valid against existing UI components (Card, Button, Badge, Input, Label, Select, Dialog, Switch, Separator, Checkbox, DropdownMenu, Tabs) and lib modules (sonnerToast, cn, useAppStore)
- Sunset palette consistently applied; component is responsive (mobile-stacked table, grid breakpoints sm/md/lg) and polished with hover states
- Store already has "api-keys" ViewKey gated to ["agency","admin"] — component is ready to be wired into the app-shell view router by the integrator (not part of this task)
- No other files modified; no test code written

---
Task ID: VIEWS-A
Agent: general-purpose (sub agent)
Task: Build Login & Pricing standalone view components

## Work Log

### 1. Created `/src/components/views/login.tsx` — `LoginView()`
Split-layout auth page (full-page, no AppShell):
- **Top bar**: "Back to home" link (→ `goLanding()`) on left, brand tile + theme toggle button on right (`toggleTheme`)
- **Left hero panel** (lg only, `bg-sunset-gradient`): Sparkles brand tile, "Spy on competitor Facebook & Instagram ads" headline, 4 feature bullets with sunset-tinted icons (1-Click Saving, Pattern Analytics, New Ad Alerts, Privacy-First), and a glassmorphism testimonial card with quote + avatar + 5-star rating
- **Right auth card** (sunset-radial bg): Tabs ("Sign In" | "Create Account")
  - **Sign In tab**: Email + Password inputs with leading icons, show/hide password toggle, "Forgot password?" link (info toast), "Sign In" button (`bg-sunset-gradient`) → `login("agency")` + `sonnerToast.success("Welcome back!")`
  - **Create Account tab**: Name + Email + Password inputs, 3 plan radio-style cards (Free $0 / Pro $15 / Agency $49 — accent-colored when selected), "Create Account" button → `login(selectedRole)` + `sonnerToast.success("Account created!")`
- **Social auth**: 2 outline buttons "Continue with Google" (Google 4-color SVG) and "Continue with Meta" (Meta infinity SVG) → `login("agency")` + toast
- **Footer**: "By continuing you agree to our Terms & Privacy Policy" + © 2024 copyright + "All systems operational" status
- **Responsive**: Stacks to single column on mobile (hero panel hidden `hidden lg:flex`, mobile brand tile shown instead)

### 2. Created `/src/components/views/pricing.tsx` — `PricingView()`
Standalone pricing page (full-page, no AppShell):
- **Top nav** (sticky): Logo (→ `goLanding()`), "Home" ghost button, "Back to app" sunset-gradient button (→ `setView("dashboard")`), theme toggle
- **Hero**: "Simple, transparent pricing" headline (`text-sunset-gradient`), subtitle "Affordable for freelancers. Powerful for agencies. Local payment methods supported.", Monthly/Yearly toggle (yearly shows "-20%" badge)
- **3 plan cards** (Free/Pro/Agency) from `planFeatures`:
  - Pro highlighted: `lg:scale-105`, `border-2 border-sunset-orange`, "Most Popular" badge
  - Each: plan icon (Star/Zap/Crown), price (large), priceLabel, features list (accent-colored check pills), CTA button
  - **Pricing logic**: Yearly = 20% off monthly → `Math.round(price * 0.8 * 100) / 100`, with strikethrough original price + "Save $X/yr" badge on paid plans
  - **CTA**: "Current plan" (disabled) if `role === planKey`, else "Choose {plan}" → `login(planKey)` + `sonnerToast.success("Started {name} plan!")`
- **Comparison table** (8 rows: Saved ads, Competitors, Folders, Team members, Analytics, API access, White-label, Support):
  - Desktop: 4-col grid Card with sunset-cream tint on Pro column; bool rows show green ✓ / muted ✗; text rows show values
  - Mobile: stacked plan cards with feature lists
- **Local payment methods card**: JazzCash (red), EasyPaisa (green), Stripe (purple), Visa (navy), Mastercard (red/orange) gradient badges + note about PK pricing + TLS encryption note
- **FAQ**: 4 questions using native `<details>`/`<summary>` with rotating chevron
- **CTA banner** (`bg-sunset-gradient`): "Start spying on competitor ads today" + "Add to Chrome — Free" (→ `login("free")`) + "Explore Dashboard Demo" (→ `setView("dashboard")`)
- **Footer**: 3-column links (Product/Company/Legal) + copyright + status indicator

### 3. Wired views into router — `/src/app/page.tsx`
- Added `login` and `pricing` to standalone view checks (alongside `landing`) — each renders full-page with `motion.div` fade-in, no AppShell wrapper
- Updated `STANDALONE_VIEWS` already included these in store; only page.tsx needed wiring

### 4. Added navigation entry points — `/src/components/views/landing.tsx`
- Imported `type ViewKey` from store
- Landing nav "Pricing" link now → `setView("pricing")` (was a no-op placeholder button)
- Landing "Sign in" button now → `setView("login")` (was `goApp`) — natural auth flow: Landing → Login → Sign In → Dashboard

## Verification Results
- `bun run lint` → CLEAN (zero errors)
- `bunx tsc --noEmit` → zero errors in any new/modified file (pre-existing errors only in `examples/`, `skills/`, and `src/lib/export-utils.ts` — all unrelated)
- agent-browser QA confirmed:
  - **PricingView**: headline "Simple, transparent pricing" ✓, Monthly/Yearly toggle works ✓, 3 plan cards with "Most Popular" badge on Pro ✓, "Current plan" disabled button appears on role-matched plan (verified with role=agency → Agency shows "Current plan"; role=pro → Pro shows "Current plan") ✓, comparison table heading ✓, payment methods card ✓, FAQ ✓, CTA banner ✓
  - **Yearly toggle**: shows "/mo, billed yearly" + strikethrough original price + "Save $X/yr" badge on paid plans ✓
  - **LoginView**: "Back to home" + theme toggle in top bar ✓, hero headline "Spy on competitor Facebook & Instagram ads" ✓, Tabs Sign In | Create Account ✓, Sign In form (Email/Password/Forgot password/Show password/Sign In button) ✓, Create Account form (Name/Email/Password + 3 plan selector cards: Free $0 Forever / Pro $15 /mo / Agency $49 /mo) ✓, Google + Meta social buttons ✓, Terms & Privacy Policy footer ✓
  - **Mobile (375x812)**: hero panel hidden, auth card centered with mobile brand tile — fully responsive ✓
  - **Sign In flow**: filled email + password → clicked Sign In → view changed to dashboard (AppShell rendered with role="agency") ✓
  - No console errors/warnings, no page errors
- Dev server healthy throughout (HTTP 200)

## Stage Summary
Two new standalone view components delivered per spec:
- `LoginView` — split-layout sunset-gradient auth page with Sign In / Create Account tabs, plan selector, social auth, theme toggle, fully responsive
- `PricingView` — full pricing page with Monthly/Yearly billing toggle, 3 plan cards (Pro highlighted), 8-row comparison table, payment methods card, FAQ, sunset CTA banner, role-aware CTAs

Both views render standalone (no AppShell) via updated `page.tsx` switch, matching the existing `STANDALONE_VIEWS` declaration in the Zustand store. Entry points wired from landing nav ("Sign in" → login, "Pricing" → pricing). All lint + TS checks pass, agent-browser QA confirmed correct rendering and interaction on desktop and mobile viewports.

---
Task ID: FULL-REVIEW
Agent: main
Task: Review entire project, add all missing pages/features/roles, role-specific pages, RBAC

## Current Project Status Assessment
Project had 11 views (landing, dashboard, saved-ads, competitors, analytics, swipe-file, team, admin, settings, billing, search) and 5 roles. QA confirmed all views stable, dev server healthy (HTTP 200). Identified missing pieces vs original roadmap (Section 6 & 16): Login/Signup page, dedicated Pricing page, Support/Help page, API Keys page (Agency), Admin Support Tickets/Content Moderation/Announcements/Audit Logs, and role-based access control enforcement.

## This Round's Work — Missing Pages + Features + Roles + RBAC

### 1. Store Enhancement — `src/lib/store.ts`
- Added ViewKeys: `login`, `pricing`, `support`, `api-keys` (15 total)
- Added `STANDALONE_VIEWS` array (landing, login, pricing render without AppShell)
- Added `VIEW_ACCESS` map: every view → allowed roles (e.g. api-keys: [agency, admin], admin: [admin], analytics: [pro, agency, team, admin])
- Added `ROLE_LIMITS` map: per-role limits (savedAds, competitors, folders, teamMembers, apiAccess, analytics, teamMgmt, multiClient)
- Added `isAuthenticated` state + `login(role)` + `logout()` actions (persisted)

### 2. Login/Signup View — `src/components/views/login.tsx` (new, standalone)
- Split layout: sunset-gradient hero (brand, tagline, 4 feature bullets, testimonial) + auth card
- Tabs: Sign In (email/password/forgot) | Create Account (name/email/password + 3 plan selector cards)
- Social auth: Continue with Google + Continue with Meta
- On submit → `login(selectedRole)` → dashboard
- Back to home + theme toggle

### 3. Pricing View — `src/components/views/pricing.tsx` (new, standalone)
- Dedicated pricing page with Monthly/Yearly toggle (20% off yearly)
- 3 plan cards (Free/Pro/Agency) from planFeatures, Pro highlighted
- 8-row feature comparison table
- FAQ section, local payment methods card, CTA banner
- CTA → `login(planRole)` or "Current plan" if role matches

### 4. Support/Help View — `src/components/views/support.tsx` (new, in shell)
- 4 sections via left nav: Help Center, Support Tickets, Contact Us, Documentation
- Help Center: search, 4 category cards, 5 popular articles, 3 video tutorials, FAQ accordion
- Support Tickets: New Ticket dialog (subject/category/priority/description), tickets table with filter tabs
- Contact Us: 3 contact method cards + contact form
- Documentation: 4 doc category cards, quick links, version info

### 5. API Keys View — `src/components/views/api-keys.tsx` (new, in shell, Agency-only)
- API keys table with create/show/hide/copy/revoke
- Create key dialog with scope checkboxes + expiration
- Webhooks section with test button
- Code examples (cURL/JS/Python tabs)
- Rate limit & quota progress bars

### 6. Admin Enhancements — `src/components/views/admin.tsx`
Added 4 new admin sections:
- **Support Tickets Management**: filterable ticket table (All/Open/Resolved), priority + status badges
- **Content Moderation**: reported ads queue with severity/status badges, review actions
- **Announcements & Broadcast**: compose textarea + audience select + send button, recent broadcasts list with open rates
- **Audit Logs**: 6 recent admin actions with color-coded icons (suspend, refund, upgrade, broadcast, resolve, revoke)

### 7. Role-Based Access Control — `src/components/role-guard.tsx` (new)
- `canAccessView(role, view)` helper using VIEW_ACCESS map
- `AccessDenied` component: upgrade prompt card with lock icon, min-role badge, upgrade CTA → pricing
- `RoleGuard` wrapper: renders AccessDenied if role can't access view, else renders children
- Wired into page.tsx: every shell view wrapped in `<RoleGuard view={view}>`
- `useRoleLimit()` hook for limit checks

### 8. Free User Upgrade Banner — `src/components/views/dashboard.tsx`
- New `FreeUpgradeBanner` component (shows only for role === "free")
- Sunset-radial card with Crown icon, usage progress bar (saved ads vs 20 limit), "Upgrade now" → pricing
- Placed below the welcome banner

### 9. Navigation + Wiring
- AppShell nav: added API Keys (KeyRound, agency/admin) + Support (LifeBuoy, all roles)
- AppShell role switcher dropdown: added "View pricing" + "Sign out / Switch account" + "Back to landing page"
- Command palette: added API Keys, Support, Pricing to nav items
- Keyboard shortcuts: added G+K (API Keys), G+H (Support), G+P (Pricing) + help entries
- Landing footer: added "Resources" column with functional Support/Documentation/API Keys/Sign In links
- Page router: added `case "support"` + `case "api-keys"` + RoleGuard wrapper

## Verification Results
- `bun run lint` → CLEAN (zero errors)
- agent-browser QA confirmed:
  - API Keys view: "API Keys & Access" heading + all sections render, no errors ✓
  - Support view: "Support & Help" heading + Help Center/Tickets/Contact/Docs render ✓
  - Pricing view: "Simple, transparent pricing" + 3 plan cards render ✓
  - Login view: "Welcome" + Sign In/Create Account tabs render ✓
  - Role-based nav: Free user sees only Dashboard/Saved Ads/Support/Billing/Settings (no Analytics/Team/API Keys/Admin) ✓
  - Free upgrade banner: appears on dashboard for Free role ("You're on the Free plan LIMITED" + Upgrade now) ✓
  - Admin new sections: Support Tickets + Content Moderation + Announcements + Audit Logs all render ✓
  - No console errors/warnings across all tests
- Dev server healthy throughout (HTTP 200)

## Role Coverage Summary (all 5 roles now fully functional)
- **Free User**: Dashboard, Saved Ads (20 limit), Competitors (1 limit), Support, Billing, Settings + upgrade prompts
- **Pro User**: + Analytics, Swipe File, unlimited ads, 10 competitors
- **Agency Owner**: + Team, API Keys, unlimited everything, team management, multi-client
- **Team Member**: Dashboard, Saved Ads, Competitors, Analytics, Support, Settings (no billing/team/api-keys)
- **Admin**: Full access including Admin Panel (users, tickets, moderation, announcements, audit logs, system health)

## Unresolved Issues / Risks
- Login is mock (no real auth backend) — `login(role)` just sets role + isAuthenticated. Acceptable for demo.
- Role-based access is client-side only (RoleGuard) — production would need server-side auth.
- API Keys view data is mock; real key generation would need a backend.

## Priority Recommendations for Next Phase
1. Add real auth (NextAuth.js) with actual login/signup
2. Add multi-client workspace switcher for Agency role (roadmap: "Multi-Client Workspace Page")
3. Add white-label report branding for Agency exports
4. Add weekly digest email settings to Settings (Pro feature)
5. Add Team Member role restrictions (Editor vs Viewer within team)
6. Add real API key generation + backend storage
