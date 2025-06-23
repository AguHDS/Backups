export interface UserProfileData {
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
