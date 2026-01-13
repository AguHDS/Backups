import { SettingSection } from "../components/SettingSection";
import { useAccountSettings } from "../hooks/useAccountSettings";
import { ValidationMessages } from "@/shared/components/ValidationMessages/ValidationMessages";
import { CheckCircle } from "lucide-react";

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
    showSuccessModal,
    successMessage,
    handleInputChange,
    handleSubmit,
    handleCancel,
    handleOkButtonClick,
  } = useAccountSettings();

  return (
    <div className="space-y-8">
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative w-full max-w-md mx-4">
            <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-emerald-500/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/20 rounded-full">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Changes Saved
                  </h3>
                  <p className="text-sm text-slate-400">
                    Security action required
                  </p>
                </div>
              </div>

              <p className="mb-6 text-slate-300">{successMessage}</p>

              <div className="flex justify-end">
                <button
                  onClick={handleOkButtonClick}
                  className="px-6 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors"
                >
                  OK, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ValidationMessages
        input={inputWarnings}
        status={statusCode}
        message={statusMessage}
      />

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg
            className="relative top-3 w-5 h-5 text-blue-400 mt-1 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-blue-300 mb-1">
              Security Notice
            </h4>
            <p className="text-sm text-blue-200/80">
              You will be automatically logged out after changing your
              credentials
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <SettingSection
          title="Account Information"
          description="Update your personal information"
        >
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-200 mb-2">
              New username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter new username"
              className={`w-full sm:w-96 max-w-[280px] rounded-lg border ${
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
              className={`w-full sm:w-96 max-w-[280px] rounded-lg border ${
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

        <SettingSection title="Change Password">
          <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-0 gap-4">
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
                className={`w-full sm:w-96 max-w-[280px] rounded-lg border ${
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
                className={`w-full sm:w-96 max-w-[280px] rounded-lg border ${
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

        <SettingSection title="Security Verification">
          <div>
            <label className="block text-sm font-medium text-yellow-400 mb-2">
              Current Password *
            </label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              placeholder="Enter your current password"
              className={`w-full sm:w-96 max-w-[280px] rounded-lg border ${
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
          </div>
        </SettingSection>

        <div className="flex justify-end gap-3 pt-4">
          {hasChanges && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="rounded-lg border border-slate-700 bg-slate-900 px-6 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-50"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="rounded-lg border border-slate-700 bg-emerald-600 px-6 py-2 text-sm font-medium text-white hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};
