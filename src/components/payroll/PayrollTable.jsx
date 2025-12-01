import React from 'react';
import { Download, Eye, MoreVertical, Mail } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PayrollTable({ slips, loading }) {
  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading payroll data...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[300px]">Employee</TableHead>
            <TableHead>ID & Role</TableHead>
            <TableHead>Period</TableHead>
            <TableHead className="text-right">Gross Pay</TableHead>
            <TableHead className="text-right">Deductions</TableHead>
            <TableHead className="text-right">Net Pay</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {slips.map((slip) => (
            <TableRow key={slip.id} className="hover:bg-slate-50/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${slip.employee_name}`} />
                    <AvatarFallback>{slip.employee_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-slate-900">{slip.employee_name}</div>
                    <div className="text-xs text-slate-500">{slip.department || 'Engineering'}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                    <span className="font-mono text-xs text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded w-fit">
                        {slip.employee}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                        {slip.designation || 'Employee'}
                    </span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-slate-600">
                {slip.start_date} <span className="text-slate-400">to</span> {slip.end_date}
              </TableCell>
              <TableCell className="text-right font-mono text-slate-700">
                ${slip.gross_pay?.toLocaleString(undefined, {minimumFractionDigits: 2})}
              </TableCell>
              <TableCell className="text-right font-mono text-red-600">
                -${slip.total_deduction?.toLocaleString(undefined, {minimumFractionDigits: 2})}
              </TableCell>
              <TableCell className="text-right">
                <span className="font-bold font-mono text-emerald-600">
                    ${slip.net_pay?.toLocaleString(undefined, {minimumFractionDigits: 2})}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <Badge 
                    variant={slip.status === 'Paid' ? 'default' : 'secondary'}
                    className={slip.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 shadow-none' : 'bg-slate-100 text-slate-700 hover:bg-slate-100 shadow-none'}
                >
                  {slip.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                        <Eye className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" /> Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Mail className="w-4 h-4 mr-2" /> Email Slip
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {slips.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center text-slate-500">
                    <p className="text-sm">No salary slips generated for this period.</p>
                    <p className="text-xs mt-1">Run payroll to generate new slips.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}