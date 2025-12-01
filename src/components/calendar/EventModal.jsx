import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar, Clock, MapPin, Video, Users, Bell, Tag,
  Link2, Paperclip, Repeat, Globe, Lock, Eye
} from 'lucide-react';
import moment from 'moment';

const eventTypes = [
  { value: 'meeting', label: 'Meeting' },
  { value: 'task', label: 'Task' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'reminder', label: 'Reminder' },
  { value: 'client_call', label: 'Client Call' },
  { value: 'team_sync', label: 'Team Sync' },
  { value: 'one_on_one', label: '1:1' },
  { value: 'webinar', label: 'Webinar' }
];

const platforms = [
  { value: 'zoom', label: 'Zoom', icon: '🎥' },
  { value: 'teams', label: 'Microsoft Teams', icon: '👥' },
  { value: 'google_meet', label: 'Google Meet', icon: '📹' },
  { value: 'webex', label: 'Webex', icon: '🖥️' },
  { value: 'phone', label: 'Phone Call', icon: '📞' },
  { value: 'in_person', label: 'In Person', icon: '🏢' }
];

const colors = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#6366f1'
];

const priorities = ['low', 'medium', 'high', 'urgent'];

export default function EventModal({ open, onClose, event, onSave, calendars }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'meeting',
    priority: 'medium',
    start_time: moment().add(1, 'hour').startOf('hour').format('YYYY-MM-DDTHH:mm'),
    end_time: moment().add(2, 'hour').startOf('hour').format('YYYY-MM-DDTHH:mm'),
    all_day: false,
    location: '',
    location_type: 'online',
    meeting_platform: 'zoom',
    meeting_link: '',
    color: '#3b82f6',
    visibility: 'private',
    calendar_id: '',
    attendees: [],
    reminders: [{ type: 'notification', minutes_before: 15 }],
    tags: [],
    requires_approval: false,
    buffer_before: 0,
    buffer_after: 0
  });

  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (event) {
      setFormData({
        ...formData,
        ...event,
        start_time: moment(event.start_time).format('YYYY-MM-DDTHH:mm'),
        end_time: moment(event.end_time).format('YYYY-MM-DDTHH:mm')
      });
    } else {
      setFormData({
        ...formData,
        calendar_id: calendars?.[0]?.id || ''
      });
    }
  }, [event, open]);

  const handleSubmit = () => {
    onSave({
      ...formData,
      start_time: new Date(formData.start_time).toISOString(),
      end_time: new Date(formData.end_time).toISOString()
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Create Event'}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
            <TabsTrigger value="attendees" className="flex-1">Attendees</TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            {/* Title */}
            <div>
              <Label>Event Title *</Label>
              <Input 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter event title..."
                className="mt-1"
              />
            </div>

            {/* Type & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Event Type</Label>
                <Select value={formData.event_type} onValueChange={(v) => setFormData({ ...formData, event_type: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {eventTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {priorities.map(p => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date/Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Start</Label>
                <Input 
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="flex items-center gap-1"><Clock className="w-4 h-4" /> End</Label>
                <Input 
                  type="datetime-local"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            {/* All Day */}
            <div className="flex items-center justify-between">
              <Label>All Day Event</Label>
              <Switch checked={formData.all_day} onCheckedChange={(v) => setFormData({ ...formData, all_day: v })} />
            </div>

            {/* Location */}
            <div>
              <Label className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Location Type</Label>
              <div className="flex gap-2 mt-1">
                {['online', 'physical', 'hybrid'].map(loc => (
                  <Badge 
                    key={loc}
                    variant={formData.location_type === loc ? 'default' : 'outline'}
                    className="cursor-pointer capitalize"
                    onClick={() => setFormData({ ...formData, location_type: loc })}
                  >
                    {loc}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Platform */}
            {formData.location_type !== 'physical' && (
              <div>
                <Label className="flex items-center gap-1"><Video className="w-4 h-4" /> Meeting Platform</Label>
                <Select value={formData.meeting_platform} onValueChange={(v) => setFormData({ ...formData, meeting_platform: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {platforms.map(p => (
                      <SelectItem key={p.value} value={p.value}>
                        <span className="flex items-center gap-2">{p.icon} {p.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Color */}
            <div>
              <Label>Color</Label>
              <div className="flex gap-2 mt-1">
                {colors.map(c => (
                  <button
                    key={c}
                    className={`w-8 h-8 rounded-full transition-transform ${formData.color === c ? 'scale-110 ring-2 ring-offset-2' : ''}`}
                    style={{ backgroundColor: c, ringColor: c }}
                    onClick={() => setFormData({ ...formData, color: c })}
                  />
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Textarea 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add description..."
                className="mt-1"
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="attendees" className="space-y-4 mt-4">
            <div>
              <Label className="flex items-center gap-1"><Users className="w-4 h-4" /> Add Attendees</Label>
              <Input placeholder="Enter email addresses..." className="mt-1" />
            </div>
            <p className="text-sm text-slate-500">Attendees will receive calendar invites and reminders.</p>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 mt-4">
            {/* Visibility */}
            <div>
              <Label className="flex items-center gap-1"><Eye className="w-4 h-4" /> Visibility</Label>
              <Select value={formData.visibility} onValueChange={(v) => setFormData({ ...formData, visibility: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="private"><Lock className="w-4 h-4 inline mr-2" />Private</SelectItem>
                  <SelectItem value="team"><Users className="w-4 h-4 inline mr-2" />Team</SelectItem>
                  <SelectItem value="public"><Globe className="w-4 h-4 inline mr-2" />Public</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Buffers */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Buffer Before (mins)</Label>
                <Input 
                  type="number"
                  value={formData.buffer_before}
                  onChange={(e) => setFormData({ ...formData, buffer_before: parseInt(e.target.value) || 0 })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Buffer After (mins)</Label>
                <Input 
                  type="number"
                  value={formData.buffer_after}
                  onChange={(e) => setFormData({ ...formData, buffer_after: parseInt(e.target.value) || 0 })}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Requires Approval */}
            <div className="flex items-center justify-between">
              <Label>Requires Approval</Label>
              <Switch 
                checked={formData.requires_approval} 
                onCheckedChange={(v) => setFormData({ ...formData, requires_approval: v })} 
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-lime-500 hover:bg-lime-600">
            {event ? 'Update Event' : 'Create Event'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}