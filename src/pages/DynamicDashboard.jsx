import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Building2, User, Plus, Settings, Lock, Share2, 
  LayoutGrid, Moon, Sun, Sparkles, GripVertical, Maximize2, Minimize2, Trash2
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardFilterBar from '@/components/dashboard/DashboardFilterBar';
import KPIWidget from '@/components/dashboard/widgets/KPIWidget';
import ChartWidget from '@/components/dashboard/widgets/ChartWidget';
import AIInsightsWidget from '@/components/dashboard/widgets/AIInsightsWidget';
import TasksTableWidget from '@/components/dashboard/widgets/TasksTableWidget';
import WidgetShareModal from '@/components/dashboard/WidgetShareModal';
import { toast } from 'sonner';

// Sample widgets
const sampleWidgets = [
  { id: 'w1', widget_type: 'kpi', title: 'Active Projects', visibility: 'private', data: { value: 12, trend: 8, target: 15 }, position: { w: 1 } },
  { id: 'w2', widget_type: 'kpi', title: 'Tasks Completed', visibility: 'team', data: { value: 84, trend: 15, target: 100 }, position: { w: 1 } },
  { id: 'w3', widget_type: 'kpi', title: 'Revenue (SGD)', visibility: 'private', data: { value: 128500, trend: 12, target: 150000 }, position: { w: 1 } },
  { id: 'w4', widget_type: 'kpi', title: 'Team Members', visibility: 'company', data: { value: 24, trend: 4 }, position: { w: 1 } },
  { id: 'w5', widget_type: 'line_chart', title: 'Weekly Progress', visibility: 'private', data: {}, position: { w: 2 } },
  { id: 'w6', widget_type: 'bar_chart', title: 'Tasks by Status', visibility: 'team', data: {}, position: { w: 1 } },
  { id: 'w7', widget_type: 'ai_insights', title: 'AI Insights', visibility: 'private', data: {}, position: { w: 1 } },
  { id: 'w8', widget_type: 'tasks_table', title: 'My Tasks', visibility: 'private', data: {}, position: { w: 2 } },
  { id: 'w9', widget_type: 'donut_chart', title: 'Budget Allocation', visibility: 'department', data: {}, position: { w: 2 } }
];

const availableWidgets = [
  { id: 'new_kpi_1', widget_type: 'kpi', title: 'Pending Approvals', data: { value: 5, trend: -2 }, position: { w: 1 } },
  { id: 'new_chart_1', widget_type: 'bar_chart', title: 'Sales by Region', data: {}, position: { w: 2 } },
  { id: 'new_chart_2', widget_type: 'line_chart', title: 'Website Traffic', data: {}, position: { w: 2 } },
  { id: 'new_ai_1', widget_type: 'ai_insights', title: 'Risk Analysis', data: {}, position: { w: 1 } },
  { id: 'new_heat_1', widget_type: 'heatmap', title: 'User Activity Heatmap', data: {}, position: { w: 2 } },
  { id: 'new_funnel_1', widget_type: 'funnel', title: 'Conversion Funnel', data: {}, position: { w: 2 } },
];

const companyWidgets = [
  { id: 'cw1', widget_type: 'kpi', title: 'Total Revenue', visibility: 'company', data: { value: 1250000, trend: 18, target: 1500000 }, position: { x: 0, y: 0, w: 1, h: 1 } },
  { id: 'cw2', widget_type: 'kpi', title: 'Active Employees', visibility: 'company', data: { value: 156, trend: 5 }, position: { x: 1, y: 0, w: 1, h: 1 } },
  { id: 'cw3', widget_type: 'kpi', title: 'Open Tickets', visibility: 'company', data: { value: 23, trend: -12 }, position: { x: 2, y: 0, w: 1, h: 1 } },
  { id: 'cw4', widget_type: 'kpi', title: 'Project Health', visibility: 'company', data: { value: 87, trend: 3 }, position: { x: 3, y: 0, w: 1, h: 1 } },
  { id: 'cw5', widget_type: 'line_chart', title: 'Company Performance', visibility: 'company', data: {}, position: { x: 0, y: 1, w: 2, h: 1 } },
  { id: 'cw6', widget_type: 'ai_insights', title: 'Company AI Insights', visibility: 'company', data: {}, position: { x: 2, y: 1, w: 2, h: 1 } }
];

