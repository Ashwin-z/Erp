import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ShieldCheck, Search, Filter, ArrowRight, 
  FileText, Clock, Hash, CheckCircle2, 
  ExternalLink, RefreshCw, ChevronRight, Calendar,
  Globe, Lock, Building2
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { base44 } from '@/api/base44Client';

export default function RWABlockchain() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Combine real and mock data for a full "Audit Ledger" feel
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // In a real scenario, we'd fetch from base44.entities.BlockchainAnchor.list()
      // For this demo, we'll generate "No Brainer" clear data as requested
      
      const mockLedger = Array(20).fill(0).map((_, i) => ({
        id: `ANCHOR-2024-${8821 - i}`,
        transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`,
        timestamp: new Date(Date.now() - i * 45 * 60000).toISOString(),
        
        // Clear "No Brainer" Columns
        itemName: [
          "Commercial Property - 12 Marina Blvd",
          "Luxury Yacht - The Azimuth 88",
          "Fine Art - 'The Solitude'",
          "Gold Bullion - Batch #9921",
          "Corporate Bond - Series A",
          "Carbon Credit - Vintage 2024"
        ][i % 6],
        
        description: [
          "Minting of 1,000,000 Fractional Tokens",
          "Ownership Transfer to SPV",
          "Valuation Report Update (Q4)",
          "Audit Verification Log",
          "Dividend Distribution Executed",
          "Retired Credit Certificate"
        ][i % 6],
        
        type: [
          "Token Mint", "Transfer", "Valuation", "Audit Log", "Payout", "Retirement"
        ][i % 6],
        
        party: [
          "ArkFinex Treasury", "Legal Trustee", "Sotheby's Valuation", "Deloitte Audit", "DBS Custody", "Verra Registry"
        ][i % 6],
        
        status: "Confirmed",
        blockNumber: 15243992 - i
      }));
      
      setTransactions(mockLedger);
      setLoading(false);
    };
    
    loadData();
  }, []);

  const filteredData = transactions.filter(tx => 
    tx.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.transactionHash.includes(searchTerm)
  );

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto bg-slate-950">
          <div className="p-8 max-w-[1800px] mx-auto">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  RWA Blockchain Explorer
                </h1>
                <p className="text-slate-400 mt-2 max-w-2xl">
                  Immutable, real-time audit ledger of all Real World Asset (RWA) transactions. 
                  Every line represents a cryptographically verified action on the public blockchain.
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  <ExternalLink className="w-4 h-4 mr-2" /> View on PolygonScan
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <div className="text-slate-400 text-xs uppercase tracking-wider font-medium mb-2">Total Assets Anchored</div>
                  <div className="text-3xl font-bold text-white">$142.5M</div>
                  <div className="text-emerald-400 text-xs mt-1 flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> 100% Verified
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <div className="text-slate-400 text-xs uppercase tracking-wider font-medium mb-2">Total Transactions</div>
                  <div className="text-3xl font-bold text-white">8,921</div>
                  <div className="text-slate-500 text-xs mt-1">Last 24h: +124</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <div className="text-slate-400 text-xs uppercase tracking-wider font-medium mb-2">Active Validators</div>
                  <div className="text-3xl font-bold text-white">12</div>
                  <div className="text-cyan-400 text-xs mt-1 flex items-center">
                    <Globe className="w-3 h-3 mr-1" /> Distributed Global
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <div className="text-slate-400 text-xs uppercase tracking-wider font-medium mb-2">Network Status</div>
                  <div className="text-3xl font-bold text-emerald-400">Online</div>
                  <div className="text-slate-500 text-xs mt-1">Block Time: 2.1s</div>
                </CardContent>
              </Card>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input 
                  placeholder="Search by Item Name, Transaction ID, or Description..." 
                  className="pl-12 h-12 bg-slate-900 border-slate-800 text-white text-lg rounded-xl focus:ring-emerald-500/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button size="lg" className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white px-8 rounded-xl">
                <Search className="w-5 h-5 mr-2" /> Search Ledger
              </Button>
              <Button size="lg" variant="outline" className="h-12 border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl">
                <Filter className="w-5 h-5 mr-2" /> Filters
              </Button>
            </div>

            {/* The "Clear Table" */}
            <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden rounded-xl">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-950">
                    <TableRow className="border-slate-800 hover:bg-transparent">
                      <TableHead className="text-slate-400 font-bold uppercase text-xs tracking-wider py-5 pl-6 w-[250px]">Transaction Info</TableHead>
                      <TableHead className="text-slate-400 font-bold uppercase text-xs tracking-wider py-5 w-[250px]">Item / Asset</TableHead>
                      <TableHead className="text-slate-400 font-bold uppercase text-xs tracking-wider py-5 w-[400px]">Description</TableHead>
                      <TableHead className="text-slate-400 font-bold uppercase text-xs tracking-wider py-5">Initiator</TableHead>
                      <TableHead className="text-slate-400 font-bold uppercase text-xs tracking-wider py-5">Timestamp</TableHead>
                      <TableHead className="text-slate-400 font-bold uppercase text-xs tracking-wider py-5 text-center">Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((tx) => (
                      <TableRow 
                        key={tx.id} 
                        className="border-slate-800 hover:bg-slate-800/60 cursor-pointer transition-colors group"
                        onClick={() => navigate(createPageUrl('BlockchainAuditDetail'))}
                      >
                        {/* Transaction Info */}
                        <TableCell className="py-4 pl-6 align-top">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Hash className="w-3 h-3 text-slate-500" />
                              <span className="font-mono text-cyan-400 text-xs">
                                {tx.transactionHash.substring(0, 10)}...
                              </span>
                            </div>
                            <Badge variant="outline" className="w-fit border-slate-700 text-slate-400 text-[10px]">
                              Block #{tx.blockNumber}
                            </Badge>
                          </div>
                        </TableCell>

                        {/* Item / Asset */}
                        <TableCell className="py-4 align-top">
                          <div className="flex flex-col gap-1">
                            <span className="text-white font-medium text-sm">{tx.itemName}</span>
                            <span className="text-slate-500 text-xs">{tx.type}</span>
                          </div>
                        </TableCell>

                        {/* Description */}
                        <TableCell className="py-4 align-top">
                          <span className="text-slate-300 text-sm leading-relaxed">
                            {tx.description}
                          </span>
                        </TableCell>

                        {/* Initiator */}
                        <TableCell className="py-4 align-top">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-3 h-3 text-slate-500" />
                            <span className="text-slate-400 text-sm">{tx.party}</span>
                          </div>
                        </TableCell>

                        {/* Timestamp */}
                        <TableCell className="py-4 align-top">
                          <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <Clock className="w-3 h-3" />
                            {new Date(tx.timestamp).toLocaleString()}
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="py-4 align-top text-center">
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {tx.status}
                          </Badge>
                        </TableCell>

                        {/* Arrow */}
                        <TableCell className="py-4 align-middle text-right pr-6">
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>

          </div>
        </main>
      </div>
    </div>
  );
}