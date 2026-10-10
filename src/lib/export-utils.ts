import type { SavedAd, Competitor } from "@/lib/mock-data";

/**
 * Triggers a browser file download for the given content.
 * Works entirely client-side using Blob + anchor download.
 */
export function downloadFile(filename: string, content: string, mimeType: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoke after a short delay to ensure download starts
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function escapeCsv(value: unknown): string {
  const s = value == null ? "" : String(value);
  // Escape quotes by doubling, wrap in quotes if contains comma/quote/newline
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/** Builds a CSV string from saved ads. */
export function adsToCsv(ads: SavedAd[]): string {
  const headers = [
    "ID", "Advertiser", "Headline", "CTA", "Format", "Platform", "Status",
    "Days Running", "Likes", "First Seen", "Last Seen", "Tags", "Folder ID",
    "Ad Copy", "Notes",
  ];
  const rows = ads.map((a) => [
    a.id, a.advertiser, a.headline, a.cta, a.format, a.platform, a.status,
    a.daysRunning, a.likes ?? "", new Date(a.firstSeen).toISOString(),
    new Date(a.lastSeen).toISOString(), a.tags.join("; "), a.folderId,
    a.adCopy, a.notes ?? "",
  ].map(escapeCsv).join(","));
  return [headers.map(escapeCsv).join(","), ...rows].join("\n");
}

/** Builds a JSON string from saved ads. */
export function adsToJson(ads: SavedAd[]): string {
  return JSON.stringify(
    ads.map((a) => ({
      id: a.id,
      advertiser: a.advertiser,
      headline: a.headline,
      cta: a.cta,
      format: a.format,
      platform: a.platform,
      status: a.status,
      daysRunning: a.daysRunning,
      likes: a.likes,
      firstSeen: a.firstSeen,
      lastSeen: a.lastSeen,
      tags: a.tags,
      folderId: a.folderId,
      adCopy: a.adCopy,
      notes: a.notes,
    })),
    null,
    2
  );
}

/** Builds a simple printable HTML report (can be saved as .html or printed to PDF). */
export function adsToHtmlReport(ads: SavedAd[], title = "AdSpy Lite — Saved Ads Report"): string {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const rows = ads.map((a) => `
    <tr>
      <td><strong>${escapeHtml(a.advertiser)}</strong><br><span class="muted">${escapeHtml(a.handle || "")}</span></td>
      <td>${escapeHtml(a.headline)}</td>
      <td><span class="badge cta">${escapeHtml(a.cta)}</span></td>
      <td><span class="badge fmt">${escapeHtml(a.format)}</span></td>
      <td><span class="badge status-${a.status}">${escapeHtml(a.status)}</span></td>
      <td>${a.daysRunning}d</td>
      <td>${(a.likes ?? 0).toLocaleString()}</td>
      <td class="copy">${escapeHtml(a.adCopy.slice(0, 100))}${a.adCopy.length > 100 ? "…" : ""}</td>
    </tr>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(title)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 32px; color: #2a1a0e; background: #fffaf2; }
  .header { background: linear-gradient(135deg, #EA6113, #F88F22, #FBB931); color: #fff; padding: 24px 32px; border-radius: 16px; margin-bottom: 24px; }
  .header h1 { margin: 0 0 4px; font-size: 24px; }
  .header p { margin: 0; opacity: 0.9; font-size: 13px; }
  .meta { display: flex; gap: 24px; margin-bottom: 20px; font-size: 13px; color: #7a3a0e; }
  .meta b { color: #2a1a0e; }
  table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(234,97,19,0.08); }
  th { background: #FFE3B3; text-align: left; padding: 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #7a3a0e; }
  td { padding: 12px; border-top: 1px solid #f0e4d0; font-size: 12px; vertical-align: top; }
  .muted { color: #999; font-size: 11px; }
  .copy { color: #666; max-width: 280px; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 600; text-transform: uppercase; }
  .badge.cta { background: #EA6113; color: #fff; }
  .badge.fmt { background: #FFE3B3; color: #7a3a0e; }
  .badge.status-active { background: #dcfce7; color: #166534; }
  .badge.status-paused { background: #fef3c7; color: #92400e; }
  .badge.status-ended { background: #f3f4f6; color: #4b5563; }
  .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #f0e4d0; font-size: 11px; color: #999; text-align: center; }
  @media print {
    body { padding: 0; background: #fff; font-size: 10px; }
    .header { border-radius: 0; padding: 16px 20px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .header h1 { font-size: 18px; }
    .meta { gap: 12px; margin-bottom: 12px; font-size: 11px; }
    table { box-shadow: none; border: 1px solid #f0e4d0; border-radius: 0; }
    th { padding: 8px; font-size: 10px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    td { padding: 8px; font-size: 10px; }
    .copy { max-width: 200px; }
    .footer { margin-top: 12px; padding-top: 8px; }
    tr { break-inside: avoid; }
    @page { margin: 1.5cm; }
  }
</style>
</head>
<body>
  <div class="header">
    <h1>AdSpy Lite — Saved Ads Report</h1>
    <p>Competitor research export · ${ads.length} ads · ${date}</p>
  </div>
  <div class="meta">
    <span><b>${ads.length}</b> ads</span>
    <span><b>${new Set(ads.map(a => a.advertiser)).size}</b> advertisers</span>
    <span><b>${ads.filter(a => a.status === "active").length}</b> active</span>
    <span>Generated: <b>${date}</b></span>
  </div>
  <table>
    <thead>
      <tr>
        <th>Advertiser</th><th>Headline</th><th>CTA</th><th>Format</th><th>Status</th><th>Running</th><th>Likes</th><th>Copy</th>
      </tr>
    </thead>
    <tbody>${rows}
    </tbody>
  </table>
  <div class="footer">Generated by AdSpy Lite · For research/reference only · Saved creatives are third-party property</div>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Convenience: download ads as CSV */
export function downloadAdsCsv(ads: SavedAd[], filename?: string) {
  const name = filename || `adspy-saved-ads-${new Date().toISOString().slice(0, 10)}.csv`;
  downloadFile(name, adsToCsv(ads), "text/csv;charset=utf-8;");
}

/** Convenience: download ads as JSON */
export function downloadAdsJson(ads: SavedAd[], filename?: string) {
  const name = filename || `adspy-saved-ads-${new Date().toISOString().slice(0, 10)}.json`;
  downloadFile(name, adsToJson(ads), "application/json");
}

/** Convenience: download ads as printable HTML report (user can then Print → Save as PDF) */
export function downloadAdsHtmlReport(ads: SavedAd[], filename?: string) {
  const name = filename || `adspy-report-${new Date().toISOString().slice(0, 10)}.html`;
  downloadFile(name, adsToHtmlReport(ads), "text/html");
}

/* ---------------- Competitor Exports ---------------- */

/** Builds a CSV string from competitor data. */
export function competitorsToCsv(comps: Competitor[]): string {
  const headers = [
    "Name", "Handle", "Category", "Active Ads", "Total Saved",
    "New This Week", "Status", "Last Checked", "Page ID",
  ];
  const rows = comps.map((c) => [
    c.name, c.handle, c.category, c.activeAds, c.totalSaved,
    c.newAdsThisWeek, c.status, c.lastChecked, c.pageId,
  ].map(escapeCsv).join(","));
  return [headers.map(escapeCsv).join(","), ...rows].join("\n");
}

/** Builds a printable HTML comparison report for competitors. */
export function competitorsToHtmlReport(comps: Competitor[], title = "AdSpy Lite — Competitor Comparison Report"): string {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const totalActive = comps.reduce((s, c) => s + c.activeAds, 0);
  const totalNew = comps.reduce((s, c) => s + c.newAdsThisWeek, 0);
  const topByAds = [...comps].sort((a, b) => b.activeAds - a.activeAds)[0];
  const topByNew = [...comps].sort((a, b) => b.newAdsThisWeek - a.newAdsThisWeek)[0];

  const cards = comps.map((c) => `
    <div class="comp-card">
      <div class="comp-header" style="background:${c.avatarColor}">
        <div class="avatar">${c.name.slice(0, 2).toUpperCase()}</div>
        <div>
          <h3>${escapeHtml(c.name)}</h3>
          <p class="handle">${escapeHtml(c.handle)} · ${escapeHtml(c.category)}</p>
        </div>
      </div>
      <div class="comp-stats">
        <div class="stat"><span class="num">${c.activeAds}</span><span class="lbl">Active Ads</span></div>
        <div class="stat"><span class="num">${c.totalSaved}</span><span class="lbl">Saved</span></div>
        <div class="stat"><span class="num" style="color:#16a34a">+${c.newAdsThisWeek}</span><span class="lbl">New (7d)</span></div>
        <div class="stat"><span class="num">${c.status === "tracking" ? "Tracking" : "Paused"}</span><span class="lbl">Status</span></div>
      </div>
      <div class="trend">
        <span class="trend-label">7-day trend</span>
        <div class="spark">${c.trend.map((v) => `<span class="bar" style="height:${(v / Math.max(...c.trend)) * 100}%"></span>`).join("")}</div>
      </div>
    </div>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(title)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 32px; color: #2a1a0e; background: #fffaf2; }
  .header { background: linear-gradient(135deg, #EA6113, #F88F22, #FBB931); color: #fff; padding: 24px 32px; border-radius: 16px; margin-bottom: 20px; }
  .header h1 { margin: 0 0 4px; font-size: 22px; }
  .header p { margin: 0; opacity: 0.9; font-size: 13px; }
  .summary { display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
  .summary-item { background: #fff; border-radius: 12px; padding: 14px 18px; box-shadow: 0 2px 8px rgba(234,97,19,0.08); flex: 1; min-width: 140px; }
  .summary-item .num { font-size: 22px; font-weight: 700; color: #EA6113; }
  .summary-item .lbl { font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.05em; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
  .comp-card { background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 8px rgba(234,97,19,0.08); }
  .comp-header { padding: 16px; color: #fff; display: flex; align-items: center; gap: 12px; }
  .avatar { width: 40px; height: 40px; border-radius: 10px; background: rgba(255,255,255,0.25); display: flex; align-items: center; justify-content: center; font-weight: 700; }
  .comp-header h3 { margin: 0; font-size: 16px; }
  .comp-header .handle { margin: 2px 0 0; font-size: 11px; opacity: 0.85; }
  .comp-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 14px; }
  .stat { text-align: center; padding: 8px; background: #fff8ef; border-radius: 8px; }
  .stat .num { display: block; font-size: 18px; font-weight: 700; }
  .stat .lbl { display: block; font-size: 10px; color: #999; margin-top: 2px; }
  .trend { padding: 0 14px 14px; }
  .trend-label { font-size: 10px; color: #999; text-transform: uppercase; }
  .spark { display: flex; align-items: flex-end; gap: 3px; height: 32px; margin-top: 6px; }
  .bar { flex: 1; background: #F88F22; border-radius: 3px 3px 0 0; min-height: 4px; }
  .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #f0e4d0; font-size: 11px; color: #999; text-align: center; }
  .winner { background: linear-gradient(135deg, #FFE3B3, #FBB931); }
  @media print {
    body { padding: 0; background: #fff; font-size: 11px; }
    .header { border-radius: 0; padding: 16px 20px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .header h1 { font-size: 18px; }
    .summary { gap: 8px; margin-bottom: 12px; }
    .summary-item { box-shadow: none; border: 1px solid #f0e4d0; padding: 10px 12px; }
    .summary-item .num { font-size: 16px; }
    .grid { gap: 8px; }
    .comp-card { box-shadow: none; border: 1px solid #f0e4d0; break-inside: avoid; }
    .comp-header { padding: 10px 12px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .avatar { width: 32px; height: 32px; }
    .comp-stats { padding: 10px; gap: 6px; }
    .stat { padding: 6px; }
    .stat .num { font-size: 14px; }
    .footer { margin-top: 12px; padding-top: 8px; }
    @page { margin: 1.5cm; }
  }
</style>
</head>
<body>
  <div class="header">
    <h1>AdSpy Lite — Competitor Comparison Report</h1>
    <p>${comps.length} competitors compared · ${date}</p>
  </div>
  <div class="summary">
    <div class="summary-item"><span class="num">${comps.length}</span><br><span class="lbl">Competitors</span></div>
    <div class="summary-item"><span class="num">${totalActive}</span><br><span class="lbl">Total Active Ads</span></div>
    <div class="summary-item"><span class="num">+${totalNew}</span><br><span class="lbl">New This Week</span></div>
    <div class="summary-item winner"><span class="num">${escapeHtml(topByAds.name)}</span><br><span class="lbl">Most Active (${topByAds.activeAds})</span></div>
    <div class="summary-item"><span class="num">${escapeHtml(topByNew.name)}</span><br><span class="lbl">Most New (+${topByNew.newAdsThisWeek})</span></div>
  </div>
  <div class="grid">${cards}
  </div>
  <div class="footer">Generated by AdSpy Lite · For research/reference only · ${date}</div>
</body>
</html>`;
}

/** Convenience: download competitors as CSV */
export function downloadCompetitorsCsv(comps: Competitor[], filename?: string) {
  const name = filename || `adspy-competitors-${new Date().toISOString().slice(0, 10)}.csv`;
  downloadFile(name, competitorsToCsv(comps), "text/csv;charset=utf-8;");
}

/** Convenience: download competitors as HTML comparison report */
export function downloadCompetitorHtmlReport(comps: Competitor[], filename?: string) {
  const name = filename || `adspy-competitor-comparison-${new Date().toISOString().slice(0, 10)}.html`;
  downloadFile(name, competitorsToHtmlReport(comps), "text/html");
}
