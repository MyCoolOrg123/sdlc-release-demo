export const features = {
  weeklyDigest: true,
  releaseReadinessSummary: true,
  incidentPrivateNotes: false,
};

export function canUseWeeklyDigest(serverVisibility: "public" | "private"): boolean {
  return features.weeklyDigest && serverVisibility === "private";
}
