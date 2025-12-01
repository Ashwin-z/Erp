import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Upload, CreditCard, Plus, 
  Image as ImageIcon, BarChart, Settings, HelpCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from 'sonner';

export default function AdvertiserPortal() {
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    setUploading(true);
    // Simulate upload
    setTimeout(() => {
        setUploading(false);
        toast.success("Creative uploaded successfully!");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Simple Advertiser Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
                <div className="p-2 bg-indigo-600 text-white rounded-lg">AD</div>
                Advertiser
            </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
            <Button variant="ghost" className="w-full justify-start bg-slate-100 text-indigo-600 font-medium">
                <LayoutDashboard className="w-4 h-4 mr-2" /> Overview
            </Button>
            <Button variant="ghost" className="w-full justify-start text-slate-600">
                <BarChart className="w-4 h-4 mr-2" /> Campaigns
            </Button>
            <Button variant="ghost" className="w-full justify-start text-slate-600">
                <ImageIcon className="w-4 h-4 mr-2" /> Creatives
            </Button>
            <Button variant="ghost" className="w-full justify-start text-slate-600">
                <CreditCard className="w-4 h-4 mr-2" /> Billing
            </Button>
            <Button variant="ghost" className="w-full justify-start text-slate-600">
                <Settings className="w-4 h-4 mr-2" /> Settings
            </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Welcome back, Urban Retail</h1>
                    <p className="text-slate-500">Manage your campaigns and performance.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="w-4 h-4 mr-2" /> Create Campaign
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-lg">
                    <CardContent className="p-6">
                        <p className="text-indigo-100 text-sm mb-1">Wallet Balance</p>
                        <h3 className="text-3xl font-bold">$2,450.00</h3>
                        <Button size="sm" variant="secondary" className="mt-4 w-full bg-white/10 hover:bg-white/20 text-white border-none">
                            <CreditCard className="w-4 h-4 mr-2" /> Top Up
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Active Campaigns</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">3</div>
                        <p className="text-xs text-emerald-600 flex items-center mt-1">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" /> Running now
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Impressions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">145.2k</div>
                        <p className="text-xs text-slate-500 mt-1">Last 30 days</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Tabs */}
            <Tabs defaultValue="creatives" className="space-y-6">
                <TabsList className="bg-white border border-slate-200 p-1">
                    <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
                    <TabsTrigger value="creatives">Ad Creatives</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="creatives">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ad Creatives</CardTitle>
                            <CardDescription>Upload and manage your ad banners and assets.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer" onClick={handleUpload}>
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <h3 className="font-medium text-slate-900">Upload New Creative</h3>
                                <p className="text-sm text-slate-500 mt-1">Drag and drop or click to upload (Images, Video)</p>
                                {uploading && <p className="text-sm text-indigo-600 mt-2 font-medium animate-pulse">Uploading...</p>}
                            </div>

                            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="group relative border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all">
                                        <div className="aspect-video bg-slate-100 relative">
                                            <img 
                                                src={`https://images.unsplash.com/photo-${i === 1 ? '1557804506-669a67965ba0' : i === 2 ? '1556761175-5973dc0f32e7' : '1556761175-4b46a872b5eb'}?w=400&h=225&fit=crop`} 
                                                alt="Ad" 
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <Button size="sm" variant="secondary">Edit</Button>
                                                <Button size="sm" variant="destructive">Delete</Button>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <h4 className="font-medium text-sm truncate">Summer Sale Banner {i}</h4>
                                            <p className="text-xs text-slate-500">300x250 • JPG</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="campaigns">
                    <Card>
                        <CardContent className="py-8 text-center text-slate-500">
                            Campaign management placeholder
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
      </div>
    </div>
  );
}