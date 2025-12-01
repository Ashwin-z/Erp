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
  Bell, Mail, Smartphone, User, Plus, Trash2, 
  Shield, Crown, CheckCircle
} from 'lucide-react';

export default function AlertRecipientSettings({ recipients, onSave, onAdd, onRemove }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecipient, setNewRecipient] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'admin',
    min_severity: 'medium',
    notify_email: true,
    notify_sms: true,
    notify_push: true
  });

  const sampleRecipients = recipients || [
    { id: 1, name: 'Sarah Chen (Owner)', email: 'sarah@techstart.com', phone: '+65 9123 4567', role: 'owner', is_primary: true, min_severity: 'low', notify_email: true, notify_sms: true, notify_push: true, status: 'active' },
    { id: 2, name: 'David Lim', email: 'david@techstart.com', phone: '+65 9234 5678', role: 'security_head', is_primary: false, min_severity: 'medium', notify_email: true, notify_sms: true, notify_push: true, status: 'active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@techstart.com', phone: '+65 9345 6789', role: 'admin', is_primary: false, min_severity: 'high', notify_email: true, notify_sms: false, notify_push: true, status: 'active' }
  ];

  const roleIcons = {
    owner: Crown,
    security_head: Shield,
    admin: User,
    analyst: User
  };

  const roleColors = {
    owner: 'bg-amber-500',
    security_head: 'bg-purple-500',
    admin: 'bg-blue-500',
    analyst: 'bg-slate-500'
  };

  const handleAddRecipient = () => {
    onAdd && onAdd(newRecipient);
    setNewRecipient({ name: '', email: '', phone: '', role: 'admin', min_severity: 'medium', notify_email: true, notify_sms: true, notify_push: true });
    setShowAddForm(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-purple-500" />
          Alert Recipients (Cyber Team)
        </CardTitle>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-purple-500 hover:bg-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Recipient
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info Banner */}
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-700">
            <strong>Default:</strong> Company owner receives all critical alerts. Add up to 3 additional recipients for the cyber security team.
          </p>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="p-4 bg-slate-50 rounded-xl border space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input 
                  value={newRecipient.name}
                  onChange={(e) => setNewRecipient({ ...newRecipient, name: e.target.value })}
                  placeholder="Enter name"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input 
                  type="email"
                  value={newRecipient.email}
                  onChange={(e) => setNewRecipient({ ...newRecipient, email: e.target.value })}
                  placeholder="email@company.com"
                />
              </div>
              <div>
                <Label>Phone (for SMS)</Label>
                <Input 
                  value={newRecipient.phone}
                  onChange={(e) => setNewRecipient({ ...newRecipient, phone: e.target.value })}
                  placeholder="+65 9XXX XXXX"
                />
              </div>
              <div>
                <Label>Role</Label>
                <Select value={newRecipient.role} onValueChange={(v) => setNewRecipient({ ...newRecipient, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="security_head">Security Head</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Minimum Alert Severity</Label>
                <Select value={newRecipient.min_severity} onValueChange={(v) => setNewRecipient({ ...newRecipient, min_severity: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low & Above</SelectItem>
                    <SelectItem value="medium">Medium & Above</SelectItem>
                    <SelectItem value="high">High & Above</SelectItem>
                    <SelectItem value="critical">Critical Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Label className="flex items-center gap-2">
                <Switch checked={newRecipient.notify_email} onCheckedChange={(v) => setNewRecipient({ ...newRecipient, notify_email: v })} />
                Email
              </Label>
              <Label className="flex items-center gap-2">
                <Switch checked={newRecipient.notify_sms} onCheckedChange={(v) => setNewRecipient({ ...newRecipient, notify_sms: v })} />
                SMS
              </Label>
              <Label className="flex items-center gap-2">
                <Switch checked={newRecipient.notify_push} onCheckedChange={(v) => setNewRecipient({ ...newRecipient, notify_push: v })} />
                Push
              </Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddRecipient}>Add Recipient</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Recipients List */}
        <div className="space-y-3">
          {sampleRecipients.map((recipient) => {
            const RoleIcon = roleIcons[recipient.role] || User;
            return (
              <div 
                key={recipient.id}
                className="p-4 bg-white rounded-xl border flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${roleColors[recipient.role]} flex items-center justify-center`}>
                    <RoleIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{recipient.name}</span>
                      {recipient.is_primary && <Badge className="bg-amber-100 text-amber-700">Primary</Badge>}
                      <Badge variant="outline" className="capitalize">{recipient.role.replace('_', ' ')}</Badge>
                    </div>
                    <p className="text-sm text-slate-500">{recipient.email}</p>
                    <p className="text-sm text-slate-500">{recipient.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-1 ${recipient.notify_email ? 'text-green-500' : 'text-slate-300'}`}>
                      <Mail className="w-4 h-4" />
                      {recipient.notify_email && <CheckCircle className="w-3 h-3" />}
                    </div>
                    <div className={`flex items-center gap-1 ${recipient.notify_sms ? 'text-green-500' : 'text-slate-300'}`}>
                      <Smartphone className="w-4 h-4" />
                      {recipient.notify_sms && <CheckCircle className="w-3 h-3" />}
                    </div>
                    <div className={`flex items-center gap-1 ${recipient.notify_push ? 'text-green-500' : 'text-slate-300'}`}>
                      <Bell className="w-4 h-4" />
                      {recipient.notify_push && <CheckCircle className="w-3 h-3" />}
                    </div>
                  </div>
                  <Badge variant="outline">{recipient.min_severity}+</Badge>
                  {!recipient.is_primary && (
                    <Button variant="ghost" size="icon" className="text-red-500" onClick={() => onRemove && onRemove(recipient.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}