import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, Search, Filter, Download, Eye, Edit, Trash, Clock, Users } from "lucide-react";

interface Timetable {
  id: string;
  name: string;
  department: string;
  semester: string;
  batch: string;
  status: 'draft' | 'pending' | 'approved' | 'published';
  createdAt: string;
  createdBy: string;
  lastModified: string;
  classCount: number;
  facultyCount: number;
}

const mockTimetables: Timetable[] = [
  {
    id: "1",
    name: "Computer Science - Semester 6",
    department: "Computer Science",
    semester: "Spring 2024",
    batch: "CS-3A",
    status: "published",
    createdAt: "2024-01-15",
    createdBy: "Dr. John Smith",
    lastModified: "2024-01-20",
    classCount: 28,
    facultyCount: 8
  },
  {
    id: "2", 
    name: "Mathematics - Semester 4",
    department: "Mathematics",
    semester: "Spring 2024",
    batch: "MATH-2B",
    status: "approved",
    createdAt: "2024-01-10",
    createdBy: "Prof. Sarah Wilson",
    lastModified: "2024-01-18",
    classCount: 24,
    facultyCount: 6
  },
  {
    id: "3",
    name: "Physics - Semester 2", 
    department: "Physics",
    semester: "Spring 2024",
    batch: "PHY-1A",
    status: "pending",
    createdAt: "2024-01-12",
    createdBy: "Dr. Michael Brown",
    lastModified: "2024-01-16",
    classCount: 30,
    facultyCount: 7
  },
  {
    id: "4",
    name: "Chemistry - Semester 6",
    department: "Chemistry", 
    semester: "Spring 2024",
    batch: "CHEM-3C",
    status: "draft",
    createdAt: "2024-01-14",
    createdBy: "Dr. Emily Davis",
    lastModified: "2024-01-19",
    classCount: 26,
    facultyCount: 5
  }
];

const Timetables = () => {
  const [timetables, setTimetables] = useState<Timetable[]>(mockTimetables);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="status-approved">Published</Badge>;
      case 'approved':
        return <Badge className="status-approved">Approved</Badge>;
      case 'pending':
        return <Badge className="status-pending">Pending Review</Badge>;
      case 'draft':
        return <Badge className="status-draft">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredTimetables = timetables.filter(timetable => {
    const matchesSearch = timetable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         timetable.batch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || timetable.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || timetable.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const departments = [...new Set(timetables.map(t => t.department))];

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Timetable Management</h1>
            <p className="text-muted-foreground">
              Create, review, and manage academic schedules
            </p>
          </div>
          <Button className="mt-4 md:mt-0 academic-gradient">
            <Plus className="h-4 w-4 mr-2" />
            Create New Timetable
          </Button>
        </div>

        {/* Filters */}
        <Card className="academic-card">
          <CardHeader>
            <CardTitle className="text-lg">Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search timetables..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Timetables Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTimetables.map((timetable) => (
            <Card key={timetable.id} className="academic-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{timetable.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {timetable.department} • {timetable.semester}
                    </CardDescription>
                  </div>
                  {getStatusBadge(timetable.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Batch:</span>
                    <span className="font-medium">{timetable.batch}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Classes:
                    </span>
                    <span className="font-medium">{timetable.classCount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      Faculty:
                    </span>
                    <span className="font-medium">{timetable.facultyCount}</span>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Created by {timetable.createdBy} on {new Date(timetable.createdAt).toLocaleDateString()}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Last modified: {new Date(timetable.lastModified).toLocaleDateString()}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {filteredTimetables.length === 0 && (
          <Card className="academic-card">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No timetables found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm || statusFilter !== "all" || departmentFilter !== "all" 
                  ? "Try adjusting your search criteria or filters"
                  : "Get started by creating your first timetable"}
              </p>
              <Button className="academic-gradient">
                <Plus className="h-4 w-4 mr-2" />
                Create Timetable
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="academic-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">
                {timetables.filter(t => t.status === 'published').length}
              </div>
              <p className="text-sm text-muted-foreground">Published</p>
            </CardContent>
          </Card>
          <Card className="academic-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-success">
                {timetables.filter(t => t.status === 'approved').length}
              </div>
              <p className="text-sm text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
          <Card className="academic-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-warning">
                {timetables.filter(t => t.status === 'pending').length}
              </div>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </CardContent>
          </Card>
          <Card className="academic-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-muted-foreground">
                {timetables.filter(t => t.status === 'draft').length}
              </div>
              <p className="text-sm text-muted-foreground">Drafts</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Timetables;