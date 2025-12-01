import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Monitor, Plus, Search, Wrench, User, MapPin,
  Calendar, DollarSign, AlertTriangle, QrCode, BarChart3
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import ModuleDashboard from '../components/modules/ModuleDashboard';

export default function AssetManagement() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [activeTab, setActiveTab] = useState('all');

  const stats = [
    { label: 'Total Assets', value: 456, icon: Monitor, color: 'bg-blue-500', trend: 5 },
    { label: 'In Use', value: 389, icon: User, color: 'bg-green-500', trend: 3 },
    { label: 'Maintenance Due', value: 12, icon: Wrench, color: 'bg-amber-500', trend: -15 },
    { label: 'Total Value', value: '$1.2M', icon: DollarSign, color: 'bg-purple-500', trend: 8 }
  ];

  const assets = [
    { id: 'AST-001', name: 'MacBook Pro 16"', category: 'hardware', serial: 'C02X12345', status: 'in_use', assignedTo: 'Sarah Chen', location: 'HQ - Level 5', value: 3200, warranty: '2025-06-15' },
    { id: 'AST-002', name: 'Dell Monitor 27"', category: 'hardware', serial: 'DL89012345', status: 'in_use', assignedTo: 'John Lee', location: 'HQ - Level 5', value: 450, warranty: '2024-12-31' },
    { id: 'AST-003', name: 'Cisco Router', category: 'equipment', serial: 'CS56789012', status: 'maintenance', assignedTo: null, location: 'Server Room', value: 2800, warranty: '2025-03-20' },
    { id: 'AST-004', name: 'Office Chair Premium', category: 'furniture', serial: 'CH34567890', status: 'available', assignedTo: null, location: 'Storage', value: 650, warranty: null },
    { id: 'AST-005', name: 'Adobe Creative Suite', category: 'software', serial: 'ACS-2024-001', status: 'in_use', assignedTo: 'Emily Wong', location: 'Cloud', value: 1200, warranty: '2024-12-31' }
  ];

  const statusColors = {
    available: 'bg-green-100 text-green-700',
    in_use: 'bg-blue-100 text-blue-700',
    maintenance: 'bg-amber-100 text-amber-700',
    retired: 'bg-slate-100 text-slate-700',
    disposed: 'bg-red-100 text-red-700'
  };

  const categoryIcons = {
    hardware: Monitor,
    software: BarChart3,
    furniture: MapPin,
    equipment: Wrench,
    vehicle: MapPin
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Asset Management</h1>
                <p className="text-slate-500">Track hardware, software, and equipment with depreciation</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <QrCode className="w-4 h-4 mr-2" />
                  Scan Asset
                </Button>
                <Button className="bg-lime-500 hover:bg-lime-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Asset
                </Button>
              </div>
            </div>

            <ModuleDashboard stats={stats} />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Assets</TabsTrigger>
                <TabsTrigger value="hardware">Hardware</TabsTrigger>
                <TabsTrigger value="software">Software</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              </TabsList>
            </Tabs>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Asset Registry</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Search assets..." className="pl-10" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Warranty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assets.map(asset => {
                      const Icon = categoryIcons[asset.category] || Monitor;
                      return (
                        <TableRow key={asset.id} className="cursor-pointer hover:bg-slate-50">
                          <TableCell className="font-mono">{asset.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-slate-400" />
                              {asset.name}
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">{asset.category}</TableCell>
                          <TableCell><Badge className={statusColors[asset.status]}>{asset.status.replace('_', ' ')}</Badge></TableCell>
                          <TableCell>{asset.assignedTo || <span className="text-slate-400">Unassigned</span>}</TableCell>
                          <TableCell>{asset.location}</TableCell>
                          <TableCell>${asset.value.toLocaleString()}</TableCell>
                          <TableCell>
                            {asset.warranty ? (
                              <span className={new Date(asset.warranty) < new Date() ? 'text-red-600' : ''}>{asset.warranty}</span>
                            ) : '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
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