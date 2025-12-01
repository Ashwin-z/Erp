import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MessageCircle, Mail, Phone, FileText, Send, 
  CheckCircle2, Loader2, ExternalLink 
} from 'lucide-react';
import { toast } from 'sonner';

export default function SupportModal({ open, onClose }) {
  const [activeTab, setActiveTab] = useState('ticket');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject || !form.category || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSending(true);
    // Simulate sending
    await new Promise(r => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    toast.success('Support ticket submitted successfully!');
  };

  const resetForm = () => {
    setForm({ subject: '', category: '', priority: 'medium', message: '' });
    setSent(false);
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetForm, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-lime-500" />
            24/7 Support Center
          </DialogTitle>
        </DialogHeader>

        {/* Quick Contact Options */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <a 
            href="mailto:support@arkfinex.com" 
            className="flex flex-col items-center gap-1 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Mail className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-slate-600">Email Us</span>
          </a>
          <a 
            href="tel:+6562345678" 
            className="flex flex-col items-center gap-1 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Phone className="w-5 h-5 text-green-500" />
            <span className="text-xs text-slate-600">Call Us</span>
          </a>
          <a 
            href="https://docs.arkfinex.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <FileText className="w-5 h-5 text-purple-500" />
            <span className="text-xs text-slate-600">Docs</span>
          </a>
        </div>

        {/* Ticket Form */}
        {sent ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Ticket Submitted!</h3>
            <p className="text-slate-500 mb-4">
              We'll get back to you within 2-4 hours. Check your email for updates.
            </p>
            <Button variant="outline" onClick={resetForm}>
              Submit Another Ticket
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Subject *</Label>
              <Input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Brief description of your issue"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="billing">Billing & Payments</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="account">Account & Access</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Message *</Label>
              <Textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Describe your issue in detail..."
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-lime-500 hover:bg-lime-600" disabled={sending}>
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Ticket
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t">
          Average response time: <span className="text-slate-600 font-medium">under 2 hours</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}