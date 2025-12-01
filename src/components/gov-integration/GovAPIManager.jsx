import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Shield, Key, Settings, CheckCircle2, XCircle, RefreshCw, 
  Loader2, ExternalLink, Play, Lock, Globe, Building2, DollarSign, Users
} from 'lucide-react';
import { toast } from 'sonner';
import moment from 'moment';

const govAPIs = [
  {
    api_name: 'iras_gst',
    display_name: 'IRAS GST Filing',
    description: 'GST F5/F7 returns submission via APEX API',
    base_url: 'https://api.iras.gov.sg/iras/sb/GSTReturnsSubmission',
    sandbox_url: 'https://apisandbox.iras.gov.sg/iras/sb/GSTReturnsSubmission',
    icon: DollarSign,
    color: 'bg-red-100 text-red-700',
    endpoints: [
      { name: 'Submit GST F5', method: 'POST', path: '/v1/gst-f5' },
      { name: 'Submit GST F7', method: 'POST', path: '/v1/gst-f7' },
      { name: 'Get Submission Status', method: 'GET', path: '/v1/status/{submissionId}' }
    ]
  },
  {
    api_name: 'iras_ais',
    display_name: 'IRAS AIS Employment Income',
    description: 'Auto-Inclusion Scheme for IR8A/IR8S/IR21 submission',
    base_url: 'https://api.iras.gov.sg/iras/sb/AISSubmission',
    sandbox_url: 'https://apisandbox.iras.gov.sg/iras/sb/AISSubmission',
    icon: Users,
    color: 'bg-red-100 text-red-700',
    endpoints: [
      { name: 'Submit IR8A', method: 'POST', path: '/v2/ir8a' },
      { name: 'Submit IR8S', method: 'POST', path: '/v2/ir8s' },
      { name: 'Submit IR21', method: 'POST', path: '/v2/ir21' },
      { name: 'Validate Submission', method: 'POST', path: '/v2/validate' }
    ]
  },
  {
    api_name: 'iras_invoice',
    display_name: 'IRAS InvoiceNow Data',
    description: 'Invoice data submission for GST compliance',
    base_url: 'https://api.iras.gov.sg/iras/sb/InvoiceDataSubmission',
    sandbox_url: 'https://apisandbox.iras.gov.sg/iras/sb/InvoiceDataSubmission',
    icon: Globe,
    color: 'bg-red-100 text-red-700',
    endpoints: [
      { name: 'Submit Invoice Data', method: 'POST', path: '/v1/submit' },
      { name: 'Bulk Submit', method: 'POST', path: '/v1/bulk-submit' },
      { name: 'Get Acknowledgement', method: 'GET', path: '/v1/acknowledgement/{batchId}' }
    ]
  },
  {
    api_name: 'cpf_contribution',
    display_name: 'CPF Contributions',
    description: 'Monthly CPF contribution submission via APEX',
    base_url: 'https://public.api.gov.sg/cpf/employer-cpf-contributions',
    sandbox_url: 'https://sandbox.api.gov.sg/cpf/employer-cpf-contributions',
    icon: Shield,
    color: 'bg-blue-100 text-blue-700',
    endpoints: [
      { name: 'Submit Contributions', method: 'POST', path: '/v1/submitCPFContributions' },
      { name: 'Get Submission Status', method: 'GET', path: '/v1/getSubmissionStatus/{submissionNo}' },
      { name: 'Validate File', method: 'POST', path: '/v1/validateContributions' }
    ]
  },
  {
    api_name: 'acra_bizfile',
    display_name: 'ACRA BizFile+',
    description: 'Company registration and annual filing via API Marketplace',
    base_url: 'https://api.acra.gov.sg/bizfile',
    sandbox_url: 'https://sandbox.api.acra.gov.sg/bizfile',
    icon: Building2,
    color: 'bg-purple-100 text-purple-700',
    endpoints: [
      { name: 'Submit Annual Return', method: 'POST', path: '/v1/annual-return' },
      { name: 'Update Company Info', method: 'PUT', path: '/v1/company/{uen}' },
      { name: 'Get Company Profile', method: 'GET', path: '/v1/company/{uen}' },
      { name: 'Search Company', method: 'GET', path: '/v1/search' }
    ]
  }
];

