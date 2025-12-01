import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Users, Shield, Plus, Edit, Trash2, Key, Eye, Lock, UserPlus
} from 'lucide-react';
import { toast } from 'sonner';

const roles = [
  { id: 'admin', name: 'Partner Admin', description: 'Full access to all partner features', color: 'bg-red-500/20 text-red-400' },
  { id: 'developer', name: 'Developer', description: 'API access and integration management', color: 'bg-blue-500/20 text-blue-400' },
  { id: 'finance', name: 'Finance', description: 'Transaction and settlement access', color: 'bg-emerald-500/20 text-emerald-400' },
  { id: 'viewer', name: 'Viewer', description: 'Read-only access to dashboards', color: 'bg-slate-500/20 text-slate-400' }
];

const permissions = [
  { id: 'api_keys', label: 'Manage API Keys', roles: ['admin', 'developer'] },
  { id: 'webhooks', label: 'Configure Webhooks', roles: ['admin', 'developer'] },
  { id: 'transactions', label: 'View Transactions', roles: ['admin', 'developer', 'finance', 'viewer'] },
  { id: 'settlements', label: 'Manage Settlements', roles: ['admin', 'finance'] },
  { id: 'users', label: 'Manage Users', roles: ['admin'] },
  { id: 'reports', label: 'Generate Reports', roles: ['admin', 'finance', 'viewer'] },
  { id: 'dashboard', label: 'View Dashboard', roles: ['admin', 'developer', 'finance', 'viewer'] }
];

const users = [
  { id: 1, name: 'John Tan', email: 'john@partner.com', role: 'admin', status: 'active', lastLogin: '2024-11-27 14:30' },
  { id: 2, name: 'Sarah Lee', email: 'sarah@partner.com', role: 'developer', status: 'active', lastLogin: '2024-11-27 10:15' },
  { id: 3, name: 'Mike Wong', email: 'mike@partner.com', role: 'finance', status: 'active', lastLogin: '2024-11-26 16:00' },
  { id: 4, name: 'Lisa Chen', email: 'lisa@partner.com', role: 'viewer', status: 'pending', lastLogin: '-' }
];

export default function PartnerRBAC({ partnerId }) {
  const [activeTab, setActiveTab] = useState('users');
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', role: 'viewer' });

  const addUser = () => {
    if (newUser.email) {
      toast.success(`Invitation sent to ${newUser.email}`);
      setShowAddUser(false);
      setNewUser({ email: '', role: 'viewer' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Button variant={activeTab === 'users' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('users')} className={activeTab === 'users' ? 'bg-blue-500' : 'border-slate-600'}>
          <Users className="w-4 h-4 mr-1" />
          Users
        </Button>
        <Button variant={activeTab === 'roles' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('roles')} className={activeTab === 'roles' ? 'bg-blue-500' : 'border-slate-600'}>
          <Shield className="w-4 h-4 mr-1" />
          Roles & Permissions
        </Button>
      </div>

      {activeTab === 'users' && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-sm">Partner Users</CardTitle>
              <Button size="sm" onClick={() => setShowAddUser(true)}>
                <UserPlus className="w-4 h-4 mr-1" />
                Invite User
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {showAddUser && (
              <div className="p-4 border-b border-slate-700 bg-slate-800/50">
                <div className="flex gap-3">
                  <Input placeholder="Email address" className="bg-slate-700 border-slate-600" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                  <Select value={newUser.role} onValueChange={(v) => setNewUser({ ...newUser, role: v })}>
                    <SelectTrigger className="w-40 bg-slate-700 border-slate-600"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {roles.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button onClick={addUser}>Send Invite</Button>
                  <Button variant="ghost" onClick={() => setShowAddUser(false)}>Cancel</Button>
                </div>
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-transparent">
                  <TableHead className="text-slate-400">User</TableHead>
                  <TableHead className="text-slate-400">Role</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400">Last Login</TableHead>
                  <TableHead className="text-slate-400"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-slate-700">
                    <TableCell>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-slate-500 text-xs">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={roles.find(r => r.id === user.role)?.color}>{roles.find(r => r.id === user.role)?.name}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={user.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}>{user.status}</Badge>
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">{user.lastLogin}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="w-3 h-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Trash2 className="w-3 h-3 text-red-400" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'roles' && (
        <div className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm">Permission Matrix</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-400">Permission</TableHead>
                    {roles.map(r => <TableHead key={r.id} className="text-slate-400 text-center">{r.name}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((perm) => (
                    <TableRow key={perm.id} className="border-slate-700">
                      <TableCell className="text-white">{perm.label}</TableCell>
                      {roles.map(r => (
                        <TableCell key={r.id} className="text-center">
                          {perm.roles.includes(r.id) ? (
                            <div className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center mx-auto">
                              <Eye className="w-3 h-3 text-emerald-400" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded bg-slate-700 flex items-center justify-center mx-auto">
                              <Lock className="w-3 h-3 text-slate-500" />
                            </div>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}