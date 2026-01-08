export type SettingsTab = "account" | "privacy" | "appearance";

export interface UserSettings {
  email?: string;
  username?: string;
  displayName?: string;
  profileVisibility?: "public" | "private" | "friends";
  analyticsTracking?: boolean;
  performanceMonitoring?: boolean;
  theme?: "light" | "dark" | "system";
  compactMode?: boolean;
  chartAnimations?: boolean;
  showGridLines?: boolean;
}

export interface SettingsNavItem {
  id: SettingsTab;
  label: string;
  description: string;
  icon: string;
}