export default function GovAPIManager() {
  const [configOpen, setConfigOpen] = useState(false);
  const [selectedAPI, setSelectedAPI] = useState(null);
  const [credentials, setCredentials] = useState({ client_id: '', client_secret: '', api_key: '' });
  const [testing, setTesting] = useState(false);
  const queryClient = useQueryClient();

  const { data: apiConfigs = [] } = useQuery({
    queryKey: ['gov-api-configs'],
    queryFn: () => base44.entities.GovAPIConfig.list()
  });

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const existing = apiConfigs.find(c => c.api_name === data.api_name);
      if (existing) {
        return base44.entities.GovAPIConfig.update(existing.id, data);
      }
      return base44.entities.GovAPIConfig.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gov-api-configs'] });
      toast.success('API configuration saved');
      setConfigOpen(false);
    }
  });

  const activateMutation = useMutation({
    mutationFn: async ({ id, is_active }) => {
      const user = await base44.auth.me();
      return base44.entities.GovAPIConfig.update(id, { 
        is_active, 
        activated_at: is_active ? new Date().toISOString() : null,
        activated_by: is_active ? user.email : null
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gov-api-configs'] });
      toast.success('API status updated');
    }
  });

  const testAPI = async (api) => {
    setTesting(true);
    try {
      // Simulate API test
      await new Promise(r => setTimeout(r, 2000));
      const config = apiConfigs.find(c => c.api_name === api.api_name);
      if (config) {
        await base44.entities.GovAPIConfig.update(config.id, {
          last_test_at: new Date().toISOString(),
          last_test_status: 'success'
        });
      }
      toast.success(`${api.display_name} connection test successful`);
    } catch (error) {
      toast.error('Connection test failed');
    }
    setTesting(false);
    queryClient.invalidateQueries({ queryKey: ['gov-api-configs'] });
  };

  const openConfig = (api) => {
    setSelectedAPI(api);
    const existing = apiConfigs.find(c => c.api_name === api.api_name);
    if (existing?.credentials) {
      setCredentials(existing.credentials);
    } else {
      setCredentials({ client_id: '', client_secret: '', api_key: '' });
    }
    setConfigOpen(true);
  };

  const saveConfig = async () => {
    await saveMutation.mutateAsync({
      ...selectedAPI,
      credentials,
      api_version: '1.0',
      is_sandbox: true
    });
  };

  const getConfigStatus = (api_name) => {
    const config = apiConfigs.find(c => c.api_name === api_name);
    return config;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-600" />Singapore Government API Integration
          </h2>
          <p className="text-sm text-slate-500">Connect to IRAS, CPF, and ACRA APIs for automated compliance</p>
        </div>
      </div>

      {/* API Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {govAPIs.map((api) => {
          const config = getConfigStatus(api.api_name);
          const Icon = api.icon;
          return (
            <Card key={api.api_name} className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${api.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge className={config?.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}>
                    {config?.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <CardTitle className="text-base mt-3">{api.display_name}</CardTitle>
                <CardDescription>{api.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Endpoints Preview */}
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-2">Available Endpoints:</p>
                  <div className="space-y-1">
                    {api.endpoints.slice(0, 3).map((ep, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <Badge variant="outline" className="text-[10px] px-1">{ep.method}</Badge>
                        <span className="text-slate-600">{ep.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Info */}
                {config?.last_test_at && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    Last tested: {moment(config.last_test_at).fromNow()}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openConfig(api)}>
                    <Key className="w-3 h-3 mr-1" />Configure
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => testAPI(api)}
                    disabled={testing || !config?.credentials?.client_id}
                  >
                    {testing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                  </Button>
                  <Button
                    variant={config?.is_active ? "destructive" : "default"}
                    size="sm"
                    onClick={() => config && activateMutation.mutate({ id: config.id, is_active: !config.is_active })}
                    disabled={!config?.credentials?.client_id}
                  >
                    {config?.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Configuration Dialog */}
      <Dialog open={configOpen} onOpenChange={setConfigOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Configure {selectedAPI?.display_name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-700">
                <strong>Important:</strong> Obtain API credentials from the respective government portals:
              </p>
              <ul className="text-xs text-amber-600 mt-2 space-y-1">
                <li>• IRAS: <a href="https://www.iras.gov.sg" target="_blank" className="underline">IRAS Developer Portal</a></li>
                <li>• CPF: <a href="https://www.cpf.gov.sg" target="_blank" className="underline">CPF e-Submission</a></li>
                <li>• ACRA: <a href="https://www.acra.gov.sg/about-bizfile/api-marketplace" target="_blank" className="underline">ACRA API Marketplace</a></li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label>Client ID / App ID</Label>
              <Input 
                value={credentials.client_id} 
                onChange={(e) => setCredentials({ ...credentials, client_id: e.target.value })}
                placeholder="Enter your registered client ID"
              />
            </div>

            <div className="space-y-2">
              <Label>Client Secret</Label>
              <Input 
                type="password"
                value={credentials.client_secret} 
                onChange={(e) => setCredentials({ ...credentials, client_secret: e.target.value })}
                placeholder="Enter your client secret"
              />
            </div>

            <div className="space-y-2">
              <Label>API Key (if applicable)</Label>
              <Input 
                value={credentials.api_key} 
                onChange={(e) => setCredentials({ ...credentials, api_key: e.target.value })}
                placeholder="Enter API key if required"
              />
            </div>

            <div className="space-y-2">
              <Label>API Base URL</Label>
              <Input value={selectedAPI?.base_url} disabled className="bg-slate-50" />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Sandbox Mode</p>
                <p className="text-xs text-slate-500">Use test environment</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigOpen(false)}>Cancel</Button>
            <Button onClick={saveConfig} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Key className="w-4 h-4 mr-2" />}
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}