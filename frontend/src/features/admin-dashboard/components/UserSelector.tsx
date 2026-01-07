import { useState, useMemo } from "react";
import { useAdminDashboard } from "../context";
import type { User } from "../api/adminTypes";

/* eslint-disable react/prop-types */
interface UserSelectorProps {
  users: User[];
}

export const UserSelector: React.FC<UserSelectorProps> = ({ users }) => {
  const { selectedUser, setSelectedUser } = useAdminDashboard();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const lowerSearch = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerSearch) ||
        user.email.toLowerCase().includes(lowerSearch)
    );
  }, [users, searchTerm]);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-200 mb-1">
          Select User
        </label>
        <div
          className="w-full px-4 py-2 border border-[#3a4a68] rounded-md bg-[#1a2332] cursor-pointer hover:border-[#4a5a88] transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedUser ? (
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-white">{selectedUser.name}</p>
                <p className="text-sm text-gray-400">{selectedUser.email}</p>
              </div>
              <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded">
                {selectedUser.role}
              </span>
            </div>
          ) : (
            <p className="text-gray-500">Select a user...</p>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-[#1a2332] border border-[#3a4a68] rounded-md shadow-lg max-h-80 overflow-hidden">
          <div className="p-2 border-b border-[#3a4a68]">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-[#3a4a68] rounded-md bg-[#0e172a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                No users found
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="px-4 py-3 hover:bg-[#232d42] cursor-pointer border-b border-[#2a3a58] last:border-b-0 transition-colors"
                  onClick={() => handleSelectUser(user)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        user.role === "admin"
                          ? "bg-purple-900/50 text-purple-300"
                          : "bg-blue-900/50 text-blue-300"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
