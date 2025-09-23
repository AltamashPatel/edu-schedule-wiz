import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { X } from "lucide-react";
import { useTimetables } from "@/hooks/useTimetables";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const timetableSchema = z.object({
  name: z.string().min(1, "Name is required"),
  batch_id: z.string().min(1, "Batch is required"),
  academic_year: z.string().min(1, "Academic year is required"),
  semester: z.number().min(1).max(8),
  status: z.enum(['draft', 'under_review', 'approved', 'published']).default('draft'),
});

type TimetableFormData = z.infer<typeof timetableSchema>;

interface TimetableFormProps {
  timetableId?: string;
  onClose: () => void;
}

interface Batch {
  id: string;
  name: string;
  department: string;
  year: number;
  semester: number;
}

export function TimetableForm({ timetableId, onClose }: TimetableFormProps) {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(!!timetableId);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createTimetable, generateTimetableSlots } = useTimetables();
  const { userProfile } = useAuth();

  const form = useForm<TimetableFormData>({
    resolver: zodResolver(timetableSchema),
    defaultValues: {
      name: "",
      batch_id: "",
      academic_year: new Date().getFullYear().toString(),
      semester: 1,
      status: 'draft',
    },
  });

  // Fetch batches
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const { data, error } = await supabase
          .from('batches')
          .select('id, name, department, year, semester')
          .order('department', { ascending: true })
          .order('year', { ascending: true })
          .order('name', { ascending: true });

        if (error) throw error;
        setBatches(data || []);
      } catch (error) {
        console.error('Error fetching batches:', error);
        toast({
          title: "Error",
          description: "Failed to load batches",
          variant: "destructive"
        });
      }
    };

    fetchBatches();
  }, [toast]);

  // Fetch timetable data for editing
  useEffect(() => {
    if (timetableId) {
      const fetchTimetable = async () => {
        try {
          const { data, error } = await supabase
            .from('timetables')
            .select('*')
            .eq('id', timetableId)
            .single();

          if (error) throw error;

          if (data) {
            form.reset({
              name: data.name,
              batch_id: data.batch_id,
              academic_year: data.academic_year,
              semester: data.semester,
              status: data.status,
            });
          }
        } catch (error) {
          console.error('Error fetching timetable:', error);
          toast({
            title: "Error",
            description: "Failed to load timetable data",
            variant: "destructive"
          });
        } finally {
          setFetchingData(false);
        }
      };

      fetchTimetable();
    }
  }, [timetableId, form, toast]);

  const onSubmit = async (data: TimetableFormData) => {
    if (!userProfile) {
      toast({
        title: "Error",
        description: "You must be logged in to create a timetable",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      if (timetableId) {
        // Update existing timetable
        const { error } = await supabase
          .from('timetables')
          .update({
            name: data.name,
            batch_id: data.batch_id,
            academic_year: data.academic_year,
            semester: data.semester,
            status: data.status,
            updated_at: new Date().toISOString(),
          })
          .eq('id', timetableId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Timetable updated successfully",
        });
      } else {
        // Create new timetable
        const result = await createTimetable.mutateAsync({
          name: data.name,
          batch_id: data.batch_id,
          academic_year: data.academic_year,
          semester: data.semester,
          status: data.status,
          created_by: userProfile.id,
        });

        // Get batch details to determine department
        const { data: batchData } = await supabase
          .from('batches')
          .select('department')
          .eq('id', data.batch_id)
          .single();

        if (batchData) {
          // Generate automatic time slots
          try {
            const slotsCreated = await generateTimetableSlots(result.id, data.batch_id, batchData.department);
            toast({
              title: "Success", 
              description: `Timetable created successfully with ${slotsCreated} scheduled slots`,
            });
          } catch (slotError: any) {
            console.error('Error generating slots:', slotError);
            toast({
              title: "Partial Success",
              description: `Timetable created but auto scheduling failed: ${slotError.message}. You can add slots manually.`,
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "Success",
            description: "Timetable created successfully. Please add slots manually.",
          });
        }
      }

      onClose();
      navigate('/timetables');
    } catch (error: any) {
      console.error('Error saving timetable:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save timetable",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-2xl">
            {timetableId ? 'Edit Timetable' : 'Create New Timetable'}
          </CardTitle>
          <CardDescription>
            {timetableId ? 'Update timetable details' : 'Fill in the details to create a new timetable'}
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timetable Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Computer Science - Semester 5" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="batch_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a batch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {batches.map((batch) => (
                        <SelectItem key={batch.id} value={batch.id}>
                          {batch.name} - {batch.department} (Year {batch.year})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="academic_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Year</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., 2024" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="semester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semester</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                          <SelectItem key={sem} value={sem.toString()}>
                            Semester {sem}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 academic-gradient"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    {timetableId ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  timetableId ? 'Update Timetable' : 'Create Timetable'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}