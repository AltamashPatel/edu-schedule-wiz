import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, User, ArrowLeft, Edit } from "lucide-react";
import { useTimetables } from "@/hooks/useTimetables";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/hooks/useAuth";

interface TimetableViewProps {
  timetableId: string;
  onBack: () => void;
  onEdit?: () => void;
}

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", 
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
];

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function TimetableView({ timetableId, onBack, onEdit }: TimetableViewProps) {
  const { fetchTimetableSlots } = useTimetables();
  const { userProfile, isAdmin } = useAuth();
  const { data: slots, isLoading, error } = fetchTimetableSlots(timetableId);

  const getSlotStyle = (type: string) => {
    switch (type) {
      case 'lecture':
        return 'timetable-slot occupied';
      case 'lab':
        return 'timetable-slot bg-accent/10 border-accent/30 text-accent';
      case 'tutorial':
        return 'timetable-slot bg-secondary/10 border-secondary/30 text-secondary-foreground';
      case 'break':
        return 'timetable-slot break';
      default:
        return 'timetable-slot';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture':
        return 'bg-primary/20 text-primary';
      case 'lab':
        return 'bg-accent/20 text-accent';
      case 'tutorial':
        return 'bg-secondary/20 text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getSlotForTimeAndDay = (dayIndex: number, timeSlot: string) => {
    if (!slots) return null;
    
    return slots.find((slot: any) => {
      const slotDay = slot.day_of_week === 0 ? 6 : slot.day_of_week - 1; // Convert Sunday=0 to Saturday=6
      const slotTime = new Date(`1970-01-01T${slot.start_time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      return slotDay === dayIndex && slotTime === timeSlot;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="academic-card">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-destructive mb-4">Failed to load timetable</p>
          <Button onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="academic-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <CardTitle className="text-xl">Timetable View</CardTitle>
        </div>
        {onEdit && (userProfile?.role === 'admin' || userProfile?.role === 'faculty') && (
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Schedule
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-[100px,repeat(6,1fr)] gap-1 min-w-[800px]">
            {/* Header row */}
            <div className="p-3 font-semibold text-center bg-muted rounded">
              Time
            </div>
            {weekDays.map(day => (
              <div key={day} className="p-3 font-semibold text-center bg-muted rounded">
                {day}
              </div>
            ))}

            {/* Time slots */}
            {timeSlots.map((time, timeIndex) => (
              <div key={time} className="contents">
                <div className="p-3 text-sm font-medium text-center bg-muted/50 rounded flex items-center justify-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {time}
                </div>
                {weekDays.map((_, dayIndex) => {
                  const slot = getSlotForTimeAndDay(dayIndex, time);
                  
                  return (
                    <div key={`${dayIndex}-${timeIndex}`} className={getSlotStyle(slot?.type || 'free')}>
                      {slot ? (
                        <div className="space-y-1">
                          <div className="font-medium text-sm truncate">
                            {slot.subject?.name || 'Unknown Subject'}
                          </div>
                          {slot.faculty?.users?.full_name && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <User className="h-3 w-3 mr-1" />
                              <span className="truncate">{slot.faculty.users.full_name}</span>
                            </div>
                          )}
                          {slot.classroom?.name && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="truncate">
                                {slot.classroom.name}
                                {slot.classroom.building && ` - ${slot.classroom.building}`}
                              </span>
                            </div>
                          )}
                          {slot.type && (
                            <Badge variant="secondary" className={`text-xs ${getTypeColor(slot.type)}`}>
                              {slot.type.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <div className="text-center text-sm text-muted-foreground">
                          Free
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}