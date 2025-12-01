import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { 
  Bell, Mail, Smartphone, Plus, Trash2, Shield, 
  Crown, User, CheckCircle, AlertTriangle
} from 'lucide-react';

export default function PDPAOwnerSettings({ owners, onAdd, onRemove, onUpdate }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOwner, setNewOwner] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'secondary_owner',
    min_risk_level: 'medium',
    notify_email: true,
    notify_sms: true,
    notify_push: true
  });

  const sampleOwners = owners || [
    { id: 1, name: 'Sarah Chen (Company Owner)', email: 'sarah@techstart.com', phone: '+65 9123 4567', role: 'primary_owner', is_primary: true, min_risk_level: 'low', notify_email: true, notify_sms: true, notify_push: true, priority_order: 1 },
    { id: 2, name: 'David Lim (DPO)', email: 'david@techstart.com', phone: '+65 9234 5678', role: 'dpo', is_primary: false, min_risk_level: 'medium', notify_email: true, notify_sms: true, notify_push: true, priority_order: 2 },
    { id: 3, name: 'Mike Johnson (Compliance)', email: 'mike@techstart.com', phone: '+65 9345 6789', role: 'compliance_officer', is_primary: false, min_risk_level: 'high', notify_email: true, notify_sms: false, notify_push: true, priority_order: 3 }
  ];

  const roleIcons = {
    primary_owner: Crown,
    dpo: Shield,
    secondary_owner: User,
    compliance_officer: Shield,
    admin: User
  };

  const roleColors = {
    primary_owner: 'bg-amber-500',
    dpo: 'bg-purple-500',
    secondary_owner: 'bg-blue-500',
    compliance_officer: 'bg-green-500',
    admin: 'bg-slate-500'
  };

  const roleLabels = {
    primary_owner: 'Primary Owner',
    dpo: 'Data Protection Officer',
    secondary_owner: 'Secondary Owner',
    compliance_officer: 'Compliance Officer',
    admin: 'Admin'
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-purple-500" />
          PDPA Alert Recipients (1-3 Owners)
        </CardTitle>
        {sampleOwners.length < 3 && (
          <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-purple-500 hover:bg-purple-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Owner
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info */}
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-700">Automatic PDPA Notifications</p>
              <p className="text-sm text-slate-600">All PDPA incidents will automatically notify the configured owners via email, SMS, and push notifications based on their settings.</p>
            </div>
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="p-4 bg-slate-50 rounded-xl border space-y-4">
            <h4 className="font-semibold">Add New Owner (Max 3)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input 
                  value={newOwner.name}
                  onChange={(e) => setNewOwner({ ...newOwner, name: e.target.value })}
                  placeholder="Enter name"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input 
                  type="email"
                  value={newOwner.email}
                  onChange={(e) => setNewOwner({ ...newOwner, email: e.target.value })}
                  placeholder="email@company.com"
                />
              </div>
              <div>
                <Label>Phone (for SMS)</Label>
                <Input 
                  value={newOwner.phone}
                  onChange={(e) => setNewOwner({ ...newOwner, phone: e.target.value })}
                  placeholder="+65 9XXX XXXX"
                />
              </div>
              <div>
                <Label>Role</Label>
                <Select value={newOwner.role} onValueChange={(v) => setNewOwner({ ...newOwner, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="secondary_owner">Secondary Owner</SelectItem>
                    <SelectItem value="dpo">Data Protection Officer</SelectItem>
                    <SelectItem value="compliance_officer">Compliance Officer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Minimum Alert Level</Label>
                <Select value={newOwner.min_risk_level} onValueChange={(v) => setNewOwner({ ...newOwner, min_risk_level: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low & Above (All Alerts)</SelectItem>
                    <SelectItem value="medium">Medium & Above</SelectItem>
                    <SelectItem value="high">High & Above</SelectItem>
                    <SelectItem value="critical">Critical Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Label className="flex items-center gap-2">
                <Switch checked={newOwner.notify_email} onCheckedChange={(v) => setNewOwner({ ...newOwner, notify_email: v })} />
                <Mail className="w-4 h-4" /> Email
              </Label>
              <Label className="flex items-center gap-2">
                <Switch checked={newOwner.notify_sms} onCheckedChange={(v) => setNewOwner({ ...newOwner, notify_sms: v })} />
                <Smartphone className="w-4 h-4" /> SMS
              </Label>
              <Label className="flex items-center gap-2">
                <Switch checked={newOwner.notify_push} onCheckedChange={(v) => setNewOwner({ ...newOwner, notify_push: v })} />
                <Bell className="w-4 h-4" /> Push
              </Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => { onAdd && onAdd(newOwner); setShowAddForm(false); }}>Add Owner</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Owners List */}
        <div className="space-y-3">
          {sampleOwners.map((owner, i) => {
            const RoleIcon = roleIcons[owner.role] || User;
            return (
              <div 
                key={owner.id}
                className={`p-4 rounded-xl border ${owner.is_primary ? 'bg-amber-50 border-amber-200' : 'bg-white'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full ${roleColors[owner.role]} flex items-center justify-center`}>
                        <RoleIcon className="w-6 h-6 text-white" />
                      </div>
                      <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-xs font-bold">
                        {owner.priority_order}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{owner.name}</span>
                        {owner.is_primary && <Badge className="bg-amber-500">Primary</Badge>}
                        <Badge variant="outline">{roleLabels[owner.role]}</Badge>
                      </div>
                      <p className="text-sm text-slate-500">{owner.email}</p>
                      <p className="text-sm text-slate-500">{owner.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-1 ${owner.notify_email ? 'text-green-500' : 'text-slate-300'}`}>
                        <Mail className="w-4 h-4" />
                        {owner.notify_email && <CheckCircle className="w-3 h-3" />}
                      </div>
                      <div className={`flex items-center gap-1 ${owner.notify_sms ? 'text-green-500' : 'text-slate-300'}`}>
                        <Smartphone className="w-4 h-4" />
                        {owner.notify_sms && <CheckCircle className="w-3 h-3" />}
                      </div>
                      <div className={`flex items-center gap-1 ${owner.notify_push ? 'text-green-500' : 'text-slate-300'}`}>
                        <Bell className="w-4 h-4" />
                        {owner.notify_push && <CheckCircle className="w-3 h-3" />}
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">{owner.min_risk_level}+</Badge>
                    {!owner.is_primary && (
                      <Button variant="ghost" size="icon" className="text-red-500" onClick={() => onRemove && onRemove(owner.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}