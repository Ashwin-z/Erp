import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, Home, FileText, CheckCircle2, Bell, User,
  DollarSign, TrendingUp, AlertTriangle, ArrowUpRight,
  ArrowDownRight, X, Check, Upload, Loader2, RefreshCw,
  CreditCard, Receipt, Building2, Sparkles, ChevronRight,
  Wifi, WifiOff
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

// Singapore dummy data for mobile
const dashboardMetrics = [
  { label: 'Cash Balance', value: 'S$248,520', change: '+8.3%', trend: 'up', icon: DollarSign },
  { label: 'AR Overdue', value: 'S$32,450', change: '4 invoices', trend: 'down', icon: AlertTriangle },
  { label: 'Pending Approvals', value: '7', change: 'Action needed', trend: 'neutral', icon: FileText },
  { label: 'AI Suggestions', value: '5', change: 'Review now', trend: 'up', icon: Sparkles },
];

const pendingApprovals = [
  { id: 1, type: 'expense', vendor: 'Amazon Web Services', amount: 2450, date: '2024-12-24', category: 'IT Infrastructure' },
  { id: 2, type: 'invoice', vendor: 'Singtel Enterprise', amount: 890, date: '2024-12-23', category: 'Telecommunications' },
  { id: 3, type: 'expense', vendor: 'Marina Bay Suites', amount: 3500, date: '2024-12-22', category: 'Office Rent' },
  { id: 4, type: 'invoice', vendor: 'Grab for Business', amount: 456, date: '2024-12-21', category: 'Transport' },
  { id: 5, type: 'expense', vendor: 'NTUC FairPrice', amount: 234, date: '2024-12-20', category: 'Office Supplies' },
];

const recentScans = [
  { id: 1, name: 'Receipt_AWS_Dec.pdf', status: 'processed', amount: 2450, confidence: 98 },
  { id: 2, name: 'Invoice_Singtel.jpg', status: 'processing', amount: null, confidence: null },
  { id: 3, name: 'Receipt_Grab.png', status: 'processed', amount: 456, confidence: 95 },
];

