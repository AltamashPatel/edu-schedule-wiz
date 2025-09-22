import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, User } from "lucide-react";

const facultySchema = z.object({
  user_id: z.string().min(1, "User is required"),
  employee_id: z.string().min(1, "Employee ID is required"),
  department: z.string().min(1, "Department is required"),
  specialization: z.array(z.string()).min(1, "At least one specialization is required"),
  max_hours_per_week: z.number().min(1, "Max hours must be positive"),
  availability: z.object({
    monday: z.object({
      morning: z.boolean(),
      afternoon: z.boolean(),
      evening: z.boolean(),
    }),
    tuesday: z.object({
      morning: z.boolean(),
      afternoon: z.boolean(),
      evening: z.boolean(),
    }),
    wednesday: z.object({
      morning: z.boolean(),
      afternoon: z.boolean(),
      evening: z.boolean(),
    }),
    thursday: z.object({
      morning: z.boolean(),
      afternoon: z.boolean(),
      evening: z.boolean(),
    }),
    friday: z.object({
      morning: z.boolean(),
      afternoon: z.boolean(),
      evening: z.boolean(),
    }),
    saturday: z.object({
      morning: z.boolean(),
      afternoon: z.boolean(),
      evening: z.boolean(),
    }),
  }),
});

type FacultyForm = z.infer<typeof facultySchema>;

const defaultAvailability = {
  monday: { morning: true, afternoon: true, evening: false },
  tuesday: { morning: true, afternoon: true, evening: false },
  wednesday: { morning: true, afternoon: true, evening: false },
  thursday: { morning: true, afternoon: true, evening: false },
  friday: { morning: true, afternoon: true, evening: false },
  saturday: { morning: false, afternoon: false, evening: false },
};

export default function Faculty() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<any>(null);
  const [specializationInput, setSpecializationInput] = useState("");
  const queryClient = useQueryClient();

  const form = useForm<FacultyForm>({
    resolver: zodResolver(facultySchema),
    defaultValues: {
      user_id: "",
      employee_id: "",
      department: "",
      specialization: [],
      max_hours_per_week: 40,
      availability: defaultAvailability,
    },
  });

  const { data: faculty, isLoading } = useQuery({
    queryKey: ['faculty'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faculty')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: users } = useQuery({
    queryKey: ['users-faculty'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email')
        .eq('role', 'faculty');
      
      if (error) throw error;
      return data;
    },
  });

  const createFacultyMutation = useMutation({
    mutationFn: async (faculty: FacultyForm) => {
      const { data, error } = await supabase
        .from('faculty')
        .insert([faculty])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
      toast.success("Faculty created successfully!");
      setIsCreateOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error("Failed to create faculty: " + error.message);
    },
  });

  const updateFacultyMutation = useMutation({
    mutationFn: async ({ id, faculty }: { id: string; faculty: FacultyForm }) => {
      const { data, error } = await supabase
        .from('faculty')
        .update(faculty)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
      toast.success("Faculty updated successfully!");
      setEditingFaculty(null);
      form.reset();
    },
    onError: (error) => {
      toast.error("Failed to update faculty: " + error.message);
    },
  });

  const deleteFacultyMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('faculty')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
      toast.success("Faculty deleted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to delete faculty: " + error.message);
    },
  });

  const onSubmit = (data: FacultyForm) => {
    if (editingFaculty) {
      updateFacultyMutation.mutate({ id: editingFaculty.id, faculty: data });
    } else {
      createFacultyMutation.mutate(data);
    }
  };

  const handleEdit = (faculty: any) => {
    setEditingFaculty(faculty);
    form.reset({
      user_id: faculty.user_id,
      employee_id: faculty.employee_id,
      department: faculty.department,
      specialization: faculty.specialization,
      max_hours_per_week: faculty.max_hours_per_week,
      availability: faculty.availability,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this faculty member?")) {
      deleteFacultyMutation.mutate(id);
    }
  };

  const addSpecialization = () => {
    if (specializationInput.trim()) {
      const current = form.getValues("specialization");
      form.setValue("specialization", [...current, specializationInput.trim()]);
      setSpecializationInput("");
    }
  };

  const removeSpecialization = (index: number) => {
    const current = form.getValues("specialization");
    form.setValue("specialization", current.filter((_, i) => i !== index));
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Faculty Management</h1>
            <p className="text-muted-foreground">Manage faculty profiles and availability</p>
          </div>
          <Dialog open={isCreateOpen || !!editingFaculty} onOpenChange={(open) => {
            if (!open) {
              setIsCreateOpen(false);
              setEditingFaculty(null);
              form.reset();
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Faculty
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingFaculty ? 'Edit Faculty' : 'Add New Faculty'}</DialogTitle>
                <DialogDescription>
                  {editingFaculty ? 'Update faculty information' : 'Add a new faculty member to the system'}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="user_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Faculty User</FormLabel>
                        <FormControl>
                          <select {...field} className="w-full p-2 border rounded-md">
                            <option value="">Select a faculty user</option>
                            {users?.map(user => (
                              <option key={user.id} value={user.id}>
                                {user.full_name} ({user.email})
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="employee_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employee ID</FormLabel>
                          <FormControl>
                            <Input placeholder="EMP001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <FormControl>
                            <Input placeholder="Computer Science" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="max_hours_per_week"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Hours Per Week</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Specialization */}
                  <FormField
                    control={form.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specializations</FormLabel>
                        <div className="space-y-2">
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Add specialization"
                              value={specializationInput}
                              onChange={(e) => setSpecializationInput(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
                            />
                            <Button type="button" onClick={addSpecialization}>Add</Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {field.value?.map((spec, index) => (
                              <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                                {spec}
                                <button
                                  type="button"
                                  onClick={() => removeSpecialization(index)}
                                  className="ml-2 text-destructive"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Availability */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Weekly Availability</h4>
                    {Object.entries(defaultAvailability).map(([day, periods]) => (
                      <div key={day} className="border rounded p-3">
                        <h5 className="font-medium capitalize mb-2">{day}</h5>
                        <div className="grid grid-cols-3 gap-4">
                          {Object.keys(periods).map(period => (
                            <FormField
                              key={`${day}.${period}`}
                              control={form.control}
                              name={`availability.${day}.${period}` as any}
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <FormLabel className="capitalize text-sm font-normal">
                                    {period}
                                  </FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsCreateOpen(false);
                        setEditingFaculty(null);
                        form.reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createFacultyMutation.isPending || updateFacultyMutation.isPending}
                    >
                      {editingFaculty ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Faculty Members</CardTitle>
            <CardDescription>
              Manage faculty profiles, availability, and specializations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-6">Loading faculty...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Specializations</TableHead>
                    <TableHead>Max Hours/Week</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faculty?.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.employee_id}</TableCell>
                      <TableCell>{member.department}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {member.specialization?.slice(0, 2).map((spec: string, index: number) => (
                            <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                              {spec}
                            </span>
                          ))}
                          {member.specialization?.length > 2 && (
                            <span className="text-muted-foreground text-xs">
                              +{member.specialization.length - 2} more
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{member.max_hours_per_week}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(member)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(member.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {faculty?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        No faculty members found. Add your first faculty member!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}