import { useState } from "react";
import { useAdminDashboard } from "../context";
import { useUpdateUserCredentials } from "../hooks/useAdminMutations";

export const ManageCredentials: React.FC = () => {
  const { selectedUser } = useAdminDashboard();
  const updateCredentialsMutation = useUpdateUserCredentials();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isDisabled = !selectedUser;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const updateData: {
      userId: string;
      username?: string;
      email?: string;
      password?: string;
    } = { userId: selectedUser.id };

    if (username.trim()) updateData.username = username.trim();
    if (email.trim()) updateData.email = email.trim();
    if (password.trim()) updateData.password = password.trim();

    if (Object.keys(updateData).length === 1) {
      alert("Please enter at least one field to update");
      return;
    }

    updateCredentialsMutation.mutate(updateData, {
      onSuccess: (response) => {
        alert(response.message);
        setUsername("");
        setEmail("");
        setPassword("");
      },
      onError: (error) => {
        alert(`Error: ${error.message}`);
      },
    });
  };

  return (
    <div className="bg-[#232d42] rounded-lg border border-[#3a4a68] p-6">
      <h3 className="text-lg font-semibold mb-4 text-white">
        Manage User Credentials
      </h3>

      {!selectedUser && (
        <p className="text-sm text-gray-400 mb-4">
          Select a user to manage their credentials
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            New Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isDisabled}
            placeholder="Leave empty to keep current"
            className="w-full px-3 py-2 border border-[#3a4a68] rounded-md bg-[#1a2332] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-[#0e172a] disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            New Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isDisabled}
            placeholder="Leave empty to keep current"
            className="w-full px-3 py-2 border border-[#3a4a68] rounded-md bg-[#1a2332] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-[#0e172a] disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isDisabled}
            placeholder="Leave empty to keep current"
            className="w-full px-3 py-2 border border-[#3a4a68] rounded-md bg-[#1a2332] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-[#0e172a] disabled:cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={isDisabled || updateCredentialsMutation.isPending}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-[#2a3a58] disabled:cursor-not-allowed transition-colors font-medium"
        >
          {updateCredentialsMutation.isPending
            ? "Updating..."
            : "Update Credentials"}
        </button>
      </form>
    </div>
  );
};
