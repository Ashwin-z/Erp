import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutGrid, List, Calendar, BarChart3, Users, Brain,
  Plus, Filter, Search, Settings, ChevronDown, Sparkles,
  ShoppingCart, X, Eye, EyeOff
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ProjectKanban from '@/components/projects/ProjectKanban';
import ProjectGantt from '@/components/projects/ProjectGantt';
import ProjectTimeline from '@/components/projects/ProjectTimeline';
import ProjectDashboardStats from '@/components/projects/ProjectDashboardStats';
import ProjectAICopilot from '@/components/projects/ProjectAICopilot';
import TaskModal from '@/components/projects/TaskModal';
import ProjectFilterPanel from '@/components/projects/ProjectFilterPanel';
import WorkflowModules from '@/components/projects/WorkflowModules';
import moment from 'moment';

// Sample data
const sampleProject = {
  id: 'proj-001',
  project_code: 'PRJ-2024-001',
  name: 'E-Commerce Platform Redesign',
  status: 'in_progress',
  priority: 'high',
  progress: 65,
  budget: 150000,
  actual_cost: 98000,
  start_date: '2024-11-01',
  end_date: '2025-02-28',
  manager: 'Sarah Chen',
  ai_health_score: 72,
  ai_risk_score: 28,
  ai_delay_prediction: 5,
  ai_risk_factors: [
    'Resource constraint in frontend team',
    '3 tasks blocked by external dependencies',
    'Budget utilization at 65%'
  ]
};

const sampleTasks = [
  { id: 't1', task_code: 'PRJ-001', title: 'Design System Setup', status: 'done', priority: 'high', task_type: 'task', assignee: 'john@example.com', assignee_name: 'John Smith', start_date: '2024-11-01', due_date: '2024-11-15', estimated_hours: 40, actual_hours: 38, progress: 100, tags: ['design', 'ui'], order: 0 },
  { id: 't2', task_code: 'PRJ-002', title: 'API Architecture Planning', status: 'done', priority: 'critical', task_type: 'task', assignee: 'sarah@example.com', assignee_name: 'Sarah Chen', start_date: '2024-11-05', due_date: '2024-11-20', estimated_hours: 24, actual_hours: 20, progress: 100, tags: ['backend', 'architecture'], order: 1 },
  { id: 't3', task_code: 'PRJ-003', title: 'User Authentication Module', status: 'in_progress', priority: 'high', task_type: 'feature', assignee: 'mike@example.com', assignee_name: 'Mike Johnson', start_date: '2024-11-15', due_date: '2024-12-10', estimated_hours: 60, actual_hours: 45, progress: 75, tags: ['security', 'backend'], order: 0, dependencies: ['t2'] },
  { id: 't4', task_code: 'PRJ-004', title: 'Product Catalog Frontend', status: 'in_progress', priority: 'medium', task_type: 'feature', assignee: 'john@example.com', assignee_name: 'John Smith', start_date: '2024-11-20', due_date: '2024-12-15', estimated_hours: 48, actual_hours: 30, progress: 60, tags: ['frontend', 'ui'], order: 1 },
  { id: 't5', task_code: 'PRJ-005', title: 'Shopping Cart Integration', status: 'todo', priority: 'high', task_type: 'feature', assignee: 'anna@example.com', assignee_name: 'Anna Lee', start_date: '2024-12-01', due_date: '2024-12-20', estimated_hours: 32, actual_hours: 0, progress: 0, tags: ['frontend', 'integration'], order: 0, dependencies: ['t4'] },
  { id: 't6', task_code: 'PRJ-006', title: 'Payment Gateway Setup', status: 'todo', priority: 'critical', task_type: 'task', assignee: 'sarah@example.com', assignee_name: 'Sarah Chen', start_date: '2024-12-10', due_date: '2024-12-25', estimated_hours: 40, actual_hours: 0, progress: 0, tags: ['payment', 'security'], order: 1, dependencies: ['t3'] },
  { id: 't7', task_code: 'PRJ-007', title: 'Mobile Responsiveness Fix', status: 'blocked', priority: 'medium', task_type: 'bug', assignee: 'john@example.com', assignee_name: 'John Smith', start_date: '2024-12-05', due_date: '2024-12-12', estimated_hours: 16, actual_hours: 8, progress: 50, tags: ['bug', 'mobile'], order: 0, blockers: ['Waiting for design specs'] },
  { id: 't8', task_code: 'PRJ-008', title: 'Order Management System', status: 'backlog', priority: 'high', task_type: 'epic', start_date: '2024-12-20', due_date: '2025-01-15', estimated_hours: 80, actual_hours: 0, progress: 0, tags: ['backend', 'orders'], order: 0 },
  { id: 't9', task_code: 'PRJ-009', title: 'Inventory Sync Module', status: 'backlog', priority: 'medium', task_type: 'feature', start_date: '2025-01-01', due_date: '2025-01-20', estimated_hours: 40, actual_hours: 0, progress: 0, tags: ['integration', 'inventory'], order: 1 },
  { id: 't10', task_code: 'PRJ-010', title: 'Performance Optimization', status: 'review', priority: 'high', task_type: 'task', assignee: 'mike@example.com', assignee_name: 'Mike Johnson', start_date: '2024-12-01', due_date: '2024-12-08', estimated_hours: 24, actual_hours: 22, progress: 90, tags: ['performance'], order: 0 }
];