export default function DynamicDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [dashboardType, setDashboardType] = useState('user');
  const [darkMode, setDarkMode] = useState(false);
  const [filters, setFilters] = useState({
    level: 'user',
    department: '',
    team: '',
    project: '',
    dateRange: 'month'
  });
  const [shareModal, setShareModal] = useState({ open: false, widget: null });
  const [layouts, setLayouts] = useState({
    'Default': sampleWidgets,
    'Finance View': sampleWidgets.filter(w => w.title.includes('Revenue') || w.title.includes('Budget')),
    'Daily Overview': sampleWidgets.filter(w => w.widget_type === 'kpi' || w.widget_type === 'tasks_table')
  });
  const [activeLayout, setActiveLayout] = useState('Default');
  const [widgets, setWidgets] = useState(layouts['Default']);
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  const [suggesting, setSuggesting] = useState(false);

  // Switch layout
  const switchLayout = (layoutName) => {
    setActiveLayout(layoutName);
    setWidgets(layouts[layoutName]);
    toast.success(`Switched to ${layoutName} layout`);
  };

  // Save current layout
  const saveLayout = () => {
    setLayouts(prev => ({ ...prev, [activeLayout]: widgets }));
    toast.success("Layout saved!");
  };

  const currentWidgets = dashboardType === 'company' ? companyWidgets : widgets;

  // Handle Drag End
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    if (dashboardType === 'company') return; // Disable reorder for company view for now

    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWidgets(items);
  };

  // Toggle Widget Size
  const toggleWidgetSize = (id) => {
    if (dashboardType === 'company') return;
    setWidgets(widgets.map(w => {
      if (w.id === id) {
        return { ...w, position: { ...w.position, w: w.position.w === 1 ? 2 : 1 } };
      }
      return w;
    }));
  };

  // Remove Widget
  const removeWidget = (id) => {
    if (dashboardType === 'company') return;
    setWidgets(widgets.filter(w => w.id !== id));
    toast.success("Widget removed");
  };

  // Add Widget Logic
  const addWidget = (widgetTemplate) => {
    const newWidget = {
      ...widgetTemplate,
      id: `w_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    setWidgets([...widgets, newWidget]);
    setIsAddWidgetOpen(false);
    toast.success("Widget added to dashboard");
  };

  // AI Suggestion Logic
  const suggestWidgets = () => {
    setSuggesting(true);
    setTimeout(() => {
      // Mock learning from user activity
      const userRole = "Manager"; // Mock
      let relevantWidgets = availableWidgets;
      
      if (userRole === "Manager") {
         relevantWidgets = availableWidgets.filter(w => w.widget_type === 'kpi' || w.widget_type === 'ai_insights');
      }
      
      const suggested = relevantWidgets[Math.floor(Math.random() * relevantWidgets.length)];
      addWidget(suggested);
      setSuggesting(false);
      toast.success(`AI suggested "${suggested.title}" based on your ${userRole} role pattern.`);
    }, 1500);
  };

  const renderWidget = (widget, isDragging = false) => {
    const props = { widget, onShare: () => setShareModal({ open: true, widget }) };
    let component;
    
    switch (widget.widget_type) {
      case 'kpi': component = <KPIWidget {...props} />; break;
      case 'line_chart':
      case 'bar_chart':
      case 'pie_chart':
      case 'donut_chart': component = <ChartWidget {...props} />; break;
      case 'ai_insights': component = <AIInsightsWidget {...props} />; break;
      case 'tasks_table': component = <TasksTableWidget {...props} />; break;
      case 'heatmap': 
        component = (
          <div className="bg-slate-800 p-4 rounded h-full flex items-center justify-center text-slate-400">
             <div className="text-center">
               <LayoutGrid className="w-8 h-8 mx-auto mb-2 opacity-50" />
               Heatmap Visualization
             </div>
          </div>
        ); 
        break;
      case 'funnel':
        component = (
          <div className="bg-slate-800 p-4 rounded h-full flex items-center justify-center text-slate-400">
             <div className="text-center">
               <LayoutGrid className="w-8 h-8 mx-auto mb-2 opacity-50" />
               Sales Funnel
             </div>
          </div>
        );
        break;
      default: component = <KPIWidget {...props} />;
    }

    return (
      <div className={`relative h-full group ${isDragging ? 'opacity-80 ring-2 ring-lime-500 rounded-lg' : ''}`}>
        {/* Widget Controls Overlay */}
        {dashboardType === 'user' && (
          <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/50 rounded p-1 backdrop-blur-sm">
             <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-white/20" onClick={() => toggleWidgetSize(widget.id)}>
               {widget.position.w === 1 ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
             </Button>
             <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-red-500/50" onClick={() => removeWidget(widget.id)}>
               <Trash2 className="w-3 h-3" />
             </Button>
          </div>
        )}
        <div className="h-full pointer-events-none">
           {/* Disable interaction while dragging or in view mode to prevent clicks inside widgets */}
           <div className="pointer-events-auto h-full">
              {component}
           </div>
        </div>
      </div>
    );
  };

  const handleWidgetShare = (settings) => {
    setWidgets(prev => prev.map(w => 
      w.id === shareModal.widget?.id 
        ? { ...w, ...settings }
        : w
    ));
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        
        <main className="flex-1 overflow-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
                  Dynamic Dashboard
                  <Badge className="bg-lime-100 text-lime-700">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Smart
                  </Badge>
                </h1>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {dashboardType === 'company' ? 'Company-wide view' : 'Your personal dashboard (private by default)'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
                <div className="flex gap-2 items-center bg-slate-200 dark:bg-slate-800 p-1 rounded-md mr-2">
                  {Object.keys(layouts).map(l => (
                    <button
                      key={l}
                      onClick={() => switchLayout(l)}
                      className={`px-2 py-1 text-xs rounded ${activeLayout === l ? 'bg-white dark:bg-slate-600 shadow' : 'text-slate-500'}`}
                    >
                      {l}
                    </button>
                  ))}
                  <Button size="icon" variant="ghost" className="h-6 w-6 ml-1" onClick={saveLayout} title="Save Layout">
                    <Share2 className="w-3 h-3" />
                  </Button>
                </div>
                <Dialog open={isAddWidgetOpen} onOpenChange={setIsAddWidgetOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-lime-500 hover:bg-lime-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Widget
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 text-white border-slate-800">
                    <DialogHeader>
                      <DialogTitle>Add Widgets to Dashboard</DialogTitle>
                      <DialogDescription className="text-slate-400">Choose from available widgets or let AI suggest one for you.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <Button 
                        variant="outline" 
                        className="w-full border-lime-500/50 text-lime-400 hover:bg-lime-500/10"
                        onClick={suggestWidgets}
                        disabled={suggesting}
                      >
                        <Sparkles className={`w-4 h-4 mr-2 ${suggesting ? 'animate-spin' : ''}`} />
                        {suggesting ? 'AI is analyzing your workflow...' : 'AI Suggest Widget'}
                      </Button>
                      <div className="grid grid-cols-2 gap-3">
                        {availableWidgets.map(w => (
                          <div key={w.id} className="p-3 border border-slate-700 rounded-lg hover:border-lime-500 cursor-pointer transition-all" onClick={() => addWidget(w)}>
                             <div className="font-bold text-sm mb-1">{w.title}</div>
                             <Badge variant="outline" className="text-[10px]">{w.widget_type}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Dashboard Type Tabs */}
            <Tabs value={dashboardType} onValueChange={setDashboardType} className="mb-4">
              <TabsList>
                <TabsTrigger value="user">
                  <User className="w-4 h-4 mr-2" />
                  My Dashboard
                  <Lock className="w-3 h-3 ml-2 text-slate-400" />
                </TabsTrigger>
                <TabsTrigger value="company">
                  <Building2 className="w-4 h-4 mr-2" />
                  Company Dashboard
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Filters */}
            <DashboardFilterBar
              filters={filters}
              onFilterChange={setFilters}
              presets={[
                { id: 'daily', name: 'My Daily View' },
                { id: 'team', name: 'Team Overview' },
                { id: 'finance', name: 'Finance Summary' }
              ]}
              onSavePreset={() => console.log('Save preset')}
              onLoadPreset={(id) => console.log('Load preset:', id)}
            />

            {/* Privacy Notice */}
            {dashboardType === 'user' && (
              <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg flex items-center gap-3">
                <Lock className="w-5 h-5 text-purple-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-purple-900">Private Dashboard</p>
                  <p className="text-xs text-purple-600">Only you can see your personal widgets. Share individual widgets by clicking the share icon.</p>
                </div>
                <Button variant="outline" size="sm">
                  <Share2 className="w-3 h-3 mr-1" />
                  Manage Sharing
                </Button>
              </div>
            )}

            {/* Widgets Grid */}
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="dashboard-widgets" direction="horizontal">
                {(provided) => (
                  <div 
                    className="mt-6 grid grid-cols-4 gap-4"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {currentWidgets.map((widget, index) => (
                      <Draggable 
                        key={widget.id} 
                        draggableId={widget.id} 
                        index={index}
                        isDragDisabled={dashboardType === 'company'}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`${
                              widget.position?.w === 2 ? 'col-span-2' : 'col-span-1'
                            } bg-transparent`} // Transparent bg to let widget style take over
                            style={{ 
                              minHeight: 180,
                              ...provided.draggableProps.style 
                            }}
                          >
                            <div className="h-full flex flex-col">
                              {/* Drag Handle - Only show in User mode */}
                              {dashboardType === 'user' && (
                                <div 
                                  {...provided.dragHandleProps}
                                  className="h-2 w-full cursor-move hover:bg-slate-500/20 rounded-t-lg transition-colors mb-1 flex justify-center items-center opacity-0 hover:opacity-100"
                                >
                                  <div className="w-8 h-1 bg-slate-400/50 rounded-full" />
                                </div>
                              )}
                              
                              {renderWidget(widget, snapshot.isDragging)}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </motion.div>
        </main>
      </div>

      {/* Share Modal */}
      <WidgetShareModal
        open={shareModal.open}
        onClose={() => setShareModal({ open: false, widget: null })}
        widget={shareModal.widget}
        onSave={handleWidgetShare}
      />
    </div>
  );
}