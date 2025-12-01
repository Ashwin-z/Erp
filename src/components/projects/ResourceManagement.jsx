import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Users, Plus, Calendar, Percent, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

export default function ResourceManagement({ project }) {
  const [allocateOpen, setAllocateOpen] = useState(false);
  const [formData, setFormData] = useState({
    user_email: '',
    user_name: '',
    role: '',
    allocation_percent: 100,
    start_date: project?.start_date || '',
    end_date: project?.end_date || ''
  });
  const queryClient = useQueryClient();

  const { data: allocations = [] } = useQuery({
    queryKey: ['allocations', project?.id],
    queryFn: () => base44.entities.ResourceAllocation.filter({ project_id: project.id }),
    enabled: !!project?.id
  });

  const { data: allAllocations = [] } = useQuery({
    queryKey: ['all-allocations'],
    queryFn: () => base44.entities.ResourceAllocation.filter({ status: 'active' })
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list()
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.ResourceAllocation.create({
      ...data,
      project_id: project.id,
      project_name: project.name
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocations', project?.id] });
      toast.success('Resource allocated');
      setAllocateOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ResourceAllocation.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocations', project?.id] });
      toast.success('Allocation removed');
    }
  });

  const getUserAvailability = (email) => {
    const userAllocations = allAllocations.filter(a => a.user_email === email && a.status === 'active');
    const totalAllocated = userAllocations.reduce((sum, a) => sum + (a.allocation_percent || 0), 0);
    return Math.max(0, 100 - totalAllocated);
  };

  const handleUserSelect = (email) => {
    const user = users.find(u => u.email === email);
    setFormData({ ...formData, user_email: email, user_name: user?.full_name || email });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-slate-500" />Resource Allocation
        </h3>
        <Button onClick={() => setAllocateOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />Allocate Resource
        </Button>
      </div>

      {/* Allocated Resources */}
      <div className="space-y-3">
        {allocations.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-slate-500">
              No resources allocated yet
            </CardContent>
          </Card>
        ) : (
          allocations.map((alloc) => (
            <Card key={alloc.id} className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-medium">
                      {alloc.user_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{alloc.user_name}</p>
                      <p className="text-sm text-slate-500">{alloc.role || 'Team Member'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">{alloc.allocation_percent}%</p>
                      <p className="text-xs text-slate-500">
                        {moment(alloc.start_date).format('MMM D')} - {moment(alloc.end_date).format('MMM D')}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(alloc.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                <Progress value={alloc.allocation_percent} className="h-2 mt-3" />
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Team Availability Overview */}
      <Card className="border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Team Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.slice(0, 5).map((user) => {
              const availability = getUserAvailability(user.email);
              return (
                <div key={user.email} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm">
                    {user.full_name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{user.full_name}</span>
                      <span className={availability > 0 ? 'text-emerald-600' : 'text-red-600'}>
                        {availability}% available
                      </span>
                    </div>
                    <Progress value={100 - availability} className="h-1.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Allocate Dialog */}
      <Dialog open={allocateOpen} onOpenChange={setAllocateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Allocate Resource</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Team Member</Label>
              <Select value={formData.user_email} onValueChange={handleUserSelect}>
                <SelectTrigger><SelectValue placeholder="Select team member" /></SelectTrigger>
                <SelectContent>
                  {users.map(u => (
                    <SelectItem key={u.email} value={u.email}>
                      {u.full_name} ({getUserAvailability(u.email)}% available)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} placeholder="Developer" />
              </div>
              <div className="space-y-2">
                <Label>Allocation %</Label>
                <Input type="number" min="0" max="100" value={formData.allocation_percent} onChange={(e) => setFormData({ ...formData, allocation_percent: parseInt(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAllocateOpen(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate(formData)} disabled={createMutation.isPending || !formData.user_email}>
              {createMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Allocate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}