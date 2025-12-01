import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText, Plus, Trash2, GripVertical, BarChart3, PieChart, LineChart,
  Table2, Type, Image, ArrowUp, ArrowDown, CheckCircle2, Settings,
  ChevronRight, ChevronDown, Layers, Save, FolderOpen, Copy, Eye,
  Database, Columns, Filter, SortAsc
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog as WidgetDialog, DialogContent as WidgetDialogContent, DialogHeader as WidgetDialogHeader, DialogTitle as WidgetDialogTitle } from "@/components/ui/dialog";
import AIReportInsights from './AIReportInsights';
import ReportVersioning from './ReportVersioning';

const widgetTypes = [
  { id: 'text', label: 'Text Block', icon: Type, description: 'Add headings or paragraphs' },
  { id: 'table', label: 'Data Table', icon: Table2, description: 'Display tabular data' },
  { id: 'bar-chart', label: 'Bar Chart', icon: BarChart3, description: 'Compare values across categories' },
  { id: 'line-chart', label: 'Line Chart', icon: LineChart, description: 'Show trends over time' },
  { id: 'pie-chart', label: 'Pie Chart', icon: PieChart, description: 'Show proportions' },
  { id: 'kpi', label: 'KPI Card', icon: BarChart3, description: 'Highlight key metrics' },
  { id: 'image', label: 'Image/Logo', icon: Image, description: 'Add company branding' }
];

const dataSources = [
  { id: 'rvu', label: 'RVU Records', fields: ['rvu_amount', 'activity_type', 'status', 'company_name', 'timestamp', 'tier_multiplier', 'base_amount', 'currency'] },
  { id: 'wallets', label: 'Wallet Transactions', fields: ['amount', 'type', 'status', 'wallet_name', 'timestamp', 'balance_before', 'balance_after', 'category'] },
  { id: 'memberships', label: 'Memberships', fields: ['tier', 'status', 'company_name', 'total_rvus', 'created_date', 'kyc_status', 'renewal_date'] },
  { id: 'distributions', label: 'Distributions', fields: ['amount', 'rvu_value', 'participant_count', 'period', 'status', 'pool_amount', 'distributed_at'] },
  { id: 'fraud', label: 'Fraud Alerts', fields: ['risk_score', 'status', 'company', 'amount', 'reason', 'ai_score', 'timestamp'] },
  { id: 'ai_performance', label: 'AI Performance', fields: ['module', 'accuracy', 'latency', 'predictions', 'model_version', 'timestamp'] },
  { id: 'partners', label: 'Partner Integrations', fields: ['name', 'type', 'status', 'uptime', 'tx_volume', 'error_rate'] }
];

const savedTemplates = [
  { id: 'tpl-1', name: 'Monthly RWA Summary', description: 'Standard monthly report', sections: 3, lastModified: '2024-11-25' },
  { id: 'tpl-2', name: 'Executive Dashboard', description: 'High-level KPIs for leadership', sections: 2, lastModified: '2024-11-20' },
  { id: 'tpl-3', name: 'Compliance Report', description: 'Fraud and audit metrics', sections: 4, lastModified: '2024-11-18' }
];

