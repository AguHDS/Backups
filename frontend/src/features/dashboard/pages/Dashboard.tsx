import { FiFolder, FiActivity, FiHardDrive } from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { StatCard } from "../components";
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
  const totalFiles = data?.totalFiles || 0;
  const maxStorage = data?.maxStorage || 446 * 1024 * 1024; // Default 446 MB

  const usedPercentage = Math.min((used / maxStorage) * 100, 100);
  const remainingBytes = Math.max(maxStorage - used, 0);
  const averageFileSize = totalFiles > 0 ? Math.round(used / totalFiles) : 0;
  const storageStatus =
    usedPercentage > 90
      ? "Almost full"
      : usedPercentage > 70
        ? "Getting full"
        : "Healthy";

  const storageDetailData = [
    {
      name: "Used",
      value: used,
      fill: usedPercentage > 70 ? "#ef4444" : "#10b981",
    },
    { name: "Available", value: remainingBytes, fill: "#10b981" },
  ];

  return (
    <div className="flex items-center justify-center my-10 px-4">
      <div className="w-[70%] space-y-9">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl mb-3 font-bold text-gray-200 m-0">
            Welcome{user?.name ? `, ${user.name}` : ""}!
          </h2>

          <span className="text-lg font-sans text-gray-200">
            These are your stats. You can check for more details in your profile
          </span>
        </div>

        {/* Statistics section */}
        <div className="flex flex-wrap gap-6 justify-between">
          <StatCard
            title="Storage Overview"
            icon={<FiFolder className="text-3xl text-green-600" />}
            subtitle="Your storage usage"
            value={`${formatBytes(used)} of ${formatBytes(maxStorage)}`}
            color={usedPercentage > 70 ? "text-red-500" : "text-green-600"}
          >
            <div className="space-y-4 mt-2">
              <div className="h-40 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "Used",
                          value: used,
                          color:
                            usedPercentage > 90
                              ? "#ef4444"
                              : usedPercentage > 70
                                ? "#f59e0b"
                                : "#10b981",
                        },
                        {
                          name: "Free",
                          value: remainingBytes,
                          color: "#374151",
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={60}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      isAnimationActive={true}
                      animationDuration={800}
                    >
                      <Cell
                        key="used"
                        fill={
                          usedPercentage > 90
                            ? "#ef4444"
                            : usedPercentage > 70
                              ? "#f59e0b"
                              : "#10b981"
                        }
                      />
                      <Cell key="free" fill="#374151" />
                    </Pie>
                    <text
                      x="50%"
                      y="45%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-2xl font-bold"
                      fill={
                        usedPercentage > 90
                          ? "#ef4444"
                          : usedPercentage > 70
                            ? "#f59e0b"
                            : "#10b981"
                      }
                    >
                      {usedPercentage.toFixed(0)}%
                    </text>
                    <text
                      x="50%"
                      y="55%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-sm"
                      fill="#6b7280"
                    >
                      Used
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div
                  className={`text-center p-3 rounded-lg ${
                    usedPercentage > 90
                      ? "bg-red-50 dark:bg-red-900/20"
                      : usedPercentage > 70
                        ? "bg-yellow-50 dark:bg-yellow-900/20"
                        : "bg-green-50 dark:bg-green-900/20"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center gap-1 mb-1 ${
                      usedPercentage > 90
                        ? "text-red-600 dark:text-red-400"
                        : usedPercentage > 70
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    <FiFolder className="text-current" />
                    <div className="text-xs">Used space</div>
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      usedPercentage > 90
                        ? "text-red-700 dark:text-red-300"
                        : usedPercentage > 70
                          ? "text-yellow-700 dark:text-yellow-300"
                          : "text-green-700 dark:text-green-300"
                    }`}
                  >
                    {formatBytes(used)}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <FiHardDrive className="text-gray-600 dark:text-gray-400" />
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Remaining
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {formatBytes(remainingBytes)}
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">
                    {formatBytes(remainingBytes)}
                  </span>{" "}
                  available •{" "}
                  <span
                    className={
                      usedPercentage > 90
                        ? "text-red-500"
                        : usedPercentage > 70
                          ? "text-yellow-500"
                          : "text-green-500"
                    }
                  >
                    {storageStatus}
                  </span>
                </div>
              </div>
            </div>
          </StatCard>

          <StatCard
            title="File Statistics"
            icon={<FiActivity className="text-3xl text-purple-600" />}
            subtitle="Files uploaded to your sections"
            value=""
            color="text-2xl text-purple-500"
          >
            <div className="space-y-4 mt-4">
              <div className="text-center py-3">
                <div className="text-5xl font-bold text-purple-600 mb-2">
                  {totalFiles}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  total files
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Total file size
                  </div>
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {formatBytes(used)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Avg. size
                  </div>
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {averageFileSize > 0 ? formatBytes(averageFileSize) : "—"}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {totalFiles > 0
                    ? `Average file size: ${formatBytes(averageFileSize)}`
                    : "Upload your first file to get started"}
                </div>
              </div>
            </div>
          </StatCard>

          <StatCard
            title="Storage Details"
            icon={<FiHardDrive className="text-3xl text-blue-600" />}
            subtitle="Usage breakdown"
            value={`${formatBytes(used)} used`}
            color="text-2xl text-blue-500"
          >
            <div className="space-y-4 mt-2">
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={storageDetailData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="name"
                      stroke="#9ca3af"
                      tick={{ fill: "#9ca3af" }}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      tick={{ fill: "#9ca3af" }}
                      tickFormatter={(value) => {
                        if (value >= 1024 * 1024 * 1024)
                          return `${(value / (1024 * 1024 * 1024)).toFixed(1)}GB`;
                        if (value >= 1024 * 1024)
                          return `${(value / (1024 * 1024)).toFixed(1)}MB`;
                        if (value >= 1024)
                          return `${(value / 1024).toFixed(1)}KB`;
                        return `${value}B`;
                      }}
                    />
                    <Tooltip
                      formatter={(value) => [
                        formatBytes(Number(value)),
                        "Storage",
                      ]}
                      labelFormatter={(label) => (
                        <span style={{ color: "#ffffff" }}>{label}</span>
                      )}
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#ffffff",
                      }}
                      itemStyle={{ color: "#ffffff" }}
                      labelStyle={{
                        color: "#ffffff",
                        fontWeight: "bold",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                    >
                      {storageDetailData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 text-center">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {formatBytes(remainingBytes)}
                </span>{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  available
                </span>
              </div>
            </div>
          </StatCard>
        </div>

        <div className="mt-16">
          <div className="bg-gray-800/50 mt-12 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-200 mb-3">
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-300">Used Storage</span>
                </div>
                <div className="text-lg font-bold text-white mt-1">
                  {formatBytes(used)}
                </div>
              </div>
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span className="text-sm text-gray-300">Free Space</span>
                </div>
                <div className="text-lg font-bold text-white mt-1">
                  {formatBytes(remainingBytes)}
                </div>
              </div>
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-gray-300">Total Files</span>
                </div>
                <div className="text-lg font-bold text-white mt-1">
                  {totalFiles.toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-300">Avg File Size</span>
                </div>
                <div className="text-lg font-bold text-white mt-1">
                  {averageFileSize > 0 ? formatBytes(averageFileSize) : "—"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
