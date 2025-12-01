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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Search, Eye, Edit, Truck, FileText, Trash2 } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { toast } from 'sonner';

const sampleOrders = [
  { id: 'SO-2024-156', customer: 'TechStart Pte Ltd', date: '2024-12-20', total: 15450, profit: 4850, margin: 31.4, status: 'confirmed', payment: 'unpaid' },
  { id: 'SO-2024-155', customer: 'Marina Foods', date: '2024-12-19', total: 28900, profit: 9520, margin: 32.9, status: 'processing', payment: 'partial' },
  { id: 'SO-2024-154', customer: 'Global Logistics', date: '2024-12-18', total: 8750, profit: 2625, margin: 30.0, status: 'shipped', payment: 'paid' },
  { id: 'SO-2024-153', customer: 'Urban Retail', date: '2024-12-17', total: 45200, profit: 15870, margin: 35.1, status: 'delivered', payment: 'paid' },
  { id: 'SO-2024-152', customer: 'Skyline Properties', date: '2024-12-16', total: 12300, profit: 3690, margin: 30.0, status: 'draft', payment: 'unpaid' }
];

const customers = ['TechStart Pte Ltd', 'Marina Foods', 'Global Logistics', 'Urban Retail', 'Skyline Properties'];

export default function SalesOrder() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState(sampleOrders);
  const [formOpen, setFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [form, setForm] = useState({ customer: '', customerPO: '', notes: '', items: [{ description: '', qty: 1, price: 0 }] });

  const statusColors = {
    draft: 'bg-slate-100 text-slate-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-amber-100 text-amber-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  };

  const paymentColors = {
    unpaid: 'bg-red-100 text-red-700',
    partial: 'bg-amber-100 text-amber-700',
    paid: 'bg-green-100 text-green-700'
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreate = () => {
    setEditingOrder(null);
    setForm({ customer: '', customerPO: '', notes: '', items: [{ description: '', qty: 1, price: 0 }] });
    setFormOpen(true);
  };

  const openEdit = (order) => {
    setEditingOrder(order);
    setForm({ customer: order.customer, customerPO: '', notes: '', items: [{ description: 'Sample Item', qty: 1, price: order.total }] });
    setFormOpen(true);
  };

  const addItem = () => setForm({ ...form, items: [...form.items, { description: '', qty: 1, price: 0 }] });
  const removeItem = (index) => setForm({ ...form, items: form.items.filter((_, i) => i !== index) });
  const updateItem = (index, field, value) => {
    const newItems = [...form.items];
    newItems[index][field] = value;
    setForm({ ...form, items: newItems });
  };
  const calculateTotal = () => form.items.reduce((sum, item) => sum + (item.qty * item.price), 0);

  const saveOrder = () => {
    if (!form.customer) { toast.error('Please select a customer'); return; }
    const total = calculateTotal();
    const newOrder = {
      id: editingOrder?.id || `SO-2024-${String(157 + orders.length).padStart(3, '0')}`,
      customer: form.customer,
      date: new Date().toISOString().split('T')[0],
      total,
      profit: Math.round(total * 0.3),
      margin: 30,
      status: 'draft',
      payment: 'unpaid'
    };
    if (editingOrder) {
      setOrders(orders.map(o => o.id === editingOrder.id ? { ...editingOrder, ...newOrder, status: editingOrder.status } : o));
      toast.success('Order updated');
    } else {
      setOrders([newOrder, ...orders]);
      toast.success('Sales Order created');
    }
    setFormOpen(false);
  };

  const confirmOrder = (order) => {
    setOrders(orders.map(o => o.id === order.id ? { ...o, status: 'confirmed' } : o));
    toast.success(`Order ${order.id} confirmed`);
  };

  const processOrder = (order) => {
    setOrders(orders.map(o => o.id === order.id ? { ...o, status: 'processing' } : o));
    toast.success(`Order ${order.id} is now processing`);
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
                <h1 className="text-2xl font-bold text-slate-900">Sales Orders</h1>
                <p className="text-slate-500">Manage confirmed orders and track fulfillment</p>
              </div>
              <Button className="bg-lime-500 hover:bg-lime-600" onClick={openCreate}>
                <Plus className="w-4 h-4 mr-2" />New Order
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Total Orders</p><p className="text-2xl font-bold">{orders.length}</p></CardContent></Card>
              <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Processing</p><p className="text-2xl font-bold text-amber-600">{orders.filter(o => o.status === 'processing').length}</p></CardContent></Card>
              <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Shipped</p><p className="text-2xl font-bold text-purple-600">{orders.filter(o => o.status === 'shipped').length}</p></CardContent></Card>
              <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Total Revenue</p><p className="text-2xl font-bold">${orders.reduce((s, o) => s + o.total, 0).toLocaleString()}</p></CardContent></Card>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="p-4 border-b">
                  <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Search orders..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Profit</TableHead>
                      <TableHead>Margin</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell className="font-medium">${order.total.toLocaleString()}</TableCell>
                        <TableCell className="text-green-600">${order.profit.toLocaleString()}</TableCell>
                        <TableCell>{order.margin}%</TableCell>
                        <TableCell><Badge className={statusColors[order.status]}>{order.status}</Badge></TableCell>
                        <TableCell><Badge className={paymentColors[order.payment]}>{order.payment}</Badge></TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(order)}><Edit className="w-4 h-4" /></Button>
                            {order.status === 'draft' && <Button variant="ghost" size="icon" onClick={() => confirmOrder(order)}><FileText className="w-4 h-4 text-blue-500" /></Button>}
                            {order.status === 'confirmed' && <Button variant="ghost" size="icon" onClick={() => processOrder(order)}><Truck className="w-4 h-4 text-amber-500" /></Button>}
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

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editingOrder ? 'Edit Order' : 'New Sales Order'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer *</Label>
                <Select value={form.customer} onValueChange={(v) => setForm({ ...form, customer: v })}>
                  <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                  <SelectContent>{customers.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Customer PO #</Label>
                <Input value={form.customerPO} onChange={(e) => setForm({ ...form, customerPO: e.target.value })} placeholder="PO-XXX" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center"><Label>Line Items</Label><Button variant="outline" size="sm" onClick={addItem}><Plus className="w-3 h-3 mr-1" />Add</Button></div>
              {form.items.map((item, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input placeholder="Description" value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)} className="flex-1" />
                  <Input type="number" value={item.qty} onChange={(e) => updateItem(i, 'qty', parseInt(e.target.value) || 0)} className="w-20" />
                  <Input type="number" value={item.price} onChange={(e) => updateItem(i, 'price', parseFloat(e.target.value) || 0)} className="w-28" />
                  {form.items.length > 1 && <Button variant="ghost" size="icon" onClick={() => removeItem(i)}><Trash2 className="w-4 h-4 text-red-500" /></Button>}
                </div>
              ))}
              <div className="text-right font-bold text-lg">Total: ${calculateTotal().toLocaleString()}</div>
            </div>
            <div className="space-y-2"><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button className="bg-lime-500 hover:bg-lime-600" onClick={saveOrder}>{editingOrder ? 'Update' : 'Create'} Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}