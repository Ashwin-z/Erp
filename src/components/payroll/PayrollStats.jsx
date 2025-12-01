import React from 'react';
import { Wallet, Users, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

export default function PayrollStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-1" /> +2 New
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Employees</p>
            <h3 className="text-2xl font-bold text-slate-900">24</h3>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-1" /> +1.2%
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Last Payroll Cost</p>
            <h3 className="text-2xl font-bold text-slate-900">$86,400</h3>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-slate-500">
              Monthly Cycle
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Next Pay Date</p>
            <h3 className="text-2xl font-bold text-slate-900">Nov 30, 2025</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}