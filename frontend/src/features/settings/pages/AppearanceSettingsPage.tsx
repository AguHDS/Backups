import { useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { SettingSection } from "../components/SettingSection";
import type { UserSettings } from "../types";

export const AppearanceSettingsPage = () => {
  const [settings, setSettings] = useState<UserSettings>({
    theme: "dark",
    chartAnimations: true,
    compactMode: false,
    showGridLines: true,
  });

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const handleToggle = (key: keyof UserSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Appearance</h2>
      </div>

      <SettingSection
        title="Theme"
        description="Choose your preferred color scheme"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button
            onClick={() => handleThemeChange("dark")}
            className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-colors hover:bg-slate-800 ${
              settings.theme === "dark"
                ? "border-emerald-500 bg-slate-900"
                : "border-slate-700 bg-slate-900"
            }`}
          >
            <Moon
              className={`h-5 w-5 ${
                settings.theme === "dark"
                  ? "text-emerald-400"
                  : "text-slate-400"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                settings.theme === "dark" ? "text-white" : "text-slate-400"
              }`}
            >
              Dark
            </span>
          </button>
          <button
            onClick={() => handleThemeChange("light")}
            className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-colors hover:bg-slate-800 ${
              settings.theme === "light"
                ? "border-emerald-500 bg-slate-900"
                : "border-slate-700 bg-slate-900"
            }`}
          >
            <Sun
              className={`h-5 w-5 ${
                settings.theme === "light"
                  ? "text-emerald-400"
                  : "text-slate-400"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                settings.theme === "light" ? "text-white" : "text-slate-400"
              }`}
            >
              Light
            </span>
          </button>
          <button
            onClick={() => handleThemeChange("system")}
            className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-colors hover:bg-slate-800 ${
              settings.theme === "system"
                ? "border-emerald-500 bg-slate-900"
                : "border-slate-700 bg-slate-900"
            }`}
          >
            <Monitor
              className={`h-5 w-5 ${
                settings.theme === "system"
                  ? "text-emerald-400"
                  : "text-slate-400"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                settings.theme === "system" ? "text-white" : "text-slate-400"
              }`}
            >
              Auto
            </span>
          </button>
        </div>
      </SettingSection>
    </div>
  );
};
