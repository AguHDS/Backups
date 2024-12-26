export const StatCard = ({ type = '', title, icon, subtitle, value, color, children }) => {
  return (
    <div className="w-full sm:w-1/2 mb-5 md:w-1/4 lg:w-80 p-2 flex">
      <div className="bg-[#232d42] w-full p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <span className={color}>{icon}</span>
        </div>
        {type === "partner" ? (
          <div className="flex items-center gap-x-2">
            <p className="text-white mb-3">{subtitle}</p>
            <div className={color}>{value}</div>
          </div>
        ) : (
          <>
            <p className="text-white mb-3">{subtitle}</p>
            <div className={color}>{value}</div>
          </>
        )}
        {children}
      </div>
    </div>
  );
}
