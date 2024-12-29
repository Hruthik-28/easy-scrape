"use client";

import Logo from "@/components/Logo";
import { ModeToggle } from "@/components/ThemeModeToggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Save, Upload } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  const { workflowId } = useParams();
  const pathname = usePathname();
  const isEditorPage = pathname.includes("editor");

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
