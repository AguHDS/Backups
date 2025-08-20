import { memo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import { formatBytes } from "../../../shared/utils/formatBytes";
import { Button } from "@/shared/components/buttons/Button";

type Props = {
  usedBytes: number;
  available?: string; // not implemented yet
};

const color = "#ffc533";

export const StorageGraph = memo(function StorageGraph({
  usedBytes,
  available,
}: Props) {
  const safeUsed = Math.max(0, usedBytes);
  const data = [{ name: "Storage", value: safeUsed || 1, key: "used" }];

  return (
    <div
      className={`bg-[#222222] mt-4 rounded-2xl p-2 text-slate-200 `}
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
              <Cell key="used" fill={color} />
              <Label
                value="Storage"
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
            {available}
          </span>
        </div>
        <div className="flex my-[2px] justify-between items-center w-full">
          <span className="px-1">total used</span>
          <span className="px-1" style={{ color: color }}>
            {formatBytes(safeUsed)}
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
