import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, Save, Sparkles, MessageSquare } from 'lucide-react';
import OpportunityAIAssistant from './OpportunityAIAssistant';
import CommunicationAIAnalysis from '@/components/crm/CommunicationAIAnalysis';
import { toast } from 'sonner';

const stages = [
  { id: 'prospecting', name: 'Prospecting', probability: 10 },
  { id: 'qualification', name: 'Qualification', probability: 25 },
  { id: 'proposal', name: 'Proposal', probability: 50 },
  { id: 'negotiation', name: 'Negotiation', probability: 75 },
  { id: 'closed_won', name: 'Closed Won', probability: 100 },
  { id: 'closed_lost', name: 'Closed Lost', probability: 0 }
];

const initialFormData = {
  name: '',
  customer_id: '',
  customer_name: '',
  stage: 'prospecting',
  value: '',
  currency: 'SGD',
  probability: 10,
  expected_close_date: '',
  source: '',
  description: '',
  next_action: '',
  next_action_date: '',
  notes: ''
};

export default function OpportunityFormModal({ open, onClose, opportunity }) {
  const [formData, setFormData] = useState(initialFormData);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => base44.entities.Customer.list(),
    enabled: open
  });

  useEffect(() => {
    if (opportunity) {
      setFormData({
        ...initialFormData,
        ...opportunity,
        value: opportunity.value || ''
      });
    } else {
      setFormData(initialFormData);
    }
  }, [opportunity, open]);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Opportunity.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast.success('Opportunity created');
      onClose();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Opportunity.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast.success('Opportunity updated');
      onClose();
    }
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.customer_name || !formData.value) {
      toast.error('Please fill in required fields');
      return;
    }

    setSaving(true);
    const data = {
      ...formData,
      value: parseFloat(formData.value) || 0
    };

    try {
      if (opportunity) {
        await updateMutation.mutateAsync({ id: opportunity.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      toast.error('Failed to save opportunity');
    }
    setSaving(false);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-update probability when stage changes
    if (field === 'stage') {
      const stage = stages.find(s => s.id === value);
      if (stage) {
        setFormData(prev => ({ ...prev, [field]: value, probability: stage.probability }));
      }
    }
  };

  const handleCustomerChange = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setFormData(prev => ({
        ...prev,
        customer_id: customer.id,
        customer_name: customer.name
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{opportunity ? 'Edit Opportunity' : 'New Opportunity'}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-2">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="communication" disabled={!opportunity} className="flex gap-2 items-center">
              <MessageSquare className="w-3 h-3" /> Communication & AI
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Opportunity Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="e.g., Website Redesign Project"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Customer *</Label>
                  <Select value={formData.customer_id} onValueChange={handleCustomerChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Stage</Label>
                  <Select value={formData.stage} onValueChange={(v) => updateField('stage', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Deal Value *</Label>
                  <Input
                    type="number"
                    value={formData.value}
                    onChange={(e) => updateField('value', e.target.value)}
                    placeholder="50000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Probability (%)</Label>
                  <Input
                    type="number"
                    value={formData.probability}
                    onChange={(e) => updateField('probability', parseInt(e.target.value) || 0)}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Expected Close Date</Label>
                  <Input
                    type="date"
                    value={formData.expected_close_date}
                    onChange={(e) => updateField('expected_close_date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Source</Label>
                  <Select value={formData.source} onValueChange={(v) => updateField('source', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="cold_call">Cold Call</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="partner">Partner</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Next Action</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    value={formData.next_action}
                    onChange={(e) => updateField('next_action', e.target.value)}
                    placeholder="Follow up call"
                  />
                  <Input
                    type="date"
                    value={formData.next_action_date}
                    onChange={(e) => updateField('next_action_date', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Additional notes..."
                  rows={3}
                />
              </div>

              {opportunity && (
                <div className="border-t pt-4 mt-4">
                  <OpportunityAIAssistant opportunity={opportunity} />
                </div>
              )}

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleSubmit}
                  disabled={saving}
                >
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  {opportunity ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </div>
          </TabsContent>

          {opportunity && (
            <TabsContent value="communication">
              <div className="py-4">
                <CommunicationAIAnalysis 
                  customerId={opportunity.customer_id} 
                  opportunityId={opportunity.id} 
                />
              </div>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}