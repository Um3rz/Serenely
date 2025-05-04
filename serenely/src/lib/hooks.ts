import { useSession,signOut } from "next-auth/react";

//custom hook to check if user is authenticated -add more here
export function useAuth() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user?.role === "ADMIN";
  const logout = () => {
    signOut(); 
  };
  return {
    session,
    isLoading,
    isAuthenticated,
    isAdmin,
    logout
  };
}