import { useProfileData } from "../hooks/useProfileData";
import { EditProfileProvider } from "../context/editProfile/EditProfileProvider";
import { Modal, LoadingSpinner } from "@/shared";
import { SectionsProvider } from "../context/Section/SectionsProvider";
import { FileDeletionProvider } from "../context/FileDeletion/FileDeletionProvider";
import { StorageRefreshProvider } from "../context/StorageRefresh/StorageRefreshProvider";
import { ProfileContentContainer } from "../containers/ProfileContentContainer";

export const Profile = () => {
  const { data, error, isLoading, isOwnProfile } = useProfileData();

  if (isLoading) {
    return (
      <Modal>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </Modal>
    );
  }

  if (error || !data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">
            {error || "Error loading profile"}
          </p>
          <p className="text-gray-400">
            Could not load profile data. The user may not exist or you may not
            have permission to view it.
          </p>
        </div>
      </div>
    );
  }

  const safeSections = data.userSectionData ?? [];

  return (
    <EditProfileProvider isOwnProfile={isOwnProfile}>
      <SectionsProvider
        initialSections={
          data.isOwner
            ? safeSections
            : safeSections.filter((section) => section.isPublic)
        }
      >
        <FileDeletionProvider>
          <StorageRefreshProvider>
            <ProfileContentContainer data={data} />
          </StorageRefreshProvider>
        </FileDeletionProvider>
      </SectionsProvider>
    </EditProfileProvider>
  );
};
