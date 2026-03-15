import type { SteamLevel, TriggerItem } from "../types";

export const STEAM_LEVELS: SteamLevel[] = [
  {
    min: 0,
    title: "קריר/ה",
    subtitle: "כרגע קשה מאוד להרתיח אותך.",
    stars: 1,
    accentClass: "level-cool",
    badge: "🧊",
  },
  {
    min: 20,
    title: "מתחמם/ת",
    subtitle: "יש בועה קלה, אבל עוד בשליטה.",
    stars: 2,
    accentClass: "level-warm",
    badge: "🙂",
  },
  {
    min: 40,
    title: "על סף קיטור",
    subtitle: "עדיף לא לשאול עכשיו אם הכול בסדר.",
    stars: 3,
    accentClass: "level-steamy",
    badge: "😤",
  },
  {
    min: 60,
    title: "רותח/ת",
    subtitle: "מומלץ להגיש קפה, שקט ומזגן.",
    stars: 4,
    accentClass: "level-hot",
    badge: "🔥",
  },
  {
    min: 85,
    title: "סיר לחץ אנושי",
    subtitle: "לא לגעת. לא לדבר. לא לעשות רעשי לעיסה.",
    stars: 5,
    accentClass: "level-pressure",
    badge: "💥",
  },
];

export function getItemKey(item: TriggerItem): string {
  return `${item.section}__${item.item}`;
}

export function calculateScore(items: TriggerItem[], selectedKeys: Set<string>): number {
  return items.reduce((sum, item) => {
    return sum + (selectedKeys.has(getItemKey(item)) ? item.points : 0);
  }, 0);
}

export function getSteamLevel(score: number): SteamLevel {
  return [...STEAM_LEVELS].reverse().find((level) => score >= level.min) ?? STEAM_LEVELS[0];
}

export function getTopTriggers(items: TriggerItem[], selectedKeys: Set<string>, limit = 3): TriggerItem[] {
  return items
    .filter((item) => selectedKeys.has(getItemKey(item)))
    .sort((left, right) => right.points - left.points)
    .slice(0, limit);
}

export function renderStarRating(stars: number): string {
  return `${"★".repeat(stars)}${"☆".repeat(5 - stars)}`;
}

export function renderSteamIcons(stars: number): string {
  return `${"♨️".repeat(stars)}${"▫️".repeat(5 - stars)}`;
}
