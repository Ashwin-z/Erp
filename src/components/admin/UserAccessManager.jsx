import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Search, Plus, Edit, Trash2, Shield, Crown, Users, Building2,
  Eye, Lock, Unlock, CheckCircle2, XCircle, Zap, Copy,
  LayoutDashboard, FileText, CreditCard, TrendingUp, Settings,
  Briefcase, HelpCircle, User, ChevronDown, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

// Feature definitions with CRUD operations
const FEATURES = {
  Dashboard: { 
    features: [
      { id: 'dashboard.view', name: 'View Dashboard', crud: ['read'] },
      { id: 'dashboard.widgets', name: 'Manage Widgets', crud: ['create', 'read', 'update', 'delete'] },
      { id: 'dashboard.export', name: 'Export Reports', crud: ['read'] }
    ]
  },
  'AI Insights': {
    features: [
      { id: 'ai.view', name: 'View AI Insights', crud: ['read'] },
      { id: 'ai.recommendations', name: 'Manage Recommendations', crud: ['read', 'update'] }
    ]
  },
  CRM: {
    features: [
      { id: 'crm.contacts', name: 'Contacts', crud: ['create', 'read', 'update', 'delete'] },
      { id: 'crm.leads', name: 'Leads', crud: ['create', 'read', 'update', 'delete'] },
      { id: 'crm.opportunities', name: 'Opportunities', crud: ['create', 'read', 'update', 'delete'] },
      { id: 'crm.campaigns', name: 'Campaigns', crud: ['create', 'read', 'update', 'delete'] }
    ]
  },
  Sales: {
    features: [
      { id: 'sales.orders', name: 'Sales Orders', crud: ['create', 'read', 'update', 'delete'] },
      { id: 'sales.quotations', name: 'Quotations', crud: ['create', 'read', 'update', 'delete'] },
      { id: 'sales.invoices', name: 'Invoices', crud: ['create', 'read', 'update', 'delete'] },
      { id: 'sales.reports', name: 'Sales Reports', crud: ['read'] }
    ]
  },
  Marketing: {
    features: [
      { id: 'marketing.campaigns', name: 'Campaigns', crud: ['create', 'read', 'update', 'delete'] },
      { id: 'marketing.analytics', name: 'Analytics', crud: ['read'] }
    ]
  },
  Vendors: {
    features: [
      { id: 'vendors.manage', name: 'Vendor Management', crud: ['create', 'read', 'update', 'delete'] },
      { id: 'vendors.ratings', name: 'Vendor Ratings', crud: ['create', 'read', 'update'] }
    ]
  },
  Procurement: {
    features: [
      { id: 'procurement.po', name: 'Purchase Orders', crud: ['create', 'read', 'update', 'delete'] },
      { id: 'procurement.rfq', name: 'RFQ', crud: ['create', 'read', 'update', 'delete'] }
    ]
  },
  Inventory: {
    features: [
      { id: 'inventory.items', name: 'Inventory Items', crud: ['create', 'read', 'update', 'delete'] },
      { id: 'inventory.stock', name: 'Stock Management', crud: ['create', 'read', 'update'] },
      { id: 'inventory.warehouse', name: 'Warehouse', crud: ['create', 'read', 'update', 'delete'] }
    ]
  },
  Projects: {
    features: [
      { id: 'projects.manage', name: 'Project Management', crud: ['create', 'read', 'update', 'delete'] },
      { id: 'projects.tasks', name: 'Tasks', crud: ['create', 'read', 'update', 'delete'] },
      { id: 'projects.timeline', name: 'Timeline', crud: ['read', 'update'] }
    ]
  },
  Finance: {
    features: [
      { id: 'finance.ledger', name: 'General Ledger', crud: ['create', 'read', 'update', 'delete'] },
      { id: 'finance.reconciliation', name: 'Bank Reconciliation', crud: ['create', 'read', 'update'] },
      { id: 'finance.budgets', name: 'Budgets', crud: ['create', 'read', 'update', 'delete'] },
      { id: 'finance.gst', name: 'GST Reports', crud: ['read'] }
    ]
  },
  HR: {
    features: [
      { id: 'hr.employees', name: 'Employee Management', crud: ['create', 'read', 'update', 'delete'] },
      { id: 'hr.leave', name: 'Leave Management', crud: ['create', 'read', 'update', 'delete'] },
      { id: 'hr.kpi', name: 'KPI Management', crud: ['create', 'read', 'update', 'delete'] },
      { id: 'hr.payroll', name: 'Payroll', crud: ['read'] }
    ]
  },
  Documents: {
    features: [
      { id: 'documents.manage', name: 'Document Management', crud: ['create', 'read', 'update', 'delete'] },
      { id: 'documents.share', name: 'Share Documents', crud: ['create', 'read'] }
    ]
  },
  Settings: {
    features: [
      { id: 'settings.company', name: 'Company Settings', crud: ['read', 'update'] },
      { id: 'settings.users', name: 'User Management', crud: ['create', 'read', 'update', 'delete'] },
      { id: 'settings.security', name: 'Security Settings', crud: ['read', 'update'] }
    ]
  },
  'Super Admin': {
    features: [
      { id: 'admin.all', name: 'Full Admin Access', crud: ['create', 'read', 'update', 'delete'] },
      { id: 'admin.audit', name: 'Audit Logs', crud: ['read'] },
      { id: 'admin.permissions', name: 'Permission Management', crud: ['create', 'read', 'update', 'delete'] }
    ]
  }
};

