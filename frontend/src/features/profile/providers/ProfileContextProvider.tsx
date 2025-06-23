import { SectionsProvider } from "../context/SectionsContext";
import { ProfileContentContainer } from "../containers/ProfileContentContainer";
import { UserProfileData } from "../types/userProfileData";

/* ProfileContextProvider wraps the profile in SectionsProvider
making section state accessible via context inside ProfileContentContainer */

export const ProfileContextProvider = ({ data }: UserProfileData) => {
  return (
    <SectionsProvider initialSections={data.userSectionData}>
      <ProfileContentContainer data={data} />
    </SectionsProvider>
  );
};
