import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, Plus, Edit, Trash2, Copy, Users, Shield, 
  Briefcase, Calculator, HeartPulse, Code, Megaphone, Check
} from 'lucide-react';
import { toast } from 'sonner';

const MODULE_GROUPS = [
  { id: 'overview', name: 'Overview', modules: ['Dashboard', 'AI Insights'] },
  { id: 'operations', name: 'Operations', modules: ['CRM', 'Sales', 'Marketing', 'Vendors', 'Procurement', 'GRN', 'Inventory', 'Projects', 'POS'] },
  { id: 'finance', name: 'Finance', modules: ['General Ledger', 'Bank Reconciliation', 'Wallet', 'Cashflow', 'Budgets', 'Contracts', 'Assets', 'GST Reports'] },
  { id: 'compliance', name: 'Compliance', modules: ['Blockchain Audit', 'ESG', 'PDPA', 'Cybersecurity'] },
  { id: 'hr', name: 'Human Resource', modules: ['HR Management', 'My KPI', 'KPI Admin'] },
  { id: 'tools', name: 'Tools', modules: ['Documents', 'ARKSchedule', 'Workflows', 'Service Desk', 'Web Builder', 'Affiliates'] },
  { id: 'manage', name: 'Manage', modules: ['Clients', 'Blog', 'Settings'] },
  { id: 'account', name: 'Account', modules: ['My Dashboard', 'Mobile App'] }
];

const FEATURE_PERMISSIONS = ['create', 'read', 'update', 'delete', 'export', 'approve'];

const ICONS = {
  sales: Briefcase,
  finance: Calculator,
  hr: HeartPulse,
  it: Code,
  marketing: Megaphone,
  default: Shield
};

const defaultTemplates = [
  { 
    id: '1', 
    name: 'Sales Manager', 
    category: 'sales',
    description: 'Full access to CRM, Sales, and Marketing modules with export capabilities',
    modules: ['overview', 'operations', 'account'],
    permissions: { create: true, read: true, update: true, delete: false, export: true, approve: true },
    usageCount: 12
  },
  { 
    id: '2', 
    name: 'HR Recruiter', 
    category: 'hr',
    description: 'Access to HR Management and employee records',
    modules: ['overview', 'hr', 'tools', 'account'],
    permissions: { create: true, read: true, update: true, delete: false, export: false, approve: false },
    usageCount: 5
  },
  { 
    id: '3', 
    name: 'Finance Clerk', 
    category: 'finance',
    description: 'Read access to finance modules with limited create permissions',
    modules: ['overview', 'finance', 'account'],
    permissions: { create: true, read: true, update: false, delete: false, export: false, approve: false },
    usageCount: 8
  },
  { 
    id: '4', 
    name: 'IT Support', 
    category: 'it',
    description: 'Full access to tools and service desk',
    modules: ['overview', 'tools', 'manage', 'account'],
    permissions: { create: true, read: true, update: true, delete: true, export: true, approve: false },
    usageCount: 3
  }
];