const MODULE_GROUPS = [
  { id: 'overview', name: 'Overview', icon: LayoutDashboard, color: 'bg-blue-500', modules: ['Dashboard', 'AI Insights'] },
  { id: 'operations', name: 'Operations', icon: Briefcase, color: 'bg-green-500', modules: ['CRM', 'Sales', 'Marketing', 'Vendors', 'Procurement', 'Inventory', 'Projects'] },
  { id: 'finance', name: 'Finance', icon: CreditCard, color: 'bg-purple-500', modules: ['Finance'] },
  { id: 'hr', name: 'Human Resource', icon: Users, color: 'bg-amber-500', modules: ['HR'] },
  { id: 'tools', name: 'Tools', icon: Settings, color: 'bg-cyan-500', modules: ['Documents'] },
  { id: 'manage', name: 'Manage', icon: Building2, color: 'bg-indigo-500', modules: ['Settings', 'Super Admin'] }
];

const ROLE_PRESETS = [
  { 
    id: 'super_admin', 
    name: 'Super Admin', 
    icon: Crown, 
    color: 'bg-red-500',
    description: 'Full platform access - all modules and features with full CRUD',
    fullAccess: true
  },
  { 
    id: 'platform_admin', 
    name: 'Platform Admin', 
    icon: Shield, 
    color: 'bg-orange-500',
    description: 'Admin access with selected CRUD permissions',
    fullAccess: false
  },
  { 
    id: 'department_head', 
    name: 'Department Head', 
    icon: Building2, 
    color: 'bg-purple-500',
    description: 'Department-level access - manages specific department',
    requiresDepartment: true
  },
  { 
    id: 'manager', 
    name: 'Manager', 
    icon: Users, 
    color: 'bg-blue-500',
    description: 'Team management with limited admin access'
  },
  { 
    id: 'user', 
    name: 'Standard User', 
    icon: User, 
    color: 'bg-green-500',
    description: 'Basic access to assigned features only'
  }
];

const departments = ['Executive', 'Sales', 'Finance', 'HR', 'IT', 'Marketing', 'Operations', 'Compliance', 'Customer Service'];

