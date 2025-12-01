import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Calendar as CalendarIcon, Clock, Download, FileText, Plus, 
  Edit, Trash2, Play, Pause, Mail, Filter
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { toast } from 'sonner';

const MODULES = ['Overview', 'Operations', 'Finance', 'Compliance', 'Human Resource', 'Tools', 'Manage', 'Account'];
const ACTION_TYPES = ['Permission Granted', 'Permission Revoked', 'Role Changed', 'User Created', 'User Deleted', 'Module Access Changed'];

const sampleSchedules = [
  { id: '1', name: 'Weekly Security Report', frequency: 'weekly', format: 'pdf', modules: ['Compliance', 'Manage'], users: ['all'], nextRun: new Date('2025-01-27'), enabled: true, recipients: ['security@arkfinex.com'] },
  { id: '2', name: 'Daily Audit Log', frequency: 'daily', format: 'csv', modules: ['all'], users: ['all'], nextRun: new Date('2025-01-26'), enabled: true, recipients: ['admin@arkfinex.com'] },
  { id: '3', name: 'Monthly Permission Changes', frequency: 'monthly', format: 'pdf', modules: ['Manage'], users: ['all'], nextRun: new Date('2025-02-01'), enabled: false, recipients: ['cto@arkfinex.com'] }
];

export default function ScheduledReports({ tenantId }) {
  const [schedules, setSchedules] = useState(sampleSchedules);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    frequency: 'weekly',
    format: 'csv',
    modules: [],
    actionTypes: [],
    users: [],
    dateRange: { from: addDays(new Date(), -30), to: new Date() },
    recipients: '',
    enabled: true
  });

  const openCreateModal = () => {
    setFormData({
      name: '',
      frequency: 'weekly',
      format: 'csv',
      modules: [],
      actionTypes: [],
      users: [],
      dateRange: { from: addDays(new Date(), -30), to: new Date() },
      recipients: '',
      enabled: true
    });
    setEditingSchedule(null);
    setModalOpen(true);
  };

  const openEditModal = (schedule) => {
    setFormData({
      name: schedule.name,
      frequency: schedule.frequency,
      format: schedule.format,
      modules: schedule.modules,
      actionTypes: [],
      users: schedule.users,
      dateRange: { from: addDays(new Date(), -30), to: new Date() },
      recipients: schedule.recipients.join(', '),
      enabled: schedule.enabled
    });
    setEditingSchedule(schedule);
    setModalOpen(true);
  };

  const toggleModule = (module) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.includes(module)
        ? prev.modules.filter(m => m !== module)
        : [...prev.modules, module]
    }));
  };

  const toggleActionType = (action) => {
    setFormData(prev => ({
      ...prev,
      actionTypes: prev.actionTypes.includes(action)
        ? prev.actionTypes.filter(a => a !== action)
        : [...prev.actionTypes, action]
    }));
  };

  const saveSchedule = () => {
    if (!formData.name) {
      toast.error('Please enter a report name');
      return;
    }

    const nextRun = formData.frequency === 'daily' ? addDays(new Date(), 1) :
                    formData.frequency === 'weekly' ? addDays(new Date(), 7) :
                    addDays(new Date(), 30);

    if (editingSchedule) {
      setSchedules(prev => prev.map(s => 
        s.id === editingSchedule.id 
          ? { ...s, ...formData, recipients: formData.recipients.split(',').map(r => r.trim()), nextRun }
          : s
      ));
      toast.success('Schedule updated');
    } else {
      const newSchedule = {
        id: Date.now().toString(),
        ...formData,
        recipients: formData.recipients.split(',').map(r => r.trim()),
        nextRun
      };
      setSchedules(prev => [...prev, newSchedule]);
      toast.success('Schedule created');
    }
    setModalOpen(false);
  };

  const deleteSchedule = (id) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
    toast.success('Schedule deleted');
  };

  const toggleSchedule = (id) => {
    setSchedules(prev => prev.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const runNow = (schedule) => {
    toast.success(`Generating ${schedule.name}...`);
    setTimeout(() => {
      toast.success(`${schedule.name} has been generated and sent to recipients`);
    }, 2000);
  };

  const getFrequencyBadge = (freq) => {
    const colors = {
      daily: 'bg-blue-100 text-blue-700',
      weekly: 'bg-green-100 text-green-700',
      monthly: 'bg-purple-100 text-purple-700'
    };
    return <Badge className={colors[freq]}>{freq}</Badge>;
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-lime-600" />
            Scheduled Report Generation
          </CardTitle>
          <Button className="bg-lime-500 hover:bg-lime-600" onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-2" />
            Create Schedule
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Modules</TableHead>
                <TableHead>Next Run</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map(schedule => (
                <TableRow key={schedule.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{schedule.name}</p>
                      <p className="text-xs text-slate-500">{schedule.recipients.length} recipient(s)</p>
                    </div>
                  </TableCell>
                  <TableCell>{getFrequencyBadge(schedule.frequency)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="uppercase">{schedule.format}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap max-w-[150px]">
                      {schedule.modules.slice(0, 2).map(mod => (
                        <Badge key={mod} variant="outline" className="text-[10px]">{mod}</Badge>
                      ))}
                      {schedule.modules.length > 2 && (
                        <Badge variant="outline" className="text-[10px]">+{schedule.modules.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {format(schedule.nextRun, 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={schedule.enabled} 
                      onCheckedChange={() => toggleSchedule(schedule.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => runNow(schedule)}>
                        <Play className="w-4 h-4 text-green-600" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditModal(schedule)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteSchedule(schedule.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSchedule ? 'Edit Scheduled Report' : 'Create Scheduled Report'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Report Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Weekly Security Report"
                />
              </div>
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select value={formData.frequency} onValueChange={(v) => setFormData({ ...formData, frequency: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Export Format</Label>
                <Select value={formData.format} onValueChange={(v) => setFormData({ ...formData, format: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Email Recipients</Label>
                <Input
                  value={formData.recipients}
                  onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
                  placeholder="email1@example.com, email2@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter by Modules
              </Label>
              <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-lg">
                {MODULES.map(module => (
                  <Badge
                    key={module}
                    variant={formData.modules.includes(module) ? 'default' : 'outline'}
                    className={`cursor-pointer ${formData.modules.includes(module) ? 'bg-lime-500' : ''}`}
                    onClick={() => toggleModule(module)}
                  >
                    {module}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter by Action Types
              </Label>
              <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-lg">
                {ACTION_TYPES.map(action => (
                  <Badge
                    key={action}
                    variant={formData.actionTypes.includes(action) ? 'default' : 'outline'}
                    className={`cursor-pointer ${formData.actionTypes.includes(action) ? 'bg-blue-500' : ''}`}
                    onClick={() => toggleActionType(action)}
                  >
                    {action}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium">Enable Schedule</p>
                <p className="text-xs text-slate-500">Report will be generated automatically</p>
              </div>
              <Switch
                checked={formData.enabled}
                onCheckedChange={(v) => setFormData({ ...formData, enabled: v })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="bg-lime-500 hover:bg-lime-600" onClick={saveSchedule}>
              {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}