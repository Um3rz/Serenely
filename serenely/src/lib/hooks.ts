import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

//custom hook to check if user is authenticated add more here
export function useAuth() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isAuthenticated = !!session?.user;
  
  return {
    session,
    isLoading,
    isAuthenticated,
  };
}