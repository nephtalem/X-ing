'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Target, Calendar, Plus, Edit2, Trash2 } from 'lucide-react';
import type { Task, MonthlyGoal, WeeklyGoal } from '@/types';
import { formatDate, getWeekStart, getWeekEnd } from '@/lib/utils';
import { addDays, differenceInDays } from 'date-fns';

export default function TaskGoalsPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [task, setTask] = useState<Task | null>(null);
  const [monthlyGoals, setMonthlyGoals] = useState<MonthlyGoal[]>([]); // Changed to array!
  const [selectedMonthlyGoal, setSelectedMonthlyGoal] = useState<MonthlyGoal | null>(null);
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([]);

  // Form state for new monthly goal
  const [showMonthlyForm, setShowMonthlyForm] = useState(false);
  const [monthlyForm, setMonthlyForm] = useState({
    goal_title: '',
    description: '',
    start_date: formatDate(new Date()),
    duration_days: 30,
  });

  // Form state for weekly goals
  const [showWeeklyForm, setShowWeeklyForm] = useState(false);
  const [numberOfWeeks, setNumberOfWeeks] = useState(4);
  
  // Edit states
  const [editingMonthly, setEditingMonthly] = useState(false);
  const [editMonthlyForm, setEditMonthlyForm] = useState({
    goal_title: '',
    description: '',
  });
  const [editingWeeklyId, setEditingWeeklyId] = useState<string | null>(null);
  const [editWeeklyForm, setEditWeeklyForm] = useState({
    goal_title: '',
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, [taskId]);

  // Separate function to fetch weekly goals for a specific monthly goal
  const fetchWeeklyGoals = async (monthlyGoalId: string) => {
    try {
      const weeklyResponse = await fetch(
        `/api/goals/weekly?monthly_goal_id=${monthlyGoalId}`
      );
      const weeklyResult = await weeklyResponse.json();
      setWeeklyGoals(weeklyResult.data || []);
    } catch (error) {
      console.error('Error fetching weekly goals:', error);
    }
  };

  const fetchData = async () => {
    try {
      // Fetch task
      const taskResponse = await fetch(`/api/tasks/${taskId}`);
      const taskResult = await taskResponse.json();
      setTask(taskResult.data);

      // Fetch ALL active monthly goals (not just one!)
      const monthlyResponse = await fetch(
        `/api/goals/monthly?task_id=${taskId}&status=active`
      );
      const monthlyResult = await monthlyResponse.json();
      const activeGoals = monthlyResult.data || [];
      setMonthlyGoals(activeGoals);

      // If we have goals, select the first one by default and fetch its weeks
      if (activeGoals.length > 0 && !selectedMonthlyGoal) {
        const firstGoal = activeGoals[0];
        setSelectedMonthlyGoal(firstGoal);
        await fetchWeeklyGoals(firstGoal.id);
      } else if (selectedMonthlyGoal) {
        // If we already have a selected goal, fetch its weeks
        await fetchWeeklyGoals(selectedMonthlyGoal.id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMonthlyGoal = async () => {
    if (!monthlyForm.goal_title.trim()) return;

    setSaving(true);
    try {
      const startDate = new Date(monthlyForm.start_date);
      const endDate = addDays(startDate, monthlyForm.duration_days);

      const response = await fetch('/api/goals/monthly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: taskId,
          goal_title: monthlyForm.goal_title,
          description: monthlyForm.description,
          target_date: formatDate(endDate),
          month_year: `${startDate.getFullYear()}-${String(
            startDate.getMonth() + 1
          ).padStart(2, '0')}`,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Add to monthly goals list
        setMonthlyGoals([...monthlyGoals, result.data]);
        setSelectedMonthlyGoal(result.data); // Auto-select the new goal
        setShowMonthlyForm(false);
        setShowWeeklyForm(true); // Show weekly planning next
      }
    } catch (error) {
      console.error('Error creating monthly goal:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateMonthlyGoal = async () => {
    if (!selectedMonthlyGoal || !editMonthlyForm.goal_title.trim()) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/goals/monthly/${selectedMonthlyGoal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editMonthlyForm),
      });

      if (response.ok) {
        fetchData();
        setEditingMonthly(false);
      }
    } catch (error) {
      console.error('Error updating monthly goal:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMonthlyGoal = async () => {
    if (!selectedMonthlyGoal) return;
    if (!confirm('Delete this monthly goal? This will also delete all weekly goals and subtasks.')) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/goals/monthly/${selectedMonthlyGoal.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove from list
        const updated = monthlyGoals.filter(g => g.id !== selectedMonthlyGoal.id);
        setMonthlyGoals(updated);
        setSelectedMonthlyGoal(updated[0] || null);
        setWeeklyGoals([]);
      }
    } catch (error) {
      console.error('Error deleting monthly goal:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateWeeklyGoal = async (weekId: string) => {
    if (!editWeeklyForm.goal_title.trim()) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/goals/weekly/${weekId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editWeeklyForm),
      });

      if (response.ok) {
        fetchData();
        setEditingWeeklyId(null);
      }
    } catch (error) {
      console.error('Error updating weekly goal:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteWeeklyGoal = async (weekId: string) => {
    if (!confirm('Delete this weekly goal?')) return;

    try {
      const response = await fetch(`/api/goals/weekly/${weekId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting weekly goal:', error);
    }
  };

  const handleAddGoalToWeek = async (weekStart: string, weekEnd: string) => {
    if (!newGoalForm.goal_title.trim()) {
      alert('Please enter a goal title');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/goals/weekly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{
          monthly_goal_id: selectedMonthlyGoal!.id,
          task_id: taskId,
          goal_title: newGoalForm.goal_title,
          description: newGoalForm.description,
          week_start_date: weekStart,
          week_end_date: weekEnd,
        }]),
      });

      if (response.ok) {
        await fetchWeeklyGoals(selectedMonthlyGoal!.id);
        setAddingToWeek(null);
        setNewGoalForm({ goal_title: '', description: '' });
      }
    } catch (error) {
      console.error('Error adding goal to week:', error);
    } finally {
      setSaving(false);
    }
  };

  const startEditingMonthly = () => {
    if (selectedMonthlyGoal) {
      setEditMonthlyForm({
        goal_title: selectedMonthlyGoal.goal_title,
        description: selectedMonthlyGoal.description || '',
      });
      setEditingMonthly(true);
    }
  };

  const startEditingWeekly = (week: WeeklyGoal) => {
    setEditWeeklyForm({
      goal_title: week.goal_title,
      description: week.description || '',
    });
    setEditingWeeklyId(week.id);
  };

  const generateWeeklyGoals = () => {
    if (!selectedMonthlyGoal) return [];

    const startDate = new Date(monthlyForm.start_date || new Date());
    const endDate = new Date(selectedMonthlyGoal.target_date || addDays(startDate, 30));
    const totalDays = differenceInDays(endDate, startDate) + 1;
    const daysPerWeek = Math.floor(totalDays / numberOfWeeks);

    const weeks = [];
    let currentStart = startDate;

    for (let i = 0; i < numberOfWeeks; i++) {
      const isLastWeek = i === numberOfWeeks - 1;
      const weekEnd = isLastWeek
        ? endDate
        : addDays(currentStart, daysPerWeek - 1);

      weeks.push({
        weekNumber: i + 1,
        goal_title: '',
        description: '',
        week_start_date: formatDate(currentStart),
        week_end_date: formatDate(weekEnd),
      });

      currentStart = addDays(weekEnd, 1);
    }

    return weeks;
  };

  const [weeklyForms, setWeeklyForms] = useState(generateWeeklyGoals());

  // Track how many goals per week (for tree structure)
  const [goalsPerWeek, setGoalsPerWeek] = useState<{ [key: number]: number }>({});
  
  // State for adding new goal to existing week
  const [addingToWeek, setAddingToWeek] = useState<string | null>(null); // week_start_date
  const [newGoalForm, setNewGoalForm] = useState({ goal_title: '', description: '' });

  useEffect(() => {
    if (showWeeklyForm && selectedMonthlyGoal) {
      const weeks = generateWeeklyGoals();
      setWeeklyForms(weeks);
      // Initialize with 1 goal per week
      const initial: { [key: number]: number } = {};
      weeks.forEach((_, idx) => { initial[idx] = 1; });
      setGoalsPerWeek(initial);
    }
  }, [numberOfWeeks, showWeeklyForm, selectedMonthlyGoal]);

  const handleSaveWeeklyGoals = async () => {
    // Collect all goals from all weeks
    const allGoals: any[] = [];
    
    weeklyForms.forEach((week: any, weekIndex: number) => {
      const numGoals = goalsPerWeek[weekIndex] || 1;
      
      for (let goalIndex = 0; goalIndex < numGoals; goalIndex++) {
        const goalData = week[`goal_${goalIndex}`];
        
        if (goalData && goalData.goal_title?.trim()) {
          allGoals.push({
            monthly_goal_id: selectedMonthlyGoal!.id,
            task_id: taskId,
            goal_title: goalData.goal_title,
            description: goalData.description || '',
            week_start_date: week.week_start_date,
            week_end_date: week.week_end_date,
          });
        }
      }
    });

    if (allGoals.length === 0) {
      alert('Please enter at least one goal title.');
      return;
    }

    setSaving(true);
    try {
      // Create all goals one by one
      for (const goalData of allGoals) {
        await fetch('/api/goals/weekly', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([goalData]), // API expects array
        });
      }

      // Refresh data
      await fetchWeeklyGoals(selectedMonthlyGoal!.id);
      setShowWeeklyForm(false);
    } catch (error) {
      console.error('Error saving weekly goals:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <div className="text-center text-red-600">Task not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: task.color }}
            />
            {task.name}
          </h1>
          <p className="text-gray-600 mt-1">Set goals and plan your progress</p>
        </div>
      </div>

      {/* Monthly Goal Display or Create */}
      {monthlyGoals.length === 0 && !showMonthlyForm && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No monthly goals set
            </h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              Set monthly goals to track your progress and break them down into weekly milestones.
              You can have multiple goals active at once!
            </p>
            <Button onClick={() => setShowMonthlyForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Goal
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Monthly Goal Form */}
      {showMonthlyForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Monthly Goal</CardTitle>
            <CardDescription>
              Define what you want to achieve with this task
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal_title">Goal Title *</Label>
              <Input
                id="goal_title"
                placeholder="e.g., Complete React Advanced Course"
                value={monthlyForm.goal_title}
                onChange={(e) =>
                  setMonthlyForm({ ...monthlyForm, goal_title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                placeholder="Additional details about your goal..."
                value={monthlyForm.description}
                onChange={(e) =>
                  setMonthlyForm({
                    ...monthlyForm,
                    description: e.target.value,
                  })
                }
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={monthlyForm.start_date}
                  onChange={(e) =>
                    setMonthlyForm({ ...monthlyForm, start_date: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="7"
                  max="90"
                  value={monthlyForm.duration_days}
                  onChange={(e) =>
                    setMonthlyForm({
                      ...monthlyForm,
                      duration_days: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowMonthlyForm(false)}
                disabled={saving}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateMonthlyGoal}
                disabled={saving || !monthlyForm.goal_title.trim()}
                className="flex-1"
              >
                {saving ? 'Creating...' : 'Create Goal'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monthly Goals List with Selector */}
      {monthlyGoals.length > 0 && !showMonthlyForm && !showWeeklyForm && !editingMonthly && (
        <div className="space-y-4">
          {/* Monthly Goals Tabs/Selector */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Monthly Goals ({monthlyGoals.length})
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMonthlyForm(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Goal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {monthlyGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedMonthlyGoal?.id === goal.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedMonthlyGoal(goal);
                      fetchWeeklyGoals(goal.id); // Use the goal parameter directly!
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{goal.goal_title}</h3>
                        {goal.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {goal.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Target: {new Date(goal.target_date!).toLocaleDateString()}
                          </div>
                          <div>Progress: {goal.progress_percentage}%</div>
                        </div>
                      </div>
                      {selectedMonthlyGoal?.id === goal.id && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditingMonthly();
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMonthlyGoal();
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Monthly Goal Edit Form */}
      {editingMonthly && selectedMonthlyGoal && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Monthly Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit_goal_title">Goal Title *</Label>
              <Input
                id="edit_goal_title"
                value={editMonthlyForm.goal_title}
                onChange={(e) =>
                  setEditMonthlyForm({ ...editMonthlyForm, goal_title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_description">Description</Label>
              <textarea
                id="edit_description"
                value={editMonthlyForm.description}
                onChange={(e) =>
                  setEditMonthlyForm({
                    ...editMonthlyForm,
                    description: e.target.value,
                  })
                }
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm min-h-[80px]"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setEditingMonthly(false)}
                disabled={saving}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateMonthlyGoal}
                disabled={saving || !editMonthlyForm.goal_title.trim()}
                className="flex-1"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Goals Planning */}
      {showWeeklyForm && selectedMonthlyGoal && (
        <Card>
          <CardHeader>
            <CardTitle>Plan Weekly Goals</CardTitle>
            <CardDescription>
              Break down your monthly goal into weekly milestones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="num_weeks">Number of Weeks</Label>
              <Input
                id="num_weeks"
                type="number"
                min="2"
                max="8"
                value={numberOfWeeks}
                onChange={(e) => setNumberOfWeeks(parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-6">
              {weeklyForms.map((week, weekIndex) => (
                <div key={weekIndex} className="border-2 border-gray-200 rounded-lg p-5 space-y-4 bg-gray-50">
                  {/* Week Header */}
                  <div className="flex items-center justify-between pb-2 border-b">
                    <div>
                      <h4 className="font-semibold text-lg">Week {week.weekNumber}</h4>
                      <span className="text-sm text-gray-600">
                        {new Date(week.week_start_date).toLocaleDateString()} -{' '}
                        {new Date(week.week_end_date).toLocaleDateString()}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setGoalsPerWeek({
                          ...goalsPerWeek,
                          [weekIndex]: (goalsPerWeek[weekIndex] || 1) + 1
                        });
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Goal to Week {week.weekNumber}
                    </Button>
                  </div>

                  {/* Multiple Goals for this Week */}
                  {Array.from({ length: goalsPerWeek[weekIndex] || 1 }).map((_, goalIndex) => {
                    const formIndex = `${weekIndex}-${goalIndex}`;
                    return (
                      <div key={formIndex} className="bg-white border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="text-sm font-medium text-gray-700">Goal #{goalIndex + 1}</h5>
                          {goalIndex > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setGoalsPerWeek({
                                  ...goalsPerWeek,
                                  [weekIndex]: Math.max(1, goalsPerWeek[weekIndex] - 1)
                                });
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          )}
                        </div>
                        <Input
                          placeholder={`Goal ${goalIndex + 1} for Week ${week.weekNumber}...`}
                          value={(weeklyForms[weekIndex] as any)?.[`goal_${goalIndex}`]?.goal_title || ''}
                          onChange={(e) => {
                            const updated = [...weeklyForms] as any[];
                            if (!updated[weekIndex][`goal_${goalIndex}`]) {
                              updated[weekIndex][`goal_${goalIndex}`] = { goal_title: '', description: '' };
                            }
                            updated[weekIndex][`goal_${goalIndex}`].goal_title = e.target.value;
                            setWeeklyForms(updated);
                          }}
                        />
                        <Input
                          placeholder="Description (optional)"
                          value={(weeklyForms[weekIndex] as any)?.[`goal_${goalIndex}`]?.description || ''}
                          onChange={(e) => {
                            const updated = [...weeklyForms] as any[];
                            if (!updated[weekIndex][`goal_${goalIndex}`]) {
                              updated[weekIndex][`goal_${goalIndex}`] = { goal_title: '', description: '' };
                            }
                            updated[weekIndex][`goal_${goalIndex}`].description = e.target.value;
                            setWeeklyForms(updated);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowWeeklyForm(false)}
                disabled={saving}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveWeeklyGoals}
                disabled={saving}
                className="flex-1"
              >
                {saving ? 'Saving...' : 'Save Weekly Goals'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Goals Display - Grouped by Week */}
      {weeklyGoals.length > 0 && !showWeeklyForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Weekly Breakdown (Tree Structure)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Group weekly goals by week period */}
            {(() => {
              // Group goals by week_start_date
              const groupedByWeek = weeklyGoals.reduce((acc, goal) => {
                const weekKey = goal.week_start_date!;
                if (!acc[weekKey]) {
                  acc[weekKey] = [];
                }
                acc[weekKey].push(goal);
                return acc;
              }, {} as Record<string, WeeklyGoal[]>);

              return Object.entries(groupedByWeek).map(([weekStart, goals], weekIndex) => (
                <div key={weekStart} className="mb-6 border-2 rounded-lg p-4 bg-gray-50">
                  {/* Week Header */}
                  <div className="flex items-center justify-between mb-4 pb-2 border-b">
                    <div>
                      <h4 className="font-semibold text-lg">Week {weekIndex + 1}</h4>
                      <span className="text-sm text-gray-600">
                        {new Date(weekStart).toLocaleDateString()} -{' '}
                        {new Date(goals[0].week_end_date!).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">
                        {goals.length} goal{goals.length > 1 ? 's' : ''}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAddingToWeek(weekStart)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Goal
                      </Button>
                    </div>
                  </div>

                  {/* Goals within this week */}
                  <div className="space-y-3">
                    {/* Add New Goal Form */}
                    {addingToWeek === weekStart && (
                      <div className="border-2 border-blue-500 rounded-lg p-4 space-y-3 bg-white">
                        <h6 className="font-medium text-sm text-gray-700">Add New Goal to Week {weekIndex + 1}</h6>
                        <div className="space-y-2">
                          <Label>Goal Title</Label>
                          <Input
                            placeholder="Enter goal title..."
                            value={newGoalForm.goal_title}
                            onChange={(e) => setNewGoalForm({ ...newGoalForm, goal_title: e.target.value })}
                            autoFocus
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description (optional)</Label>
                          <Input
                            placeholder="Enter description..."
                            value={newGoalForm.description}
                            onChange={(e) => setNewGoalForm({ ...newGoalForm, description: e.target.value })}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setAddingToWeek(null);
                              setNewGoalForm({ goal_title: '', description: '' });
                            }}
                            disabled={saving}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAddGoalToWeek(weekStart, goals[0].week_end_date!)}
                            disabled={saving || !newGoalForm.goal_title.trim()}
                            className="flex-1"
                          >
                            {saving ? 'Adding...' : 'Add Goal'}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Existing Goals */}
                    {goals.map((goal) => (
                      <div key={goal.id}>
                        {editingWeeklyId === goal.id ? (
                          // Edit Mode
                          <div className="border border-blue-500 rounded-lg p-4 space-y-3 bg-white">
                            <div className="space-y-2">
                              <Label>Goal Title</Label>
                              <Input
                                value={editWeeklyForm.goal_title}
                                onChange={(e) =>
                                  setEditWeeklyForm({
                                    ...editWeeklyForm,
                                    goal_title: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Input
                                value={editWeeklyForm.description}
                                onChange={(e) =>
                                  setEditWeeklyForm({
                                    ...editWeeklyForm,
                                    description: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingWeeklyId(null)}
                                disabled={saving}
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleUpdateWeeklyGoal(goal.id)}
                                disabled={saving || !editWeeklyForm.goal_title.trim()}
                                className="flex-1"
                              >
                                {saving ? 'Saving...' : 'Save'}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // Display Mode
                          <div className="border rounded-lg p-4 hover:border-gray-300 transition-colors bg-white">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium">{goal.goal_title}</h5>
                                {goal.description && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    {goal.description}
                                  </p>
                                )}
                                {goal.completed && (
                                  <span className="text-green-600 text-sm font-medium mt-2 inline-block">
                                    ✓ Complete
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => startEditingWeekly(goal)}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteWeeklyGoal(goal.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ));
            })()}
          </CardContent>
        </Card>
      )}

      {/* Action Button */}
      {selectedMonthlyGoal && weeklyGoals.length === 0 && !showWeeklyForm && !editingMonthly && (
        <Button onClick={() => setShowWeeklyForm(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Plan Weekly Goals for "{selectedMonthlyGoal.goal_title}"
        </Button>
      )}
    </div>
  );
}

