import { SectionsProvider } from "../context/SectionsContext";
import { ProfileContentContainer } from "../containers/ProfileContentContainer";

interface Props {
  data: {
    username: string;
    role: string;
    id: number;
    userProfileData: {
      bio: string;
      profile_pic?: string;
      partner: string;
      friends: number;
    };
    userSectionData: {
      id: number;
      title: string;
      description: string;
    }[];
  };
}

/* ProfileContextProvider wraps the profile in SectionsProvider
making section state accessible via context inside ProfileContentContainer */

export const ProfileContextProvider = ({ data }: Props) => {
  return (
    <SectionsProvider initialSections={data.userSectionData}>
      <ProfileContentContainer data={data} />
    </SectionsProvider>
  );
};
