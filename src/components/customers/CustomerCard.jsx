import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Mail, Phone, Smartphone, Building2, MapPin, Calendar, Bell,
  MoreHorizontal, Pencil, Trash2, Eye, CreditCard
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import moment from 'moment';

export default function CustomerCard({ customer, onView, onEdit, onDelete }) {
  const hasBirthdayThisMonth = () => {
    if (!customer.birthday) return false;
    const bday = moment(customer.birthday);
    return bday.month() === moment().month();
  };

  return (
    <Card 
      className="border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all duration-200 cursor-pointer group"
      onClick={() => onView(customer)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Avatar / Name Card Thumbnail */}
          <div className="relative flex-shrink-0">
            {customer.name_card_url ? (
              <div className="relative">
                <img 
                  src={customer.name_card_url} 
                  alt="Name Card"
                  className="w-16 h-16 rounded-lg object-cover border-2 border-slate-100 shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                  <CreditCard className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
            ) : customer.profile_photo_url ? (
              <img 
                src={customer.profile_photo_url} 
                alt={customer.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-sm">
                {customer.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                  {customer.name}
                </h3>
                {customer.company_name && (
                  <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-0.5">
                    <Building2 className="w-3 h-3" />
                    <span className="truncate">{customer.company_name}</span>
                  </div>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(customer); }}>
                    <Eye className="w-4 h-4 mr-2" />View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(customer); }}>
                    <Pencil className="w-4 h-4 mr-2" />Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={(e) => { e.stopPropagation(); onDelete(customer); }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Contact Info */}
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{customer.email}</span>
              </div>
              {(customer.mobile_phone || customer.office_phone) && (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  {customer.mobile_phone ? (
                    <>
                      <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{customer.mobile_phone}</span>
                    </>
                  ) : (
                    <>
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{customer.office_phone}</span>
                    </>
                  )}
                </div>
              )}
              {customer.city && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{customer.city}, {customer.country || 'Singapore'}</span>
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge className={customer.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}>
                {customer.status || 'active'}
              </Badge>
              {customer.industry && (
                <Badge variant="outline" className="text-xs">{customer.industry}</Badge>
              )}
              {customer.birthday_reminder && hasBirthdayThisMonth() && (
                <Badge className="bg-pink-100 text-pink-700">
                  <Bell className="w-3 h-3 mr-1" />Birthday
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}