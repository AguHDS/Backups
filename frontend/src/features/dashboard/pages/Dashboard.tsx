import { FiFolder, FiUsers, FiActivity } from "react-icons/fi";
import { Button } from "../../../shared";
import { StatCard, AboutCard } from "../components";

export const Dashboard = () => {
  return (
    <div className="flex items-center justify-center my-10 px-4">
      <div className="w-[70%] space-y-9">
        {/* About section */}
        <div className="bg-[#232d42] p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-200 mb-10 flex justify-center">
            What is this app used for?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <AboutCard
              title="Partner System"
              subtitle={
                <>Being partner with another user will allow you both to share
                <span className="text-green-400"> storage space </span>with each other</> 
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
                  by doing daily quests you can gain exp and upgrade your
                  account level, gaining benefits, like for example additional
                  <span className="text-green-400">storage space</span>
                </>
              }
            />
          </div>
        </div>
        {/* Main Button - will change this section eventually, a button here makes no sense */}
        <div className="flex justify-center">
          <Button
            label="Backup Files"
            className="backupsBtn my-10 flex items-center text-white px-8 py-4 rounded-lg shadow-md"
          />
        </div>
        {/* Statics section */}
        <div className="flex flex-wrap gap-6 justify-between">
          <StatCard
            type="partner"
            title="My partnership"
            icon={<FiUsers className="text-3xl text-yellow-600" />}
            subtitle="You're partner with:"
            value="perzian"
            color="text-md text-yellow-500"
          >
            <div className="relative top-4">
              <div className="text-blue-500 my-1">space gived: 4GB</div>
              <div className="text-blue-500 my-1">space received: 2GB</div>
            </div>
          </StatCard>
          <StatCard
            title="My storage"
            icon={<FiFolder className="text-3xl text-green-600" />}
            subtitle="Max. storage available: 446mb"
            value="224mb used"
            color="text-2xl text-green-600"
          >
            <div className="mt-4 bg-gray-200 h-2 rounded-full">
              <div className="bg-green-600 h-2 rounded-full w-3/4"></div>
            </div>
          </StatCard>
          <StatCard
            title="Account s  tadistics"
            icon={<FiActivity className="text-3xl text-purple-600" />}
            subtitle="My store"
            value="448 files saved"
            color="text-2xl text-purple-500"
          ></StatCard>
        </div>
      </div>
    </div>
  );
};
