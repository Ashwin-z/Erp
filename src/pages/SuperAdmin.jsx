import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Shield, Building2, Users, Key, Settings, Server,
  Activity, AlertTriangle, CheckCircle2, Lock, Unlock,
  Crown, Search, Plus, Edit, Trash2, Mail, Eye, Bell
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ModuleDashboard from '@/components/modules/ModuleDashboard';
import RolePermissionMatrix from '@/components/admin/RolePermissionMatrix';
import SaaSPlanManager from '@/components/admin/SaaSPlanManager';
import DepartmentManager from '@/components/admin/DepartmentManager';
import OwnerSettings from '@/components/admin/OwnerSettings';
import SuperAdminManager from '@/components/admin/SuperAdminManager';
import DepartmentAccessManager from '@/components/admin/DepartmentAccessManager';
import PermissionRequestManager from '@/components/admin/PermissionRequestManager';
import UserAccessManager from '@/components/admin/UserAccessManager';
import AuditReports from '@/components/admin/AuditReports';
import PermissionAIAssistant from '@/components/admin/PermissionAIAssistant';
import RoleDashboard from '@/components/admin/RoleDashboard';
import ScheduledReports from '@/components/admin/ScheduledReports';
import NotificationCenter from '@/components/admin/NotificationCenter';
import RoleTemplates from '@/components/admin/RoleTemplates';
import AccessReviewProcess from '@/components/admin/AccessReviewProcess';
import UserOnboarding from '@/components/admin/UserOnboarding';

const SUPER_ADMIN_EMAIL = 'net28528@gmail.com';

const modules = [
  { id: 'crm', name: 'CRM', description: 'Customer Relationship Management' },
  { id: 'sales', name: 'Sales', description: 'Sales orders and quotations' },
  { id: 'procurement', name: 'Procurement', description: 'Purchase orders and vendors' },
  { id: 'inventory', name: 'Inventory', description: 'Stock management' },
  { id: 'finance', name: 'Finance', description: 'Accounting and GL' },
  { id: 'hr', name: 'HR', description: 'Human resources management' },
  { id: 'calendar', name: 'Calendar', description: 'AI-powered scheduling' },
  { id: 'pos', name: 'POS', description: 'Point of sale' },
  { id: 'wallet', name: 'Wallet', description: 'Multi-wallet system' },
  { id: 'blockchain', name: 'Blockchain', description: 'Transaction anchoring' },
  { id: 'esg', name: 'ESG', description: 'Sustainability tracking' },
  { id: 'pdpa', name: 'PDPA', description: 'Data protection compliance' }
];

