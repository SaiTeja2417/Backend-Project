import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../utils/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit2, Trash2, CheckCircle2, Clock, PlayCircle } from 'lucide-react';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
}

export default function TaskManager() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await getTasks(token);

      // 🔥 FIX: extract data correctly
      if (res.success && Array.isArray(res.data)) {
        setTasks(res.data);
      } else {
        setTasks([]);
      }
    } catch {
      toast.error('Failed to load tasks');
    }
    setIsLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const res = await createTask(token, { title, description, status });

    if (res.success) {
      toast.success('Task created');
      setIsCreateDialogOpen(false);
      resetForm();
      loadTasks();
    } else {
      toast.error('Failed to create task');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingTask) return;

    const res = await updateTask(token, editingTask._id, {
      title,
      description,
      status
    });

    if (res.success) {
      toast.success('Task updated');
      setIsEditDialogOpen(false);
      setEditingTask(null);
      resetForm();
      loadTasks();
    } else {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!token) return;
    if (!confirm('Are you sure?')) return;

    const res = await deleteTask(token, taskId);

    if (res.success) {
      toast.success('Task deleted');
      loadTasks();
    } else {
      toast.error('Failed to delete task');
    }
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
    setStatus(task.status || 'pending');
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('pending');
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'in-progress':
        return <PlayCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
          <p className="text-gray-600 mt-1">Manage your tasks and track progress</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* LOADING */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        /* EMPTY STATE */
        <Card className="text-center py-12">
          <CardContent>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks yet</h3>
            <p className="text-gray-600 mb-4">Create your first task to get started</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* TASK CARDS */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <Card key={task._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  <Badge className={getStatusColor(task.status)} variant="outline">
                    {getStatusIcon(task.status)}
                    <span className="ml-1 capitalize">
                      {task.status?.replace('-', ' ')}
                    </span>
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {task.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEditDialog(task)} className="flex-1">
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(task._id)}
                    className="flex-1 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  Created {new Date(task.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create New Task</DialogTitle>
      <DialogDescription>Add a new task</DialogDescription>
    </DialogHeader>

    <form onSubmit={handleCreate}>
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter className="mt-4">
        <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
          Cancel
        </Button>
        <Button type="submit">Create</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>

<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogDescription>Update task</DialogDescription>
    </DialogHeader>

    <form onSubmit={handleUpdate}>
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter className="mt-4">
        <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
          Cancel
        </Button>
        <Button type="submit">Update</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
      

    </div>
  );
}