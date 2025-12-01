import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { Loader2, Save, User, Building2, CreditCard, FileText } from 'lucide-react';

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  company_name: '',
  company_uen: '',
  industry: '',
  website: '',
  address: '',
  city: '',
  postal_code: '',
  country: 'Singapore',
  contact_person: '',
  contact_role: '',
  billing_email: '',
  payment_terms: 'Net 30',
  credit_limit: '',
  currency: 'SGD',
  tax_id: '',
  status: 'active',
  notes: '',
  tags: []
};

export default function ClientFormModal({ open, onClose, client }) {
  const [formData, setFormData] = useState(initialFormData);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (client) {
      setFormData({
        ...initialFormData,
        ...client,
        credit_limit: client.credit_limit || ''
      });
    } else {
      setFormData(initialFormData);
    }
  }, [client, open]);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Client.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client created successfully');
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Client.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client updated successfully');
      onClose();
    },
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      toast.error('Please fill in required fields');
      return;
    }
    
    setSaving(true);
    const data = {
      ...formData,
      credit_limit: formData.credit_limit ? parseFloat(formData.credit_limit) : null
    };
    
    try {
      if (client) {
        await updateMutation.mutateAsync({ id: client.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      toast.error('Failed to save client');
    }
    setSaving(false);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{client ? 'Edit Client' : 'Add New Client'}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <User className="w-4 h-4" />Basic
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />Company
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />Billing
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client Name *</Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="John Doe or Company Name"
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input 
                  type="email"
                  value={formData.email} 
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input 
                  value={formData.phone} 
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+65 1234 5678"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => updateField('status', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Contact Person</Label>
                <Input 
                  value={formData.contact_person} 
                  onChange={(e) => updateField('contact_person', e.target.value)}
                  placeholder="Primary contact name"
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Role</Label>
                <Input 
                  value={formData.contact_role} 
                  onChange={(e) => updateField('contact_role', e.target.value)}
                  placeholder="e.g., Manager, Director"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="company" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input 
                  value={formData.company_name} 
                  onChange={(e) => updateField('company_name', e.target.value)}
                  placeholder="Company Pte Ltd"
                />
              </div>
              <div className="space-y-2">
                <Label>UEN / Registration No.</Label>
                <Input 
                  value={formData.company_uen} 
                  onChange={(e) => updateField('company_uen', e.target.value)}
                  placeholder="123456789A"
                />
              </div>
              <div className="space-y-2">
                <Label>Industry</Label>
                <Select value={formData.industry} onValueChange={(v) => updateField('industry', v)}>
                  <SelectTrigger><SelectValue placeholder="Select industry" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="F&B">Food & Beverage</SelectItem>
                    <SelectItem value="Logistics">Logistics</SelectItem>
                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input 
                  value={formData.website} 
                  onChange={(e) => updateField('website', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Address</Label>
                <Input 
                  value={formData.address} 
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="Street address"
                />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input 
                  value={formData.city} 
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label>Postal Code</Label>
                <Input 
                  value={formData.postal_code} 
                  onChange={(e) => updateField('postal_code', e.target.value)}
                  placeholder="123456"
                />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Select value={formData.country} onValueChange={(v) => updateField('country', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Singapore">Singapore</SelectItem>
                    <SelectItem value="Malaysia">Malaysia</SelectItem>
                    <SelectItem value="Indonesia">Indonesia</SelectItem>
                    <SelectItem value="Thailand">Thailand</SelectItem>
                    <SelectItem value="Vietnam">Vietnam</SelectItem>
                    <SelectItem value="Philippines">Philippines</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Billing Email</Label>
                <Input 
                  type="email"
                  value={formData.billing_email} 
                  onChange={(e) => updateField('billing_email', e.target.value)}
                  placeholder="billing@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Tax ID / GST No.</Label>
                <Input 
                  value={formData.tax_id} 
                  onChange={(e) => updateField('tax_id', e.target.value)}
                  placeholder="GST registration number"
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Terms</Label>
                <Select value={formData.payment_terms} onValueChange={(v) => updateField('payment_terms', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                    <SelectItem value="Net 7">Net 7</SelectItem>
                    <SelectItem value="Net 14">Net 14</SelectItem>
                    <SelectItem value="Net 30">Net 30</SelectItem>
                    <SelectItem value="Net 45">Net 45</SelectItem>
                    <SelectItem value="Net 60">Net 60</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Credit Limit</Label>
                <Input 
                  type="number"
                  value={formData.credit_limit} 
                  onChange={(e) => updateField('credit_limit', e.target.value)}
                  placeholder="10000"
                />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={formData.currency} onValueChange={(v) => updateField('currency', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SGD">SGD - Singapore Dollar</SelectItem>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="MYR">MYR - Malaysian Ringgit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea 
                value={formData.notes} 
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Additional notes about this client..."
                rows={6}
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            className="bg-lime-600 hover:bg-lime-700" 
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><Save className="w-4 h-4 mr-2" />{client ? 'Update' : 'Create'} Client</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}