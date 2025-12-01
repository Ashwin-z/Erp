import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, CheckCircle2, FileText, Shield, DollarSign, 
  User, ArrowRight, Zap, Lock, Truck, PenTool,
  MessageSquare, Sparkles, CreditCard, ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from 'sonner';
import PageHeader from "@/components/shared/PageHeader";

// Mock Data for the Simulation
const DEAL_DATA = {
  customer: {
    name: "Marcus Sterling",
    email: "m.sterling@wealth.vc",
    netWorth: "$50M+",
    riskProfile: "Low",
    kycStatus: "Verified"
  },
  asset: {
    name: "Ferrari SF90 Stradale",
    vin: "ZFF90STR000123456",
    price: 1000000,
    currency: "USD",
    rwaTokenId: "0x71C...9A21",
    specs: "Rosso Corsa, Assetto Fiorano Package"
  }
};

const STEPS = [
  { id: 'lead', label: 'Lead & AI', icon: User },
  { id: 'rwa', label: 'RWA Digital Twin', icon: Shield },
  { id: 'finance', label: 'Finance & Invoice', icon: DollarSign },
  { id: 'legal', label: 'Legal & Contracts', icon: FileText },
  { id: 'delivery', label: 'Delivery & Handover', icon: Truck },
];

export default function HighValueDealFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [completedSteps, setCompletedSteps] = useState([]);

  const addLog = (message, type = 'info') => {
    setLogs(prev => [{ id: Date.now(), message, type, timestamp: new Date().toLocaleTimeString() }, ...prev]);
  };

  const handleNext = async () => {
    setProcessing(true);
    const stepId = STEPS[currentStep].id;

    // Simulate OS Processing
    addLog(`Initiating ${STEPS[currentStep].label} protocol...`, 'process');
    
    await new Promise(r => setTimeout(r, 1500));
    
    switch(stepId) {
      case 'lead':
        addLog("AI Agent analysis: High probability buyer detected (98%)", 'ai');
        addLog("KYC/AML Check passed: Global Watchlist Clear", 'success');
        addLog("Automated follow-up scheduled: 'Test Drive Confirmation'", 'info');
        break;
      case 'rwa':
        addLog(`Minting RWA NFT for VIN: ${DEAL_DATA.asset.vin}...`, 'process');
        addLog(`Blockchain Hash: ${DEAL_DATA.asset.rwaTokenId}`, 'success');
        addLog("Asset ownership locked on-chain. Provenance established.", 'info');
        break;
      case 'finance':
        addLog("Generating InvoiceNow e-invoice #INV-2025-001", 'process');
        addLog(`Payment Gateway initialized for $${DEAL_DATA.asset.price.toLocaleString()}`, 'info');
        addLog("Loan application documents auto-filled from CRM data", 'success');
        break;
      case 'legal':
        addLog("Smart Contract generating Sale & Purchase Agreement...", 'process');
        addLog("Insurance policy bound: Comprehensive Coverage ($1.2M)", 'success');
        addLog("Digital Signature request sent to Marcus Sterling", 'info');
        break;
      case 'delivery':
        addLog("Logistics partner notified: White Glove Delivery", 'process');
        addLog("GPS Tracker activated", 'info');
        addLog("Deal Closed! Commission calculated.", 'success');
        toast.success("Deal Successfully Closed!");
        break;
    }

    setCompletedSteps(prev => [...prev, currentStep]);
    setProcessing(false);
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const resetSimulation = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setLogs([]);
    addLog("Simulation initialized. Ready to process deal.", 'info');
  };

  useEffect(() => {
    addLog("OS Standby. Waiting for deal initialization...", 'info');
  }, []);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 h-[calc(100vh-2rem)] flex flex-col">
      <PageHeader 
        title="High-Value Asset Deal Flow" 
        subtitle="End-to-end OS Simulation: $1M Sports Car Transaction"
        icon={Car}
        iconColor="text-red-600"
        actions={
          <Button variant="outline" onClick={resetSimulation}>
            Reset Simulation
          </Button>
        }
      />

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Panel: Deal Visualizer */}
        <div className="col-span-8 flex flex-col gap-6 overflow-y-auto">
          {/* Progress Stepper */}
          <Card className="border-slate-200 bg-slate-50/50">
            <CardContent className="p-6">
              <div className="flex justify-between relative">
                {/* Connection Lines */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10" />
                
                {STEPS.map((step, index) => {
                  const isCompleted = completedSteps.includes(index);
                  const isCurrent = currentStep === index;
                  const Icon = step.icon;

                  return (
                    <div key={step.id} className="flex flex-col items-center gap-2 bg-transparent">
                      <motion.div 
                        initial={false}
                        animate={{
                          scale: isCurrent ? 1.1 : 1,
                          backgroundColor: isCompleted ? '#10b981' : isCurrent ? '#2563eb' : '#f1f5f9',
                          borderColor: isCurrent ? '#3b82f6' : 'transparent'
                        }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-500 z-10 ${isCompleted || isCurrent ? 'text-white shadow-lg' : 'text-slate-400'}`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                      </motion.div>
                      <span className={`text-xs font-medium ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-slate-400'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Active Stage View */}
          <div className="flex-1 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                {currentStep === 0 && <StageLead data={DEAL_DATA} onAction={handleNext} processing={processing} />}
                {currentStep === 1 && <StageRWA data={DEAL_DATA} onAction={handleNext} processing={processing} />}
                {currentStep === 2 && <StageFinance data={DEAL_DATA} onAction={handleNext} processing={processing} />}
                {currentStep === 3 && <StageLegal data={DEAL_DATA} onAction={handleNext} processing={processing} />}
                {currentStep === 4 && <StageDelivery data={DEAL_DATA} onAction={handleNext} processing={processing} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Panel: OS Data Stream */}
        <div className="col-span-4 flex flex-col gap-4 h-full">
          {/* Asset Card */}
          <Card className="bg-slate-900 text-white border-slate-800">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex justify-between items-center">
                {DEAL_DATA.asset.name}
                <Badge className="bg-red-600 text-white border-0">Live Deal</Badge>
              </CardTitle>
              <CardDescription className="text-slate-400 font-mono text-xs">
                VIN: {DEAL_DATA.asset.vin}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-slate-400">Deal Value</p>
                  <p className="text-2xl font-bold text-emerald-400">${DEAL_DATA.asset.price.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Buyer</p>
                  <p className="font-medium">{DEAL_DATA.customer.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Log */}
          <Card className="flex-1 bg-slate-950 border-slate-800 flex flex-col min-h-0">
            <CardHeader className="py-3 border-b border-slate-800 bg-slate-900/50">
              <CardTitle className="text-sm font-mono text-emerald-400 flex items-center gap-2">
                <Zap className="w-4 h-4" /> OS Kernel Stream
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
              {logs.length === 0 && (
                <div className="text-slate-600 italic text-center mt-10">System Ready. Waiting for events...</div>
              )}
              {logs.map((log) => (
                <div key={log.id} className="flex gap-3 animate-in fade-in slide-in-from-left-2">
                  <span className="text-slate-500 shrink-0">{log.timestamp}</span>
                  <span className={`
                    ${log.type === 'success' ? 'text-emerald-400' : ''}
                    ${log.type === 'process' ? 'text-blue-400' : ''}
                    ${log.type === 'ai' ? 'text-purple-400' : ''}
                    ${log.type === 'info' ? 'text-slate-300' : ''}
                  `}>
                    {log.type === 'ai' && <Sparkles className="w-3 h-3 inline mr-1" />}
                    {log.type === 'process' && <PenTool className="w-3 h-3 inline mr-1" />}
                    {log.message}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// --- Stage Components ---

function StageLead({ data, onAction, processing }) {
  return (
    <Card className="h-full border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-600">
          <User className="w-6 h-6" /> Stage 1: Lead Acquisition & AI Profiling
        </CardTitle>
        <CardDescription>The OS automatically captures, enriches, and scores the lead.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" /> AI Enrichment
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Net Worth Est.</span>
                <span className="font-bold">{data.customer.netWorth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Risk Profile</span>
                <span className="font-medium text-green-600">{data.customer.riskProfile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Buying Intent</span>
                <span className="font-medium text-emerald-600">Very High (98%)</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-500" /> Auto-Engagement
            </h4>
            <div className="space-y-2 text-sm">
              <p className="text-slate-600">AI Agent "Sarah" has initiated contact via WhatsApp.</p>
              <div className="bg-white p-2 rounded text-xs italic text-slate-500">
                "Hello Mr. Sterling, your Ferrari SF90 configuration is ready for review..."
              </div>
              <Badge className="bg-blue-100 text-blue-700 mt-2">Test Drive Booked</Badge>
            </div>
          </div>
        </div>
        
        <Button className="w-full py-6 text-lg" onClick={onAction} disabled={processing}>
          {processing ? "Processing AI Analysis..." : "Confirm Lead & Proceed to RWA"}
          {!processing && <ArrowRight className="ml-2 w-5 h-5" />}
        </Button>
      </CardContent>
    </Card>
  );
}

function StageRWA({ data, onAction, processing }) {
  return (
    <Card className="h-full border-l-4 border-l-purple-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-600">
          <Shield className="w-6 h-6" /> Stage 2: RWA Digital Twin
        </CardTitle>
        <CardDescription>Creating an immutable blockchain record for the physical asset.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-ping" />
            <div className="relative bg-white border-2 border-purple-500 rounded-full w-32 h-32 flex items-center justify-center p-4 shadow-xl">
              <Car className="w-16 h-16 text-purple-600" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white text-xs px-2 py-1 rounded-full font-mono">
              NFT
            </div>
          </div>
        </div>

        <div className="bg-slate-950 text-green-400 font-mono text-xs p-4 rounded-lg overflow-hidden">
          <p>{`> MINTING ASSET: ${data.asset.name}`}</p>
          <p>{`> VIN: ${data.asset.vin}`}</p>
          <p>{`> METADATA: { color: "Rosso Corsa", engine: "V8 Hybrid" }`}</p>
          <p className="animate-pulse">{`> VERIFYING ON-CHAIN...`}</p>
        </div>

        <Button className="w-full py-6 text-lg bg-purple-600 hover:bg-purple-700" onClick={onAction} disabled={processing}>
          {processing ? "Minting Digital Twin..." : "Mint RWA Token & Lock Asset"}
          {!processing && <Lock className="ml-2 w-5 h-5" />}
        </Button>
      </CardContent>
    </Card>
  );
}

function StageFinance({ data, onAction, processing }) {
  return (
    <Card className="h-full border-l-4 border-l-emerald-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-emerald-600">
          <DollarSign className="w-6 h-6" /> Stage 3: Finance & Invoicing
        </CardTitle>
        <CardDescription>Seamless e-invoicing and automated loan structuring.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-6 border-2 border-dashed border-emerald-200 rounded-lg bg-emerald-50/30 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-1">$1,000,000.00</h3>
          <p className="text-sm text-slate-500 mb-4">Total Transaction Value</p>
          
          <div className="flex justify-center gap-4">
            <Badge variant="outline" className="bg-white border-slate-200 px-3 py-1">
              <CreditCard className="w-3 h-3 mr-2 text-slate-400" />
              Wire Transfer
            </Badge>
            <Badge variant="outline" className="bg-white border-slate-200 px-3 py-1">
              <Zap className="w-3 h-3 mr-2 text-orange-500" />
              Crypto (USDC)
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded text-blue-600"><FileText className="w-4 h-4" /></div>
              <div className="text-sm">
                <p className="font-medium">InvoiceNow (Peppol)</p>
                <p className="text-slate-500 text-xs">Direct to Client's ERP</p>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded text-purple-600"><FileText className="w-4 h-4" /></div>
              <div className="text-sm">
                <p className="font-medium">Loan Application</p>
                <p className="text-slate-500 text-xs">70% LTV Pre-approved</p>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
        </div>

        <Button className="w-full py-6 text-lg bg-emerald-600 hover:bg-emerald-700" onClick={onAction} disabled={processing}>
          {processing ? "Processing Payment..." : "Generate Invoice & Secure Funds"}
          {!processing && <ArrowRight className="ml-2 w-5 h-5" />}
        </Button>
      </CardContent>
    </Card>
  );
}

function StageLegal({ onAction, processing }) {
  return (
    <Card className="h-full border-l-4 border-l-indigo-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-600">
          <FileText className="w-6 h-6" /> Stage 4: Smart Legal Contracts
        </CardTitle>
        <CardDescription>Automated generation and signing of legally binding documents.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {['Sale & Purchase Agreement', 'Title Transfer Deed', 'Insurance Certificate', 'Warranty Documentation'].map((doc, i) => (
            <div key={i} className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
              <FileText className="w-5 h-5 text-slate-400 mr-3" />
              <span className="flex-1 font-medium text-sm">{doc}</span>
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">Auto-Generated</Badge>
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg flex items-start gap-3">
          <PenTool className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-900">Digital Signature Required</p>
            <p className="text-xs text-yellow-700">Secure link sent to buyer's verified email.</p>
          </div>
        </div>

        <Button className="w-full py-6 text-lg bg-indigo-600 hover:bg-indigo-700" onClick={onAction} disabled={processing}>
          {processing ? "Verifying Signatures..." : "Execute Smart Contracts"}
          {!processing && <ArrowRight className="ml-2 w-5 h-5" />}
        </Button>
      </CardContent>
    </Card>
  );
}

function StageDelivery({ onAction, processing }) {
  return (
    <Card className="h-full border-l-4 border-l-orange-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-600">
          <Truck className="w-6 h-6" /> Stage 5: Logistics & Handover
        </CardTitle>
        <CardDescription>Final delivery coordination and digital key handover.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative h-48 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
          {/* Mock Map */}
          <div className="absolute inset-0 opacity-20" 
            style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          </div>
          <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-blue-500 rounded-full animate-ping" />
          <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow" />
          <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow" />
          <div className="absolute top-1/2 left-1/4 w-1/2 h-0.5 bg-slate-300 border-t-2 border-dashed border-slate-400" />
          <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium shadow-sm">
            ETA: 14:00 Today
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <Button variant="outline" className="h-auto py-3 flex flex-col gap-1">
             <Car className="w-5 h-5" />
             <span className="text-xs">Schedule Delivery</span>
           </Button>
           <Button variant="outline" className="h-auto py-3 flex flex-col gap-1">
             <User className="w-5 h-5" />
             <span className="text-xs">Driver Details</span>
           </Button>
        </div>

        <Button className="w-full py-6 text-lg bg-orange-500 hover:bg-orange-600" onClick={onAction} disabled={processing}>
          {processing ? "Closing Deal..." : "Confirm Delivery & Close Deal"}
          {!processing && <CheckCircle2 className="ml-2 w-5 h-5" />}
        </Button>
      </CardContent>
    </Card>
  );
}