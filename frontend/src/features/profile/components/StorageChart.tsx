import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { formatBytes } from "@/shared/utils/formatBytes";

type Props = {
  usedBytes: number;
  limitBytes: number;
  remainingBytes: number;
};

export function StorageChart({
  usedBytes,
  limitBytes = 0,
  remainingBytes,
}: Props) {
  const used = Math.max(0, usedBytes);
  const limit = Math.max(0, limitBytes);

  const remaining =
    typeof remainingBytes === "number"
      ? Math.max(0, remainingBytes)
      : Math.max(limit - used, 0);

  const usedPercentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;

  const storageStatus =
    usedPercentage > 90
      ? "Almost full"
      : usedPercentage > 70
        ? "Getting full"
        : "Healthy";

  const getStatusColor = () => {
    if (usedPercentage > 90) return "#ef4444";
    if (usedPercentage > 70) return "#f59e0b";
    return "#10b981";
  };

  const data = [
    {
      name: "Used",
      value: used,
      color: getStatusColor(),
    },
    {
      name: "Free",
      value: remaining,
      color: "#374151",
    },
  ];

  return (
    <div
      className="bg-[#222222] p-4 pt-1 rounded-2xl text-slate-200"
      aria-label="Graph for used storage"
    >
      <div>
        <h3 className="flex justify-center text-md font-semibold text-gray-200 mb-1">
          Storage
        </h3>
      </div>

      <div className="h-32 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={50}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              isAnimationActive={true}
              animationDuration={800}
            >
              <Cell key="used" fill={getStatusColor()} />
              <Cell key="free" fill="#374151" />
            </Pie>
            <text
              x="50%"
              y="45%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xl font-bold"
              fill={getStatusColor()}
            >
              {usedPercentage.toFixed(0)}%
            </text>
            <text
              x="50%"
              y="60%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs"
              fill="#C4C4C4"
            >
              Used
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getStatusColor() }}
            ></div>
            <span className="text-xs text-gray-400">Used space</span>
          </div>
          <span className="text-sm font-sans text-gray-200">
            {formatBytes(used)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
            <span className="text-xs text-gray-400">Remaining</span>
          </div>
          <span className="text-sm font-sans text-gray-200">
            {formatBytes(remaining)}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="text-xs text-gray-400 text-center">
          <span
            className={
              usedPercentage > 90
                ? "text-red-400"
                : usedPercentage > 70
                  ? "text-yellow-400"
                  : "text-green-400"
            }
          >
            Status • {storageStatus}
          </span>
        </div>
      </div>
    </div>
  );
}
