import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Calendar, Plus, Search, Filter, Download, Eye, Edit, Trash, Clock, Users } from "lucide-react";
import { TimetableList } from "@/components/timetable/timetable-list";
import { TimetableForm } from "@/components/timetable/timetable-form";
import { TimetableView } from "@/components/timetable/timetable-view";
import { useTimetables } from "@/hooks/useTimetables";
import { LoadingSpinner } from "@/components/ui/loading-spinner";


const Timetables = () => {
  const navigate = useNavigate();
  const { timetables, isLoading } = useTimetables();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTimetableId, setEditingTimetableId] = useState<string | null>(null);
  const [viewingTimetableId, setViewingTimetableId] = useState<string | null>(null);

  // Listen for edit and view events from TimetableList
  useState(() => {
    const handleEdit = (event: any) => {
      setEditingTimetableId(event.detail);
      setShowCreateForm(true);
    };

    const handleView = (event: any) => {
      setViewingTimetableId(event.detail);
    };

    window.addEventListener('editTimetable', handleEdit);
    window.addEventListener('viewTimetable', handleView);
    
    return () => {
      window.removeEventListener('editTimetable', handleEdit);
      window.removeEventListener('viewTimetable', handleView);
    };
  });

  const filteredTimetables = timetables?.filter(timetable => {
    const matchesSearch = timetable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         timetable.batch?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || timetable.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || timetable.batch?.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  }) || [];

  const departments = [...new Set(timetables?.map(t => t.batch?.department).filter(Boolean) || [])];

  // Show timetable view if viewing a specific timetable
  if (viewingTimetableId) {
    return (
      <AppLayout>
        <div className="p-6">
          <TimetableView 
            timetableId={viewingTimetableId}
            onBack={() => setViewingTimetableId(null)}
            onEdit={() => {
              setEditingTimetableId(viewingTimetableId);
              setViewingTimetableId(null);
              setShowCreateForm(true);
            }}
          />
        </div>
      </AppLayout>
    );
  }

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
          <Button 
            className="mt-4 md:mt-0 academic-gradient"
            onClick={() => setShowCreateForm(true)}
          >
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

        {/* Timetables Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <TimetableList />
        )}


        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="academic-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">
                {timetables?.filter(t => t.status === 'published').length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Published</p>
            </CardContent>
          </Card>
          <Card className="academic-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-success">
                {timetables?.filter(t => t.status === 'approved').length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
          <Card className="academic-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-warning">
                {timetables?.filter(t => t.status === 'under_review').length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Under Review</p>
            </CardContent>
          </Card>
          <Card className="academic-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-muted-foreground">
                {timetables?.filter(t => t.status === 'draft').length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Drafts</p>
            </CardContent>
          </Card>
        </div>

        {/* Create/Edit Form Dialog */}
        <Dialog open={showCreateForm || !!editingTimetableId} onOpenChange={(open) => {
          if (!open) {
            setShowCreateForm(false);
            setEditingTimetableId(null);
          }
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <TimetableForm 
              timetableId={editingTimetableId || undefined}
              onClose={() => {
                setShowCreateForm(false);
                setEditingTimetableId(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Timetables;