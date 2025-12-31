import { AdminDashboardProvider } from "../context";
import { useGetAllUsers } from "../hooks/useAdminMutations";
import { UserSelector } from "../components/UserSelector";
import { ManageCredentials } from "../components/ManageCredentials";
import { ManageSections } from "../components/ManageSections";
import { ManageUser } from "../components/ManageUser";

export const AdminDashboard: React.FC = () => {
  const { data, isLoading, error } = useGetAllUsers();

  return (
    <AdminDashboardProvider>
      <div className="min-h-screen bg-[#0a0f1e] py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Manage Users
            </h1>
            <p className="text-gray-300">
              Administrative panel to manage user accounts, credentials, and
              data
            </p>
          </div>

          {/* User Selector */}
          <div className="mb-8 bg-[#232d42] rounded-lg border border-[#3a4a68] p-6">
            {isLoading && (
              <p className="text-gray-400">Loading users...</p>
            )}
            {error && (
              <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-md p-4 mb-4">
                <p className="text-sm text-yellow-300">
                  ⚠️ Error loading users: {error.message}. Please make sure the backend is running.
                </p>
              </div>
            )}
            {data?.users && <UserSelector users={data.users} />}
            {!isLoading && !error && !data?.users && (
              <p className="text-gray-400">No users found.</p>
            )}
          </div>

          {/* Management Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Manage Credentials */}
            <div className="lg:col-span-2">
              <ManageCredentials />
            </div>

            {/* Manage Sections */}
            <div>
              <ManageSections />
            </div>

            {/* Manage User (Delete) */}
            <div>
              <ManageUser />
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardProvider>
  );
};
