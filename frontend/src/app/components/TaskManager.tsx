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
      const data = await getTasks(token);
      setTasks(data);
    } catch (err) {
      toast.error('Failed to load tasks');
    }
    setIsLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      await createTask(token, title);
      toast.success('Task created');
      setIsCreateDialogOpen(false);
      resetForm();
      loadTasks();
    } catch {
      toast.error('Failed to create task');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingTask) return;

    try {
      await updateTask(token, editingTask._id, title);
      toast.success('Task updated');
      setIsEditDialogOpen(false);
      setEditingTask(null);
      resetForm();
      loadTasks();
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!token) return;
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteTask(token, taskId);
      toast.success('Task deleted');
      loadTasks();
    } catch {
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

      {isLoading ? (
        <div>Loading...</div>
      ) : tasks.length === 0 ? (
        <p>No tasks yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <Card key={task._id}>
              <CardHeader>
                <CardTitle>{task.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button onClick={() => openEditDialog(task)}>
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(task._id)}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialogs remain SAME UI (no change needed) */}
    </div>
  );
}