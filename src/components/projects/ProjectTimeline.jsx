import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Users, AlertCircle } from 'lucide-react';
import moment from 'moment';

const statusColors = {
  backlog: '#94a3b8',
  todo: '#3b82f6',
  in_progress: '#f59e0b',
  review: '#8b5cf6',
  done: '#22c55e',
  blocked: '#ef4444'
};

export default function ProjectTimeline({ tasks, teamMembers, onTaskClick }) {
  const [startDate, setStartDate] = useState(moment().startOf('week'));
  const [viewMode, setViewMode] = useState('week'); // week, month

  const days = [];
  const dayCount = viewMode === 'week' ? 7 : 30;
  for (let i = 0; i < dayCount; i++) {
    days.push(moment(startDate).add(i, 'days'));
  }

  const getTasksForUserAndDate = (userEmail, date) => {
    return (tasks || []).filter(t => {
      if (t.assignee !== userEmail) return false;
      const taskStart = moment(t.start_date);
      const taskEnd = moment(t.due_date);
      return date.isBetween(taskStart, taskEnd, 'day', '[]');
    });
  };

  const getWorkloadColor = (taskCount) => {
    if (taskCount === 0) return 'bg-slate-100';
    if (taskCount <= 2) return 'bg-green-100';
    if (taskCount <= 4) return 'bg-amber-100';
    return 'bg-red-100';
  };

  const navigate = (direction) => {
    const unit = viewMode === 'week' ? 'week' : 'month';
    setStartDate(moment(startDate).add(direction, unit));
  };

  const members = teamMembers || [
    { email: 'john@example.com', name: 'John Smith' },
    { email: 'sarah@example.com', name: 'Sarah Chen' },
    { email: 'mike@example.com', name: 'Mike Johnson' },
    { email: 'anna@example.com', name: 'Anna Lee' }
  ];

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5" />
          Resource Timeline
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-lg">
            {['week', 'month'].map((v) => (
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
          <div className="flex gap-1">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setStartDate(moment().startOf('week'))}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigate(1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-auto">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="flex border-b bg-slate-50 sticky top-0 z-10">
            <div className="w-48 flex-shrink-0 p-3 border-r font-medium">Team Member</div>
            <div className="flex-1 flex">
              {days.map((day, i) => {
                const isToday = day.isSame(moment(), 'day');
                const isWeekend = day.day() === 0 || day.day() === 6;
                return (
                  <div 
                    key={i} 
                    className={`flex-1 p-2 text-center text-sm border-r last:border-r-0 ${
                      isWeekend ? 'bg-slate-100' : ''
                    } ${isToday ? 'bg-lime-50' : ''}`}
                  >
                    <div className="font-medium">{day.format('ddd')}</div>
                    <div className={`text-xs ${isToday ? 'text-lime-600 font-bold' : 'text-slate-500'}`}>
                      {day.format('D')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team Members */}
          <div className="divide-y">
            {members.map((member) => {
              const memberTasks = (tasks || []).filter(t => t.assignee === member.email);
              const totalHours = memberTasks.reduce((sum, t) => sum + (t.estimated_hours || 0), 0);
              const isOverloaded = totalHours > 40;

              return (
                <div key={member.email} className="flex hover:bg-slate-50">
                  <div className="w-48 flex-shrink-0 p-3 border-r">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-slate-200 text-xs">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-slate-500">{totalHours}h</span>
                          {isOverloaded && (
                            <AlertCircle className="w-3 h-3 text-red-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 flex">
                    {days.map((day, i) => {
                      const dayTasks = getTasksForUserAndDate(member.email, day);
                      const isWeekend = day.day() === 0 || day.day() === 6;
                      
                      return (
                        <div 
                          key={i}
                          className={`flex-1 p-1 border-r last:border-r-0 min-h-[60px] ${
                            isWeekend ? 'bg-slate-50' : ''
                          } ${getWorkloadColor(dayTasks.length)}`}
                        >
                          {dayTasks.slice(0, 3).map((task, j) => (
                            <div
                              key={task.id}
                              className="text-xs p-1 rounded mb-1 cursor-pointer truncate"
                              style={{ backgroundColor: statusColors[task.status] + '40' }}
                              onClick={() => onTaskClick && onTaskClick(task)}
                            >
                              {task.title}
                            </div>
                          ))}
                          {dayTasks.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{dayTasks.length - 3} more
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="p-4 border-t bg-slate-50 flex items-center gap-6 text-sm">
          <span className="font-medium">Workload:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100" />
            <span>Light (1-2)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-100" />
            <span>Medium (3-4)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-100" />
            <span>Heavy (5+)</span>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>Overloaded (&gt;40h/week)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}