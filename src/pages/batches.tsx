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
import { Plus, Edit2, Trash2 } from "lucide-react";

const batchSchema = z.object({
  name: z.string().min(1, "Name is required"),
  year: z.number().min(1, "Year must be positive"),
  semester: z.number().min(1).max(8, "Semester must be between 1-8"),
  department: z.string().min(1, "Department is required"),
  section: z.string().min(1, "Section is required"),
  strength: z.number().min(1, "Strength must be positive"),
});

type BatchForm = z.infer<typeof batchSchema>;

export default function Batches() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<any>(null);
  const queryClient = useQueryClient();

  const form = useForm<BatchForm>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      name: "",
      year: new Date().getFullYear(),
      semester: 1,
      department: "",
      section: "",
      strength: 0,
    },
  });

  const { data: batches, isLoading } = useQuery({
    queryKey: ['batches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('batches')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createBatchMutation = useMutation({
    mutationFn: async (batch: BatchForm) => {
      const { data, error } = await supabase
        .from('batches')
        .insert([batch])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      toast.success("Batch created successfully!");
      setIsCreateOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error("Failed to create batch: " + error.message);
    },
  });

  const updateBatchMutation = useMutation({
    mutationFn: async ({ id, batch }: { id: string; batch: BatchForm }) => {
      const { data, error } = await supabase
        .from('batches')
        .update(batch)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      toast.success("Batch updated successfully!");
      setEditingBatch(null);
      form.reset();
    },
    onError: (error) => {
      toast.error("Failed to update batch: " + error.message);
    },
  });

  const deleteBatchMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('batches')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      toast.success("Batch deleted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to delete batch: " + error.message);
    },
  });

  const onSubmit = (data: BatchForm) => {
    if (editingBatch) {
      updateBatchMutation.mutate({ id: editingBatch.id, batch: data });
    } else {
      createBatchMutation.mutate(data);
    }
  };

  const handleEdit = (batch: any) => {
    setEditingBatch(batch);
    form.reset({
      name: batch.name,
      year: batch.year,
      semester: batch.semester,
      department: batch.department,
      section: batch.section,
      strength: batch.strength,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this batch?")) {
      deleteBatchMutation.mutate(id);
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Batch Management</h1>
            <p className="text-muted-foreground">Manage student batches and sections</p>
          </div>
          <Dialog open={isCreateOpen || !!editingBatch} onOpenChange={(open) => {
            if (!open) {
              setIsCreateOpen(false);
              setEditingBatch(null);
              form.reset();
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Batch
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingBatch ? 'Edit Batch' : 'Create New Batch'}</DialogTitle>
                <DialogDescription>
                  {editingBatch ? 'Update batch information' : 'Add a new batch to the system'}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Batch Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CSE 2024 A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
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
                    <FormField
                      control={form.control}
                      name="semester"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Semester</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select semester" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[1,2,3,4,5,6,7,8].map(sem => (
                                <SelectItem key={sem} value={sem.toString()}>{sem}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Computer Science" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="section"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., A" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="strength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student Strength</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Number of students"
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
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
                        setEditingBatch(null);
                        form.reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createBatchMutation.isPending || updateBatchMutation.isPending}
                    >
                      {editingBatch ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Batches</CardTitle>
            <CardDescription>
              Manage and view all student batches in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-6">Loading batches...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Strength</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batches?.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">{batch.name}</TableCell>
                      <TableCell>{batch.department}</TableCell>
                      <TableCell>{batch.year}</TableCell>
                      <TableCell>{batch.semester}</TableCell>
                      <TableCell>{batch.section}</TableCell>
                      <TableCell>{batch.strength}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(batch)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(batch.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {batches?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        No batches found. Create your first batch!
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