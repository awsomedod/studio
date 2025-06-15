import Link from 'next/link';
import {
  LayoutDashboard,
  ListFilter,
  Newspaper,
  Settings,
  LogOut,
} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AppHeader } from '@/components/layout/AppHeader';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" side="left" variant="sidebar">
        <SidebarHeader className="p-4 justify-center">
          {/* Logo or App Name - already in AppHeader, can be minimal here */}
          <Link href="/dashboard" className="flex items-center gap-2">
             <Newspaper className="h-8 w-8 text-sidebar-primary group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7" />
            <span className="font-headline text-2xl font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              NewsFlash
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={{ children: "Summaries", side: "right", align: "center" }}
              >
                <Link href="/dashboard">
                  <LayoutDashboard />
                  <span>Summaries</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={{ children: "Sources", side: "right", align: "center" }}
              >
                <Link href="/dashboard/sources">
                  <ListFilter />
                  <span>Sources</span>
                  {/* <SidebarMenuBadge>3</SidebarMenuBadge> Example badge */}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
               <SidebarMenuButton 
                asChild 
                tooltip={{ children: "Settings", side: "right", align: "center" }}
              >
                <Link href="#"> {/* Placeholder for settings */}
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <Separator className="my-1 bg-sidebar-border" />
            <SidebarMenuItem>
               <SidebarMenuButton 
                asChild 
                tooltip={{ children: "Log Out", side: "right", align: "center" }}
              >
                 <Link href="/"> {/* Log out navigates to login page */}
                  <LogOut />
                  <span>Log Out</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
