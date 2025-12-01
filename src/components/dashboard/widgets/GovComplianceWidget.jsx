import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, Shield, Globe, Building2, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import moment from 'moment';

export default function GovComplianceWidget() {
  const { data: irasSubmissions = [] } = useQuery({
    queryKey: ['iras-submissions'],
    queryFn: () => base44.entities.IRASSubmission.list('-created_date', 1)
  });

  const { data: cpfSubmissions = [] } = useQuery({
    queryKey: ['cpf-submissions'],
    queryFn: () => base44.entities.CPFSubmission.list('-created_date', 1)
  });

  const { data: acraFilings = [] } = useQuery({
    queryKey: ['acra-filings'],
    queryFn: () => base44.entities.ACRAFiling.list('-created_date', 1)
  });

  const getStatusColor = (status) => {
    if (['accepted', 'approved', 'lodged'].includes(status)) return 'bg-emerald-100 text-emerald-700';
    if (['submitted', 'pending', 'pending_approval'].includes(status)) return 'bg-blue-100 text-blue-700';
    return 'bg-slate-100 text-slate-600';
  };

  const items = [
    { name: 'IRAS GST', icon: DollarSign, data: irasSubmissions[0], dateField: 'submitted_at', status: irasSubmissions[0]?.status || 'No filing' },
    { name: 'CPF Board', icon: Shield, data: cpfSubmissions[0], dateField: 'submitted_at', status: cpfSubmissions[0]?.status || 'No filing' },
    { name: 'ACRA', icon: Building2, data: acraFilings[0], dateField: 'submitted_at', status: acraFilings[0]?.status || 'No filing' }
  ];

  return (
    <Card className="border-slate-200 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-600" />Gov Compliance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                <item.icon className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-[10px] text-slate-500">
                  {item.data ? moment(item.data[item.dateField]).format('DD MMM YYYY') : 'Pending'}
                </p>
              </div>
            </div>
            <Badge className={getStatusColor(item.status)} variant="secondary">
              {item.status.replace('_', ' ')}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}