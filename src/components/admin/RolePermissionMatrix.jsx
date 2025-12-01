import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, ShieldCheck, ShieldAlert, User, Eye,
  Plus, Pencil, Trash2, Download, Settings
} from 'lucide-react';

const roles = [
  { 
    id: 'super_admin', 
    name: 'Super Admin', 
    icon: ShieldAlert, 
    color: 'text-red-500',
    description: 'System owner with full access. Cannot be deleted.',
    protected: true
  },
  { 
    id: 'platform_admin', 
    name: 'Platform Admin', 
    icon: ShieldCheck, 
    color: 'text-purple-500',
    description: 'Manages tenants and system settings. Cannot modify Super Admin.',
    protected: false
  },
  { 
    id: 'department_head', 
    name: 'Department Head', 
    icon: Shield, 
    color: 'text-blue-500',
    description: 'Manages their department only.',
    protected: false
  },
  { 
    id: 'user', 
    name: 'User', 
    icon: User, 
    color: 'text-green-500',
    description: 'Standard user with limited access.',
    protected: false
  },
  { 
    id: 'guest', 
    name: 'Guest', 
    icon: Eye, 
    color: 'text-slate-500',
    description: 'View-only access when permitted.',
    protected: false
  }
];

const permissions = [
  { id: 'create', name: 'Create', icon: Plus },
  { id: 'read', name: 'Read', icon: Eye },
  { id: 'update', name: 'Update', icon: Pencil },
  { id: 'delete', name: 'Delete', icon: Trash2 },
  { id: 'export', name: 'Export', icon: Download },
  { id: 'admin', name: 'Admin', icon: Settings }
];

const defaultPermissions = {
  super_admin: { create: true, read: true, update: true, delete: true, export: true, admin: true },
  platform_admin: { create: true, read: true, update: true, delete: true, export: true, admin: true },
  department_head: { create: true, read: true, update: true, delete: false, export: true, admin: false },
  user: { create: true, read: true, update: true, delete: false, export: false, admin: false },
  guest: { create: false, read: true, update: false, delete: false, export: false, admin: false }
};

export default function RolePermissionMatrix({ onPermissionChange, readOnly = false }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Role Permission Matrix (CRUD)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium">Role</th>
                {permissions.map(perm => (
                  <th key={perm.id} className="text-center p-3 font-medium">
                    <div className="flex flex-col items-center gap-1">
                      <perm.icon className="w-4 h-4 text-slate-500" />
                      <span className="text-xs">{perm.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map(role => {
                const Icon = role.icon;
                return (
                  <tr key={role.id} className="border-b hover:bg-slate-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${role.color}`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{role.name}</span>
                            {role.protected && (
                              <Badge className="bg-red-100 text-red-700 text-xs">Protected</Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">{role.description}</p>
                        </div>
                      </div>
                    </td>
                    {permissions.map(perm => (
                      <td key={perm.id} className="text-center p-3">
                        <Switch 
                          checked={defaultPermissions[role.id][perm.id]}
                          disabled={readOnly || role.id === 'super_admin'}
                          onCheckedChange={(checked) => 
                            onPermissionChange && onPermissionChange(role.id, perm.id, checked)
                          }
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Super Admin (net28528@gmail.com) has permanent full access and cannot be modified or deleted. 
            Platform Admins can see Super Admin but cannot modify their permissions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}