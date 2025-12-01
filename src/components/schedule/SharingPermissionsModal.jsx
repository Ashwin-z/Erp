import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Eye, EyeOff, Lock, Users, Building2, User,
  Calendar, Ticket, Briefcase, CheckCircle2, Shield
} from 'lucide-react';

const permissionTemplates = [
  { 
    id: 'private', 
    name: 'Private Mode', 
    icon: Lock,
    description: 'Share nothing - complete privacy',
    settings: { work: false, personal: false, tickets: false, leave: false, projects: false }
  },
  { 
    id: 'team_member', 
    name: 'Team Member', 
    icon: Users,
    description: 'Work tasks + tickets visible to team',
    settings: { work: true, personal: false, tickets: true, leave: true, projects: true }
  },
  { 
    id: 'manager', 
    name: 'Manager View', 
    icon: Building2,
    description: 'All work + deadlines + progress',
    settings: { work: true, personal: false, tickets: true, leave: true, projects: true }
  },
  { 
    id: 'covering_officer', 
    name: 'Covering Officer', 
    icon: User,
    description: 'Tasks + tickets during leave period',
    settings: { work: true, personal: false, tickets: true, leave: false, projects: true }
  }
];

const categorySettings = [
  { id: 'work', label: 'Work Tasks', icon: Briefcase, description: 'Task assignments and deadlines' },
  { id: 'personal', label: 'Personal Events', icon: Calendar, description: 'Private appointments' },
  { id: 'tickets', label: 'Tickets', icon: Ticket, description: 'Support tickets assigned to you' },
  { id: 'leave', label: 'Leave Dates', icon: Calendar, description: 'Vacation and time off' },
  { id: 'projects', label: 'Project Deadlines', icon: Briefcase, description: 'Project milestones' }
];

export default function SharingPermissionsModal({ open, onClose, currentSettings, onSave }) {
  const [activeTemplate, setActiveTemplate] = useState('team_member');
  const [permissions, setPermissions] = useState({
    work: { enabled: true, visibility: 'full_details', shared_with: 'team' },
    personal: { enabled: false, visibility: 'title_only', shared_with: 'none' },
    tickets: { enabled: true, visibility: 'full_details', shared_with: 'team' },
    leave: { enabled: true, visibility: 'full_details', shared_with: 'hr' },
    projects: { enabled: true, visibility: 'full_details', shared_with: 'project_team' }
  });
  const [specificUsers, setSpecificUsers] = useState([]);
  const [newUser, setNewUser] = useState('');

  const applyTemplate = (templateId) => {
    const template = permissionTemplates.find(t => t.id === templateId);
    if (template) {
      setActiveTemplate(templateId);
      Object.entries(template.settings).forEach(([key, enabled]) => {
        setPermissions(prev => ({
          ...prev,
          [key]: { ...prev[key], enabled }
        }));
      });
    }
  };

  const toggleCategory = (categoryId) => {
    setPermissions(prev => ({
      ...prev,
      [categoryId]: { ...prev[categoryId], enabled: !prev[categoryId].enabled }
    }));
    setActiveTemplate('custom');
  };

  const updateVisibility = (categoryId, visibility) => {
    setPermissions(prev => ({
      ...prev,
      [categoryId]: { ...prev[categoryId], visibility }
    }));
  };

  const addSpecificUser = () => {
    if (newUser && !specificUsers.includes(newUser)) {
      setSpecificUsers([...specificUsers, newUser]);
      setNewUser('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-lime-600" />
            Calendar Sharing & Permissions
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="templates">
          <TabsList className="mb-4">
            <TabsTrigger value="templates">Quick Templates</TabsTrigger>
            <TabsTrigger value="custom">Custom Settings</TabsTrigger>
            <TabsTrigger value="users">Specific Users</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-3">
            <p className="text-sm text-slate-500 mb-4">
              Choose a preset sharing template or customize below
            </p>
            {permissionTemplates.map(template => (
              <div
                key={template.id}
                onClick={() => applyTemplate(template.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  activeTemplate === template.id 
                    ? 'border-lime-500 bg-lime-50 ring-2 ring-lime-200' 
                    : 'hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activeTemplate === template.id ? 'bg-lime-500' : 'bg-slate-100'
                  }`}>
                    <template.icon className={`w-5 h-5 ${
                      activeTemplate === template.id ? 'text-white' : 'text-slate-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{template.name}</p>
                    <p className="text-sm text-slate-500">{template.description}</p>
                  </div>
                  {activeTemplate === template.id && (
                    <CheckCircle2 className="w-5 h-5 text-lime-600" />
                  )}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <p className="text-sm text-slate-500 mb-4">
              Fine-tune what others can see in your calendar
            </p>
            {categorySettings.map(category => (
              <div key={category.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <category.icon className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="font-medium">{category.label}</p>
                      <p className="text-xs text-slate-500">{category.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={permissions[category.id]?.enabled}
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
                </div>
                
                {permissions[category.id]?.enabled && (
                  <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t">
                    <div>
                      <Label className="text-xs">Visibility Level</Label>
                      <Select 
                        value={permissions[category.id]?.visibility}
                        onValueChange={(v) => updateVisibility(category.id, v)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="title_only">Title Only</SelectItem>
                          <SelectItem value="busy_free">Busy/Free</SelectItem>
                          <SelectItem value="full_details">Full Details</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Share With</Label>
                      <Select 
                        value={permissions[category.id]?.shared_with}
                        onValueChange={(v) => setPermissions(prev => ({
                          ...prev,
                          [category.id]: { ...prev[category.id], shared_with: v }
                        }))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No One</SelectItem>
                          <SelectItem value="manager">Manager Only</SelectItem>
                          <SelectItem value="team">My Team</SelectItem>
                          <SelectItem value="department">Department</SelectItem>
                          <SelectItem value="company">Company</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <p className="text-sm text-slate-500 mb-4">
              Grant specific users access to your calendar
            </p>
            <div className="flex gap-2">
              <Input
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
                placeholder="Enter email address"
              />
              <Button onClick={addSpecificUser}>Add User</Button>
            </div>
            <div className="space-y-2">
              {specificUsers.map((email, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-sm">{email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="full_details">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="title_only">Title Only</SelectItem>
                        <SelectItem value="busy_free">Busy/Free</SelectItem>
                        <SelectItem value="full_details">Full Details</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSpecificUsers(specificUsers.filter(e => e !== email))}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            className="bg-lime-500 hover:bg-lime-600"
            onClick={() => {
              onSave && onSave({ template: activeTemplate, permissions, specificUsers });
              onClose();
            }}
          >
            Save Permissions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}