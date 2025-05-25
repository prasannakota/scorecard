export function getUserFromSession() {
  const user = sessionStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}