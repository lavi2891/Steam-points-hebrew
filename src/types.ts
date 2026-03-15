export type TriggerItem = {
  section: string;
  item: string;
  points: number;
};

export type TriggerGroup = {
  section: string;
  items: TriggerItem[];
};

export type SteamLevel = {
  min: number;
  title: string;
  subtitle: string;
  stars: number;
  accentClass: string;
  badge: string;
};
