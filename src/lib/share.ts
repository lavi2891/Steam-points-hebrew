import type { SteamLevel, TriggerItem } from "../types";
import { renderStarRating, renderSteamIcons } from "./scoring";

type SharePayload = {
  score: number;
  level: SteamLevel;
  topTriggers: TriggerItem[];
  url: string;
};

export function buildShareText({ score, level, topTriggers, url }: SharePayload): string {
  const triggerLine = topTriggers.length
    ? `הטריגרים שלי: ${topTriggers.map((trigger) => trigger.item).join(" | ")}`
    : "הטריגרים שלי: עוד לא סימנתי כלום";

  return [
    `הנק״ק שלי: ${score} נקודות קיטור`,
    `${level.title} ${renderStarRating(level.stars)}`,
    renderSteamIcons(level.stars),
    triggerLine,
    "בדקו גם אתם 👇",
    url,
  ].join("\n");
}

export async function shareResult(text: string, url: string, title: string): Promise<"shared" | "copied" | "cancelled"> {
  try {
    if (navigator.share) {
      await navigator.share({ title, text, url });
      return "shared";
    }

    await navigator.clipboard.writeText(text);
    return "copied";
  } catch {
    return "cancelled";
  }
}
