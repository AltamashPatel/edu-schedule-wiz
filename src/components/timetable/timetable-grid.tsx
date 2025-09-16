import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, User, Edit } from "lucide-react";

interface TimetableSlot {
  id: string;
  subject: string;
  faculty: string;
  room: string;
  time: string;
  duration: number;
  type: 'lecture' | 'lab' | 'tutorial' | 'break';
  batch: string;
}

interface TimetableGridProps {
  title: string;
  data?: TimetableSlot[][];
  editable?: boolean;
}

const timeSlots = [
  "9:00 AM",
  "10:00 AM", 
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM"
];

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Mock timetable data
const mockTimetableData: TimetableSlot[][] = [
  // Monday
  [
    {
      id: "1",
      subject: "Data Structures",
      faculty: "Dr. Smith",
      room: "CS-101",
      time: "9:00 AM",
      duration: 1,
      type: "lecture",
      batch: "CS-3A"
    },
    {
      id: "2", 
      subject: "Database Systems",
      faculty: "Prof. Johnson",
      room: "CS-102",
      time: "10:00 AM",
      duration: 1,
      type: "lecture",
      batch: "CS-3A"
    },
    {
      id: "3",
      subject: "Break",
      faculty: "",
      room: "",
      time: "11:00 AM",
      duration: 1,
      type: "break",
      batch: ""
    },
    {
      id: "4",
      subject: "Software Engineering",
      faculty: "Dr. Brown",
      room: "CS-103",
      time: "12:00 PM",
      duration: 1,
      type: "lecture",
      batch: "CS-3A"
    },
    {
      id: "5",
      subject: "Lunch Break",
      faculty: "",
      room: "",
      time: "1:00 PM",
      duration: 1,
      type: "break",
      batch: ""
    },
    {
      id: "6",
      subject: "Algorithm Lab",
      faculty: "Dr. Smith",
      room: "Lab-1",
      time: "2:00 PM",
      duration: 2,
      type: "lab",
      batch: "CS-3A"
    },
    {
      id: "7",
      subject: "",
      faculty: "",
      room: "",
      time: "3:00 PM",
      duration: 1,
      type: "lecture",
      batch: ""
    },
    {
      id: "8",
      subject: "Tutorial",
      faculty: "TA - Mike",
      room: "CS-101",
      time: "4:00 PM",
      duration: 1,
      type: "tutorial",
      batch: "CS-3A"
    }
  ],
  // Add similar data for other days - simplified for demo
  ...Array(5).fill([]).map((_, dayIndex) => 
    timeSlots.map((time, slotIndex) => ({
      id: `${dayIndex}-${slotIndex}`,
      subject: slotIndex % 3 === 0 ? "Break" : ["Mathematics", "Physics", "Chemistry", "Biology"][slotIndex % 4],
      faculty: slotIndex % 3 === 0 ? "" : ["Dr. Wilson", "Prof. Davis", "Dr. Taylor"][slotIndex % 3],
      room: slotIndex % 3 === 0 ? "" : [`Room-${101 + slotIndex}`, `Lab-${slotIndex}`, `Hall-${slotIndex}`][slotIndex % 3],
      time,
      duration: 1,
      type: slotIndex % 3 === 0 ? "break" : (slotIndex % 4 === 0 ? "lab" : "lecture") as any,
      batch: slotIndex % 3 === 0 ? "" : "CS-3A"
    }))
  )
];

export function TimetableGrid({ title, data = mockTimetableData, editable = false }: TimetableGridProps) {
  const getSlotStyle = (slot: TimetableSlot) => {
    switch (slot.type) {
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

  return (
    <Card className="academic-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">{title}</CardTitle>
        {editable && (
          <Button variant="outline" size="sm">
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
                  const slot = data[dayIndex]?.[timeIndex];
                  if (!slot) return <div key={dayIndex} className="timetable-slot" />;
                  
                  return (
                    <div key={`${dayIndex}-${timeIndex}`} className={getSlotStyle(slot)}>
                      {slot.type !== 'break' && slot.subject ? (
                        <div className="space-y-1">
                          <div className="font-medium text-sm truncate">{slot.subject}</div>
                          {slot.faculty && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <User className="h-3 w-3 mr-1" />
                              <span className="truncate">{slot.faculty}</span>
                            </div>
                          )}
                          {slot.room && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="truncate">{slot.room}</span>
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
                          {slot.subject || "Free"}
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