import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Calendar as CalendarIcon, Clock, User, Mail, Building2, 
  CheckCircle2, Send, ArrowLeft, ArrowRight, Phone, Sparkles, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, isSameDay, isToday, isBefore, startOfDay, differenceInDays, differenceInHours } from 'date-fns';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

const countryCodes = [
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { code: '+66', country: 'Thailand', flag: '🇹🇭' },
  { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
  { code: '+63', country: 'Philippines', flag: '🇵🇭' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+852', country: 'Hong Kong', flag: '🇭🇰' },
  { code: '+886', country: 'Taiwan', flag: '🇹🇼' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+1', country: 'Canada', flag: '🇨🇦' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
  { code: '+46', country: 'Sweden', flag: '🇸🇪' },
  { code: '+47', country: 'Norway', flag: '🇳🇴' },
  { code: '+45', country: 'Denmark', flag: '🇩🇰' },
  { code: '+358', country: 'Finland', flag: '🇫🇮' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+972', country: 'Israel', flag: '🇮🇱' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+52', country: 'Mexico', flag: '🇲🇽' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷' },
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];

const demoTypes = [
  { id: 'full', name: 'Full Platform Demo', duration: '60 min', description: 'Complete walkthrough of all features' },
  { id: 'quick', name: 'Quick Overview', duration: '15 min', description: 'High-level platform introduction' },
  { id: 'specific', name: 'Feature Deep Dive', duration: '30 min', description: 'Focus on specific modules' }
];

// Required field label component
const RequiredLabel = ({ children }) => (
  <Label className="flex items-center gap-1">
    {children} <span className="text-red-500">*</span>
  </Label>
);

export default function BookDemoModal({ open, onClose }) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedType, setSelectedType] = useState('full');
  const [sending, setSending] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });
  const [selectedCountry, setSelectedCountry] = useState({ code: '+65', country: 'Singapore', flag: '🇸🇬' });

  // Generate calendar days for current month view
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }
    
    // Add actual days
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }
    
    return days;
  };

  const resetModal = () => {
    setStep(1);
    setSelectedDate(null);
    setSelectedTime('');
    setSelectedType('full');
    setFormData({ name: '', email: '', company: '', phone: '', message: '' });
    setBookingConfirmed(false);
    setBookingId('');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const canProceedStep1 = selectedDate && selectedTime;
  const canProceedStep2 = formData.name && formData.email && formData.company && formData.phone;

  const calculateTimeUntilDemo = () => {
    if (!selectedDate) return null;
    const demoDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    demoDateTime.setHours(parseInt(hours), parseInt(minutes));
    
    const now = new Date();
    const daysLeft = differenceInDays(demoDateTime, now);
    const hoursLeft = differenceInHours(demoDateTime, now) % 24;
    
    return { daysLeft, hoursLeft, demoDateTime };
  };

  const sendBookingEmail = async () => {
    setSending(true);
    
    try {
      const newBookingId = `DEMO-${Date.now().toString(36).toUpperCase()}`;
      setBookingId(newBookingId);
      
      const selectedDemoType = demoTypes.find(t => t.id === selectedType);
      const bookingDateTime = format(selectedDate, 'EEEE, MMMM d, yyyy') + ' at ' + selectedTime;
      const timeInfo = calculateTimeUntilDemo();
      
      const thankYouEmail = `Dear ${formData.name},

Thank you for your interest in ARKFinex!

YOUR DEMO IS SCHEDULED
-----------------------
Booking ID: ${newBookingId}
Demo Type: ${selectedDemoType?.name || 'Full Platform Demo'} (${selectedDemoType?.duration || '60 min'})
Date & Time: ${bookingDateTime} (SGT)
Company: ${formData.company}
Contact: ${formData.phone}

We look forward to showing you our platform!

Best regards,
The ARKFinex Demo Team`;

      // Send thank you email to customer
      await base44.integrations.Core.SendEmail({
        to: formData.email,
        subject: `Your ARKFinex Demo is Confirmed - ${newBookingId}`,
        body: thankYouEmail,
        from_name: 'ARKFinex Demo Team'
      });

      setBookingConfirmed(true);
      setStep(3);
      toast.success('Booking confirmation sent to your email!');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to send booking. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Generate calendar days with custom styling
  const today = startOfDay(new Date());
  
  const modifiers = {
    today: (date) => isToday(date),
    past: (date) => isBefore(date, today),
    weekend: (date) => date.getDay() === 0 || date.getDay() === 6
  };

  const modifiersClassNames = {
    today: 'bg-lime-500 text-white font-bold hover:bg-lime-600',
    past: 'text-red-400 line-through opacity-50',
    weekend: 'text-red-400 opacity-50'
  };

  const disabledDays = [
    { dayOfWeek: [0, 6] }, // Disable weekends
    { before: addDays(new Date(), 1) } // Disable past dates and today
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-lime-500" />
            Book Your ARKFinex Demo
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Experience the future of AI-powered finance automation. Schedule your personalized demo today.
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step >= s ? 'bg-lime-500 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              {s < 3 && <div className={`w-16 h-1 rounded ${step > s ? 'bg-lime-500' : 'bg-slate-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Select Date & Time */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-4">
                <h3 className="font-semibold text-lg">Select Date & Time</h3>
                <p className="text-sm text-slate-500">Choose your preferred demo slot (Singapore Time)</p>
              </div>

              {/* Demo Type Selection */}
              <div className="space-y-2">
                <Label>Demo Type</Label>
                <div className="grid grid-cols-3 gap-2">
                  {demoTypes.map((type) => (
                    <div
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedType === type.id 
                          ? 'border-lime-500 bg-lime-50 ring-2 ring-lime-200' 
                          : 'hover:border-slate-300'
                      }`}
                    >
                      <p className="font-medium text-sm">{type.name}</p>
                      <p className="text-xs text-slate-500">{type.duration}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Calendar */}
                <div>
                  <RequiredLabel>Select Date</RequiredLabel>
                  <div className="border rounded-lg p-2 mt-2">
                    <div className="mb-2 flex gap-4 text-xs px-2">
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-lime-500"></span> Today</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-200"></span> Unavailable</span>
                    </div>
                    <div className="demo-calendar">
                      <style>{`
                        .demo-calendar .rdp-day_today { background-color: #84cc16 !important; color: white !important; font-weight: bold; }
                        .demo-calendar .rdp-day_disabled { color: #f87171 !important; text-decoration: line-through; opacity: 0.6; }
                        .demo-calendar [aria-disabled="true"] { color: #f87171 !important; }
                      `}</style>
                      {/* Custom Calendar with proper styling */}
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-4">
                          <button 
                            onClick={() => {
                              const d = new Date(currentMonth);
                              d.setMonth(d.getMonth() - 1);
                              setCurrentMonth(d);
                            }}
                            className="p-1 hover:bg-slate-100 rounded"
                          >
                            <ArrowLeft className="w-4 h-4" />
                          </button>
                          <span className="font-semibold">{format(currentMonth, 'MMMM yyyy')}</span>
                          <button 
                            onClick={() => {
                              const d = new Date(currentMonth);
                              d.setMonth(d.getMonth() + 1);
                              setCurrentMonth(d);
                            }}
                            className="p-1 hover:bg-slate-100 rounded"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                            <div key={d} className="font-medium text-slate-500 py-1">{d}</div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {generateCalendarDays().map((day, i) => {
                            if (!day) return <div key={`empty-${i}`} className="p-2"></div>;
                            
                            const isSelected = selectedDate && isSameDay(day, selectedDate);
                            const isTodayDate = isToday(day);
                            const isPastDate = isBefore(day, today);
                            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                            const isDisabled = isPastDate || isWeekend;
                            
                            return (
                              <button
                                key={day.toISOString()}
                                onClick={() => !isDisabled && setSelectedDate(day)}
                                disabled={isDisabled}
                                className={`p-2 text-sm rounded-lg transition-all ${
                                  isSelected 
                                    ? 'bg-lime-500 text-white font-bold ring-2 ring-lime-300' 
                                    : isTodayDate && !isPastDate
                                      ? 'bg-lime-100 text-lime-700 font-bold border-2 border-lime-500'
                                      : isDisabled
                                        ? 'text-red-400 line-through opacity-50 cursor-not-allowed'
                                        : 'hover:bg-slate-100 text-slate-700'
                                }`}
                              >
                                {format(day, 'd')}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <RequiredLabel>Select Time {selectedDate && `(${format(selectedDate, 'MMM d')})`}</RequiredLabel>
                  <div className="grid grid-cols-3 gap-2 max-h-[280px] overflow-y-auto mt-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        className={selectedTime === time ? 'bg-lime-500 hover:bg-lime-600' : ''}
                        onClick={() => setSelectedTime(time)}
                        disabled={!selectedDate}
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {selectedDate && selectedTime && (
                <div className="bg-lime-50 border border-lime-200 rounded-lg p-3 text-center">
                  <p className="text-sm text-lime-800">
                    <strong>Selected:</strong> {format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime} SGT
                  </p>
                </div>
              )}

              <div className="flex justify-end">
                <Button 
                  className="bg-lime-500 hover:bg-lime-600" 
                  disabled={!canProceedStep1}
                  onClick={() => setStep(2)}
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Contact Details */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-4">
                <h3 className="font-semibold text-lg">Your Details</h3>
                <p className="text-sm text-slate-500">Tell us about yourself so we can personalize your demo</p>
              </div>

              {/* Selected Slot Summary */}
              <div className="bg-slate-50 border rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-lime-500" />
                  <div>
                    <p className="font-medium text-sm">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                    <p className="text-xs text-slate-500">{selectedTime} SGT • {demoTypes.find(t => t.id === selectedType)?.name}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setStep(1)}>Change</Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <RequiredLabel>Full Name</RequiredLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      className="pl-10" 
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <RequiredLabel>Work Email</RequiredLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      type="email"
                      className="pl-10" 
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <RequiredLabel>Company Name</RequiredLabel>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      className="pl-10" 
                      placeholder="Acme Pte Ltd"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <RequiredLabel>Phone</RequiredLabel>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      className="pl-10"
                      placeholder="+65 9XXX XXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>What would you like to see? (Optional)</Label>
                <Textarea 
                  placeholder="Tell us about your business needs or specific features you'd like to explore..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button 
                  className="bg-lime-500 hover:bg-lime-600" 
                  disabled={!canProceedStep2 || sending}
                  onClick={sendBookingEmail}
                >
                  {sending ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" /> Confirm Booking
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-6"
            >
              <motion.div 
                className="w-20 h-20 bg-lime-100 rounded-full flex items-center justify-center mx-auto"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                <CheckCircle2 className="w-10 h-10 text-lime-600" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-2xl font-bold text-lime-600 mb-2">🎉 Thank You!</h3>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">Your Demo Booking is Confirmed!</h4>
                <p className="text-slate-600">
                  A confirmation email has been sent to <strong className="text-lime-600">{formData.email}</strong>
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-lime-50 border-2 border-lime-200 rounded-xl p-4 max-w-sm mx-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Mail className="w-5 h-5 text-lime-600" />
                  <span className="font-semibold text-lime-800">Email Sent Successfully!</span>
                </div>
                <p className="text-sm text-lime-700">
                  Please check your inbox and confirm your attendance by clicking the confirmation link in the email.
                </p>
              </motion.div>

              <div className="bg-slate-50 border rounded-lg p-4 text-left max-w-sm mx-auto">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Booking ID:</span>
                    <span className="font-mono font-medium">{bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date:</span>
                    <span className="font-medium">{format(selectedDate, 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Time:</span>
                    <span className="font-medium">{selectedTime} SGT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Demo Type:</span>
                    <span className="font-medium">{demoTypes.find(t => t.id === selectedType)?.name}</span>
                  </div>
                </div>
              </div>

              {/* Time countdown */}
              {selectedDate && (
                <div className="bg-lime-50 border border-lime-200 rounded-lg p-4 text-sm text-lime-800">
                  <p className="font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Your demo is coming up!
                  </p>
                  <p className="mt-1">
                    ⏰ {(() => {
                      const info = calculateTimeUntilDemo();
                      if (info) {
                        return `${info.daysLeft} days and ${info.hoursLeft} hours until your demo`;
                      }
                      return '';
                    })()}
                  </p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <p><strong>📧 What happens next:</strong></p>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>Thank you email sent immediately</li>
                  <li>Reminder email 1 day before your demo</li>
                  <li>Reply CONFIRM, CANCEL, or request reschedule</li>
                </ul>
              </div>

              <Button onClick={handleClose} className="bg-lime-500 hover:bg-lime-600">
                Done
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}