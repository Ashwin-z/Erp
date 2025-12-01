import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Users, Briefcase, User, Calendar, Filter, RotateCcw, Save } from 'lucide-react';

export default function DashboardFilterBar({ filters, onFilterChange, presets, onSavePreset, onLoadPreset }) {
  const updateFilter = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      level: 'user',
      department: '',
      team: '',
      project: '',
      dateRange: 'month'
    });
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border shadow-sm flex-wrap">
      {/* Level Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">Level:</span>
        <div className="flex border rounded-lg overflow-hidden">
          {[
            { id: 'company', icon: Building2, label: 'Company' },
            { id: 'department', icon: Users, label: 'Dept' },
            { id: 'team', icon: Users, label: 'Team' },
            { id: 'project', icon: Briefcase, label: 'Project' },
            { id: 'user', icon: User, label: 'Personal' }
          ].map(level => (
            <Button
              key={level.id}
              variant={filters.level === level.id ? 'default' : 'ghost'}
              size="sm"
              className={`rounded-none border-0 ${filters.level === level.id ? 'bg-lime-500' : ''}`}
              onClick={() => updateFilter('level', level.id)}
            >
              <level.icon className="w-3 h-3 mr-1" />
              {level.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Department */}
      {filters.level !== 'user' && (
        <Select value={filters.department} onValueChange={(v) => updateFilter('department', v)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>All Departments</SelectItem>
            <SelectItem value="hr">HR</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="it">IT</SelectItem>
          </SelectContent>
        </Select>
      )}

      {/* Date Range */}
      <Select value={filters.dateRange} onValueChange={(v) => updateFilter('dateRange', v)}>
        <SelectTrigger className="w-28">
          <Calendar className="w-3 h-3 mr-1" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="quarter">This Quarter</SelectItem>
          <SelectItem value="year">This Year</SelectItem>
        </SelectContent>
      </Select>

      {/* Presets */}
      {presets && presets.length > 0 && (
        <Select onValueChange={onLoadPreset}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Load Preset" />
          </SelectTrigger>
          <SelectContent>
            {presets.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <div className="flex-1" />

      {/* Actions */}
      <Button variant="outline" size="sm" onClick={clearFilters}>
        <RotateCcw className="w-3 h-3 mr-1" />
        Reset
      </Button>
      <Button variant="outline" size="sm" onClick={onSavePreset}>
        <Save className="w-3 h-3 mr-1" />
        Save View
      </Button>
    </div>
  );
}