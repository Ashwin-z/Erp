import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  CalendarClock, CheckCircle2, XCircle, AlertTriangle, Clock,
  Users, Shield, Eye, RefreshCw, Send, FileText, Sparkles, 
  Brain, Zap, TrendingDown, UserX, Activity, Settings
} from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

const reviewCycles = [
  { id: '1', name: 'Q1 2025 Access Review', frequency: 'quarterly', startDate: new Date('2025-01-01'), dueDate: new Date('2025-01-31'), status: 'active', progress: 65 },
  { id: '2', name: 'Q4 2024 Access Review', frequency: 'quarterly', startDate: new Date('2024-10-01'), dueDate: new Date('2024-10-31'), status: 'completed', progress: 100 },
  { id: '3', name: 'Annual Security Review', frequency: 'annual', startDate: new Date('2024-12-01'), dueDate: new Date('2024-12-31'), status: 'completed', progress: 100 }
];

const pendingReviews = [
  { id: '1', user: 'Mike Johnson', email: 'mike@arkfinex.com', department: 'Sales', modules: ['CRM', 'Sales', 'Marketing'], lastReview: new Date('2024-10-15'), riskLevel: 'low', lastActive: new Date('2025-01-20'), status: 'active' },
  { id: '2', user: 'Sarah Chen', email: 'sarah@arkfinex.com', department: 'Finance', modules: ['General Ledger', 'Bank Reconciliation', 'GST Reports', 'Budgets'], lastReview: new Date('2024-09-20'), riskLevel: 'medium', lastActive: new Date('2025-01-10'), status: 'active' },
  { id: '3', user: 'John Smith', email: 'john@arkfinex.com', department: 'IT', modules: ['All Modules', 'Super Admin'], lastReview: new Date('2024-08-01'), riskLevel: 'high', lastActive: new Date('2024-11-15'), status: 'inactive' },
  { id: '4', user: 'Anna Lee', email: 'anna@arkfinex.com', department: 'HR', modules: ['HR Management', 'Documents'], lastReview: new Date('2024-10-01'), riskLevel: 'low', lastActive: new Date('2025-01-22'), status: 'active' },
  { id: '5', user: 'David Wong', email: 'david@arkfinex.com', department: 'Sales', modules: ['CRM', 'Finance', 'HR Management'], lastReview: new Date('2024-07-01'), riskLevel: 'high', lastActive: new Date('2024-09-01'), status: 'departed' },
  { id: '6', user: 'Lisa Park', email: 'lisa@arkfinex.com', department: 'Marketing', modules: ['Marketing', 'CRM', 'Super Admin'], lastReview: new Date('2024-06-15'), riskLevel: 'high', lastActive: new Date('2025-01-18'), status: 'active' }
];

// AI-detected anomalies
const aiFlags = [
  { id: 'f1', userId: '3', type: 'dormant', message: 'No activity for 70+ days with Super Admin access', severity: 'critical', suggestion: 'Revoke elevated permissions' },
  { id: 'f2', userId: '5', type: 'departed', message: 'User marked as departed but still has active access', severity: 'critical', suggestion: 'Immediate access revocation recommended' },
  { id: 'f3', userId: '6', type: 'role_deviation', message: 'Marketing user has Super Admin - deviates from role standards', severity: 'high', suggestion: 'Review and align with Marketing role template' },
  { id: 'f4', userId: '2', type: 'excessive', message: 'Finance Clerk has Budget approval rights beyond role scope', severity: 'medium', suggestion: 'Consider limiting to read-only budget access' }
];

// Auto-revocation settings
const defaultAutoRevocationSettings = {
  enabled: true,
  inactivityDays: 90,
  departedRevocationDays: 1,
  notifyManager: true,
  requireApproval: true
};

