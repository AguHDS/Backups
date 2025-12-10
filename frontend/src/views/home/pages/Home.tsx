import { AboutCard } from "@/views/dashboard/components";

export const Home = () => {
  return (
    <div className="flex items-center h-[47vh] justify-center my-14 px-4">
      <div className="bg-[#232d42] p-8 shadow-lg max-w-[70%] mx-auto max-h-full overflow-y-auto overflow-x-hidden scrollbar-thin">
        <h2 className="text-3xl font-bold text-gray-200 flex justify-center mb-2 mt-0 relative top-0 h-[50px]">
          Welcome to Backups!
        </h2>
        <div className="border-[#121212] border-solid w-full"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <AboutCard
            title="Partner System"
            subtitle={
              <div>
                Being partner with another user will allow you both to share
                <span className="text-green-400"> storage space </span>with each
                other
                <h3>Coming soon!</h3>
              </div>
            }
          />
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
                by doing daily quests you can gain exp and upgrade your account
                level, gaining benefits, like for example additional
                <span className="text-green-400"> storage space</span>
              </>
            }
          />
        </div>
      </div>
    </div>
  );
};
