import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MessageSquare, Star, Bug, Lightbulb, Zap } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from "sonner";

export default function FeedbackModal({ appName, trigger }) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState({
    type: 'General Feedback',
    message: '',
    rating: 5
  });

  const submitFeedback = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me().catch(() => ({ email: 'anonymous@example.com' }));
      return base44.entities.AppFeedback.create({
        app_name: appName || 'System',
        feedback_type: data.type,
        message: data.message,
        rating: data.rating,
        user_email: user.email
      });
    },
    onSuccess: () => {
      toast.success("Feedback submitted successfully!");
      setOpen(false);
      setFeedback({ type: 'General Feedback', message: '', rating: 5 });
    },
    onError: () => {
      toast.error("Failed to submit feedback.");
    }
  });

  const handleSubmit = () => {
    if (!feedback.message) {
      toast.error("Please enter a message.");
      return;
    }
    submitFeedback.mutate(feedback);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Feedback
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            Submit Feedback {appName ? `for ${appName}` : ''}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Feedback Type</Label>
            <Select 
              value={feedback.type} 
              onValueChange={(val) => setFeedback({...feedback, type: val})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General Feedback"><span className="flex items-center"><MessageSquare className="w-4 h-4 mr-2"/> General</span></SelectItem>
                <SelectItem value="Bug"><span className="flex items-center"><Bug className="w-4 h-4 mr-2"/> Bug Report</span></SelectItem>
                <SelectItem value="Feature Request"><span className="flex items-center"><Lightbulb className="w-4 h-4 mr-2"/> Feature Request</span></SelectItem>
                <SelectItem value="Performance Issue"><span className="flex items-center"><Zap className="w-4 h-4 mr-2"/> Performance</span></SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Message</Label>
            <Textarea 
              placeholder="Tell us what you think..." 
              value={feedback.message}
              onChange={(e) => setFeedback({...feedback, message: e.target.value})}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid gap-2">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFeedback({...feedback, rating: star})}
                  className={`transition-colors ${star <= feedback.rating ? 'text-yellow-400' : 'text-slate-300'}`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitFeedback.isPending}>
            {submitFeedback.isPending ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}