export default function AccessReviewProcess({ tenantId }) {
  const [cycles, setCycles] = useState(reviewCycles);
  const [reviews, setReviews] = useState(pendingReviews);
  const [flags, setFlags] = useState(aiFlags);
  const [activeTab, setActiveTab] = useState('ai-flagged');
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewModal, setReviewModal] = useState(false);
  const [createCycleModal, setCreateCycleModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const [reviewAction, setReviewAction] = useState('approve');
  const [reviewComment, setReviewComment] = useState('');
  const [newCycle, setNewCycle] = useState({ frequency: 'quarterly' });
  const [autoRevocationSettings, setAutoRevocationSettings] = useState(defaultAutoRevocationSettings);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Manager dashboard stats
  const managerStats = {
    totalTeamMembers: reviews.length,
    pendingReviews: reviews.filter(r => !r.reviewed).length,
    overdueReviews: reviews.filter(r => differenceInDays(new Date(), r.lastReview) > 90).length,
    aiFlags: flags.length,
    criticalFlags: flags.filter(f => f.severity === 'critical').length
  };

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    toast.info('AI analyzing access patterns...');
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add new AI-detected flag
    const newFlag = {
      id: `f${Date.now()}`,
      userId: '4',
      type: 'unusual_access',
      message: 'Unusual after-hours access pattern detected',
      severity: 'medium',
      suggestion: 'Review access logs and verify with user'
    };
    
    setFlags(prev => [...prev, newFlag]);
    setIsAnalyzing(false);
    toast.success('AI analysis complete - 1 new issue detected');
  };

  const applyAISuggestion = async (flag) => {
    const user = reviews.find(r => r.id === flag.userId);
    if (!user) return;

    await base44.entities.PermissionAudit.create({
      tenant_id: tenantId,
      actor_email: 'ai_system@arkfinex.com',
      action_type: 'ai_recommendation_applied',
      target_type: 'user',
      target_id: flag.userId,
      target_name: user.user,
      reason: flag.suggestion
    });

    setFlags(prev => prev.filter(f => f.id !== flag.id));
    
    if (flag.type === 'departed' || flag.type === 'dormant') {
      setReviews(prev => prev.filter(r => r.id !== flag.userId));
    }
    
    toast.success(`Applied AI suggestion for ${user.user}`);
  };

  const dismissFlag = (flagId) => {
    setFlags(prev => prev.filter(f => f.id !== flagId));
    toast.success('Flag dismissed');
  };

  const openReviewModal = (review) => {
    setSelectedReview(review);
    setReviewAction('approve');
    setReviewComment('');
    setReviewModal(true);
  };

  const submitReview = async () => {
    // Log to audit
    await base44.entities.PermissionAudit.create({
      tenant_id: tenantId,
      actor_email: 'current_reviewer@example.com',
      action_type: reviewAction === 'approve' ? 'review_approved' : reviewAction === 'revoke' ? 'revoke' : 'review_modification',
      target_type: 'user',
      target_id: selectedReview.id,
      target_name: selectedReview.user,
      reason: reviewComment || `Access ${reviewAction}d during periodic review`
    });

    setReviews(prev => prev.filter(r => r.id !== selectedReview.id));
    setReviewModal(false);
    toast.success(`Access ${reviewAction}d for ${selectedReview.user}`);
  };

  const createNewCycle = () => {
    const startDate = new Date();
    const dueDate = addDays(startDate, newCycle.frequency === 'quarterly' ? 30 : newCycle.frequency === 'monthly' ? 14 : 60);
    
    const cycle = {
      id: Date.now().toString(),
      name: `${newCycle.frequency === 'quarterly' ? 'Q' + Math.ceil((new Date().getMonth() + 1) / 3) : newCycle.frequency.charAt(0).toUpperCase() + newCycle.frequency.slice(1)} ${new Date().getFullYear()} Access Review`,
      frequency: newCycle.frequency,
      startDate,
      dueDate,
      status: 'active',
      progress: 0
    };
    
    setCycles(prev => [cycle, ...prev]);
    setCreateCycleModal(false);
    toast.success('New review cycle created');
  };

  const getRiskBadge = (risk) => {
    const colors = {
      low: 'bg-green-100 text-green-700',
      medium: 'bg-amber-100 text-amber-700',
      high: 'bg-red-100 text-red-700'
    };
    return <Badge className={colors[risk]}>{risk} risk</Badge>;
  };

  const getStatusBadge = (status) => {
    const config = {
      active: { color: 'bg-blue-100 text-blue-700', icon: Clock },
      completed: { color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
      overdue: { color: 'bg-red-100 text-red-700', icon: AlertTriangle }
    };
    const { color, icon: Icon } = config[status];
    return (
      <Badge className={color}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-100 text-red-700 border-red-300',
      high: 'bg-orange-100 text-orange-700 border-orange-300',
      medium: 'bg-amber-100 text-amber-700 border-amber-300',
      low: 'bg-blue-100 text-blue-700 border-blue-300'
    };
    return colors[severity] || colors.medium;
  };

  const getTypeIcon = (type) => {
    const icons = {
      dormant: TrendingDown,
      departed: UserX,
      role_deviation: AlertTriangle,
      excessive: Shield,
      unusual_access: Activity
    };
    return icons[type] || AlertTriangle;
  };

  return (
    <>
      <div className="space-y-4">
        {/* Manager Dashboard Summary */}
        <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-lime-500/20 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-lime-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Access Review Dashboard</h2>
                  <p className="text-slate-400 text-sm">AI-powered access monitoring</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => setSettingsModal(true)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Auto-Revocation
                </Button>
                <Button 
                  className="bg-lime-500 hover:bg-lime-600 text-slate-900"
                  onClick={runAIAnalysis}
                  disabled={isAnalyzing}
                >
                  <Sparkles className={`w-4 h-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  {isAnalyzing ? 'Analyzing...' : 'Run AI Analysis'}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-4">
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold">{managerStats.totalTeamMembers}</p>
                <p className="text-sm text-slate-400">Team Members</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold">{managerStats.pendingReviews}</p>
                <p className="text-sm text-slate-400">Pending Reviews</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-amber-400">{managerStats.overdueReviews}</p>
                <p className="text-sm text-slate-400">Overdue</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-purple-400">{managerStats.aiFlags}</p>
                <p className="text-sm text-slate-400">AI Flags</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-red-400">{managerStats.criticalFlags}</p>
                <p className="text-sm text-slate-400">Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Flagged Issues */}
        {flags.length > 0 && (
          <Card className="border-purple-200 bg-purple-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Sparkles className="w-5 h-5" />
                AI-Detected Issues ({flags.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {flags.map(flag => {
                  const user = reviews.find(r => r.id === flag.userId);
                  const TypeIcon = getTypeIcon(flag.type);
                  return (
                    <div 
                      key={flag.id} 
                      className={`p-4 rounded-lg border ${getSeverityColor(flag.severity)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <TypeIcon className="w-5 h-5 mt-0.5" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{user?.user || 'Unknown User'}</span>
                              <Badge variant="outline" className="text-[10px]">{flag.type.replace('_', ' ')}</Badge>
                              <Badge className={getSeverityColor(flag.severity)}>{flag.severity}</Badge>
                            </div>
                            <p className="text-sm mt-1">{flag.message}</p>
                            <div className="flex items-center gap-2 mt-2 text-sm">
                              <Zap className="w-3 h-3" />
                              <span className="font-medium">AI Suggestion:</span>
                              <span>{flag.suggestion}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="h-7 bg-purple-600 hover:bg-purple-700"
                            onClick={() => applyAISuggestion(flag)}
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            Apply
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-7"
                            onClick={() => dismissFlag(flag.id)}
                          >
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Review Cycles Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-lime-600" />
              Access Review Cycles
            </CardTitle>
            <Button className="bg-lime-500 hover:bg-lime-600" onClick={() => setCreateCycleModal(true)}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Start New Cycle
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {cycles.map(cycle => (
                <Card key={cycle.id} className={`border ${cycle.status === 'active' ? 'border-blue-200 bg-blue-50/30' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm">{cycle.name}</h3>
                      {getStatusBadge(cycle.status)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Progress</span>
                        <span>{cycle.progress}%</span>
                      </div>
                      <Progress value={cycle.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Due: {format(cycle.dueDate, 'MMM dd, yyyy')}</span>
                        <Badge variant="outline" className="text-[10px]">{cycle.frequency}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Pending Access Reviews
              <Badge className="bg-amber-100 text-amber-700">{reviews.length} pending</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="pending">Pending ({reviews.length})</TabsTrigger>
                <TabsTrigger value="high-risk">High Risk ({reviews.filter(r => r.riskLevel === 'high').length})</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Current Access</TableHead>
                      <TableHead>Last Review</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead className="w-32">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.filter(r => activeTab === 'high-risk' ? r.riskLevel === 'high' : true).map(review => (
                      <TableRow key={review.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {review.user.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{review.user}</p>
                              <p className="text-xs text-slate-500">{review.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{review.department}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {review.modules.slice(0, 2).map(mod => (
                              <Badge key={mod} variant="outline" className="text-[10px]">{mod}</Badge>
                            ))}
                            {review.modules.length > 2 && (
                              <Badge variant="outline" className="text-[10px]">+{review.modules.length - 2}</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">
                          {format(review.lastReview, 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>{getRiskBadge(review.riskLevel)}</TableCell>
                        <TableCell>
                          <Button size="sm" className="h-7 bg-lime-500 hover:bg-lime-600" onClick={() => openReviewModal(review)}>
                            <Eye className="w-3 h-3 mr-1" />
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="high-risk">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Current Access</TableHead>
                      <TableHead>Last Review</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead className="w-32">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.filter(r => r.riskLevel === 'high').map(review => (
                      <TableRow key={review.id} className="bg-red-50/50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {review.user.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{review.user}</p>
                              <p className="text-xs text-slate-500">{review.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{review.department}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {review.modules.map(mod => (
                              <Badge key={mod} variant="outline" className="text-[10px]">{mod}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">
                          {format(review.lastReview, 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>{getRiskBadge(review.riskLevel)}</TableCell>
                        <TableCell>
                          <Button size="sm" className="h-7 bg-red-500 hover:bg-red-600" onClick={() => openReviewModal(review)}>
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="completed">
                <div className="text-center py-8 text-slate-500">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No recently completed reviews</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Review Modal */}
      <Dialog open={reviewModal} onOpenChange={setReviewModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Review Access: {selectedReview?.user}
            </DialogTitle>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-slate-50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Department</span>
                  <span className="font-medium">{selectedReview.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Last Review</span>
                  <span>{format(selectedReview.lastReview, 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Risk Level</span>
                  {getRiskBadge(selectedReview.riskLevel)}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Current Access</p>
                <div className="flex flex-wrap gap-2">
                  {selectedReview.modules.map(mod => (
                    <Badge key={mod} className="bg-blue-100 text-blue-700">{mod}</Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Review Decision</p>
                <Select value={reviewAction} onValueChange={setReviewAction}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approve">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        Approve - Maintain current access
                      </div>
                    </SelectItem>
                    <SelectItem value="modify">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-amber-500" />
                        Request Modification
                      </div>
                    </SelectItem>
                    <SelectItem value="revoke">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        Revoke Access
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Comments (Optional)</p>
                <Textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Add review notes..."
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewModal(false)}>Cancel</Button>
            <Button 
              className={reviewAction === 'revoke' ? 'bg-red-500 hover:bg-red-600' : 'bg-lime-500 hover:bg-lime-600'}
              onClick={submitReview}
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Cycle Modal */}
      <Dialog open={createCycleModal} onOpenChange={setCreateCycleModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start New Review Cycle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Review Frequency</p>
              <Select value={newCycle.frequency} onValueChange={(v) => setNewCycle({ ...newCycle, frequency: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                This will generate review tasks for all department managers to review their team's access rights.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateCycleModal(false)}>Cancel</Button>
            <Button className="bg-lime-500 hover:bg-lime-600" onClick={createNewCycle}>
              Create Cycle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Auto-Revocation Settings Modal */}
      <Dialog open={settingsModal} onOpenChange={setSettingsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Auto-Revocation Settings
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium">Enable Auto-Revocation</p>
                <p className="text-xs text-slate-500">Automatically revoke access based on rules</p>
              </div>
              <Switch 
                checked={autoRevocationSettings.enabled}
                onCheckedChange={(v) => setAutoRevocationSettings({...autoRevocationSettings, enabled: v})}
              />
            </div>

            <div className="space-y-2">
              <Label>Inactivity Threshold (days)</Label>
              <Input 
                type="number"
                value={autoRevocationSettings.inactivityDays}
                onChange={(e) => setAutoRevocationSettings({...autoRevocationSettings, inactivityDays: parseInt(e.target.value)})}
              />
              <p className="text-xs text-slate-500">Revoke access after this many days of inactivity</p>
            </div>

            <div className="space-y-2">
              <Label>Departed User Revocation (days)</Label>
              <Input 
                type="number"
                value={autoRevocationSettings.departedRevocationDays}
                onChange={(e) => setAutoRevocationSettings({...autoRevocationSettings, departedRevocationDays: parseInt(e.target.value)})}
              />
              <p className="text-xs text-slate-500">Revoke access this many days after user leaves</p>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium">Notify Manager</p>
                <p className="text-xs text-slate-500">Send notification before auto-revocation</p>
              </div>
              <Switch 
                checked={autoRevocationSettings.notifyManager}
                onCheckedChange={(v) => setAutoRevocationSettings({...autoRevocationSettings, notifyManager: v})}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium">Require Approval</p>
                <p className="text-xs text-slate-500">Manager must approve auto-revocations</p>
              </div>
              <Switch 
                checked={autoRevocationSettings.requireApproval}
                onCheckedChange={(v) => setAutoRevocationSettings({...autoRevocationSettings, requireApproval: v})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsModal(false)}>Cancel</Button>
            <Button className="bg-lime-500 hover:bg-lime-600" onClick={() => {
              setSettingsModal(false);
              toast.success('Auto-revocation settings saved');
            }}>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}