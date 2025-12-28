import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle: ReactNode;
}

export const AboutCard = ({ title, subtitle }: Props) => {
  return (
    <div className="bg-[#0e172ab8] p-4 rounded-lg">
      <h2 className="text-xl text-center text-gray-300">{title}</h2>
      <div className="text-[16px] text-gray-400 text-center break-words">
        {subtitle}
      </div>
    </div>
  );
};
