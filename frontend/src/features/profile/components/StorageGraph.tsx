import { memo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import { formatBytes } from "../../../shared/utils/formatBytes";
import { Button } from "@/shared/components/buttons/Button";

type Props = {
  usedBytes: number;
  limitBytes: number; 
  remainingBytes: number;
};

const COLOR_USED = "#ffc533";
const COLOR_FREE = "#3a3a3a";

export const StorageGraph = memo(function StorageGraph({
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

  const totalForChart = limit > 0 ? limit : used || 1;

  const data =
    limit > 0
      ? [
          { name: "Used", value: Math.min(used, limit), key: "used" },
          {
            name: "Free",
            value: Math.max(totalForChart - Math.min(used, limit), 0),
            key: "free",
          },
        ]
      : [{ name: "Used", value: used || 1, key: "used" }];

  const percent =
    limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;

  return (
    <div
      className="bg-[#222222] mt-4 rounded-2xl p-2 text-slate-200"
      style={{ minHeight: 180 }}
      aria-label="Graph for used storage"
    >
      <div className="w-full h-32">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={38}
              outerRadius={52}
              startAngle={90}
              endAngle={-270}
              stroke="none"
              isAnimationActive
            >
              <Cell key="used" fill={COLOR_USED} />
              {limit > 0 && <Cell key="free" fill={COLOR_FREE} />}
              <Label
                value={limit > 0 ? `${percent}%` : "Storage"}
                position="center"
                fill="#fff"
                fontSize={14}
                fontWeight="bold"
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex flex-col w-full text-[12px]">
        <div className="flex my-[2px] justify-between items-center w-full">
          <span className="px-1">total available</span>
          <span className="px-1" style={{ color: "gray" }}>
            {limit > 0 ? formatBytes(limit) : "—"}
          </span>
        </div>
        <div className="flex my-[2px] justify-between items-center w-full">
          <span className="px-1">total used</span>
          <span className="px-1" style={{ color: COLOR_USED }}>
            {formatBytes(used)}
          </span>
        </div>
        <div className="flex my-[2px] justify-between items-center w-full">
          <span className="px-1">remaining</span>
          <span className="px-1" style={{ color: "gray" }}>
            {limit > 0 ? formatBytes(remaining) : "—"}
          </span>
        </div>
      </div>

      <Button
        label="Show more"
        className="mx-auto flex mt-4 text-blue-500 text-xs hover:underline cursor-pointer bg-transparent border-none shadow-none p-0"
      />
    </div>
  );
});
