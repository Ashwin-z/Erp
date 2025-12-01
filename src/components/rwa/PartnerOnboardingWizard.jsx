import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Building2, Key, Webhook, BarChart3, CheckCircle2, ArrowRight, ArrowLeft,
  Copy, Eye, EyeOff, Info, Shield, Zap, CreditCard, Landmark, FileText,
  AlertTriangle, ExternalLink, BookOpen, Upload, Mail, Clock, Bell
} from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from "@/components/ui/progress";
import DocumentVerificationPanel from './DocumentVerificationPanel';

const partnerTypes = [
  { value: 'psp', label: 'Payment Service Provider', icon: CreditCard, description: 'Process payments and settlements', examples: 'Stripe, PayPal, DBS PayLah!' },
  { value: 'bank', label: 'Bank / Financial Institution', icon: Landmark, description: 'Banking services and transfers', examples: 'DBS, OCBC, UOB' },
  { value: 'custodian', label: 'Custodian', icon: Shield, description: 'Asset custody and safekeeping', examples: 'Fireblocks, HexTrust, BitGo' },
  { value: 'fintech', label: 'Fintech Partner', icon: Zap, description: 'Lending, credit, or other fintech services', examples: 'Funding Societies, Validus' },
];

const steps = [
  { id: 'type', title: 'Partner Type', icon: Building2, estimatedTime: 2 },
  { id: 'credentials', title: 'API Credentials', icon: Key, estimatedTime: 5 },
  { id: 'documents', title: 'Documents', icon: FileText, estimatedTime: 10 },
  { id: 'webhooks', title: 'Webhooks', icon: Webhook, estimatedTime: 3 },
  { id: 'metrics', title: 'Metrics Setup', icon: BarChart3, estimatedTime: 2 },
  { id: 'review', title: 'Review & Connect', icon: CheckCircle2, estimatedTime: 1 },
];

const emailNotifications = [
  { step: 1, trigger: 'api_pending', subject: 'Action Required: Complete API Configuration', message: 'Please configure your API credentials to continue partner setup.' },
  { step: 2, trigger: 'docs_pending', subject: 'Document Verification Required', message: 'Upload and verify compliance documents to proceed with onboarding.' },
  { step: 5, trigger: 'setup_complete', subject: 'Partner Integration Complete', message: 'Your partner integration has been successfully configured.' }
];

// Dynamic form fields based on partner type
const partnerFormFields = {
  psp: [
    { id: 'merchantId', label: 'Merchant ID', type: 'text', required: true },
    { id: 'settlementAccount', label: 'Settlement Account', type: 'text', required: true },
    { id: 'paymentMethods', label: 'Payment Methods', type: 'multiselect', options: ['Credit Card', 'Debit Card', 'PayNow', 'NETS', 'GrabPay'] },
    { id: 'settlementCycle', label: 'Settlement Cycle', type: 'select', options: ['T+0', 'T+1', 'T+2', 'Weekly'] }
  ],
  bank: [
    { id: 'bankCode', label: 'Bank Code', type: 'text', required: true },
    { id: 'branchCode', label: 'Branch Code', type: 'text', required: true },
    { id: 'accountNumber', label: 'Account Number', type: 'text', required: true },
    { id: 'swiftCode', label: 'SWIFT Code', type: 'text', required: true },
    { id: 'services', label: 'Services', type: 'multiselect', options: ['FAST', 'GIRO', 'Wire Transfer', 'PayNow Corporate'] }
  ],
  custodian: [
    { id: 'custodyType', label: 'Custody Type', type: 'select', options: ['Hot Wallet', 'Cold Storage', 'MPC', 'Multi-sig'], required: true },
    { id: 'assetTypes', label: 'Asset Types', type: 'multiselect', options: ['Fiat', 'Crypto', 'Securities', 'NFTs'] },
    { id: 'insuranceCoverage', label: 'Insurance Coverage (USD)', type: 'number', required: true },
    { id: 'auditFrequency', label: 'Audit Frequency', type: 'select', options: ['Monthly', 'Quarterly', 'Annually'] }
  ],
  fintech: [
    { id: 'licenseNumber', label: 'License Number', type: 'text', required: true },
    { id: 'productTypes', label: 'Product Types', type: 'multiselect', options: ['Invoice Financing', 'Working Capital', 'Trade Finance', 'Equipment Leasing'] },
    { id: 'maxFacilitySize', label: 'Max Facility Size (SGD)', type: 'number', required: true },
    { id: 'interestRateRange', label: 'Interest Rate Range', type: 'text', placeholder: 'e.g., 8%-18% p.a.' }
  ]
};

