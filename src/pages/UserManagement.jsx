import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { 
  Search, Shield, Crown, Users, Building2, Eye, Lock, 
  CheckCircle2, XCircle, User, ChevronLeft, Star, Briefcase
} from 'lucide-react';

// All Features with CRUD
const ALL_FEATURES = [
  // Dashboard
  { id: 'dashboard.view', name: 'View Dashboard', module: 'Dashboard', crud: ['C', 'R', 'U', 'D'] },
  { id: 'dashboard.widgets', name: 'Manage Widgets', module: 'Dashboard', crud: ['C', 'R', 'U', 'D'] },
  { id: 'dashboard.export', name: 'Export Reports', module: 'Dashboard', crud: ['C', 'R', 'U', 'D'] },
  // CRM
  { id: 'crm.contacts', name: 'Contacts', module: 'CRM', crud: ['C', 'R', 'U', 'D'] },
  { id: 'crm.leads', name: 'Leads', module: 'CRM', crud: ['C', 'R', 'U', 'D'] },
  { id: 'crm.opportunities', name: 'Opportunities', module: 'CRM', crud: ['C', 'R', 'U', 'D'] },
  // Sales
  { id: 'sales.orders', name: 'Sales Orders', module: 'Sales', crud: ['C', 'R', 'U', 'D'] },
  { id: 'sales.quotations', name: 'Quotations', module: 'Sales', crud: ['C', 'R', 'U', 'D'] },
  { id: 'sales.invoices', name: 'Invoices', module: 'Sales', crud: ['C', 'R', 'U', 'D'] },
  // Finance
  { id: 'finance.ledger', name: 'General Ledger', module: 'Finance', crud: ['C', 'R', 'U', 'D'] },
  { id: 'finance.reconciliation', name: 'Bank Reconciliation', module: 'Finance', crud: ['C', 'R', 'U', 'D'] },
  { id: 'finance.budgets', name: 'Budgets', module: 'Finance', crud: ['C', 'R', 'U', 'D'] },
  { id: 'finance.gst', name: 'GST Reports', module: 'Finance', crud: ['C', 'R', 'U', 'D'] },
  // HR
  { id: 'hr.employees', name: 'Employee Management', module: 'HR', crud: ['C', 'R', 'U', 'D'] },
  { id: 'hr.leave', name: 'Leave Management', module: 'HR', crud: ['C', 'R', 'U', 'D'] },
  { id: 'hr.kpi', name: 'KPI Management', module: 'HR', crud: ['C', 'R', 'U', 'D'] },
  { id: 'hr.payroll', name: 'Payroll', module: 'HR', crud: ['C', 'R', 'U', 'D'] },
  // Inventory
  { id: 'inventory.items', name: 'Inventory Items', module: 'Inventory', crud: ['C', 'R', 'U', 'D'] },
  { id: 'inventory.stock', name: 'Stock Management', module: 'Inventory', crud: ['C', 'R', 'U', 'D'] },
  { id: 'inventory.warehouse', name: 'Warehouse', module: 'Inventory', crud: ['C', 'R', 'U', 'D'] },
  // Procurement
  { id: 'procurement.po', name: 'Purchase Orders', module: 'Procurement', crud: ['C', 'R', 'U', 'D'] },
  { id: 'procurement.rfq', name: 'RFQ', module: 'Procurement', crud: ['C', 'R', 'U', 'D'] },
  // Vendors
  { id: 'vendors.manage', name: 'Vendor Management', module: 'Vendors', crud: ['C', 'R', 'U', 'D'] },
  // Marketing
  { id: 'marketing.campaigns', name: 'Campaigns', module: 'Marketing', crud: ['C', 'R', 'U', 'D'] },
  { id: 'marketing.analytics', name: 'Analytics', module: 'Marketing', crud: ['C', 'R', 'U', 'D'] },
  // Projects
  { id: 'projects.manage', name: 'Project Management', module: 'Projects', crud: ['C', 'R', 'U', 'D'] },
  { id: 'projects.tasks', name: 'Tasks', module: 'Projects', crud: ['C', 'R', 'U', 'D'] },
  // Documents
  { id: 'documents.manage', name: 'Document Management', module: 'Documents', crud: ['C', 'R', 'U', 'D'] },
  { id: 'documents.share', name: 'Share Documents', module: 'Documents', crud: ['C', 'R', 'U', 'D'] },
  // Settings
  { id: 'settings.company', name: 'Company Settings', module: 'Settings', crud: ['C', 'R', 'U', 'D'] },
  { id: 'settings.users', name: 'User Management', module: 'Settings', crud: ['C', 'R', 'U', 'D'] },
  { id: 'settings.security', name: 'Security Settings', module: 'Settings', crud: ['C', 'R', 'U', 'D'] },
  // Admin
  { id: 'admin.all', name: 'Full Admin Access', module: 'Super Admin', crud: ['C', 'R', 'U', 'D'] },
  { id: 'admin.audit', name: 'Audit Logs', module: 'Super Admin', crud: ['C', 'R', 'U', 'D'] },
  { id: 'admin.permissions', name: 'Permission Management', module: 'Super Admin', crud: ['C', 'R', 'U', 'D'] },
];

