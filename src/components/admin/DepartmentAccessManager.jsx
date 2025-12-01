import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Building2, Search, Filter, Check, X, Eye, Edit, Trash2, 
  Download, Shield, Users, ChevronRight, Zap, AlertTriangle,
  Settings, UserPlus, Info, Save, Copy
} from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

const PRESETS = [
  { id: 'full', label: 'Full Access', color: 'bg-green-500', permissions: { create: true, read: true, update: true, delete: true } },
  { id: 'read', label: 'Read Only', color: 'bg-blue-500', permissions: { create: false, read: true, update: false, delete: false } },
  { id: 'limited', label: 'Limited', color: 'bg-amber-500', permissions: { create: true, read: true, update: false, delete: false } },
  { id: 'none', label: 'No Access', color: 'bg-red-500', permissions: { create: false, read: false, update: false, delete: false } }
];

const MODULE_GROUPS = [
  { id: 'overview', name: 'Overview', modules: ['Dashboard', 'AI Insights'] },
  { id: 'operations', name: 'Operations', modules: ['CRM', 'Sales', 'Marketing', 'Vendors', 'Procurement', 'GRN', 'Inventory', 'Projects', 'POS'] },
  { id: 'finance', name: 'Finance', modules: ['General Ledger', 'Bank Reconciliation', 'Wallet', 'Cashflow', 'Budgets', 'Contracts', 'Assets', 'GST Reports'] },
  { id: 'compliance', name: 'Compliance', modules: ['Blockchain Audit', 'ESG', 'PDPA', 'Cybersecurity'] },
  { id: 'hr', name: 'Human Resource', modules: ['HR Management', 'My KPI', 'KPI Admin'] },
  { id: 'tools', name: 'Tools', modules: ['Documents', 'ARKSchedule', 'Workflows', 'Service Desk', 'Web Builder', 'Affiliates'] },
  { id: 'manage', name: 'Manage', modules: ['Clients', 'Blog', 'Settings', 'Super Admin'] },
  { id: 'account', name: 'Account', modules: ['My Dashboard', 'Mobile App'] }
];

const sampleDepartments = [
  { id: 'd1', name: 'Sales', code: 'SALES', head: 'John Smith', userCount: 12, defaultModules: ['overview', 'operations', 'account'] },
  { id: 'd2', name: 'Finance', code: 'FIN', head: 'Sarah Chen', userCount: 8, defaultModules: ['overview', 'finance', 'compliance', 'account'] },
  { id: 'd3', name: 'HR', code: 'HR', head: 'Mike Johnson', userCount: 5, defaultModules: ['overview', 'hr', 'tools', 'account'] },
  { id: 'd4', name: 'IT', code: 'IT', head: 'Anna Lee', userCount: 15, defaultModules: ['overview', 'tools', 'manage', 'account'] }
];

const sampleFeatures = [
  { id: 'f1', key: 'sales.invoice', name: 'Invoices', module: 'Sales', current: { create: true, read: true, update: true, delete: false } },
  { id: 'f2', key: 'sales.order', name: 'Sales Orders', module: 'Sales', current: { create: true, read: true, update: true, delete: true } },
  { id: 'f3', key: 'sales.quotation', name: 'Quotations', module: 'Sales', current: { create: true, read: true, update: false, delete: false } },
  { id: 'f4', key: 'hr.leave', name: 'Leave Management', module: 'HR', current: { create: false, read: true, update: false, delete: false } },
  { id: 'f5', key: 'inventory.item', name: 'Inventory Items', module: 'Inventory', current: { create: false, read: true, update: false, delete: false } },
  { id: 'f6', key: 'finance.budget', name: 'Budgets', module: 'Finance', current: { create: false, read: false, update: false, delete: false } }
];

