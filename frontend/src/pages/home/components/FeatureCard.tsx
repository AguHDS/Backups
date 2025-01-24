import { useState } from "react";
import { Button } from "../../../components";

export function FeatureCard({ title, description, icon, details }) {
  const [showDetails, setShowDetails] = useState(false);

  const handleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="feature-card bg-[#1a1f2e] rounded-lg p-6 flex flex-col justify-between h-auto">
      <div className="h-[280px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="px-1 text-2xl font-semibold text-white">{title}</h2>
          {icon}
        </div>
        <p className="px-1 text-gray-300 text-lg">{description}</p>
      </div>

      <div>
      {showDetails && (
          <div className="mt-4 p-4 bg-[#242837] rounded-lg">
            <p className="text-gray-300">{details.text}</p>
            {details.imageUrl && (
              <img
                src={details.imageUrl}
                alt={title}
                className="mt-4 rounded-lg max-w-full h-auto object-contain"
              />
            )}
          </div>
        )}
        <Button
          label={showDetails ? "Show less" : "Show more"}
          onClick={handleShowDetails}
          className="w-full bg-[#2a2f3e] text-white px-6 py-3 rounded-md hover:bg-[#3a3f4e] transition-colors text-lg"
        ></Button>

       
      </div>
    </div>
  );
}