export default function ProjectHub() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [activeView, setActiveView] = useState('kanban');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState(sampleTasks);
  const [showAI, setShowAI] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    statuses: [],
    priorities: [],
    types: [],
    assignees: [],
    dateRange: null
  });

  // Filter tasks based on active filters
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search filter
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !task.task_code.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      // Status filter
      if (filters.statuses?.length > 0 && !filters.statuses.includes(task.status)) {
        return false;
      }
      // Priority filter
      if (filters.priorities?.length > 0 && !filters.priorities.includes(task.priority)) {
        return false;
      }
      // Type filter
      if (filters.types?.length > 0 && !filters.types.includes(task.task_type)) {
        return false;
      }
      // Assignee filter
      if (filters.assignees?.length > 0) {
        if (filters.assignees.includes('unassigned') && !task.assignee) return true;
        if (!filters.assignees.includes(task.assignee)) return false;
      }
      // Date range filter
      if (filters.dateRange) {
        const dueDate = task.due_date ? moment(task.due_date) : null;
        const today = moment();
        switch (filters.dateRange) {
          case 'overdue':
            if (!dueDate || !dueDate.isBefore(today, 'day')) return false;
            break;
          case 'today':
            if (!dueDate || !dueDate.isSame(today, 'day')) return false;
            break;
          case 'week':
            if (!dueDate || !dueDate.isSame(today, 'week')) return false;
            break;
          case 'month':
            if (!dueDate || !dueDate.isSame(today, 'month')) return false;
            break;
          case 'no_date':
            if (task.due_date) return false;
            break;
        }
      }
      return true;
    });
  }, [tasks, filters]);

  const activeFilterCount = [
    filters.search ? 1 : 0,
    (filters.statuses?.length || 0),
    (filters.priorities?.length || 0),
    (filters.types?.length || 0),
    (filters.assignees?.length || 0),
    filters.dateRange ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  const handleTaskMove = (taskId, newStatus, newIndex) => {
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id === taskId) {
          return { ...t, status: newStatus, order: newIndex };
        }
        return t;
      });
      return updated;
    });
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleAddTask = (status) => {
    setSelectedTask(null);
    setShowTaskModal(true);
  };

  const handleTaskSave = (taskData) => {
    if (selectedTask) {
      setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, ...taskData } : t));
    } else {
      const newTask = {
        ...taskData,
        id: `t${Date.now()}`,
        task_code: `PRJ-${String(tasks.length + 1).padStart(3, '0')}`,
        project_id: sampleProject.id
      };
      setTasks(prev => [...prev, newTask]);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        
        <main className="flex-1 overflow-hidden p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    {sampleProject.name}
                    <Badge className="bg-amber-100 text-amber-700">{sampleProject.status.replace('_', ' ')}</Badge>
                  </h1>
                  <p className="text-slate-500 text-sm">{sampleProject.project_code} • Manager: {sampleProject.manager}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* AI Copilot Toggle */}
                <Button 
                  variant={showAI ? 'default' : 'outline'}
                  onClick={() => setShowAI(!showAI)}
                  className={showAI ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  {showAI ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  <Brain className="w-4 h-4 mr-1" />
                  AI Copilot
                  {showAI && <Badge className="ml-2 bg-white/20 text-white text-[10px]">ON</Badge>}
                </Button>
                
                {/* Filter Toggle */}
                <Button 
                  variant={showFilter ? 'default' : 'outline'}
                  onClick={() => setShowFilter(!showFilter)}
                  className={showFilter ? 'bg-slate-900' : ''}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                  {activeFilterCount > 0 && (
                    <Badge className="ml-2 bg-lime-500">{activeFilterCount}</Badge>
                  )}
                </Button>
                
                <Button className="bg-lime-500 hover:bg-lime-600" onClick={() => handleAddTask('backlog')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </div>

            {/* View Tabs */}
            <Tabs value={activeView} onValueChange={setActiveView} className="flex-1 flex flex-col">
              <TabsList className="mb-4">
                <TabsTrigger value="dashboard">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="kanban">
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  Kanban
                </TabsTrigger>
                <TabsTrigger value="gantt">
                  <List className="w-4 h-4 mr-2" />
                  Gantt
                </TabsTrigger>
                <TabsTrigger value="timeline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="workflows">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Workflows
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 flex gap-4 overflow-hidden">
                {/* Filter Panel */}
                <AnimatePresence>
                  {showFilter && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-shrink-0"
                    >
                      <ProjectFilterPanel
                        filters={filters}
                        onFilterChange={setFilters}
                        onClose={() => setShowFilter(false)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Main Content */}
                <div className="flex-1 overflow-auto">
                  <TabsContent value="dashboard" className="h-full m-0">
                    <ProjectDashboardStats project={sampleProject} tasks={filteredTasks} />
                  </TabsContent>

                  <TabsContent value="kanban" className="h-full m-0">
                    <ProjectKanban 
                      tasks={filteredTasks}
                      onTaskMove={handleTaskMove}
                      onTaskClick={handleTaskClick}
                      onAddTask={handleAddTask}
                    />
                  </TabsContent>

                  <TabsContent value="gantt" className="h-full m-0">
                    <ProjectGantt 
                      tasks={filteredTasks}
                      project={sampleProject}
                      onTaskClick={handleTaskClick}
                    />
                  </TabsContent>

                  <TabsContent value="timeline" className="h-full m-0">
                    <ProjectTimeline 
                      tasks={filteredTasks}
                      onTaskClick={handleTaskClick}
                    />
                  </TabsContent>

                  <TabsContent value="workflows" className="h-full m-0">
                    <WorkflowModules />
                  </TabsContent>
                </div>

                {/* AI Sidebar - Toggle On/Off */}
                <AnimatePresence>
                  {showAI && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="w-96 flex-shrink-0"
                    >
                      <ProjectAICopilot project={sampleProject} tasks={filteredTasks} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Tabs>
          </motion.div>
        </main>
      </div>

      {/* Task Modal */}
      <TaskModal
        open={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        task={selectedTask}
        onSave={handleTaskSave}
        allTasks={tasks}
      />
    </div>
  );
}