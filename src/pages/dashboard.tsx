import { AppLayout } from "@/components/layout/app-layout";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { TimetableGrid } from "@/components/timetable/timetable-grid";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Clock, AlertCircle } from "lucide-react";

// Mock user data - replace with actual auth context
const currentUser = {
  name: "Dr. John Smith",
  role: "Admin", // Admin, Faculty, Student
  email: "john.smith@university.edu"
};

const Dashboard = () => {
  const renderRecentActivities = () => {
    const activities = [
      {
        id: 1,
        title: "Timetable CS-3A Updated",
        description: "Database Systems moved to Lab-2",
        time: "2 hours ago",
        type: "update"
      },
      {
        id: 2,
        title: "New Faculty Added",
        description: "Dr. Emily Carter joined Mathematics dept",
        time: "5 hours ago",
        type: "user"
      },
      {
        id: 3,
        title: "Room Maintenance Scheduled",
        description: "CS-Lab-1 unavailable next week",
        time: "1 day ago",
        type: "maintenance"
      }
    ];

    return (
      <Card className="academic-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Recent Activities
          </CardTitle>
          <CardDescription>Latest updates and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-accent mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderQuickActions = () => {
    const adminActions = [
      {
        title: "Generate Timetable",
        description: "Create new semester schedule",
        icon: Calendar,
        action: "/timetables/create"
      },
      {
        title: "Add Faculty",
        description: "Register new faculty member",
        icon: Plus,
        action: "/faculty/add"
      }
    ];

    const facultyActions = [
      {
        title: "Update Availability",
        description: "Set your teaching preferences",
        icon: Calendar,
        action: "/availability"
      }
    ];

    const actions = currentUser.role.toLowerCase() === 'admin' ? adminActions : facultyActions;

    return (
      <Card className="academic-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start h-auto p-4"
                onClick={() => console.log(`Navigate to ${action.action}`)}
              >
                <action.icon className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderUpcomingEvents = () => {
    const events = [
      {
        title: "Semester Planning Meeting",
        date: "Tomorrow, 2:00 PM",
        location: "Conference Room A",
        priority: "high"
      },
      {
        title: "Faculty Orientation",
        date: "Next Monday, 10:00 AM", 
        location: "Main Auditorium",
        priority: "medium"
      },
      {
        title: "System Maintenance",
        date: "Next Friday, 11:00 PM",
        location: "Online",
        priority: "low"
      }
    ];

    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'high': return 'bg-destructive/20 text-destructive';
        case 'medium': return 'bg-warning/20 text-warning';
        case 'low': return 'bg-success/20 text-success';
        default: return 'bg-muted text-muted-foreground';
      }
    };

    return (
      <Card className="academic-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Upcoming Events
          </CardTitle>
          <CardDescription>Important dates and deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event, index) => (
              <div key={index} className="flex items-start justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <p className="font-medium text-sm">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.date}</p>
                  <p className="text-xs text-muted-foreground">{event.location}</p>
                </div>
                <Badge className={getPriorityColor(event.priority)}>
                  {event.priority}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {currentUser.name}</h1>
            <p className="text-muted-foreground">
              {currentUser.role} Dashboard - Here's what's happening today
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Badge variant="outline" className="text-sm">
              {currentUser.role}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards userRole={currentUser.role} />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Timetable Preview - spans 2 columns */}
          <div className="lg:col-span-2">
            <TimetableGrid 
              title="Current Week Schedule" 
              editable={currentUser.role.toLowerCase() !== 'student'}
            />
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {renderQuickActions()}
            {renderUpcomingEvents()}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="grid gap-6 lg:grid-cols-2">
          {renderRecentActivities()}
          
          {/* Additional metrics or charts can go here */}
          <Card className="academic-card">
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Platform performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database Status</span>
                  <Badge className="bg-success/20 text-success">Healthy</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Response Time</span>
                  <span className="text-sm text-muted-foreground">~150ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Users</span>
                  <span className="text-sm text-muted-foreground">47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Last Backup</span>
                  <span className="text-sm text-muted-foreground">2 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;