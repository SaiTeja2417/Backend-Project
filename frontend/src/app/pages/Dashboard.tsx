import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import TaskManager from '../components/TaskManager';
import { LogOut, User, Shield, BarChart3, ListTodo, Clock } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Task Manager</h1>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {user ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <Badge variant="outline" className="text-xs">
                    {user?.role === 'admin' ? <Shield className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                    {user?.role}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-gray-600 mt-1">Here's what's happening with your tasks today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Your Role
              </CardTitle>
              <Shield className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{user?.role}</div>
              <p className="text-xs text-gray-500 mt-1">
                {user?.role === 'admin' ? 'Full access to all tasks' : 'Access to your tasks'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Task Management
              </CardTitle>
              <ListTodo className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">CRUD Operations</div>
              <p className="text-xs text-gray-500 mt-1">
                Create, Read, Update, Delete
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                API Status
              </CardTitle>
              <BarChart3 className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Mock API</div>
              <p className="text-xs text-gray-500 mt-1">
                JWT authentication active
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Role Info Banner */}
        {user?.role === 'admin' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900">Admin Access</h3>
                <p className="text-sm text-blue-700 mt-1">
                  You have admin privileges. You can view and manage all tasks from all users.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Task Manager Component */}
        <TaskManager />

        {/* API Info Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>API Information</CardTitle>
            <CardDescription>Backend features implemented with mock APIs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-900">Authentication</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ JWT token-based authentication</li>
                  <li>✓ Password hashing (simulated)</li>
                  <li>✓ Persistent sessions (localStorage)</li>
                  <li>✓ Protected routes</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-900">Authorization</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ Role-based access control (User/Admin)</li>
                  <li>✓ Users can only edit their own tasks</li>
                  <li>✓ Admins can edit all tasks</li>
                  <li>✓ Proper error handling</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-900">CRUD Operations</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ Create new tasks</li>
                  <li>✓ Read/List tasks</li>
                  <li>✓ Update task details</li>
                  <li>✓ Delete tasks</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-900">Validation & Errors</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ Form validation</li>
                  <li>✓ API error handling</li>
                  <li>✓ Success/error toast messages</li>
                  <li>✓ Loading states</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
