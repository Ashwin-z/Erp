import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Search, Filter, X, Calendar, Tag, MapPin, Users, Clock } from 'lucide-react';

const eventTypes = [
  { value: 'meeting', label: 'Meeting', color: 'bg-blue-500' },
  { value: 'task', label: 'Task', color: 'bg-green-500' },
  { value: 'deadline', label: 'Deadline', color: 'bg-red-500' },
  { value: 'reminder', label: 'Reminder', color: 'bg-amber-500' },
  { value: 'client_call', label: 'Client Call', color: 'bg-purple-500' },
  { value: 'team_sync', label: 'Team Sync', color: 'bg-cyan-500' },
  { value: 'one_on_one', label: '1:1', color: 'bg-pink-500' }
];

const priorities = [
  { value: 'urgent', label: 'Urgent', color: 'bg-red-500' },
  { value: 'high', label: 'High', color: 'bg-orange-500' },
  { value: 'medium', label: 'Medium', color: 'bg-amber-500' },
  { value: 'low', label: 'Low', color: 'bg-green-500' }
];

const statuses = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];

const durations = [
  { value: '15', label: '15 mins' },
  { value: '30', label: '30 mins' },
  { value: '45', label: '45 mins' },
  { value: '60', label: '1 hour' },
  { value: '90', label: '1.5 hours' },
  { value: '120', label: '2+ hours' }
];

export default function CalendarFilters({ filters, setFilters, calendars, tags, onClear }) {
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key, value) => {
    setFilters(prev => {
      const current = prev[key] || [];
      const updated = current.includes(value) 
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  const activeFiltersCount = Object.values(filters).filter(v => 
    v && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge className="bg-lime-500">{activeFiltersCount}</Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onClear}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div>
          <Label className="text-xs text-slate-500 mb-2 block">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search events..."
              value={filters.search || ''}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Calendars */}
        <div>
          <Label className="text-xs text-slate-500 mb-2 block flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Calendars
          </Label>
          <div className="space-y-2">
            {(calendars || []).map(cal => (
              <div key={cal.id} className="flex items-center gap-2">
                <Checkbox 
                  checked={(filters.calendars || []).includes(cal.id)}
                  onCheckedChange={() => toggleArrayFilter('calendars', cal.id)}
                />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cal.color }} />
                <span className="text-sm">{cal.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Event Type */}
        <div>
          <Label className="text-xs text-slate-500 mb-2 block">Event Type</Label>
          <div className="flex flex-wrap gap-2">
            {eventTypes.map(type => (
              <Badge 
                key={type.value}
                variant={(filters.eventTypes || []).includes(type.value) ? 'default' : 'outline'}
                className={`cursor-pointer ${(filters.eventTypes || []).includes(type.value) ? type.color : ''}`}
                onClick={() => toggleArrayFilter('eventTypes', type.value)}
              >
                {type.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div>
          <Label className="text-xs text-slate-500 mb-2 block">Priority</Label>
          <div className="flex flex-wrap gap-2">
            {priorities.map(p => (
              <Badge 
                key={p.value}
                variant={(filters.priorities || []).includes(p.value) ? 'default' : 'outline'}
                className={`cursor-pointer ${(filters.priorities || []).includes(p.value) ? p.color : ''}`}
                onClick={() => toggleArrayFilter('priorities', p.value)}
              >
                {p.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <Label className="text-xs text-slate-500 mb-2 block">Status</Label>
          <Select value={filters.status || 'all'} onValueChange={(v) => updateFilter('status', v === 'all' ? null : v)}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map(s => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location Type */}
        <div>
          <Label className="text-xs text-slate-500 mb-2 block flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Location
          </Label>
          <div className="flex gap-2">
            {['online', 'physical', 'hybrid'].map(loc => (
              <Badge 
                key={loc}
                variant={(filters.locationTypes || []).includes(loc) ? 'default' : 'outline'}
                className="cursor-pointer capitalize"
                onClick={() => toggleArrayFilter('locationTypes', loc)}
              >
                {loc}
              </Badge>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <Label className="text-xs text-slate-500 mb-2 block flex items-center gap-1">
            <Clock className="w-3 h-3" /> Duration
          </Label>
          <Select value={filters.duration || 'all'} onValueChange={(v) => updateFilter('duration', v === 'all' ? null : v)}>
            <SelectTrigger>
              <SelectValue placeholder="Any duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Duration</SelectItem>
              {durations.map(d => (
                <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tags */}
        <div>
          <Label className="text-xs text-slate-500 mb-2 block flex items-center gap-1">
            <Tag className="w-3 h-3" /> Tags
          </Label>
          <div className="flex flex-wrap gap-2">
            {(tags || []).map(tag => (
              <Badge 
                key={tag.id}
                variant={(filters.tags || []).includes(tag.name) ? 'default' : 'outline'}
                className="cursor-pointer"
                style={{ 
                  backgroundColor: (filters.tags || []).includes(tag.name) ? tag.color : undefined,
                  borderColor: tag.color 
                }}
                onClick={() => toggleArrayFilter('tags', tag.name)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Participants */}
        <div>
          <Label className="text-xs text-slate-500 mb-2 block flex items-center gap-1">
            <Users className="w-3 h-3" /> Participants
          </Label>
          <Input 
            placeholder="Filter by participant..."
            value={filters.participant || ''}
            onChange={(e) => updateFilter('participant', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}