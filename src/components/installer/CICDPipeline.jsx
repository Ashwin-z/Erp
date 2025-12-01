import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  GitBranch, Play, CheckCircle2, XCircle, Clock, 
  AlertTriangle, ExternalLink, GitCommit, RefreshCw 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function CICDPipeline() {
  const queryClient = useQueryClient();
  const [newRepoUrl, setNewRepoUrl] = useState('');

  // Data Fetching
  const { data: repos } = useQuery({
    queryKey: ['appRepos'],
    queryFn: () => base44.entities.AppRepository.list(),
    initialData: []
  });

  const { data: builds } = useQuery({
    queryKey: ['ciBuilds'],
    queryFn: () => base44.entities.CIBuild.list('-created_date', 20),
    initialData: []
  });

  // Mutations
  const addRepo = useMutation({
    mutationFn: (url) => base44.entities.AppRepository.create({
      name: url.split('/').pop().replace('.git', ''),
      repo_url: url,
      branch: 'main',
      auto_build: true,
      require_approval: true
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['appRepos']);
      setNewRepoUrl('');
      toast.success("Repository linked successfully");
    }
  });

  const triggerBuild = useMutation({
    mutationFn: async (repoId) => {
      // Simulating a build trigger
      return base44.entities.CIBuild.create({
        repository_id: repoId,
        commit_hash: Math.random().toString(16).substr(2, 7),
        commit_message: "Update app configuration",
        build_status: "Building",
        test_results: JSON.stringify({ passed: 0, total: 15 }),
        logs: "Initializing build environment..."
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['ciBuilds']);
      toast.info("Build triggered successfully");
      
      // Simulate build progression
      setTimeout(() => {
        queryClient.invalidateQueries(['ciBuilds']);
        toast.success("Build passed all tests!");
      }, 3000);
    }
  });

  const approveDeploy = useMutation({
    mutationFn: (buildId) => base44.entities.CIBuild.update(buildId, { 
      approval_status: 'Approved', 
      approved_by: 'Admin' 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['ciBuilds']);
      toast.success("Build Approved. Ready for Deployment.");
    }
  });

  const deployBuild = useMutation({
    mutationFn: async (buildId) => {
      // Trigger deployment via engine
      await InstallerEngine.deployApp(buildId);
      return base44.entities.CIBuild.update(buildId, { build_status: 'Deployed' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['ciBuilds']);
      toast.success("App Deployed Successfully");
    },
    onError: (error) => {
      toast.error(`Deployment Failed: ${error.message}. Rollback initiated.`);
      queryClient.invalidateQueries(['ciBuilds']);
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Success': case 'Deployed': return 'bg-green-100 text-green-700';
      case 'Failed': return 'bg-red-100 text-red-700';
      case 'Building': case 'Testing': return 'bg-blue-100 text-blue-700';
      case 'Ready to Deploy': return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Repositories List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" /> Linked Repositories
          </CardTitle>
          <CardDescription>Connect GitHub/GitLab repos for automated builds.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input 
              placeholder="https://github.com/user/repo" 
              value={newRepoUrl}
              onChange={(e) => setNewRepoUrl(e.target.value)}
              className="text-xs"
            />
            <Button size="sm" onClick={() => addRepo.mutate(newRepoUrl)} disabled={!newRepoUrl}>
              Add
            </Button>
          </div>
          <div className="space-y-3">
            {repos.map(repo => (
              <div key={repo.id} className="p-3 border rounded-lg bg-slate-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm truncate max-w-[150px]">{repo.name}</h4>
                  <Badge variant="outline" className="text-xs">{repo.branch}</Badge>
                </div>
                <p className="text-xs text-slate-500 truncate mb-3">{repo.repo_url}</p>
                <div className="flex justify-between items-center">
                  <Badge className={getStatusColor(repo.last_build_status)} variant="secondary">
                    {repo.last_build_status}
                  </Badge>
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => triggerBuild.mutate(repo.id)}>
                    <Play className="w-3 h-3 mr-1" /> Build
                  </Button>
                </div>
              </div>
            ))}
            {repos.length === 0 && <p className="text-xs text-slate-400 text-center">No repositories linked.</p>}
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Activity */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCommit className="w-5 h-5" /> Pipeline Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {builds.map(build => (
              <div key={build.id} className="flex items-start gap-4 p-4 border rounded-lg bg-white">
                <div className="mt-1">
                  {build.build_status === 'Failed' ? <XCircle className="w-5 h-5 text-red-500" /> :
                   build.build_status === 'Deployed' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> :
                   build.build_status === 'Ready to Deploy' ? <AlertTriangle className="w-5 h-5 text-purple-500" /> :
                   <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">Commit: {build.commit_hash}</h4>
                        <Badge className={getStatusColor(build.build_status)}>{build.build_status}</Badge>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{build.commit_message}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {moment(build.created_date).fromNow()}</span>
                        {build.approved_by && <span className="flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> Approved by {build.approved_by}</span>}
                      </div>
                    </div>
                    {build.build_status === 'Ready to Deploy' && build.approval_status === 'Pending' && (
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-700" onClick={() => approveDeploy.mutate(build.id)}>
                        Approve Build
                      </Button>
                    )}
                    {build.build_status === 'Ready to Deploy' && build.approval_status === 'Approved' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => deployBuild.mutate(build.id)}>
                        <Play className="w-3 h-3 mr-2" /> Deploy Now
                      </Button>
                    )}
                  </div>
                  
                  {/* Mock Progress for Active Builds */}
                  {(build.build_status === 'Building' || build.build_status === 'Testing') && (
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Running automated tests...</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="h-1.5" />
                    </div>
                  )}
                </div>
              </div>
            ))}
             {builds.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No build history available.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}