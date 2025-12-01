import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FolderOpen, Upload, Search, FileText, Image, File,
  Download, Eye, Trash2, Tag, Clock, Sparkles, Filter,
  Cloud, Link2, RefreshCw, CheckCircle2, XCircle, HardDrive
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import ModuleDashboard from '../components/modules/ModuleDashboard';

export default function Documents() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [activeTab, setActiveTab] = useState('files');

  const stats = [
    { label: 'Total Files', value: 1247, icon: FileText, color: 'bg-blue-500', trend: 8 },
    { label: 'Storage Used', value: '4.2 GB', icon: FolderOpen, color: 'bg-purple-500', trend: 12 },
    { label: 'This Month', value: 89, icon: Upload, color: 'bg-green-500', trend: 15 },
    { label: 'AI Processed', value: 456, icon: Sparkles, color: 'bg-amber-500', trend: 25 }
  ];

  const cloudStorages = [
    { id: 1, provider: 'Google Drive', icon: '📁', status: 'connected', used: '12.5 GB', total: '15 GB', lastSync: '5 mins ago', color: 'bg-blue-50' },
    { id: 2, provider: 'Dropbox', icon: '📦', status: 'connected', used: '8.2 GB', total: '10 GB', lastSync: '15 mins ago', color: 'bg-indigo-50' },
    { id: 3, provider: 'OneDrive', icon: '☁️', status: 'disconnected', used: '-', total: '-', lastSync: '-', color: 'bg-slate-50' },
    { id: 4, provider: 'AWS S3', icon: '🪣', status: 'connected', used: '45 GB', total: '100 GB', lastSync: '1 hour ago', color: 'bg-amber-50' },
    { id: 5, provider: 'Box', icon: '📋', status: 'disconnected', used: '-', total: '-', lastSync: '-', color: 'bg-slate-50' }
  ];

  const categories = [
    { id: 'all', name: 'All Files', count: 1247 },
    { id: 'invoice', name: 'Invoices', count: 456 },
    { id: 'contract', name: 'Contracts', count: 89 },
    { id: 'report', name: 'Reports', count: 234 },
    { id: 'legal', name: 'Legal', count: 67 },
    { id: 'marketing', name: 'Marketing', count: 178 }
  ];

  const documents = [
    { id: 1, name: 'Invoice-2024-156.pdf', type: 'invoice', size: '245 KB', date: '2024-12-20', tags: ['invoice', 'techstart'], linked: 'INV-2024-156', ai_summary: 'Invoice for Q4 services' },
    { id: 2, name: 'Contract-Marina-2024.pdf', type: 'contract', size: '1.2 MB', date: '2024-12-19', tags: ['contract', 'marina'], linked: 'CON-2024-023', ai_summary: 'Annual service agreement' },
    { id: 3, name: 'Q4-Financial-Report.xlsx', type: 'report', size: '890 KB', date: '2024-12-18', tags: ['report', 'finance'], linked: null, ai_summary: 'Quarterly financial summary' },
    { id: 4, name: 'Product-Catalog-2025.pdf', type: 'marketing', size: '5.4 MB', date: '2024-12-17', tags: ['marketing', 'catalog'], linked: null, ai_summary: 'Product lineup for 2025' },
    { id: 5, name: 'NDA-Skyline.pdf', type: 'legal', size: '156 KB', date: '2024-12-16', tags: ['legal', 'nda'], linked: 'CON-2024-024', ai_summary: 'Non-disclosure agreement' }
  ];

  const getFileIcon = (type) => {
    switch (type) {
      case 'invoice': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'contract': return <FileText className="w-5 h-5 text-purple-500" />;
      case 'report': return <FileText className="w-5 h-5 text-green-500" />;
      case 'legal': return <FileText className="w-5 h-5 text-red-500" />;
      case 'marketing': return <Image className="w-5 h-5 text-amber-500" />;
      default: return <File className="w-5 h-5 text-slate-500" />;
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.ai_summary?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Document Management</h1>
                <p className="text-slate-500">Upload, organize, and search documents with AI</p>
              </div>
              <Button className="bg-lime-500 hover:bg-lime-600">
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Button>
            </div>

            
            {/* Cloud Storage Connections */}
            <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
              {cloudStorages.map((storage) => (
                <Card key={storage.id} className={`flex-shrink-0 min-w-[200px] ${storage.color}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{storage.icon}</span>
                      <Badge className={storage.status === 'connected' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}>
                        {storage.status}
                      </Badge>
                    </div>
                    <p className="font-medium">{storage.provider}</p>
                    {storage.status === 'connected' ? (
                      <>
                        <p className="text-sm text-slate-500">{storage.used} / {storage.total}</p>
                        <p className="text-xs text-slate-400 mt-1">Synced: {storage.lastSync}</p>
                      </>
                    ) : (
                      <Button variant="outline" size="sm" className="mt-2 w-full">
                        <Link2 className="w-3 h-3 mr-1" />
                        Connect
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <ModuleDashboard stats={stats} />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="cloud">Cloud Storage</TabsTrigger>
                <TabsTrigger value="shared">Shared with Me</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid lg:grid-cols-4 gap-6">
              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Categories</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1 p-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === cat.id 
                            ? 'bg-lime-100 text-lime-700' 
                            : 'hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <Badge variant="secondary">{cat.count}</Badge>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Files List */}
              <div className="lg:col-span-3">
                {/* Search */}
                <div className="flex gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search files with AI..."
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>

                {/* Files */}
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {filteredDocs.map((doc) => (
                        <div key={doc.id} className="p-4 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                {getFileIcon(doc.type)}
                              </div>
                              <div>
                                <p className="font-medium">{doc.name}</p>
                                <div className="flex items-center gap-3 text-sm text-slate-500">
                                  <span>{doc.size}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {doc.date}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex gap-1">
                                {doc.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                                ))}
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon"><Download className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                              </div>
                            </div>
                          </div>
                          {doc.ai_summary && (
                            <div className="mt-2 ml-14 flex items-center gap-2 text-sm text-slate-500">
                              <Sparkles className="w-3 h-3 text-amber-500" />
                              <span>{doc.ai_summary}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}