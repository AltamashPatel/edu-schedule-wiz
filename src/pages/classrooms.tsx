import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, MapPin } from "lucide-react";

const classroomSchema = z.object({
  name: z.string().min(1, "Name is required"),
  building: z.string().min(1, "Building is required"),
  capacity: z.number().min(1, "Capacity must be positive"),
  type: z.enum(["lecture", "lab", "seminar"], { required_error: "Type is required" }),
  equipment: z.array(z.string()).default([]),
});

type ClassroomForm = z.infer<typeof classroomSchema>;

export default function Classrooms() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<any>(null);
  const [equipmentInput, setEquipmentInput] = useState("");
  const queryClient = useQueryClient();

  const form = useForm<ClassroomForm>({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      name: "",
      building: "",
      capacity: 0,
      type: "lecture",
      equipment: [],
    },
  });

  const { data: classrooms, isLoading } = useQuery({
    queryKey: ['classrooms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classrooms')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createClassroomMutation = useMutation({
    mutationFn: async (classroom: ClassroomForm) => {
      const { data, error } = await supabase
        .from('classrooms')
        .insert([classroom])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
      toast.success("Classroom created successfully!");
      setIsCreateOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error("Failed to create classroom: " + error.message);
    },
  });

  const updateClassroomMutation = useMutation({
    mutationFn: async ({ id, classroom }: { id: string; classroom: ClassroomForm }) => {
      const { data, error } = await supabase
        .from('classrooms')
        .update(classroom)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
      toast.success("Classroom updated successfully!");
      setEditingClassroom(null);
      form.reset();
    },
    onError: (error) => {
      toast.error("Failed to update classroom: " + error.message);
    },
  });

  const deleteClassroomMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('classrooms')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms'] });
      toast.success("Classroom deleted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to delete classroom: " + error.message);
    },
  });

  const onSubmit = (data: ClassroomForm) => {
    if (editingClassroom) {
      updateClassroomMutation.mutate({ id: editingClassroom.id, classroom: data });
    } else {
      createClassroomMutation.mutate(data);
    }
  };

  const handleEdit = (classroom: any) => {
    setEditingClassroom(classroom);
    form.reset({
      name: classroom.name,
      building: classroom.building,
      capacity: classroom.capacity,
      type: classroom.type,
      equipment: classroom.equipment || [],
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this classroom?")) {
      deleteClassroomMutation.mutate(id);
    }
  };

  const addEquipment = () => {
    if (equipmentInput.trim()) {
      const current = form.getValues("equipment");
      form.setValue("equipment", [...current, equipmentInput.trim()]);
      setEquipmentInput("");
    }
  };

  const removeEquipment = (index: number) => {
    const current = form.getValues("equipment");
    form.setValue("equipment", current.filter((_, i) => i !== index));
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Classroom Management</h1>
            <p className="text-muted-foreground">Manage classroom spaces and equipment</p>
          </div>
          <Dialog open={isCreateOpen || !!editingClassroom} onOpenChange={(open) => {
            if (!open) {
              setIsCreateOpen(false);
              setEditingClassroom(null);
              form.reset();
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Classroom
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingClassroom ? 'Edit Classroom' : 'Add New Classroom'}</DialogTitle>
                <DialogDescription>
                  {editingClassroom ? 'Update classroom information' : 'Add a new classroom to the system'}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Classroom Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Room 101" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="building"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Building</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Main Block" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacity</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="60"
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select classroom type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="lecture">Lecture Hall</SelectItem>
                            <SelectItem value="lab">Laboratory</SelectItem>
                            <SelectItem value="seminar">Seminar Room</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Equipment */}
                  <FormField
                    control={form.control}
                    name="equipment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equipment</FormLabel>
                        <div className="space-y-2">
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Add equipment"
                              value={equipmentInput}
                              onChange={(e) => setEquipmentInput(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEquipment())}
                            />
                            <Button type="button" onClick={addEquipment}>Add</Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {field.value?.map((equipment, index) => (
                              <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                                {equipment}
                                <button
                                  type="button"
                                  onClick={() => removeEquipment(index)}
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

                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsCreateOpen(false);
                        setEditingClassroom(null);
                        form.reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createClassroomMutation.isPending || updateClassroomMutation.isPending}
                    >
                      {editingClassroom ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Classrooms</CardTitle>
            <CardDescription>
              Manage classroom spaces, capacity, and available equipment
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-6">Loading classrooms...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Building</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classrooms?.map((classroom) => (
                    <TableRow key={classroom.id}>
                      <TableCell className="font-medium">{classroom.name}</TableCell>
                      <TableCell>{classroom.building}</TableCell>
                      <TableCell className="capitalize">{classroom.type}</TableCell>
                      <TableCell>{classroom.capacity}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {classroom.equipment?.slice(0, 2).map((equipment: string, index: number) => (
                            <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                              {equipment}
                            </span>
                          ))}
                          {classroom.equipment?.length > 2 && (
                            <span className="text-muted-foreground text-xs">
                              +{classroom.equipment.length - 2} more
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(classroom)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(classroom.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {classrooms?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        No classrooms found. Add your first classroom!
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