const sampleUsers = [
  // ============ SUPER ADMINS ============
  { 
    id: '1', 
    email: 'net28528@gmail.com', 
    name: 'Nethanial Tan', 
    role: 'super_admin', 
    department: 'Executive', 
    managedDepartment: null,
    status: 'active', 
    protected: true, 
    permissions: {} // Super admin has full access
  },
  { 
    id: '2', 
    email: 'admin@arkfinex.com', 
    name: 'Alex Administrator', 
    role: 'super_admin', 
    department: 'Executive', 
    managedDepartment: null,
    status: 'active', 
    protected: false, 
    permissions: {} // Super admin has full access
  },

  // ============ PLATFORM ADMINS ============
  { 
    id: '3', 
    email: 'platformadmin@arkfinex.com', 
    name: 'Patricia Admin', 
    role: 'platform_admin', 
    department: 'IT',
    managedDepartment: null,
    status: 'active', 
    protected: false, 
    permissions: {
      'admin.all': { create: true, read: true, update: true, delete: false },
      'admin.audit': { create: false, read: true, update: false, delete: false },
      'admin.permissions': { create: true, read: true, update: true, delete: false },
      'settings.company': { create: false, read: true, update: true, delete: false },
      'settings.users': { create: true, read: true, update: true, delete: false },
      'settings.security': { create: false, read: true, update: true, delete: false }
    }
  },

  // ============ DEPARTMENT HEADS ============
  { 
    id: '4', 
    email: 'sarah.chen@arkfinex.com', 
    name: 'Sarah Chen', 
    role: 'department_head', 
    department: 'Finance',
    managedDepartment: 'Finance',
    status: 'active', 
    protected: false, 
    permissions: {
      'finance.ledger': { create: true, read: true, update: true, delete: true },
      'finance.reconciliation': { create: true, read: true, update: true, delete: true },
      'finance.budgets': { create: true, read: true, update: true, delete: true },
      'finance.gst': { create: true, read: true, update: true, delete: false },
      'dashboard.view': { create: false, read: true, update: false, delete: false },
      'dashboard.widgets': { create: true, read: true, update: true, delete: true },
      'dashboard.export': { create: false, read: true, update: false, delete: false }
    }
  },
  { 
    id: '5', 
    email: 'john.smith@arkfinex.com', 
    name: 'John Smith', 
    role: 'department_head', 
    department: 'Sales',
    managedDepartment: 'Sales',
    status: 'active', 
    protected: false,
    permissions: {
      'sales.orders': { create: true, read: true, update: true, delete: true },
      'sales.quotations': { create: true, read: true, update: true, delete: true },
      'sales.invoices': { create: true, read: true, update: true, delete: true },
      'sales.reports': { create: false, read: true, update: false, delete: false },
      'crm.contacts': { create: true, read: true, update: true, delete: true },
      'crm.leads': { create: true, read: true, update: true, delete: true },
      'crm.opportunities': { create: true, read: true, update: true, delete: true },
      'dashboard.view': { create: false, read: true, update: false, delete: false },
      'dashboard.export': { create: false, read: true, update: false, delete: false }
    }
  },
  { 
    id: '6', 
    email: 'linda.wong@arkfinex.com', 
    name: 'Linda Wong', 
    role: 'department_head', 
    department: 'HR',
    managedDepartment: 'HR',
    status: 'active', 
    protected: false,
    permissions: {
      'hr.employees': { create: true, read: true, update: true, delete: true },
      'hr.leave': { create: true, read: true, update: true, delete: true },
      'hr.kpi': { create: true, read: true, update: true, delete: true },
      'hr.payroll': { create: false, read: true, update: false, delete: false },
      'dashboard.view': { create: false, read: true, update: false, delete: false },
      'documents.manage': { create: true, read: true, update: true, delete: true }
    }
  },
  { 
    id: '7', 
    email: 'david.lee@arkfinex.com', 
    name: 'David Lee', 
    role: 'department_head', 
    department: 'IT',
    managedDepartment: 'IT',
    status: 'active', 
    protected: false,
    permissions: {
      'settings.company': { create: false, read: true, update: true, delete: false },
      'settings.users': { create: true, read: true, update: true, delete: false },
      'settings.security': { create: false, read: true, update: true, delete: false },
      'documents.manage': { create: true, read: true, update: true, delete: true },
      'documents.share': { create: true, read: true, update: false, delete: false },
      'dashboard.view': { create: false, read: true, update: false, delete: false }
    }
  },
  { 
    id: '8', 
    email: 'maria.garcia@arkfinex.com', 
    name: 'Maria Garcia', 
    role: 'department_head', 
    department: 'Marketing',
    managedDepartment: 'Marketing',
    status: 'active', 
    protected: false,
    permissions: {
      'marketing.campaigns': { create: true, read: true, update: true, delete: true },
      'marketing.analytics': { create: false, read: true, update: false, delete: false },
      'crm.contacts': { create: true, read: true, update: true, delete: false },
      'crm.leads': { create: true, read: true, update: true, delete: false },
      'dashboard.view': { create: false, read: true, update: false, delete: false }
    }
  },
  { 
    id: '9', 
    email: 'robert.tan@arkfinex.com', 
    name: 'Robert Tan', 
    role: 'department_head', 
    department: 'Operations',
    managedDepartment: 'Operations',
    status: 'active', 
    protected: false,
    permissions: {
      'inventory.items': { create: true, read: true, update: true, delete: true },
      'inventory.stock': { create: true, read: true, update: true, delete: false },
      'inventory.warehouse': { create: true, read: true, update: true, delete: true },
      'procurement.po': { create: true, read: true, update: true, delete: true },
      'procurement.rfq': { create: true, read: true, update: true, delete: true },
      'vendors.manage': { create: true, read: true, update: true, delete: false },
      'dashboard.view': { create: false, read: true, update: false, delete: false }
    }
  },

  // ============ MANAGERS ============
  { 
    id: '10', 
    email: 'james.koh@arkfinex.com', 
    name: 'James Koh', 
    role: 'manager', 
    department: 'Sales',
    managedDepartment: null,
    status: 'active', 
    protected: false,
    permissions: {
      'sales.orders': { create: true, read: true, update: true, delete: false },
      'sales.quotations': { create: true, read: true, update: true, delete: false },
      'sales.invoices': { create: true, read: true, update: false, delete: false },
      'sales.reports': { create: false, read: true, update: false, delete: false },
      'crm.contacts': { create: true, read: true, update: true, delete: false },
      'crm.leads': { create: true, read: true, update: true, delete: false },
      'dashboard.view': { create: false, read: true, update: false, delete: false }
    }
  },
  { 
    id: '11', 
    email: 'emily.lim@arkfinex.com', 
    name: 'Emily Lim', 
    role: 'manager', 
    department: 'Finance',
    managedDepartment: null,
    status: 'active', 
    protected: false,
    permissions: {
      'finance.ledger': { create: true, read: true, update: true, delete: false },
      'finance.reconciliation': { create: true, read: true, update: true, delete: false },
      'finance.budgets': { create: true, read: true, update: false, delete: false },
      'finance.gst': { create: false, read: true, update: false, delete: false },
      'dashboard.view': { create: false, read: true, update: false, delete: false }
    }
  },

  // ============ STANDARD USERS ============
  { 
    id: '12', 
    email: 'mike.johnson@arkfinex.com', 
    name: 'Mike Johnson', 
    role: 'user', 
    department: 'Sales',
    managedDepartment: null,
    status: 'active', 
    protected: false,
    permissions: {
      'sales.orders': { create: true, read: true, update: false, delete: false },
      'sales.quotations': { create: true, read: true, update: true, delete: false },
      'crm.contacts': { create: false, read: true, update: false, delete: false },
      'dashboard.view': { create: false, read: true, update: false, delete: false }
    }
  },
  { 
    id: '13', 
    email: 'anna.lee@arkfinex.com', 
    name: 'Anna Lee', 
    role: 'user', 
    department: 'Sales',
    managedDepartment: null,
    status: 'active', 
    protected: false,
    permissions: {
      'sales.orders': { create: true, read: true, update: false, delete: false },
      'sales.quotations': { create: true, read: true, update: false, delete: false },
      'crm.contacts': { create: false, read: true, update: false, delete: false },
      'crm.leads': { create: true, read: true, update: false, delete: false },
      'dashboard.view': { create: false, read: true, update: false, delete: false }
    }
  },
  { 
    id: '14', 
    email: 'kevin.ng@arkfinex.com', 
    name: 'Kevin Ng', 
    role: 'user', 
    department: 'Finance',
    managedDepartment: null,
    status: 'active', 
    protected: false,
    permissions: {
      'finance.ledger': { create: false, read: true, update: false, delete: false },
      'finance.reconciliation': { create: true, read: true, update: false, delete: false },
      'finance.gst': { create: false, read: true, update: false, delete: false },
      'dashboard.view': { create: false, read: true, update: false, delete: false }
    }
  },
  { 
    id: '15', 
    email: 'grace.tan@arkfinex.com', 
    name: 'Grace Tan', 
    role: 'user', 
    department: 'HR',
    managedDepartment: null,
    status: 'active', 
    protected: false,
    permissions: {
      'hr.employees': { create: false, read: true, update: false, delete: false },
      'hr.leave': { create: true, read: true, update: true, delete: false },
      'documents.manage': { create: true, read: true, update: false, delete: false },
      'dashboard.view': { create: false, read: true, update: false, delete: false }
    }
  },
  { 
    id: '16', 
    email: 'peter.wong@arkfinex.com', 
    name: 'Peter Wong', 
    role: 'user', 
    department: 'Operations',
    managedDepartment: null,
    status: 'active', 
    protected: false,
    permissions: {
      'inventory.items': { create: false, read: true, update: true, delete: false },
      'inventory.stock': { create: true, read: true, update: true, delete: false },
      'procurement.po': { create: true, read: true, update: false, delete: false },
      'dashboard.view': { create: false, read: true, update: false, delete: false }
    }
  },
  { 
    id: '17', 
    email: 'jessica.lim@arkfinex.com', 
    name: 'Jessica Lim', 
    role: 'user', 
    department: 'Marketing',
    managedDepartment: null,
    status: 'active', 
    protected: false,
    permissions: {
      'marketing.campaigns': { create: true, read: true, update: true, delete: false },
      'marketing.analytics': { create: false, read: true, update: false, delete: false },
      'crm.leads': { create: true, read: true, update: false, delete: false },
      'dashboard.view': { create: false, read: true, update: false, delete: false }
    }
  },
  { 
    id: '18', 
    email: 'daniel.chen@arkfinex.com', 
    name: 'Daniel Chen', 
    role: 'user', 
    department: 'IT',
    managedDepartment: null,
    status: 'active', 
    protected: false,
    permissions: {
      'documents.manage': { create: true, read: true, update: true, delete: false },
      'documents.share': { create: true, read: true, update: false, delete: false },
      'settings.company': { create: false, read: true, update: false, delete: false },
      'dashboard.view': { create: false, read: true, update: false, delete: false }
    }
  }
];

