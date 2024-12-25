"use client";

import { Home, LucideCoins, ShieldCheck, Workflow } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Logo from "./Logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavigationItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

const navigationItems: NavigationItem[] = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Workflows",
    url: "/workflows",
    icon: Workflow,
  },
  {
    title: "Credentials",
    url: "/credentials",
    icon: ShieldCheck,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: LucideCoins,
  },
];

function NavigationLink({ item }: { item: NavigationItem }) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const isActive = pathname === item.url;

  return (
    <a
      href={item.url}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
        "hover:bg-muted/100",
        isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
      )}
      onClick={() => isMobile && setOpenMobile(false)}
    >
      <item.icon className="h-4 w-4" />
      <span className="text-base font-medium">{item.title}</span>
    </a>
  );
}

export function AppSidebar() {
  return (
    <Sidebar className="fixed inset-y-0 z-50 flex h-full flex-col border-r bg-background data-[expanded]:z-50">
      <SidebarHeader className="h-20 flex items-center justify-center border-b bg-background">
        <Logo />
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarGroupContent className="bg-background">
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavigationLink item={item} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
