export interface DigestItem {
  title: string;
  url: string;
  kind: "issue" | "pull_request";
  risk: "low" | "medium" | "high";
}

export interface WeeklyDigestSummary {
  closedSupportIssues: DigestItem[];
  openBlockers: DigestItem[];
  shippedFixes: DigestItem[];
}

export function formatWeeklyDigest(items: DigestItem[]): string {
  if (items.length === 0) {
    return "No tracked support or release items changed this week.";
  }

  return items
    .map((item) => `- [${item.kind}] ${item.title} (${item.risk}) ${item.url}`)
    .join("\n");
}

export function formatWeeklyDigestSummary(summary: WeeklyDigestSummary): string {
  const sections = [
    formatDigestSection("Closed support issues", summary.closedSupportIssues),
    formatDigestSection("Open blockers", summary.openBlockers),
    formatDigestSection("Shipped fixes", summary.shippedFixes),
  ];

  return sections.join("\n\n");
}

function formatDigestSection(heading: string, items: DigestItem[]): string {
  const body =
    items.length === 0
      ? "- None"
      : items
          .map((item) => `- [${item.kind}] ${item.title} (${item.risk}) ${item.url}`)
          .join("\n");

  return `## ${heading}\n${body}`;
}
