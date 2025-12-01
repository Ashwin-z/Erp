import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, ArrowLeft, FileText, Clock, 
  Hash, CheckCircle, Building2, Globe, Lock,
  Printer, Share2, Download, Activity
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default function BlockchainAuditDetail() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  // In a real app, use useParams to get ID and fetch data
  // const { id } = useParams();

  // Mock Data for the "Government Auditor" view
  const auditRecord = {
    id: "ANCHOR-2024-8821",
    transactionHash: "0x7f3a8b2c9e4f2d1a5b6c7d8e9f0a1b2c3d4e5f6a",
    blockNumber: 15243992,
    timestamp: "2024-11-28T09:15:22Z",
    status: "Confirmed",
    network: "Polygon PoS (Mainnet)",
    
    item: "High-Value Asset Tokenisation",
    description: "Minting of RWA Token for Commercial Property at 12 Marina Blvd",
    referenceId: "PROP-SG-0091",
    
    initiator: {
      name: "ArkFinex Treasury",
      wallet: "0x1234...abcd",
      role: "Asset Originator"
    },
    
    metadata: {
      assetValue: "$12,500,000.00",
      currency: "USD",
      custodian: "DBS Trustee Services",
      auditFirm: "Deloitte",
      legalOpinion: "Rajah & Tann"
    },
    
    verification: {
      isTamperProof: true,
      lastVerified: "2024-11-28T10:00:00Z",
      auditorSignature: "0x9988...7766"
    }
  };

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto bg-slate-950 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Navigation */}
            <Button 
              variant="ghost" 
              className="mb-6 text-slate-400 hover:text-white"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Explorer
            </Button>

            {/* Official Audit Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-t-xl p-8">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/50 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10 uppercase tracking-wider text-[10px]">
                        Official Audit Record
                      </Badge>
                      <Badge variant="outline" className="border-slate-600 text-slate-400 uppercase tracking-wider text-[10px]">
                        Immutable
                      </Badge>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Blockchain Anchor Detail</h1>
                    <p className="text-slate-400 font-mono text-sm mt-1">{auditRecord.id}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                    <Printer className="w-4 h-4 mr-2" /> Print Official Copy
                  </Button>
                  <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                    <Download className="w-4 h-4 mr-2" /> Export JSON
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-slate-900 border-x border-b border-slate-700 rounded-b-xl p-8 space-y-8">
              
              {/* 1. Item Identity */}
              <section>
                <h3 className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Asset / Item Details
                </h3>
                <div className="bg-slate-950/50 rounded-xl border border-slate-800 p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-slate-500 text-xs uppercase mb-1">Item Name</p>
                    <p className="text-white text-lg font-medium">{auditRecord.item}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase mb-1">Reference ID</p>
                    <p className="text-white text-lg font-mono">{auditRecord.referenceId}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-slate-500 text-xs uppercase mb-1">Description</p>
                    <p className="text-slate-300">{auditRecord.description}</p>
                  </div>
                </div>
              </section>

              <Separator className="bg-slate-800" />

              {/* 2. Blockchain Proof */}
              <section>
                <h3 className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> On-Chain Verification
                </h3>
                <div className="bg-slate-950/50 rounded-xl border border-slate-800 p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-slate-500 text-xs uppercase mb-1">Network</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <p className="text-white">{auditRecord.network}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs uppercase mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <p className="text-emerald-400 font-medium">{auditRecord.status}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-slate-500 text-xs uppercase mb-1">Transaction Hash</p>
                    <div className="flex items-center gap-3 bg-slate-900 p-3 rounded border border-slate-800">
                      <Hash className="w-4 h-4 text-slate-500" />
                      <code className="text-cyan-400 font-mono text-sm flex-1 break-all">
                        {auditRecord.transactionHash}
                      </code>
                      <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-slate-500 text-xs uppercase mb-1">Block Number</p>
                      <p className="text-white font-mono">#{auditRecord.blockNumber}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs uppercase mb-1">Timestamp</p>
                      <p className="text-white font-mono">
                        {new Date(auditRecord.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs uppercase mb-1">Gas Used</p>
                      <p className="text-white font-mono">124,500 Gwei</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs uppercase mb-1">Confirmations</p>
                      <p className="text-white font-mono">12,402</p>
                    </div>
                  </div>
                </div>
              </section>

              <Separator className="bg-slate-800" />

              {/* 3. Parties Involved */}
              <section>
                <h3 className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> Audit Trail & Parties
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-slate-950/50 border-slate-800">
                    <CardContent className="p-4">
                      <p className="text-slate-500 text-xs uppercase mb-2">Initiator</p>
                      <p className="text-white font-medium">{auditRecord.initiator.name}</p>
                      <p className="text-slate-400 text-xs font-mono mt-1 truncate">{auditRecord.initiator.wallet}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-950/50 border-slate-800">
                    <CardContent className="p-4">
                      <p className="text-slate-500 text-xs uppercase mb-2">Custodian</p>
                      <p className="text-white font-medium">{auditRecord.metadata.custodian}</p>
                      <p className="text-emerald-400 text-xs mt-1 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Verified Entity
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-950/50 border-slate-800">
                    <CardContent className="p-4">
                      <p className="text-slate-500 text-xs uppercase mb-2">External Audit</p>
                      <p className="text-white font-medium">{auditRecord.metadata.auditFirm}</p>
                      <p className="text-slate-400 text-xs mt-1">Quarterly Review</p>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* 4. Verification Footer */}
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-emerald-400 font-medium text-sm">Cryptographically Verified</p>
                    <p className="text-emerald-400/60 text-xs">This record is immutable and anchored on the Polygon public ledger.</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 text-xs">Digital Signature</p>
                  <p className="text-slate-400 font-mono text-xs">{auditRecord.verification.auditorSignature}</p>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}