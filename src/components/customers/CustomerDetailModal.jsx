import React from 'react';
import ClientAIInsights from '@/components/crm/ClientAIInsights';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Mail, Phone, Smartphone, Globe, Building2, MapPin, 
  Calendar, Bell, Heart, Briefcase, Edit, ExternalLink, User, CreditCard
} from 'lucide-react';
import moment from 'moment';

export default function CustomerDetailModal({ open, onClose, customer, onEdit }) {
  if (!customer) return null;

  const hasBirthdayThisMonth = () => {
    if (!customer.birthday) return false;
    const bday = moment(customer.birthday);
    return bday.month() === moment().month();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Profile Photo or Avatar */}
              <div className="relative">
                {customer.profile_photo_url ? (
                  <img 
                    src={customer.profile_photo_url} 
                    alt={customer.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    {customer.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                {customer.name_card_url && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                    <CreditCard className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div>
                <DialogTitle className="text-xl">{customer.name}</DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  {customer.job_title && (
                    <span className="text-slate-500">{customer.job_title}</span>
                  )}
                  {customer.company_name && (
                    <>
                      {customer.job_title && <span className="text-slate-300">at</span>}
                      <span className="text-slate-600 font-medium">{customer.company_name}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={customer.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}>
                    {customer.status}
                  </Badge>
                  {customer.birthday_reminder && hasBirthdayThisMonth() && (
                    <Badge className="bg-pink-100 text-pink-700">
                      <Bell className="w-3 h-3 mr-1" />Birthday this month!
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={() => { onClose(); onEdit(customer); }}>
              <Edit className="w-4 h-4 mr-2" />Edit
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full mt-4">
          <TabsList>
            <TabsTrigger value="info">Information</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="ai">AI Insights</TabsTrigger>
            {customer.name_card_url && <TabsTrigger value="namecard">Name Card</TabsTrigger>}
          </TabsList>

          <TabsContent value="info" className="mt-4 space-y-4">
            {/* Contact Info */}
            <Card className="border-slate-200">
              <CardContent className="p-4 space-y-3">
                <h3 className="font-medium text-slate-900 flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-slate-500" />Contact Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <a href={`mailto:${customer.email}`} className="text-sm text-blue-600 hover:underline">
                        {customer.email}
                      </a>
                    </div>
                  </div>
                  
                  {customer.office_phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Office Phone</p>
                        <a href={`tel:${customer.office_phone}`} className="text-sm font-medium">
                          {customer.office_phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {customer.mobile_phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Mobile Phone</p>
                        <a href={`tel:${customer.mobile_phone}`} className="text-sm font-medium">
                          {customer.mobile_phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {customer.birthday && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Birthday</p>
                        <p className="text-sm font-medium flex items-center gap-2">
                          {moment(customer.birthday).format('DD MMMM')}
                          {customer.birthday_reminder && (
                            <Bell className="w-3 h-3 text-amber-500" />
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            {(customer.company_name || customer.address) && (
              <Card className="border-slate-200">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-medium text-slate-900 flex items-center gap-2 mb-3">
                    <Building2 className="w-4 h-4 text-slate-500" />Company Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {customer.company_name && (
                      <div>
                        <p className="text-xs text-slate-500">Company</p>
                        <p className="text-sm font-medium">{customer.company_name}</p>
                      </div>
                    )}
                    {customer.industry && (
                      <div>
                        <p className="text-xs text-slate-500">Industry</p>
                        <p className="text-sm">{customer.industry}</p>
                      </div>
                    )}
                    {customer.website && (
                      <div className="col-span-2">
                        <p className="text-xs text-slate-500">Website</p>
                        <a href={customer.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                          {customer.website} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                    {customer.address && (
                      <div className="col-span-2 flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-sm">
                            {customer.address}
                            {customer.city && `, ${customer.city}`}
                            {customer.postal_code && ` ${customer.postal_code}`}
                            {customer.country && `, ${customer.country}`}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="notes" className="mt-4 space-y-4">
            {/* Family Notes */}
            <Card className="border-pink-100 bg-pink-50/30">
              <CardContent className="p-4">
                <h3 className="font-medium text-slate-900 flex items-center gap-2 mb-3">
                  <Heart className="w-4 h-4 text-pink-500" />Family Notes
                </h3>
                {customer.family_notes ? (
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">{customer.family_notes}</p>
                ) : (
                  <p className="text-sm text-slate-400 italic">No family notes added</p>
                )}
              </CardContent>
            </Card>

            {/* Office Notes */}
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <h3 className="font-medium text-slate-900 flex items-center gap-2 mb-3">
                  <Briefcase className="w-4 h-4 text-slate-500" />Office Concerns / Notes
                </h3>
                {customer.office_notes ? (
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">{customer.office_notes}</p>
                ) : (
                  <p className="text-sm text-slate-400 italic">No office notes added</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="mt-4">
            <ClientAIInsights customer={customer} />
          </TabsContent>

          {customer.name_card_url && (
            <TabsContent value="namecard" className="mt-4">
              <Card className="border-slate-200">
                <CardContent className="p-6">
                  <img 
                    src={customer.name_card_url} 
                    alt="Name Card"
                    className="w-full max-w-lg mx-auto rounded-lg shadow-lg"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}