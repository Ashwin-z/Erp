import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus, Trash2, Clock, Calendar, User, Tag, Link2, 
  Paperclip, MessageSquare, CheckSquare, Sparkles
} from 'lucide-react';

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'bg-blue-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'high', label: 'High', color: 'bg-orange-500' },
  { value: 'critical', label: 'Critical', color: 'bg-red-500' }
];

const typeOptions = [
  { value: 'task', label: '📋 Task' },
  { value: 'bug', label: '🐛 Bug' },
  { value: 'feature', label: '✨ Feature' },
  { value: 'story', label: '📖 Story' },
  { value: 'epic', label: '🎯 Epic' }
];

const statusOptions = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
  { value: 'blocked', label: 'Blocked' }
];

export default function TaskModal({ open, onClose, task, onSave, teamMembers, allTasks }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'backlog',
    priority: 'medium',
    task_type: 'task',
    assignee: '',
    start_date: '',
    due_date: '',
    estimated_hours: 0,
    tags: [],
    checklist: [],
    dependencies: []
  });
  const [newTag, setNewTag] = useState('');
  const [newCheckItem, setNewCheckItem] = useState('');
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (task) {
      setFormData({
        ...formData,
        ...task,
        start_date: task.start_date?.split('T')[0] || '',
        due_date: task.due_date?.split('T')[0] || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'backlog',
        priority: 'medium',
        task_type: 'task',
        assignee: '',
        start_date: '',
        due_date: '',
        estimated_hours: 0,
        tags: [],
        checklist: [],
        dependencies: []
      });
    }
  }, [task, open]);

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] });
      setNewTag('');
    }
  };

  const removeTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const addCheckItem = () => {
    if (newCheckItem) {
      setFormData({
        ...formData,
        checklist: [...formData.checklist, { text: newCheckItem, completed: false }]
      });
      setNewCheckItem('');
    }
  };

  const toggleCheckItem = (index) => {
    const newChecklist = [...formData.checklist];
    newChecklist[index].completed = !newChecklist[index].completed;
    setFormData({ ...formData, checklist: newChecklist });
  };

  const removeCheckItem = (index) => {
    setFormData({
      ...formData,
      checklist: formData.checklist.filter((_, i) => i !== index)
    });
  };

  const handleSave = () => {
    onSave && onSave(formData);
    onClose();
  };

  const members = teamMembers || [
    { email: 'john@example.com', name: 'John Smith' },
    { email: 'sarah@example.com', name: 'Sarah Chen' },
    { email: 'mike@example.com', name: 'Mike Johnson' }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
            <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            {/* Title */}
            <div>
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Task title..."
              />
            </div>

            {/* Type & Priority & Status */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Type</Label>
                <Select value={formData.task_type} onValueChange={(v) => setFormData({ ...formData, task_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {typeOptions.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map(p => (
                      <SelectItem key={p.value} value={p.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${p.color}`} />
                          {p.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(s => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the task..."
                rows={4}
              />
            </div>

            {/* Assignee & Dates */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Assignee</Label>
                <Select value={formData.assignee} onValueChange={(v) => setFormData({ ...formData, assignee: v })}>
                  <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
                  <SelectContent>
                    {members.map(m => (
                      <SelectItem key={m.email} value={m.email}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div>
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
            </div>

            {/* Estimated Hours */}
            <div>
              <Label>Estimated Hours</Label>
              <Input
                type="number"
                value={formData.estimated_hours}
                onChange={(e) => setFormData({ ...formData, estimated_hours: parseFloat(e.target.value) || 0 })}
              />
            </div>

            {/* Tags */}
            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, i) => (
                  <Badge key={i} variant="outline" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag..."
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button variant="outline" onClick={addTag}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="checklist" className="space-y-4">
            <div className="space-y-2">
              {formData.checklist.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => toggleCheckItem(index)}
                  />
                  <span className={item.completed ? 'line-through text-slate-400' : ''}>{item.text}</span>
                  <Button variant="ghost" size="icon" className="ml-auto" onClick={() => removeCheckItem(index)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newCheckItem}
                onChange={(e) => setNewCheckItem(e.target.value)}
                placeholder="Add checklist item..."
                onKeyPress={(e) => e.key === 'Enter' && addCheckItem()}
              />
              <Button variant="outline" onClick={addCheckItem}>
                <Plus className="w-4 h-4 mr-2" /> Add
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="dependencies" className="space-y-4">
            <div>
              <Label>Depends On (Blocked By)</Label>
              <Select 
                value="" 
                onValueChange={(v) => {
                  if (!formData.dependencies.includes(v)) {
                    setFormData({ ...formData, dependencies: [...formData.dependencies, v] });
                  }
                }}
              >
                <SelectTrigger><SelectValue placeholder="Select blocking task..." /></SelectTrigger>
                <SelectContent>
                  {(allTasks || []).filter(t => t.id !== task?.id && !formData.dependencies.includes(t.id)).map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.task_code} - {t.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              {formData.dependencies.map((depId, i) => {
                const depTask = (allTasks || []).find(t => t.id === depId);
                return (
                  <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                    <Link2 className="w-4 h-4 text-slate-400" />
                    <span>{depTask?.task_code} - {depTask?.title}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="ml-auto"
                      onClick={() => setFormData({
                        ...formData,
                        dependencies: formData.dependencies.filter(d => d !== depId)
                      })}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} className="bg-lime-500 hover:bg-lime-600">
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}