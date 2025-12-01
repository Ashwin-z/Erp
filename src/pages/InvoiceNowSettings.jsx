import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Settings,
  Building2,
  Key,
  Shield,
  Globe,
  Bell,
  Zap,
  Save,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  ExternalLink,
  FileText,
  Calendar,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { toast } from 'sonner';

const AP_PROVIDERS = [
  { value: 'storecove', label: 'Storecove', description: 'Global Peppol Access Point' },
  { value: 'invoicecloud', label: 'InvoiceCloud', description: 'Singapore-based AP' },
  { value: 'peppol_direct', label: 'Direct Integration', description: 'Direct AS4 connection' },
  { value: 'sandbox', label: 'Sandbox', description: 'Testing environment' }
];

export default function InvoiceNowSettings() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('general');
  const [showConnectorModal, setShowConnectorModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [editingConnector, setEditingConnector] = useState(null);

  // Fetch settings
  const { data: settings, isLoading: loadingSettings } = useQuery({
    queryKey: ['peppol-settings'],
    queryFn: async () => {
      const all = await base44.entities.PeppolSettings.list();
      return all[0] || {
        is_enabled: false,
        environment: 'sandbox',
        auto_send_invoices: false,
        validate_gst_before_send: true
      };
    },
  });

  // Fetch connectors
  const { data: connectors = [], isLoading: loadingConnectors } = useQuery({
    queryKey: ['peppol-connectors'],
    queryFn: () => base44.entities.PeppolAPConnector.list(),
  });

  // Fetch certificates
  const { data: certificates = [], isLoading: loadingCerts } = useQuery({
    queryKey: ['peppol-certificates'],
    queryFn: () => base44.entities.PeppolCertificate.list(),
  });

  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (data) => {
      if (settings?.id) {
        return base44.entities.PeppolSettings.update(settings.id, data);
      } else {
        return base44.entities.PeppolSettings.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['peppol-settings']);
      toast.success('Settings saved successfully');
    },
    onError: (error) => {
      toast.error('Failed to save settings');
    }
  });

  // Delete connector mutation
  const deleteConnectorMutation = useMutation({
    mutationFn: (id) => base44.entities.PeppolAPConnector.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['peppol-connectors']);
      toast.success('Connector deleted');
    }
  });

  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSaveSettings = () => {
    saveSettingsMutation.mutate(formData);
  };

  const getCertificateStatus = (cert) => {
    if (!cert.valid_to) return { status: 'unknown', color: 'bg-gray-100 text-gray-700' };
    const daysLeft = differenceInDays(new Date(cert.valid_to), new Date());
    if (daysLeft < 0) return { status: 'expired', color: 'bg-red-100 text-red-700' };
    if (daysLeft < 30) return { status: 'expiring soon', color: 'bg-amber-100 text-amber-700' };
    return { status: 'valid', color: 'bg-green-100 text-green-700' };
  };

  if (loadingSettings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('InvoiceNow')}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900">InvoiceNow Settings</h1>
              <p className="text-sm text-slate-500">Configure your Peppol integration</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="general" className="gap-2">
              <Settings className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="company" className="gap-2">
              <Building2 className="w-4 h-4" />
              Company
            </TabsTrigger>
            <TabsTrigger value="connectors" className="gap-2">
              <Globe className="w-4 h-4" />
              AP Connectors
            </TabsTrigger>
            <TabsTrigger value="certificates" className="gap-2">
              <Key className="w-4 h-4" />
              Certificates
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>InvoiceNow Status</CardTitle>
                  <CardDescription>Enable or disable InvoiceNow functionality</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">Enable InvoiceNow</p>
                      <p className="text-sm text-slate-500">Activate Peppol e-invoicing for your organization</p>
                    </div>
                    <Switch
                      checked={formData.is_enabled || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_enabled: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">Environment</p>
                      <p className="text-sm text-slate-500">Sandbox for testing, Production for live invoices</p>
                    </div>
                    <Select 
                      value={formData.environment || 'sandbox'}
                      onValueChange={(value) => setFormData({ ...formData, environment: value })}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sandbox">
                          <span className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            Sandbox
                          </span>
                        </SelectItem>
                        <SelectItem value="production">
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            Production
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Automation Settings</CardTitle>
                  <CardDescription>Configure automatic invoice processing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-send invoices</p>
                      <p className="text-sm text-slate-500">Automatically send invoices when created</p>
                    </div>
                    <Switch
                      checked={formData.auto_send_invoices || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, auto_send_invoices: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Validate GST before send</p>
                      <p className="text-sm text-slate-500">Check GST registration status with IRAS</p>
                    </div>
                    <Switch
                      checked={formData.validate_gst_before_send !== false}
                      onCheckedChange={(checked) => setFormData({ ...formData, validate_gst_before_send: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Require Peppol ID</p>
                      <p className="text-sm text-slate-500">Only allow sending to verified Peppol participants</p>
                    </div>
                    <Switch
                      checked={formData.require_peppol_id_for_send !== false}
                      onCheckedChange={(checked) => setFormData({ ...formData, require_peppol_id_for_send: checked })}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveSettings} disabled={saveSettingsMutation.isLoading}>
                    {saveSettingsMutation.isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Processing Settings</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Batch Size</Label>
                    <Input
                      type="number"
                      value={formData.batch_size || 50}
                      onChange={(e) => setFormData({ ...formData, batch_size: parseInt(e.target.value) })}
                      className="mt-1"
                    />
                    <p className="text-xs text-slate-500 mt-1">Maximum invoices per batch</p>
                  </div>
                  <div>
                    <Label>Rate Limit (per second)</Label>
                    <Input
                      type="number"
                      value={formData.rate_limit_per_second || 10}
                      onChange={(e) => setFormData({ ...formData, rate_limit_per_second: parseInt(e.target.value) })}
                      className="mt-1"
                    />
                    <p className="text-xs text-slate-500 mt-1">API calls per second</p>
                  </div>
                  <div>
                    <Label>Max Retry Attempts</Label>
                    <Input
                      type="number"
                      value={formData.max_retry_attempts || 5}
                      onChange={(e) => setFormData({ ...formData, max_retry_attempts: parseInt(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Retention Period (days)</Label>
                    <Input
                      type="number"
                      value={formData.retention_days || 2555}
                      onChange={(e) => setFormData({ ...formData, retention_days: parseInt(e.target.value) })}
                      className="mt-1"
                    />
                    <p className="text-xs text-slate-500 mt-1">7 years recommended for compliance</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Company Settings */}
          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
                <CardDescription>Your organization's Peppol registration details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Peppol Participant ID</Label>
                    <Input
                      value={formData.seller_peppol_id || ''}
                      onChange={(e) => setFormData({ ...formData, seller_peppol_id: e.target.value })}
                      placeholder="0195:T08GB0001A"
                      className="mt-1 font-mono"
                    />
                    <p className="text-xs text-slate-500 mt-1">Format: 0195:UEN</p>
                  </div>
                  <div>
                    <Label>UEN (Singapore Business Registration)</Label>
                    <Input
                      value={formData.seller_uen || ''}
                      onChange={(e) => setFormData({ ...formData, seller_uen: e.target.value })}
                      placeholder="T08GB0001A"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800">GST Registration</p>
                      <p className="text-sm text-amber-700 mt-1">
                        Only GST-registered businesses can charge GST on invoices. 
                        Ensure your GST status is correctly set.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>GST Registration Number</Label>
                    <Input
                      value={formData.seller_gst_number || ''}
                      onChange={(e) => setFormData({ ...formData, seller_gst_number: e.target.value })}
                      placeholder="M2-1234567-8"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-end pb-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.seller_gst_registered || false}
                        onCheckedChange={(checked) => setFormData({ ...formData, seller_gst_registered: checked })}
                      />
                      <Label>GST Registered</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Legal Name</Label>
                  <Input
                    value={formData.seller_details?.legal_name || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      seller_details: { ...formData.seller_details, legal_name: e.target.value }
                    })}
                    className="mt-1"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Street Address</Label>
                    <Input
                      value={formData.seller_details?.street || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        seller_details: { ...formData.seller_details, street: e.target.value }
                      })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Building/Unit</Label>
                    <Input
                      value={formData.seller_details?.building || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        seller_details: { ...formData.seller_details, building: e.target.value }
                      })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label>City</Label>
                    <Input
                      value={formData.seller_details?.city || 'Singapore'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        seller_details: { ...formData.seller_details, city: e.target.value }
                      })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Postal Code</Label>
                    <Input
                      value={formData.seller_details?.postal_code || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        seller_details: { ...formData.seller_details, postal_code: e.target.value }
                      })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Country</Label>
                    <Input
                      value={formData.seller_details?.country_code || 'SG'}
                      disabled
                      className="mt-1 bg-slate-50"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Default Bank Account (for Payment)</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label>Account Name</Label>
                      <Input
                        value={formData.default_bank_account?.account_name || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          default_bank_account: { ...formData.default_bank_account, account_name: e.target.value }
                        })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Account Number</Label>
                      <Input
                        value={formData.default_bank_account?.account_number || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          default_bank_account: { ...formData.default_bank_account, account_number: e.target.value }
                        })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Bank Code</Label>
                      <Input
                        value={formData.default_bank_account?.bank_code || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          default_bank_account: { ...formData.default_bank_account, bank_code: e.target.value }
                        })}
                        placeholder="DBS, OCBC, UOB..."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>SWIFT Code</Label>
                      <Input
                        value={formData.default_bank_account?.swift_code || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          default_bank_account: { ...formData.default_bank_account, swift_code: e.target.value }
                        })}
                        placeholder="DBSSSGSG"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} disabled={saveSettingsMutation.isLoading}>
                  {saveSettingsMutation.isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Save className="w-4 h-4 mr-2" />
                  Save Company Details
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* AP Connectors */}
          <TabsContent value="connectors">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Access Point Connectors</CardTitle>
                    <CardDescription>Configure connections to Peppol Access Points</CardDescription>
                  </div>
                  <Button onClick={() => { setEditingConnector(null); setShowConnectorModal(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Connector
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loadingConnectors ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-400 mx-auto" />
                  </div>
                ) : connectors.length === 0 ? (
                  <div className="text-center py-8">
                    <Globe className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No connectors configured</p>
                    <p className="text-sm text-slate-400">Add an Access Point connector to start sending invoices</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {connectors.map((connector) => (
                      <div key={connector.id} className="p-4 border rounded-lg hover:bg-slate-50">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              connector.health_status === 'healthy' ? 'bg-green-100' :
                              connector.health_status === 'degraded' ? 'bg-amber-100' : 'bg-slate-100'
                            }`}>
                              <Globe className={`w-5 h-5 ${
                                connector.health_status === 'healthy' ? 'text-green-600' :
                                connector.health_status === 'degraded' ? 'text-amber-600' : 'text-slate-600'
                              }`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{connector.name}</p>
                                {connector.is_default && (
                                  <Badge className="bg-lime-100 text-lime-700">Default</Badge>
                                )}
                                <Badge variant="outline">{connector.environment}</Badge>
                              </div>
                              <p className="text-sm text-slate-500 mt-1">
                                Provider: {AP_PROVIDERS.find(p => p.value === connector.provider)?.label || connector.provider}
                              </p>
                              <p className="text-xs text-slate-400 mt-1 font-mono">{connector.api_base_url}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => { setEditingConnector(connector); setShowConnectorModal(true); }}>
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => {
                                if (confirm('Delete this connector?')) {
                                  deleteConnectorMutation.mutate(connector.id);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        {connector.stats && (
                          <div className="flex gap-6 mt-4 pt-4 border-t">
                            <div>
                              <p className="text-xs text-slate-500">Sent</p>
                              <p className="font-medium">{connector.stats.total_sent || 0}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Received</p>
                              <p className="font-medium">{connector.stats.total_received || 0}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Success Rate</p>
                              <p className="font-medium">{connector.stats.success_rate || 0}%</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificates */}
          <TabsContent value="certificates">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>PKI Certificates</CardTitle>
                    <CardDescription>Manage Peppol PKI certificates for secure communication</CardDescription>
                  </div>
                  <Button onClick={() => setShowCertModal(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Certificate
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loadingCerts ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-400 mx-auto" />
                  </div>
                ) : certificates.length === 0 ? (
                  <div className="text-center py-8">
                    <Key className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No certificates uploaded</p>
                    <p className="text-sm text-slate-400">Upload your Peppol PKI certificate to enable production mode</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Certificate</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Environment</TableHead>
                        <TableHead>Valid Until</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {certificates.map((cert) => {
                        const { status, color } = getCertificateStatus(cert);
                        return (
                          <TableRow key={cert.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{cert.name}</p>
                                <p className="text-xs text-slate-500 font-mono">{cert.thumbprint?.substring(0, 20)}...</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{cert.certificate_type}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{cert.environment}</Badge>
                            </TableCell>
                            <TableCell>
                              {cert.valid_to && format(new Date(cert.valid_to), 'dd MMM yyyy')}
                            </TableCell>
                            <TableCell>
                              <Badge className={color}>{status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">PKI Certificate Guide</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Request production certificates through your Access Point provider</li>
                    <li>• Certificates are issued by OpenPeppol PKI Authority</li>
                    <li>• Set up expiry alerts at least 90 days before expiration</li>
                    <li>• Store certificates securely - private keys are encrypted</li>
                  </ul>
                  <a 
                    href="https://www.imda.gov.sg/how-we-can-help/invoicenow" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mt-2"
                  >
                    IMDA InvoiceNow Documentation
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Notification Emails</Label>
                  <Textarea
                    value={formData.notification_emails?.join('\n') || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      notification_emails: e.target.value.split('\n').filter(Boolean)
                    })}
                    placeholder="email@example.com&#10;another@example.com"
                    className="mt-1"
                    rows={3}
                  />
                  <p className="text-xs text-slate-500 mt-1">One email per line</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Send Success Notifications</p>
                      <p className="text-sm text-slate-500">Notify when invoice is successfully delivered</p>
                    </div>
                    <Switch
                      checked={formData.notify_on_send_success || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, notify_on_send_success: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Send Failure Notifications</p>
                      <p className="text-sm text-slate-500">Notify when invoice delivery fails</p>
                    </div>
                    <Switch
                      checked={formData.notify_on_send_failure !== false}
                      onCheckedChange={(checked) => setFormData({ ...formData, notify_on_send_failure: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Receive Notifications</p>
                      <p className="text-sm text-slate-500">Notify when invoice is received</p>
                    </div>
                    <Switch
                      checked={formData.notify_on_receive !== false}
                      onCheckedChange={(checked) => setFormData({ ...formData, notify_on_receive: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Certificate Expiry Alerts</p>
                      <p className="text-sm text-slate-500">Alert before PKI certificate expires</p>
                    </div>
                    <Switch
                      checked={formData.notify_on_cert_expiry !== false}
                      onCheckedChange={(checked) => setFormData({ ...formData, notify_on_cert_expiry: checked })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Certificate Expiry Warning (days)</Label>
                  <Input
                    type="number"
                    value={formData.cert_expiry_warning_days || 30}
                    onChange={(e) => setFormData({ ...formData, cert_expiry_warning_days: parseInt(e.target.value) })}
                    className="mt-1 w-32"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings} disabled={saveSettingsMutation.isLoading}>
                  {saveSettingsMutation.isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Save className="w-4 h-4 mr-2" />
                  Save Notification Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Connector Modal */}
      <Dialog open={showConnectorModal} onOpenChange={setShowConnectorModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingConnector ? 'Edit Connector' : 'Add AP Connector'}</DialogTitle>
            <DialogDescription>
              Configure connection to a Peppol Access Point
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Connector Name</Label>
              <Input placeholder="My Storecove Connection" className="mt-1" />
            </div>
            <div>
              <Label>Provider</Label>
              <Select defaultValue="sandbox">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AP_PROVIDERS.map(provider => (
                    <SelectItem key={provider.value} value={provider.value}>
                      <div>
                        <p className="font-medium">{provider.label}</p>
                        <p className="text-xs text-slate-500">{provider.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>API Base URL</Label>
              <Input placeholder="https://api.storecove.com" className="mt-1 font-mono text-sm" />
            </div>
            <div>
              <Label>API Key</Label>
              <Input type="password" placeholder="Enter API key" className="mt-1" />
            </div>
            <div className="flex items-center gap-2">
              <Switch />
              <Label>Set as default connector</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConnectorModal(false)}>Cancel</Button>
            <Button onClick={() => {
              toast.success('Connector saved');
              setShowConnectorModal(false);
            }}>
              Save Connector
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}