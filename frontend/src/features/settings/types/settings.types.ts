export type SettingsTab = "account" | "appearance";

export interface UserSettings {
  email?: string;
  username?: string;
  password?: string;
  theme?: "light" | "dark";
}

export interface SettingsNavItem {
  id: SettingsTab;
  label: string;
  description: string;
  icon: string;
}
