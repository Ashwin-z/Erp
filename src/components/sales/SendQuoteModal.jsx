import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, Mail, Loader2, CheckCircle2, FileText, Paperclip } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

export default function SendQuoteModal({ open, onClose, quotation, onSent }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    body: ''
  });

  useEffect(() => {
    if (quotation && open) {
      const quoteNumber = quotation.quote_number || `QT-${Date.now().toString().slice(-8)}`;
      const total = quotation.total || 0;
      const validDays = quotation.valid_days || 30;
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + validDays);

      setEmailData({
        to: quotation.customer_email || '',
        subject: `Quotation ${quoteNumber} from TechStart Pte Ltd`,
        body: `Dear ${quotation.customer_name || 'Valued Customer'},

Thank you for your interest in our products/services. Please find below the details of your quotation.

Quotation Number: ${quoteNumber}
Total Amount: $${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
Valid Until: ${validUntil.toLocaleDateString()}

Items:
${(quotation.items || []).map((item, i) => 
  `${i + 1}. ${item.description || 'Item'} - Qty: ${item.quantity} x $${item.unit_price} = $${(item.quantity * item.unit_price).toLocaleString()}`
).join('\n')}

To accept this quotation, please reply to this email or contact us directly.

If you have any questions, please don't hesitate to reach out.

Best regards,
TechStart Pte Ltd
Phone: +65 6123 4567
Email: sales@techstart.com`
      });
      setSent(false);
    }
  }, [quotation, open]);

  const handleSend = async () => {
    if (!emailData.to) {
      toast.error('Recipient email is required');
      return;
    }

    setSending(true);
    
    try {
      await base44.integrations.Core.SendEmail({
        to: emailData.to,
        subject: emailData.subject,
        body: emailData.body
      });

      // Update quotation status to 'sent'
      if (quotation?.id) {
        await base44.entities.Quotation.update(quotation.id, {
          status: 'sent',
          sent_at: new Date().toISOString()
        });
      }

      setSent(true);
      toast.success('Quotation sent successfully');
      
      setTimeout(() => {
        onSent?.();
        onClose();
      }, 1500);
    } catch (error) {
      toast.error('Failed to send email: ' + (error.message || 'Unknown error'));
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            Send Quotation
          </DialogTitle>
        </DialogHeader>

        {sent ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Email Sent!</h3>
            <p className="text-slate-500">
              The quotation has been sent to {emailData.to}
            </p>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {/* Quote Summary */}
            <div className="p-4 bg-slate-50 rounded-lg border flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{quotation?.quote_number || 'New Quotation'}</p>
                <p className="text-sm text-slate-500">{quotation?.customer_name}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">${(quotation?.total || 0).toLocaleString()}</p>
                <Badge className="bg-blue-100 text-blue-700">
                  {quotation?.items?.length || 0} items
                </Badge>
              </div>
            </div>

            {/* Email Form */}
            <div className="space-y-2">
              <Label>To *</Label>
              <Input
                type="email"
                value={emailData.to}
                onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                placeholder="customer@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={emailData.body}
                onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                rows={12}
                className="font-mono text-sm"
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Paperclip className="w-4 h-4" />
              <span>PDF quotation will be attached automatically</span>
            </div>
          </div>
        )}

        {!sent && (
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={sending}>
              Cancel
            </Button>
            <Button 
              onClick={handleSend} 
              disabled={sending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}