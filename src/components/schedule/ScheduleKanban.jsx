import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Plus, Clock, AlertTriangle, ArrowRight, Ticket, 
  Calendar, CheckCircle2, Brain
} from 'lucide-react';

const columns = [
  { id: 'backlog', title: 'Backlog', color: '#94a3b8' },
  { id: 'todo', title: 'To Do', color: '#3b82f6' },
  { id: 'in_progress', title: 'In Progress', color: '#f59e0b' },
  { id: 'review', title: 'Review', color: '#8b5cf6' },
  { id: 'done', title: 'Done', color: '#22c55e' }
];

const priorityColors = {
  urgent: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-blue-500'
};

const typeIcons = {
  task: Calendar,
  ticket: Ticket,
  deadline: AlertTriangle,
  meeting: Calendar
};

export default function ScheduleKanban({ tasks, onTaskMove, onTaskClick, onAddTask }) {
  const getTasksByStatus = (status) => {
    return (tasks || []).filter(t => t.status === status).sort((a, b) => a.order - b.order);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    onTaskMove && onTaskMove(draggableId, destination.droppableId, destination.index);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 h-full">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          
          return (
            <div key={column.id} className="flex-shrink-0 w-72">
              <div className="bg-slate-100 rounded-xl p-3 h-full">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: column.color }} />
                    <h3 className="font-semibold text-slate-700 text-sm">{column.title}</h3>
                    <Badge variant="outline" className="text-xs">{columnTasks.length}</Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onAddTask && onAddTask(column.id)}>
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* Tasks */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-2 min-h-[150px] transition-colors rounded-lg p-1 ${
                        snapshot.isDraggingOver ? 'bg-lime-100' : ''
                      }`}
                    >
                      {columnTasks.map((task, index) => {
                        const TypeIcon = typeIcons[task.task_type] || Calendar;
                        
                        return (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => onTaskClick && onTaskClick(task)}
                                className={`bg-white rounded-lg p-3 shadow-sm border cursor-pointer hover:shadow-md transition-all ${
                                  snapshot.isDragging ? 'shadow-lg ring-2 ring-lime-400' : ''
                                } ${task.is_delegated ? 'border-amber-300' : 'border-slate-200'}`}
                              >
                                {/* Header */}
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-1.5">
                                    <TypeIcon className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-[10px] font-mono text-slate-400">{task.task_code}</span>
                                  </div>
                                  <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} />
                                </div>

                                {/* Title */}
                                <p className="font-medium text-sm text-slate-900 mb-2 line-clamp-2">{task.title}</p>

                                {/* AI Badge */}
                                {task.ai_scheduled && (
                                  <Badge className="bg-purple-100 text-purple-700 text-[10px] mb-2">
                                    <Brain className="w-3 h-3 mr-1" />
                                    AI Scheduled
                                  </Badge>
                                )}

                                {/* Delegated Badge */}
                                {task.is_delegated && (
                                  <Badge className="bg-amber-100 text-amber-700 text-[10px] mb-2">
                                    <ArrowRight className="w-3 h-3 mr-1" />
                                    Delegated
                                  </Badge>
                                )}

                                {/* Progress */}
                                {task.progress > 0 && (
                                  <div className="mb-2">
                                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-lime-500 rounded-full"
                                        style={{ width: `${task.progress}%` }}
                                      />
                                    </div>
                                  </div>
                                )}

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                    {task.due_date && (
                                      <span className="flex items-center gap-0.5">
                                        <Clock className="w-3 h-3" />
                                        {task.due_date}
                                      </span>
                                    )}
                                  </div>
                                  {task.assignee_name && (
                                    <Avatar className="w-5 h-5">
                                      <AvatarFallback className="text-[8px] bg-slate-200">
                                        {task.assignee_name.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}