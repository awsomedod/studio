"use client";

import { Newspaper, PanelLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export function AppHeader() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  let title = "NewsFlash";
  if (pathname === "/dashboard") title = "News Summaries";
  if (pathname === "/dashboard/sources") title = "Manage Sources";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
      {isMobile && <SidebarTrigger />}
      <Link href="/dashboard" className="flex items-center gap-2 mr-auto">
        <Newspaper className="h-7 w-7 text-primary" />
        <span className="font-headline text-2xl font-semibold tracking-tight">NewsFlash</span>
      </Link>
      <h1 className="font-headline text-xl font-medium text-foreground/80 hidden md:block">{title}</h1>
      {/* Placeholder for User Profile Dropdown */}
      {/* <UserNav /> */}
    </header>
  );
}
