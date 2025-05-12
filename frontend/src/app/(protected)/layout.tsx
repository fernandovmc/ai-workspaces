"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Ensure this code only runs in the browser
    if (typeof window !== "undefined") {
      const validateAuth = async () => {
        const token = localStorage.getItem("jwt");

        if (!token) {
          router.push("/login");
          return;
        }

        try {
          // Verify token validity by making a request to the auth/me endpoint
          await api.get("/auth/me");
          setIsLoading(false);
        } catch (error: any) {
          console.error("Authentication failed:", error);

          // Only clear token and redirect if it's truly an authentication error
          if (error.response && error.response.status === 401) {
            localStorage.removeItem("jwt");
            router.push("/login");
          } else {
            // For other errors like network issues, don't log the user out
            console.warn(
              "Error checking authentication, but not logging out user:",
              error
            );
            setIsLoading(false);
          }
        }
      };

      validateAuth();
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  return <>{children}</>;
}
