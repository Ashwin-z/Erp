import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Search, Eye, Edit, Truck, Package, CheckCircle2 } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { toast } from 'sonner';

const sampleDeliveries = [
  { id: 'DO-2024-078', orderId: 'SO-2024-156', customer: 'TechStart Pte Ltd', date: '2024-12-20', items: 5, status: 'pending', carrier: 'DHL', tracking: '' },
  { id: 'DO-2024-077', orderId: 'SO-2024-155', customer: 'Marina Foods', date: '2024-12-19', items: 8, status: 'picked', carrier: 'FedEx', tracking: '' },
  { id: 'DO-2024-076', orderId: 'SO-2024-154', customer: 'Global Logistics', date: '2024-12-18', items: 3, status: 'shipped', carrier: 'DHL', tracking: 'DHL123456789' },
  { id: 'DO-2024-075', orderId: 'SO-2024-153', customer: 'Urban Retail', date: '2024-12-17', items: 12, status: 'delivered', carrier: 'UPS', tracking: 'UPS987654321' },
];

export default function SalesDelivery() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [searchTerm, setSearchTerm] = useState('');
  const [deliveries, setDeliveries] = useState(sampleDeliveries);
  const [shipModal, setShipModal] = useState({ open: false, delivery: null });
  const [tracking, setTracking] = useState('');

  const statusColors = {
    pending: 'bg-slate-100 text-slate-700',
    picked: 'bg-amber-100 text-amber-700',
    packed: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700'
  };

  const filteredDeliveries = deliveries.filter(d => 
    d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pickOrder = (delivery) => {
    setDeliveries(deliveries.map(d => d.id === delivery.id ? { ...d, status: 'picked' } : d));
    toast.success(`${delivery.id} picked and ready for packing`);
  };

  const packOrder = (delivery) => {
    setDeliveries(deliveries.map(d => d.id === delivery.id ? { ...d, status: 'packed' } : d));
    toast.success(`${delivery.id} packed and ready for shipping`);
  };

  const openShipModal = (delivery) => {
    setShipModal({ open: true, delivery });
    setTracking('');
  };

  const shipOrder = () => {
    if (!tracking) { toast.error('Please enter tracking number'); return; }
    setDeliveries(deliveries.map(d => d.id === shipModal.delivery.id ? { ...d, status: 'shipped', tracking } : d));
    toast.success(`${shipModal.delivery.id} shipped`);
    setShipModal({ open: false, delivery: null });
  };

  const confirmDelivery = (delivery) => {
    setDeliveries(deliveries.map(d => d.id === delivery.id ? { ...d, status: 'delivered' } : d));
    toast.success(`${delivery.id} marked as delivered`);
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1600px] mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Link to={createPageUrl('Sales')}>
                <Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-900">Deliveries</h1>
                <p className="text-slate-500">Pick, pack, and ship orders to customers</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Pending Pick</p><p className="text-2xl font-bold">{deliveries.filter(d => d.status === 'pending').length}</p></CardContent></Card>
              <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Ready to Ship</p><p className="text-2xl font-bold text-amber-600">{deliveries.filter(d => d.status === 'packed').length}</p></CardContent></Card>
              <Card><CardContent className="p-4"><p className="text-sm text-slate-500">In Transit</p><p className="text-2xl font-bold text-purple-600">{deliveries.filter(d => d.status === 'shipped').length}</p></CardContent></Card>
              <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Delivered</p><p className="text-2xl font-bold text-green-600">{deliveries.filter(d => d.status === 'delivered').length}</p></CardContent></Card>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="p-4 border-b">
                  <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Search deliveries..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>DO #</TableHead>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Carrier</TableHead>
                      <TableHead>Tracking</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDeliveries.map((delivery) => (
                      <TableRow key={delivery.id}>
                        <TableCell className="font-mono font-medium">{delivery.id}</TableCell>
                        <TableCell className="font-mono text-slate-500">{delivery.orderId}</TableCell>
                        <TableCell>{delivery.customer}</TableCell>
                        <TableCell>{delivery.date}</TableCell>
                        <TableCell>{delivery.items}</TableCell>
                        <TableCell>{delivery.carrier}</TableCell>
                        <TableCell className="font-mono text-xs">{delivery.tracking || '-'}</TableCell>
                        <TableCell><Badge className={statusColors[delivery.status]}>{delivery.status}</Badge></TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {delivery.status === 'pending' && <Button variant="ghost" size="sm" onClick={() => pickOrder(delivery)}>Pick</Button>}
                            {delivery.status === 'picked' && <Button variant="ghost" size="sm" onClick={() => packOrder(delivery)}><Package className="w-4 h-4 mr-1" />Pack</Button>}
                            {delivery.status === 'packed' && <Button variant="ghost" size="sm" onClick={() => openShipModal(delivery)}><Truck className="w-4 h-4 mr-1" />Ship</Button>}
                            {delivery.status === 'shipped' && <Button variant="ghost" size="sm" onClick={() => confirmDelivery(delivery)}><CheckCircle2 className="w-4 h-4 mr-1" />Confirm</Button>}
                          </div>
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

      <Dialog open={shipModal.open} onOpenChange={(open) => setShipModal({ open, delivery: shipModal.delivery })}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ship Order</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-slate-500">Enter tracking number for {shipModal.delivery?.id}</p>
            <div className="space-y-2">
              <Label>Tracking Number *</Label>
              <Input value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="Enter tracking number" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShipModal({ open: false, delivery: null })}>Cancel</Button>
            <Button className="bg-lime-500 hover:bg-lime-600" onClick={shipOrder}>Confirm Shipment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}