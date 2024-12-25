import { AppSidebar } from "@/components/app-sidebar";
import BreadCrumbHeader from "@/components/BreadCrumbHeader";
import { ModeToggle } from "@/components/ThemeModeToggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SignedIn, UserButton } from "@clerk/nextjs";
import React from "react";

function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 justify-between items-center gap-2 border-b px-4">
          <div className="flex justify-center items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <BreadCrumbHeader />
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default layout;
