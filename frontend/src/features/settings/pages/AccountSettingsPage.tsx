import { SettingSection } from "../components/SettingSection";
import { useAccountSettings } from "../hooks/useAccountSettings";
import { ValidationMessages } from "@/shared/components/ValidationMessages/ValidationMessages";

export const AccountSettingsPage = () => {
  const {
    formData,
    validationErrors,
    statusMessage,
    statusCode,
    inputWarnings,
    hasChanges,
    isLoading,
    isSubmitDisabled,
    handleInputChange,
    handleSubmit,
    handleCancel,
  } = useAccountSettings();

  return (
    <div className="space-y-8">
      <ValidationMessages
        input={inputWarnings}
        status={statusCode}
        message={statusMessage}
      />

      <form onSubmit={handleSubmit}>
        <SettingSection
          title="Account Information"
          description="Update your personal information"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                New username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter new username"
                className={`w-full rounded-lg border ${
                  validationErrors.username
                    ? "border-red-500"
                    : "border-slate-700"
                } bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
              />
              {validationErrors.username && (
                <p className="mt-1 text-sm text-red-400">
                  {validationErrors.username}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              New email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter new email address"
              className={`w-full rounded-lg border ${
                validationErrors.email ? "border-red-500" : "border-slate-700"
              } bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-400">
                {validationErrors.email}
              </p>
            )}
          </div>
        </SettingSection>

        <SettingSection
          title="Change Password"
          description="Enter a new password if you want to change it"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter new password"
                className={`w-full rounded-lg border ${
                  validationErrors.newPassword
                    ? "border-red-500"
                    : "border-slate-700"
                } bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
              />
              {validationErrors.newPassword && (
                <p className="mt-1 text-sm text-red-400">
                  {validationErrors.newPassword}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm new password"
                className={`w-full rounded-lg border ${
                  validationErrors.confirmPassword
                    ? "border-red-500"
                    : "border-slate-700"
                } bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>
        </SettingSection>

        <SettingSection
          title="Security Verification"
          description="Enter your current password to confirm all changes"
        >
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Current Password *
            </label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              placeholder="Enter your current password"
              className={`w-full rounded-lg border ${
                validationErrors.currentPassword
                  ? "border-red-500"
                  : "border-slate-700"
              } bg-slate-900 px-4 py-2 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
            />
            {validationErrors.currentPassword && (
              <p className="mt-1 text-sm text-red-400">
                {validationErrors.currentPassword}
              </p>
            )}
            <p className="mt-2 text-sm text-slate-400">
              Required to confirm any changes to your account
            </p>
          </div>
        </SettingSection>

        <div className="flex justify-end gap-3 pt-4">
          {hasChanges && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="rounded-lg border border-slate-700 bg-slate-900 px-6 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitDisabled} //ahora actualizar el backend para que use las cosas por ejemplo current password (para todo)
            className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};