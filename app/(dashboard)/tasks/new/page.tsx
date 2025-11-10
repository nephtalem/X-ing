'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { TASK_COLORS, DEFAULT_TARGET_DAYS_PER_WEEK } from '@/lib/constants';

export default function NewTaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    target_days_per_week: DEFAULT_TARGET_DAYS_PER_WEEK,
    color: TASK_COLORS[0].value,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
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
        setError(result.error || 'Failed to create task');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to create task');
      setLoading(false);
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
          <h1 className="text-3xl font-bold text-gray-900">Create New Task</h1>
          <p className="text-gray-600 mt-1">
            Define a deep work area you want to focus on
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
          <CardDescription>
            Give your task a name and set your weekly target. For example: &quot;Learn Guitar&quot; or &quot;Build Programming Skills&quot;
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
                disabled={loading}
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
                disabled={loading}
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
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
                disabled={loading}
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
                        ? 'border-gray-900 scale-110'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: colorOption.value }}
                    title={colorOption.name}
                    disabled={loading}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Creating...' : 'Create Task'}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}

