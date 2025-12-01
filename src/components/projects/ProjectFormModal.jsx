import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Plus, X, Calendar, Users, Target } from 'lucide-react';
import { toast } from 'sonner';

const initialFormData = {
  name: '',
  description: '',
  customer_id: '',
  customer_name: '',
  status: 'planning',
  priority: 'medium',
  start_date: '',
  end_date: '',
  budget: '',
  currency: 'SGD',
  manager_email: '',
  manager_name: '',
  team_members: [],
  milestones: [],
  notes: ''
};

export default function ProjectFormModal({ open, onClose, project }) {
  const [formData, setFormData] = useState(initialFormData);
  const [saving, setSaving] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ name: '', due_date: '' });
  const [newMember, setNewMember] = useState({ name: '', email: '', role: '' });
  const queryClient = useQueryClient();

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => base44.entities.Customer.list(),
    enabled: open
  });

  useEffect(() => {
    if (project) {
      setFormData({
        ...initialFormData,
        ...project,
        budget: project.budget || ''
      });
    } else {
      setFormData(initialFormData);
    }
  }, [project, open]);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Project.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created');
      onClose();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Project.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project updated');
      onClose();
    }
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.customer_name) {
      toast.error('Please fill in required fields');
      return;
    }

    setSaving(true);
    const data = {
      ...formData,
      budget: formData.budget ? parseFloat(formData.budget) : null
    };

    try {
      if (project) {
        await updateMutation.mutateAsync({ id: project.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      toast.error('Failed to save project');
    }
    setSaving(false);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCustomerChange = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setFormData(prev => ({
        ...prev,
        customer_id: customer.id,
        customer_name: customer.name
      }));
    }
  };

  const addMilestone = () => {
    if (!newMilestone.name) return;
    const milestone = {
      id: Date.now().toString(),
      name: newMilestone.name,
      due_date: newMilestone.due_date,
      completed: false
    };
    setFormData(prev => ({
      ...prev,
      milestones: [...(prev.milestones || []), milestone]
    }));
    setNewMilestone({ name: '', due_date: '' });
  };

  const removeMilestone = (id) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter(m => m.id !== id)
    }));
  };

  const addMember = () => {
    if (!newMember.name || !newMember.email) return;
    setFormData(prev => ({
      ...prev,
      team_members: [...(prev.team_members || []), { ...newMember }]
    }));
    setNewMember({ name: '', email: '', role: '' });
  };

  const removeMember = (email) => {
    setFormData(prev => ({
      ...prev,
      team_members: prev.team_members.filter(m => m.email !== email)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'New Project'}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Project Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g., Website Redesign"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer *</Label>
                <Select value={formData.customer_id} onValueChange={handleCustomerChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => updateField('status', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={formData.priority} onValueChange={(v) => updateField('priority', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Budget</Label>
                <Input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => updateField('budget', e.target.value)}
                  placeholder="50000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => updateField('start_date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => updateField('end_date', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Project description..."
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Project Manager</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  value={formData.manager_name}
                  onChange={(e) => updateField('manager_name', e.target.value)}
                  placeholder="Name"
                />
                <Input
                  type="email"
                  value={formData.manager_email}
                  onChange={(e) => updateField('manager_email', e.target.value)}
                  placeholder="Email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Team Members</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="Name"
                />
                <Input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  placeholder="Email"
                />
                <div className="flex gap-2">
                  <Input
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    placeholder="Role"
                  />
                  <Button type="button" variant="outline" onClick={addMember}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 mt-3">
                {formData.team_members?.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-medium text-sm">
                        {member.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-slate-500">{member.email} {member.role && `• ${member.role}`}</p>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => removeMember(member.email)}>
                      <X className="w-4 h-4 text-slate-400" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Add Milestone</Label>
              <div className="flex gap-2">
                <Input
                  value={newMilestone.name}
                  onChange={(e) => setNewMilestone({ ...newMilestone, name: e.target.value })}
                  placeholder="Milestone name"
                  className="flex-1"
                />
                <Input
                  type="date"
                  value={newMilestone.due_date}
                  onChange={(e) => setNewMilestone({ ...newMilestone, due_date: e.target.value })}
                  className="w-40"
                />
                <Button type="button" variant="outline" onClick={addMilestone}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {formData.milestones?.map((milestone) => (
                <div key={milestone.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Target className="w-4 h-4 text-violet-500" />
                    <div>
                      <p className="font-medium text-sm">{milestone.name}</p>
                      {milestone.due_date && (
                        <p className="text-xs text-slate-500">Due: {milestone.due_date}</p>
                      )}
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => removeMilestone(milestone.id)}>
                    <X className="w-4 h-4 text-slate-400" />
                  </Button>
                </div>
              ))}
              {formData.milestones?.length === 0 && (
                <p className="text-center text-slate-500 py-4">No milestones added</p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-violet-600 hover:bg-violet-700" onClick={handleSubmit} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {project ? 'Update' : 'Create'} Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}