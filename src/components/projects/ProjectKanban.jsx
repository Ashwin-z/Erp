import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Plus, MoreHorizontal, Clock, MessageSquare, Paperclip,
  AlertTriangle, CheckCircle2, Circle, ArrowUp, Flag
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const columns = [
  { id: 'backlog', title: 'Backlog', color: '#94a3b8', limit: null },
  { id: 'todo', title: 'To Do', color: '#3b82f6', limit: 10 },
  { id: 'in_progress', title: 'In Progress', color: '#f59e0b', limit: 5 },
  { id: 'review', title: 'Review', color: '#8b5cf6', limit: 3 },
  { id: 'done', title: 'Done', color: '#22c55e', limit: null }
];

const priorityConfig = {
  critical: { color: 'bg-red-500', icon: AlertTriangle, label: 'Critical' },
  high: { color: 'bg-orange-500', icon: ArrowUp, label: 'High' },
  medium: { color: 'bg-yellow-500', icon: Flag, label: 'Medium' },
  low: { color: 'bg-blue-500', icon: Circle, label: 'Low' }
};

const typeConfig = {
  task: { color: 'bg-blue-100 text-blue-700', icon: '📋' },
  bug: { color: 'bg-red-100 text-red-700', icon: '🐛' },
  feature: { color: 'bg-green-100 text-green-700', icon: '✨' },
  story: { color: 'bg-purple-100 text-purple-700', icon: '📖' },
  epic: { color: 'bg-indigo-100 text-indigo-700', icon: '🎯' }
};

export default function ProjectKanban({ tasks, onTaskMove, onTaskClick, onAddTask }) {
  const [isDragging, setIsDragging] = useState(false);

  const getTasksByStatus = (status) => {
    return (tasks || []).filter(t => t.status === status).sort((a, b) => a.order - b.order);
  };

  const handleDragEnd = (result) => {
    setIsDragging(false);
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    onTaskMove && onTaskMove(draggableId, destination.droppableId, destination.index);
  };

  return (
    <DragDropContext onDragStart={() => setIsDragging(true)} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 h-full">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          const isOverLimit = column.limit && columnTasks.length > column.limit;

          return (
            <div key={column.id} className="flex-shrink-0 w-80">
              <div className="bg-slate-100 rounded-xl p-3 h-full">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: column.color }} />
                    <h3 className="font-semibold text-slate-700">{column.title}</h3>
                    <Badge variant="outline" className={isOverLimit ? 'bg-red-100 text-red-700' : ''}>
                      {columnTasks.length}{column.limit && `/${column.limit}`}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => onAddTask && onAddTask(column.id)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Tasks */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-2 min-h-[200px] transition-colors rounded-lg p-1 ${
                        snapshot.isDraggingOver ? 'bg-lime-100' : ''
                      }`}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => onTaskClick && onTaskClick(task)}
                              className={`bg-white rounded-lg p-3 shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition-all ${
                                snapshot.isDragging ? 'shadow-lg ring-2 ring-lime-400' : ''
                              }`}
                            >
                              {/* Task Type & Priority */}
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Badge className={typeConfig[task.task_type]?.color || 'bg-slate-100'}>
                                    {typeConfig[task.task_type]?.icon} {task.task_type}
                                  </Badge>
                                  {task.blockers?.length > 0 && (
                                    <Badge className="bg-red-100 text-red-700">
                                      <AlertTriangle className="w-3 h-3 mr-1" /> Blocked
                                    </Badge>
                                  )}
                                </div>
                                <div className={`w-2 h-2 rounded-full ${priorityConfig[task.priority]?.color}`} />
                              </div>

                              {/* Task Title */}
                              <p className="font-medium text-slate-900 mb-2 line-clamp-2">{task.title}</p>

                              {/* Task Code */}
                              <p className="text-xs text-slate-500 font-mono mb-2">{task.task_code}</p>

                              {/* Progress Bar */}
                              {task.progress > 0 && (
                                <div className="mb-2">
                                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-lime-500 rounded-full transition-all"
                                      style={{ width: `${task.progress}%` }}
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Tags */}
                              {task.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {task.tags.slice(0, 3).map((tag, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                                  ))}
                                </div>
                              )}

                              {/* Footer */}
                              <div className="flex items-center justify-between pt-2 border-t">
                                <div className="flex items-center gap-3 text-slate-400 text-xs">
                                  {task.estimated_hours > 0 && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {task.actual_hours || 0}/{task.estimated_hours}h
                                    </span>
                                  )}
                                  {task.comments_count > 0 && (
                                    <span className="flex items-center gap-1">
                                      <MessageSquare className="w-3 h-3" />
                                      {task.comments_count}
                                    </span>
                                  )}
                                  {task.attachments?.length > 0 && (
                                    <span className="flex items-center gap-1">
                                      <Paperclip className="w-3 h-3" />
                                      {task.attachments.length}
                                    </span>
                                  )}
                                </div>
                                {task.assignee_name && (
                                  <Avatar className="w-6 h-6">
                                    <AvatarFallback className="text-xs bg-slate-200">
                                      {task.assignee_name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
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