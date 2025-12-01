import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ChevronLeft, ChevronRight, Building2, Users, Briefcase, 
  Calendar, Filter, Layers, Eye
} from 'lucide-react';
import moment from 'moment';

const eventTypeColors = {
  meeting: '#3b82f6',
  task: '#22c55e',
  deadline: '#ef4444',
  holiday: '#a855f7',
  leave: '#f59e0b',
  project: '#06b6d4',
  ticket: '#ec4899'
};

export default function CompanyCalendarView({ events, departments, onEventClick, onDateChange }) {
  const [currentDate, setCurrentDate] = useState(moment());
  const [viewMode, setViewMode] = useState('month');
  const [filters, setFilters] = useState({
    department: 'all',
    eventTypes: ['meeting', 'task', 'deadline', 'holiday', 'leave', 'project', 'ticket'],
    showStaffAvailability: true
  });

  const daysInMonth = () => {
    const days = [];
    const startOfMonth = moment(currentDate).startOf('month');
    const endOfMonth = moment(currentDate).endOf('month');
    const startDay = moment(startOfMonth).startOf('week');
    const endDay = moment(endOfMonth).endOf('week');
    
    let day = startDay.clone();
    while (day.isSameOrBefore(endDay)) {
      days.push(day.clone());
      day.add(1, 'day');
    }
    return days;
  };

  const getEventsForDay = (day) => {
    return (events || []).filter(e => {
      const eventDate = moment(e.start_time);
      return eventDate.isSame(day, 'day') && filters.eventTypes.includes(e.event_type);
    });
  };

  const navigate = (direction) => {
    setCurrentDate(moment(currentDate).add(direction, viewMode));
  };

  const deptList = departments || [
    { id: 'all', name: 'All Departments' },
    { id: 'hr', name: 'Human Resources' },
    { id: 'sales', name: 'Sales' },
    { id: 'finance', name: 'Finance' },
    { id: 'it', name: 'IT' }
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5 text-lime-600" />
            Company Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            {/* Department Filter */}
            <Select value={filters.department} onValueChange={(v) => setFilters({...filters, department: v})}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {deptList.map(d => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex border rounded-lg">
              {['week', 'month'].map(v => (
                <Button
                  key={v}
                  variant={viewMode === v ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode(v)}
                  className={viewMode === v ? 'bg-lime-500' : ''}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </Button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex gap-1">
              <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(moment())}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={() => navigate(1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        <p className="text-slate-500 text-sm mt-1">{currentDate.format('MMMM YYYY')}</p>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-auto">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b bg-slate-50 sticky top-0 z-10">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-slate-600">{day}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 divide-x divide-y">
          {daysInMonth().map((day, i) => {
            const isToday = day.isSame(moment(), 'day');
            const isCurrentMonth = day.isSame(currentDate, 'month');
            const dayEvents = getEventsForDay(day);

            return (
              <div
                key={i}
                className={`min-h-[100px] p-1 ${
                  isCurrentMonth ? 'bg-white' : 'bg-slate-50'
                } ${isToday ? 'ring-2 ring-inset ring-lime-500' : ''}`}
                onClick={() => onDateChange && onDateChange(day)}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday ? 'text-lime-600' : isCurrentMonth ? 'text-slate-900' : 'text-slate-400'
                }`}>
                  {day.format('D')}
                </div>
                <div className="space-y-0.5">
                  {dayEvents.slice(0, 3).map((event, j) => (
                    <div
                      key={j}
                      className="text-xs px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80"
                      style={{ backgroundColor: eventTypeColors[event.event_type] + '20', color: eventTypeColors[event.event_type] }}
                      onClick={(e) => { e.stopPropagation(); onEventClick && onEventClick(event); }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-slate-500 px-1">+{dayEvents.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="p-3 border-t bg-slate-50 flex flex-wrap items-center gap-4 text-xs">
          {Object.entries(eventTypeColors).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
              <span className="capitalize">{type}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}