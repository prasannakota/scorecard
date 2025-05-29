import { useUser } from "@/lib/UserContext";
import { updateProfile as apiUpdateProfile } from "@/components/api/auth";

export const useProfile = () => {
  const { updateUser } = useUser();

  const updateProfile = async (businessId) => {
    const updatedUser = await apiUpdateProfile(businessId);
    updateUser(updatedUser);
    return updatedUser;
  };

  return { updateProfile };
};