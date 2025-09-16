import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Button } from "@/components/ui/button";
import { Bell, Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex h-full items-center justify-between px-4 lg:px-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div className="hidden md:block">
                  <h1 className="text-lg font-semibold text-foreground">
                    Higher Education Timetable Management
                  </h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
                  >
                    3
                  </Badge>
                </Button>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 bg-muted/50">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}