export default function MobileApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [approvals, setApprovals] = useState(pendingApprovals);

  // Simulate sync
  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  // Simulate OCR scan
  const handleScan = () => {
    setScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // Handle approval/rejection
  const handleApproval = (id, approved) => {
    setApprovals(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20 max-w-md mx-auto">
      {/* Status Bar */}
      <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between text-xs">
        <span>9:41</span>
        <div className="flex items-center gap-2">
          {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4 text-red-400" />}
          <span>100%</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-slate-400 text-sm">Good morning</p>
            <h1 className="text-xl font-bold">TechStart Pte Ltd</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white"
              onClick={handleSync}
            >
              <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
            </Button>
            <div className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">3</span>
            </div>
          </div>
        </div>
        
        {syncing && (
          <div className="bg-slate-800 rounded-lg p-2 text-center text-sm">
            <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
            Syncing with server...
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-3">
                {dashboardMetrics.map((metric, i) => (
                  <Card key={i} className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <metric.icon className={`w-5 h-5 ${
                          metric.trend === 'up' ? 'text-emerald-500' : 
                          metric.trend === 'down' ? 'text-amber-500' : 'text-blue-500'
                        }`} />
                        {metric.trend === 'up' && <ArrowUpRight className="w-4 h-4 text-emerald-500" />}
                        {metric.trend === 'down' && <ArrowDownRight className="w-4 h-4 text-amber-500" />}
                      </div>
                      <p className="text-lg font-bold text-slate-900">{metric.value}</p>
                      <p className="text-xs text-slate-500">{metric.label}</p>
                      <p className="text-xs text-slate-400 mt-1">{metric.change}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-900 mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-col h-20 gap-2"
                      onClick={() => setActiveTab('scan')}
                    >
                      <Camera className="w-6 h-6 text-violet-500" />
                      <span className="text-xs">Scan</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-col h-20 gap-2"
                      onClick={() => setActiveTab('approvals')}
                    >
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      <span className="text-xs">Approve</span>
                    </Button>
                    <Button variant="outline" className="flex-col h-20 gap-2">
                      <FileText className="w-6 h-6 text-blue-500" />
                      <span className="text-xs">Reports</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Pending Approvals Preview */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-900">Pending Approvals</h3>
                    <Badge variant="secondary">{approvals.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {approvals.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border">
                          {item.type === 'expense' ? <Receipt className="w-5 h-5 text-amber-500" /> : <FileText className="w-5 h-5 text-blue-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-slate-900 truncate">{item.vendor}</p>
                          <p className="text-xs text-slate-500">{item.category}</p>
                        </div>
                        <p className="font-semibold text-slate-900">S${item.amount}</p>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full mt-3 text-violet-600"
                    onClick={() => setActiveTab('approvals')}
                  >
                    View All ({approvals.length})
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'scan' && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-bold text-slate-900">Scan Receipt / Invoice</h2>
              
              {/* Camera Preview */}
              <Card className="border-0 shadow-sm overflow-hidden">
                <div className="aspect-[4/3] bg-slate-900 flex items-center justify-center relative">
                  {scanning ? (
                    <div className="text-center text-white">
                      <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
                      <p className="text-sm">Processing document...</p>
                      <Progress value={scanProgress} className="w-48 mt-4" />
                    </div>
                  ) : (
                    <div className="text-center text-white">
                      <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-sm opacity-70">Position document in frame</p>
                    </div>
                  )}
                  {/* Scan frame overlay */}
                  <div className="absolute inset-8 border-2 border-white/30 rounded-lg" />
                </div>
                <CardContent className="p-4">
                  <Button 
                    className="w-full bg-violet-600 hover:bg-violet-700"
                    onClick={handleScan}
                    disabled={scanning}
                  >
                    {scanning ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4 mr-2" />
                        Capture Document
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Scans */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-900 mb-3">Recent Scans</h3>
                  <div className="space-y-2">
                    {recentScans.map((scan) => (
                      <div key={scan.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border">
                          <FileText className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-slate-900 truncate">{scan.name}</p>
                          {scan.status === 'processed' && (
                            <p className="text-xs text-emerald-600">{scan.confidence}% confidence</p>
                          )}
                        </div>
                        {scan.status === 'processed' ? (
                          <Badge className="bg-emerald-100 text-emerald-700">S${scan.amount}</Badge>
                        ) : (
                          <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'approvals' && (
            <motion.div
              key="approvals"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-bold text-slate-900">Pending Approvals ({approvals.length})</h2>
              
              <div className="space-y-3">
                {approvals.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -100 }}
                  >
                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                            {item.type === 'expense' ? (
                              <Receipt className="w-6 h-6 text-amber-500" />
                            ) : (
                              <FileText className="w-6 h-6 text-blue-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">{item.vendor}</p>
                            <p className="text-sm text-slate-500">{item.category}</p>
                            <p className="text-xs text-slate-400">{item.date}</p>
                          </div>
                          <p className="text-xl font-bold text-slate-900">S${item.amount}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                            onClick={() => handleApproval(item.id, true)}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleApproval(item.id, false)}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {approvals.length === 0 && (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-8 text-center">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                    <p className="font-semibold text-slate-900">All caught up!</p>
                    <p className="text-sm text-slate-500">No pending approvals</p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 max-w-md mx-auto">
        <div className="flex justify-around">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'scan', icon: Camera, label: 'Scan' },
            { id: 'approvals', icon: CheckCircle2, label: 'Approvals', badge: approvals.length },
            { id: 'profile', icon: User, label: 'Profile' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center p-2 relative ${
                activeTab === tab.id ? 'text-violet-600' : 'text-slate-400'
              }`}
            >
              <tab.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{tab.label}</span>
              {tab.badge > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}