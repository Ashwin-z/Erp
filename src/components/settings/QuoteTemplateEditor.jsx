import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Plus, Pencil, Trash2, Copy, Save, X, FileText, Upload, Image,
  Move, Eye, Star, Building2, Mail, Phone, Globe, MapPin, CheckCircle2,
  AlertTriangle, GripVertical
} from 'lucide-react';
import { toast } from 'sonner';

export default function QuoteTemplateEditor({ 
  templates, 
  setTemplates, 
  open, 
  onClose, 
  editingTemplate 
}) {
  const [activeTab, setActiveTab] = useState('company');
  const [previewMode, setPreviewMode] = useState(false);
  
  const [formData, setFormData] = useState({
    id: editingTemplate?.id || null,
    name: editingTemplate?.name || '',
    description: editingTemplate?.description || '',
    isDefault: editingTemplate?.isDefault || false,
    logo: editingTemplate?.logo || {
      url: '',
      width: 150,
      height: 60,
      position: 'left' // left, center, right
    },
    companyDetails: editingTemplate?.companyDetails || {
      name: 'TechStart Pte Ltd',
      address: '1 Raffles Place, #20-01, Tower One',
      city: 'Singapore 048616',
      country: 'Singapore',
      phone: '+65 6123 4567',
      email: 'info@techstart.com',
      website: 'www.techstart.com',
      uen: '202012345A',
      gst: 'M12345678A',
      showUEN: true,
      showGST: true,
      showPhone: true,
      showEmail: true,
      showWebsite: true
    },
    headerLayout: editingTemplate?.headerLayout || 'logo-left', // logo-left, logo-center, logo-right
    colorScheme: editingTemplate?.colorScheme || {
      primary: '#84cc16',
      secondary: '#1e293b',
      accent: '#06b6d4',
      text: '#334155'
    },
    fonts: editingTemplate?.fonts || {
      heading: 'Inter',
      body: 'Inter'
    },
    sections: editingTemplate?.sections || {
      showQuoteNumber: true,
      showDate: true,
      showValidUntil: true,
      showClientDetails: true,
      showItemTable: true,
      showSubtotal: true,
      showTax: true,
      showTotal: true,
      showPaymentTerms: true,
      showBankDetails: true,
      showSignature: true,
      showFooter: true,
      showTerms: true
    },
    bankDetails: editingTemplate?.bankDetails || {
      bankName: 'DBS Bank',
      accountName: 'TechStart Pte Ltd',
      accountNumber: '123-456789-0',
      swiftCode: 'DBSSSGSG',
      branchCode: '123'
    },
    margins: editingTemplate?.margins || {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20
    }
  });

  const handleSave = () => {
    if (!formData.name) {
      toast.error('Template name is required');
      return;
    }

    if (formData.id) {
      // Update existing
      setTemplates(prev => prev.map(t => t.id === formData.id ? { ...formData } : t));
      toast.success('Template updated successfully');
    } else {
      // Create new
      const newTemplate = {
        ...formData,
        id: Date.now()
      };
      setTemplates(prev => [...prev, newTemplate]);
      toast.success('Template created successfully');
    }
    onClose();
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          logo: { ...prev.logo, url: reader.result }
        }));
      };
      reader.readAsDataURL(file);
      toast.success('Logo uploaded');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-lime-600" />
            {editingTemplate ? 'Edit Template' : 'Create New Template'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Template Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Standard Quotation"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this template"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <p className="font-medium">Set as Default Template</p>
              <p className="text-sm text-slate-500">Use this template for new quotations</p>
            </div>
            <Switch
              checked={formData.isDefault}
              onCheckedChange={(c) => setFormData(prev => ({ ...prev, isDefault: c }))}
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="company">Company</TabsTrigger>
              <TabsTrigger value="logo">Logo</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="sections">Sections</TabsTrigger>
              <TabsTrigger value="bank">Bank Details</TabsTrigger>
            </TabsList>

            {/* Company Details Tab */}
            <TabsContent value="company" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
                    value={formData.companyDetails.name}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      companyDetails: { ...prev.companyDetails, name: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>UEN / Registration No.</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.companyDetails.uen}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        companyDetails: { ...prev.companyDetails, uen: e.target.value }
                      }))}
                    />
                    <Switch
                      checked={formData.companyDetails.showUEN}
                      onCheckedChange={(c) => setFormData(prev => ({
                        ...prev,
                        companyDetails: { ...prev.companyDetails, showUEN: c }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>GST Registration No.</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.companyDetails.gst}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        companyDetails: { ...prev.companyDetails, gst: e.target.value }
                      }))}
                    />
                    <Switch
                      checked={formData.companyDetails.showGST}
                      onCheckedChange={(c) => setFormData(prev => ({
                        ...prev,
                        companyDetails: { ...prev.companyDetails, showGST: c }
                      }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.companyDetails.phone}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        companyDetails: { ...prev.companyDetails, phone: e.target.value }
                      }))}
                    />
                    <Switch
                      checked={formData.companyDetails.showPhone}
                      onCheckedChange={(c) => setFormData(prev => ({
                        ...prev,
                        companyDetails: { ...prev.companyDetails, showPhone: c }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Address Line 1</Label>
                <Input
                  value={formData.companyDetails.address}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    companyDetails: { ...prev.companyDetails, address: e.target.value }
                  }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City / Postal Code</Label>
                  <Input
                    value={formData.companyDetails.city}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      companyDetails: { ...prev.companyDetails, city: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input
                    value={formData.companyDetails.country}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      companyDetails: { ...prev.companyDetails, country: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.companyDetails.email}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        companyDetails: { ...prev.companyDetails, email: e.target.value }
                      }))}
                    />
                    <Switch
                      checked={formData.companyDetails.showEmail}
                      onCheckedChange={(c) => setFormData(prev => ({
                        ...prev,
                        companyDetails: { ...prev.companyDetails, showEmail: c }
                      }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.companyDetails.website}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        companyDetails: { ...prev.companyDetails, website: e.target.value }
                      }))}
                    />
                    <Switch
                      checked={formData.companyDetails.showWebsite}
                      onCheckedChange={(c) => setFormData(prev => ({
                        ...prev,
                        companyDetails: { ...prev.companyDetails, showWebsite: c }
                      }))}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Logo Tab */}
            <TabsContent value="logo" className="space-y-4 mt-4">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
                {formData.logo.url ? (
                  <div className="space-y-4">
                    <img 
                      src={formData.logo.url} 
                      alt="Logo preview" 
                      className="max-h-24 mx-auto object-contain"
                      style={{ width: formData.logo.width }}
                    />
                    <div className="flex justify-center gap-2">
                      <label>
                        <Button variant="outline" size="sm" asChild>
                          <span><Upload className="w-4 h-4 mr-1" />Change Logo</span>
                        </Button>
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                      </label>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-500"
                        onClick={() => setFormData(prev => ({ ...prev, logo: { ...prev.logo, url: '' } }))}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <Image className="w-12 h-12 text-slate-400" />
                      <p className="text-slate-600 font-medium">Upload Company Logo</p>
                      <p className="text-slate-400 text-sm">PNG, JPG up to 2MB</p>
                      <Button variant="outline" size="sm" asChild>
                        <span><Upload className="w-4 h-4 mr-1" />Choose File</span>
                      </Button>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Logo Width (px)</Label>
                  <Input
                    type="number"
                    value={formData.logo.width}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      logo: { ...prev.logo, width: parseInt(e.target.value) || 150 }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Logo Height (px)</Label>
                  <Input
                    type="number"
                    value={formData.logo.height}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      logo: { ...prev.logo, height: parseInt(e.target.value) || 60 }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Logo Position</Label>
                  <Select 
                    value={formData.logo.position} 
                    onValueChange={(v) => setFormData(prev => ({
                      ...prev,
                      logo: { ...prev.logo, position: v }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Layout Tab */}
            <TabsContent value="layout" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Header Layout</Label>
                <div className="grid grid-cols-3 gap-3">
                  {['logo-left', 'logo-center', 'logo-right'].map((layout) => (
                    <div
                      key={layout}
                      className={`p-4 border-2 rounded-lg cursor-pointer text-center ${
                        formData.headerLayout === layout ? 'border-lime-500 bg-lime-50' : 'border-slate-200'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, headerLayout: layout }))}
                    >
                      <div className="h-12 flex items-center justify-center mb-2">
                        <div className={`flex items-center gap-2 w-full ${
                          layout === 'logo-left' ? 'justify-start' :
                          layout === 'logo-center' ? 'justify-center' : 'justify-end'
                        }`}>
                          <div className="w-8 h-6 bg-slate-300 rounded" />
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 capitalize">{layout.replace('-', ' ')}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Color Scheme</Label>
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Primary</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.colorScheme.primary}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          colorScheme: { ...prev.colorScheme, primary: e.target.value }
                        }))}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <Input
                        value={formData.colorScheme.primary}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          colorScheme: { ...prev.colorScheme, primary: e.target.value }
                        }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Secondary</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.colorScheme.secondary}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          colorScheme: { ...prev.colorScheme, secondary: e.target.value }
                        }))}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <Input
                        value={formData.colorScheme.secondary}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          colorScheme: { ...prev.colorScheme, secondary: e.target.value }
                        }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Accent</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.colorScheme.accent}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          colorScheme: { ...prev.colorScheme, accent: e.target.value }
                        }))}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <Input
                        value={formData.colorScheme.accent}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          colorScheme: { ...prev.colorScheme, accent: e.target.value }
                        }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Text</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.colorScheme.text}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          colorScheme: { ...prev.colorScheme, text: e.target.value }
                        }))}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <Input
                        value={formData.colorScheme.text}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          colorScheme: { ...prev.colorScheme, text: e.target.value }
                        }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Page Margins (mm)</Label>
                <div className="grid grid-cols-4 gap-4">
                  {['top', 'bottom', 'left', 'right'].map((margin) => (
                    <div key={margin} className="space-y-1">
                      <Label className="text-xs capitalize">{margin}</Label>
                      <Input
                        type="number"
                        value={formData.margins[margin]}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          margins: { ...prev.margins, [margin]: parseInt(e.target.value) || 20 }
                        }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Sections Tab */}
            <TabsContent value="sections" className="space-y-4 mt-4">
              <p className="text-sm text-slate-500">Toggle sections to show or hide on the quotation</p>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(formData.sections).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').replace('show ', '')}</span>
                    <Switch
                      checked={value}
                      onCheckedChange={(c) => setFormData(prev => ({
                        ...prev,
                        sections: { ...prev.sections, [key]: c }
                      }))}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Bank Details Tab */}
            <TabsContent value="bank" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bank Name</Label>
                  <Input
                    value={formData.bankDetails.bankName}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      bankDetails: { ...prev.bankDetails, bankName: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bank Account Name</Label>
                  <Input
                    value={formData.bankDetails.accountName}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      bankDetails: { ...prev.bankDetails, accountName: e.target.value }
                    }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Bank Account Number</Label>
                  <Input
                    value={formData.bankDetails.accountNumber}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      bankDetails: { ...prev.bankDetails, accountNumber: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bank Swift Code</Label>
                  <Input
                    value={formData.bankDetails.swiftCode}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      bankDetails: { ...prev.bankDetails, swiftCode: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Branch Code</Label>
                  <Input
                    value={formData.bankDetails.branchCode}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      bankDetails: { ...prev.bankDetails, branchCode: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-lime-600 hover:bg-lime-700" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            {editingTemplate ? 'Update Template' : 'Create Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}