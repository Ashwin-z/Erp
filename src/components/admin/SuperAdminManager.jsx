import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield, Plus, Trash2, Crown, Search, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

export default function SuperAdminManager({ tenantId }) {
  const [superAdmins, setSuperAdmins] = useState([
    { id: '1', email: 'net28528@gmail.com', name: 'Nethanial Tan', is_owner: true, protected: true },
    { id: '2', email: 'admin@arkfinex.com', name: 'Sarah Chen', is_owner: false, protected: false }
  ]);
  const [addModal, setAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [confirmRemove, setConfirmRemove] = useState(null);

  const availableUsers = [
    { id: '3', email: 'john@arkfinex.com', name: 'John Smith', department: 'Sales' },
    { id: '4', email: 'mike@arkfinex.com', name: 'Mike Johnson', department: 'Finance' },
    { id: '5', email: 'anna@arkfinex.com', name: 'Anna Lee', department: 'HR' }
  ];

  const filteredUsers = availableUsers.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSuperAdmins = async () => {
    const newAdmins = selectedUsers.map(id => {
      const user = availableUsers.find(u => u.id === id);
      return { ...user, is_owner: false, protected: false };
    });
    
    setSuperAdmins([...superAdmins, ...newAdmins]);
    
    // Log audit for each
    for (const admin of newAdmins) {
      await base44.entities.PermissionAudit.create({
        tenant_id: tenantId,
        actor_email: 'current_user@example.com',
        action_type: 'superadmin_add',
        target_type: 'user',
        target_id: admin.id,
        target_name: admin.name,
        new_state: { is_superadmin: true },
        reason: 'Added as Super Admin'
      });
    }
    
    setAddModal(false);
    setSelectedUsers([]);
    toast.success(`Added ${newAdmins.length} Super Admin(s)`);
  };

  const handleRemove = async (admin) => {
    if (admin.protected) {
      toast.error('Cannot remove protected Owner account');
      return;
    }

    setSuperAdmins(superAdmins.filter(a => a.id !== admin.id));
    
    await base44.entities.PermissionAudit.create({
      tenant_id: tenantId,
      actor_email: 'current_user@example.com',
      action_type: 'superadmin_remove',
      target_type: 'user',
      target_id: admin.id,
      target_name: admin.name,
      previous_state: { is_superadmin: true },
      new_state: { is_superadmin: false },
      reason: 'Removed from Super Admins'
    });

    setConfirmRemove(null);
    toast.success(`Removed ${admin.name} from Super Admins`);
  };

  const toggleUser = (id) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            Super Administrators
          </CardTitle>
          <Button onClick={() => setAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Super Admin
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {superAdmins.map(admin => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-purple-100 text-purple-700">
                          {admin.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{admin.name}</p>
                        {admin.is_owner && (
                          <Badge className="bg-amber-100 text-amber-700 text-[10px]">
                            <Crown className="w-2 h-2 mr-1" />
                            OWNER
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-500">{admin.email}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Badge className="bg-purple-100 text-purple-700">Super Admin</Badge>
                      {admin.protected && (
                        <Badge variant="outline" className="text-amber-600 border-amber-300">Protected</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {admin.protected ? (
                      <Button variant="ghost" size="icon" disabled>
                        <Shield className="w-4 h-4 text-amber-500" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => setConfirmRemove(admin)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Super Admin Modal */}
      <Dialog open={addModal} onOpenChange={setAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Super Administrators</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="pl-9"
              />
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  onClick={() => toggleUser(user.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedUsers.includes(user.id)
                      ? 'border-purple-500 bg-purple-50'
                      : 'hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                    <Badge variant="outline">{user.department}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddModal(false)}>Cancel</Button>
            <Button 
              onClick={handleAddSuperAdmins}
              disabled={selectedUsers.length === 0}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Add {selectedUsers.length} User(s)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Remove Modal */}
      <Dialog open={!!confirmRemove} onOpenChange={() => setConfirmRemove(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Remove Super Admin
            </DialogTitle>
          </DialogHeader>
          <p className="text-slate-600">
            Are you sure you want to remove <strong>{confirmRemove?.name}</strong> from Super Administrators?
            They will lose all administrative privileges.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmRemove(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => handleRemove(confirmRemove)}
            >
              Remove Super Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}