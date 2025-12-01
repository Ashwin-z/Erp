import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ShoppingCart, Package, Truck, CreditCard, Users, 
  Megaphone, BarChart3, FileText, AlertTriangle, CheckCircle2,
  Clock, TrendingUp, ArrowRight
} from 'lucide-react';

const ecommerceWorkflows = [
  {
    id: 'product_launch',
    title: 'Product Launch Pipeline',
    icon: Package,
    color: 'bg-blue-500',
    stages: ['Planning', 'Development', 'Testing', 'Marketing', 'Launch'],
    currentStage: 2,
    tasks: 12,
    completed: 5,
    dueDate: '2025-01-15'
  },
  {
    id: 'marketing_campaign',
    title: 'Marketing Campaign',
    icon: Megaphone,
    color: 'bg-pink-500',
    stages: ['Strategy', 'Content', 'Design', 'Review', 'Live'],
    currentStage: 3,
    tasks: 8,
    completed: 6,
    dueDate: '2025-01-10'
  },
  {
    id: 'fulfillment',
    title: 'Order Fulfillment',
    icon: Truck,
    color: 'bg-green-500',
    stages: ['Received', 'Processing', 'Packed', 'Shipped', 'Delivered'],
    currentStage: 1,
    tasks: 24,
    completed: 8,
    dueDate: 'Ongoing'
  },
  {
    id: 'procurement',
    title: 'Procurement Workflow',
    icon: FileText,
    color: 'bg-amber-500',
    stages: ['PR', 'Approval', 'PO', 'Delivery', 'Payment'],
    currentStage: 2,
    tasks: 6,
    completed: 2,
    dueDate: '2025-01-20'
  }
];

const erpModules = [
  { id: 'inventory', title: 'Inventory', icon: Package, count: 156, status: 'healthy', trend: 5 },
  { id: 'sales', title: 'Sales Orders', icon: ShoppingCart, count: 42, status: 'warning', trend: -3 },
  { id: 'finance', title: 'Finance', icon: CreditCard, count: 18, status: 'healthy', trend: 12 },
  { id: 'crm', title: 'CRM Tasks', icon: Users, count: 28, status: 'healthy', trend: 8 }
];

export default function WorkflowModules({ onWorkflowClick }) {
  return (
    <div className="space-y-6">
      {/* E-Commerce Workflows */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-lime-600" />
          E-Commerce Workflows
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ecommerceWorkflows.map(workflow => {
            const progress = Math.round((workflow.completed / workflow.tasks) * 100);
            return (
              <Card 
                key={workflow.id} 
                className="cursor-pointer hover:shadow-md transition-all"
                onClick={() => onWorkflowClick && onWorkflowClick(workflow)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${workflow.color} flex items-center justify-center`}>
                        <workflow.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{workflow.title}</p>
                        <p className="text-xs text-slate-500">Due: {workflow.dueDate}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {workflow.completed}/{workflow.tasks}
                    </Badge>
                  </div>

                  {/* Stage Progress */}
                  <div className="flex items-center gap-1 mb-3">
                    {workflow.stages.map((stage, i) => (
                      <div key={i} className="flex-1 flex items-center">
                        <div className={`h-1.5 flex-1 rounded-full ${
                          i < workflow.currentStage ? 'bg-lime-500' :
                          i === workflow.currentStage ? 'bg-lime-300' : 'bg-slate-200'
                        }`} />
                        {i < workflow.stages.length - 1 && (
                          <ArrowRight className="w-3 h-3 text-slate-300 mx-0.5" />
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">
                    Current: <span className="font-medium text-slate-700">{workflow.stages[workflow.currentStage]}</span>
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ERP Integration */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          ERP Integration Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {erpModules.map(module => (
            <Card key={module.id} className="cursor-pointer hover:shadow-md transition-all">
              <CardContent className="p-4 text-center">
                <div className={`w-10 h-10 mx-auto mb-2 rounded-lg ${
                  module.status === 'healthy' ? 'bg-green-100' : 'bg-amber-100'
                } flex items-center justify-center`}>
                  <module.icon className={`w-5 h-5 ${
                    module.status === 'healthy' ? 'text-green-600' : 'text-amber-600'
                  }`} />
                </div>
                <p className="text-2xl font-bold text-slate-900">{module.count}</p>
                <p className="text-xs text-slate-500">{module.title}</p>
                <div className={`flex items-center justify-center gap-1 mt-1 text-xs ${
                  module.trend > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="w-3 h-3" />
                  {module.trend > 0 ? '+' : ''}{module.trend}%
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* SLA Monitoring */}
      <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            SLA & Delivery Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">94%</p>
              <p className="text-xs text-slate-500">On-Time Delivery</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">3</p>
              <p className="text-xs text-slate-500">At Risk Items</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">1</p>
              <p className="text-xs text-slate-500">SLA Breach</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}