import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Clock, Plus, Calendar, DollarSign, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

export default function TimeTrackingPanel({ project, tasks = [] }) {
  const [logOpen, setLogOpen] = useState(false);
  const [formData, setFormData] = useState({
    task_id: '',
    date: moment().format('YYYY-MM-DD'),
    hours: '',
    description: '',
    billable: true
  });
  const queryClient = useQueryClient();

  const { data: timeEntries = [], isLoading } = useQuery({
    queryKey: ['time-entries', project?.id],
    queryFn: () => base44.entities.TimeEntry.filter({ project_id: project.id }, '-date'),
    enabled: !!project?.id
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      return base44.entities.TimeEntry.create({
        ...data,
        project_id: project.id,
        user_email: user.email,
        user_name: user.full_name,
        hours: parseFloat(data.hours)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries', project?.id] });
      toast.success('Time logged');
      setLogOpen(false);
      setFormData({ task_id: '', date: moment().format('YYYY-MM-DD'), hours: '', description: '', billable: true });
    }
  });

  const totalHours = timeEntries.reduce((sum, e) => sum + (e.hours || 0), 0);
  const billableHours = timeEntries.filter(e => e.billable).reduce((sum, e) => sum + (e.hours || 0), 0);
  const thisWeekHours = timeEntries
    .filter(e => moment(e.date).isSame(moment(), 'week'))
    .reduce((sum, e) => sum + (e.hours || 0), 0);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-blue-700">{totalHours.toFixed(1)}h</p>
            <p className="text-xs text-blue-600">Total Hours</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-emerald-700">{billableHours.toFixed(1)}h</p>
            <p className="text-xs text-emerald-600">Billable</p>
          </CardContent>
        </Card>
        <Card className="bg-violet-50 border-violet-200">
          <CardContent className="p-4 text-center">
            <Calendar className="w-6 h-6 text-violet-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-violet-700">{thisWeekHours.toFixed(1)}h</p>
            <p className="text-xs text-violet-600">This Week</p>
          </CardContent>
        </Card>
      </div>

      {/* Log Button */}
      <div className="flex justify-end">
        <Button onClick={() => setLogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />Log Time
        </Button>
      </div>

      {/* Time Entries */}
      <Card className="border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Recent Time Entries</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
          ) : timeEntries.length === 0 ? (
            <div className="text-center py-8 text-slate-500">No time entries yet</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                  <TableHead>Billable</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeEntries.slice(0, 10).map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{moment(entry.date).format('DD MMM')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs">
                          {entry.user_name?.charAt(0)}
                        </div>
                        <span className="text-sm">{entry.user_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">{entry.description || '-'}</TableCell>
                    <TableCell className="text-right font-medium">{entry.hours}h</TableCell>
                    <TableCell>
                      <Badge className={entry.billable ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}>
                        {entry.billable ? 'Billable' : 'Non-billable'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Log Time Dialog */}
      <Dialog open={logOpen} onOpenChange={setLogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Time</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Hours</Label>
                <Input type="number" step="0.5" value={formData.hours} onChange={(e) => setFormData({ ...formData, hours: e.target.value })} placeholder="2.5" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Task (Optional)</Label>
              <Select value={formData.task_id} onValueChange={(v) => setFormData({ ...formData, task_id: v })}>
                <SelectTrigger><SelectValue placeholder="Select task" /></SelectTrigger>
                <SelectContent>
                  {tasks.map(t => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="What did you work on?" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={formData.billable} onChange={(e) => setFormData({ ...formData, billable: e.target.checked })} />
              <Label>Billable hours</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogOpen(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate(formData)} disabled={createMutation.isPending || !formData.hours}>
              {createMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Clock className="w-4 h-4 mr-2" />}
              Log Time
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}