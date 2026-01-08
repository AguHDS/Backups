import { SettingSection } from "../components/SettingSection";

export const AccountSettingsPage = () => {
  return (
    <div className="space-y-8">
      <SettingSection
        title="Account Information"
        description="Update your personal information"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Username
            </label>
            <input
              type="text"
              placeholder="Username"
              className="m-auto rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Email Address
          </label>
          <input
            type="email"
            placeholder="email@example.com"
            className="m-auto rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </SettingSection>

      <div className="flex justify-end gap-3 pt-4">
        <button className="rounded-lg border border-slate-700 bg-slate-900 px-6 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800">
          Cancel
        </button>
        <button className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500">
          Save Changes
        </button>
      </div>
    </div>
  );
};
