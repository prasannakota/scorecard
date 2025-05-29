import axios from 'axios';

const getAuthToken = () => sessionStorage.getItem("authorization");

export const updateProfile = async (businessId) => {
  const token = getAuthToken();
  try {
    const response = await axios.post(
      `/api/user/update`,
      { business_category: businessId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const updatedUser = response.data.data;
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
