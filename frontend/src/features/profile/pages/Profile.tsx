import { useProfileData } from "../hooks/useProfileData";
import { ProfileProvider } from "../context/Profile/ProfileProvider";
import { Modal, LoadingSpinner } from "@/shared";
import { SectionsProvider } from "../context/Section/SectionsProvider";
import { FileDeletionProvider } from "../context/FileDeletion/FileDeletionProvider";
import { StorageRefreshProvider } from "../context/StorageRefresh/StorageRefreshProvider";
import { ProfileContentContainer } from "../containers/ProfileContentContainer";

export const Profile = () => {
  const { data, error, isLoading, isOwnProfile } = useProfileData();

  if (!data) return null;

  const safeSections = data.userSectionData ?? [];

  return (
    <ProfileProvider isOwnProfile={isOwnProfile}>
      {isLoading && (
        <Modal>
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner size="lg" />
          </div>
        </Modal>
      )}

      {!isLoading && error && (
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-500">Error loading profile.</p>
        </div>
      )}

      {!isLoading && data && (
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
      )}
    </ProfileProvider>
  );
};
