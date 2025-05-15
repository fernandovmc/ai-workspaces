"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";

export function ToggleMode() {
  const { setTheme } = useTheme();

  return (
    <div className="fixed bottom-8 right-8 z-[9999]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full shadow-lg border-2 dark:bg-muted dark:hover:bg-muted bg-white w-14 h-14"
          >
            <Sun className="h-6 w-6 rotate-0 scale-150 transition-all text-orange-500 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all text-green-500 dark:rotate-0 dark:scale-150" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="text-lg">
          <DropdownMenuItem
            onClick={() => setTheme("light")}
            className="cursor-pointer"
          >
            Claro
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("dark")}
            className="cursor-pointer"
          >
            Escuro
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("system")}
            className="cursor-pointer"
          >
            Sistema
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default ToggleMode;
