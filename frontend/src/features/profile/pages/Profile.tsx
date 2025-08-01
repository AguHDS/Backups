import { useProfileData } from "../hooks/useProfileData";
import { ProfileProvider } from "../context/ProfileContext";
import { Modal, LoadingSpinner } from "../../../shared";
import { ProfileContextProvider } from "../providers/ProfileContextProvider";

/* ProfileContextProvider wraps the profile in SectionsContext. ProfileContentContainer contains the logic and uses sections context */

export const Profile = () => {
  const { data, error, isLoading, isOwnProfile } = useProfileData();

  if (!data) return null;

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

      {!isLoading && data && <ProfileContextProvider data={data} />}
    </ProfileProvider>
  );
};
