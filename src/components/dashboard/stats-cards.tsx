import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Building, BookOpen, Clock, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  userRole: string;
}

export function StatsCards({ userRole }: StatsCardsProps) {
  const adminStats = [
    {
      title: "Active Timetables",
      value: "8",
      description: "Currently published",
      icon: Calendar,
      trend: "+2 from last month"
    },
    {
      title: "Faculty Members",
      value: "124",
      description: "Registered users",
      icon: Users,
      trend: "+5 new this month"
    },
    {
      title: "Classrooms",
      value: "45",
      description: "Available rooms",
      icon: Building,
      trend: "2 under maintenance"
    },
    {
      title: "Subjects",
      value: "256",
      description: "Total courses",
      icon: BookOpen,
      trend: "+12 new subjects"
    },
    {
      title: "Utilization Rate",
      value: "85%",
      description: "Classroom usage",
      icon: TrendingUp,
      trend: "+5% from last term"
    },
    {
      title: "Pending Reviews",
      value: "3",
      description: "Awaiting approval",
      icon: AlertCircle,
      trend: "2 urgent reviews"
    }
  ];

  const facultyStats = [
    {
      title: "Classes This Week",
      value: "18",
      description: "Scheduled sessions",
      icon: Calendar,
      trend: "Same as last week"
    },
    {
      title: "Teaching Hours",
      value: "24",
      description: "Weekly commitment",
      icon: Clock,
      trend: "Optimal workload"
    },
    {
      title: "Subjects Teaching",
      value: "4",
      description: "Current semester",
      icon: BookOpen,
      trend: "2 core, 2 electives"
    },
    {
      title: "Room Assignments",
      value: "6",
      description: "Different classrooms",
      icon: Building,
      trend: "Well distributed"
    }
  ];

  const studentStats = [
    {
      title: "Classes This Week",
      value: "22",
      description: "Scheduled lectures",
      icon: Calendar,
      trend: "2 labs, 20 theory"
    },
    {
      title: "Subjects Enrolled",
      value: "8",
      description: "Current semester",
      icon: BookOpen,
      trend: "6 core, 2 electives"
    },
    {
      title: "Attendance Rate",
      value: "92%",
      description: "This semester",
      icon: CheckCircle,
      trend: "+3% from last month"
    },
    {
      title: "Study Hours",
      value: "30",
      description: "Weekly schedule",
      icon: Clock,
      trend: "Balanced workload"
    }
  ];

  const getStats = () => {
    switch (userRole.toLowerCase()) {
      case 'admin':
        return adminStats;
      case 'faculty':
        return facultyStats;
      case 'student':
        return studentStats;
      default:
        return studentStats;
    }
  };

  const stats = getStats();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="academic-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
            <p className="text-xs text-accent mt-1">{stat.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}