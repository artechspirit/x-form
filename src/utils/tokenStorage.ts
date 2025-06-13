import type { User } from "../features/auth/auth.slice";

export const saveAuthToStorage = (user: User) => {
  localStorage.setItem("authUser", JSON.stringify(user));
};

export const clearAuthFromStorage = () => {
  localStorage.removeItem("authUser");
};

export const getAuthFromStorage = () => {
  const user = localStorage.getItem("authUser");
  return user ? JSON.parse(user) : null;
};