export default function SuperAdmin() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentRole, setCurrentRole] = useState('super_admin');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const stats = [
    { label: 'Total Tenants', value: 156, icon: Building2, color: 'bg-blue-500', trend: 12 },
    { label: 'Active Users', value: 2340, icon: Users, color: 'bg-lime-500', trend: 8 },
    { label: 'API Requests', value: '1.2M', icon: Activity, color: 'bg-purple-500', trend: 15 },
    { label: 'Security Alerts', value: 3, icon: AlertTriangle, color: 'bg-amber-500', trend: -50 }
  ];

  const tenants = [
    { id: 1, name: 'TechStart Pte Ltd', slug: 'techstart', plan: 'enterprise', status: 'active', users: 45, modules: 12, owner: 'john@techstart.com' },
    { id: 2, name: 'Marina Foods', slug: 'marina', plan: 'professional', status: 'active', users: 23, modules: 8, owner: 'sarah@marina.com' },
    { id: 3, name: 'Global Logistics', slug: 'global-log', plan: 'basic', status: 'trial', users: 5, modules: 4, owner: 'mike@globallog.com' },
    { id: 4, name: 'Urban Retail', slug: 'urban', plan: 'professional', status: 'active', users: 18, modules: 7, owner: 'anna@urban.com' },
    { id: 5, name: 'Skyline Properties', slug: 'skyline', plan: 'enterprise', status: 'suspended', users: 0, modules: 12, owner: 'david@skyline.com' }
  ];

  const users = [
    { email: SUPER_ADMIN_EMAIL, name: 'Nethanial Tan', role: 'super_admin', status: 'active', protected: true, lastLogin: '2024-12-20 10:30' },
    { email: 'admin@arkfinex.com', name: 'Platform Admin', role: 'platform_admin', status: 'active', protected: false, lastLogin: '2024-12-20 09:15' },
    { email: 'john@techstart.com', name: 'John Smith', role: 'department_head', status: 'active', protected: false, lastLogin: '2024-12-19 14:22' },
    { email: 'sarah@marina.com', name: 'Sarah Chen', role: 'user', status: 'active', protected: false, lastLogin: '2024-12-20 08:45' }
  ];

  const planColors = {
    basic: 'bg-slate-100 text-slate-700',
    professional: 'bg-blue-100 text-blue-700',
    enterprise: 'bg-purple-100 text-purple-700'
  };

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    trial: 'bg-amber-100 text-amber-700',
    suspended: 'bg-red-100 text-red-700',
    pending: 'bg-blue-100 text-blue-700'
  };

  const roleColors = {
    super_admin: 'bg-red-100 text-red-700',
    platform_admin: 'bg-purple-100 text-purple-700',
    department_head: 'bg-blue-100 text-blue-700',
    user: 'bg-green-100 text-green-700',
    guest: 'bg-slate-100 text-slate-700'
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
            className="max-w-[1800px] mx-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Super Admin Console</h1>
                  <p className="text-slate-500">Platform: ARKFinex • Owner: Nethanial Tan</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setNotificationsOpen(true)}>
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                  <Badge className="ml-2 bg-red-500 text-white">3</Badge>
                </Button>
                <Badge className="bg-red-100 text-red-700 px-3 py-1">
                  <Lock className="w-3 h-3 mr-1" />
                  Protected: {SUPER_ADMIN_EMAIL}
                </Badge>
              </div>
            </div>

            {/* Dashboard Stats */}
            <ModuleDashboard stats={stats} />

            {/* Server Status */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {['Production', 'Testing', 'Mirror'].map((server, i) => (
                <Card key={server}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Server className={`w-5 h-5 ${i === 0 ? 'text-green-500' : i === 1 ? 'text-amber-500' : 'text-blue-500'}`} />
                        <div>
                          <p className="font-medium">{server} Server</p>
                          <p className="text-xs text-slate-500">Last sync: 2 mins ago</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Online
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 flex-wrap">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="owner">Owner</TabsTrigger>
                <TabsTrigger value="superadmins">Super Admins</TabsTrigger>
                <TabsTrigger value="useraccess">User Access</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="reviews">Access Reviews</TabsTrigger>
                <TabsTrigger value="tenants">Tenants</TabsTrigger>
                <TabsTrigger value="users">Users & Roles</TabsTrigger>
                <TabsTrigger value="departments">Departments</TabsTrigger>
                <TabsTrigger value="access">Dept Access</TabsTrigger>
                <TabsTrigger value="requests">Requests</TabsTrigger>
                <TabsTrigger value="plans">SaaS Plans</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
                <TabsTrigger value="audit">Audit Reports</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="ai">AI Assistant</TabsTrigger>
                <TabsTrigger value="modules">Modules</TabsTrigger>
                <TabsTrigger value="api">API Keys</TabsTrigger>
              </TabsList>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard">
                <div className="mb-4">
                  <Select value={currentRole} onValueChange={setCurrentRole}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="View as role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super_admin">Super Admin View</SelectItem>
                      <SelectItem value="department_head">Department Head View</SelectItem>
                      <SelectItem value="security_analyst">Security Analyst View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <RoleDashboard role={currentRole} />
              </TabsContent>

              {/* Owner Tab */}
              <TabsContent value="owner">
                <OwnerSettings tenantId={activeCompany} />
              </TabsContent>

              {/* Super Admins Tab */}
              <TabsContent value="superadmins">
                <SuperAdminManager tenantId={activeCompany} />
              </TabsContent>

              {/* User Access Tab */}
              <TabsContent value="useraccess">
                <UserAccessManager tenantId={activeCompany} />
                <div className="mt-4">
                  <Button variant="outline" onClick={() => setOnboardingOpen(true)}>
                    Preview User Onboarding Flow
                  </Button>
                </div>
              </TabsContent>

              {/* Role Templates Tab */}
              <TabsContent value="templates">
                <RoleTemplates onSelectTemplate={setSelectedTemplate} />
              </TabsContent>

              {/* Access Reviews Tab */}
              <TabsContent value="reviews">
                <AccessReviewProcess tenantId={activeCompany} />
              </TabsContent>

              {/* Tenants Tab */}
              <TabsContent value="tenants">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Tenant Management</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input placeholder="Search tenants..." className="pl-10 w-64" />
                      </div>
                      <Button className="bg-lime-500 hover:bg-lime-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Tenant
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tenant</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead>Plan</TableHead>
                          <TableHead>Users</TableHead>
                          <TableHead>Modules</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tenants.map((tenant) => (
                          <TableRow key={tenant.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{tenant.name}</p>
                                <p className="text-xs text-slate-500 font-mono">{tenant.slug}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{tenant.owner}</TableCell>
                            <TableCell>
                              <Badge className={planColors[tenant.plan]}>{tenant.plan}</Badge>
                            </TableCell>
                            <TableCell>{tenant.users}</TableCell>
                            <TableCell>{tenant.modules}/12</TableCell>
                            <TableCell>
                              <Badge className={statusColors[tenant.status]}>{tenant.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon"><Settings className="w-4 h-4" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>User Management</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Mail className="w-4 h-4 mr-2" />
                        Invite User
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Last Login</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.email}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {user.protected && <Lock className="w-4 h-4 text-red-500" />}
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-xs text-slate-500">{user.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={roleColors[user.role]}>
                                {user.role.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={statusColors[user.status]}>{user.status}</Badge>
                            </TableCell>
                            <TableCell className="text-sm text-slate-500">{user.lastLogin}</TableCell>
                            <TableCell>
                              {!user.protected ? (
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button>
                                  <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                </div>
                              ) : (
                                <Badge className="bg-red-50 text-red-600 text-xs">Protected</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Departments Tab */}
              <TabsContent value="departments">
                <DepartmentManager />
              </TabsContent>

              {/* Department Access Tab */}
              <TabsContent value="access">
                <DepartmentAccessManager tenantId={activeCompany} />
              </TabsContent>

              {/* Permission Requests Tab */}
              <TabsContent value="requests">
                <PermissionRequestManager tenantId={activeCompany} />
              </TabsContent>

              {/* SaaS Plans Tab */}
              <TabsContent value="plans">
                <SaaSPlanManager 
                  currentPlan="enterprise"
                  onUpgrade={(plan) => console.log('Upgrade to', plan)}
                  onDowngrade={(plan) => console.log('Downgrade to', plan)}
                />
              </TabsContent>

              {/* Permissions Tab */}
              <TabsContent value="permissions">
                <RolePermissionMatrix readOnly={false} />
              </TabsContent>

              {/* Audit Reports Tab */}
              <TabsContent value="audit">
                <AuditReports tenantId={activeCompany} />
              </TabsContent>

              {/* Scheduled Reports Tab */}
              <TabsContent value="scheduled">
                <ScheduledReports tenantId={activeCompany} />
              </TabsContent>

              {/* AI Assistant Tab */}
              <TabsContent value="ai">
                <PermissionAIAssistant />
              </TabsContent>

              {/* Modules Tab */}
              <TabsContent value="modules">
                <Card>
                  <CardHeader>
                    <CardTitle>Module Access Control</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {modules.map((module) => (
                        <div key={module.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-medium">{module.name}</p>
                            <p className="text-sm text-slate-500">{module.description}</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* API Tab */}
              <TabsContent value="api">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>API Keys</CardTitle>
                    <Button className="bg-lime-500 hover:bg-lime-600">
                      <Key className="w-4 h-4 mr-2" />
                      Generate Key
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Key</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Last Used</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { name: 'Production API', key: 'ark_prod_xxxx...xxxx', created: '2024-01-15', lastUsed: '2024-12-20', status: 'active' },
                          { name: 'Testing API', key: 'ark_test_xxxx...xxxx', created: '2024-03-20', lastUsed: '2024-12-19', status: 'active' },
                          { name: 'Legacy API', key: 'ark_leg_xxxx...xxxx', created: '2023-06-10', lastUsed: '2024-11-15', status: 'deprecated' }
                        ].map((apiKey, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{apiKey.name}</TableCell>
                            <TableCell className="font-mono text-sm">{apiKey.key}</TableCell>
                            <TableCell>{apiKey.created}</TableCell>
                            <TableCell>{apiKey.lastUsed}</TableCell>
                            <TableCell>
                              <Badge className={apiKey.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}>
                                {apiKey.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={notificationsOpen} 
        onClose={() => setNotificationsOpen(false)} 
      />

      {/* User Onboarding */}
      <UserOnboarding
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        userData={{
          name: 'New User',
          email: 'newuser@arkfinex.com',
          department: 'Sales',
          role: 'Sales Manager',
          modules: ['Dashboard', 'Sales', 'CRM', 'Documents', 'ARKSchedule']
        }}
      />
    </div>
  );
}