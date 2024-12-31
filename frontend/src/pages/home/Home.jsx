import { FiFolder, FiUsers, FiActivity } from "react-icons/fi";

//assets
import images from "../../assets/images.js";

//components
import { FeatureCard, Header } from "./components";
import { Button, TermsAndConditions, Modal } from "../../components";

//context
import { useModalContext } from "../../components/modal/context/ModalContext.jsx";

export const Home = () => {
  const { setIsModalOpen } = useModalContext();

  return (
    <div className="min-h-[calc(100vh-3.5rem)] px-12 bg-[#0a0f1e] text-white">
      <Modal>
        <TermsAndConditions />
      </Modal>
      <Header />
      <div className="text-center mb-16 flex justify-center">
        <Button
          label="Get Started"
          className="backupsBtn flex items-center text-white px-8 py-4 rounded-lg shadow-md"
          onClick={()=> setIsModalOpen(true)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Feature Cards */}
        <div className="px-2 mx-4">
          <FeatureCard
            title="Partner System"
            description="Being partner with another user will allow you both to share storage space with each other"
            icon={<FiUsers />}
            details={{
              text: "Connect with other users to expand your storage capabilities. Share and manage space efficiently with trusted partners. Monitor shared space usage and adjust sharing preferences in real-time.",
              imageUrl: images.storageShowcase,
            }}
          />
        </div>
        <div className="px-2 mx-4">
          <FeatureCard
            title="Store your files"
            description="Backup your files in a secure way, and edit your privacy settings in case you want to make them public or private"
            icon={<FiFolder />}
            details={{
              text: "Secure file storage with end-to-end encryption. Set custom privacy levels for each file or folder. Access your files from anywhere with our cloud-based system.",
              imageUrl: images.storageShowcase,
            }}
          />
        </div>
        <div className="px-2 mx-4">
          <FeatureCard
            title="Daily quests"
            description="By doing daily quests you can gain exp and upgrade your account level, gaining benefits, like additional storage space"
            icon={<FiActivity />}
            details={{
              text: "Complete daily challenges to earn experience points. Level up your account to unlock additional storage space and premium features. Track your progress and compete with other users.",
              imageUrl: images.storageShowcase,
            }}
          />
        </div>
      </div>
    </div>
  );
};
