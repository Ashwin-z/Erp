import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  UserPlus, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, 
  Bell, Mail, Smartphone, Shield, BookOpen, Rocket, Eye,
  Settings, Users, FileText, Calendar, Brain, Lightbulb,
  AlertCircle, TrendingUp, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const ONBOARDING_STEPS = [
  { id: 'welcome', title: 'Welcome', icon: Sparkles },
  { id: 'modules', title: 'Your Access', icon: Shield },
  { id: 'tour', title: 'Quick Tour', icon: BookOpen },
  { id: 'notifications', title: 'Notifications', icon: Bell },
  { id: 'complete', title: 'Get Started', icon: Rocket }
];

const MODULE_TOURS = {
  Dashboard: { icon: Eye, description: 'View your KPIs and AI-powered insights at a glance', tips: ['Check your dashboard daily for AI alerts', 'Customize widgets by clicking the settings icon'] },
  Sales: { icon: FileText, description: 'Manage orders, quotations, and invoices', tips: ['Always verify customer details before creating orders', 'Use templates for faster quotation creation'] },
  CRM: { icon: Users, description: 'Track customer relationships and interactions', tips: ['Log all customer interactions for better AI insights', 'Set follow-up reminders to never miss opportunities'] },
  Finance: { icon: Settings, description: 'Access financial reports and reconciliation', tips: ['Reconcile transactions weekly for accuracy', 'Review AI-flagged anomalies promptly'] },
  ARKSchedule: { icon: Calendar, description: 'AI-powered calendar and scheduling', tips: ['Let AI suggest optimal meeting times', 'Block focus time to protect productivity'] },
  'HR Management': { icon: Users, description: 'Manage employee records and HR processes', tips: ['Keep employee records up to date', 'Use bulk actions for efficiency'] },
  Marketing: { icon: TrendingUp, description: 'Create and track marketing campaigns', tips: ['Monitor campaign ROI weekly', 'A/B test your campaigns for best results'] },
  Documents: { icon: FileText, description: 'Store and manage documents securely', tips: ['Use folders to organize documents', 'Set appropriate sharing permissions'] }
};

// AI-powered role-based suggestions
const ROLE_SUGGESTIONS = {
  'Sales Manager': {
    recommendedModules: ['Dashboard', 'CRM', 'Sales', 'Marketing', 'Documents'],
    notifications: { email_security: true, push_alerts: true, weekly_digest: true, deal_updates: true },
    tips: ['Focus on pipeline visibility and team performance', 'Use AI forecasting for accurate projections']
  },
  'HR Recruiter': {
    recommendedModules: ['Dashboard', 'HR Management', 'Documents', 'ARKSchedule'],
    notifications: { email_security: true, push_alerts: true, candidate_updates: true, interview_reminders: true },
    tips: ['Keep candidate pipeline updated', 'Schedule interviews during optimal hours']
  },
  'Finance Clerk': {
    recommendedModules: ['Dashboard', 'Finance', 'Documents'],
    notifications: { email_security: true, push_alerts: true, reconciliation_alerts: true, approval_requests: true },
    tips: ['Review pending approvals daily', 'Flag unusual transactions immediately']
  },
  'IT Support': {
    recommendedModules: ['Dashboard', 'Service Desk', 'Documents', 'Settings'],
    notifications: { email_security: true, push_alerts: true, ticket_assignments: true, system_alerts: true },
    tips: ['Prioritize critical tickets first', 'Document solutions for knowledge base']
  },
  'Standard User': {
    recommendedModules: ['Dashboard', 'Documents', 'ARKSchedule'],
    notifications: { email_security: true, push_alerts: true, weekly_digest: true },
    tips: ['Check notifications regularly', 'Complete assigned tasks on time']
  }
};

