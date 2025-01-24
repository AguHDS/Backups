export const Storage = ({maxSpace, available, used, shared}) => {
  return (
    <div className="mt-4 flex flex-col w-full">
      <div className="flex my-[3px] justify-between items-center w-full">
        <span className="text-green-400 text-ls px-4">Max. space</span>
        <span className="text-green-400 text-ls px-4 text-sm">{maxSpace}</span>
      </div>
      <div className="flex my-[3px] justify-between items-center w-full">
        <span className="text-cyan-300 text-ls px-4">space available</span>
        <span className="text-cyan-300 text-ls px-4 text-sm">{available}</span>
      </div>
      <div className="flex my-[3px] justify-between items-center w-full">
        <span className="text-red-500 text-ls px-4">space used</span>
        <span className="text-red-500 text-ls px-4 text-sm">{used}</span>
      </div>
      <div className="flex my-[3px] justify-between items-center w-full">
        <span className="text-yellow-500 text-ls px-4">space shared</span>
        <span className="text-yellow-500 text-ls px-4 text-sm">{shared}</span>
      </div>
    </div>
  );
};
