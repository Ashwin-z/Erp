import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, 
  Link2, AlertTriangle, CheckCircle2
} from 'lucide-react';
import moment from 'moment';

const priorityColors = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6'
};

const statusColors = {
  backlog: '#94a3b8',
  todo: '#3b82f6',
  in_progress: '#f59e0b',
  review: '#8b5cf6',
  done: '#22c55e',
  blocked: '#ef4444'
};

export default function ProjectGantt({ tasks, project, onTaskClick, onTaskUpdate }) {
  const [zoom, setZoom] = useState('week'); // day, week, month
  const [startDate, setStartDate] = useState(moment().startOf('month'));

  const dateRange = useMemo(() => {
    const days = [];
    const unitCount = zoom === 'day' ? 14 : zoom === 'week' ? 8 : 6;
    const unit = zoom === 'day' ? 'day' : zoom === 'week' ? 'week' : 'month';
    
    for (let i = 0; i < unitCount; i++) {
      const date = moment(startDate).add(i, unit);
      days.push(date);
    }
    return days;
  }, [startDate, zoom]);

  const getTaskPosition = (task) => {
    if (!task.start_date || !task.due_date) return null;
    
    const taskStart = moment(task.start_date);
    const taskEnd = moment(task.due_date);
    const rangeStart = dateRange[0];
    const rangeEnd = dateRange[dateRange.length - 1];
    
    const totalDays = rangeEnd.diff(rangeStart, 'days');
    const startOffset = Math.max(0, taskStart.diff(rangeStart, 'days'));
    const duration = taskEnd.diff(taskStart, 'days') + 1;
    
    const left = (startOffset / totalDays) * 100;
    const width = Math.min((duration / totalDays) * 100, 100 - left);
    
    return { left: `${left}%`, width: `${Math.max(width, 2)}%` };
  };

  const navigate = (direction) => {
    const unit = zoom === 'day' ? 'week' : zoom === 'week' ? 'month' : 'quarter';
    setStartDate(moment(startDate).add(direction, unit));
  };

  const criticalPath = useMemo(() => {
    // Simple critical path detection - tasks with dependencies that affect end date
    return (tasks || []).filter(t => t.dependencies?.length > 0 && t.priority === 'critical');
  }, [tasks]);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="text-lg">Gantt Chart</CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-lg">
            {['day', 'week', 'month'].map((z) => (
              <Button
                key={z}
                variant={zoom === z ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setZoom(z)}
                className={zoom === z ? 'bg-lime-500' : ''}
              >
                {z.charAt(0).toUpperCase() + z.slice(1)}
              </Button>
            ))}
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setStartDate(moment().startOf('month'))}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigate(1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-auto">
        <div className="min-w-[1200px]">
          {/* Timeline Header */}
          <div className="flex border-b bg-slate-50 sticky top-0 z-10">
            <div className="w-64 flex-shrink-0 p-3 border-r font-medium">Task</div>
            <div className="flex-1 flex">
              {dateRange.map((date, i) => (
                <div 
                  key={i} 
                  className="flex-1 p-2 text-center text-sm border-r last:border-r-0"
                >
                  <div className="font-medium">
                    {zoom === 'day' ? date.format('ddd') : 
                     zoom === 'week' ? `Week ${date.week()}` : 
                     date.format('MMM')}
                  </div>
                  <div className="text-xs text-slate-500">
                    {zoom === 'day' ? date.format('D') : 
                     zoom === 'week' ? date.format('MMM D') : 
                     date.format('YYYY')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div className="divide-y">
            {(tasks || []).map((task) => {
              const position = getTaskPosition(task);
              const isCritical = criticalPath.some(t => t.id === task.id);
              
              return (
                <div key={task.id} className="flex hover:bg-slate-50">
                  {/* Task Info */}
                  <div 
                    className="w-64 flex-shrink-0 p-3 border-r cursor-pointer"
                    onClick={() => onTaskClick && onTaskClick(task)}
                  >
                    <div className="flex items-center gap-2">
                      {task.dependencies?.length > 0 && (
                        <Link2 className="w-3 h-3 text-slate-400" />
                      )}
                      {isCritical && (
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                      )}
                      <span className="font-medium text-sm truncate">{task.title}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500 font-mono">{task.task_code}</span>
                      {task.assignee_name && (
                        <Badge variant="outline" className="text-xs">{task.assignee_name}</Badge>
                      )}
                    </div>
                  </div>

                  {/* Gantt Bar */}
                  <div className="flex-1 relative h-16 p-2">
                    {position && (
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 h-8 rounded-lg cursor-pointer transition-all hover:shadow-lg flex items-center px-2 ${
                          isCritical ? 'ring-2 ring-red-400 ring-offset-1' : ''
                        }`}
                        style={{
                          left: position.left,
                          width: position.width,
                          backgroundColor: statusColors[task.status] || '#3b82f6'
                        }}
                        onClick={() => onTaskClick && onTaskClick(task)}
                      >
                        {/* Progress Bar */}
                        <div 
                          className="absolute inset-0 rounded-lg bg-black/20"
                          style={{ width: `${task.progress || 0}%` }}
                        />
                        <span className="relative text-white text-xs font-medium truncate">
                          {task.progress}%
                        </span>
                        {task.status === 'done' && (
                          <CheckCircle2 className="w-4 h-4 text-white ml-auto relative" />
                        )}
                      </div>
                    )}

                    {/* Dependency Lines */}
                    {task.dependencies?.map((depId, i) => (
                      <div key={i} className="absolute top-1/2 h-0.5 bg-slate-300" />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="p-4 border-t bg-slate-50 flex items-center gap-6 text-sm">
          <span className="font-medium">Legend:</span>
          {Object.entries(statusColors).map(([status, color]) => (
            <div key={status} className="flex items-center gap-2">
              <div className="w-4 h-3 rounded" style={{ backgroundColor: color }} />
              <span className="capitalize">{status.replace('_', ' ')}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 ml-4">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span>Critical Path</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}