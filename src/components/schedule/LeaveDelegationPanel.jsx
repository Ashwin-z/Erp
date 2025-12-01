import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Calendar, ArrowRight, Users, AlertTriangle, CheckCircle2,
  Brain, Mail, FileText, Clock, Sparkles
} from 'lucide-react';

export default function LeaveDelegationPanel({ 
  leaveRequest, 
  affectedTasks, 
  affectedTickets,
  teamMembers,
  aiSuggestion,
  onSubmit 
}) {
  const [delegation, setDelegation] = useState({
    delegate_email: aiSuggestion?.email || '',
    calendar_access_granted: true,
    email_forwarding: false,
    selected_tasks: affectedTasks?.map(t => t.id) || [],
    selected_tickets: affectedTickets?.map(t => t.id) || [],
    handover_notes: ''
  });

  const members = teamMembers || [
    { email: 'sarah@example.com', name: 'Sarah Chen', workload: 65 },
    { email: 'mike@example.com', name: 'Mike Johnson', workload: 45 },
    { email: 'anna@example.com', name: 'Anna Lee', workload: 80 }
  ];

  const tasks = affectedTasks || [
    { id: 't1', title: 'Complete API Documentation', priority: 'high', due_date: '2024-12-20' },
    { id: 't2', title: 'Review Pull Requests', priority: 'medium', due_date: '2024-12-18' },
    { id: 't3', title: 'Client Meeting Prep', priority: 'urgent', due_date: '2024-12-17' }
  ];

  const tickets = affectedTickets || [
    { id: 'tk1', title: 'Login Issue - Customer Portal', priority: 'high' },
    { id: 'tk2', title: 'Report Generation Bug', priority: 'medium' }
  ];

  const toggleTask = (taskId) => {
    setDelegation(prev => ({
      ...prev,
      selected_tasks: prev.selected_tasks.includes(taskId)
        ? prev.selected_tasks.filter(id => id !== taskId)
        : [...prev.selected_tasks, taskId]
    }));
  };

  const toggleTicket = (ticketId) => {
    setDelegation(prev => ({
      ...prev,
      selected_tickets: prev.selected_tickets.includes(ticketId)
        ? prev.selected_tickets.filter(id => id !== ticketId)
        : [...prev.selected_tickets, ticketId]
    }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-orange-50">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-600" />
          Leave Delegation Setup
        </CardTitle>
        <p className="text-sm text-slate-500">
          Configure delegation for your leave period
        </p>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* AI Suggestion */}
        {aiSuggestion && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-purple-900 flex items-center gap-2">
                  AI Recommendation
                  <Sparkles className="w-4 h-4" />
                </p>
                <p className="text-sm text-purple-700 mt-1">
                  {aiSuggestion.name} is the best candidate to cover your tasks. 
                  They have {aiSuggestion.workload}% workload and similar skill set.
                </p>
                <Button 
                  size="sm" 
                  className="mt-2 bg-purple-600 hover:bg-purple-700"
                  onClick={() => setDelegation({ ...delegation, delegate_email: aiSuggestion.email })}
                >
                  Accept Suggestion
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Select Covering Officer */}
        <div>
          <Label className="text-sm font-medium">Covering Officer</Label>
          <Select 
            value={delegation.delegate_email} 
            onValueChange={(v) => setDelegation({ ...delegation, delegate_email: v })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select team member" />
            </SelectTrigger>
            <SelectContent>
              {members.map(m => (
                <SelectItem key={m.email} value={m.email}>
                  <div className="flex items-center justify-between w-full">
                    <span>{m.name}</span>
                    <Badge variant="outline" className={m.workload > 70 ? 'text-red-600' : 'text-green-600'}>
                      {m.workload}% workload
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tasks to Delegate */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Tasks to Delegate</Label>
          <div className="space-y-2 border rounded-lg p-3">
            {tasks.map(task => (
              <div 
                key={task.id}
                className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded"
              >
                <Checkbox
                  checked={delegation.selected_tasks.includes(task.id)}
                  onCheckedChange={() => toggleTask(task.id)}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{task.title}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    Due: {task.due_date}
                    <Badge className={`text-[10px] ${
                      task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                      task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tickets to Delegate */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Tickets to Delegate</Label>
          <div className="space-y-2 border rounded-lg p-3">
            {tickets.map(ticket => (
              <div 
                key={ticket.id}
                className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded"
              >
                <Checkbox
                  checked={delegation.selected_tickets.includes(ticket.id)}
                  onCheckedChange={() => toggleTicket(ticket.id)}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{ticket.title}</p>
                  <Badge className={`text-[10px] ${
                    ticket.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {ticket.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Access Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <Label className="text-sm">Grant Calendar Access</Label>
            </div>
            <Switch
              checked={delegation.calendar_access_granted}
              onCheckedChange={(v) => setDelegation({ ...delegation, calendar_access_granted: v })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-500" />
              <Label className="text-sm">Enable Email Forwarding</Label>
            </div>
            <Switch
              checked={delegation.email_forwarding}
              onCheckedChange={(v) => setDelegation({ ...delegation, email_forwarding: v })}
            />
          </div>
        </div>

        {/* Handover Notes */}
        <div>
          <Label className="text-sm font-medium">Handover Notes</Label>
          <Textarea
            value={delegation.handover_notes}
            onChange={(e) => setDelegation({ ...delegation, handover_notes: e.target.value })}
            placeholder="Add any important notes for your covering officer..."
            rows={4}
            className="mt-1"
          />
        </div>

        {/* Summary */}
        <div className="bg-slate-50 rounded-lg p-4">
          <p className="font-medium text-sm mb-2">Delegation Summary</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Tasks:</span>
              <span className="ml-2 font-medium">{delegation.selected_tasks.length}</span>
            </div>
            <div>
              <span className="text-slate-500">Tickets:</span>
              <span className="ml-2 font-medium">{delegation.selected_tickets.length}</span>
            </div>
            <div>
              <span className="text-slate-500">Calendar Access:</span>
              <span className="ml-2">{delegation.calendar_access_granted ? '✓' : '✗'}</span>
            </div>
            <div>
              <span className="text-slate-500">Email Forward:</span>
              <span className="ml-2">{delegation.email_forwarding ? '✓' : '✗'}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">Cancel</Button>
          <Button 
            className="flex-1 bg-lime-500 hover:bg-lime-600"
            onClick={() => onSubmit && onSubmit(delegation)}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Confirm Delegation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}