const webhookEvents = [
  { id: 'payment.completed', label: 'Payment Completed', description: 'When a payment is successfully processed' },
  { id: 'payment.failed', label: 'Payment Failed', description: 'When a payment attempt fails' },
  { id: 'settlement.completed', label: 'Settlement Completed', description: 'When funds are settled to your account' },
  { id: 'kyc.updated', label: 'KYC Status Updated', description: 'When customer verification status changes' },
  { id: 'payout.initiated', label: 'Payout Initiated', description: 'When a payout request is initiated' },
  { id: 'payout.completed', label: 'Payout Completed', description: 'When funds are successfully disbursed' },
];

export default function PartnerOnboardingWizard({ open, onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showApiKey, setShowApiKey] = useState(false);
  const [documentsVerified, setDocumentsVerified] = useState(false);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [notificationEmail, setNotificationEmail] = useState('');
  const [sentNotifications, setSentNotifications] = useState([]);
  const [config, setConfig] = useState({
    type: '',
    name: '',
    apiBaseUrl: '',
    apiKey: '',
    apiSecret: '',
    environment: 'sandbox',
    webhookUrl: 'https://api.arkfinex.com/webhooks/partner/',
    webhookSecret: '',
    webhookEvents: ['payment.completed', 'settlement.completed'],
    metrics: { trackLatency: true, trackVolume: true, trackErrors: true, alertThreshold: 5 },
    typeSpecificFields: {}
  });

  const currentFormFields = partnerFormFields[config.type] || [];

  // Calculate progress and time estimates
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;
  const remainingTime = steps.slice(currentStep).reduce((acc, step) => acc + step.estimatedTime, 0);
  const completedTime = steps.slice(0, currentStep).reduce((acc, step) => acc + step.estimatedTime, 0);
  const totalTime = steps.reduce((acc, step) => acc + step.estimatedTime, 0);

  // Send email notification
  const sendNotification = (trigger) => {
    if (!emailNotificationsEnabled || !notificationEmail || sentNotifications.includes(trigger)) return;
    const notification = emailNotifications.find(n => n.trigger === trigger);
    if (notification) {
      setSentNotifications(prev => [...prev, trigger]);
      toast.success(`Email notification sent: ${notification.subject}`);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleComplete = () => {
    sendNotification('setup_complete');
    toast.success('Partner integration configured successfully!');
    onComplete?.(config);
    onClose();
    setCurrentStep(0);
    setSentNotifications([]);
  };

  const nextStep = () => {
    const next = Math.min(currentStep + 1, steps.length - 1);
    setCurrentStep(next);
    // Trigger notifications based on step
    if (next === 1) sendNotification('api_pending');
    if (next === 2) sendNotification('docs_pending');
  };
  const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 0));

  const canProceed = () => {
    switch (currentStep) {
      case 0: return config.type && config.name;
      case 1: return config.apiKey && config.apiBaseUrl;
      case 2: return documentsVerified;
      case 3: return config.webhookEvents.length > 0;
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  };

  const updateTypeSpecificField = (fieldId, value) => {
    setConfig(prev => ({
      ...prev,
      typeSpecificFields: { ...prev.typeSpecificFields, [fieldId]: value }
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            Partner Onboarding Wizard
          </DialogTitle>
        </DialogHeader>

        {/* Enhanced Progress Tracker */}
        <div className="py-4 border-b border-slate-800 space-y-4">
          {/* Progress Bar with Time Estimate */}
          <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-slate-300 text-sm">Progress: Step {currentStep + 1} of {steps.length}</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-slate-500">~{remainingTime} min remaining</span>
                <span className="text-emerald-400">{Math.round(progressPercentage)}% complete</span>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-slate-700" />
            <div className="flex justify-between mt-2">
              <span className="text-slate-500 text-xs">{completedTime} min completed</span>
              <span className="text-slate-500 text-xs">Total: {totalTime} min</span>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex flex-col items-center ${idx <= currentStep ? 'text-white' : 'text-slate-500'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                      idx < currentStep ? 'bg-emerald-500' :
                      idx === currentStep ? 'bg-blue-500' :
                      'bg-slate-700'
                    }`}>
                      {idx < currentStep ? <CheckCircle2 className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                    </div>
                    <span className="text-xs">{step.title}</span>
                    <span className="text-[10px] text-slate-500">~{step.estimatedTime}min</span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-1 ${idx < currentStep ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Email Notifications Toggle */}
          <div className="flex items-center justify-between bg-slate-800/30 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300 text-sm">Email notifications for key steps</span>
            </div>
            <div className="flex items-center gap-3">
              {emailNotificationsEnabled && (
                <Input
                  placeholder="your@email.com"
                  className="bg-slate-800 border-slate-600 h-8 w-48 text-sm"
                  value={notificationEmail}
                  onChange={(e) => setNotificationEmail(e.target.value)}
                />
              )}
              <Switch 
                checked={emailNotificationsEnabled} 
                onCheckedChange={setEmailNotificationsEnabled}
              />
            </div>
          </div>
        </div>

        <div className="py-6 min-h-[400px]">
          {/* Step 1: Partner Type */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Select Partner Type</h3>
                <p className="text-slate-400 text-sm">Choose the type of partner you're integrating with</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {partnerTypes.map((type) => {
                  const TypeIcon = type.icon;
                  return (
                    <div
                      key={type.value}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        config.type === type.value 
                          ? 'border-blue-500 bg-blue-500/10' 
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                      onClick={() => setConfig({ ...config, type: type.value })}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          config.type === type.value ? 'bg-blue-500/20' : 'bg-slate-800'
                        }`}>
                          <TypeIcon className={`w-5 h-5 ${config.type === type.value ? 'text-blue-400' : 'text-slate-400'}`} />
                        </div>
                        <span className="text-white font-medium">{type.label}</span>
                      </div>
                      <p className="text-slate-400 text-sm mb-2">{type.description}</p>
                      <p className="text-slate-500 text-xs">e.g., {type.examples}</p>
                    </div>
                  );
                })}
              </div>
              {config.type && (
                <div className="space-y-2">
                  <Label>Partner Name</Label>
                  <Input 
                    placeholder="e.g., DBS PayLah! Business"
                    className="bg-slate-800 border-slate-700"
                    value={config.name}
                    onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 2: API Credentials with Dynamic Fields */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">API Configuration</h3>
                <p className="text-slate-400 text-sm">Enter your partner's API credentials and specific settings</p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-blue-400 font-medium">Best Practice</p>
                  <p className="text-slate-400 text-sm">Store API keys securely. Never commit them to version control. Use environment variables in production.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Environment</Label>
                  <Select value={config.environment} onValueChange={(v) => setConfig({ ...config, environment: v })}>
                    <SelectTrigger className="bg-slate-800 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>API Base URL</Label>
                  <Input 
                    placeholder="https://api.partner.com/v1"
                    className="bg-slate-800 border-slate-700 font-mono"
                    value={config.apiBaseUrl}
                    onChange={(e) => setConfig({ ...config, apiBaseUrl: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>API Key</Label>
                  <div className="flex gap-2">
                    <Input 
                      type={showApiKey ? 'text' : 'password'}
                      placeholder="sk_live_..."
                      className="bg-slate-800 border-slate-700 font-mono"
                      value={config.apiKey}
                      onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                    />
                    <Button variant="outline" size="icon" className="border-slate-700" onClick={() => setShowApiKey(!showApiKey)}>
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>API Secret (Optional)</Label>
                  <Input 
                    type="password"
                    placeholder="••••••••"
                    className="bg-slate-800 border-slate-700 font-mono"
                    value={config.apiSecret}
                    onChange={(e) => setConfig({ ...config, apiSecret: e.target.value })}
                  />
                </div>

                {/* Dynamic fields based on partner type */}
                {currentFormFields.length > 0 && (
                  <div className="border-t border-slate-700 pt-4 mt-4">
                    <p className="text-slate-300 font-medium mb-3">
                      {partnerTypes.find(t => t.value === config.type)?.label} Specific Settings
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      {currentFormFields.map((field) => (
                        <div key={field.id} className="space-y-2">
                          <Label>{field.label} {field.required && <span className="text-red-400">*</span>}</Label>
                          {field.type === 'text' && (
                            <Input
                              placeholder={field.placeholder || ''}
                              className="bg-slate-800 border-slate-700"
                              value={config.typeSpecificFields[field.id] || ''}
                              onChange={(e) => updateTypeSpecificField(field.id, e.target.value)}
                            />
                          )}
                          {field.type === 'number' && (
                            <Input
                              type="number"
                              className="bg-slate-800 border-slate-700"
                              value={config.typeSpecificFields[field.id] || ''}
                              onChange={(e) => updateTypeSpecificField(field.id, e.target.value)}
                            />
                          )}
                          {field.type === 'select' && (
                            <Select 
                              value={config.typeSpecificFields[field.id] || ''} 
                              onValueChange={(v) => updateTypeSpecificField(field.id, v)}
                            >
                              <SelectTrigger className="bg-slate-800 border-slate-700">
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-slate-700">
                                {field.options.map(opt => (
                                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          {field.type === 'multiselect' && (
                            <div className="flex flex-wrap gap-2">
                              {field.options.map(opt => {
                                const selected = (config.typeSpecificFields[field.id] || []).includes(opt);
                                return (
                                  <Badge
                                    key={opt}
                                    className={`cursor-pointer ${selected ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'}`}
                                    onClick={() => {
                                      const current = config.typeSpecificFields[field.id] || [];
                                      const updated = selected 
                                        ? current.filter(x => x !== opt)
                                        : [...current, opt];
                                      updateTypeSpecificField(field.id, updated);
                                    }}
                                  >
                                    {opt}
                                  </Badge>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Document Verification */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Compliance Documents</h3>
                <p className="text-slate-400 text-sm">Upload and verify required compliance documents</p>
              </div>
              <DocumentVerificationPanel 
                partnerType={config.type} 
                onVerificationComplete={() => setDocumentsVerified(true)}
              />
            </div>
          )}

          {/* Step 4: Webhooks */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Webhook Configuration</h3>
                <p className="text-slate-400 text-sm">Configure webhooks to receive real-time events</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Your Webhook Endpoint</Label>
                  <div className="flex gap-2">
                    <Input 
                      className="bg-slate-800 border-slate-700 font-mono"
                      value={config.webhookUrl + config.name.toLowerCase().replace(/\s+/g, '-')}
                      readOnly
                    />
                    <Button variant="outline" size="icon" className="border-slate-700" onClick={() => copyToClipboard(config.webhookUrl)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-slate-500 text-xs">Add this URL to your partner's webhook configuration</p>
                </div>

                <div className="space-y-2">
                  <Label>Webhook Secret (for signature verification)</Label>
                  <Input 
                    placeholder="whsec_..."
                    className="bg-slate-800 border-slate-700 font-mono"
                    value={config.webhookSecret}
                    onChange={(e) => setConfig({ ...config, webhookSecret: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Events to Subscribe</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {webhookEvents.map((event) => (
                      <div 
                        key={event.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          config.webhookEvents.includes(event.id)
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                        onClick={() => {
                          const events = config.webhookEvents.includes(event.id)
                            ? config.webhookEvents.filter(e => e !== event.id)
                            : [...config.webhookEvents, event.id];
                          setConfig({ ...config, webhookEvents: events });
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white text-sm font-medium">{event.label}</p>
                            <p className="text-slate-500 text-xs">{event.description}</p>
                          </div>
                          <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                            config.webhookEvents.includes(event.id) ? 'bg-blue-500 border-blue-500' : 'border-slate-600'
                          }`}>
                            {config.webhookEvents.includes(event.id) && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Metrics */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Performance Metrics</h3>
                <p className="text-slate-400 text-sm">Configure monitoring and alerting</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Track Latency</p>
                    <p className="text-slate-500 text-sm">Monitor API response times</p>
                  </div>
                  <Switch 
                    checked={config.metrics.trackLatency} 
                    onCheckedChange={(c) => setConfig({ ...config, metrics: { ...config.metrics, trackLatency: c } })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Track Transaction Volume</p>
                    <p className="text-slate-500 text-sm">Monitor throughput and volume metrics</p>
                  </div>
                  <Switch 
                    checked={config.metrics.trackVolume} 
                    onCheckedChange={(c) => setConfig({ ...config, metrics: { ...config.metrics, trackVolume: c } })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Track Error Rates</p>
                    <p className="text-slate-500 text-sm">Monitor and alert on API errors</p>
                  </div>
                  <Switch 
                    checked={config.metrics.trackErrors} 
                    onCheckedChange={(c) => setConfig({ ...config, metrics: { ...config.metrics, trackErrors: c } })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Error Rate Alert Threshold (%)</Label>
                  <Input 
                    type="number"
                    className="bg-slate-800 border-slate-700"
                    value={config.metrics.alertThreshold}
                    onChange={(e) => setConfig({ ...config, metrics: { ...config.metrics, alertThreshold: parseFloat(e.target.value) } })}
                  />
                  <p className="text-slate-500 text-xs">Alert when error rate exceeds this percentage</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Review Configuration</h3>
                <p className="text-slate-400 text-sm">Verify your settings before connecting</p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 space-y-4">
                <div className="flex justify-between border-b border-slate-700 pb-3">
                  <span className="text-slate-400">Partner Name</span>
                  <span className="text-white font-medium">{config.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-3">
                  <span className="text-slate-400">Type</span>
                  <Badge className="bg-blue-500/20 text-blue-400">{config.type}</Badge>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-3">
                  <span className="text-slate-400">Environment</span>
                  <Badge className={config.environment === 'production' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}>
                    {config.environment}
                  </Badge>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-3">
                  <span className="text-slate-400">API Base URL</span>
                  <span className="text-cyan-400 font-mono text-sm">{config.apiBaseUrl || '-'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700 pb-3">
                  <span className="text-slate-400">Webhook Events</span>
                  <span className="text-white">{config.webhookEvents.length} subscribed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Metrics Enabled</span>
                  <span className="text-white">
                    {[config.metrics.trackLatency && 'Latency', config.metrics.trackVolume && 'Volume', config.metrics.trackErrors && 'Errors'].filter(Boolean).join(', ')}
                  </span>
                </div>
              </div>

              {config.environment === 'production' && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <p className="text-amber-400 font-medium">Production Environment</p>
                    <p className="text-slate-400 text-sm">You're connecting to a production environment. Ensure all credentials are correct before proceeding.</p>
                  </div>
                </div>
              )}

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                <div>
                  <p className="text-emerald-400 font-medium">Ready to Connect</p>
                  <p className="text-slate-400 text-sm">All required fields are configured. Click "Connect Partner" to complete setup.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-slate-800 pt-4">
          {currentStep > 0 && (
            <Button variant="outline" className="border-slate-700" onClick={prevStep}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button className="bg-blue-500 hover:bg-blue-400" onClick={nextStep} disabled={!canProceed()}>
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button className="bg-emerald-500 hover:bg-emerald-400" onClick={handleComplete}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Connect Partner
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}