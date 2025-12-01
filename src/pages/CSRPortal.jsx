import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  HeartHandshake, Globe, DollarSign, Users, 
  CheckCircle2, ExternalLink, FileText 
} from 'lucide-react';

export default function CSRPortal() {
  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <HeartHandshake className="w-8 h-8 text-emerald-400" />
            CSR Portal
          </h1>
          <p className="text-slate-400">Automated Profit-Sharing & Impact Tracking</p>
        </div>
        <Button variant="outline" className="border-slate-700 text-slate-300">
          <FileText className="w-4 h-4 mr-2" />
          Transparency Report
        </Button>
      </div>

      {/* Fund Status */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-emerald-900/20 border-emerald-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <DollarSign className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-emerald-200/70">CSR Fund (Nov)</p>
                <h3 className="text-2xl font-bold text-emerald-100">$12,450</h3>
              </div>
            </div>
            <div className="mt-4 text-xs text-emerald-200/50">
              10% of Net Profit ($124,500)
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Globe className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Projects Supported</p>
                <h3 className="text-2xl font-bold">8 Active</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Lives Impacted</p>
                <h3 className="text-2xl font-bold">~1,200</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle>Recommended Allocations (Pending Approval)</CardTitle>
          <CardDescription>AI-vetted projects matching brand values</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Ocean Cleanup Initiative', location: 'Indonesia', amount: 5000, score: 98, status: 'Pending' },
              { name: 'Tech Education for Kids', location: 'Singapore', amount: 3500, score: 95, status: 'Approved' },
              { name: 'Reforestation Project', location: 'Brazil', amount: 2500, score: 92, status: 'Pending' },
            ].map((project, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-lg text-slate-500">
                    {project.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{project.name}</h4>
                    <p className="text-xs text-slate-400">{project.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                   <div className="text-right">
                     <p className="text-xs text-slate-500">Allocation</p>
                     <p className="font-bold text-emerald-400">${project.amount.toLocaleString()}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-xs text-slate-500">Impact Score</p>
                     <p className="font-bold text-blue-400">{project.score}/100</p>
                   </div>
                   <Button variant={project.status === 'Approved' ? 'ghost' : 'default'} className={project.status === 'Approved' ? 'text-emerald-400' : 'bg-emerald-600'}>
                     {project.status === 'Approved' ? (
                       <><CheckCircle2 className="w-4 h-4 mr-2" /> Approved</>
                     ) : 'Approve'}
                   </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}