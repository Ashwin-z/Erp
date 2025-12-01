import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { StorageFactory } from './StorageAdapters';
import { Save, Database, Check, Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function DMSAdminSettings() {
  const queryClient = useQueryClient();
  const [connecting, setConnecting] = useState(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['dmsSettings'],
    queryFn: () => base44.entities.AIScanSettings.list(),
    initialData: []
  });

  const { data: storageConfigs } = useQuery({
      queryKey: ['storageConfigs'],
      queryFn: () => base44.entities.AIStorageConfig.list(),
      initialData: []
  });

  const connectProvider = async (provider) => {
      setConnecting(provider);
      try {
          const adapter = StorageFactory.getAdapter(provider);
          const authData = await adapter.connect();
          
          // Save Config
          await base44.entities.AIStorageConfig.create({
              provider: provider,
              connected_by: authData.email || 'Admin',
              last_sync: new Date().toISOString(),
              default_root_folder: '/',
              config: JSON.stringify(authData)
          });

          toast.success(`Connected to ${provider}`);
          queryClient.invalidateQueries(['storageConfigs']);
      } catch (error) {
          toast.error(`Failed to connect ${provider}: ${error.message}`);
      } finally {
          setConnecting(null);
      }
  };

  const disconnectProvider = async (id) => {
      await base44.entities.AIStorageConfig.delete(id);
      toast.success("Disconnected provider");
      queryClient.invalidateQueries(['storageConfigs']);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-lg font-semibold">DMS Administration</h2>
            <p className="text-sm text-slate-500">Configure storage providers, naming rules, and OCR defaults.</p>
        </div>
      </div>

      <Tabs defaultValue="storage">
        <TabsList>
            <TabsTrigger value="storage">Storage Providers</TabsTrigger>
            <TabsTrigger value="naming">Naming & Folders</TabsTrigger>
            <TabsTrigger value="ocr">OCR & AI</TabsTrigger>
        </TabsList>

        <TabsContent value="storage" className="space-y-4 mt-4">
            <div className="grid gap-4">
                {['Google Drive', 'Dropbox', 'OneDrive', 'S3'].map(provider => {
                    const config = storageConfigs.find(c => c.provider === provider);
                    const isConfigured = !!config;
                    
                    return (
                        <Card key={provider}>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${isConfigured ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                        <Database className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">{provider}</h4>
                                        <p className="text-xs text-slate-500">
                                            {isConfigured ? `Connected as ${config.connected_by}` : 'Not configured'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {isConfigured ? (
                                        <>
                                            <Button variant="outline" size="sm">
                                                <RefreshCw className="w-4 h-4 mr-2" /> Sync
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => disconnectProvider(config.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <Button 
                                            variant="default" 
                                            size="sm" 
                                            onClick={() => connectProvider(provider)}
                                            disabled={connecting === provider}
                                        >
                                            {connecting === provider ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Connect'}
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </TabsContent>

        <TabsContent value="naming" className="space-y-4 mt-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Auto-Naming Template</CardTitle>
                    <CardDescription>Define how files are renamed after scanning.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Template Pattern</Label>
                        <Input defaultValue="{YYYY}{MM}{DD}_{DocType}_{Vendor}_{Amount}" fontMono />
                        <p className="text-xs text-slate-500">
                            Available: {'{YYYY}, {MM}, {DD}, {DocType}, {Vendor}, {Amount}, {ShortHash}, {Keywords}, {Item}'}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="ocr" className="space-y-4 mt-4">
            <Card>
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Automatic Entity Mapping</Label>
                            <p className="text-xs text-slate-500">Suggest links to Contacts and Invoices automatically</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Handwriting Recognition</Label>
                            <p className="text-xs text-slate-500">Enable enhanced model for handwritten text</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                     <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Multi-language Support</Label>
                            <p className="text-xs text-slate-500">Auto-detect and translate foreign documents</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}