'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import type { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TasksPage() {
  const { user, updateUserData } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(user?.data.tasks || []);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      description: '',
      dueDate: '',
      priority: 'medium',
      completed: false,
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    updateUserData({ tasks: updatedTasks });
    setNewTaskTitle('');
  };

  const handleToggleTask = (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    updateUserData({ tasks: updatedTasks });
  };

  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    updateUserData({ tasks: updatedTasks });
  };
  
  const completedTasks = tasks.filter(t => t.completed);
  const pendingTasks = tasks.filter(t => !t.completed);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="e.g., Read Chapter 5 of Biology"
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <Button onClick={handleAddTask}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>To-Do</CardTitle>
          <CardDescription>Tasks you need to complete.</CardDescription>
        </CardHeader>
        <CardContent>
            {pendingTasks.length > 0 ? (
                <div className="space-y-2">
                    {pendingTasks.map(task => (
                        <div key={task.id} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted">
                            <Checkbox id={`task-${task.id}`} checked={task.completed} onCheckedChange={() => handleToggleTask(task.id)} />
                            <label htmlFor={`task-${task.id}`} className={cn("flex-grow", task.completed && "line-through text-muted-foreground")}>
                                {task.title}
                            </label>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    ))}
                </div>
            ) : (
                 <p className="text-muted-foreground text-center py-4">No pending tasks. Great job!</p>
            )}
        </CardContent>
      </Card>

      {completedTasks.length > 0 && (
         <Card>
            <CardHeader>
            <CardTitle>Completed</CardTitle>
            <CardDescription>Tasks you've already finished.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {completedTasks.map(task => (
                        <div key={task.id} className="flex items-center gap-4 p-2 rounded-md">
                            <Checkbox id={`task-${task.id}`} checked={task.completed} onCheckedChange={() => handleToggleTask(task.id)} />
                            <label htmlFor={`task-${task.id}`} className={cn("flex-grow", task.completed && "line-through text-muted-foreground")}>
                                {task.title}
                            </label>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
