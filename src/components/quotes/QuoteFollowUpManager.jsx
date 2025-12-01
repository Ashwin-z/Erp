import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  Mail, Clock, Calendar, Send, CheckCircle2, XCircle, 
  Plus, Trash2, Play, Pause, RefreshCw, Loader2, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

const defaultTemplates = [
  {
    id: 'gentle_reminder',
    name: 'Gentle Reminder',
    subject: 'Following up on Quote #{quote_number}',
    body: `Hi {customer_name},

I hope this email finds you well. I wanted to follow up on the quotation #{quote_number} that I sent on {sent_date}.

Please let me know if you have any questions or if there's anything I can help clarify.

Looking forward to hearing from you.

Best regards`
  },
  {
    id: 'value_add',
    name: 'Value Add',
    subject: 'Quick question about Quote #{quote_number}',
    body: `Hi {customer_name},

I wanted to check in regarding our quote #{quote_number} for {quote_total}.

Is there anything preventing you from moving forward? I'd be happy to:
- Answer any questions you might have
- Adjust the proposal if needed
- Schedule a quick call to discuss

Let me know what works best for you.

Best regards`
  },
  {
    id: 'last_chance',
    name: 'Last Chance',
    subject: 'Quote #{quote_number} expiring soon',
    body: `Hi {customer_name},

I noticed that our quote #{quote_number} will be expiring on {valid_until}.

If you're still interested, please let me know and I can extend the validity or prepare a new quote for you.

Thank you for your consideration.

Best regards`
  }
];

const intervalOptions = [
  { value: 3, label: '3 days' },
  { value: 5, label: '5 days' },
  { value: 7, label: '7 days' },
  { value: 14, label: '14 days' },
  { value: 30, label: '30 days' }
];

