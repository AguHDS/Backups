import { useContext } from "react";
import { EditProfileContext } from "./EditProfileProvider";

export const useEditProfile = () => {
  const context = useContext(EditProfileContext);
  if (!context) {
    throw new Error(
      "useEditProfile must be used within an EditProfileProvider"
    );
  }
  return context;
};
