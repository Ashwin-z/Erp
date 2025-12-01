import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Link2, Copy, ExternalLink, Clock, DollarSign, 
  Users, Settings, Plus, BarChart3, CheckCircle2
} from 'lucide-react';
import { toast } from "sonner";

export default function BookingLinks({ bookingTypes, onEdit, onCreate }) {
  const copyLink = (link) => {
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-purple-500" />
          Booking Links
        </CardTitle>
        <Button onClick={onCreate} size="sm" className="bg-purple-500 hover:bg-purple-600">
          <Plus className="w-4 h-4 mr-1" />
          New Link
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {(bookingTypes || []).map(booking => (
          <div 
            key={booking.id}
            className="p-4 border rounded-xl hover:shadow-md transition-shadow"
            style={{ borderLeftColor: booking.color, borderLeftWidth: 4 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{booking.name}</h3>
                  <Badge variant={booking.status === 'active' ? 'default' : 'secondary'}>
                    {booking.status}
                  </Badge>
                  {booking.requires_payment && (
                    <Badge className="bg-green-100 text-green-700">
                      <DollarSign className="w-3 h-3 mr-1" />
                      ${booking.price}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-1">{booking.description}</p>
                
                <div className="flex items-center gap-4 mt-3 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {booking.duration_minutes} mins
                  </span>
                  {booking.hosts?.length > 1 && (
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {booking.hosts.length} hosts
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <BarChart3 className="w-4 h-4" />
                    {booking.total_bookings || 0} bookings
                  </span>
                </div>

                {/* Booking Link */}
                <div className="flex items-center gap-2 mt-3 p-2 bg-slate-50 rounded-lg">
                  <Link2 className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600 flex-1 truncate">
                    {booking.booking_link || `arkfinex.com/book/${booking.slug}`}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyLink(booking.booking_link || `arkfinex.com/book/${booking.slug}`)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Switch checked={booking.status === 'active'} />
                <Button variant="ghost" size="sm" onClick={() => onEdit(booking)}>
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            {booking.total_bookings > 0 && (
              <div className="flex gap-4 mt-4 pt-4 border-t">
                <div className="text-center flex-1">
                  <p className="text-lg font-bold text-green-600">{booking.total_bookings}</p>
                  <p className="text-xs text-slate-500">Total Bookings</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-lg font-bold">85%</p>
                  <p className="text-xs text-slate-500">Completion Rate</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-lg font-bold text-purple-600">$2.4K</p>
                  <p className="text-xs text-slate-500">Revenue</p>
                </div>
              </div>
            )}
          </div>
        ))}

        {(!bookingTypes || bookingTypes.length === 0) && (
          <div className="text-center py-8 text-slate-400">
            <Link2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No booking links yet</p>
            <Button onClick={onCreate} variant="outline" className="mt-4">
              Create Your First Booking Link
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}