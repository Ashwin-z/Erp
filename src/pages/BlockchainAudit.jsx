import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Shield, Link2, CheckCircle2, Clock, ExternalLink,
  FileText, RefreshCw, AlertTriangle, Database
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SOPGuide from '@/components/modules/SOPGuide';
import ModuleDashboard from '@/components/modules/ModuleDashboard';

const blockchainSOP = {
  title: "Blockchain Anchoring Workflow",
  description: "Hash → Anchor → Verify → Audit",
  steps: [
    { name: "Generate Hash", description: "Create cryptographic hash of transaction data.", checklist: ["Collect transaction data", "Generate SHA-256 hash", "Queue for anchoring"] },
    { name: "Anchor", description: "Submit hash to selected blockchain network.", checklist: ["Select chain (ETH/BSC/Polygon)", "Submit transaction", "Pay gas fees", "Wait for confirmation"] },
    { name: "Confirm", description: "Verify blockchain confirmation and store reference.", checklist: ["Get transaction hash", "Record block number", "Update database", "Mark as anchored"] },
    { name: "Verify", description: "Allow verification of data integrity anytime.", checklist: ["Retrieve original data", "Recalculate hash", "Compare with blockchain", "Generate certificate"] }
  ]
};

export default function BlockchainAudit() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");

  const stats = [
    { label: 'Total Anchored', value: 1547, icon: Shield, color: 'bg-blue-500', trend: 23 },
    { label: 'Pending', value: 12, icon: Clock, color: 'bg-amber-500', trend: -5 },
    { label: 'Verified', value: 1535, icon: CheckCircle2, color: 'bg-green-500', trend: 22 },
    { label: 'Failed', value: 0, icon: AlertTriangle, color: 'bg-red-500', trend: 0 }
  ];

  const anchors = [
    { id: 1, entity: 'Invoice', entity_id: 'INV-2024-156', hash: '0x7f3a...8b2c', chain: 'Polygon', tx_hash: '0x9e4f...2d1a', block: 52847623, status: 'confirmed', date: '2024-12-20' },
    { id: 2, entity: 'SalesOrder', entity_id: 'SO-2024-089', hash: '0x2b5c...9f3d', chain: 'BSC', tx_hash: '0x3c8a...7e5b', block: 45632178, status: 'confirmed', date: '2024-12-20' },
    { id: 3, entity: 'Contract', entity_id: 'CON-2024-023', hash: '0x8d2e...4a1c', chain: 'Ethereum', tx_hash: '0x6b9d...3f2e', block: 19283746, status: 'confirmed', date: '2024-12-19' },
    { id: 4, entity: 'Payment', entity_id: 'PAY-2024-445', hash: '0x1f4b...6c8a', chain: 'Polygon', tx_hash: '0x pending...', block: null, status: 'pending', date: '2024-12-20' },
    { id: 5, entity: 'GST Report', entity_id: 'GST-2024-Q4', hash: '0x5a9c...2e7d', chain: 'Polygon', tx_hash: '0x4d2f...8a3c', block: 52847589, status: 'confirmed', date: '2024-12-18' }
  ];

  const chainColors = {
    Ethereum: 'bg-blue-100 text-blue-700',
    BSC: 'bg-amber-100 text-amber-700',
    Polygon: 'bg-purple-100 text-purple-700'
  };

  const statusColors = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-amber-100 text-amber-700',
    failed: 'bg-red-100 text-red-700'
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[1800px] mx-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Blockchain Audit Trail</h1>
                <p className="text-slate-500">Immutable transaction anchoring on Ethereum, BSC & Polygon</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync Status
                </Button>
                <Button className="bg-lime-500 hover:bg-lime-600">
                  <Link2 className="w-4 h-4 mr-2" />
                  Anchor Now
                </Button>
              </div>
            </div>

            {/* SOP Guide */}
            <SOPGuide {...blockchainSOP} />

            {/* Dashboard Stats */}
            <ModuleDashboard stats={stats} />

            {/* Chain Selection */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {['Ethereum', 'BSC', 'Polygon'].map((chain) => (
                <Card key={chain} className={chain === 'Polygon' ? 'border-lime-300 bg-lime-50' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Database className={`w-5 h-5 ${chain === 'Polygon' ? 'text-lime-600' : 'text-slate-400'}`} />
                        <div>
                          <p className="font-medium">{chain}</p>
                          <p className="text-xs text-slate-500">
                            {chain === 'Ethereum' ? 'High security' : chain === 'BSC' ? 'Fast & cheap' : 'Recommended'}
                          </p>
                        </div>
                      </div>
                      {chain === 'Polygon' && <Badge className="bg-lime-500">Active</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Anchored Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Anchored Transactions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Entity</TableHead>
                      <TableHead>Data Hash</TableHead>
                      <TableHead>Chain</TableHead>
                      <TableHead>TX Hash</TableHead>
                      <TableHead>Block</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {anchors.map((anchor) => (
                      <TableRow key={anchor.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-400" />
                            <div>
                              <p className="font-medium">{anchor.entity}</p>
                              <p className="text-xs text-slate-500">{anchor.entity_id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{anchor.hash}</TableCell>
                        <TableCell>
                          <Badge className={chainColors[anchor.chain]}>{anchor.chain}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{anchor.tx_hash}</TableCell>
                        <TableCell>{anchor.block ? `#${anchor.block.toLocaleString()}` : '-'}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[anchor.status]}>
                            {anchor.status === 'confirmed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                            {anchor.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                            {anchor.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{anchor.date}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Verify
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}