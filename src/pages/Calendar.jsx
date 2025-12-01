import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar as CalendarIcon, Plus, Video, Users, Clock, MapPin,
  ChevronLeft, ChevronRight, Link2, RefreshCw, Settings, ExternalLink
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import ModuleDashboard from '../components/modules/ModuleDashboard';

export default function Calendar() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week');

  const stats = [
    { label: 'Today\'s Meetings', value: 5, icon: Video, color: 'bg-blue-500', trend: 0 },
    { label: 'This Week', value: 23, icon: CalendarIcon, color: 'bg-purple-500', trend: 12 },
    { label: 'Pending Responses', value: 3, icon: Users, color: 'bg-amber-500', trend: -25 },
    { label: 'Avg Duration', value: '45m', icon: Clock, color: 'bg-green-500', trend: 5 }
  ];

  const integrations = [
    { name: 'Google Calendar', icon: '📅', status: 'connected', color: 'bg-blue-100' },
    { name: 'Microsoft Teams', icon: '👥', status: 'connected', color: 'bg-purple-100' },
    { name: 'Zoom', icon: '🎥', status: 'connected', color: 'bg-blue-100' },
    { name: 'Google Meet', icon: '📹', status: 'disconnected', color: 'bg-slate-100' }
  ];

  const events = [
    { id: 1, title: 'Q4 Planning Meeting', time: '09:00 - 10:00', platform: 'zoom', attendees: 8, type: 'internal', color: 'bg-blue-500' },
    { id: 2, title: 'Client Demo - TechStart', time: '10:30 - 11:30', platform: 'teams', attendees: 4, type: 'client', color: 'bg-green-500' },
    { id: 3, title: 'Weekly Standup', time: '14:00 - 14:30', platform: 'google_meet', attendees: 12, type: 'internal', color: 'bg-purple-500' },
    { id: 4, title: 'Vendor Review - Ace Supplies', time: '15:00 - 16:00', platform: 'zoom', attendees: 3, type: 'vendor', color: 'bg-amber-500' },
    { id: 5, title: '1:1 with Sarah', time: '16:30 - 17:00', platform: 'in_person', attendees: 2, type: 'internal', color: 'bg-slate-500' }
  ];

  const bookingTypes = [
    { id: 1, name: '30 Min Meeting', duration: 30, bookings: 45, link: 'arkfinex.com/book/30min' },
    { id: 2, name: 'Product Demo', duration: 60, bookings: 23, link: 'arkfinex.com/book/demo' },
    { id: 3, name: 'Consultation Call', duration: 45, bookings: 18, link: 'arkfinex.com/book/consult' }
  ];

  const hours = Array.from({ length: 10 }, (_, i) => i + 8);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  const platformIcons = {
    zoom: '🎥',
    teams: '👥',
    google_meet: '📹',
    in_person: '🏢'
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeCompany={activeCompany} setActiveCompany={setActiveCompany} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[1800px] mx-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Calendar & Meetings</h1>
                <p className="text-slate-500">Schedule meetings, sync calendars, and manage bookings</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync All
                </Button>
                <Button className="bg-lime-500 hover:bg-lime-600">
                  <Plus className="w-4 h-4 mr-2" />
                  New Meeting
                </Button>
              </div>
            </div>

            {/* Connected Integrations */}
            <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
              {integrations.map((integration, i) => (
                <Card key={i} className={`flex-shrink-0 ${integration.color}`}>
                  <CardContent className="p-3 flex items-center gap-3">
                    <span className="text-2xl">{integration.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{integration.name}</p>
                      <Badge className={integration.status === 'connected' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}>
                        {integration.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Card className="flex-shrink-0 border-dashed cursor-pointer hover:bg-slate-50">
                <CardContent className="p-3 flex items-center gap-3">
                  <Plus className="w-6 h-6 text-slate-400" />
                  <span className="text-sm text-slate-500">Add Integration</span>
                </CardContent>
              </Card>
            </div>

            <ModuleDashboard stats={stats} />

            <div className="grid lg:grid-cols-4 gap-6">
              {/* Calendar View */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="icon"><ChevronLeft className="w-4 h-4" /></Button>
                      <CardTitle>December 2024</CardTitle>
                      <Button variant="ghost" size="icon"><ChevronRight className="w-4 h-4" /></Button>
                    </div>
                    <Tabs value={view} onValueChange={setView}>
                      <TabsList>
                        <TabsTrigger value="day">Day</TabsTrigger>
                        <TabsTrigger value="week">Week</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </CardHeader>
                  <CardContent>
                    {/* Week View */}
                    <div className="overflow-x-auto">
                      <div className="grid grid-cols-6 gap-px bg-slate-200 min-w-[800px]">
                        {/* Header */}
                        <div className="bg-slate-100 p-2 text-center text-sm font-medium"></div>
                        {days.map(day => (
                          <div key={day} className="bg-slate-100 p-2 text-center text-sm font-medium">{day}</div>
                        ))}
                        
                        {/* Time slots */}
                        {hours.map(hour => (
                          <React.Fragment key={hour}>
                            <div className="bg-white p-2 text-xs text-slate-500 text-right">{hour}:00</div>
                            {days.map((day, dayIdx) => (
                              <div key={`${hour}-${day}`} className="bg-white p-1 min-h-[60px] border-t border-slate-100">
                                {hour === 9 && dayIdx === 0 && (
                                  <div className="bg-blue-500 text-white text-xs p-1 rounded">Q4 Planning</div>
                                )}
                                {hour === 10 && dayIdx === 1 && (
                                  <div className="bg-green-500 text-white text-xs p-1 rounded">Client Demo</div>
                                )}
                                {hour === 14 && dayIdx === 2 && (
                                  <div className="bg-purple-500 text-white text-xs p-1 rounded">Standup</div>
                                )}
                              </div>
                            ))}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Today's Schedule */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Today's Schedule</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {events.map(event => (
                        <div key={event.id} className="p-3 hover:bg-slate-50">
                          <div className="flex items-start gap-3">
                            <div className={`w-1 h-12 rounded-full ${event.color}`} />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{event.title}</p>
                              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                <Clock className="w-3 h-3" />
                                {event.time}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span>{platformIcons[event.platform]}</span>
                                <span className="text-xs text-slate-500">{event.attendees} attendees</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Video className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Booking Links */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm">Booking Links</CardTitle>
                    <Button variant="ghost" size="sm"><Plus className="w-4 h-4" /></Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {bookingTypes.map(booking => (
                      <div key={booking.id} className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-sm">{booking.name}</p>
                          <Badge variant="secondary">{booking.duration}m</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">{booking.bookings} bookings</span>
                          <Button variant="ghost" size="sm" className="h-6 text-xs">
                            <Link2 className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}