export default function DepartmentAccessManager({ tenantId }) {
  const [departments, setDepartments] = useState(sampleDepartments);
  const [selectedDept, setSelectedDept] = useState(sampleDepartments[0]);
  const [features, setFeatures] = useState(sampleFeatures);
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [customModal, setCustomModal] = useState({ open: false, feature: null });
  const [confirmModal, setConfirmModal] = useState({ open: false, preset: null });
  const [customPermissions, setCustomPermissions] = useState({ create: false, read: false, update: false, delete: false, export: false, approve: false });
  const [defaultsModal, setDefaultsModal] = useState(false);
  const [defaultModules, setDefaultModules] = useState([]);
  const [activeTab, setActiveTab] = useState('features');

  const filteredFeatures = features.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.key.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = moduleFilter === 'all' || f.module.toLowerCase() === moduleFilter;
    return matchesSearch && matchesModule;
  });

  const toggleFeature = (id) => {
    setSelectedFeatures(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedFeatures.length === filteredFeatures.length) {
      setSelectedFeatures([]);
    } else {
      setSelectedFeatures(filteredFeatures.map(f => f.id));
    }
  };

  const applyPreset = (preset) => {
    if (selectedFeatures.length === 0) {
      toast.error('Please select at least one feature');
      return;
    }
    setConfirmModal({ open: true, preset });
  };

  const confirmApplyPreset = async () => {
    const preset = confirmModal.preset;
    const targetFeatures = selectedFeatures.length > 0 ? selectedFeatures : filteredFeatures.map(f => f.id);

    setFeatures(prev => prev.map(f =>
      targetFeatures.includes(f.id) ? { ...f, current: preset.permissions } : f
    ));

    // Log audit
    await base44.entities.PermissionAudit.create({
      tenant_id: tenantId,
      actor_email: 'current_user@example.com',
      action_type: 'grant',
      target_type: 'department',
      target_id: selectedDept.id,
      target_name: selectedDept.name,
      new_state: { preset: preset.id, features: targetFeatures, permissions: preset.permissions },
      reason: `Applied ${preset.label} preset to ${targetFeatures.length} features`
    });

    setConfirmModal({ open: false, preset: null });
    setSelectedFeatures([]);
    toast.success(`Applied ${preset.label} to ${targetFeatures.length} features`);
  };

  const openCustomModal = (feature = null) => {
    if (feature) {
      setCustomPermissions({ ...feature.current, export: false, approve: false });
    }
    setCustomModal({ open: true, feature });
  };

  const saveCustomPermissions = async () => {
    const targetFeatures = customModal.feature ? [customModal.feature.id] : selectedFeatures;
    
    setFeatures(prev => prev.map(f =>
      targetFeatures.includes(f.id) ? { ...f, current: customPermissions } : f
    ));

    setCustomModal({ open: false, feature: null });
    toast.success('Custom permissions applied');
  };

  const getPermissionBadge = (perms) => {
    const hasAll = perms.create && perms.read && perms.update && perms.delete;
    const hasNone = !perms.create && !perms.read && !perms.update && !perms.delete;
    const readOnly = !perms.create && perms.read && !perms.update && !perms.delete;

    if (hasAll) return <Badge className="bg-green-100 text-green-700">Full Access</Badge>;
    if (hasNone) return <Badge className="bg-red-100 text-red-700">No Access</Badge>;
    if (readOnly) return <Badge className="bg-blue-100 text-blue-700">Read Only</Badge>;
    return <Badge className="bg-amber-100 text-amber-700">Custom</Badge>;
  };

  const openDefaultsModal = () => {
    setDefaultModules(selectedDept.defaultModules || []);
    setDefaultsModal(true);
  };

  const toggleDefaultModule = (moduleId) => {
    setDefaultModules(prev => 
      prev.includes(moduleId) ? prev.filter(m => m !== moduleId) : [...prev, moduleId]
    );
  };

  const saveDefaultModules = () => {
    setDepartments(prev => prev.map(d => 
      d.id === selectedDept.id ? { ...d, defaultModules: defaultModules } : d
    ));
    setSelectedDept(prev => ({ ...prev, defaultModules: defaultModules }));
    setDefaultsModal(false);
    toast.success(`Default module access saved for ${selectedDept.name}`);
  };

  const applyDefaultsToNewUser = (userEmail) => {
    // This would be called when a new user joins the department
    const defaults = selectedDept.defaultModules || [];
    toast.success(`Applied ${defaults.length} default modules to new user`);
    return defaults;
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-12 gap-4">
        {/* Department List */}
        <div className="col-span-3">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Departments
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {departments.map(dept => (
                <div
                  key={dept.id}
                  onClick={() => setSelectedDept(dept)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedDept?.id === dept.id
                      ? 'bg-lime-50 border-l-4 border-lime-500'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{dept.name}</p>
                      <p className="text-xs text-slate-500">{dept.userCount} users</p>
                      {dept.defaultModules?.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          <Badge variant="outline" className="text-[9px] px-1">
                            {dept.defaultModules.length} defaults
                          </Badge>
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Features & Permissions */}
        <div className="col-span-9">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-lime-600" />
                  {selectedDept?.name} - Access Management
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={openDefaultsModal}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Set New User Defaults
                  </Button>
                  <Badge variant="outline">{selectedFeatures.length} selected</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
                <TabsList>
                  <TabsTrigger value="features">Feature Permissions</TabsTrigger>
                  <TabsTrigger value="defaults">Default Module Access</TabsTrigger>
                </TabsList>

                <TabsContent value="defaults" className="mt-4">
                  <div className="p-4 bg-blue-50 rounded-lg mb-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">Default Module Access for New Users</p>
                        <p className="text-sm text-blue-700">
                          When a new user is assigned to {selectedDept?.name}, they will automatically receive access to the selected modules below.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {MODULE_GROUPS.map(group => (
                      <div
                        key={group.id}
                        onClick={() => {
                          const newDefaults = selectedDept.defaultModules?.includes(group.id)
                            ? selectedDept.defaultModules.filter(m => m !== group.id)
                            : [...(selectedDept.defaultModules || []), group.id];
                          setDepartments(prev => prev.map(d => 
                            d.id === selectedDept.id ? { ...d, defaultModules: newDefaults } : d
                          ));
                          setSelectedDept(prev => ({ ...prev, defaultModules: newDefaults }));
                        }}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedDept.defaultModules?.includes(group.id)
                            ? 'border-lime-500 bg-lime-50'
                            : 'hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{group.name}</p>
                            <p className="text-xs text-slate-500">{group.modules.length} modules</p>
                          </div>
                          <Checkbox checked={selectedDept.defaultModules?.includes(group.id)} />
                        </div>
                        <p className="text-xs text-slate-400 mt-2">{group.modules.join(', ')}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                    <p className="text-sm font-medium mb-2">Current Defaults for {selectedDept?.name}:</p>
                    <div className="flex gap-2 flex-wrap">
                      {selectedDept.defaultModules?.length > 0 ? (
                        selectedDept.defaultModules.map(mod => {
                          const group = MODULE_GROUPS.find(g => g.id === mod);
                          return group ? (
                            <Badge key={mod} className="bg-lime-100 text-lime-700">{group.name}</Badge>
                          ) : null;
                        })
                      ) : (
                        <span className="text-sm text-slate-500">No defaults configured</span>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="features" className="mt-4">
              {/* Preset Buttons */}
              <div className="flex items-center gap-2 mb-4 p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-600 mr-2">Quick Apply:</span>
                {PRESETS.map(preset => (
                  <Button
                    key={preset.id}
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset(preset)}
                    className="gap-2"
                  >
                    <div className={`w-2 h-2 rounded-full ${preset.color}`} />
                    {preset.label}
                  </Button>
                ))}
                <Button variant="outline" size="sm" onClick={() => openCustomModal()}>
                  <Edit className="w-3 h-3 mr-1" />
                  Custom
                </Button>
              </div>

              {/* Search & Filter */}
              <div className="flex gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search features..."
                    className="pl-9"
                  />
                </div>
                <Select value={moduleFilter} onValueChange={setModuleFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Modules" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modules</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="inventory">Inventory</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Features Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={selectedFeatures.length === filteredFeatures.length && filteredFeatures.length > 0}
                        onCheckedChange={selectAll}
                      />
                    </TableHead>
                    <TableHead>Feature</TableHead>
                    <TableHead className="text-center w-16">C</TableHead>
                    <TableHead className="text-center w-16">R</TableHead>
                    <TableHead className="text-center w-16">U</TableHead>
                    <TableHead className="text-center w-16">D</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeatures.map(feature => (
                    <TableRow key={feature.id} className={selectedFeatures.includes(feature.id) ? 'bg-lime-50' : ''}>
                      <TableCell>
                        <Checkbox
                          checked={selectedFeatures.includes(feature.id)}
                          onCheckedChange={() => toggleFeature(feature.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{feature.name}</p>
                          <p className="text-xs text-slate-500">{feature.key}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {feature.current.create ? <Check className="w-4 h-4 text-green-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                      </TableCell>
                      <TableCell className="text-center">
                        {feature.current.read ? <Check className="w-4 h-4 text-green-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                      </TableCell>
                      <TableCell className="text-center">
                        {feature.current.update ? <Check className="w-4 h-4 text-green-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                      </TableCell>
                      <TableCell className="text-center">
                        {feature.current.delete ? <Check className="w-4 h-4 text-green-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                      </TableCell>
                      <TableCell>{getPermissionBadge(feature.current)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openCustomModal(feature)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirm Preset Modal */}
      <Dialog open={confirmModal.open} onOpenChange={() => setConfirmModal({ open: false, preset: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Apply {confirmModal.preset?.label}
            </DialogTitle>
          </DialogHeader>
          <p className="text-slate-600">
            Apply <strong>{confirmModal.preset?.label}</strong> to <strong>{selectedFeatures.length || filteredFeatures.length} features</strong> for <strong>{selectedDept?.name}</strong> department?
            This will change permissions for all {selectedDept?.userCount} users.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmModal({ open: false, preset: null })}>Cancel</Button>
            <Button className="bg-lime-500 hover:bg-lime-600" onClick={confirmApplyPreset}>
              <Zap className="w-4 h-4 mr-2" />
              Apply Preset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom Permissions Modal */}
      <Dialog open={customModal.open} onOpenChange={() => setCustomModal({ open: false, feature: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Custom Permissions {customModal.feature && `- ${customModal.feature.name}`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {['create', 'read', 'update', 'delete', 'export', 'approve'].map(action => (
                <Tooltip key={action}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-help">
                      <span className="capitalize font-medium">{action}</span>
                      <Switch
                        checked={customPermissions[action]}
                        onCheckedChange={(v) => setCustomPermissions({ ...customPermissions, [action]: v })}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      {action === 'create' && 'Allows creating new records in this feature'}
                      {action === 'read' && 'Allows viewing existing records'}
                      {action === 'update' && 'Allows modifying existing records'}
                      {action === 'delete' && 'Allows removing records permanently'}
                      {action === 'export' && 'Allows exporting data to CSV/PDF'}
                      {action === 'approve' && 'Allows approving pending items'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomModal({ open: false, feature: null })}>Cancel</Button>
            <Button className="bg-lime-500 hover:bg-lime-600" onClick={saveCustomPermissions}>
              Apply Custom Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Default Modules Modal */}
      <Dialog open={defaultsModal} onOpenChange={setDefaultsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Set Default Module Access for New Users
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500">
            Select which modules new users in <strong>{selectedDept?.name}</strong> department will automatically have access to.
          </p>
          <div className="grid grid-cols-2 gap-3 py-4">
            {MODULE_GROUPS.map(group => (
              <div
                key={group.id}
                onClick={() => toggleDefaultModule(group.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  defaultModules.includes(group.id)
                    ? 'border-lime-500 bg-lime-50'
                    : 'hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{group.name}</p>
                    <p className="text-xs text-slate-500">{group.modules.length} modules</p>
                  </div>
                  <Checkbox checked={defaultModules.includes(group.id)} />
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDefaultsModal(false)}>Cancel</Button>
            <Button className="bg-lime-500 hover:bg-lime-600" onClick={saveDefaultModules}>
              <Save className="w-4 h-4 mr-2" />
              Save Defaults
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}