export default function UserOnboarding({ isOpen, onClose, userData }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [notificationPrefs, setNotificationPrefs] = useState({
    email_security: true,
    email_updates: false,
    push_alerts: true,
    push_tasks: true,
    weekly_digest: true
  });
  const [tourModule, setTourModule] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [showAiPanel, setShowAiPanel] = useState(false);

  const user = userData || {
    name: 'New User',
    email: 'user@arkfinex.com',
    department: 'Sales',
    role: 'Standard User',
    modules: ['Dashboard', 'Sales', 'CRM', 'Documents', 'ARKSchedule']
  };

  // Get AI suggestions based on role
  useEffect(() => {
    const suggestions = ROLE_SUGGESTIONS[user.role] || ROLE_SUGGESTIONS['Standard User'];
    setAiSuggestions(suggestions);
    
    // Apply AI-suggested notification preferences
    if (suggestions?.notifications) {
      setNotificationPrefs(prev => ({ ...prev, ...suggestions.notifications }));
    }
  }, [user.role]);

  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  const nextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeOnboarding = () => {
    toast.success('Welcome to ARKFinex! Your setup is complete.');
    onClose();
  };

  const togglePref = (key) => {
    setNotificationPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderStep = () => {
    switch (ONBOARDING_STEPS[currentStep].id) {
      case 'welcome':
        return (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome, {user.name}!</h2>
            <p className="text-slate-500 mb-6">
              You've been added to {user.department} as a {user.role}.
              <br />Let's get you set up in just a few steps.
            </p>
            <div className="flex justify-center gap-4">
              <Badge className="bg-blue-100 text-blue-700 px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                {user.department}
              </Badge>
              <Badge className="bg-purple-100 text-purple-700 px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                {user.role}
              </Badge>
            </div>
          </div>
        );

      case 'modules':
        const suggestedModules = aiSuggestions?.recommendedModules || [];
        const missingRecommended = suggestedModules.filter(m => !user.modules.includes(m));
        
        return (
          <div className="py-4">
            <h2 className="text-xl font-bold mb-2">Your Assigned Modules</h2>
            <p className="text-slate-500 mb-4">
              Based on your role, you have access to the following modules:
            </p>
            
            {/* AI Suggestion Banner */}
            {missingRecommended.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg"
              >
                <div className="flex items-start gap-2">
                  <Brain className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-700">AI Suggestion</p>
                    <p className="text-xs text-purple-600">
                      For your role as {user.role}, we also recommend: {missingRecommended.join(', ')}
                    </p>
                    <Button size="sm" variant="outline" className="mt-2 h-6 text-xs border-purple-300">
                      Request Access
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              {user.modules.map((mod, i) => {
                const config = MODULE_TOURS[mod] || { icon: Shield, description: 'Access granted', tips: [] };
                const Icon = config.icon;
                const isRecommended = suggestedModules.includes(mod);
                return (
                  <motion.div
                    key={mod}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-4 rounded-lg border ${isRecommended ? 'bg-lime-50 border-lime-200' : 'bg-slate-50 border-slate-200'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isRecommended ? 'bg-lime-200' : 'bg-slate-200'}`}>
                        <Icon className={`w-5 h-5 ${isRecommended ? 'text-lime-700' : 'text-slate-600'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{mod}</p>
                          {isRecommended && (
                            <Badge className="bg-lime-100 text-lime-700 text-[9px]">Recommended</Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{config.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <p className="text-sm text-slate-400 mt-4 text-center">
              Need access to other modules? Contact your department head.
            </p>
          </div>
        );

      case 'tour':
        const availableModules = user.modules.filter(m => MODULE_TOURS[m]);
        const currentModule = availableModules[tourModule] || availableModules[0];
        const tourConfig = MODULE_TOURS[currentModule];
        const TourIcon = tourConfig?.icon || Shield;
        const moduleTips = tourConfig?.tips || [];

        return (
          <div className="py-4">
            <h2 className="text-xl font-bold mb-2">Quick Tour</h2>
            <p className="text-slate-500 mb-4">
              Let's explore your key modules with AI-powered tips
            </p>

            <div className="flex items-center justify-center gap-2 mb-4">
              {availableModules.map((_, i) => (
                <div 
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all ${i === tourModule ? 'bg-lime-500 w-6' : 'bg-slate-200'}`}
                />
              ))}
            </div>

            <motion.div
              key={currentModule}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-slate-50 to-lime-50 p-6 rounded-xl text-center"
            >
              <div className="w-14 h-14 bg-lime-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <TourIcon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{currentModule}</h3>
              <p className="text-slate-600 mb-4">{tourConfig?.description}</p>
              
              {/* AI Tips */}
              {moduleTips.length > 0 && (
                <div className="bg-white/80 rounded-lg p-3 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium text-amber-700">Pro Tips</span>
                  </div>
                  <ul className="space-y-1">
                    {moduleTips.map((tip, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 text-lime-500 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>

            {/* AI Best Practice */}
            {aiSuggestions?.tips && tourModule === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg"
              >
                <div className="flex items-start gap-2">
                  <Brain className="w-4 h-4 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-purple-700">AI Best Practice for {user.role}</p>
                    <p className="text-xs text-purple-600">{aiSuggestions.tips[0]}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex justify-between mt-4">
              <Button 
                variant="outline" 
                onClick={() => setTourModule(prev => Math.max(0, prev - 1))}
                disabled={tourModule === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button 
                onClick={() => {
                  if (tourModule < availableModules.length - 1) {
                    setTourModule(prev => prev + 1);
                  } else {
                    nextStep();
                  }
                }}
                className="bg-lime-500 hover:bg-lime-600"
              >
                {tourModule < availableModules.length - 1 ? 'Next Module' : 'Continue'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="py-4">
            <h2 className="text-xl font-bold mb-2">Notification Preferences</h2>
            <p className="text-slate-500 mb-4">
              Customize how you want to stay informed
            </p>

            {/* AI Suggestion Banner */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg"
            >
              <div className="flex items-start gap-2">
                <Zap className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-purple-700">AI-Optimized for {user.role}</p>
                  <p className="text-xs text-purple-600">
                    We've pre-configured notifications based on what works best for your role.
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="w-4 h-4 text-slate-600" />
                  <span className="font-medium">Email Notifications</span>
                </div>
                <div className="space-y-3 ml-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Security alerts</span>
                      <Badge className="bg-red-100 text-red-600 text-[9px]">Critical</Badge>
                    </div>
                    <Switch checked={notificationPrefs.email_security} onCheckedChange={() => togglePref('email_security')} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">System updates</span>
                    <Switch checked={notificationPrefs.email_updates} onCheckedChange={() => togglePref('email_updates')} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Weekly digest</span>
                      <Badge className="bg-purple-100 text-purple-600 text-[9px]">AI Recommended</Badge>
                    </div>
                    <Switch checked={notificationPrefs.weekly_digest} onCheckedChange={() => togglePref('weekly_digest')} />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Smartphone className="w-4 h-4 text-slate-600" />
                  <span className="font-medium">In-App Notifications</span>
                </div>
                <div className="space-y-3 ml-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Real-time alerts</span>
                      <Badge className="bg-purple-100 text-purple-600 text-[9px]">AI Recommended</Badge>
                    </div>
                    <Switch checked={notificationPrefs.push_alerts} onCheckedChange={() => togglePref('push_alerts')} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Task reminders</span>
                    <Switch checked={notificationPrefs.push_tasks} onCheckedChange={() => togglePref('push_tasks')} />
                  </div>
                </div>
              </div>
              
              {/* Role-specific notification tip */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    <strong>Tip:</strong> As a {user.role}, we recommend keeping real-time alerts on for important updates related to your responsibilities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-gradient-to-br from-lime-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">You're All Set!</h2>
            <p className="text-slate-500 mb-6">
              Your account is configured and ready to use.
              <br />Start exploring your dashboard now.
            </p>
            <div className="bg-lime-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-lime-700">
                <strong>Pro tip:</strong> Use the AI assistant (bottom right) for help anytime!
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-lime-600" />
              Getting Started
            </DialogTitle>
            <span className="text-sm text-slate-500">
              Step {currentStep + 1} of {ONBOARDING_STEPS.length}
            </span>
          </div>
        </DialogHeader>

        {/* Progress */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between px-1">
            {ONBOARDING_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div 
                  key={step.id}
                  className={`flex flex-col items-center ${i <= currentStep ? 'text-lime-600' : 'text-slate-300'}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {ONBOARDING_STEPS[currentStep].id !== 'tour' && (
          <DialogFooter className="flex justify-between">
            {currentStep > 0 && ONBOARDING_STEPS[currentStep].id !== 'complete' ? (
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : (
              <div />
            )}
            {ONBOARDING_STEPS[currentStep].id === 'complete' ? (
              <Button className="bg-lime-500 hover:bg-lime-600" onClick={completeOnboarding}>
                <Rocket className="w-4 h-4 mr-2" />
                Start Using ARKFinex
              </Button>
            ) : ONBOARDING_STEPS[currentStep].id !== 'tour' ? (
              <Button className="bg-lime-500 hover:bg-lime-600" onClick={nextStep}>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : null}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}