import { SectionsProvider } from "../context/SectionsContext";
import { ProfileContentContainer } from "../containers/ProfileContentContainer";
import { FetchedUserProfile } from "../types/profileData";
import { FileDeletionProvider } from "../context/FileDeletionContext";

/* ProfileContextProvider wraps the profile in SectionsProvider
making section state accessible via context inside ProfileContentContainer */

export const ProfileContextProvider = ({ data }: FetchedUserProfile) => {
  return (
    <SectionsProvider initialSections={data.userSectionData}>
      <FileDeletionProvider>
        <ProfileContentContainer data={data} />
      </FileDeletionProvider>
    </SectionsProvider>
  );
};
