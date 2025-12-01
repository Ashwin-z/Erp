import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, DollarSign, Calendar, User, Building2, 
  MoreHorizontal, Edit, Trash2, TrendingUp, Target
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import moment from 'moment';
import OpportunityFormModal from './OpportunityFormModal';

const stages = [
  { id: 'prospecting', name: 'Prospecting', color: 'bg-slate-500', probability: 10 },
  { id: 'qualification', name: 'Qualification', color: 'bg-blue-500', probability: 25 },
  { id: 'proposal', name: 'Proposal', color: 'bg-violet-500', probability: 50 },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-amber-500', probability: 75 },
  { id: 'closed_won', name: 'Closed Won', color: 'bg-emerald-500', probability: 100 },
  { id: 'closed_lost', name: 'Closed Lost', color: 'bg-red-500', probability: 0 }
];

export default function SalesPipeline() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState(null);
  const queryClient = useQueryClient();

  const { data: opportunities = [], isLoading } = useQuery({
    queryKey: ['opportunities'],
    queryFn: () => base44.entities.Opportunity.list('-created_date')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Opportunity.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Opportunity.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast.success('Opportunity deleted');
    }
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const { draggableId, destination } = result;
    const newStage = destination.droppableId;
    const opportunity = opportunities.find(o => o.id === draggableId);
    
    if (opportunity && opportunity.stage !== newStage) {
      const stageInfo = stages.find(s => s.id === newStage);
      updateMutation.mutate({
        id: draggableId,
        data: { 
          stage: newStage,
          probability: stageInfo?.probability || opportunity.probability,
          ...(newStage === 'closed_won' || newStage === 'closed_lost' 
            ? { actual_close_date: new Date().toISOString().split('T')[0] } 
            : {})
        }
      });
      toast.success(`Moved to ${stageInfo?.name}`);
    }
  };

  // Calculate pipeline stats
  const pipelineValue = opportunities
    .filter(o => !['closed_won', 'closed_lost'].includes(o.stage))
    .reduce((sum, o) => sum + (o.value || 0), 0);
  
  const weightedValue = opportunities
    .filter(o => !['closed_won', 'closed_lost'].includes(o.stage))
    .reduce((sum, o) => sum + ((o.value || 0) * (o.probability || 0) / 100), 0);

  const wonValue = opportunities
    .filter(o => o.stage === 'closed_won')
    .reduce((sum, o) => sum + (o.value || 0), 0);

  const conversionRate = opportunities.length > 0
    ? (opportunities.filter(o => o.stage === 'closed_won').length / opportunities.length * 100).toFixed(1)
    : 0;

  const getStageOpportunities = (stageId) => {
    return opportunities.filter(o => o.stage === stageId);
  };

  const getStageValue = (stageId) => {
    return getStageOpportunities(stageId).reduce((sum, o) => sum + (o.value || 0), 0);
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${(pipelineValue / 1000).toFixed(0)}K</p>
                <p className="text-sm text-slate-500">Pipeline Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${(weightedValue / 1000).toFixed(0)}K</p>
                <p className="text-sm text-slate-500">Weighted Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${(wonValue / 1000).toFixed(0)}K</p>
                <p className="text-sm text-slate-500">Won This Period</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{conversionRate}%</p>
                <p className="text-sm text-slate-500">Conversion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <Button onClick={() => { setEditingOpp(null); setFormOpen(true); }} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />Add Opportunity
        </Button>
      </div>

      {/* Pipeline Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const stageOpps = getStageOpportunities(stage.id);
            const stageValue = getStageValue(stage.id);
            
            return (
              <Droppable key={stage.id} droppableId={stage.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-shrink-0 w-72 rounded-xl ${
                      snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-slate-50'
                    }`}
                  >
                    {/* Stage Header */}
                    <div className="p-3 border-b border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                          <span className="font-medium text-slate-900">{stage.name}</span>
                          <Badge variant="secondary" className="text-xs">{stageOpps.length}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500">${stageValue.toLocaleString()}</p>
                    </div>

                    {/* Opportunities */}
                    <div className="p-2 min-h-[400px] space-y-2">
                      {stageOpps.map((opp, index) => (
                        <Draggable key={opp.id} draggableId={opp.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white rounded-lg border p-3 shadow-sm ${
                                snapshot.isDragging ? 'shadow-lg border-blue-300' : 'border-slate-200'
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-slate-900 text-sm line-clamp-1">
                                  {opp.name}
                                </h4>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="w-6 h-6">
                                      <MoreHorizontal className="w-3 h-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => { setEditingOpp(opp); setFormOpen(true); }}>
                                      <Edit className="w-4 h-4 mr-2" />Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600" onClick={() => deleteMutation.mutate(opp.id)}>
                                      <Trash2 className="w-4 h-4 mr-2" />Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>

                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                  <Building2 className="w-3 h-3" />
                                  <span className="truncate">{opp.customer_name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                  <DollarSign className="w-3 h-3" />
                                  <span className="font-medium">${(opp.value || 0).toLocaleString()}</span>
                                </div>
                                {opp.expected_close_date && (
                                  <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <Calendar className="w-3 h-3" />
                                    <span>{moment(opp.expected_close_date).format('DD MMM')}</span>
                                  </div>
                                )}
                              </div>

                              <div className="mt-2 pt-2 border-t border-slate-100">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-slate-500">{opp.probability || 0}% probability</span>
                                </div>
                                <Progress value={opp.probability || 0} className="h-1 mt-1" />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      <OpportunityFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingOpp(null); }}
        opportunity={editingOpp}
      />
    </div>
  );
}