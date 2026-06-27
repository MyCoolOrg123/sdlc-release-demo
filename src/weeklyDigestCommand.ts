import {
  DigestItem,
  WeeklyDigestSummary,
  formatWeeklyDigestSummary,
} from "./digest";
import { canUseWeeklyDigest } from "./featureFlags";

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

type Timestamp = Date | string;

export interface WeeklyDigestIssue {
  title: string;
  url: string;
  state: "open" | "closed";
  labels: string[];
  closedAt?: Timestamp;
}

export interface WeeklyDigestPullRequest {
  title: string;
  url: string;
  state: "open" | "closed" | "merged";
  labels: string[];
  mergedAt?: Timestamp;
}

export interface WeeklyDigestCommandInput {
  serverVisibility: "public" | "private";
  requestedByModerator: boolean;
  now: Timestamp;
  issues: WeeklyDigestIssue[];
  pullRequests: WeeklyDigestPullRequest[];
}

export interface WeeklyDigestCommandResponse {
  ok: boolean;
  ephemeral: boolean;
  needsConfirmation: boolean;
  content: string;
}

export function handleWeeklyDigestCommand(
  input: WeeklyDigestCommandInput,
): WeeklyDigestCommandResponse {
  if (!canUseWeeklyDigest(input.serverVisibility)) {
    return {
      ok: false,
      ephemeral: true,
      needsConfirmation: false,
      content: "The /weekly-digest command is not enabled for this server.",
    };
  }

  if (!input.requestedByModerator) {
    return {
      ok: false,
      ephemeral: true,
      needsConfirmation: false,
      content: "Only moderators can run /weekly-digest.",
    };
  }

  return {
    ok: true,
    ephemeral: true,
    needsConfirmation: true,
    content: `${formatWeeklyDigestSummary(
      buildWeeklyDigestSummary(input),
    )}\n\nReview and confirm before posting this digest.`,
  };
}

export function buildWeeklyDigestSummary(
  input: WeeklyDigestCommandInput,
): WeeklyDigestSummary {
  return {
    closedSupportIssues: input.issues
      .filter((issue) => issue.state === "closed")
      .filter((issue) => hasAnyLabel(issue.labels, ["support", "bug"]))
      .filter((issue) => isWithinLastWeek(issue.closedAt, input.now))
      .map((issue) => issueToDigestItem(issue)),
    openBlockers: input.issues
      .filter((issue) => issue.state === "open")
      .filter((issue) => hasAnyLabel(issue.labels, ["release-blocker"]))
      .map((issue) => issueToDigestItem(issue)),
    shippedFixes: input.pullRequests
      .filter((pullRequest) => pullRequest.state === "merged")
      .filter((pullRequest) =>
        hasAnyLabel(pullRequest.labels, ["fix", "bug", "support"]),
      )
      .filter((pullRequest) => isWithinLastWeek(pullRequest.mergedAt, input.now))
      .map((pullRequest) => pullRequestToDigestItem(pullRequest)),
  };
}

function issueToDigestItem(issue: WeeklyDigestIssue): DigestItem {
  return {
    title: issue.title,
    url: issue.url,
    kind: "issue",
    risk: hasAnyLabel(issue.labels, ["release-blocker"]) ? "high" : "medium",
  };
}

function pullRequestToDigestItem(
  pullRequest: WeeklyDigestPullRequest,
): DigestItem {
  return {
    title: pullRequest.title,
    url: pullRequest.url,
    kind: "pull_request",
    risk: hasAnyLabel(pullRequest.labels, ["release-blocker"]) ? "high" : "low",
  };
}

function hasAnyLabel(labels: string[], expected: string[]): boolean {
  const normalizedLabels = labels.map((label) => label.toLowerCase());

  return expected.some((label) => normalizedLabels.includes(label));
}

function isWithinLastWeek(
  value: Timestamp | undefined,
  now: Timestamp,
): boolean {
  if (!value) {
    return false;
  }

  const timestamp = new Date(value).getTime();
  const nowTimestamp = new Date(now).getTime();

  if (Number.isNaN(timestamp) || Number.isNaN(nowTimestamp)) {
    return false;
  }

  const age = nowTimestamp - timestamp;

  return age >= 0 && age <= ONE_WEEK_MS;
}