export default function RoleTemplates({ onSelectTemplate }) {
  const [templates, setTemplates] = useState(defaultTemplates);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'default',
    description: '',
    modules: [],
    permissions: { create: false, read: true, update: false, delete: false, export: false, approve: false }
  });

  const openCreateModal = () => {
    setFormData({
      name: '',
      category: 'default',
      description: '',
      modules: [],
      permissions: { create: false, read: true, update: false, delete: false, export: false, approve: false }
    });
    setEditingTemplate(null);
    setModalOpen(true);
  };

  const openEditModal = (template) => {
    setFormData({
      name: template.name,
      category: template.category,
      description: template.description,
      modules: template.modules,
      permissions: { ...template.permissions }
    });
    setEditingTemplate(template);
    setModalOpen(true);
  };

  const duplicateTemplate = (template) => {
    const newTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      usageCount: 0
    };
    setTemplates(prev => [...prev, newTemplate]);
    toast.success('Template duplicated');
  };

  const toggleModule = (moduleId) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.includes(moduleId)
        ? prev.modules.filter(m => m !== moduleId)
        : [...prev.modules, moduleId]
    }));
  };

  const togglePermission = (perm) => {
    setFormData(prev => ({
      ...prev,
      permissions: { ...prev.permissions, [perm]: !prev.permissions[perm] }
    }));
  };

  const saveTemplate = () => {
    if (!formData.name) {
      toast.error('Please enter a template name');
      return;
    }

    if (editingTemplate) {
      setTemplates(prev => prev.map(t => 
        t.id === editingTemplate.id ? { ...t, ...formData } : t
      ));
      toast.success('Template updated');
    } else {
      const newTemplate = {
        id: Date.now().toString(),
        ...formData,
        usageCount: 0
      };
      setTemplates(prev => [...prev, newTemplate]);
      toast.success('Template created');
    }
    setModalOpen(false);
  };

  const deleteTemplate = (id) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    toast.success('Template deleted');
  };

  const handleApplyTemplate = (template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
      toast.success(`Applied "${template.name}" template`);
    }
  };

  const getIcon = (category) => {
    const Icon = ICONS[category] || ICONS.default;
    return Icon;
  };

  const getCategoryColor = (category) => {
    const colors = {
      sales: 'bg-blue-100 text-blue-700',
      finance: 'bg-green-100 text-green-700',
      hr: 'bg-pink-100 text-pink-700',
      it: 'bg-purple-100 text-purple-700',
      marketing: 'bg-orange-100 text-orange-700',
      default: 'bg-slate-100 text-slate-700'
    };
    return colors[category] || colors.default;
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-lime-600" />
            Role Templates
          </CardTitle>
          <Button className="bg-lime-500 hover:bg-lime-600" onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {templates.map(template => {
              const Icon = getIcon(template.category);
              return (
                <Card key={template.id} className="border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(template.category)}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{template.name}</h3>
                          <Badge variant="outline" className="text-[10px]">{template.category}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => duplicateTemplate(template)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditModal(template)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteTemplate(template.id)}>
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mb-3">{template.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.modules.slice(0, 3).map(mod => (
                        <Badge key={mod} variant="outline" className="text-[10px]">{mod}</Badge>
                      ))}
                      {template.modules.length > 3 && (
                        <Badge variant="outline" className="text-[10px]">+{template.modules.length - 3}</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        <Users className="w-3 h-3 inline mr-1" />
                        Used by {template.usageCount} users
                      </span>
                      <Button size="sm" className="h-7 bg-lime-500 hover:bg-lime-600" onClick={() => handleApplyTemplate(template)}>
                        Apply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Role Template' : 'Create Role Template'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Template Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Sales Manager"
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="default">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the role and its access..."
              />
            </div>

            <div className="space-y-2">
              <Label>Module Access</Label>
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg">
                {MODULE_GROUPS.map(group => (
                  <div
                    key={group.id}
                    onClick={() => toggleModule(group.id)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.modules.includes(group.id)
                        ? 'border-lime-500 bg-lime-50'
                        : 'hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{group.name}</span>
                      <Checkbox checked={formData.modules.includes(group.id)} />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{group.modules.length} modules</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Default Permissions</Label>
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg">
                {FEATURE_PERMISSIONS.map(perm => (
                  <div
                    key={perm}
                    onClick={() => togglePermission(perm)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all text-center ${
                      formData.permissions[perm]
                        ? 'border-lime-500 bg-lime-50'
                        : 'hover:border-slate-300'
                    }`}
                  >
                    <Checkbox checked={formData.permissions[perm]} className="mx-auto mb-1" />
                    <span className="text-sm capitalize">{perm}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="bg-lime-500 hover:bg-lime-600" onClick={saveTemplate}>
              {editingTemplate ? 'Update Template' : 'Create Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}