import React, { useState } from 'react';
import { 
  Building, Building2, ArrowRightLeft, CheckCircle 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function IntercompanyRecon() {
  const [transactions] = useState([
    { id: 1, from: 'Parent Co', to: 'Sub Asia', amount: 50000, type: 'Management Fee', status: 'Matched' },
    { id: 2, from: 'Sub Asia', to: 'Parent Co', amount: 50000, type: 'Payable', status: 'Matched' },
    { id: 3, from: 'Parent Co', to: 'Sub Europe', amount: 12000, type: 'Loan', status: 'Unmatched' },
  ]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
            <CardTitle>Intercompany Elimination</CardTitle>
        </div>
        <Button size="sm" variant="outline">Run Elimination Rules</Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6 bg-slate-50 p-4 rounded-lg border">
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                    <Building className="w-8 h-8 text-slate-400 mb-1" />
                    <span className="text-xs font-medium">Entity A</span>
                </div>
                <ArrowRightLeft className="w-4 h-4 text-slate-300" />
                <div className="flex flex-col items-center">
                    <Building2 className="w-8 h-8 text-slate-400 mb-1" />
                    <span className="text-xs font-medium">Entity B</span>
                </div>
            </div>
            <div className="text-right">
                <div className="text-sm text-slate-500">Eliminated Volume</div>
                <div className="text-xl font-bold text-indigo-600">$1.2M</div>
            </div>
        </div>

        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Origin Entity</TableHead>
                    <TableHead>Target Entity</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.map(tx => (
                    <TableRow key={tx.id}>
                        <TableCell>{tx.from}</TableCell>
                        <TableCell>{tx.to}</TableCell>
                        <TableCell>{tx.type}</TableCell>
                        <TableCell className="text-right">${tx.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-center">
                            <Badge variant={tx.status === 'Matched' ? 'default' : 'destructive'} className={
                                tx.status === 'Matched' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : ''
                            }>
                                {tx.status}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}