// Comprehensive user dummy data
const sampleUsers = [
  // ============ SUPER ADMINS ============
  { 
    id: '1', 
    email: 'net28528@gmail.com', 
    name: 'Nethanial Tan', 
    role: 'super_admin', 
    department: 'Executive', 
    managedDepartments: ['All'],
    status: 'active', 
    protected: true,
    specialAccess: [],
    permissions: 'FULL' // Full access indicator
  },
  { 
    id: '2', 
    email: 'alex.admin@arkfinex.com', 
    name: 'Alex Administrator', 
    role: 'super_admin', 
    department: 'Executive', 
    managedDepartments: ['All'],
    status: 'active', 
    protected: false,
    specialAccess: [],
    permissions: 'FULL'
  },

  // ============ PLATFORM ADMINS ============
  { 
    id: '3', 
    email: 'patricia.admin@arkfinex.com', 
    name: 'Patricia Admin', 
    role: 'platform_admin', 
    department: 'IT',
    managedDepartments: [],
    status: 'active', 
    protected: false,
    specialAccess: ['Security Settings Override', 'User Impersonation'],
    permissions: {
      'admin.all': { C: true, R: true, U: true, D: false },
      'admin.audit': { C: false, R: true, U: false, D: false },
      'admin.permissions': { C: true, R: true, U: true, D: false },
      'settings.company': { C: false, R: true, U: true, D: false },
      'settings.users': { C: true, R: true, U: true, D: true },
      'settings.security': { C: true, R: true, U: true, D: false },
      'dashboard.view': { C: false, R: true, U: false, D: false },
    }
  },

  // ============ DEPARTMENT HEADS ============
  { 
    id: '4', 
    email: 'sarah.chen@arkfinex.com', 
    name: 'Sarah Chen (CFO)', 
    role: 'department_head', 
    department: 'Finance',
    managedDepartments: ['Finance', 'Compliance'],
    status: 'active', 
    protected: false,
    specialAccess: ['Budget Approval > $100K', 'GST Filing Authority'],
    permissions: {
      'finance.ledger': { C: true, R: true, U: true, D: true },
      'finance.reconciliation': { C: true, R: true, U: true, D: true },
      'finance.budgets': { C: true, R: true, U: true, D: true },
      'finance.gst': { C: true, R: true, U: true, D: true },
      'dashboard.view': { C: false, R: true, U: false, D: false },
      'dashboard.widgets': { C: true, R: true, U: true, D: true },
      'dashboard.export': { C: true, R: true, U: false, D: false },
      'admin.audit': { C: false, R: true, U: false, D: false },
    }
  },
  { 
    id: '5', 
    email: 'john.smith@arkfinex.com', 
    name: 'John Smith (Sales Director)', 
    role: 'department_head', 
    department: 'Sales',
    managedDepartments: ['Sales', 'Marketing'],
    status: 'active', 
    protected: false,
    specialAccess: ['Discount Approval > 30%', 'Contract Signing Authority'],
    permissions: {
      'sales.orders': { C: true, R: true, U: true, D: true },
      'sales.quotations': { C: true, R: true, U: true, D: true },
      'sales.invoices': { C: true, R: true, U: true, D: true },
      'crm.contacts': { C: true, R: true, U: true, D: true },
      'crm.leads': { C: true, R: true, U: true, D: true },
      'crm.opportunities': { C: true, R: true, U: true, D: true },
      'marketing.campaigns': { C: true, R: true, U: true, D: false },
      'marketing.analytics': { C: false, R: true, U: false, D: false },
      'dashboard.view': { C: false, R: true, U: false, D: false },
      'dashboard.export': { C: true, R: true, U: false, D: false },
    }
  },
  { 
    id: '6', 
    email: 'linda.wong@arkfinex.com', 
    name: 'Linda Wong (HR Director)', 
    role: 'department_head', 
    department: 'HR',
    managedDepartments: ['HR'],
    status: 'active', 
    protected: false,
    specialAccess: ['Salary Access All Levels', 'Termination Authority'],
    permissions: {
      'hr.employees': { C: true, R: true, U: true, D: true },
      'hr.leave': { C: true, R: true, U: true, D: true },
      'hr.kpi': { C: true, R: true, U: true, D: true },
      'hr.payroll': { C: true, R: true, U: true, D: false },
      'dashboard.view': { C: false, R: true, U: false, D: false },
      'documents.manage': { C: true, R: true, U: true, D: true },
      'documents.share': { C: true, R: true, U: false, D: false },
    }
  },
  { 
    id: '7', 
    email: 'david.lee@arkfinex.com', 
    name: 'David Lee (IT Director)', 
    role: 'department_head', 
    department: 'IT',
    managedDepartments: ['IT'],
    status: 'active', 
    protected: false,
    specialAccess: ['System Configuration', 'API Access Management'],
    permissions: {
      'settings.company': { C: false, R: true, U: true, D: false },
      'settings.users': { C: true, R: true, U: true, D: false },
      'settings.security': { C: true, R: true, U: true, D: false },
      'documents.manage': { C: true, R: true, U: true, D: true },
      'documents.share': { C: true, R: true, U: true, D: true },
      'dashboard.view': { C: false, R: true, U: false, D: false },
      'admin.audit': { C: false, R: true, U: false, D: false },
    }
  },
  { 
    id: '8', 
    email: 'maria.garcia@arkfinex.com', 
    name: 'Maria Garcia (Marketing Head)', 
    role: 'department_head', 
    department: 'Marketing',
    managedDepartments: ['Marketing'],
    status: 'active', 
    protected: false,
    specialAccess: ['Campaign Budget $50K'],
    permissions: {
      'marketing.campaigns': { C: true, R: true, U: true, D: true },
      'marketing.analytics': { C: true, R: true, U: false, D: false },
      'crm.contacts': { C: true, R: true, U: true, D: false },
      'crm.leads': { C: true, R: true, U: true, D: false },
      'dashboard.view': { C: false, R: true, U: false, D: false },
    }
  },
  { 
    id: '9', 
    email: 'robert.tan@arkfinex.com', 
    name: 'Robert Tan (Operations Head)', 
    role: 'department_head', 
    department: 'Operations',
    managedDepartments: ['Operations', 'Warehouse'],
    status: 'active', 
    protected: false,
    specialAccess: ['Inventory Write-off $10K', 'Vendor Approval'],
    permissions: {
      'inventory.items': { C: true, R: true, U: true, D: true },
      'inventory.stock': { C: true, R: true, U: true, D: true },
      'inventory.warehouse': { C: true, R: true, U: true, D: true },
      'procurement.po': { C: true, R: true, U: true, D: true },
      'procurement.rfq': { C: true, R: true, U: true, D: true },
      'vendors.manage': { C: true, R: true, U: true, D: true },
      'dashboard.view': { C: false, R: true, U: false, D: false },
    }
  },

  // ============ MANAGERS ============
  { 
    id: '10', 
    email: 'james.koh@arkfinex.com', 
    name: 'James Koh (Sales Manager)', 
    role: 'manager', 
    department: 'Sales',
    managedDepartments: [],
    status: 'active', 
    protected: false,
    specialAccess: ['Discount Approval up to 15%'],
    permissions: {
      'sales.orders': { C: true, R: true, U: true, D: false },
      'sales.quotations': { C: true, R: true, U: true, D: false },
      'sales.invoices': { C: true, R: true, U: true, D: false },
      'crm.contacts': { C: true, R: true, U: true, D: false },
      'crm.leads': { C: true, R: true, U: true, D: false },
      'dashboard.view': { C: false, R: true, U: false, D: false },
    }
  },
  { 
    id: '11', 
    email: 'emily.lim@arkfinex.com', 
    name: 'Emily Lim (Finance Manager)', 
    role: 'manager', 
    department: 'Finance',
    managedDepartments: [],
    status: 'active', 
    protected: false,
    specialAccess: ['Expense Approval $5K'],
    permissions: {
      'finance.ledger': { C: true, R: true, U: true, D: false },
      'finance.reconciliation': { C: true, R: true, U: true, D: false },
      'finance.budgets': { C: true, R: true, U: false, D: false },
      'finance.gst': { C: false, R: true, U: false, D: false },
      'dashboard.view': { C: false, R: true, U: false, D: false },
    }
  },
  { 
    id: '12', 
    email: 'tom.chen@arkfinex.com', 
    name: 'Tom Chen (Warehouse Manager)', 
    role: 'manager', 
    department: 'Operations',
    managedDepartments: [],
    status: 'active', 
    protected: false,
    specialAccess: ['Stock Adjustment $2K'],
    permissions: {
      'inventory.items': { C: true, R: true, U: true, D: false },
      'inventory.stock': { C: true, R: true, U: true, D: false },
      'inventory.warehouse': { C: true, R: true, U: true, D: false },
      'procurement.po': { C: true, R: true, U: false, D: false },
      'dashboard.view': { C: false, R: true, U: false, D: false },
    }
  },

  // ============ STANDARD USERS ============
  { 
    id: '13', 
    email: 'mike.johnson@arkfinex.com', 
    name: 'Mike Johnson', 
    role: 'user', 
    department: 'Sales',
    managedDepartments: [],
    status: 'active', 
    protected: false,
    specialAccess: [],
    permissions: {
      'sales.orders': { C: true, R: true, U: false, D: false },
      'sales.quotations': { C: true, R: true, U: true, D: false },
      'crm.contacts': { C: false, R: true, U: false, D: false },
      'dashboard.view': { C: false, R: true, U: false, D: false },
    }
  },
  { 
    id: '14', 
    email: 'anna.lee@arkfinex.com', 
    name: 'Anna Lee', 
    role: 'user', 
    department: 'Sales',
    managedDepartments: [],
    status: 'active', 
    protected: false,
    specialAccess: ['Lead Import Access'],
    permissions: {
      'sales.orders': { C: true, R: true, U: false, D: false },
      'sales.quotations': { C: true, R: true, U: false, D: false },
      'crm.contacts': { C: false, R: true, U: false, D: false },
      'crm.leads': { C: true, R: true, U: true, D: false },
      'dashboard.view': { C: false, R: true, U: false, D: false },
    }
  },
  { 
    id: '15', 
    email: 'kevin.ng@arkfinex.com', 
    name: 'Kevin Ng', 
    role: 'user', 
    department: 'Finance',
    managedDepartments: [],
    status: 'active', 
    protected: false,
    specialAccess: [],
    permissions: {
      'finance.ledger': { C: false, R: true, U: false, D: false },
      'finance.reconciliation': { C: true, R: true, U: false, D: false },
      'finance.gst': { C: false, R: true, U: false, D: false },
      'dashboard.view': { C: false, R: true, U: false, D: false },
    }
  },
  { 
    id: '16', 
    email: 'grace.tan@arkfinex.com', 
    name: 'Grace Tan', 
    role: 'user', 
    department: 'HR',
    managedDepartments: [],
    status: 'active', 
    protected: false,
    specialAccess: ['Own Leave Management'],
    permissions: {
      'hr.employees': { C: false, R: true, U: false, D: false },
      'hr.leave': { C: true, R: true, U: true, D: false },
      'documents.manage': { C: true, R: true, U: false, D: false },
      'dashboard.view': { C: false, R: true, U: false, D: false },
    }
  },
  { 
    id: '17', 
    email: 'peter.wong@arkfinex.com', 
    name: 'Peter Wong', 
    role: 'user', 
    department: 'Operations',
    managedDepartments: [],
    status: 'active', 
    protected: false,
    specialAccess: ['Goods Receipt Entry'],
    permissions: {
      'inventory.items': { C: false, R: true, U: true, D: false },
      'inventory.stock': { C: true, R: true, U: true, D: false },
      'procurement.po': { C: true, R: true, U: false, D: false },
      'dashboard.view': { C: false, R: true, U: false, D: false },
    }
  },
  { 
    id: '18', 
    email: 'jessica.lim@arkfinex.com', 
    name: 'Jessica Lim', 
    role: 'user', 
    department: 'Marketing',
    managedDepartments: [],
    status: 'active', 
    protected: false,
    specialAccess: ['Social Media Posting'],
    permissions: {
      'marketing.campaigns': { C: true, R: true, U: true, D: false },
      'marketing.analytics': { C: false, R: true, U: false, D: false },
      'crm.leads': { C: true, R: true, U: false, D: false },
      'dashboard.view': { C: false, R: true, U: false, D: false },
    }
  },
  { 
    id: '19', 
    email: 'daniel.chen@arkfinex.com', 
    name: 'Daniel Chen', 
    role: 'user', 
    department: 'IT',
    managedDepartments: [],
    status: 'active', 
    protected: false,
    specialAccess: ['Backup Management'],
    permissions: {
      'documents.manage': { C: true, R: true, U: true, D: false },
      'documents.share': { C: true, R: true, U: false, D: false },
      'settings.company': { C: false, R: true, U: false, D: false },
      'dashboard.view': { C: false, R: true, U: false, D: false },
    }
  },
  { 
    id: '20', 
    email: 'susan.ho@arkfinex.com', 
    name: 'Susan Ho', 
    role: 'user', 
    department: 'Customer Service',
    managedDepartments: [],
    status: 'active', 
    protected: false,
    specialAccess: ['Ticket Escalation'],
    permissions: {
      'crm.contacts': { C: false, R: true, U: true, D: false },
      'crm.leads': { C: false, R: true, U: false, D: false },
      'dashboard.view': { C: false, R: true, U: false, D: false },
    }
  },
];

