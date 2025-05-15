"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { BrainCircuit, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="w-full flex justify-center px-4 fixed top-0 left-0 right-0 z-50 mt-4">
      <nav
        className={cn(
          "max-w-5xl w-full flex items-center justify-between px-6 py-3 bg-secondary/50 backdrop-blur-sm shadow-sm rounded-full"
        )}
      >
        <Link href={isLoggedIn ? "/" : "/"} className="text-2xl font-bold flex items-center gap-1">
          <BrainCircuit className="h-5 w-5" />
          AI <strong className="text-primary">Workspaces</strong>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4">
          {isLoggedIn ? (
            <>
              <Link href="/workspaces" passHref>
                <Button variant="outline" asChild>
                  <span>Workspaces</span>
                </Button>
              </Link>
              <Button variant="destructive" onClick={handleLogout}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" passHref>
                <Button variant="default" asChild>
                  <span>Entrar</span>
                </Button>
              </Link>
              <Link href="/register" passHref>
                <Button variant="outline" asChild>
                  <span>Registrar-se</span>
                </Button>
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile Navigation Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Menu">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="fixed top-[72px] left-4 right-4 bg-background z-50 p-4 rounded-lg shadow-lg md:hidden">
          <div className="flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                <Link href="/workspaces" passHref onClick={toggleMenu}>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <span>Workspaces</span>
                  </Button>
                </Link>
                <Button variant="destructive" className="w-full justify-start" onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" passHref onClick={toggleMenu}>
                  <Button variant="default" className="w-full justify-start" asChild>
                    <span>Login</span>
                  </Button>
                </Link>
                <Link href="/register" passHref onClick={toggleMenu}>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <span>Register</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
