'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { TASK_COLORS, DEFAULT_TARGET_DAYS_PER_WEEK } from '@/lib/constants';
import type { Task } from '@/types';

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [task, setTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    target_days_per_week: number;
    color: string;
  }>({
    name: '',
    description: '',
    target_days_per_week: DEFAULT_TARGET_DAYS_PER_WEEK,
    color: TASK_COLORS[0].value,
  });

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`);
      const result = await response.json();

      if (response.ok && result.data) {
        setTask(result.data);
        setFormData({
          name: result.data.name,
          description: result.data.description || '',
          target_days_per_week: result.data.target_days_per_week,
          color: result.data.color,
        });
      } else {
        setError(result.error || 'Task not found');
      }
    } catch (err) {
      setError('Failed to fetch task');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        router.push('/tasks');
        router.refresh();
      } else {
        setError(result.error || 'Failed to update task');
        setSaving(false);
      }
    } catch (err) {
      setError('Failed to update task');
      setSaving(false);
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="text-center text-gray-500">Loading task...</div>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
          {error}
        </div>
        <Button onClick={() => router.push('/tasks')} className="mt-4">
          Back to Tasks
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Task</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Update your deep work task details
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
          <CardDescription>
            Modify the task information as needed
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Task Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Learn Guitar, Build Programming Skills"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <textarea
                id="description"
                name="description"
                placeholder="What do you want to achieve with this task?"
                value={formData.description}
                onChange={handleChange}
                disabled={saving}
                className="flex w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 ring-offset-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_days_per_week">Target Days Per Week *</Label>
              <Input
                id="target_days_per_week"
                name="target_days_per_week"
                type="number"
                min="1"
                max="7"
                value={formData.target_days_per_week}
                onChange={handleChange}
                required
                disabled={saving}
              />
              <p className="text-xs text-gray-500">
                How many days per week do you want to work on this task?
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <div className="flex gap-3 flex-wrap">
                {TASK_COLORS.map((colorOption) => (
                  <button
                    key={colorOption.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: colorOption.value })}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      formData.color === colorOption.value
                        ? 'border-blue-500 dark:border-blue-400 scale-110 ring-2 ring-blue-200 dark:ring-blue-900'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    style={{ backgroundColor: colorOption.value }}
                    title={colorOption.name}
                    disabled={saving}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={saving}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push(`/tasks/${taskId}/goals`)}
                disabled={saving}
              >
                Manage Goals
              </Button>
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}

