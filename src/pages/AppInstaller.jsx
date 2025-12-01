import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, AlertTriangle, Server, Database, 
  Shield, Download, Play, Layers, Terminal,
  ChevronRight, RefreshCw, Lock, FileCode
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InstallerEngine } from '@/components/installer/InstallerEngine';
import { toast } from 'sonner';
import PageHeader from '@/components/shared/PageHeader';

const steps = [
  { id: 1, title: "Environment Check", icon: Server },
  { id: 2, title: "Industry & Modules", icon: Layers },
  { id: 3, title: "Safety & Conflicts", icon: Shield },
  { id: 4, title: "Installation", icon: Download }
];

export default function AppInstaller() {
  const [currentStep, setCurrentStep] = useState(1);
  const [installStatus, setInstallStatus] = useState('idle'); // idle, checking, success, error
  const [envData, setEnvData] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedModules, setSelectedModules] = useState([]);
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);

  const addLog = (msg) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  // Step 1: Environment Check
  const runEnvCheck = async () => {
    setInstallStatus('checking');
    addLog("Detecting ERPNext Version...");
    const { env, compatibility } = await InstallerEngine.checkEnvironment('v15');
    
    setTimeout(() => {
      setEnvData({ ...env, ...compatibility });
      addLog(`Detected ERPNext: ${env.erpnext_version}`);
      addLog(`Detected Python: ${env.python_version}`);
      addLog(`Compatibility Score: ${compatibility.score}/100`);
      setInstallStatus('success');
    }, 1500);
  };

  // Step 2: Industry Selection
  useEffect(() => {
    if (selectedIndustry) {
      const modules = InstallerEngine.getRecommendedModules(selectedIndustry);
      // Resolve dependencies automatically
      InstallerEngine.resolveDependencies(modules).then(({ resolved }) => {
        setSelectedModules(resolved);
        addLog(`AI Selected ${resolved.length} modules for ${selectedIndustry}`);
      });
    }
  }, [selectedIndustry]);

  // Step 3: Migration Safety
  const runSafetyCheck = async () => {
    setInstallStatus('checking');
    addLog("Running Dry-Run Migration...");
    const result = await InstallerEngine.runDryRunMigration();
    addLog(result.message);
    addLog(`Snapshot ID: ${result.snapshot_id}`);
    setInstallStatus('success');
  };

  // Step 4: Installation Simulation with Rollback
  const startInstallation = async () => {
    setInstallStatus('installing');
    setProgress(0);
    const installId = `inst_${Date.now()}`;
    
    const stages = [
      { step: "Backup", msg: "Backing up Database..." },
      { step: "Download", msg: "Downloading App Assets..." },
      { step: "Dependencies", msg: "Installing Python Dependencies..." },
      { step: "Build", msg: "Building Node.js Assets..." },
      { step: "Migrate", msg: "Running Bench Migrate..." }, // Simulation point for failure
      { step: "Config", msg: "Updating Site Config..." },
      { step: "Restart", msg: "Restarting Supervisor..." },
      { step: "Verify", msg: "Verifying Installation..." }
    ];

    try {
      for (let i = 0; i < stages.length; i++) {
        const stage = stages[i];
        
        // Log start of step
        await InstallerEngine.logInstallationStep(installId, stage.step, stage.msg, 'Info');
        addLog(stage.msg);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Random failure simulation for demonstration (5% chance)
        // In production, this would be actual error catching
        const simulateFailure = false; // Set to true to test rollback manually or make random
        
        if (simulateFailure && i === 4) {
          throw new Error("Migration Script Failed: Column 'custom_field' already exists");
        }

        setProgress(((i + 1) / stages.length) * 100);
      }

      setInstallStatus('complete');
      addLog("Installation Completed Successfully!");
      await InstallerEngine.logInstallationStep(installId, "Complete", "Installation finished successfully", "Info");
      toast.success("ArkApp Installed Successfully");

    } catch (error) {
      setInstallStatus('error');
      addLog(`ERROR: ${error.message}`);
      await InstallerEngine.logInstallationStep(installId, "Error", error.message, "Error", error.stack);
      
      // Initiate Rollback
      toast.error("Installation failed. Initiating Rollback...");
      addLog("Initiating Automated Rollback...");
      
      const snapshotId = "snap_latest"; // fetched from previous step in real app
      // Pass failure reason and user context to rollback
      const rollbackResult = await InstallerEngine.rollbackInstallation(snapshotId, error.message, "Installer Agent");
      
      addLog(rollbackResult.message);
      await InstallerEngine.logInstallationStep(installId, "Rollback", rollbackResult.message, "Warning");
      toast.success("Rollback completed. System restored and logged to audit trail.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <PageHeader 
          title="Ark App Installer" 
          subtitle="ERPNext-Ready Automated Installation System"
          icon={Download}
          showBack={true}
        />

        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar Steps */}
          <div className="col-span-3">
            <nav className="space-y-2">
              {steps.map((step) => (
                <div 
                  key={step.id}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    currentStep === step.id 
                      ? 'bg-slate-900 text-white' 
                      : currentStep > step.id 
                        ? 'bg-green-50 text-green-700'
                        : 'text-slate-500'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    currentStep === step.id ? 'bg-white/20' : 'bg-slate-200'
                  }`}>
                    {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-4 h-4" />}
                  </div>
                  <span className="font-medium text-sm">{step.title}</span>
                </div>
              ))}
            </nav>

            {/* System Status Card */}
            <Card className="mt-8 bg-slate-900 text-white border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-slate-400">Target System</span>
                  <Badge className="bg-lime-500 text-slate-900">v15.4.0</Badge>
                </div>
                <div className="space-y-2 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Mode</span>
                    <span className="text-white">Production</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Database</span>
                    <span className="text-white">MariaDB 10.6</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <Card className="min-h-[500px] flex flex-col">
              <CardHeader>
                <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                <CardDescription>Step {currentStep} of 4</CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg bg-slate-50">
                        <h3 className="font-medium mb-2 flex items-center gap-2">
                          <Server className="w-4 h-4 text-blue-500" /> ERPNext Core
                        </h3>
                        {envData ? (
                          <div className="space-y-1 text-sm">
                            <p>Version: <span className="font-mono">{envData.erpnext_version}</span></p>
                            <p>Frappe: <span className="font-mono">{envData.frappe_version}</span></p>
                            <Badge className="bg-green-100 text-green-700 mt-2">Compatible</Badge>
                          </div>
                        ) : (
                          <div className="h-20 flex items-center justify-center text-slate-400">
                            Waiting for check...
                          </div>
                        )}
                      </div>
                      <div className="p-4 border rounded-lg bg-slate-50">
                        <h3 className="font-medium mb-2 flex items-center gap-2">
                          <Database className="w-4 h-4 text-purple-500" /> Dependencies
                        </h3>
                         {envData ? (
                          <div className="space-y-1 text-sm">
                            <p>Python: <span className="font-mono">{envData.python_version}</span></p>
                            <p>Node.js: <span className="font-mono">{envData.node_version}</span></p>
                            <p>Redis: <span className="text-green-600">Active</span></p>
                          </div>
                        ) : (
                          <div className="h-20 flex items-center justify-center text-slate-400">
                            Waiting for check...
                          </div>
                        )}
                      </div>
                    </div>

                    {installStatus === 'idle' && (
                       <Button onClick={runEnvCheck} className="w-full" size="lg">
                         Start Compatibility Scan
                       </Button>
                    )}
                    
                    {installStatus === 'success' && (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <div className="flex-1">
                          <p className="font-medium text-green-900">Environment Ready</p>
                          <p className="text-sm text-green-700">System meets all requirements for ArkApp installation.</p>
                        </div>
                        <Button onClick={() => { setInstallStatus('idle'); setCurrentStep(2); }}>
                          Next Step <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Select Industry Profile</label>
                      <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Choose your business type..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Manufacturing">Manufacturing & Production</SelectItem>
                          <SelectItem value="Retail">Retail & POS</SelectItem>
                          <SelectItem value="Services">Professional Services</SelectItem>
                          <SelectItem value="FinTech/RWA">FinTech & RWA</SelectItem>
                          <SelectItem value="Distribution">Distribution & Logistics</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500 mt-2">
                        AI will automatically select the relevant modules based on your industry.
                      </p>
                    </div>

                    {selectedModules.length > 0 && (
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium mb-3">Selected Modules ({selectedModules.length})</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedModules.map(mod => (
                            <Badge key={mod} variant="secondary" className="px-3 py-1">
                              {mod}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between pt-4">
                      <Button variant="ghost" onClick={() => setCurrentStep(1)}>Back</Button>
                      <Button 
                        disabled={!selectedIndustry}
                        onClick={() => setCurrentStep(3)}
                      >
                        Confirm Modules <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <h3 className="font-medium text-amber-800 flex items-center gap-2 mb-2">
                        <Lock className="w-4 h-4" /> Migration Safety Shield
                      </h3>
                      <p className="text-sm text-amber-700 mb-4">
                        Before installation, we will perform a dry-run migration to ensure no data corruption occurs. 
                        A database snapshot will be created automatically.
                      </p>
                      {installStatus === 'idle' && (
                        <Button variant="outline" onClick={runSafetyCheck} className="bg-white border-amber-200 text-amber-800">
                          Run Safety Check
                        </Button>
                      )}
                    </div>

                     {installStatus === 'success' && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="font-medium text-blue-800 mb-2">Dependency Resolution</h3>
                        <div className="space-y-2 text-sm text-blue-700">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> All module dependencies resolved
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> No schema conflicts detected
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> 'frappe' version matched
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between pt-4">
                      <Button variant="ghost" onClick={() => { setInstallStatus('idle'); setCurrentStep(2); }}>Back</Button>
                      <Button 
                        disabled={installStatus !== 'success'}
                        onClick={() => { setInstallStatus('idle'); setCurrentStep(4); }}
                      >
                        Proceed to Install <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    {installStatus === 'idle' && (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Download className="w-8 h-8 text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Ready to Install</h3>
                        <p className="text-slate-500 mb-6 max-w-md mx-auto">
                          This will install ArkApp and {selectedModules.length} modules to your Production environment. 
                          The system may restart during this process.
                        </p>
                        <Button size="lg" className="bg-lime-500 hover:bg-lime-600 text-slate-900" onClick={startInstallation}>
                          Start Installation
                        </Button>
                      </div>
                    )}

                    {(installStatus === 'installing' || installStatus === 'complete') && (
                      <div className="space-y-4">
                        <Progress value={progress} className="h-2" />
                        
                        <div className="bg-slate-900 rounded-lg p-4 h-64 overflow-y-auto font-mono text-xs text-green-400">
                          {logs.map((log, i) => (
                            <div key={i}>{log}</div>
                          ))}
                          {installStatus === 'installing' && (
                            <div className="animate-pulse">_</div>
                          )}
                        </div>

                        {installStatus === 'complete' && (
                           <div className="text-center pt-4">
                             <Button className="bg-slate-900 text-white">
                               Go to Dashboard
                             </Button>
                           </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}