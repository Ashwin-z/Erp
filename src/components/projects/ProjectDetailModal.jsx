import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ProjectGanttChart from './ProjectGanttChart';
import TimeTrackingPanel from './TimeTrackingPanel';
import ResourceManagement from './ResourceManagement';
import ProjectDocuments from './ProjectDocuments';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Edit, Calendar, DollarSign, Users, Building2, Target, 
  Plus, CheckCircle2, Circle, Clock, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

const statusConfig = {
  planning: { label: 'Planning', color: 'bg-slate-100 text-slate-700' },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  on_hold: { label: 'On Hold', color: 'bg-amber-100 text-amber-700' },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' }
};

const taskStatusConfig = {
  todo: { label: 'To Do', color: 'bg-slate-100 text-slate-600', icon: Circle },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-600', icon: Clock },
  review: { label: 'Review', color: 'bg-amber-100 text-amber-600', icon: AlertTriangle },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-600', icon: CheckCircle2 }
};

export default function ProjectDetailModal({ open, onClose, project, onEdit }) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const queryClient = useQueryClient();

  const { data: tasks = [] } = useQuery({
    queryKey: ['project-tasks', project?.id],
    queryFn: () => base44.entities.ProjectTask.filter({ project_id: project.id }, 'order'),
    enabled: !!project?.id
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Project.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  const createTaskMutation = useMutation({
    mutationFn: (data) => base44.entities.ProjectTask.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks', project?.id] });
      setNewTaskTitle('');
      toast.success('Task added');
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ProjectTask.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks', project?.id] });
    }
  });

  if (!project) return null;

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    createTaskMutation.mutate({
      project_id: project.id,
      title: newTaskTitle,
      status: 'todo',
      priority: 'medium',
      order: tasks.length
    });
  };

  const handleToggleTask = (task) => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    updateTaskMutation.mutate({
      id: task.id,
      data: { 
        status: newStatus,
        completed_date: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : null
      }
    });

    // Update project progress
    const completedCount = tasks.filter(t => t.id === task.id ? newStatus === 'completed' : t.status === 'completed').length;
    const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
    updateProjectMutation.mutate({ id: project.id, data: { progress } });
  };

  const handleToggleMilestone = (milestone) => {
    const updatedMilestones = project.milestones.map(m => 
      m.id === milestone.id 
        ? { ...m, completed: !m.completed, completed_date: !m.completed ? new Date().toISOString() : null }
        : m
    );
    updateProjectMutation.mutate({ id: project.id, data: { milestones: updatedMilestones } });
    toast.success(milestone.completed ? 'Milestone reopened' : 'Milestone completed');
  };

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const completedMilestones = project.milestones?.filter(m => m.completed).length || 0;
  const budgetUsed = project.spent && project.budget ? (project.spent / project.budget * 100) : 0;

  // Build timeline data
  const timelineItems = [
    ...(project.milestones || []).map(m => ({
      type: 'milestone',
      date: m.due_date,
      name: m.name,
      completed: m.completed,
      id: m.id
    })),
    { type: 'end', date: project.end_date, name: 'Project End' }
  ].filter(i => i.date).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{project.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={statusConfig[project.status]?.color}>
                  {statusConfig[project.status]?.label}
                </Badge>
                <span className="text-slate-500 flex items-center gap-1">
                  <Building2 className="w-4 h-4" />{project.customer_name}
                </span>
              </div>
            </div>
            <Button variant="outline" onClick={() => onEdit(project)}>
              <Edit className="w-4 h-4 mr-2" />Edit
            </Button>
          </div>
        </DialogHeader>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold">{project.progress || 0}%</p>
              <p className="text-xs text-slate-500">Progress</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold">{completedTasks}/{tasks.length}</p>
              <p className="text-xs text-slate-500">Tasks</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold">{completedMilestones}/{project.milestones?.length || 0}</p>
              <p className="text-xs text-slate-500">Milestones</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold">${((project.budget || 0) / 1000).toFixed(0)}K</p>
              <p className="text-xs text-slate-500">Budget</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="flex-wrap">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="gantt">Gantt</TabsTrigger>
            <TabsTrigger value="time">Time</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            {/* Progress */}
            <Card className="border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Progress</span>
                      <span className="font-medium">{project.progress || 0}%</span>
                    </div>
                    <Progress value={project.progress || 0} className="h-3" />
                  </div>
                  {project.budget && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Budget Used</span>
                        <span className="font-medium">${(project.spent || 0).toLocaleString()} / ${project.budget.toLocaleString()}</span>
                      </div>
                      <Progress value={budgetUsed} className="h-3" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Milestones */}
            {project.milestones?.length > 0 && (
              <Card className="border-slate-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Milestones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {project.milestones.map((milestone) => (
                    <div 
                      key={milestone.id} 
                      className={`flex items-center justify-between p-3 rounded-lg ${milestone.completed ? 'bg-emerald-50' : 'bg-slate-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={milestone.completed} 
                          onCheckedChange={() => handleToggleMilestone(milestone)}
                        />
                        <div>
                          <p className={`font-medium ${milestone.completed ? 'line-through text-slate-500' : ''}`}>
                            {milestone.name}
                          </p>
                          {milestone.due_date && (
                            <p className="text-xs text-slate-500">
                              Due: {moment(milestone.due_date).format('DD MMM YYYY')}
                            </p>
                          )}
                        </div>
                      </div>
                      {milestone.completed && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Description */}
            {project.description && (
              <Card className="border-slate-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 whitespace-pre-wrap">{project.description}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tasks" className="mt-4">
            <Card className="border-slate-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Tasks</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {/* Add Task */}
                <div className="flex gap-2 mb-4">
                  <Input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Add a new task..."
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                  />
                  <Button onClick={handleAddTask} disabled={!newTaskTitle.trim()}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Task List */}
                <div className="space-y-2">
                  {tasks.map((task) => {
                    const StatusIcon = taskStatusConfig[task.status]?.icon || Circle;
                    return (
                      <div 
                        key={task.id} 
                        className={`flex items-center justify-between p-3 rounded-lg ${task.status === 'completed' ? 'bg-emerald-50' : 'bg-slate-50'}`}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox 
                            checked={task.status === 'completed'} 
                            onCheckedChange={() => handleToggleTask(task)}
                          />
                          <div>
                            <p className={`font-medium ${task.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
                              {task.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {task.assignee_name && (
                                <span className="text-xs text-slate-500">{task.assignee_name}</span>
                              )}
                              {task.due_date && (
                                <span className="text-xs text-slate-400">
                                  <Calendar className="w-3 h-3 inline mr-1" />
                                  {moment(task.due_date).format('DD MMM')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge className={taskStatusConfig[task.status]?.color}>
                          {taskStatusConfig[task.status]?.label}
                        </Badge>
                      </div>
                    );
                  })}
                  {tasks.length === 0 && (
                    <p className="text-center text-slate-500 py-8">No tasks yet. Add your first task above.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="mt-4">
            <Card className="border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Project Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
                  
                  {/* Start */}
                  <div className="relative flex items-start gap-4 pb-6">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center z-10">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Project Start</p>
                      <p className="text-sm text-slate-500">
                        {project.start_date ? moment(project.start_date).format('DD MMM YYYY') : 'Not set'}
                      </p>
                    </div>
                  </div>

                  {/* Milestones */}
                  {timelineItems.map((item, index) => (
                    <div key={index} className="relative flex items-start gap-4 pb-6">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                        item.type === 'end' ? 'bg-violet-500' :
                        item.completed ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}>
                        {item.type === 'milestone' ? (
                          <Target className="w-4 h-4 text-white" />
                        ) : (
                          <Calendar className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <p className={`font-medium ${item.completed ? 'text-emerald-600' : ''}`}>
                          {item.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {moment(item.date).format('DD MMM YYYY')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gantt" className="mt-4">
            <ProjectGanttChart project={project} tasks={tasks} />
          </TabsContent>

          <TabsContent value="time" className="mt-4">
            <TimeTrackingPanel project={project} tasks={tasks} />
          </TabsContent>

          <TabsContent value="resources" className="mt-4">
            <ResourceManagement project={project} />
          </TabsContent>

          <TabsContent value="documents" className="mt-4">
            <ProjectDocuments project={project} />
          </TabsContent>

          <TabsContent value="team" className="mt-4">
            <Card className="border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Manager */}
                {project.manager_name && (
                  <div className="mb-4">
                    <p className="text-xs text-slate-500 mb-2">Project Manager</p>
                    <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-violet-200 flex items-center justify-center text-violet-700 font-medium">
                        {project.manager_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{project.manager_name}</p>
                        <p className="text-sm text-slate-500">{project.manager_email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Team */}
                <p className="text-xs text-slate-500 mb-2">Team Members</p>
                <div className="space-y-2">
                  {project.team_members?.map((member, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                        {member.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-slate-500">{member.email} {member.role && `• ${member.role}`}</p>
                      </div>
                    </div>
                  ))}
                  {(!project.team_members || project.team_members.length === 0) && (
                    <p className="text-center text-slate-500 py-4">No team members assigned</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}