export default function QuoteFollowUpManager({ quote, onClose }) {
  const [setupOpen, setSetupOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('gentle_reminder');
  const [intervals, setIntervals] = useState([3, 7, 14]);
  const [customSubject, setCustomSubject] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [saving, setSaving] = useState(false);
  
  const queryClient = useQueryClient();

  const { data: followUps = [], isLoading } = useQuery({
    queryKey: ['quote-followups', quote?.id],
    queryFn: () => base44.entities.QuoteFollowUp.filter({ quote_id: quote.id }, '-scheduled_date'),
    enabled: !!quote?.id
  });

  const createFollowUpsMutation = useMutation({
    mutationFn: (data) => base44.entities.QuoteFollowUp.bulkCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quote-followups', quote?.id] });
      toast.success('Follow-up sequence created');
      setSetupOpen(false);
    }
  });

  const updateFollowUpMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.QuoteFollowUp.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quote-followups', quote?.id] });
    }
  });

  const deleteFollowUpMutation = useMutation({
    mutationFn: (id) => base44.entities.QuoteFollowUp.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quote-followups', quote?.id] });
      toast.success('Follow-up cancelled');
    }
  });

  const sendFollowUpMutation = useMutation({
    mutationFn: async (followUp) => {
      await base44.integrations.Core.SendEmail({
        to: followUp.customer_email,
        subject: followUp.email_subject,
        body: followUp.email_body
      });
      return base44.entities.QuoteFollowUp.update(followUp.id, {
        status: 'sent',
        sent_date: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quote-followups', quote?.id] });
      toast.success('Follow-up email sent');
    }
  });

  const handleCreateSequence = async () => {
    if (intervals.length === 0) {
      toast.error('Please select at least one interval');
      return;
    }

    setSaving(true);
    const template = defaultTemplates.find(t => t.id === selectedTemplate);
    const baseDate = quote.sent_at ? new Date(quote.sent_at) : new Date();

    const followUpsData = intervals.map((days, index) => {
      const scheduledDate = moment(baseDate).add(days, 'days').toISOString();
      const subject = (customSubject || template.subject)
        .replace('{quote_number}', quote.quote_number || quote.id.slice(0, 8));
      const body = (customBody || template.body)
        .replace('{customer_name}', quote.customer_name)
        .replace('{quote_number}', quote.quote_number || quote.id.slice(0, 8))
        .replace('{quote_total}', `$${(quote.total || 0).toLocaleString()}`)
        .replace('{sent_date}', moment(quote.sent_at).format('DD MMM YYYY'))
        .replace('{valid_until}', moment(quote.valid_until).format('DD MMM YYYY'));

      return {
        quote_id: quote.id,
        quote_number: quote.quote_number || quote.id.slice(0, 8),
        customer_email: quote.customer_email,
        customer_name: quote.customer_name,
        sequence_name: template.name,
        follow_up_number: index + 1,
        scheduled_date: scheduledDate,
        status: 'scheduled',
        email_template: template.id,
        email_subject: subject,
        email_body: body,
        interval_days: days
      };
    });

    await createFollowUpsMutation.mutateAsync(followUpsData);
    setSaving(false);
  };

  const addInterval = () => {
    const lastInterval = intervals[intervals.length - 1] || 0;
    setIntervals([...intervals, lastInterval + 7]);
  };

  const removeInterval = (index) => {
    setIntervals(intervals.filter((_, i) => i !== index));
  };

  const updateInterval = (index, value) => {
    const newIntervals = [...intervals];
    newIntervals[index] = parseInt(value);
    setIntervals(newIntervals.sort((a, b) => a - b));
  };

  const scheduledFollowUps = followUps.filter(f => f.status === 'scheduled');
  const sentFollowUps = followUps.filter(f => f.status === 'sent');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Follow-up Sequence</h3>
          <p className="text-sm text-slate-500">
            Quote #{quote?.quote_number || quote?.id?.slice(0, 8)} - {quote?.customer_name}
          </p>
        </div>
        {scheduledFollowUps.length === 0 && (
          <Button onClick={() => setSetupOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />Setup Follow-ups
          </Button>
        )}
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-amber-700">{scheduledFollowUps.length}</p>
            <p className="text-sm text-amber-600">Scheduled</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-emerald-700">{sentFollowUps.length}</p>
            <p className="text-sm text-emerald-600">Sent</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <Mail className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-700">{followUps.length}</p>
            <p className="text-sm text-blue-600">Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Follow-up Timeline */}
      {followUps.length > 0 ? (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Follow-up History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {followUps.map((followUp, index) => (
                <div key={followUp.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      followUp.status === 'sent' ? 'bg-emerald-100' :
                      followUp.status === 'cancelled' ? 'bg-red-100' :
                      'bg-amber-100'
                    }`}>
                      {followUp.status === 'sent' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : followUp.status === 'cancelled' ? (
                        <XCircle className="w-5 h-5 text-red-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-amber-600" />
                      )}
                    </div>
                    {index < followUps.length - 1 && (
                      <div className="w-0.5 h-12 bg-slate-200 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">
                          Follow-up #{followUp.follow_up_number}
                        </p>
                        <p className="text-sm text-slate-500">{followUp.email_subject}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {followUp.status === 'sent' 
                            ? `Sent on ${moment(followUp.sent_date).format('DD MMM YYYY, HH:mm')}`
                            : `Scheduled for ${moment(followUp.scheduled_date).format('DD MMM YYYY')}`
                          }
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          followUp.status === 'sent' ? 'bg-emerald-100 text-emerald-700' :
                          followUp.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }>
                          {followUp.status}
                        </Badge>
                        {followUp.status === 'scheduled' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => sendFollowUpMutation.mutate(followUp)}
                              disabled={sendFollowUpMutation.isPending}
                            >
                              <Send className="w-3 h-3 mr-1" />Send Now
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="text-red-600"
                              onClick={() => deleteFollowUpMutation.mutate(followUp.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-200 border-dashed">
          <CardContent className="py-12 text-center">
            <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No follow-ups scheduled</h3>
            <p className="text-slate-500 mb-4">Set up automated follow-up emails for this quote</p>
            <Button onClick={() => setSetupOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />Setup Follow-up Sequence
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Setup Dialog */}
      <Dialog open={setupOpen} onOpenChange={setSetupOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Setup Follow-up Sequence</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Template Selection */}
            <div className="space-y-2">
              <Label>Email Template</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {defaultTemplates.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Intervals */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Follow-up Intervals (days after quote sent)</Label>
                <Button size="sm" variant="outline" onClick={addInterval}>
                  <Plus className="w-3 h-3 mr-1" />Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {intervals.map((days, index) => (
                  <div key={index} className="flex items-center gap-1 bg-slate-100 rounded-lg px-3 py-2">
                    <Select 
                      value={days.toString()} 
                      onValueChange={(v) => updateInterval(index, v)}
                    >
                      <SelectTrigger className="w-24 h-8 border-0 bg-transparent">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,5,7,10,14,21,30,45,60].map(d => (
                          <SelectItem key={d} value={d.toString()}>{d} days</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="w-6 h-6"
                      onClick={() => removeInterval(index)}
                    >
                      <XCircle className="w-4 h-4 text-slate-400" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label>Email Preview</Label>
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium">
                  Subject: {defaultTemplates.find(t => t.id === selectedTemplate)?.subject
                    .replace('{quote_number}', quote?.quote_number || quote?.id?.slice(0, 8))}
                </p>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">
                  {defaultTemplates.find(t => t.id === selectedTemplate)?.body
                    .replace('{customer_name}', quote?.customer_name)
                    .replace('{quote_number}', quote?.quote_number || quote?.id?.slice(0, 8))
                    .replace('{quote_total}', `$${(quote?.total || 0).toLocaleString()}`)
                    .replace('{sent_date}', moment(quote?.sent_at).format('DD MMM YYYY'))
                    .replace('{valid_until}', moment(quote?.valid_until).format('DD MMM YYYY'))}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSetupOpen(false)}>Cancel</Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleCreateSequence}
              disabled={saving || intervals.length === 0}
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
              Create {intervals.length} Follow-ups
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}