import { useState } from "react";
import { 
  Calendar, 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Settings, 
  Building, 
  Clock,
  FileText,
  UserCheck,
  ChevronDown,
  LogOut
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Mock user data - replace with actual auth context
const currentUser = {
  name: "Dr. John Smith",
  role: "Admin",
  email: "john.smith@university.edu",
  avatar: ""
};

const adminItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Timetable Generation", url: "/timetables", icon: Calendar },
  { title: "Faculty Management", url: "/faculty", icon: Users },
  { title: "Classroom Management", url: "/classrooms", icon: Building },
  { title: "Subject Management", url: "/subjects", icon: BookOpen },
  { title: "Batch Management", url: "/batches", icon: UserCheck },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
];

const facultyItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "My Schedule", url: "/my-schedule", icon: Clock },
  { title: "Availability", url: "/availability", icon: Calendar },
  { title: "Settings", url: "/settings", icon: Settings },
];

const studentItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Class Schedule", url: "/schedule", icon: Calendar },
  { title: "Subjects", url: "/subjects", icon: BookOpen },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const [isScheduleOpen, setIsScheduleOpen] = useState(true);

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-primary font-medium" : "hover:bg-sidebar-accent/50";

  // Determine menu items based on user role
  const getMenuItems = () => {
    switch (currentUser.role.toLowerCase()) {
      case 'admin':
        return adminItems;
      case 'faculty':
        return facultyItems;
      case 'student':
        return studentItems;
      default:
        return studentItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-sidebar-foreground">EduSchedule</h2>
              <p className="text-xs text-sidebar-foreground/60">Wiz</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground mx-auto">
            <Calendar className="h-4 w-4" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {currentUser.role.toLowerCase() === 'admin' && !collapsed && (
          <SidebarGroup>
            <Collapsible open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="cursor-pointer hover:text-sidebar-primary flex items-center justify-between">
                  Schedule Management
                  <ChevronDown className={`h-3 w-3 transition-transform ${isScheduleOpen ? 'rotate-180' : ''}`} />
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <NavLink to="/timetables/create" className={getNavCls}>
                          <Calendar className="h-4 w-4" />
                          <span>Create Timetable</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <NavLink to="/timetables/review" className={getNavCls}>
                          <FileText className="h-4 w-4" />
                          <span>Review & Approve</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {!collapsed && (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {currentUser.name}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {currentUser.role}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        )}
        {collapsed && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-8 h-8 p-0 mx-auto"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}