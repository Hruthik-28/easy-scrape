"use client";

import Logo from "@/components/Logo";
import { ModeToggle } from "@/components/ThemeModeToggle";
import { Separator } from "@/components/ui/separator";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full h-screen">
      {children}
      <Separator />
      <footer className="flex justify-between items-center">
        <Logo iconSize={16} fontSize="text-xl" />
        <div className="mr-20">
          <ModeToggle />
        </div>
      </footer>
    </div>
  );
}

export default Layout;
