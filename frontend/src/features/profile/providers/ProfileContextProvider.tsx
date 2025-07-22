import { SectionsProvider } from "../context/SectionsContext";
import { ProfileContentContainer } from "../containers/ProfileContentContainer";
import { FetchedUserProfile } from "../types/profileData";
import { FileDeletionProvider } from "../context/FileDeletionContext";
import { StorageRefreshProvider } from "../context/StorageRefreshContext";

/* ProfileContextProvider wraps the profile in SectionsProvider
making section state accessible via context inside ProfileContentContainer */

export const ProfileContextProvider = ({ data }: FetchedUserProfile) => {
  const safeSections = data.userSectionData ?? [];

  return (
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
  );
};