const ROLE_CONFIG = {
  super_admin: { icon: Crown, color: 'bg-red-500', name: 'Super Admin' },
  platform_admin: { icon: Shield, color: 'bg-orange-500', name: 'Platform Admin' },
  department_head: { icon: Building2, color: 'bg-purple-500', name: 'Dept Head' },
  manager: { icon: Briefcase, color: 'bg-blue-500', name: 'Manager' },
  user: { icon: User, color: 'bg-green-500', name: 'User' },
};

const departments = ['Executive', 'Sales', 'Finance', 'HR', 'IT', 'Marketing', 'Operations', 'Compliance', 'Customer Service', 'Warehouse'];

export default function UserManagement() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterDept, setFilterDept] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const filteredUsers = sampleUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    const matchesDept = filterDept === 'all' || u.department === filterDept;
    return matchesSearch && matchesRole && matchesDept;
  });

  const modules = [...new Set(ALL_FEATURES.map(f => f.module))];

  const getPermissionIcon = (val) => {
    if (val) return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    return <XCircle className="w-4 h-4 text-slate-300" />;
  };

  const getUserPermission = (user, featureId, action) => {
    if (user.permissions === 'FULL') return true;
    const perms = user.permissions?.[featureId];
    return perms?.[action] || false;
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-6 h-6 text-lime-600" />
              User Access & Permissions Management
            </h1>
            <p className="text-slate-500">Manage users, roles, departments and detailed CRUD permissions</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">User Overview</TabsTrigger>
              <TabsTrigger value="matrix">Full Permission Matrix</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>All Users ({filteredUsers.length})</CardTitle>
                    <div className="flex gap-2">
                      {Object.entries(ROLE_CONFIG).map(([key, config]) => (
                        <Badge key={key} variant="outline" className="text-xs">
                          <config.icon className="w-3 h-3 mr-1" />
                          {config.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
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
                      <SelectTrigger className="w-44">
                        <SelectValue placeholder="All Roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        {Object.entries(ROLE_CONFIG).map(([key, config]) => (
                          <SelectItem key={key} value={key}>{config.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={filterDept} onValueChange={setFilterDept}>
                      <SelectTrigger className="w-44">
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

                  {/* Users Table */}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Managed Depts</TableHead>
                        <TableHead>Special Access</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead className="w-20">View</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map(user => {
                        const roleConfig = ROLE_CONFIG[user.role];
                        const permCount = user.permissions === 'FULL' ? 'FULL' : Object.keys(user.permissions).length;
                        return (
                          <TableRow key={user.id} className="hover:bg-slate-50">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                  <AvatarFallback className={user.protected ? 'bg-amber-100 text-amber-700' : 'bg-slate-100'}>
                                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-sm">{user.name}</p>
                                    {user.protected && (
                                      <Badge className="bg-amber-100 text-amber-700 text-[9px] px-1">
                                        <Lock className="w-2 h-2 mr-0.5" />
                                        OWNER
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-500">{user.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${roleConfig.color} text-white text-xs`}>
                                <roleConfig.icon className="w-3 h-3 mr-1" />
                                {roleConfig.name}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{user.department}</Badge>
                            </TableCell>
                            <TableCell>
                              {user.managedDepartments?.length > 0 ? (
                                <div className="flex gap-1 flex-wrap">
                                  {user.managedDepartments.map(d => (
                                    <Badge key={d} className="bg-purple-100 text-purple-700 text-[10px]">
                                      {d}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {user.specialAccess?.length > 0 ? (
                                <div className="flex gap-1 flex-wrap">
                                  {user.specialAccess.map((s, i) => (
                                    <Badge key={i} className="bg-amber-100 text-amber-700 text-[10px]">
                                      <Star className="w-2 h-2 mr-0.5" />
                                      {s}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge className={permCount === 'FULL' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}>
                                {permCount === 'FULL' ? 'Full Access' : `${permCount} features`}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Full Permission Matrix Tab */}
            <TabsContent value="matrix">
              <Card>
                <CardHeader>
                  <CardTitle>Full CRUD Permission Matrix</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    {modules.map(module => {
                      const moduleFeatures = ALL_FEATURES.filter(f => f.module === module);
                      return (
                        <div key={module} className="mb-6">
                          <h3 className="font-bold text-sm text-slate-700 mb-2 bg-slate-100 p-2 rounded">{module}</h3>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-40">Feature</TableHead>
                                {filteredUsers.slice(0, 10).map(u => (
                                  <TableHead key={u.id} className="text-center text-[10px] px-1">
                                    <div className="flex flex-col items-center">
                                      <span className="font-medium truncate max-w-[60px]">{u.name.split(' ')[0]}</span>
                                      <Badge className={`${ROLE_CONFIG[u.role].color} text-white text-[8px] px-1 mt-0.5`}>
                                        {u.role.slice(0, 3).toUpperCase()}
                                      </Badge>
                                    </div>
                                  </TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {moduleFeatures.map(feature => (
                                <TableRow key={feature.id}>
                                  <TableCell className="font-medium text-xs">{feature.name}</TableCell>
                                  {filteredUsers.slice(0, 10).map(user => {
                                    const c = getUserPermission(user, feature.id, 'C');
                                    const r = getUserPermission(user, feature.id, 'R');
                                    const u = getUserPermission(user, feature.id, 'U');
                                    const d = getUserPermission(user, feature.id, 'D');
                                    return (
                                      <TableCell key={user.id} className="text-center px-1">
                                        <div className="flex justify-center gap-0.5">
                                          <span className={`text-[9px] font-bold ${c ? 'text-green-600' : 'text-slate-300'}`}>C</span>
                                          <span className={`text-[9px] font-bold ${r ? 'text-blue-600' : 'text-slate-300'}`}>R</span>
                                          <span className={`text-[9px] font-bold ${u ? 'text-amber-600' : 'text-slate-300'}`}>U</span>
                                          <span className={`text-[9px] font-bold ${d ? 'text-red-600' : 'text-slate-300'}`}>D</span>
                                        </div>
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      );
                    })}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* User Detail Modal */}
          <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {selectedUser && (
                    <>
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className={selectedUser.protected ? 'bg-amber-100' : 'bg-slate-100'}>
                          {selectedUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold">{selectedUser.name}</p>
                        <p className="text-sm text-slate-500 font-normal">{selectedUser.email}</p>
                      </div>
                    </>
                  )}
                </DialogTitle>
              </DialogHeader>
              
              {selectedUser && (
                <ScrollArea className="flex-1">
                  <div className="space-y-4 pr-4">
                    {/* User Info */}
                    <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-xs text-slate-500">Role</p>
                        <Badge className={`${ROLE_CONFIG[selectedUser.role].color} text-white mt-1`}>
                          {ROLE_CONFIG[selectedUser.role].name}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Department</p>
                        <Badge variant="outline" className="mt-1">{selectedUser.department}</Badge>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Managed Depts</p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {selectedUser.managedDepartments?.length > 0 ? (
                            selectedUser.managedDepartments.map(d => (
                              <Badge key={d} className="bg-purple-100 text-purple-700 text-[10px]">{d}</Badge>
                            ))
                          ) : (
                            <span className="text-slate-400 text-sm">None</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Special Access</p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {selectedUser.specialAccess?.length > 0 ? (
                            selectedUser.specialAccess.map((s, i) => (
                              <Badge key={i} className="bg-amber-100 text-amber-700 text-[10px]">{s}</Badge>
                            ))
                          ) : (
                            <span className="text-slate-400 text-sm">None</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Full CRUD Table */}
                    <div>
                      <h3 className="font-bold text-sm mb-3">Detailed Feature Permissions (CRUD)</h3>
                      {selectedUser.permissions === 'FULL' ? (
                        <div className="p-6 bg-red-50 rounded-lg text-center">
                          <Crown className="w-12 h-12 text-red-500 mx-auto mb-2" />
                          <p className="font-bold text-red-700">Super Admin - Full Access</p>
                          <p className="text-sm text-red-600">Has all CRUD permissions on all features</p>
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-slate-100">
                              <TableHead>Module</TableHead>
                              <TableHead>Feature</TableHead>
                              <TableHead className="text-center w-20">Create</TableHead>
                              <TableHead className="text-center w-20">Read</TableHead>
                              <TableHead className="text-center w-20">Update</TableHead>
                              <TableHead className="text-center w-20">Delete</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {ALL_FEATURES.filter(f => selectedUser.permissions[f.id]).map(feature => {
                              const perms = selectedUser.permissions[feature.id] || {};
                              return (
                                <TableRow key={feature.id}>
                                  <TableCell>
                                    <Badge variant="outline" className="text-[10px]">{feature.module}</Badge>
                                  </TableCell>
                                  <TableCell className="font-medium">{feature.name}</TableCell>
                                  <TableCell className="text-center">{getPermissionIcon(perms.C)}</TableCell>
                                  <TableCell className="text-center">{getPermissionIcon(perms.R)}</TableCell>
                                  <TableCell className="text-center">{getPermissionIcon(perms.U)}</TableCell>
                                  <TableCell className="text-center">{getPermissionIcon(perms.D)}</TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      )}
                    </div>
                  </div>
                </ScrollArea>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}