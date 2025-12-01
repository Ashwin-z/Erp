import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart, Plus, Minus, Trash2, CreditCard, Wallet,
  QrCode, Search, Barcode, User, Receipt, Bitcoin
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

const sampleProducts = [
  { id: 1, sku: 'SKU-001', name: 'Premium Widget A', price: 45, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100' },
  { id: 2, sku: 'SKU-002', name: 'Industrial Sensor B', price: 199, image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=100' },
  { id: 3, sku: 'SKU-003', name: 'Office Chair Pro', price: 299, image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=100' },
  { id: 4, sku: 'SKU-004', name: 'Laptop Stand X1', price: 79, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100' },
  { id: 5, sku: 'SKU-005', name: 'Wireless Mouse Z', price: 39, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100' },
  { id: 6, sku: 'SKU-006', name: 'Keyboard Pro', price: 129, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100' }
];

export default function POS() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activeCompany, setActiveCompany] = useState("1");
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customer, setCustomer] = useState(null);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.09;
  const total = subtotal + tax;

  const filteredProducts = sampleProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className="flex-1 flex">
        {/* Products Section */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Search */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products or scan barcode..."
                className="pl-12 h-14 text-lg bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <Button size="lg" variant="outline" className="h-14 border-slate-700 text-white">
              <Barcode className="w-5 h-5" />
            </Button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addToCart(product)}
                className="bg-slate-800 rounded-xl p-4 cursor-pointer border border-slate-700 hover:border-lime-500 transition-colors"
              >
                <div className="aspect-square bg-slate-700 rounded-lg mb-3 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-white font-medium truncate">{product.name}</p>
                <p className="text-slate-400 text-sm">{product.sku}</p>
                <p className="text-lime-400 font-bold text-lg mt-1">${product.price}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="w-96 bg-slate-800 border-l border-slate-700 flex flex-col">
          {/* Customer */}
          <div className="p-4 border-b border-slate-700">
            <Button variant="outline" className="w-full justify-start border-slate-600 text-white">
              <User className="w-4 h-4 mr-2" />
              {customer ? customer.name : 'Walk-in Customer'}
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Cart is empty</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="bg-slate-700 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-slate-400 text-sm">${item.price} each</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded bg-slate-600 text-white flex items-center justify-center"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-white w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded bg-slate-600 text-white flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-lime-400 font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="p-4 border-t border-slate-700 space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>GST (9%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white text-xl font-bold pt-2 border-t border-slate-700">
              <span>Total</span>
              <span className="text-lime-400">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Buttons */}
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button className="h-14 bg-blue-600 hover:bg-blue-700">
                <CreditCard className="w-5 h-5 mr-2" />
                Card
              </Button>
              <Button className="h-14 bg-purple-600 hover:bg-purple-700">
                <Wallet className="w-5 h-5 mr-2" />
                Wallet
              </Button>
              <Button className="h-14 bg-amber-600 hover:bg-amber-700">
                <Bitcoin className="w-5 h-5 mr-2" />
                Crypto
              </Button>
              <Button className="h-14 bg-emerald-600 hover:bg-emerald-700">
                <QrCode className="w-5 h-5 mr-2" />
                QR Pay
              </Button>
            </div>
            <Button className="w-full h-16 text-lg bg-lime-500 hover:bg-lime-600 text-slate-900 font-bold">
              <Receipt className="w-5 h-5 mr-2" />
              Complete Sale
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}