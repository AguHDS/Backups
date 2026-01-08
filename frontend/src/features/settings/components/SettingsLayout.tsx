import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, User, Shield, Palette, Bell } from "lucide-react";
import { settingsNavigation } from "../utils/settingsNavigation";

const iconMap = {
  User,
  Shield,
  Palette,
  Bell,
} as const;

export const SettingsLayout = () => {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with back button */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            search={{ view: "electricity" }}
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-emerald-400"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-white">Settings</h1>
        </div>

        {/* Layout with sidebar and content */}
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 lg:flex-shrink-0">
            <nav className="space-y-1">
              {settingsNavigation.map((item) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap];
                const isActive = currentPath === `/settings/${item.id}`;

                return (
                  <Link
                    key={item.id}
                    to={`/settings/${item.id}`}
                    className={`flex items-start gap-3 rounded-lg border px-4 py-3 transition-all ${
                      isActive
                        ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-400"
                        : "border-slate-700 bg-[#232d42] text-slate-300 hover:border-slate-600 hover:bg-[#2b3550] hover:text-white"
                    }`}
                  >
                    <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{item.label}</div>
                      <div
                        className={`mt-0.5 text-xs ${
                          isActive ? "text-emerald-300/80" : "text-slate-400"
                        }`}
                      >
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Content Area */}
          <main className="flex-1 min-w-0">
            <div className="rounded-lg border border-slate-700 bg-[#232d42] p-6 shadow-xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};