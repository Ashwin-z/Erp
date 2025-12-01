import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PageHeader from '@/components/shared/PageHeader';
import ProjectFormModal from '@/components/projects/ProjectFormModal';
import ProjectDetailModal from '@/components/projects/ProjectDetailModal';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
  FolderKanban, Plus, Search, Calendar, DollarSign, Users, 
  Clock, Building2, MoreHorizontal, Edit, Trash2, Eye
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import moment from 'moment';

const statusConfig = {
  planning: { label: 'Planning', color: 'bg-slate-100 text-slate-700' },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  on_hold: { label: 'On Hold', color: 'bg-amber-100 text-amber-700' },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' }
};

const priorityConfig = {
  low: { label: 'Low', color: 'bg-slate-100 text-slate-600' },
  medium: { label: 'Medium', color: 'bg-blue-100 text-blue-600' },
  high: { label: 'High', color: 'bg-amber-100 text-amber-600' },
  critical: { label: 'Critical', color: 'bg-red-100 text-red-600' }
};

export default function Projects() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-created_date')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Project.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted');
      setDeleteConfirm(null);
    }
  });

  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customer_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'in_progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0)
  };

  const getDaysRemaining = (endDate) => {
    if (!endDate) return null;
    const days = moment(endDate).diff(moment(), 'days');
    return days;
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="max-w-[1400px] mx-auto space-y-6"
          >
            <PageHeader
              title="Projects"
              subtitle="Manage client projects, tasks, and milestones"
              icon={FolderKanban}
              iconColor="text-violet-600"
            />

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-white border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                      <FolderKanban className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.total}</p>
                      <p className="text-sm text-slate-500">Total Projects</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                      <p className="text-sm text-slate-500">In Progress</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <FolderKanban className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
                      <p className="text-sm text-slate-500">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">${(stats.totalBudget / 1000).toFixed(0)}K</p>
                      <p className="text-sm text-slate-500">Total Budget</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => { setEditingProject(null); setFormOpen(true); }} className="bg-violet-600 hover:bg-violet-700">
                <Plus className="w-4 h-4 mr-2" />New Project
              </Button>
            </div>

            {/* Projects Grid */}
            {isLoading ? (
              <div className="text-center py-12 text-slate-500">Loading projects...</div>
            ) : filteredProjects.length === 0 ? (
              <Card className="border-slate-200">
                <CardContent className="py-12 text-center">
                  <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No projects found</h3>
                  <p className="text-slate-500 mb-4">Create your first project to get started</p>
                  <Button onClick={() => setFormOpen(true)} className="bg-violet-600 hover:bg-violet-700">
                    <Plus className="w-4 h-4 mr-2" />Create Project
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map((project) => {
                  const daysRemaining = getDaysRemaining(project.end_date);
                  const milestonesCompleted = project.milestones?.filter(m => m.completed).length || 0;
                  const totalMilestones = project.milestones?.length || 0;
                  
                  return (
                    <Card 
                      key={project.id} 
                      className="border-slate-200 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => { setViewingProject(project); setDetailOpen(true); }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 line-clamp-1">{project.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                              <Building2 className="w-3 h-3" />
                              <span className="truncate">{project.customer_name}</span>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="w-8 h-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setViewingProject(project); setDetailOpen(true); }}>
                                <Eye className="w-4 h-4 mr-2" />View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditingProject(project); setFormOpen(true); }}>
                                <Edit className="w-4 h-4 mr-2" />Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={(e) => { e.stopPropagation(); setDeleteConfirm(project); }}>
                                <Trash2 className="w-4 h-4 mr-2" />Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={statusConfig[project.status]?.color}>
                            {statusConfig[project.status]?.label}
                          </Badge>
                          <Badge className={priorityConfig[project.priority]?.color}>
                            {priorityConfig[project.priority]?.label}
                          </Badge>
                        </div>

                        {/* Progress */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-slate-500">Progress</span>
                            <span className="font-medium">{project.progress || 0}%</span>
                          </div>
                          <Progress value={project.progress || 0} className="h-2" />
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {project.budget && (
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                              <span>${project.budget.toLocaleString()}</span>
                            </div>
                          )}
                          {project.end_date && (
                            <div className={`flex items-center gap-1.5 ${daysRemaining < 0 ? 'text-red-600' : daysRemaining < 7 ? 'text-amber-600' : 'text-slate-600'}`}>
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{moment(project.end_date).format('DD MMM')}</span>
                            </div>
                          )}
                          {project.team_members?.length > 0 && (
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              <span>{project.team_members.length} members</span>
                            </div>
                          )}
                          {totalMilestones > 0 && (
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <FolderKanban className="w-3.5 h-3.5 text-slate-400" />
                              <span>{milestonesCompleted}/{totalMilestones} milestones</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </motion.div>
        </main>
      </div>

      <ProjectFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingProject(null); }}
        project={editingProject}
      />

      <ProjectDetailModal
        open={detailOpen}
        onClose={() => { setDetailOpen(false); setViewingProject(null); }}
        project={viewingProject}
        onEdit={(p) => { setDetailOpen(false); setEditingProject(p); setFormOpen(true); }}
      />

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirm?.name}"? This will also delete all associated tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteMutation.mutate(deleteConfirm.id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}