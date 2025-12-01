import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2, User, LayoutGrid, Calendar, Brain, 
  Plus, Settings, Users, ArrowRight, Bell
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import CompanyCalendarView from '@/components/schedule/CompanyCalendarView';
import PersonalCalendarView from '@/components/schedule/PersonalCalendarView';
import ScheduleKanban from '@/components/schedule/ScheduleKanban';
import LeaveDelegationPanel from '@/components/schedule/LeaveDelegationPanel';
import ScheduleAIAssistant from '@/components/schedule/ScheduleAIAssistant';
import SharingPermissionsModal from '@/components/schedule/SharingPermissionsModal';

// Sample events
const sampleEvents = [
  { id: 'e1', title: 'Team Standup', event_type: 'meeting', category: 'work', start_time: '2024-12-16T09:00:00', end_time: '2024-12-16T09:30:00', is_private: false },
  { id: 'e2', title: 'Project Review', event_type: 'meeting', category: 'work', start_time: '2024-12-16T14:00:00', end_time: '2024-12-16T15:00:00', is_private: false },
  { id: 'e3', title: 'Doctor Appointment', event_type: 'personal', category: 'personal', start_time: '2024-12-17T10:00:00', end_time: '2024-12-17T11:00:00', is_private: true },
  { id: 'e4', title: 'Sprint Planning', event_type: 'meeting', category: 'work', start_time: '2024-12-18T10:00:00', end_time: '2024-12-18T12:00:00', is_private: false },
  { id: 'e5', title: 'API Deadline', event_type: 'deadline', category: 'project', start_time: '2024-12-20T00:00:00', end_time: '2024-12-20T23:59:00', is_private: false },
  { id: 'e6', title: 'Christmas Holiday', event_type: 'holiday', category: 'company', start_time: '2024-12-25T00:00:00', end_time: '2024-12-25T23:59:00', is_private: false },
  { id: 'e7', title: 'Annual Leave', event_type: 'leave', category: 'leave', start_time: '2024-12-26T00:00:00', end_time: '2024-12-27T23:59:00', is_private: false }
];

// Sample tasks
const sampleTasks = [
  { id: 'st1', task_code: 'TSK-001', title: 'Complete API Documentation', status: 'in_progress', priority: 'high', task_type: 'task', assignee_name: 'John Smith', due_date: '2024-12-20', progress: 60, ai_scheduled: true },
  { id: 'st2', task_code: 'TSK-002', title: 'Review Pull Requests', status: 'todo', priority: 'medium', task_type: 'task', assignee_name: 'Sarah Chen', due_date: '2024-12-18', progress: 0 },
  { id: 'st3', task_code: 'TKT-001', title: 'Login Issue - Customer Portal', status: 'in_progress', priority: 'urgent', task_type: 'ticket', assignee_name: 'Mike Johnson', due_date: '2024-12-16', progress: 30 },
  { id: 'st4', task_code: 'TSK-003', title: 'Client Meeting Preparation', status: 'todo', priority: 'high', task_type: 'meeting', assignee_name: 'Anna Lee', due_date: '2024-12-17', progress: 0 },
  { id: 'st5', task_code: 'TSK-004', title: 'Database Optimization', status: 'backlog', priority: 'medium', task_type: 'task', due_date: '2024-12-25', progress: 0 },
  { id: 'st6', task_code: 'TSK-005', title: 'User Testing Session', status: 'review', priority: 'high', task_type: 'task', assignee_name: 'John Smith', due_date: '2024-12-19', progress: 90 },
  { id: 'st7', task_code: 'DEL-001', title: 'Quarterly Report', status: 'delegated', priority: 'high', task_type: 'deadline', assignee_name: 'Sarah Chen', due_date: '2024-12-22', progress: 0, is_delegated: true }
];

export default function ARKSchedule() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [activeView, setActiveView] = useState('personal');
  const [showSharingModal, setShowSharingModal] = useState(false);
  const [showAI, setShowAI] = useState(true);
  const [events, setEvents] = useState(sampleEvents);
  const [tasks, setTasks] = useState(sampleTasks);

  const handleTaskMove = (taskId, newStatus, newIndex) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: newStatus, order: newIndex } : t
    ));
  };

  const handleEventClick = (event) => {
    console.log('Event clicked:', event);
  };

  const handleTaskClick = (task) => {
    console.log('Task clicked:', task);
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
              <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  ARKSchedule
                  <Badge className="bg-lime-100 text-lime-700">AI-Powered</Badge>
                </h1>
                <p className="text-slate-500 text-sm">Next-Gen Calendar, Tasks & Delegation System</p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant={showAI ? 'default' : 'outline'}
                  onClick={() => setShowAI(!showAI)}
                  className={showAI ? 'bg-lime-500 hover:bg-lime-600' : ''}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  AI Assistant
                </Button>
                <Button variant="outline" onClick={() => setShowSharingModal(true)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Sharing
                </Button>
                <Button className="bg-slate-900 hover:bg-slate-800">
                  <Plus className="w-4 h-4 mr-2" />
                  New Event
                </Button>
              </div>
            </div>

            {/* Main Tabs */}
            <Tabs value={activeView} onValueChange={setActiveView} className="flex-1 flex flex-col">
              <TabsList className="mb-4">
                <TabsTrigger value="personal">
                  <User className="w-4 h-4 mr-2" />
                  My Calendar
                </TabsTrigger>
                <TabsTrigger value="company">
                  <Building2 className="w-4 h-4 mr-2" />
                  Company View
                </TabsTrigger>
                <TabsTrigger value="kanban">
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  Tasks Board
                </TabsTrigger>
                <TabsTrigger value="delegation">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Delegation
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 flex gap-4 overflow-hidden">
                {/* Main Content */}
                <div className="flex-1 overflow-auto">
                  <TabsContent value="personal" className="h-full m-0">
                    <PersonalCalendarView 
                      events={events}
                      onEventClick={handleEventClick}
                      onSharingChange={() => setShowSharingModal(true)}
                    />
                  </TabsContent>

                  <TabsContent value="company" className="h-full m-0">
                    <CompanyCalendarView 
                      events={events}
                      onEventClick={handleEventClick}
                    />
                  </TabsContent>

                  <TabsContent value="kanban" className="h-full m-0">
                    <ScheduleKanban 
                      tasks={tasks}
                      onTaskMove={handleTaskMove}
                      onTaskClick={handleTaskClick}
                    />
                  </TabsContent>

                  <TabsContent value="delegation" className="h-full m-0 overflow-auto">
                    <LeaveDelegationPanel 
                      aiSuggestion={{ email: 'mike@example.com', name: 'Mike Johnson', workload: 45 }}
                    />
                  </TabsContent>
                </div>

                {/* AI Sidebar */}
                {showAI && activeView !== 'delegation' && (
                  <div className="w-96 flex-shrink-0">
                    <ScheduleAIAssistant tasks={tasks} events={events} />
                  </div>
                )}
              </div>
            </Tabs>
          </motion.div>
        </main>
      </div>

      {/* Sharing Modal */}
      <SharingPermissionsModal
        open={showSharingModal}
        onClose={() => setShowSharingModal(false)}
        onSave={(settings) => console.log('Saved settings:', settings)}
      />
    </div>
  );
}