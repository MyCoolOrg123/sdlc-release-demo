export interface DigestItem {
  title: string;
  url: string;
  kind: "issue" | "pull_request";
  risk: "low" | "medium" | "high";
}

export function formatWeeklyDigest(items: DigestItem[]): string {
  if (items.length === 0) {
    return "No tracked support or release items changed this week.";
  }

  return items
    .map((item) => `- [${item.kind}] ${item.title} (${item.risk}) ${item.url}`)
    .join("\n");
}
