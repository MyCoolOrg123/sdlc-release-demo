export const features = {
  weeklyDigest: false,
  releaseReadinessSummary: true,
  incidentPrivateNotes: false,
};

export function canUseWeeklyDigest(serverVisibility: "public" | "private"): boolean {
  return features.weeklyDigest && serverVisibility === "private";
}
