import { useState } from "react";
import { useAdminDashboard } from "../context";
import { useDeleteUser } from "../hooks/useAdminMutations";

export const ManageUser: React.FC = () => {
  const { selectedUser, setSelectedUser } = useAdminDashboard();
  const deleteUserMutation = useDeleteUser();
  const [confirmText, setConfirmText] = useState("");

  const isDisabled = !selectedUser;

  const handleDeleteUser = () => {
    if (!selectedUser) return;

    if (confirmText !== selectedUser.name) {
      alert("Please type the username correctly to confirm deletion");
      return;
    }

    const finalConfirm = window.confirm(
      `FINAL WARNING: Are you absolutely sure you want to permanently delete user "${selectedUser.name}"? This action cannot be undone and will delete all their data including sections and files.`
    );

    if (!finalConfirm) return;

    deleteUserMutation.mutate(
      { userId: selectedUser.id },
      {
        onSuccess: (response) => {
          alert(`Success: ${response.message}`);
          setSelectedUser(null);
          setConfirmText("");
        },
        onError: (error) => {
          alert(`Error: ${error.message}`);
        },
      }
    );
  };

  return (
    <div className="bg-[#232d42] rounded-lg border border-red-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-red-400 text-xl">⚠️</span>
        <h3 className="text-lg font-semibold text-red-400">
          Danger Zone - Delete User
        </h3>
      </div>

      {!selectedUser && (
        <p className="text-sm text-gray-400 mb-4">
          Select a user to delete their account
        </p>
      )}

      {selectedUser && (
        <>
          <div className="bg-red-900/20 border border-red-800/50 rounded-md p-4 mb-4">
            <p className="text-sm text-red-300 mb-2">
              <strong>Warning:</strong> This action will permanently delete:
            </p>
            <ul className="text-sm text-red-300 list-disc list-inside space-y-1">
              <li>User account and profile</li>
              <li>All user sections</li>
              <li>All uploaded files (CASCADE DELETE)</li>
              <li>All related data in the database</li>
            </ul>
          </div>

          <div className="mb-4 p-4 bg-[#1a2332] rounded-md border border-[#3a4a68]">
            <p className="text-sm font-medium text-gray-200 mb-2">
              Selected User:
            </p>
            <div className="flex items-center gap-3">
              <div>
                <p className="font-semibold text-white">
                  {selectedUser.name}
                </p>
                <p className="text-sm text-gray-400">{selectedUser.email}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  selectedUser.role === "admin"
                    ? "bg-purple-900/50 text-purple-300"
                    : "bg-blue-900/50 text-blue-300"
                }`}
              >
                {selectedUser.role}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Type the username "<strong>{selectedUser.name}</strong>" to
              confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={isDisabled}
              placeholder={selectedUser.name}
              className="w-full px-3 py-2 border border-[#3a4a68] rounded-md bg-[#1a2332] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
            onClick={handleDeleteUser}
            disabled={
              isDisabled ||
              confirmText !== selectedUser.name ||
              deleteUserMutation.isPending
            }
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-[#2a3a58] disabled:cursor-not-allowed transition-colors font-medium"
          >
            {deleteUserMutation.isPending
              ? "Deleting User..."
              : "Delete User Permanently"}
          </button>
        </>
      )}
    </div>
  );
};
