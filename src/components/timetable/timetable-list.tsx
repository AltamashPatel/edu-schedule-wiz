import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Calendar, 
  Users, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download
} from "lucide-react";
import { useTimetables } from "@/hooks/useTimetables";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formatDistanceToNow } from "date-fns";

export function TimetableList() {
  const { timetables, isLoading, updateTimetableStatus, deleteTimetable } = useTimetables();
  const { userProfile, isAdmin } = useAuth();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="status-approved">Published</Badge>;
      case 'approved':
        return <Badge className="status-approved">Approved</Badge>;
      case 'under_review':
        return <Badge className="status-pending">Under Review</Badge>;
      case 'draft':
        return <Badge className="status-draft">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    await updateTimetableStatus.mutateAsync({ 
      id, 
      status: status as any, 
      approvedBy: isAdmin ? userProfile?.id : undefined 
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this timetable?')) {
      await deleteTimetable.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!timetables || timetables.length === 0) {
    return (
      <Card className="academic-card">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="text-xl mb-2">No Timetables Found</CardTitle>
          <CardDescription className="text-center mb-6">
            Get started by creating your first timetable.
          </CardDescription>
          <Button className="academic-gradient">
            Create New Timetable
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {timetables.map((timetable: any) => (
        <Card key={timetable.id} className="academic-card">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
            <div className="space-y-1">
              <CardTitle className="text-lg">{timetable.name}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{timetable.batch?.name} - {timetable.batch?.department}</span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                {(timetable.created_by === userProfile?.id || isAdmin) && (
                  <>
                     <DropdownMenuItem onClick={() => window.dispatchEvent(new CustomEvent('editTimetable', { detail: timetable.id }))}>
                       <Edit className="h-4 w-4 mr-2" />
                       Edit
                     </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </DropdownMenuItem>
                  </>
                )}
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    {timetable.status === 'under_review' && (
                      <>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(timetable.id, 'approved')}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(timetable.id, 'draft')}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </DropdownMenuItem>
                      </>
                    )}
                    {timetable.status === 'approved' && (
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(timetable.id, 'published')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Publish
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleDelete(timetable.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              {getStatusBadge(timetable.status)}
              <div className="text-sm text-muted-foreground">
                {timetable.academic_year} • Sem {timetable.semester}
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span>{formatDistanceToNow(new Date(timetable.created_at), { addSuffix: true })}</span>
              </div>
              
              {timetable.creator && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">By:</span>
                  <span>{timetable.creator.full_name}</span>
                </div>
              )}
              
              {timetable.published_at && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-muted-foreground">Published:</span>
                  <span>{formatDistanceToNow(new Date(timetable.published_at), { addSuffix: true })}</span>
                </div>
              )}
            </div>

            <Button variant="outline" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              View Timetable
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}