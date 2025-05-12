"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is logged in by looking for JWT token
    const token = localStorage.getItem("jwt");
    setIsLoggedIn(!!token);
  }, [pathname]); // Re-check when pathname changes

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background shadow-sm"
      )}
    >
      <Link href={isLoggedIn ? "/#" : "/#"} className="text-2xl font-bold">
        AI <strong className="text-primary">Workspaces</strong>
      </Link>
      <div className="flex gap-4">
        {isLoggedIn ? (
          <>
            <Link href="/workspaces" passHref>
              <Button variant="secondary" asChild>
                <span>Workspaces</span>
              </Button>
            </Link>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/login" passHref>
              <Button variant="default" asChild>
                <span>Login</span>
              </Button>
            </Link>
            <Link href="/register" passHref>
              <Button variant="outline" asChild>
                <span>Register</span>
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
