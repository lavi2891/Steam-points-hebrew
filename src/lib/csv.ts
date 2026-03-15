import type { TriggerGroup, TriggerItem } from "../types";

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
}

export function parseTriggerCsv(csv: string): TriggerItem[] {
  const [headerLine, ...rows] = csv.trim().split(/\r?\n/);

  if (!headerLine) {
    return [];
  }

  const headers = splitCsvLine(headerLine);
  const sectionIndex = headers.indexOf("section");
  const itemIndex = headers.indexOf("item");
  const pointsIndex = headers.indexOf("points");

  return rows
    .map((line) => splitCsvLine(line))
    .filter((cells) => cells.length >= 3)
    .map((cells) => ({
      section: cells[sectionIndex] || "כללי",
      item: cells[itemIndex] || "",
      points: Number(cells[pointsIndex] || 0),
    }))
    .filter((item) => item.item);
}

export function groupTriggers(items: TriggerItem[]): TriggerGroup[] {
  const groups = new Map<string, TriggerItem[]>();

  for (const item of items) {
    const group = groups.get(item.section) ?? [];
    group.push(item);
    groups.set(item.section, group);
  }

  return Array.from(groups.entries()).map(([section, sectionItems]) => ({
    section,
    items: sectionItems,
  }));
}
