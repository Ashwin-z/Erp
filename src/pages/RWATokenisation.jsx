import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import {
  Coins, ArrowLeft, Plus, FileText, CheckCircle2, Clock, AlertTriangle,
  Blocks, Lock, Eye, Edit, Trash2, ArrowRight, Upload, Building2,
  Landmark, CreditCard, Package, Layers, Zap, Shield, Hash
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import RWALifecycleManager from '@/components/rwa/RWALifecycleManager';
import { toast } from 'sonner';

const tokenisedAssets = [
  { id: 'TKN-001', name: 'Invoice Pool Nov-2024', type: 'invoice', totalValue: 500000, tokenSupply: 50000, tokenPrice: 10, status: 'active', fractions: 50000, holders: 25, blockHash: '0x8f4a...3b2c' },
  { id: 'TKN-002', name: 'Trade Receivables Q4', type: 'receivable', totalValue: 750000, tokenSupply: 75000, tokenPrice: 10, status: 'pending', fractions: 75000, holders: 0, blockHash: null },
  { id: 'TKN-003', name: 'Equipment Lease Bundle', type: 'lease', totalValue: 300000, tokenSupply: 30000, tokenPrice: 10, status: 'minting', fractions: 30000, holders: 0, blockHash: null },
  { id: 'TKN-004', name: 'SME Loan Portfolio A', type: 'loan', totalValue: 1000000, tokenSupply: 100000, tokenPrice: 10, status: 'active', fractions: 100000, holders: 42, blockHash: '0x7e3d...9a1f' },
];

const lifecycleEvents = [
  { id: 1, tokenId: 'TKN-001', event: 'created', timestamp: '2024-11-01 09:00:00', actor: 'admin@company.com', details: 'Asset originated' },
  { id: 2, tokenId: 'TKN-001', event: 'minted', timestamp: '2024-11-01 10:30:00', actor: 'system', details: '50,000 tokens minted' },
  { id: 3, tokenId: 'TKN-001', event: 'distributed', timestamp: '2024-11-02 14:00:00', actor: 'system', details: 'Tokens distributed to 25 investors' },
  { id: 4, tokenId: 'TKN-001', event: 'yield_paid', timestamp: '2024-11-25 09:00:00', actor: 'system', details: '$4,166.67 yield distributed' },
];

const assetTypes = [
  { value: 'invoice', label: 'Invoice', icon: FileText, description: 'Trade invoices and receivables' },
  { value: 'receivable', label: 'Receivable', icon: CreditCard, description: 'Accounts receivable' },
  { value: 'loan', label: 'Loan', icon: Landmark, description: 'Business loans and credit facilities' },
  { value: 'lease', label: 'Lease', icon: Building2, description: 'Equipment and property leases' },
  { value: 'inventory', label: 'Inventory', icon: Package, description: 'Inventory financing' },
];

const statusConfig = {
  active: { color: 'bg-emerald-500/20 text-emerald-400', icon: CheckCircle2 },
  pending: { color: 'bg-amber-500/20 text-amber-400', icon: Clock },
  minting: { color: 'bg-blue-500/20 text-blue-400', icon: Zap },
  expired: { color: 'bg-slate-500/20 text-slate-400', icon: AlertTriangle },
};

export default function RWATokenisation() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [mintModal, setMintModal] = useState(false);
  const [mintStep, setMintStep] = useState(0);
  const [newToken, setNewToken] = useState({
    name: '', type: 'invoice', totalValue: '', tokenPrice: 10, fractionalise: true, minFraction: 1, documents: []
  });

  const mintSteps = ['Asset Details', 'Tokenomics', 'Documentation', 'Review & Mint'];

  const handleMint = () => {
    toast.success('Token minting initiated - tracking on blockchain');
    setMintModal(false);
    setMintStep(0);
  };

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div className="max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Link to={createPageUrl('RWADashboard')}>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <Coins className="w-6 h-6 text-white" />
                    </div>
                    RWA Tokenisation
                  </h1>
                  <p className="text-slate-400 mt-1">Mint and manage tokenised real-world assets</p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500" onClick={() => setMintModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Mint New Token
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Coins className="w-5 h-5 text-amber-400" />
                    <span className="text-slate-400 text-sm">Total Tokenised</span>
                  </div>
                  <p className="text-2xl font-bold text-white">${tokenisedAssets.reduce((a, b) => a + b.totalValue, 0).toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="w-5 h-5 text-violet-400" />
                    <span className="text-slate-400 text-sm">Token Supply</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{tokenisedAssets.reduce((a, b) => a + b.tokenSupply, 0).toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-5 h-5 text-cyan-400" />
                    <span className="text-slate-400 text-sm">Active Assets</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{tokenisedAssets.filter(a => a.status === 'active').length}</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Blocks className="w-5 h-5 text-emerald-400" />
                    <span className="text-slate-400 text-sm">On-Chain</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{tokenisedAssets.filter(a => a.blockHash).length}</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="assets">
              <TabsList className="bg-slate-800/50 border-slate-700 mb-6">
                <TabsTrigger value="assets"><Coins className="w-4 h-4 mr-2" />Tokenised Assets</TabsTrigger>
                <TabsTrigger value="lifecycle"><Clock className="w-4 h-4 mr-2" />Lifecycle Events</TabsTrigger>
              </TabsList>

              {/* Assets Tab */}
              <TabsContent value="assets">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-800 hover:bg-transparent">
                          <TableHead className="text-slate-400">Token</TableHead>
                          <TableHead className="text-slate-400 text-right">Total Value</TableHead>
                          <TableHead className="text-slate-400 text-center">Supply</TableHead>
                          <TableHead className="text-slate-400 text-center">Price</TableHead>
                          <TableHead className="text-slate-400 text-center">Holders</TableHead>
                          <TableHead className="text-slate-400">Status</TableHead>
                          <TableHead className="text-slate-400">Blockchain</TableHead>
                          <TableHead className="text-slate-400"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tokenisedAssets.map((asset) => {
                          const status = statusConfig[asset.status];
                          const StatusIcon = status.icon;
                          return (
                            <TableRow key={asset.id} className="border-slate-800 hover:bg-slate-800/50">
                              <TableCell>
                                <div>
                                  <p className="text-white font-medium">{asset.name}</p>
                                  <p className="text-slate-500 text-xs">{asset.id} • {asset.type}</p>
                                </div>
                              </TableCell>
                              <TableCell className="text-right text-white font-medium">${asset.totalValue.toLocaleString()}</TableCell>
                              <TableCell className="text-center text-slate-300">{asset.tokenSupply.toLocaleString()}</TableCell>
                              <TableCell className="text-center text-slate-300">${asset.tokenPrice}</TableCell>
                              <TableCell className="text-center text-slate-300">{asset.holders}</TableCell>
                              <TableCell>
                                <Badge className={status.color}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {asset.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {asset.blockHash ? (
                                  <span className="text-cyan-400 font-mono text-sm">{asset.blockHash}</span>
                                ) : (
                                  <span className="text-slate-500">-</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" className="text-slate-400">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Lifecycle Tab */}
              <TabsContent value="lifecycle">
                  <RWALifecycleManager />
              </TabsContent>
            </Tabs>

            {/* Mint Modal */}
            <Dialog open={mintModal} onOpenChange={setMintModal}>
              <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-amber-400" />
                    Mint New Token
                  </DialogTitle>
                </DialogHeader>

                {/* Steps */}
                <div className="flex items-center justify-between mb-6 pt-4">
                  {mintSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        idx < mintStep ? 'bg-emerald-500 text-white' :
                        idx === mintStep ? 'bg-amber-500 text-white' :
                        'bg-slate-700 text-slate-400'
                      }`}>
                        {idx < mintStep ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>
                      {idx < mintSteps.length - 1 && (
                        <div className={`w-16 h-0.5 mx-2 ${idx < mintStep ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Step Content */}
                {mintStep === 0 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Asset Name</Label>
                      <Input 
                        placeholder="e.g., Invoice Pool Dec-2024"
                        className="bg-slate-800 border-slate-700"
                        value={newToken.name}
                        onChange={(e) => setNewToken({ ...newToken, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Asset Type</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {assetTypes.map((type) => {
                          const TypeIcon = type.icon;
                          return (
                            <div
                              key={type.value}
                              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                newToken.type === type.value 
                                  ? 'border-amber-500 bg-amber-500/10' 
                                  : 'border-slate-700 hover:border-slate-600'
                              }`}
                              onClick={() => setNewToken({ ...newToken, type: type.value })}
                            >
                              <div className="flex items-center gap-2">
                                <TypeIcon className={`w-5 h-5 ${newToken.type === type.value ? 'text-amber-400' : 'text-slate-400'}`} />
                                <span className="text-white font-medium">{type.label}</span>
                              </div>
                              <p className="text-slate-500 text-xs mt-1">{type.description}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Total Asset Value (SGD)</Label>
                      <Input 
                        type="number"
                        placeholder="500000"
                        className="bg-slate-800 border-slate-700"
                        value={newToken.totalValue}
                        onChange={(e) => setNewToken({ ...newToken, totalValue: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {mintStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Token Price (SGD)</Label>
                        <Input 
                          type="number"
                          className="bg-slate-800 border-slate-700"
                          value={newToken.tokenPrice}
                          onChange={(e) => setNewToken({ ...newToken, tokenPrice: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Token Supply</Label>
                        <Input 
                          type="number"
                          className="bg-slate-800 border-slate-700"
                          value={newToken.totalValue ? Math.floor(parseFloat(newToken.totalValue) / newToken.tokenPrice) : 0}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-4">
                      <div>
                        <p className="text-white font-medium">Enable Fractionalisation</p>
                        <p className="text-slate-500 text-sm">Allow investors to purchase partial tokens</p>
                      </div>
                      <Switch checked={newToken.fractionalise} onCheckedChange={(c) => setNewToken({ ...newToken, fractionalise: c })} />
                    </div>
                    {newToken.fractionalise && (
                      <div className="space-y-2">
                        <Label>Minimum Fraction Size</Label>
                        <Select value={newToken.minFraction.toString()} onValueChange={(v) => setNewToken({ ...newToken, minFraction: parseInt(v) })}>
                          <SelectTrigger className="bg-slate-800 border-slate-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="1">1 token ($10)</SelectItem>
                            <SelectItem value="10">10 tokens ($100)</SelectItem>
                            <SelectItem value="100">100 tokens ($1,000)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}

                {mintStep === 2 && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center">
                      <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                      <p className="text-white font-medium mb-2">Upload Supporting Documents</p>
                      <p className="text-slate-500 text-sm mb-4">Invoices, contracts, valuations, etc.</p>
                      <Button variant="outline" className="border-slate-600">
                        <Upload className="w-4 h-4 mr-2" />
                        Browse Files
                      </Button>
                    </div>
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-amber-400" />
                                <h4 className="text-white font-medium text-sm">AI Document Extraction</h4>
                            </div>
                            <Badge className="bg-emerald-500/20 text-emerald-400">Analysis Complete</Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-900/50 rounded border border-slate-800">
                                <p className="text-slate-500 text-[10px] uppercase mb-1">Valuation Value</p>
                                <p className="text-white font-bold">$500,000.00</p>
                                <p className="text-emerald-400 text-[10px] flex items-center mt-1"><CheckCircle2 className="w-3 h-3 mr-1" /> Confidence: 99%</p>
                            </div>
                            <div className="p-3 bg-slate-900/50 rounded border border-slate-800">
                                <p className="text-slate-500 text-[10px] uppercase mb-1">Legal Owner</p>
                                <p className="text-white font-bold">Acme Holdings Pte Ltd</p>
                                <p className="text-emerald-400 text-[10px] flex items-center mt-1"><CheckCircle2 className="w-3 h-3 mr-1" /> Confidence: 98%</p>
                            </div>
                            <div className="p-3 bg-slate-900/50 rounded border border-slate-800">
                                <p className="text-slate-500 text-[10px] uppercase mb-1">Liens / Encumbrances</p>
                                <p className="text-white font-bold">None Detected</p>
                            </div>
                            <div className="p-3 bg-slate-900/50 rounded border border-slate-800">
                                <p className="text-slate-500 text-[10px] uppercase mb-1">Risk Score</p>
                                <p className="text-emerald-400 font-bold">Low Risk (A+)</p>
                            </div>
                        </div>

                        
                        <div className="bg-slate-900/50 rounded border border-slate-800 p-3">
                            <p className="text-slate-400 text-xs font-medium mb-2 flex items-center gap-2">
                                <FileText className="w-3 h-3 text-slate-500" />
                                AI Executive Summary
                            </p>
                            <p className="text-slate-300 text-xs leading-relaxed">
                                The uploaded valuation report confirms a <span className="text-emerald-400 font-medium">Class A</span> asset status. 
                                Legal ownership is verified with <span className="text-white">Acme Holdings Pte Ltd</span> with no active liens found in public registries. 
                                The appraisal value of <span className="text-white">$500,000</span> aligns with current market benchmarks for this asset class.
                                Recommended LTV ratio: <span className="text-amber-400">75%</span>.
                            </p>
                        </div>

                        <div className="text-[10px] text-slate-500 flex items-center gap-2 pt-2 border-t border-slate-700/50">
                            <Globe className="w-3 h-3" />
                            Cross-referenced with ACRA & Local Property Index
                        </div>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                      <p className="text-blue-400 text-sm">Documents will be hashed and anchored to the blockchain for immutable audit trail.</p>
                    </div>
                  </div>
                )}

                {mintStep === 3 && (
                  <div className="space-y-4">
                    <div className="bg-slate-800/50 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Asset Name</span>
                        <span className="text-white">{newToken.name || 'Untitled'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Type</span>
                        <span className="text-white capitalize">{newToken.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Value</span>
                        <span className="text-white">${parseFloat(newToken.totalValue || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Token Supply</span>
                        <span className="text-white">{newToken.totalValue ? Math.floor(parseFloat(newToken.totalValue) / newToken.tokenPrice).toLocaleString() : 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Token Price</span>
                        <span className="text-white">${newToken.tokenPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Fractionalised</span>
                        <span className="text-white">{newToken.fractionalise ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                      <div>
                        <p className="text-emerald-400 font-medium">Ready to Mint</p>
                        <p className="text-slate-400 text-sm">Token will be created and anchored to blockchain</p>
                      </div>
                    </div>
                  </div>
                )}

                <DialogFooter className="mt-6">
                  {mintStep > 0 && (
                    <Button variant="outline" className="border-slate-700" onClick={() => setMintStep(mintStep - 1)}>
                      Back
                    </Button>
                  )}
                  {mintStep < mintSteps.length - 1 ? (
                    <Button className="bg-amber-500 hover:bg-amber-400" onClick={() => setMintStep(mintStep + 1)}>
                      Continue <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button className="bg-emerald-500 hover:bg-emerald-400" onClick={handleMint}>
                      <Coins className="w-4 h-4 mr-2" />
                      Mint Token
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
}