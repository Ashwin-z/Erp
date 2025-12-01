import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, MoreHorizontal, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

const statusIcons = {
  done: CheckCircle2,
  in_progress: Clock,
  blocked: AlertTriangle
};

const statusColors = {
  done: 'text-green-600',
  in_progress: 'text-amber-600',
  todo: 'text-blue-600',
  blocked: 'text-red-600'
};

export default function TasksTableWidget({ widget, onViewAll }) {
  const tasks = widget.data?.tasks || [
    { id: 1, title: 'Complete API docs', status: 'in_progress', priority: 'high', due: 'Today' },
    { id: 2, title: 'Review PRs', status: 'todo', priority: 'medium', due: 'Tomorrow' },
    { id: 3, title: 'Deploy to staging', status: 'done', priority: 'high', due: 'Done' }
  ];
  const isPrivate = widget.visibility === 'private';

  return (
    <Card className="h-full hover:shadow-lg transition-all">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {widget.title || 'My Tasks'}
          {isPrivate && <Lock className="w-3 h-3 text-slate-400" />}
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {tasks.slice(0, 5).map(task => {
            const StatusIcon = statusIcons[task.status] || Clock;
            return (
              <div key={task.id} className="px-4 py-2 flex items-center gap-3 hover:bg-slate-50">
                <StatusIcon className={`w-4 h-4 ${statusColors[task.status]}`} />
                <span className="flex-1 text-sm truncate">{task.title}</span>
                <Badge variant="outline" className="text-[10px]">{task.due}</Badge>
              </div>
            );
          })}
        </div>
        <div className="p-2 border-t">
          <Button variant="ghost" size="sm" className="w-full" onClick={onViewAll}>
            View All Tasks
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}