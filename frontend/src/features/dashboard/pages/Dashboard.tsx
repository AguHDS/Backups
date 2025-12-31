import { FiFolder, FiActivity } from "react-icons/fi";
import { StatCard } from "../components";
import {AboutCard} from "@/views/home/components/AboutCard";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/redux/store";
import { formatBytes } from "@/shared/utils/formatBytes";
import { LoadingSpinner } from "@/shared";
import { useDashboardSummary } from "@/features/dashboard/hooks/useDashboard";

export const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data, isLoading, isError, error } = useDashboardSummary();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">
            Error loading dashboard data
          </p>
          <p className="text-gray-400">{error?.message}</p>
        </div>
      </div>
    );
  }

  const used = data?.used || 0;

  return (
    <div className="flex items-center justify-center my-10 px-4">
      <div className="w-[70%] space-y-9">
        {/* About section */}
        <div className="bg-[#232d42] p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-200 mb-10 flex justify-center">
            Welcome{user?.name ? `, ${user.name}` : ""}!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <AboutCard
              title="Store your files"
              subtitle="backup your files in a secure way, and edit your privacy
                settings in case you want to make them public or private and
                show them in your profile"
            />
            <AboutCard
              title="Daily quests"
              subtitle={
                <>
                  by doing daily quests you can gain exp and upgrade your
                  account level, gaining benefits, like for example additional
                  <span className="text-green-400"> storage space</span>
                </>
              }
            />
          </div>
        </div>
        {/* Statistics section */}
        <div className="flex flex-wrap gap-6 justify-between">
          <StatCard
            title="My storage"
            icon={<FiFolder className="text-3xl text-green-600" />}
            subtitle="Max. storage available: 446mb"
            value={formatBytes(used)}
            color="text-2xl text-green-600"
          >
            <div className="mt-4 bg-gray-200 h-2 rounded-full">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{
                  width: `${Math.min((used / (446 * 1024 * 1024)) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </StatCard>
          <StatCard
            title="Account stats"
            icon={<FiActivity className="text-3xl text-purple-600" />}
            subtitle="My store"
            value={`${0} files saved`}
            color="text-2xl text-purple-500"
          ></StatCard>
        </div>
      </div>
    </div>
  );
};