export default function ReportBuilder({ open, onClose, onSave }) {
  const [reportConfig, setReportConfig] = useState({
    name: '',
    description: '',
    sections: [
      {
        id: 'section-1',
        title: 'Executive Summary',
        expanded: true,
        level: 0,
        widgets: [
          { id: 'widget-1', type: 'text', config: { content: 'Report Summary', style: 'heading' } }
        ],
        subsections: []
      }
    ]
  });

  const [selectedSection, setSelectedSection] = useState('section-1');
  const [widgetConfigModal, setWidgetConfigModal] = useState(null);
  const [templateModal, setTemplateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('structure');

  const addSection = (parentId = null) => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: parentId ? 'New Subsection' : 'New Section',
      expanded: true,
      level: parentId ? 1 : 0,
      widgets: [],
      subsections: []
    };
    
    if (parentId) {
      setReportConfig(prev => ({
        ...prev,
        sections: prev.sections.map(s => 
          s.id === parentId 
            ? { ...s, subsections: [...(s.subsections || []), newSection] }
            : s
        )
      }));
    } else {
      setReportConfig(prev => ({
        ...prev,
        sections: [...prev.sections, newSection]
      }));
    }
  };

  const addSubsection = (parentId) => {
    addSection(parentId);
  };

  const loadTemplate = (template) => {
    // Simulate loading a template
    setReportConfig({
      name: template.name,
      description: template.description,
      sections: [
        { id: 'section-1', title: 'Overview', expanded: true, level: 0, widgets: [{ id: 'w1', type: 'kpi', config: {} }], subsections: [] },
        { id: 'section-2', title: 'Details', expanded: true, level: 0, widgets: [], subsections: [
          { id: 'section-2-1', title: 'Performance', expanded: true, level: 1, widgets: [{ id: 'w2', type: 'line-chart', config: {} }], subsections: [] }
        ] }
      ]
    });
    setTemplateModal(false);
    toast.success(`Template "${template.name}" loaded`);
  };

  const duplicateSection = (sectionId) => {
    const section = reportConfig.sections.find(s => s.id === sectionId);
    if (section) {
      const newSection = {
        ...section,
        id: `section-${Date.now()}`,
        title: `${section.title} (Copy)`,
        widgets: section.widgets.map(w => ({ ...w, id: `widget-${Date.now()}-${Math.random()}` }))
      };
      setReportConfig(prev => ({
        ...prev,
        sections: [...prev.sections, newSection]
      }));
      toast.success('Section duplicated');
    }
  };

  const addWidget = (type, openConfig = false) => {
    const newWidget = {
      id: `widget-${Date.now()}`,
      type,
      config: getDefaultWidgetConfig(type)
    };
    setReportConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === selectedSection 
          ? { ...s, widgets: [...s.widgets, newWidget] }
          : { ...s, subsections: (s.subsections || []).map(sub => 
              sub.id === selectedSection 
                ? { ...sub, widgets: [...sub.widgets, newWidget] }
                : sub
            )}
      )
    }));
    if (openConfig) {
      setWidgetConfigModal(newWidget);
    }
  };

  const updateWidgetConfig = (widgetId, newConfig) => {
    setReportConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s => ({
        ...s,
        widgets: s.widgets.map(w => w.id === widgetId ? { ...w, config: { ...w.config, ...newConfig } } : w),
        subsections: (s.subsections || []).map(sub => ({
          ...sub,
          widgets: sub.widgets.map(w => w.id === widgetId ? { ...w, config: { ...w.config, ...newConfig } } : w)
        }))
      }))
    }));
  };

  const getDefaultWidgetConfig = (type) => {
    switch (type) {
      case 'text': return { content: '', style: 'paragraph' };
      case 'table': return { dataSource: 'rvu', columns: ['company_name', 'rvu_amount', 'status'], limit: 10 };
      case 'bar-chart': return { dataSource: 'rvu', xAxis: 'activity_type', yAxis: 'rvu_amount', aggregation: 'sum' };
      case 'line-chart': return { dataSource: 'rvu', xAxis: 'timestamp', yAxis: 'rvu_amount', aggregation: 'sum', groupBy: 'day' };
      case 'pie-chart': return { dataSource: 'memberships', field: 'tier', valueField: 'count' };
      case 'kpi': return { dataSource: 'rvu', metric: 'total', field: 'rvu_amount', label: 'Total RVUs' };
      default: return {};
    }
  };

  const removeWidget = (sectionId, widgetId) => {
    setReportConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId 
          ? { ...s, widgets: s.widgets.filter(w => w.id !== widgetId) }
          : s
      )
    }));
  };

  const removeSection = (sectionId) => {
    setReportConfig(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId)
    }));
  };

  const toggleSection = (sectionId) => {
    setReportConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId ? { ...s, expanded: !s.expanded } : s
      )
    }));
  };

  const handleSave = () => {
    if (!reportConfig.name) {
      toast.error('Please enter a report name');
      return;
    }
    onSave?.(reportConfig);
    toast.success('Report template saved');
    onClose();
  };

  const renderSectionWithSubsections = (section, depth = 0) => (
    <Card key={section.id} className={`bg-slate-800/50 border-slate-700 ${depth > 0 ? 'ml-4 border-l-2 border-l-amber-500/30' : ''}`}>
      <div 
        className={`flex items-center justify-between p-3 cursor-pointer ${selectedSection === section.id ? 'bg-amber-500/10' : ''}`}
        onClick={() => setSelectedSection(section.id)}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-slate-500" />
          <button onClick={(e) => { e.stopPropagation(); toggleSection(section.id); }}>
            {section.expanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </button>
          <Input
            className="bg-transparent border-none h-auto p-0 text-white font-medium focus-visible:ring-0"
            value={section.title}
            onChange={(e) => setReportConfig(prev => ({
              ...prev,
              sections: prev.sections.map(s => s.id === section.id ? { ...s, title: e.target.value } : s)
            }))}
            onClick={(e) => e.stopPropagation()}
          />
          {depth === 0 && <Badge className="bg-slate-600 text-slate-300 text-xs">Level {depth + 1}</Badge>}
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-slate-700 text-slate-300">{section.widgets.length} widgets</Badge>
          {depth === 0 && (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); addSubsection(section.id); }} title="Add subsection">
              <Plus className="w-3 h-3 text-blue-400" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); duplicateSection(section.id); }} title="Duplicate">
            <Copy className="w-3 h-3 text-slate-400" />
          </Button>
          {reportConfig.sections.length > 1 && (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); removeSection(section.id); }}>
              <Trash2 className="w-3 h-3 text-red-400" />
            </Button>
          )}
        </div>
      </div>

      {section.expanded && (
        <CardContent className="pt-0 pb-3 space-y-2">
          {section.widgets.map((widget) => {
            const WidgetIcon = widgetTypes.find(w => w.id === widget.type)?.icon || FileText;
            return (
              <div key={widget.id} className="flex items-center gap-2 p-2 bg-slate-700/50 rounded-lg group">
                <GripVertical className="w-4 h-4 text-slate-500" />
                <WidgetIcon className="w-4 h-4 text-amber-400" />
                <span className="text-slate-300 text-sm flex-1">{widgetTypes.find(w => w.id === widget.type)?.label}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => setWidgetConfigModal(widget)}>
                  <Settings className="w-3 h-3 text-blue-400" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => removeWidget(section.id, widget.id)}>
                  <Trash2 className="w-3 h-3 text-red-400" />
                </Button>
              </div>
            );
          })}
          <Button 
            size="sm" 
            variant="ghost" 
            className="w-full border border-dashed border-slate-600 text-slate-400"
            onClick={() => setSelectedSection(section.id)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Widget
          </Button>

          {/* Render subsections */}
          {(section.subsections || []).map(sub => renderSectionWithSubsections(sub, depth + 1))}
        </CardContent>
      )}
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              Report Builder
            </DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-slate-600" onClick={() => setTemplateModal(true)}>
                <FolderOpen className="w-4 h-4 mr-1" />
                Load Template
              </Button>
              <Button variant="outline" size="sm" className="border-slate-600">
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-[600px] overflow-hidden">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="data">Data Sources</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="structure" className="h-[550px] overflow-hidden mt-4">
            <div className="grid md:grid-cols-3 gap-4 h-full overflow-hidden">
              {/* Left Panel - Report Structure */}
              <div className="md:col-span-2 overflow-y-auto space-y-4 pr-2">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Report Name</Label>
                    <Input 
                      placeholder="e.g., Monthly RWA Performance Report"
                      className="bg-slate-800 border-slate-700"
                      value={reportConfig.name}
                      onChange={(e) => setReportConfig({ ...reportConfig, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      placeholder="Brief description of the report..."
                      className="bg-slate-800 border-slate-700 h-16"
                      value={reportConfig.description}
                      onChange={(e) => setReportConfig({ ...reportConfig, description: e.target.value })}
                    />
                  </div>
                </div>

                {/* Sections */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">Report Sections (Multi-level)</Label>
                    <Button size="sm" variant="outline" className="border-slate-700" onClick={() => addSection()}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Section
                    </Button>
                  </div>

                  {reportConfig.sections.map((section) => renderSectionWithSubsections(section))}
                </div>
              </div>

              {/* Right Panel - Widget Library */}
              <div className="bg-slate-800/50 rounded-xl p-4 overflow-y-auto">
                <h3 className="text-white font-medium mb-3">Widget Library</h3>
                <p className="text-slate-500 text-xs mb-3">Click to add to selected section</p>
                <div className="space-y-2">
                  {widgetTypes.map((widget) => {
                    const WidgetIcon = widget.icon;
                    return (
                      <div
                        key={widget.id}
                        className="p-3 rounded-lg border border-slate-700 hover:border-amber-500/50 cursor-pointer transition-colors group"
                        onClick={() => addWidget(widget.id, true)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <WidgetIcon className="w-4 h-4 text-amber-400" />
                          <span className="text-white text-sm font-medium">{widget.label}</span>
                          <Settings className="w-3 h-3 text-slate-500 ml-auto opacity-0 group-hover:opacity-100" />
                        </div>
                        <p className="text-slate-500 text-xs">{widget.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Data Sources Tab */}
          <TabsContent value="data" className="h-[550px] overflow-y-auto mt-4">
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-xl p-4">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Database className="w-5 h-5 text-cyan-400" />
                  Available Data Sources
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {dataSources.map((source) => (
                    <div key={source.id} className="p-4 rounded-lg bg-slate-700/50 border border-slate-600">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-white font-medium">{source.label}</p>
                        <Badge className="bg-cyan-500/20 text-cyan-400">{source.fields.length} fields</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {source.fields.map((field) => (
                          <Badge key={field} className="bg-slate-600 text-slate-300 text-xs cursor-pointer hover:bg-slate-500">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-violet-400" />
                  Global Filters
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <Select defaultValue="last30">
                      <SelectTrigger className="bg-slate-800 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="last7">Last 7 days</SelectItem>
                        <SelectItem value="last30">Last 30 days</SelectItem>
                        <SelectItem value="last90">Last 90 days</SelectItem>
                        <SelectItem value="custom">Custom range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Company Filter</Label>
                    <Select defaultValue="all">
                      <SelectTrigger className="bg-slate-800 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="all">All Companies</SelectItem>
                        <SelectItem value="selected">Selected Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status Filter</Label>
                    <Select defaultValue="all">
                      <SelectTrigger className="bg-slate-800 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active Only</SelectItem>
                        <SelectItem value="completed">Completed Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="h-[550px] overflow-y-auto mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <h3 className="text-white font-medium mb-3">Report Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white">Include Table of Contents</p>
                        <p className="text-slate-500 text-sm">Auto-generate TOC from sections</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white">Include Page Numbers</p>
                        <p className="text-slate-500 text-sm">Add page numbers to PDF output</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white">Include Company Logo</p>
                        <p className="text-slate-500 text-sm">Add logo to report header</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white">Include Generated Timestamp</p>
                        <p className="text-slate-500 text-sm">Show when report was generated</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                {/* BI Integration */}
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-400" />
                    BI Tool Integration
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <span className="text-slate-300">Enable API Export</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label>API Endpoint</Label>
                      <Input className="bg-slate-700 border-slate-600 font-mono text-sm" value="https://api.arkfinex.com/reports/export" readOnly />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-500/20 text-blue-400">Power BI</Badge>
                      <Badge className="bg-emerald-500/20 text-emerald-400">Tableau</Badge>
                      <Badge className="bg-amber-500/20 text-amber-400">Looker</Badge>
                      <Badge className="bg-violet-500/20 text-violet-400">Metabase</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <AIReportInsights onInsertInsight={(insight) => toast.success('Insight added')} />
                <ReportVersioning templateId={reportConfig.name} onRestore={(v) => toast.success(`Restored to ${v.version}`)} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4 pt-4 border-t border-slate-700">
          <Button variant="outline" className="border-slate-700" onClick={onClose}>Cancel</Button>
          <Button variant="outline" className="border-slate-700">
            <Save className="w-4 h-4 mr-2" />
            Save as Template
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-400" onClick={handleSave}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Save & Generate
          </Button>
        </DialogFooter>

        {/* Widget Configuration Modal */}
        {widgetConfigModal && (
          <WidgetDialog open={!!widgetConfigModal} onOpenChange={() => setWidgetConfigModal(null)}>
            <WidgetDialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
              <WidgetDialogHeader>
                <WidgetDialogTitle>Configure {widgetTypes.find(w => w.id === widgetConfigModal.type)?.label}</WidgetDialogTitle>
              </WidgetDialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Data Source</Label>
                  <Select 
                    value={widgetConfigModal.config.dataSource || 'rvu'} 
                    onValueChange={(v) => updateWidgetConfig(widgetConfigModal.id, { dataSource: v })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {dataSources.map(ds => (
                        <SelectItem key={ds.id} value={ds.id}>{ds.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {widgetConfigModal.type === 'table' && (
                  <div className="space-y-2">
                    <Label>Columns</Label>
                    <div className="flex flex-wrap gap-1">
                      {(dataSources.find(ds => ds.id === (widgetConfigModal.config.dataSource || 'rvu'))?.fields || []).map(field => (
                        <Badge 
                          key={field}
                          className={`cursor-pointer ${(widgetConfigModal.config.columns || []).includes(field) ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-300'}`}
                          onClick={() => {
                            const current = widgetConfigModal.config.columns || [];
                            const updated = current.includes(field) ? current.filter(c => c !== field) : [...current, field];
                            updateWidgetConfig(widgetConfigModal.id, { columns: updated });
                          }}
                        >
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {(widgetConfigModal.type === 'bar-chart' || widgetConfigModal.type === 'line-chart') && (
                  <>
                    <div className="space-y-2">
                      <Label>X-Axis Field</Label>
                      <Select 
                        value={widgetConfigModal.config.xAxis || ''} 
                        onValueChange={(v) => updateWidgetConfig(widgetConfigModal.id, { xAxis: v })}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700">
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {(dataSources.find(ds => ds.id === (widgetConfigModal.config.dataSource || 'rvu'))?.fields || []).map(field => (
                            <SelectItem key={field} value={field}>{field}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Y-Axis Field</Label>
                      <Select 
                        value={widgetConfigModal.config.yAxis || ''} 
                        onValueChange={(v) => updateWidgetConfig(widgetConfigModal.id, { yAxis: v })}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700">
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {(dataSources.find(ds => ds.id === (widgetConfigModal.config.dataSource || 'rvu'))?.fields || []).map(field => (
                            <SelectItem key={field} value={field}>{field}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                {widgetConfigModal.type === 'kpi' && (
                  <>
                    <div className="space-y-2">
                      <Label>KPI Label</Label>
                      <Input 
                        className="bg-slate-800 border-slate-700"
                        value={widgetConfigModal.config.label || ''}
                        onChange={(e) => updateWidgetConfig(widgetConfigModal.id, { label: e.target.value })}
                        placeholder="e.g., Total RVUs"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Metric Field</Label>
                      <Select 
                        value={widgetConfigModal.config.field || ''} 
                        onValueChange={(v) => updateWidgetConfig(widgetConfigModal.id, { field: v })}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700">
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {(dataSources.find(ds => ds.id === (widgetConfigModal.config.dataSource || 'rvu'))?.fields || []).map(field => (
                            <SelectItem key={field} value={field}>{field}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                {widgetConfigModal.type === 'text' && (
                  <>
                    <div className="space-y-2">
                      <Label>Text Style</Label>
                      <Select 
                        value={widgetConfigModal.config.style || 'paragraph'} 
                        onValueChange={(v) => updateWidgetConfig(widgetConfigModal.id, { style: v })}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="heading">Heading</SelectItem>
                          <SelectItem value="subheading">Subheading</SelectItem>
                          <SelectItem value="paragraph">Paragraph</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Content</Label>
                      <Textarea 
                        className="bg-slate-800 border-slate-700"
                        value={widgetConfigModal.config.content || ''}
                        onChange={(e) => updateWidgetConfig(widgetConfigModal.id, { content: e.target.value })}
                        placeholder="Enter text content..."
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" className="border-slate-700" onClick={() => setWidgetConfigModal(null)}>Done</Button>
              </div>
            </WidgetDialogContent>
          </WidgetDialog>
        )}

        {/* Template Selection Modal */}
        <WidgetDialog open={templateModal} onOpenChange={setTemplateModal}>
          <WidgetDialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
            <WidgetDialogHeader>
              <WidgetDialogTitle>Load Template</WidgetDialogTitle>
            </WidgetDialogHeader>
            <div className="space-y-3 mt-4">
              {savedTemplates.map(tpl => (
                <div 
                  key={tpl.id}
                  className="p-4 rounded-lg border border-slate-700 hover:border-amber-500/50 cursor-pointer transition-colors"
                  onClick={() => loadTemplate(tpl)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white font-medium">{tpl.name}</p>
                    <Badge className="bg-slate-700 text-slate-300">{tpl.sections} sections</Badge>
                  </div>
                  <p className="text-slate-500 text-sm">{tpl.description}</p>
                  <p className="text-slate-600 text-xs mt-1">Last modified: {tpl.lastModified}</p>
                </div>
              ))}
            </div>
          </WidgetDialogContent>
        </WidgetDialog>
      </DialogContent>
    </Dialog>
  );
}