// frontend\src\features\profile\pages\Profile.tsx
import { useProfileData } from "../hooks/useProfileData";
import { EditProfileProvider } from "../context/editProfile/EditProfileProvider";
import { Modal, LoadingSpinner } from "@/shared";
import { SectionsProvider } from "../context/Section/SectionsProvider";
import { FileDeletionProvider } from "../context/FileDeletion/FileDeletionProvider";
import { ProfileContentContainer } from "../containers/ProfileContentContainer";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/redux/store";

export const Profile = () => {
  const { data, error, isLoading, isOwnProfile } = useProfileData();
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === "admin";

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
            {error?.message || "Error loading profile"}
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

  // Admin and Owner can see all sections, even private sections
  const initialSections = isOwnProfile || isAdmin 
    ? safeSections  // Owner o admin ve todas las secciones
    : safeSections.filter((section) => section.isPublic);

  return (
    <EditProfileProvider isOwnProfile={isOwnProfile}>
      <SectionsProvider initialSections={initialSections}>
        <FileDeletionProvider>
          <ProfileContentContainer data={data} />
        </FileDeletionProvider>
      </SectionsProvider>
    </EditProfileProvider>
  );
};