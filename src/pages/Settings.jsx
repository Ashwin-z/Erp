import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PageHeader from '@/components/shared/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Settings as SettingsIcon, User, Building2, Bell, Shield, 
  CreditCard, Link2, Save, Upload, Globe, Mail, FileText, Plus, Trash2, Edit, Copy, Eye, Info,
  Key, History, LogOut, Lock, Smartphone, Monitor, Check, X, Zap, Crown, Star, Rocket, AlertTriangle, Loader2, Activity
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import QuoteTemplateEditor from '@/components/settings/QuoteTemplateEditor';
import IntegrationMonitorDashboard from '@/components/integrations/IntegrationMonitorDashboard';

export default function Settings() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const queryClient = useQueryClient();
  
  // Fetch current user data
  const { data: currentUser, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });
  
  // Save states for tracking unsaved changes
  const [profileSaved, setProfileSaved] = useState(true);
  const [companySaved, setCompanySaved] = useState(true);
  const [notificationsSaved, setNotificationsSaved] = useState(true);
  const [quoteSettingsSaved, setQuoteSettingsSaved] = useState(true);
  const [footerTermsSaved, setFooterTermsSaved] = useState(true);
  const [displayOptionsSaved, setDisplayOptionsSaved] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingCompany, setSavingCompany] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [savingQuoteSettings, setSavingQuoteSettings] = useState(false);
  const [savingDisplayOptions, setSavingDisplayOptions] = useState(false);
  const [savingFooterTerms, setSavingFooterTerms] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Profile state
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    role: '',
    phone: '',
    avatar: ''
  });
  
  // Company state
  const [company, setCompany] = useState({
    name: '',
    uen: '',
    gstNo: '',
    fyEnd: 'December',
    address: ''
  });
  
  // Notifications state
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    aiAlerts: true,
    weeklyReport: true
  });
  
  // Initialize state from user data
  useEffect(() => {
    if (currentUser) {
      const savedSettings = currentUser.settings || {};
      
      setProfile({
        fullName: currentUser.full_name || '',
        email: currentUser.email || '',
        role: currentUser.role || '',
        phone: savedSettings.profile?.phone || '',
        avatar: savedSettings.profile?.avatar || ''
      });
      
      if (savedSettings.company) {
        setCompany(savedSettings.company);
      }
      
      if (savedSettings.notifications) {
        setNotifications(savedSettings.notifications);
      }
      
      if (savedSettings.quoteSettings) {
        setQuoteSettings(prev => ({ ...prev, ...savedSettings.quoteSettings }));
      }
    }
  }, [currentUser]);
  
  // Mutation for saving user settings
  const saveSettingsMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
  
  // Security state
  const [passwordModal, setPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [loginHistory, setLoginHistory] = useState([
    { id: 1, device: 'Chrome on Windows', location: 'Singapore', ip: '192.168.1.1', time: '2024-11-27 14:30', current: true },
    { id: 2, device: 'Safari on iPhone', location: 'Singapore', ip: '192.168.1.2', time: '2024-11-26 09:15', current: false },
    { id: 3, device: 'Firefox on MacOS', location: 'Malaysia', ip: '103.4.5.6', time: '2024-11-25 18:00', current: false },
  ]);
  const [showLoginHistory, setShowLoginHistory] = useState(false);
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'Production API', key: 'ark_live_...3x8k', created: '2024-10-15', lastUsed: '2024-11-27', status: 'active' },
    { id: 2, name: 'Development API', key: 'ark_test_...9f2m', created: '2024-09-01', lastUsed: '2024-11-20', status: 'active' },
  ]);
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [newApiKeyModal, setNewApiKeyModal] = useState(false);
  const [newApiKeyName, setNewApiKeyName] = useState('');
  const [revokeSessionsConfirm, setRevokeSessionsConfirm] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  
  // Billing state
  const [currentPlan, setCurrentPlan] = useState('professional');
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'visa', last4: '4242', expiry: '12/26', isDefault: true },
    { id: 2, type: 'mastercard', last4: '8888', expiry: '03/25', isDefault: false },
  ]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [billingHistory, setBillingHistory] = useState([
    { id: 1, date: '2024-11-01', amount: 59, status: 'paid', invoice: 'INV-2024-011' },
    { id: 2, date: '2024-10-01', amount: 59, status: 'paid', invoice: 'INV-2024-010' },
    { id: 3, date: '2024-09-01', amount: 59, status: 'paid', invoice: 'INV-2024-009' },
  ]);
  
  const plans = [
    { id: 'starter', name: 'Starter', price: 19, period: 'month', features: ['1 Company', '1,000 Transactions/mo', 'Basic Reports', 'Email Support'], icon: Zap, color: 'slate' },
    { id: 'professional', name: 'Professional', price: 59, period: 'month', features: ['3 Companies', 'Unlimited Transactions', 'AI Reconciliation', 'Priority Support', 'API Access'], icon: Star, color: 'violet', popular: true },
    { id: 'enterprise', name: 'Enterprise', price: 199, period: 'month', features: ['Unlimited Companies', 'Unlimited Everything', 'Custom Integrations', 'Dedicated Support', 'White-label Options', 'SLA Guarantee'], icon: Crown, color: 'amber' },
  ];
  
  // Integrations state
  const [integrations, setIntegrations] = useState([
    { id: 1, name: 'DBS Bank', category: 'Banking', status: 'connected', desc: 'Bank feed integration', icon: '🏦', connectedAt: '2024-10-15', syncStatus: 'synced' },
    { id: 2, name: 'OCBC Bank', category: 'Banking', status: 'available', desc: 'Bank feed integration', icon: '🏦' },
    { id: 3, name: 'Xero', category: 'Accounting', status: 'available', desc: 'Accounting software sync', icon: '📊' },
    { id: 4, name: 'Stripe', category: 'Payments', status: 'connected', desc: 'Payment processing', icon: '💳', connectedAt: '2024-09-01', syncStatus: 'synced' },
    { id: 5, name: 'PayPal', category: 'Payments', status: 'available', desc: 'Payment gateway', icon: '💰' },
    { id: 6, name: 'Slack', category: 'Communication', status: 'available', desc: 'Team notifications', icon: '💬' },
    { id: 7, name: 'Google Workspace', category: 'Productivity', status: 'connected', desc: 'Calendar & Docs sync', icon: '📅', connectedAt: '2024-11-01', syncStatus: 'synced' },
    { id: 8, name: 'Shopify', category: 'E-commerce', status: 'available', desc: 'Sales channel sync', icon: '🛒' },
  ]);
  const [integrationFilter, setIntegrationFilter] = useState('all');
  const [configureIntegration, setConfigureIntegration] = useState(null);

  const [quoteSettings, setQuoteSettings] = useState({
    // Number Format: YY + MM + Serial (e.g., 25111001)
    formatType: 'date-serial', // date-serial, prefix-serial, custom
    prefix: '',
    yearFormat: '2-digit', // 2-digit (25) or 4-digit (2025)
    includeMonth: true,
    serialDigits: 4,
    currentSerial: 1,
    resetSerialMonthly: true,
    resetSerialYearly: false,
    defaultValidity: 30,
    defaultCurrency: 'SGD',
    defaultPaymentTerms: 'Net 30',
    autoNumbering: true,
    showCompanyLogo: true,
    showSignatureLine: true,
    showBankDetails: true,
    taxRate: 9,
    taxLabel: 'GST',
    footerText: 'Thank you for your business. This quotation is valid for the period stated above.',
    termsAndConditions: '1. Prices are in SGD unless otherwise stated.\n2. Payment terms as specified above.\n3. Delivery timeline to be confirmed upon order confirmation.'
  });

  const [quoteTemplates, setQuoteTemplates] = useState([
    { id: 1, name: 'Standard Quotation', isDefault: true, description: 'Default template for general quotes' },
    { id: 2, name: 'Service Proposal', isDefault: false, description: 'For service-based quotations' },
    { id: 3, name: 'Project Quote', isDefault: false, description: 'Detailed project-based quotation' }
  ]);

  const [templateEditorOpen, setTemplateEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Generate preview quote number
  const generatePreviewNumber = () => {
    const now = new Date();
    const year = quoteSettings.yearFormat === '2-digit' 
      ? String(now.getFullYear()).slice(-2) 
      : String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const serial = String(quoteSettings.currentSerial).padStart(quoteSettings.serialDigits, '0');
    
    if (quoteSettings.formatType === 'date-serial') {
      return quoteSettings.includeMonth ? `${year}${month}${serial}` : `${year}${serial}`;
    } else if (quoteSettings.formatType === 'prefix-serial') {
      return `${quoteSettings.prefix}${serial}`;
    }
    return `${quoteSettings.prefix}${year}${month}${serial}`;
  };

  const openTemplateEditor = (template = null) => {
    setEditingTemplate(template);
    setTemplateEditorOpen(true);
  };

  const handleDeleteTemplate = (id) => {
    setQuoteTemplates(prev => prev.filter(t => t.id !== id));
    setDeleteConfirm(null);
    toast.success('Template deleted');
  };

  const handleDuplicateTemplate = (template) => {
    const newTemplate = {
      ...template,
      id: Date.now(),
      name: `${template.name} (Copy)`,
      isDefault: false
    };
    setQuoteTemplates(prev => [...prev, newTemplate]);
    toast.success('Template duplicated');
  };

  const handleSetDefault = (id) => {
    setQuoteTemplates(prev => prev.map(t => ({
      ...t,
      isDefault: t.id === id
    })));
    toast.success('Default template updated');
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1200px] mx-auto space-y-6">
            
            <PageHeader
              title="Settings"
              subtitle="Manage your account and preferences"
              icon={SettingsIcon}
              iconColor="text-slate-600"
            />

            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" />Profile
                </TabsTrigger>
                <TabsTrigger value="company" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />Company
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />Notifications
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />Security
                </TabsTrigger>
                <TabsTrigger value="billing" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />Billing
                </TabsTrigger>
                <TabsTrigger value="integrations" className="flex items-center gap-2">
                  <Link2 className="w-4 h-4" />Integrations
                </TabsTrigger>
                <TabsTrigger value="quotes" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />Quotes
                </TabsTrigger>
              </TabsList>

              <TooltipProvider>
                {/* Profile Tab */}
                <TabsContent value="profile">
                  <Card className="border-slate-200">
                    <CardHeader>
                      <CardTitle>Profile Settings</CardTitle>
                      <CardDescription>Manage your personal information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                          {profile.avatar ? (
                            <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-10 h-10 text-slate-400" />
                          )}
                        </div>
                        <div className="space-y-2">
                          <Button variant="outline" onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => setProfile({...profile, avatar: ev.target.result});
                                reader.readAsDataURL(file);
                                toast.success('Photo uploaded');
                              }
                            };
                            input.click();
                          }}>
                            <Upload className="w-4 h-4 mr-2" />Upload Photo
                          </Button>
                          {profile.avatar && (
                            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setProfile({...profile, avatar: ''})}>
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Full Name</Label>
                          <Input value={profile.fullName} onChange={(e) => { setProfile({...profile, fullName: e.target.value}); setProfileSaved(false); }} />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input value={profile.email} onChange={(e) => { setProfile({...profile, email: e.target.value}); setProfileSaved(false); }} type="email" />
                        </div>
                        <div className="space-y-2">
                          <Label>Role</Label>
                          <Input value={profile.role} onChange={(e) => { setProfile({...profile, role: e.target.value}); setProfileSaved(false); }} />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input value={profile.phone} onChange={(e) => { setProfile({...profile, phone: e.target.value}); setProfileSaved(false); }} />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button 
                          className="bg-lime-600 hover:bg-lime-700" 
                          disabled={savingProfile || profileSaved}
                          onClick={async () => {
                            setSavingProfile(true);
                            try {
                              await saveSettingsMutation.mutateAsync({
                                settings: {
                                  ...currentUser?.settings,
                                  profile: { phone: profile.phone, avatar: profile.avatar }
                                }
                              });
                              setProfileSaved(true);
                              toast.success('Profile saved successfully');
                            } catch (error) {
                              toast.error('Failed to save profile');
                            }
                            setSavingProfile(false);
                          }}
                        >
                          {savingProfile ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><Save className="w-4 h-4 mr-2" />Save Changes</>}
                        </Button>
                        {profileSaved && <Badge className="bg-emerald-100 text-emerald-700"><Check className="w-3 h-3 mr-1" />Saved</Badge>}
                        {!profileSaved && <Badge className="bg-amber-100 text-amber-700">Unsaved changes</Badge>}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Company Tab */}
                <TabsContent value="company">
                  <Card className="border-slate-200">
                    <CardHeader>
                      <CardTitle>Company Settings</CardTitle>
                      <CardDescription>Manage your organization details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Company Name</Label>
                          <Input value={company.name} onChange={(e) => { setCompany({...company, name: e.target.value}); setCompanySaved(false); }} />
                        </div>
                        <div className="space-y-2">
                          <Label>UEN/Registration No.</Label>
                          <Input value={company.uen} onChange={(e) => { setCompany({...company, uen: e.target.value}); setCompanySaved(false); }} />
                        </div>
                        <div className="space-y-2">
                          <Label>GST Registration No.</Label>
                          <Input value={company.gstNo} onChange={(e) => { setCompany({...company, gstNo: e.target.value}); setCompanySaved(false); }} />
                        </div>
                        <div className="space-y-2">
                          <Label>Financial Year End</Label>
                          <Select value={company.fyEnd} onValueChange={(v) => { setCompany({...company, fyEnd: v}); setCompanySaved(false); }}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => (
                                <SelectItem key={m} value={m}>{m}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label>Address</Label>
                          <Input value={company.address} onChange={(e) => { setCompany({...company, address: e.target.value}); setCompanySaved(false); }} />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button 
                          className="bg-lime-600 hover:bg-lime-700" 
                          disabled={savingCompany || companySaved}
                          onClick={async () => {
                            setSavingCompany(true);
                            try {
                              await saveSettingsMutation.mutateAsync({
                                settings: {
                                  ...currentUser?.settings,
                                  company: company
                                }
                              });
                              setCompanySaved(true);
                              toast.success('Company settings saved successfully');
                            } catch (error) {
                              toast.error('Failed to save company settings');
                            }
                            setSavingCompany(false);
                          }}
                        >
                          {savingCompany ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><Save className="w-4 h-4 mr-2" />Save Changes</>}
                        </Button>
                        {companySaved && <Badge className="bg-emerald-100 text-emerald-700"><Check className="w-3 h-3 mr-1" />Saved</Badge>}
                        {!companySaved && <Badge className="bg-amber-100 text-amber-700">Unsaved changes</Badge>}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications">
                  <Card className="border-slate-200">
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Control how you receive notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {[
                        { key: 'email', label: 'Email Notifications', desc: 'Receive important updates via email', icon: Mail },
                        { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications', icon: Bell },
                        { key: 'aiAlerts', label: 'AI Alerts', desc: 'Real-time AI recommendations and alerts', icon: Globe },
                        { key: 'weeklyReport', label: 'Weekly Reports', desc: 'Receive weekly summary reports', icon: CreditCard },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border">
                              <item.icon className="w-5 h-5 text-slate-500" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{item.label}</p>
                              <p className="text-sm text-slate-500">{item.desc}</p>
                            </div>
                          </div>
                          <Switch 
                            checked={notifications[item.key]}
                            onCheckedChange={(checked) => {
                              setNotifications({...notifications, [item.key]: checked});
                              setNotificationsSaved(false);
                            }}
                          />
                        </div>
                      ))}
                      <div className="flex items-center gap-3 mt-4">
                        <Button 
                          className="bg-lime-600 hover:bg-lime-700" 
                          disabled={savingNotifications || notificationsSaved}
                          onClick={async () => {
                            setSavingNotifications(true);
                            try {
                              await saveSettingsMutation.mutateAsync({
                                settings: {
                                  ...currentUser?.settings,
                                  notifications: notifications
                                }
                              });
                              setNotificationsSaved(true);
                              toast.success('Notification preferences saved');
                            } catch (error) {
                              toast.error('Failed to save notification preferences');
                            }
                            setSavingNotifications(false);
                          }}
                        >
                          {savingNotifications ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><Save className="w-4 h-4 mr-2" />Save Preferences</>}
                        </Button>
                        {notificationsSaved && <Badge className="bg-emerald-100 text-emerald-700"><Check className="w-3 h-3 mr-1" />Saved</Badge>}
                        {!notificationsSaved && <Badge className="bg-amber-100 text-amber-700">Unsaved changes</Badge>}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security">
                  <div className="space-y-6">
                    {/* 2FA Card */}
                    <Card className="border-slate-200">
                      <CardHeader>
                        <CardTitle>Two-Factor Authentication</CardTitle>
                        <CardDescription>Add an extra layer of security to your account</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className={`p-4 rounded-xl border flex items-center justify-between ${twoFactorEnabled ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${twoFactorEnabled ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                              <Shield className={`w-6 h-6 ${twoFactorEnabled ? 'text-emerald-600' : 'text-amber-600'}`} />
                            </div>
                            <div>
                              <p className={`font-medium ${twoFactorEnabled ? 'text-emerald-700' : 'text-amber-700'}`}>
                                {twoFactorEnabled ? 'Two-Factor Authentication Enabled' : 'Two-Factor Authentication Disabled'}
                              </p>
                              <p className={`text-sm ${twoFactorEnabled ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {twoFactorEnabled ? 'Your account is protected with 2FA' : 'Enable 2FA for enhanced security'}
                              </p>
                            </div>
                          </div>
                          <Switch checked={twoFactorEnabled} onCheckedChange={(c) => {
                            setTwoFactorEnabled(c);
                            toast.success(c ? '2FA enabled' : '2FA disabled');
                          }} />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Password & Sessions */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Change Password */}
                      <Card className="border-slate-200">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2"><Lock className="w-5 h-5" />Change Password</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>Current Password</Label>
                            <Input type="password" value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                            <Label>New Password</Label>
                            <Input type="password" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                            <Label>Confirm New Password</Label>
                            <Input type="password" value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} />
                          </div>
                          <Button className="w-full bg-lime-600 hover:bg-lime-700" onClick={() => {
                            if (!passwords.current || !passwords.new || !passwords.confirm) {
                              toast.error('Please fill all fields');
                              return;
                            }
                            if (passwords.new !== passwords.confirm) {
                              toast.error('Passwords do not match');
                              return;
                            }
                            if (passwords.new.length < 8) {
                              toast.error('Password must be at least 8 characters');
                              return;
                            }
                            setPasswords({ current: '', new: '', confirm: '' });
                            toast.success('Password changed successfully');
                          }}>
                            <Save className="w-4 h-4 mr-2" />Update Password
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Active Sessions */}
                      <Card className="border-slate-200">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2"><History className="w-5 h-5" />Login History</CardTitle>
                            <Button variant="outline" size="sm" onClick={() => setShowLoginHistory(true)}>View All</Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {loginHistory.slice(0, 3).map((session) => (
                            <div key={session.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                {session.device.includes('iPhone') ? (
                                  <Smartphone className="w-5 h-5 text-slate-500" />
                                ) : (
                                  <Monitor className="w-5 h-5 text-slate-500" />
                                )}
                                <div>
                                  <p className="font-medium text-sm">{session.device}</p>
                                  <p className="text-xs text-slate-500">{session.location} • {session.time}</p>
                                </div>
                              </div>
                              {session.current && <Badge className="bg-emerald-100 text-emerald-700">Current</Badge>}
                            </div>
                          ))}
                          <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setRevokeSessionsConfirm(true)}>
                            <LogOut className="w-4 h-4 mr-2" />Revoke All Other Sessions
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    {/* API Keys */}
                    <Card className="border-slate-200">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2"><Key className="w-5 h-5" />API Keys</CardTitle>
                            <CardDescription>Manage API keys for integrations</CardDescription>
                          </div>
                          <Button className="bg-lime-600 hover:bg-lime-700" onClick={() => setNewApiKeyModal(true)}>
                            <Plus className="w-4 h-4 mr-2" />New API Key
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Key</TableHead>
                              <TableHead>Created</TableHead>
                              <TableHead>Last Used</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {apiKeys.map((key) => (
                              <TableRow key={key.id}>
                                <TableCell className="font-medium">{key.name}</TableCell>
                                <TableCell className="font-mono text-sm text-slate-500">{key.key}</TableCell>
                                <TableCell>{key.created}</TableCell>
                                <TableCell>{key.lastUsed}</TableCell>
                                <TableCell>
                                  <Badge className={key.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>
                                    {key.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm" className="text-red-500" onClick={() => {
                                    setApiKeys(apiKeys.filter(k => k.id !== key.id));
                                    toast.success('API key revoked');
                                  }}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Login History Modal */}
                  <Dialog open={showLoginHistory} onOpenChange={setShowLoginHistory}>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Login History</DialogTitle>
                        <DialogDescription>Recent login activity on your account</DialogDescription>
                      </DialogHeader>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Device</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>IP Address</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loginHistory.map((s) => (
                            <TableRow key={s.id}>
                              <TableCell className="flex items-center gap-2">
                                {s.device.includes('iPhone') ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                                {s.device}
                              </TableCell>
                              <TableCell>{s.location}</TableCell>
                              <TableCell className="font-mono text-sm">{s.ip}</TableCell>
                              <TableCell>{s.time}</TableCell>
                              <TableCell>{s.current && <Badge className="bg-emerald-100 text-emerald-700">Current</Badge>}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </DialogContent>
                  </Dialog>

                  {/* New API Key Modal */}
                  <Dialog open={newApiKeyModal} onOpenChange={setNewApiKeyModal}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New API Key</DialogTitle>
                        <DialogDescription>Give your API key a descriptive name</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Key Name</Label>
                          <Input value={newApiKeyName} onChange={(e) => setNewApiKeyName(e.target.value)} placeholder="e.g., Production API" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setNewApiKeyModal(false)}>Cancel</Button>
                        <Button className="bg-lime-600 hover:bg-lime-700" onClick={() => {
                          if (!newApiKeyName) {
                            toast.error('Please enter a key name');
                            return;
                          }
                          const newKey = {
                            id: Date.now(),
                            name: newApiKeyName,
                            key: `ark_live_...${Math.random().toString(36).slice(-4)}`,
                            created: new Date().toISOString().split('T')[0],
                            lastUsed: 'Never',
                            status: 'active'
                          };
                          setApiKeys([...apiKeys, newKey]);
                          setNewApiKeyName('');
                          setNewApiKeyModal(false);
                          toast.success('API key created');
                        }}>Create Key</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Revoke Sessions Confirm */}
                  <AlertDialog open={revokeSessionsConfirm} onOpenChange={setRevokeSessionsConfirm}>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Revoke All Sessions?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will log you out from all other devices. You will need to log in again on those devices.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => {
                          setLoginHistory(loginHistory.filter(s => s.current));
                          toast.success('All other sessions revoked');
                        }}>Revoke All</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TabsContent>

                {/* Billing Tab */}
                <TabsContent value="billing">
                  <div className="space-y-6">
                    {/* Subscription Plans */}
                    <Card className="border-slate-200">
                      <CardHeader>
                        <CardTitle>Choose Your Plan</CardTitle>
                        <CardDescription>Select the plan that fits your business needs</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-6">
                          {plans.map((plan) => {
                            const Icon = plan.icon;
                            const isCurrentPlan = currentPlan === plan.id;
                            return (
                              <div 
                                key={plan.id} 
                                className={`relative rounded-2xl border-2 p-6 transition-all ${
                                  isCurrentPlan ? 'border-lime-500 bg-lime-50/50' : 
                                  plan.popular ? 'border-violet-500 bg-violet-50/50' : 
                                  'border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                {plan.popular && !isCurrentPlan && (
                                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600">Most Popular</Badge>
                                )}
                                {isCurrentPlan && (
                                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-lime-600">Current Plan</Badge>
                                )}
                                <div className="text-center mb-6">
                                  <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
                                    plan.color === 'violet' ? 'bg-violet-100' : 
                                    plan.color === 'amber' ? 'bg-amber-100' : 'bg-slate-100'
                                  }`}>
                                    <Icon className={`w-7 h-7 ${
                                      plan.color === 'violet' ? 'text-violet-600' : 
                                      plan.color === 'amber' ? 'text-amber-600' : 'text-slate-600'
                                    }`} />
                                  </div>
                                  <h3 className="text-xl font-bold">{plan.name}</h3>
                                  <div className="mt-2">
                                    <span className="text-3xl font-bold">${plan.price}</span>
                                    <span className="text-slate-500">/{plan.period}</span>
                                  </div>
                                </div>
                                <ul className="space-y-3 mb-6">
                                  {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm">
                                      <Check className="w-4 h-4 text-emerald-500" />
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                                <Button 
                                  className={`w-full ${
                                    isCurrentPlan ? 'bg-slate-200 text-slate-600' : 
                                    plan.popular ? 'bg-violet-600 hover:bg-violet-700' : 
                                    'bg-slate-900 hover:bg-slate-800'
                                  }`}
                                  disabled={isCurrentPlan}
                                  onClick={() => {
                                    setCurrentPlan(plan.id);
                                    toast.success(`Switched to ${plan.name} plan`);
                                  }}
                                >
                                  {isCurrentPlan ? 'Current Plan' : plan.price > plans.find(p => p.id === currentPlan)?.price ? 'Upgrade' : 'Downgrade'}
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Payment Methods */}
                    <Card className="border-slate-200">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Payment Methods</CardTitle>
                            <CardDescription>Manage your payment options</CardDescription>
                          </div>
                          <Button variant="outline" onClick={() => { setEditingPayment(null); setShowPaymentModal(true); }}>
                            <Plus className="w-4 h-4 mr-2" />Add Card
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {paymentMethods.map((pm) => (
                          <div key={pm.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-8 bg-white rounded border flex items-center justify-center">
                                <CreditCard className="w-6 h-6 text-slate-400" />
                              </div>
                              <div>
                                <p className="font-medium">{pm.type.toUpperCase()} •••• {pm.last4}</p>
                                <p className="text-sm text-slate-500">Expires {pm.expiry}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {pm.isDefault ? (
                                <Badge className="bg-emerald-100 text-emerald-700">Default</Badge>
                              ) : (
                                <Button variant="ghost" size="sm" onClick={() => {
                                  setPaymentMethods(paymentMethods.map(p => ({...p, isDefault: p.id === pm.id})));
                                  toast.success('Default payment method updated');
                                }}>Set Default</Button>
                              )}
                              <Button variant="ghost" size="sm" onClick={() => { setEditingPayment(pm); setShowPaymentModal(true); }}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-500" onClick={() => {
                                if (pm.isDefault) {
                                  toast.error('Cannot delete default payment method');
                                  return;
                                }
                                setPaymentMethods(paymentMethods.filter(p => p.id !== pm.id));
                                toast.success('Payment method removed');
                              }}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Billing History */}
                    <Card className="border-slate-200">
                      <CardHeader>
                        <CardTitle>Billing History</CardTitle>
                        <CardDescription>View and download your invoices</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Invoice</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {billingHistory.map((bill) => (
                              <TableRow key={bill.id}>
                                <TableCell>{bill.date}</TableCell>
                                <TableCell className="font-mono">{bill.invoice}</TableCell>
                                <TableCell>${bill.amount}</TableCell>
                                <TableCell>
                                  <Badge className="bg-emerald-100 text-emerald-700">{bill.status}</Badge>
                                </TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm" onClick={() => toast.success('Invoice downloaded')}>
                                    Download
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Payment Method Modal */}
                  <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingPayment ? 'Edit Payment Method' : 'Add Payment Method'}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Card Number</Label>
                          <Input placeholder="4242 4242 4242 4242" defaultValue={editingPayment ? `•••• •••• •••• ${editingPayment.last4}` : ''} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Expiry Date</Label>
                            <Input placeholder="MM/YY" defaultValue={editingPayment?.expiry || ''} />
                          </div>
                          <div className="space-y-2">
                            <Label>CVV</Label>
                            <Input placeholder="123" type="password" />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPaymentModal(false)}>Cancel</Button>
                        <Button className="bg-lime-600 hover:bg-lime-700" onClick={() => {
                          if (editingPayment) {
                            toast.success('Payment method updated');
                          } else {
                            const newPM = {
                              id: Date.now(),
                              type: 'visa',
                              last4: Math.random().toString().slice(-4),
                              expiry: '12/28',
                              isDefault: paymentMethods.length === 0
                            };
                            setPaymentMethods([...paymentMethods, newPM]);
                            toast.success('Payment method added');
                          }
                          setShowPaymentModal(false);
                          setEditingPayment(null);
                        }}>Save</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TabsContent>

                {/* Integrations Tab */}
                <TabsContent value="integrations">
                  <div className="space-y-6">
                    {/* Header with Filter */}
                    <Card className="border-slate-200">
                      <CardContent className="p-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Link2 className="w-5 h-5 text-slate-500" />
                              <span className="font-medium">Filter by Category:</span>
                            </div>
                            <Select value={integrationFilter} onValueChange={setIntegrationFilter}>
                              <SelectTrigger className="w-48">
                                <SelectValue placeholder="All Categories" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="Banking">Banking</SelectItem>
                                <SelectItem value="Payments">Payments</SelectItem>
                                <SelectItem value="Accounting">Accounting</SelectItem>
                                <SelectItem value="Communication">Communication</SelectItem>
                                <SelectItem value="Productivity">Productivity</SelectItem>
                                <SelectItem value="E-commerce">E-commerce</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-emerald-100 text-emerald-700 px-3 py-1">
                              <Check className="w-3 h-3 mr-1" />
                              {integrations.filter(i => i.status === 'connected').length} Connected
                            </Badge>
                            <Badge variant="outline" className="px-3 py-1">
                              {integrations.filter(i => i.status === 'available').length} Available
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Connected Integrations */}
                    <Card className="border-slate-200">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <Check className="w-4 h-4 text-emerald-600" />
                          </div>
                          Connected Integrations
                        </CardTitle>
                        <CardDescription>Active integrations syncing with your account</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {integrations.filter(i => i.status === 'connected' && (integrationFilter === 'all' || i.category === integrationFilter)).length > 0 ? (
                          <div className="space-y-3">
                            {integrations.filter(i => i.status === 'connected' && (integrationFilter === 'all' || i.category === integrationFilter)).map((integration) => (
                              <div key={integration.id} className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 hover:bg-emerald-50 transition-colors">
                                <div className="flex items-center gap-4">
                                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-2xl border-2 border-emerald-200 shadow-sm">
                                    {integration.icon}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="font-semibold text-slate-900">{integration.name}</p>
                                      <Badge className="bg-emerald-100 text-emerald-700 text-xs">Connected</Badge>
                                      <Badge variant="outline" className="text-xs">{integration.category}</Badge>
                                    </div>
                                    <p className="text-sm text-slate-600">{integration.desc}</p>
                                    <p className="text-xs text-slate-400 mt-1">Connected on {integration.connectedAt} • Last synced: Just now</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm" className="border-slate-300" onClick={() => setConfigureIntegration(integration)}>
                                    <SettingsIcon className="w-4 h-4 mr-1" />
                                    Configure
                                  </Button>
                                  <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300" onClick={() => {
                                    setIntegrations(integrations.map(i => i.id === integration.id ? {...i, status: 'available', connectedAt: null, syncStatus: null} : i));
                                    toast.success(`${integration.name} disconnected`);
                                  }}>
                                    <X className="w-4 h-4 mr-1" />
                                    Disconnect
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 text-slate-500">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                              <Link2 className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="font-medium mb-1">No integrations connected</p>
                            <p className="text-sm">Connect services below to get started</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Available Integrations */}
                            <Card className="border-slate-200">
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <Plus className="w-4 h-4 text-slate-600" />
                                  </div>
                                  Available Integrations
                                </CardTitle>
                                <CardDescription>Connect more services to enhance your workflow</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                  {integrations.filter(i => i.status === 'available' && (integrationFilter === 'all' || i.category === integrationFilter)).map((integration) => (
                                    <div key={integration.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-white hover:border-lime-300 hover:shadow-sm transition-all">
                                      <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl border border-slate-200">
                                          {integration.icon}
                                        </div>
                                        <div>
                                          <p className="font-semibold text-slate-900">{integration.name}</p>
                                          <p className="text-sm text-slate-500">{integration.desc}</p>
                                          <Badge variant="outline" className="mt-1 text-xs">{integration.category}</Badge>
                                        </div>
                                      </div>
                                      <Button className="bg-lime-600 hover:bg-lime-700 shrink-0" onClick={() => {
                                        setIntegrations(integrations.map(i => i.id === integration.id ? {...i, status: 'connected', connectedAt: new Date().toISOString().split('T')[0], syncStatus: 'synced'} : i));
                                        toast.success(`${integration.name} connected successfully`);
                                      }}>
                                        <Plus className="w-4 h-4 mr-1" />
                                        Connect
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                                {integrations.filter(i => i.status === 'available' && (integrationFilter === 'all' || i.category === integrationFilter)).length === 0 && (
                                  <div className="text-center py-8 text-slate-500">
                                    <p>No available integrations in this category</p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>

                            {/* Sync Monitoring Dashboard */}
                            {integrations.filter(i => i.status === 'connected').length > 0 && (
                              <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                  <Activity className="w-5 h-5 text-slate-500" />
                                  Integration Monitoring
                                </h3>
                                <IntegrationMonitorDashboard integrations={integrations.filter(i => i.status === 'connected')} />
                              </div>
                            )}
                          </div>

                  {/* Configure Integration Modal */}
                  <Dialog open={!!configureIntegration} onOpenChange={() => setConfigureIntegration(null)}>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl">
                            {configureIntegration?.icon}
                          </div>
                          <div>
                            <p>Configure {configureIntegration?.name}</p>
                            <p className="text-sm font-normal text-slate-500">{configureIntegration?.category}</p>
                          </div>
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-2">
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-emerald-700">Sync Status</span>
                            <Badge className="bg-emerald-100 text-emerald-700">
                              <Check className="w-3 h-3 mr-1" />Synced
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-emerald-600">Last Sync</span>
                            <span className="text-emerald-700 font-medium">Just now</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>API Key (Optional)</Label>
                          <Input placeholder="Enter API key if required" className="bg-slate-50" />
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div>
                              <p className="font-medium text-sm">Auto Sync</p>
                              <p className="text-xs text-slate-500">Automatically sync data every hour</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div>
                              <p className="font-medium text-sm">Notifications</p>
                              <p className="text-xs text-slate-500">Receive alerts for sync issues</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div>
                              <p className="font-medium text-sm">Two-way Sync</p>
                              <p className="text-xs text-slate-500">Sync changes back to the service</p>
                            </div>
                            <Switch />
                          </div>
                        </div>
                      </div>
                      <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setConfigureIntegration(null)}>Cancel</Button>
                        <Button className="bg-lime-600 hover:bg-lime-700" onClick={() => {
                          toast.success('Integration settings saved successfully');
                          setConfigureIntegration(null);
                        }}>
                          <Save className="w-4 h-4 mr-2" />Save Settings
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TabsContent>

                {/* Quotes Tab */}
                <TabsContent value="quotes">
                  <div className="space-y-6">
                    {/* Quote Numbering & Format */}
                    <Card className="border-slate-200">
                      <CardHeader>
                        <CardTitle>Quote Numbering & Format</CardTitle>
                        <CardDescription>Configure how quotations are numbered (e.g., 25111001 = YY + MM + Serial)</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Preview */}
                        <div className="p-4 bg-gradient-to-r from-lime-50 to-emerald-50 border border-lime-200 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-slate-600">Preview Quote Number</p>
                              <p className="text-2xl font-bold text-slate-900 font-mono">{generatePreviewNumber()}</p>
                            </div>
                            <div className="text-right text-sm text-slate-500">
                              <p>Format: {quoteSettings.formatType === 'date-serial' ? 'YY + MM + Serial' : 'Prefix + Serial'}</p>
                              <p>Next: #{quoteSettings.currentSerial}</p>
                            </div>
                          </div>
                        </div>

                        {/* Format Type */}
                        <div className="space-y-2">
                          <Label>Numbering Format</Label>
                          <Select value={quoteSettings.formatType} onValueChange={(v) => { setQuoteSettings({...quoteSettings, formatType: v}); setQuoteSettingsSaved(false); }}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="date-serial">Date + Serial (e.g., 25111001)</SelectItem>
                              <SelectItem value="prefix-serial">Prefix + Serial (e.g., QT-1001)</SelectItem>
                              <SelectItem value="custom">Custom (Prefix + Date + Serial)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {(quoteSettings.formatType === 'prefix-serial' || quoteSettings.formatType === 'custom') && (
                            <div className="space-y-2">
                              <Label>Quote Prefix</Label>
                              <Input 
                                value={quoteSettings.prefix} 
                                onChange={(e) => { setQuoteSettings({...quoteSettings, prefix: e.target.value}); setQuoteSettingsSaved(false); }}
                                placeholder="QT-"
                              />
                            </div>
                          )}
                          {(quoteSettings.formatType === 'date-serial' || quoteSettings.formatType === 'custom') && (
                            <>
                              <div className="space-y-2">
                                <Label>Year Format</Label>
                                <Select value={quoteSettings.yearFormat} onValueChange={(v) => { setQuoteSettings({...quoteSettings, yearFormat: v}); setQuoteSettingsSaved(false); }}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="2-digit">2-Digit (25)</SelectItem>
                                    <SelectItem value="4-digit">4-Digit (2025)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Include Month</Label>
                                <Select value={quoteSettings.includeMonth ? 'yes' : 'no'} onValueChange={(v) => { setQuoteSettings({...quoteSettings, includeMonth: v === 'yes'}); setQuoteSettingsSaved(false); }}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="yes">Yes (e.g., 2511)</SelectItem>
                                    <SelectItem value="no">No (e.g., 25)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </>
                          )}
                          <div className="space-y-2">
                            <Label>Serial Digits</Label>
                            <Select value={String(quoteSettings.serialDigits)} onValueChange={(v) => { setQuoteSettings({...quoteSettings, serialDigits: parseInt(v)}); setQuoteSettingsSaved(false); }}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="3">3 digits (001)</SelectItem>
                                <SelectItem value="4">4 digits (0001)</SelectItem>
                                <SelectItem value="5">5 digits (00001)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Current Serial</Label>
                            <Input 
                              type="number"
                              value={quoteSettings.currentSerial} 
                              onChange={(e) => { setQuoteSettings({...quoteSettings, currentSerial: parseInt(e.target.value) || 1}); setQuoteSettingsSaved(false); }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                              <p className="font-medium text-slate-900 text-sm">Reset Serial Monthly</p>
                              <p className="text-xs text-slate-500">Start from 1 each month</p>
                            </div>
                            <Switch 
                              checked={quoteSettings.resetSerialMonthly}
                              onCheckedChange={(c) => { setQuoteSettings({...quoteSettings, resetSerialMonthly: c, resetSerialYearly: c ? false : quoteSettings.resetSerialYearly}); setQuoteSettingsSaved(false); }}
                            />
                          </div>
                          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                              <p className="font-medium text-slate-900 text-sm">Reset Serial Yearly</p>
                              <p className="text-xs text-slate-500">Start from 1 each year</p>
                            </div>
                            <Switch 
                              checked={quoteSettings.resetSerialYearly}
                              onCheckedChange={(c) => { setQuoteSettings({...quoteSettings, resetSerialYearly: c, resetSerialMonthly: c ? false : quoteSettings.resetSerialMonthly}); setQuoteSettingsSaved(false); }}
                            />
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                              <Label>Default Validity (days)</Label>
                              <Input 
                                type="number"
                                value={quoteSettings.defaultValidity} 
                                onChange={(e) => { setQuoteSettings({...quoteSettings, defaultValidity: parseInt(e.target.value)}); setQuoteSettingsSaved(false); }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Default Currency</Label>
                              <Select value={quoteSettings.defaultCurrency} onValueChange={(v) => { setQuoteSettings({...quoteSettings, defaultCurrency: v}); setQuoteSettingsSaved(false); }}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="SGD">SGD - Singapore Dollar</SelectItem>
                                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                                  <SelectItem value="MYR">MYR - Malaysian Ringgit</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Tax Rate (%)</Label>
                              <Input 
                                type="number"
                                value={quoteSettings.taxRate} 
                                onChange={(e) => { setQuoteSettings({...quoteSettings, taxRate: parseFloat(e.target.value)}); setQuoteSettingsSaved(false); }}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Tax Label</Label>
                              <Input 
                                value={quoteSettings.taxLabel} 
                                onChange={(e) => { setQuoteSettings({...quoteSettings, taxLabel: e.target.value}); setQuoteSettingsSaved(false); }}
                                placeholder="GST"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Default Payment Terms</Label>
                          <Select value={quoteSettings.defaultPaymentTerms} onValueChange={(v) => { setQuoteSettings({...quoteSettings, defaultPaymentTerms: v}); setQuoteSettingsSaved(false); }}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Cash On Delivery">Cash On Delivery (C.O.D.)</SelectItem>
                              <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                              <SelectItem value="Net 7">Net 7</SelectItem>
                              <SelectItem value="Net 14">Net 14</SelectItem>
                              <SelectItem value="Net 30">Net 30</SelectItem>
                              <SelectItem value="Net 45">Net 45</SelectItem>
                              <SelectItem value="Net 60">Net 60</SelectItem>
                              <SelectItem value="Net 90">Net 90</SelectItem>
                              <SelectItem value="50% Deposit">50% Deposit, Balance on Delivery</SelectItem>
                              <SelectItem value="30% Deposit">30% Deposit, 70% on Completion</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                          <div>
                            <p className="font-medium text-slate-900">Auto Numbering</p>
                            <p className="text-sm text-slate-500">Automatically generate quote numbers</p>
                          </div>
                          <Switch 
                            checked={quoteSettings.autoNumbering}
                            onCheckedChange={(c) => { setQuoteSettings({...quoteSettings, autoNumbering: c}); setQuoteSettingsSaved(false); }}
                          />
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Button 
                            className="bg-lime-600 hover:bg-lime-700" 
                            disabled={savingQuoteSettings || quoteSettingsSaved}
                            onClick={async () => {
                              setSavingQuoteSettings(true);
                              try {
                                await saveSettingsMutation.mutateAsync({
                                  settings: {
                                    ...currentUser?.settings,
                                    quoteSettings: quoteSettings
                                  }
                                });
                                setQuoteSettingsSaved(true);
                                toast.success('Quote numbering settings saved');
                              } catch (error) {
                                toast.error('Failed to save quote settings');
                              }
                              setSavingQuoteSettings(false);
                            }}
                          >
                            {savingQuoteSettings ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><Save className="w-4 h-4 mr-2" />Save Numbering Settings</>}
                          </Button>
                          {quoteSettingsSaved && <Badge className="bg-emerald-100 text-emerald-700"><Check className="w-3 h-3 mr-1" />Saved</Badge>}
                          {!quoteSettingsSaved && <Badge className="bg-amber-100 text-amber-700">Unsaved changes</Badge>}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quote Display Options */}
                    <Card className="border-slate-200">
                      <CardHeader>
                        <CardTitle>Display Options</CardTitle>
                        <CardDescription>Configure what appears on your quotations</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {[
                          { key: 'showCompanyLogo', label: 'Show Company Logo', desc: 'Display your company logo on quotes' },
                          { key: 'showSignatureLine', label: 'Show Signature Line', desc: 'Include a signature line for acceptance' },
                          { key: 'showBankDetails', label: 'Show Bank Details', desc: 'Display payment bank details on quotes' },
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div>
                              <p className="font-medium text-slate-900">{item.label}</p>
                              <p className="text-sm text-slate-500">{item.desc}</p>
                            </div>
                            <Switch 
                              checked={quoteSettings[item.key]}
                              onCheckedChange={(c) => {
                                setQuoteSettings({...quoteSettings, [item.key]: c});
                                setDisplayOptionsSaved(false);
                              }}
                            />
                          </div>
                        ))}
                        <div className="flex items-center gap-3 mt-4">
                          <Button 
                            className="bg-lime-600 hover:bg-lime-700" 
                            disabled={savingDisplayOptions || displayOptionsSaved}
                            onClick={async () => {
                              setSavingDisplayOptions(true);
                              try {
                                await saveSettingsMutation.mutateAsync({
                                  settings: {
                                    ...currentUser?.settings,
                                    quoteSettings: {
                                      ...currentUser?.settings?.quoteSettings,
                                      showCompanyLogo: quoteSettings.showCompanyLogo,
                                      showSignatureLine: quoteSettings.showSignatureLine,
                                      showBankDetails: quoteSettings.showBankDetails
                                    }
                                  }
                                });
                                setDisplayOptionsSaved(true);
                                toast.success('Display options saved');
                              } catch (error) {
                                toast.error('Failed to save display options');
                              }
                              setSavingDisplayOptions(false);
                            }}
                          >
                            {savingDisplayOptions ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><Save className="w-4 h-4 mr-2" />Save Display Options</>}
                          </Button>
                          {displayOptionsSaved && <Badge className="bg-emerald-100 text-emerald-700"><Check className="w-3 h-3 mr-1" />Saved</Badge>}
                          {!displayOptionsSaved && <Badge className="bg-amber-100 text-amber-700">Unsaved changes</Badge>}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quote Templates */}
                    <Card className="border-slate-200">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Quote Templates</CardTitle>
                            <CardDescription>Manage your quotation templates with logo, company details, and layout</CardDescription>
                          </div>
                          <Button onClick={() => openTemplateEditor(null)} className="bg-lime-600 hover:bg-lime-700">
                            <Plus className="w-4 h-4 mr-2" />
                            New Template
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {quoteTemplates.map((template) => (
                          <div key={template.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border-2 border-slate-200">
                                <FileText className="w-6 h-6 text-slate-500" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-slate-900">{template.name}</p>
                                  {template.isDefault && <Badge className="bg-lime-100 text-lime-700">Default</Badge>}
                                </div>
                                <p className="text-sm text-slate-500">{template.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {!template.isDefault && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button size="sm" variant="ghost" onClick={() => handleSetDefault(template.id)}>
                                      <span className="text-xs text-slate-500">Set Default</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Set as default template</TooltipContent>
                                </Tooltip>
                              )}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button size="sm" variant="ghost" onClick={() => openTemplateEditor(template)}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit template (logo, company info, layout)</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button size="sm" variant="ghost" onClick={() => handleDuplicateTemplate(template)}>
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Duplicate template</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="text-red-500 hover:text-red-600"
                                    onClick={() => template.isDefault ? toast.error('Cannot delete default template') : handleDeleteTemplate(template.id)}
                                    disabled={template.isDefault}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>{template.isDefault ? 'Cannot delete default' : 'Delete template'}</TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        ))}

                        {quoteTemplates.length === 0 && (
                          <div className="text-center py-8 text-slate-500">
                            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                            <p>No templates yet. Create your first template.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Template Editor Modal */}
                    <QuoteTemplateEditor
                      templates={quoteTemplates}
                      setTemplates={setQuoteTemplates}
                      open={templateEditorOpen}
                      onClose={() => { setTemplateEditorOpen(false); setEditingTemplate(null); }}
                      editingTemplate={editingTemplate}
                    />

                    {/* Footer & Terms */}
                    <Card className="border-slate-200">
                      <CardHeader>
                        <CardTitle>Footer & Terms</CardTitle>
                        <CardDescription>Default text for quotations</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Footer Text</Label>
                          <Textarea 
                            value={quoteSettings.footerText}
                            onChange={(e) => { setQuoteSettings({...quoteSettings, footerText: e.target.value}); setFooterTermsSaved(false); }}
                            rows={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Terms & Conditions</Label>
                          <Textarea 
                            value={quoteSettings.termsAndConditions}
                            onChange={(e) => { setQuoteSettings({...quoteSettings, termsAndConditions: e.target.value}); setFooterTermsSaved(false); }}
                            rows={4}
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <Button 
                            className="bg-lime-600 hover:bg-lime-700" 
                            disabled={savingFooterTerms || footerTermsSaved}
                            onClick={async () => {
                              setSavingFooterTerms(true);
                              try {
                                await saveSettingsMutation.mutateAsync({
                                  settings: {
                                    ...currentUser?.settings,
                                    quoteSettings: {
                                      ...currentUser?.settings?.quoteSettings,
                                      footerText: quoteSettings.footerText,
                                      termsAndConditions: quoteSettings.termsAndConditions
                                    }
                                  }
                                });
                                setFooterTermsSaved(true);
                                toast.success('Footer & terms saved');
                              } catch (error) {
                                toast.error('Failed to save footer & terms');
                              }
                              setSavingFooterTerms(false);
                            }}
                          >
                            {savingFooterTerms ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><Save className="w-4 h-4 mr-2" />Save Footer & Terms</>}
                          </Button>
                          {footerTermsSaved && <Badge className="bg-emerald-100 text-emerald-700"><Check className="w-3 h-3 mr-1" />Saved</Badge>}
                          {!footerTermsSaved && <Badge className="bg-amber-100 text-amber-700">Unsaved changes</Badge>}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </TooltipProvider>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </div>
  );
}