import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Search, Filter, RotateCcw } from 'lucide-react';

const statusOptions = [
  { id: 'backlog', label: 'Backlog', color: '#94a3b8' },
  { id: 'todo', label: 'To Do', color: '#3b82f6' },
  { id: 'in_progress', label: 'In Progress', color: '#f59e0b' },
  { id: 'review', label: 'Review', color: '#8b5cf6' },
  { id: 'done', label: 'Done', color: '#22c55e' },
  { id: 'blocked', label: 'Blocked', color: '#ef4444' }
];

const priorityOptions = [
  { id: 'critical', label: 'Critical', color: 'bg-red-500' },
  { id: 'high', label: 'High', color: 'bg-orange-500' },
  { id: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { id: 'low', label: 'Low', color: 'bg-blue-500' }
];

const typeOptions = [
  { id: 'task', label: '📋 Task' },
  { id: 'bug', label: '🐛 Bug' },
  { id: 'feature', label: '✨ Feature' },
  { id: 'story', label: '📖 Story' },
  { id: 'epic', label: '🎯 Epic' }
];

export default function ProjectFilterPanel({ filters, onFilterChange, teamMembers, onClose }) {
  const updateFilter = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key, value) => {
    const current = filters[key] || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter(key, updated);
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      statuses: [],
      priorities: [],
      types: [],
      assignees: [],
      tags: [],
      dateRange: null
    });
  };

  const activeFilterCount = [
    filters.search ? 1 : 0,
    (filters.statuses?.length || 0),
    (filters.priorities?.length || 0),
    (filters.types?.length || 0),
    (filters.assignees?.length || 0)
  ].reduce((a, b) => a + b, 0);

  const members = teamMembers || [
    { email: 'john@example.com', name: 'John Smith' },
    { email: 'sarah@example.com', name: 'Sarah Chen' },
    { email: 'mike@example.com', name: 'Mike Johnson' },
    { email: 'anna@example.com', name: 'Anna Lee' }
  ];

  return (
    <Card className="w-80 shadow-lg">
      <CardHeader className="py-3 border-b flex flex-row items-center justify-between">
        <CardTitle className="text-sm flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="bg-lime-500">{activeFilterCount}</Badge>
          )}
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <RotateCcw className="w-3 h-3 mr-1" />
            Clear
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-5 max-h-[500px] overflow-y-auto">
        {/* Search */}
        <div>
          <Label className="text-xs font-medium mb-2 block">Search</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={filters.search || ''}
              onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Search tasks..."
              className="pl-8"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <Label className="text-xs font-medium mb-2 block">Status</Label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(status => (
              <Badge
                key={status.id}
                variant="outline"
                className={`cursor-pointer transition-all ${
                  (filters.statuses || []).includes(status.id) 
                    ? 'ring-2 ring-lime-400 bg-lime-50' 
                    : 'hover:bg-slate-50'
                }`}
                onClick={() => toggleArrayFilter('statuses', status.id)}
              >
                <div className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: status.color }} />
                {status.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div>
          <Label className="text-xs font-medium mb-2 block">Priority</Label>
          <div className="flex flex-wrap gap-2">
            {priorityOptions.map(priority => (
              <Badge
                key={priority.id}
                variant="outline"
                className={`cursor-pointer transition-all ${
                  (filters.priorities || []).includes(priority.id) 
                    ? 'ring-2 ring-lime-400 bg-lime-50' 
                    : 'hover:bg-slate-50'
                }`}
                onClick={() => toggleArrayFilter('priorities', priority.id)}
              >
                <div className={`w-2 h-2 rounded-full mr-1.5 ${priority.color}`} />
                {priority.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Type */}
        <div>
          <Label className="text-xs font-medium mb-2 block">Type</Label>
          <div className="flex flex-wrap gap-2">
            {typeOptions.map(type => (
              <Badge
                key={type.id}
                variant="outline"
                className={`cursor-pointer transition-all ${
                  (filters.types || []).includes(type.id) 
                    ? 'ring-2 ring-lime-400 bg-lime-50' 
                    : 'hover:bg-slate-50'
                }`}
                onClick={() => toggleArrayFilter('types', type.id)}
              >
                {type.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Assignee */}
        <div>
          <Label className="text-xs font-medium mb-2 block">Assignee</Label>
          <div className="space-y-2">
            {members.map(member => (
              <div key={member.email} className="flex items-center gap-2">
                <Checkbox
                  checked={(filters.assignees || []).includes(member.email)}
                  onCheckedChange={() => toggleArrayFilter('assignees', member.email)}
                />
                <span className="text-sm">{member.name}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Checkbox
                checked={(filters.assignees || []).includes('unassigned')}
                onCheckedChange={() => toggleArrayFilter('assignees', 'unassigned')}
              />
              <span className="text-sm text-slate-500">Unassigned</span>
            </div>
          </div>
        </div>

        {/* Due Date */}
        <div>
          <Label className="text-xs font-medium mb-2 block">Due Date</Label>
          <Select 
            value={filters.dateRange || ''} 
            onValueChange={(v) => updateFilter('dateRange', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>Any time</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="today">Due Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="no_date">No Due Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}