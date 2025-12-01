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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { 
  Loader2, Save, User, Building2, Phone, Smartphone, Mail, MapPin, 
  Calendar, Bell, Heart, Briefcase, Upload, X, Check, CreditCard, Image
} from 'lucide-react';

const initialFormData = {
  name: '',
  email: '',
  office_phone: '',
  mobile_phone: '',
  address: '',
  city: '',
  postal_code: '',
  country: 'Singapore',
  contact_person: '',
  job_title: '',
  birthday: '',
  birthday_reminder: false,
  family_notes: '',
  office_notes: '',
  name_card_url: '',
  profile_photo_url: '',
  status: 'active',
  company_name: '',
  industry: '',
  website: '',
  tags: []
};

export default function CustomerFormModal({ open, onClose, customer }) {
  const [formData, setFormData] = useState(initialFormData);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [uploadingCard, setUploadingCard] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (customer) {
      setFormData({
        ...initialFormData,
        ...customer,
      });
    } else {
      setFormData(initialFormData);
    }
    setHasChanges(false);
  }, [customer, open]);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Customer.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer created successfully');
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Customer.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer updated successfully');
      onClose();
    },
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      toast.error('Please fill in required fields (Name and Email)');
      return;
    }
    
    setSaving(true);
    try {
      if (customer) {
        await updateMutation.mutateAsync({ id: customer.id, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      setHasChanges(false);
    } catch (error) {
      toast.error('Failed to save customer');
    }
    setSaving(false);
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;
    
    const setUploading = type === 'card' ? setUploadingCard : setUploadingPhoto;
    setUploading(true);
    
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      if (type === 'card') {
        updateField('name_card_url', file_url);
      } else {
        updateField('profile_photo_url', file_url);
      }
      toast.success(`${type === 'card' ? 'Name card' : 'Photo'} uploaded`);
    } catch (error) {
      toast.error('Upload failed');
    }
    setUploading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{customer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
            <div className="flex items-center gap-2">
              {hasChanges && (
                <Badge className="bg-amber-100 text-amber-700">
                  Unsaved changes
                </Badge>
              )}
              {!hasChanges && customer && (
                <Badge className="bg-emerald-100 text-emerald-700">
                  <Check className="w-3 h-3 mr-1" />Saved
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="contact" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <User className="w-4 h-4" />Contact
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />Company
            </TabsTrigger>
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />Personal
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />Name Card
            </TabsTrigger>
          </TabsList>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label>Customer Name *</Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="John Doe or Company Name"
                />
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
                <Label>Job Title</Label>
                <Input 
                  value={formData.job_title} 
                  onChange={(e) => updateField('job_title', e.target.value)}
                  placeholder="e.g., Director, Manager"
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    type="email"
                    value={formData.email} 
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="email@example.com"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => updateField('status', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-500" />
                  Office Phone
                </Label>
                <Input 
                  value={formData.office_phone} 
                  onChange={(e) => updateField('office_phone', e.target.value)}
                  placeholder="+65 6123 4567"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-slate-500" />
                  Mobile Phone
                </Label>
                <Input 
                  value={formData.mobile_phone} 
                  onChange={(e) => updateField('mobile_phone', e.target.value)}
                  placeholder="+65 9123 4567"
                />
              </div>
            </div>
          </TabsContent>

          {/* Company Tab */}
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
              <div className="col-span-2 space-y-2">
                <Label>Website</Label>
                <Input 
                  value={formData.website} 
                  onChange={(e) => updateField('website', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500" />Address
                </Label>
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
              <div className="col-span-2 space-y-2">
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

              {/* Office Notes */}
              <div className="col-span-2 space-y-2">
                <Label className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-slate-500" />
                  Office Concerns / Notes
                </Label>
                <Textarea 
                  value={formData.office_notes} 
                  onChange={(e) => updateField('office_notes', e.target.value)}
                  placeholder="Business related notes, concerns, requirements..."
                  rows={4}
                  className="bg-slate-50"
                />
              </div>
            </div>
          </TabsContent>

          {/* Personal Tab */}
          <TabsContent value="personal" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  Birthday
                </Label>
                <Input 
                  type="date"
                  value={formData.birthday} 
                  onChange={(e) => updateField('birthday', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Birthday Reminder</Label>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border">
                  <Bell className={`w-5 h-5 ${formData.birthday_reminder ? 'text-amber-500' : 'text-slate-400'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Birthday Greeting Reminder</p>
                    <p className="text-xs text-slate-500">Get notified on their birthday</p>
                  </div>
                  <Switch 
                    checked={formData.birthday_reminder}
                    onCheckedChange={(c) => updateField('birthday_reminder', c)}
                  />
                </div>
              </div>

              {/* Family Notes */}
              <div className="col-span-2 space-y-2">
                <Label className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-500" />
                  Family Notes
                </Label>
                <Textarea 
                  value={formData.family_notes} 
                  onChange={(e) => updateField('family_notes', e.target.value)}
                  placeholder="Family information, spouse name, children, interests, hobbies..."
                  rows={4}
                  className="bg-pink-50/50 border-pink-100"
                />
                <p className="text-xs text-slate-500">Personal notes help build stronger relationships</p>
              </div>
            </div>
          </TabsContent>

          {/* Name Card Tab */}
          <TabsContent value="media" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-6">
              {/* Profile Photo */}
              <div className="space-y-3">
                <Label>Profile Photo</Label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-blue-400 transition-colors">
                  {formData.profile_photo_url ? (
                    <div className="relative inline-block">
                      <img 
                        src={formData.profile_photo_url} 
                        alt="Profile" 
                        className="w-32 h-32 rounded-full object-cover mx-auto"
                      />
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 w-6 h-6"
                        onClick={() => updateField('profile_photo_url', '')}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                        {uploadingPhoto ? (
                          <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                        ) : (
                          <Image className="w-8 h-8 text-slate-400" />
                        )}
                      </div>
                      <p className="text-sm text-slate-500">Click to upload photo</p>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files[0], 'photo')}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Name Card */}
              <div className="space-y-3">
                <Label>Name Card / Business Card</Label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-blue-400 transition-colors">
                  {formData.name_card_url ? (
                    <div className="relative">
                      <img 
                        src={formData.name_card_url} 
                        alt="Name Card" 
                        className="w-full h-40 object-contain rounded-lg bg-slate-50"
                      />
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        className="absolute top-2 right-2 w-6 h-6"
                        onClick={() => updateField('name_card_url', '')}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block py-8">
                      {uploadingCard ? (
                        <Loader2 className="w-12 h-12 text-slate-400 mx-auto animate-spin" />
                      ) : (
                        <>
                          <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                          <p className="text-sm font-medium text-slate-600">Upload Name Card</p>
                          <p className="text-xs text-slate-400 mt-1">Take a photo or upload image</p>
                        </>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files[0], 'card')}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6 gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 min-w-[120px]" 
            onClick={handleSubmit}
            disabled={saving || !hasChanges}
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
            ) : (
              <><Save className="w-4 h-4 mr-2" />Save Customer</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}