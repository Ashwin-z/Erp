import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import moment from 'moment';

const statusColors = {
  todo: 'bg-slate-300',
  in_progress: 'bg-blue-500',
  review: 'bg-amber-500',
  completed: 'bg-emerald-500'
};

const milestoneColor = 'bg-violet-500';

export default function ProjectGanttChart({ project, tasks = [], onTaskClick }) {
  const [viewStart, setViewStart] = React.useState(() => 
    moment(project?.start_date || new Date()).startOf('week')
  );
  
  const weeks = 8;
  const dayWidth = 32;
  
  const days = useMemo(() => {
    const result = [];
    for (let i = 0; i < weeks * 7; i++) {
      result.push(moment(viewStart).add(i, 'days'));
    }
    return result;
  }, [viewStart]);

  const getBarStyle = (startDate, endDate) => {
    if (!startDate) return null;
    const start = moment(startDate);
    const end = endDate ? moment(endDate) : start;
    const startOffset = start.diff(viewStart, 'days');
    const duration = Math.max(1, end.diff(start, 'days') + 1);
    
    if (startOffset + duration < 0 || startOffset > weeks * 7) return null;
    
    return {
      left: `${Math.max(0, startOffset) * dayWidth}px`,
      width: `${Math.min(duration, weeks * 7 - startOffset) * dayWidth - 4}px`
    };
  };

  const navigateWeeks = (direction) => {
    setViewStart(prev => moment(prev).add(direction * 2, 'weeks'));
  };

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4" />Gantt Chart
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateWeeks(-1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-slate-600">
              {viewStart.format('MMM D')} - {moment(viewStart).add(weeks * 7 - 1, 'days').format('MMM D, YYYY')}
            </span>
            <Button variant="outline" size="icon" onClick={() => navigateWeeks(1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <div className="min-w-max">
          {/* Header */}
          <div className="flex border-b bg-slate-50">
            <div className="w-48 p-2 border-r font-medium text-sm text-slate-600 flex-shrink-0">Task</div>
            <div className="flex">
              {days.map((day, i) => (
                <div 
                  key={i} 
                  className={`text-center border-r text-xs ${day.day() === 0 || day.day() === 6 ? 'bg-slate-100' : ''}`}
                  style={{ width: dayWidth }}
                >
                  {i % 7 === 0 && (
                    <div className="font-medium text-slate-700 py-1 border-b">{day.format('MMM D')}</div>
                  )}
                  <div className={`py-1 ${day.isSame(moment(), 'day') ? 'bg-blue-100 font-bold text-blue-600' : 'text-slate-400'}`}>
                    {day.format('D')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          {project?.milestones?.map((milestone, idx) => {
            const style = getBarStyle(milestone.due_date, milestone.due_date);
            return (
              <div key={`m-${idx}`} className="flex border-b hover:bg-slate-50">
                <div className="w-48 p-2 border-r flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rotate-45 bg-violet-500" />
                    <span className="text-sm font-medium truncate">{milestone.name}</span>
                  </div>
                </div>
                <div className="flex-1 relative h-10">
                  {style && (
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center"
                      style={style}
                    >
                      <div className={`w-4 h-4 rotate-45 ${milestone.completed ? 'bg-emerald-500' : milestoneColor}`} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Tasks */}
          {tasks.map((task) => {
            const style = getBarStyle(task.due_date, task.due_date);
            return (
              <div 
                key={task.id} 
                className="flex border-b hover:bg-slate-50 cursor-pointer"
                onClick={() => onTaskClick?.(task)}
              >
                <div className="w-48 p-2 border-r flex-shrink-0">
                  <p className="text-sm truncate">{task.title}</p>
                  <p className="text-xs text-slate-400">{task.assignee_name || 'Unassigned'}</p>
                </div>
                <div className="flex-1 relative h-12">
                  {style && (
                    <div 
                      className={`absolute top-1/2 -translate-y-1/2 h-6 rounded ${statusColors[task.status]} opacity-80`}
                      style={style}
                    >
                      <span className="text-xs text-white px-2 truncate block leading-6">{task.title}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Today line */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none"
            style={{ left: `${192 + moment().diff(viewStart, 'days') * dayWidth}px` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}