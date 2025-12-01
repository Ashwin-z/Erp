import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Search, Download, Github, Star, ShieldCheck, 
  ArrowRight, RefreshCw, Sparkles, Lightbulb
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { InstallerEngine } from './InstallerEngine';

export default function AppDiscoveryPanel() {
  const queryClient = useQueryClient();
  const [scanning, setScanning] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const { data: discoveredApps } = useQuery({
    queryKey: ['discoveredApps'],
    queryFn: () => base44.entities.DiscoveredApp.list('-detected_at'),
    initialData: []
  });

  const { data: installedApps } = useQuery({
    queryKey: ['installedApps'],
    queryFn: () => base44.entities.InstalledApp.list(),
    initialData: []
  });

  useEffect(() => {
    if (installedApps.length > 0) {
      InstallerEngine.getAIRecommendations(installedApps).then(setRecommendations);
    }
  }, [installedApps]);

  const scanForApps = async () => {
    setScanning(true);
    try {
      // Trigger scanning logic in Engine (mocked for now)
      const newApps = await InstallerEngine.scanForNewApps();
      
      // In real implementation, Engine would save to DB, here we simulate refresh
      queryClient.invalidateQueries(['discoveredApps']);
      toast.success(`Discovery Complete: Found ${newApps.length} new apps`);
    } catch (e) {
      toast.error("Scan failed");
    } finally {
      setScanning(false);
    }
  };

  const installMutation = useMutation({
    mutationFn: async (app) => {
      // 1. Update status locally
      await base44.entities.DiscoveredApp.update(app.id, { status: 'Installed' });
      
      // 2. Trigger Auto-Pipeline
      const result = await InstallerEngine.triggerAutomatedPipelineForNewApp(app);
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['discoveredApps']);
      // 3. Notify user of pipeline start
      toast.success(data.message);
    }
  });

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-xl p-6 text-white flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" /> 
            AI App Discovery
          </h3>
          <p className="text-slate-400 mt-1">
            Automatically scans trusted GitHub repositories and community channels for compatible ERPNext modules.
          </p>
        </div>
        <Button 
          onClick={scanForApps} 
          disabled={scanning}
          className="bg-white text-slate-900 hover:bg-slate-100"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${scanning ? 'animate-spin' : ''}`} />
          {scanning ? 'Scanning...' : 'Scan Now'}
        </Button>
      </div>

      {recommendations.length > 0 && (
        <div className="mb-8">
          <h4 className="text-sm font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-500" /> Recommended for You
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            {recommendations.map(rec => (
              <Card key={rec.id} className="bg-gradient-to-br from-yellow-50 to-white border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <h5 className="font-bold text-slate-900">{rec.name}</h5>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
                      98% Match
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{rec.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-500 italic">{rec.match_reason}</span>
                    <Button size="sm" variant="outline" className="h-7 text-xs bg-white">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <h4 className="text-sm font-bold text-slate-500 uppercase mb-3">Recently Discovered</h4>
      <div className="grid md:grid-cols-2 gap-4">
        {discoveredApps.map(app => (
          <Card key={app.id} className="border-slate-200 hover:border-slate-300 transition-all">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Github className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{app.name || 'Unnamed App'}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs font-normal">v{app.version || '0.0.0'}</Badge>
                      <div className="flex items-center text-xs text-green-600">
                        <ShieldCheck className="w-3 h-3 mr-1" /> 
                        {app.compatibility_score}% Match
                      </div>
                    </div>
                  </div>
                </div>
                {app.status === 'New' && (
                  <Badge className="bg-blue-500">New</Badge>
                )}
              </div>
              
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                {app.description}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-400">
                  Detected {new Date(app.detected_at).toLocaleDateString()}
                </span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 p-0 px-2"
                  onClick={() => installMutation.mutate(app)}
                  disabled={app.status === 'Installed'}
                >
                  {app.status === 'Installed' ? 'Pipeline Active' : 'Install & Build'} 
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {discoveredApps.length === 0 && !scanning && (
          <div className="col-span-2 text-center py-12 text-slate-400">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No new apps discovered recently.</p>
            <Button variant="link" onClick={scanForApps}>Run a manual scan</Button>
          </div>
        )}
      </div>
    </div>
  );
}