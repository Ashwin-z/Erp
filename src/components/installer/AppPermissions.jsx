import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Shield, Users, Check, X, UserPlus, Mail 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AppPermissions() {
  const queryClient = useQueryClient();
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newRole, setNewRole] = useState('App Viewer');

  const { data: permissions } = useQuery({
    queryKey: ['appPermissions'],
    queryFn: () => base44.entities.AppPermission.list(),
    initialData: []
  });

  const createPermission = useMutation({
    mutationFn: (data) => base44.entities.AppPermission.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['appPermissions']);
      toast.success("Permission assigned successfully");
      setNewUserEmail('');
    }
  });

  const deletePermission = useMutation({
    mutationFn: (id) => base44.entities.AppPermission.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['appPermissions']);
      toast.success("Permission revoked");
    }
  });

  const handleAdd = () => {
    if (!newUserEmail) return;
    createPermission.mutate({ user_email: newUserEmail, role: newRole, assigned_by: 'admin' }); // In real app use current user
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Access Control
            </CardTitle>
            <CardDescription>Manage who can install, update, or view apps.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New User */}
        <div className="flex items-end gap-3 p-4 bg-slate-50 rounded-lg border">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">User Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="colleague@company.com" 
                className="pl-9"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="w-48 space-y-2">
            <label className="text-sm font-medium">Role</label>
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="App Administrator">Administrator</SelectItem>
                <SelectItem value="App Deployer">Deployer</SelectItem>
                <SelectItem value="App Viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAdd} disabled={createPermission.isPending}>
            <UserPlus className="w-4 h-4 mr-2" /> Assign
          </Button>
        </div>

        {/* List */}
        <div className="space-y-3">
          {permissions.map(perm => (
            <div key={perm.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 bg-blue-100 text-blue-700">
                  <AvatarFallback>{perm.user_email[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{perm.user_email}</p>
                  <p className="text-xs text-slate-500">Assigned by {perm.assigned_by || 'System'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                  perm.role === 'App Administrator' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                  perm.role === 'App Deployer' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  'bg-slate-50 text-slate-700 border-slate-200'
                }`}>
                  {perm.role}
                </span>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => deletePermission.mutate(perm.id)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {permissions.length === 0 && (
            <p className="text-center text-slate-500 text-sm py-4">No custom permissions assigned yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}