export default function UserAccessManager({ tenantId }) {
  const [users, setUsers] = useState(sampleUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterDept, setFilterDept] = useState('all');
  const [userModal, setUserModal] = useState({ open: false, user: null, mode: 'create' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    department: '',
    managedDepartment: '',
    permissions: {},
    status: 'active'
  });

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    const matchesDept = filterDept === 'all' || u.department === filterDept;
    return matchesSearch && matchesRole && matchesDept;
  });

  const openCreateModal = () => {
    setFormData({
      name: '',
      email: '',
      role: 'user',
      department: '',
      managedDepartment: '',
      permissions: {},
      status: 'active'
    });
    setExpandedModules({});
    setUserModal({ open: true, user: null, mode: 'create' });
  };

  const openEditModal = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      managedDepartment: user.managedDepartment || '',
      permissions: user.permissions || {},
      status: user.status
    });
    setExpandedModules({});
    setUserModal({ open: true, user, mode: 'edit' });
  };

  const applyRolePreset = (presetId) => {
    const preset = ROLE_PRESETS.find(p => p.id === presetId);
    if (preset) {
      let newPermissions = {};
      
      if (preset.fullAccess) {
        // Super admin gets all permissions
        Object.entries(FEATURES).forEach(([module, data]) => {
          data.features.forEach(feature => {
            newPermissions[feature.id] = {
              create: feature.crud.includes('create'),
              read: feature.crud.includes('read'),
              update: feature.crud.includes('update'),
              delete: feature.crud.includes('delete')
            };
          });
        });
      }
      
      setFormData(prev => ({
        ...prev,
        role: presetId,
        permissions: preset.fullAccess ? newPermissions : prev.permissions,
        managedDepartment: preset.requiresDepartment ? prev.managedDepartment : ''
      }));
    }
  };

  const togglePermission = (featureId, action) => {
    setFormData(prev => {
      const currentPerms = prev.permissions[featureId] || { create: false, read: false, update: false, delete: false };
      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [featureId]: {
            ...currentPerms,
            [action]: !currentPerms[action]
          }
        }
      };
    });
  };

  const setAllPermissionsForFeature = (featureId, feature, value) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [featureId]: {
          create: feature.crud.includes('create') ? value : false,
          read: feature.crud.includes('read') ? value : false,
          update: feature.crud.includes('update') ? value : false,
          delete: feature.crud.includes('delete') ? value : false
        }
      }
    }));
  };

  const setAllPermissionsForModule = (moduleName, value) => {
    const moduleFeatures = FEATURES[moduleName]?.features || [];
    setFormData(prev => {
      const newPerms = { ...prev.permissions };
      moduleFeatures.forEach(feature => {
        newPerms[feature.id] = {
          create: feature.crud.includes('create') ? value : false,
          read: feature.crud.includes('read') ? value : false,
          update: feature.crud.includes('update') ? value : false,
          delete: feature.crud.includes('delete') ? value : false
        };
      });
      return { ...prev, permissions: newPerms };
    });
  };

  const saveUser = () => {
    if (!formData.name || !formData.email) {
      toast.error('Please fill in required fields');
      return;
    }
    if (!formData.department) {
      toast.error('Please select a department');
      return;
    }
    if (formData.role === 'department_head' && !formData.managedDepartment) {
      toast.error('Department Head must have a managed department');
      return;
    }

    if (userModal.mode === 'create') {
      const newUser = {
        id: Date.now().toString(),
        ...formData,
        protected: false
      };
      setUsers(prev => [...prev, newUser]);
      toast.success('User created successfully');
    } else {
      setUsers(prev => prev.map(u => 
        u.id === userModal.user.id ? { ...u, ...formData } : u
      ));
      toast.success('User updated successfully');
    }
    setUserModal({ open: false, user: null, mode: 'create' });
  };

  const deleteUser = (user) => {
    if (user.protected) {
      toast.error('Cannot delete protected user');
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== user.id));
    setDeleteConfirm(null);
    toast.success('User deleted successfully');
  };

  const getRoleBadge = (role) => {
    const preset = ROLE_PRESETS.find(p => p.id === role);
    if (!preset) return null;
    return (
      <Badge className={`${preset.color} text-white`}>
        <preset.icon className="w-3 h-3 mr-1" />
        {preset.name}
      </Badge>
    );
  };

  const getPermissionSummary = (permissions) => {
    const count = Object.keys(permissions).length;
    if (count === 0) return 'No permissions';
    return `${count} features`;
  };

  const toggleModuleExpand = (moduleName) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleName]: !prev[moduleName]
    }));
  };

  const hasAnyPermission = (featureId) => {
    const perms = formData.permissions[featureId];
    return perms && (perms.create || perms.read || perms.update || perms.delete);
  };

  const hasAllPermissions = (featureId, feature) => {
    const perms = formData.permissions[featureId];
    if (!perms) return false;
    return feature.crud.every(action => perms[action]);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-lime-600" />
            User Role & Access Management
          </CardTitle>
          <Button className="bg-lime-500 hover:bg-lime-600" onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-2" />
            Create User
          </Button>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="pl-9"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {ROLE_PRESETS.map(role => (
                  <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterDept} onValueChange={setFilterDept}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Role Legend */}
          <div className="flex gap-2 mb-4 p-3 bg-slate-50 rounded-lg flex-wrap">
            <span className="text-sm text-slate-500 mr-2">Roles:</span>
            {ROLE_PRESETS.map(preset => (
              <Badge key={preset.id} variant="outline" className="text-xs">
                <preset.icon className="w-3 h-3 mr-1" />
                {preset.name}
              </Badge>
            ))}
          </div>

          {/* Users Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Managed Dept</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className={user.protected ? 'bg-amber-100 text-amber-700' : 'bg-slate-100'}>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{user.name}</p>
                          {user.protected && (
                            <Badge className="bg-amber-100 text-amber-700 text-[10px]">
                              <Lock className="w-2 h-2 mr-1" />
                              OWNER
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.department}</Badge>
                  </TableCell>
                  <TableCell>
                    {user.role === 'department_head' && user.managedDepartment ? (
                      <Badge className="bg-purple-100 text-purple-700">
                        <Building2 className="w-3 h-3 mr-1" />
                        {user.managedDepartment}
                      </Badge>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.role === 'super_admin' ? (
                      <Badge className="bg-red-100 text-red-700">Full Access</Badge>
                    ) : (
                      <Badge variant="outline">{getPermissionSummary(user.permissions)}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditModal(user)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      {!user.protected && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                          onClick={() => setDeleteConfirm(user)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit User Modal */}
      <Dialog open={userModal.open} onOpenChange={() => setUserModal({ open: false, user: null, mode: 'create' })}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {userModal.mode === 'create' ? <Plus className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
              {userModal.mode === 'create' ? 'Create New User' : 'Edit User Access'}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="details" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="mb-4">
              <TabsTrigger value="details">User Details</TabsTrigger>
              <TabsTrigger value="role">Role Selection</TabsTrigger>
              <TabsTrigger value="permissions">Feature Permissions (CRUD)</TabsTrigger>
            </TabsList>

            {/* User Details Tab */}
            <TabsContent value="details" className="space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Department *</Label>
                  <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Role Tab */}
            <TabsContent value="role" className="space-y-4 overflow-y-auto flex-1">
              <p className="text-sm text-slate-500">
                Select a role. Super Admin has full access. Department Head manages a specific department.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {ROLE_PRESETS.map(preset => (
                  <div
                    key={preset.id}
                    onClick={() => applyRolePreset(preset.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.role === preset.id 
                        ? 'border-lime-500 bg-lime-50 ring-2 ring-lime-300' 
                        : 'hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${preset.color} flex items-center justify-center`}>
                        <preset.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{preset.name}</p>
                        <p className="text-xs text-slate-500">{preset.description}</p>
                      </div>
                      {formData.role === preset.id && (
                        <CheckCircle2 className="w-5 h-5 text-lime-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Department Head - Select managed department */}
              {formData.role === 'department_head' && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <Label className="text-purple-700">Managed Department *</Label>
                  <p className="text-xs text-purple-600 mb-2">Select the department this user will manage</p>
                  <Select 
                    value={formData.managedDepartment} 
                    onValueChange={(v) => setFormData({ ...formData, managedDepartment: v })}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select department to manage" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Platform Admin info */}
              {formData.role === 'platform_admin' && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-700">
                    <strong>Platform Admin</strong> can access admin features. Configure specific CRUD permissions in the next tab.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Permissions Tab */}
            <TabsContent value="permissions" className="overflow-hidden flex-1 flex flex-col">
              {formData.role === 'super_admin' ? (
                <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
                  <Crown className="w-12 h-12 text-red-500 mx-auto mb-3" />
                  <h3 className="font-bold text-red-700">Super Admin</h3>
                  <p className="text-red-600">Has full access to all features with all CRUD permissions.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm text-slate-500">
                      Configure Create, Read, Update, Delete permissions for each feature
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        Object.entries(FEATURES).forEach(([mod]) => setAllPermissionsForModule(mod, true));
                      }}>
                        <Zap className="w-3 h-3 mr-1" />
                        Grant All
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setFormData(prev => ({ ...prev, permissions: {} }))}>
                        <XCircle className="w-3 h-3 mr-1" />
                        Clear All
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-2">
                      {Object.entries(FEATURES).map(([moduleName, moduleData]) => (
                        <Collapsible 
                          key={moduleName} 
                          open={expandedModules[moduleName]}
                          onOpenChange={() => toggleModuleExpand(moduleName)}
                        >
                          <div className="border rounded-lg">
                            <CollapsibleTrigger className="w-full">
                              <div className="flex items-center justify-between p-3 hover:bg-slate-50">
                                <div className="flex items-center gap-3">
                                  {expandedModules[moduleName] ? (
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                  )}
                                  <span className="font-medium">{moduleName}</span>
                                  <Badge variant="outline" className="text-[10px]">
                                    {moduleData.features.length} features
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setAllPermissionsForModule(moduleName, true);
                                    }}
                                  >
                                    All
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setAllPermissionsForModule(moduleName, false);
                                    }}
                                  >
                                    None
                                  </Button>
                                </div>
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="border-t bg-slate-50 p-3">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="bg-slate-100">
                                      <TableHead className="font-medium">Feature</TableHead>
                                      <TableHead className="w-20 text-center">Create</TableHead>
                                      <TableHead className="w-20 text-center">Read</TableHead>
                                      <TableHead className="w-20 text-center">Update</TableHead>
                                      <TableHead className="w-20 text-center">Delete</TableHead>
                                      <TableHead className="w-20 text-center">All</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {moduleData.features.map(feature => {
                                      const perms = formData.permissions[feature.id] || {};
                                      return (
                                        <TableRow key={feature.id} className="bg-white">
                                          <TableCell className="font-medium">{feature.name}</TableCell>
                                          <TableCell className="text-center">
                                            {feature.crud.includes('create') ? (
                                              <Checkbox 
                                                checked={perms.create || false}
                                                onCheckedChange={() => togglePermission(feature.id, 'create')}
                                              />
                                            ) : (
                                              <span className="text-slate-300">-</span>
                                            )}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            {feature.crud.includes('read') ? (
                                              <Checkbox 
                                                checked={perms.read || false}
                                                onCheckedChange={() => togglePermission(feature.id, 'read')}
                                              />
                                            ) : (
                                              <span className="text-slate-300">-</span>
                                            )}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            {feature.crud.includes('update') ? (
                                              <Checkbox 
                                                checked={perms.update || false}
                                                onCheckedChange={() => togglePermission(feature.id, 'update')}
                                              />
                                            ) : (
                                              <span className="text-slate-300">-</span>
                                            )}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            {feature.crud.includes('delete') ? (
                                              <Checkbox 
                                                checked={perms.delete || false}
                                                onCheckedChange={() => togglePermission(feature.id, 'delete')}
                                              />
                                            ) : (
                                              <span className="text-slate-300">-</span>
                                            )}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            <Switch
                                              checked={hasAllPermissions(feature.id, feature)}
                                              onCheckedChange={(checked) => setAllPermissionsForFeature(feature.id, feature, checked)}
                                            />
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                </Table>
                              </div>
                            </CollapsibleContent>
                          </div>
                        </Collapsible>
                      ))}
                    </div>
                  </ScrollArea>
                </>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4 pt-4 border-t">
            <Button variant="outline" onClick={() => setUserModal({ open: false, user: null, mode: 'create' })}>
              Cancel
            </Button>
            <Button className="bg-lime-500 hover:bg-lime-600" onClick={saveUser}>
              {userModal.mode === 'create' ? 'Create User' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Delete User
            </DialogTitle>
          </DialogHeader>
          <p className="text-slate-600">
            Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteUser(deleteConfirm)}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}