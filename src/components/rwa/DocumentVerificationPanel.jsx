import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FileText, Upload, CheckCircle2, XCircle, Clock, AlertTriangle,
  Eye, Download, RefreshCw, Shield, Zap
} from 'lucide-react';
import { toast } from 'sonner';

const documentTypes = {
  psp: [
    { id: 'license', name: 'Payment Services License', required: true },
    { id: 'aml', name: 'AML/CFT Policy', required: true },
    { id: 'insurance', name: 'Professional Indemnity Insurance', required: true },
    { id: 'audit', name: 'Latest Audit Report', required: false }
  ],
  bank: [
    { id: 'license', name: 'Banking License', required: true },
    { id: 'mas', name: 'MAS Compliance Certificate', required: true },
    { id: 'fatf', name: 'FATF Compliance Declaration', required: true },
    { id: 'cyber', name: 'Cybersecurity Attestation', required: true }
  ],
  custodian: [
    { id: 'license', name: 'Custody License', required: true },
    { id: 'soc2', name: 'SOC 2 Type II Report', required: true },
    { id: 'insurance', name: 'Crime & Specie Insurance', required: true },
    { id: 'penetration', name: 'Penetration Test Report', required: false }
  ],
  fintech: [
    { id: 'license', name: 'Money Lender License', required: true },
    { id: 'pdpa', name: 'PDPA Compliance Certificate', required: true },
    { id: 'financials', name: 'Audited Financial Statements', required: true }
  ]
};

export default function DocumentVerificationPanel({ partnerType = 'psp', onVerificationComplete }) {
  const [documents, setDocuments] = useState(
    (documentTypes[partnerType] || documentTypes.psp).map(doc => ({
      ...doc,
      status: 'pending',
      file: null,
      verificationScore: null,
      issues: []
    }))
  );
  const [verifying, setVerifying] = useState(null);

  const handleUpload = (docId, file) => {
    setDocuments(prev => prev.map(d => 
      d.id === docId ? { ...d, file, status: 'uploaded' } : d
    ));
    toast.success(`${file.name} uploaded successfully`);
  };

  const startVerification = async (docId) => {
    setVerifying(docId);
    setDocuments(prev => prev.map(d => 
      d.id === docId ? { ...d, status: 'verifying' } : d
    ));

    // Simulate AI verification
    await new Promise(resolve => setTimeout(resolve, 2000));

    const score = Math.floor(Math.random() * 30) + 70;
    const passed = score >= 80;
    const issues = !passed ? ['Document expired', 'Signature missing'] : [];

    setDocuments(prev => prev.map(d => 
      d.id === docId ? { 
        ...d, 
        status: passed ? 'verified' : 'failed',
        verificationScore: score,
        issues
      } : d
    ));
    setVerifying(null);

    if (passed) {
      toast.success('Document verified successfully');
    } else {
      toast.error('Document verification failed');
    }
  };

  const verifyAll = async () => {
    const uploadedDocs = documents.filter(d => d.status === 'uploaded');
    for (const doc of uploadedDocs) {
      await startVerification(doc.id);
    }
    
    const allVerified = documents.every(d => !d.required || d.status === 'verified');
    if (allVerified) {
      onVerificationComplete?.();
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified': return <Badge className="bg-emerald-500/20 text-emerald-400"><CheckCircle2 className="w-3 h-3 mr-1" />Verified</Badge>;
      case 'failed': return <Badge className="bg-red-500/20 text-red-400"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      case 'verifying': return <Badge className="bg-blue-500/20 text-blue-400"><RefreshCw className="w-3 h-3 mr-1 animate-spin" />Verifying</Badge>;
      case 'uploaded': return <Badge className="bg-amber-500/20 text-amber-400"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      default: return <Badge className="bg-slate-700 text-slate-400">Required</Badge>;
    }
  };

  const verifiedCount = documents.filter(d => d.status === 'verified').length;
  const requiredCount = documents.filter(d => d.required).length;
  const progress = (verifiedCount / documents.length) * 100;

  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <span className="text-white font-medium">Document Verification</span>
          </div>
          <span className="text-slate-400 text-sm">{verifiedCount}/{documents.length} verified</span>
        </div>
        <Progress value={progress} className="h-2 bg-slate-700" />
        <div className="flex items-center justify-between mt-3">
          <span className="text-slate-500 text-xs">AI-powered document verification</span>
          <Button 
            size="sm" 
            className="bg-cyan-500 hover:bg-cyan-400"
            onClick={verifyAll}
            disabled={!documents.some(d => d.status === 'uploaded')}
          >
            <Zap className="w-4 h-4 mr-1" />
            Verify All
          </Button>
        </div>
      </div>

      {/* Document List */}
      <div className="space-y-3">
        {documents.map((doc) => (
          <div 
            key={doc.id}
            className={`p-4 rounded-xl border transition-all ${
              doc.status === 'verified' ? 'border-emerald-500/30 bg-emerald-500/5' :
              doc.status === 'failed' ? 'border-red-500/30 bg-red-500/5' :
              'border-slate-700 bg-slate-800/50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  doc.status === 'verified' ? 'bg-emerald-500/20' :
                  doc.status === 'failed' ? 'bg-red-500/20' :
                  'bg-slate-700'
                }`}>
                  <FileText className={`w-5 h-5 ${
                    doc.status === 'verified' ? 'text-emerald-400' :
                    doc.status === 'failed' ? 'text-red-400' :
                    'text-slate-400'
                  }`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">{doc.name}</p>
                    {doc.required && <span className="text-red-400 text-xs">*Required</span>}
                  </div>
                  {doc.file && (
                    <p className="text-slate-500 text-sm">{doc.file.name}</p>
                  )}
                  {doc.verificationScore && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-slate-400 text-xs">Confidence:</span>
                      <span className={`text-sm font-medium ${doc.verificationScore >= 80 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {doc.verificationScore}%
                      </span>
                    </div>
                  )}
                  {doc.issues.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {doc.issues.map((issue, idx) => (
                        <div key={idx} className="flex items-center gap-1 text-red-400 text-xs">
                          <AlertTriangle className="w-3 h-3" />
                          {issue}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(doc.status)}
                {doc.status === 'pending' && (
                  <label className="cursor-pointer">
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => e.target.files?.[0] && handleUpload(doc.id, e.target.files[0])}
                    />
                    <Button size="sm" variant="outline" className="border-slate-600" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-1" />
                        Upload
                      </span>
                    </Button>
                  </label>
                )}
                {doc.status === 'uploaded' && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-cyan-500 text-cyan-400"
                    onClick={() => startVerification(doc.id)}
                    disabled={verifying === doc.id}
                  >
                    {verifying === doc.id ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-1" />
                        Verify
                      </>
                    )}
                  </Button>
                )}
                {doc.file && (
                  <Button size="sm" variant="ghost" className="text-slate-400">
                    <Eye className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}