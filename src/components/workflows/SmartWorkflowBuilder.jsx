import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, X, Save, Play, Settings, Zap, 
  ArrowRight, MessageSquare, Clock, AlertTriangle,
  CheckCircle2, Mail, Database, Brain, Users
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';

const NODE_TYPES = {
  trigger: { icon: Zap, color: 'bg-yellow-500', label: 'Trigger' },
  action: { icon: Play, color: 'bg-blue-500', label: 'Action' },
  condition: { icon: AlertTriangle, color: 'bg-orange-500', label: 'Condition' },
  ai: { icon: Brain, color: 'bg-purple-500', label: 'AI Logic' },
  delay: { icon: Clock, color: 'bg-slate-500', label: 'Delay' },
  email: { icon: Mail, color: 'bg-green-500', label: 'Email' },
  update: { icon: Database, color: 'bg-cyan-500', label: 'Update Record' },
  assign: { icon: Users, color: 'bg-pink-500', label: 'Assign' }
};

export default function SmartWorkflowBuilder({ workflow, onSave, onCancel, onTestRun }) {
  const [name, setName] = useState(workflow?.name || 'New Smart Workflow');
  const [nodes, setNodes] = useState(workflow?.nodes || [
    { id: 'start', type: 'trigger', position: { x: 100, y: 100 }, data: { label: 'Start Trigger' } }
  ]);
  const [edges, setEdges] = useState(workflow?.edges || []);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Simple drag implementation
  const handleDragStart = (e, nodeId) => {
    e.dataTransfer.setData('nodeId', nodeId);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const nodeId = e.dataTransfer.getData('nodeId');
    const type = e.dataTransfer.getData('type');
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (nodeId) {
      // Move existing node
      setNodes(nodes.map(n => n.id === nodeId ? { ...n, position: { x: x - 50, y: y - 25 } } : n));
    } else if (type) {
      // Add new node
      const newNode = {
        id: `node-${Date.now()}`,
        type,
        position: { x: x - 50, y: y - 25 },
        data: { label: `New ${NODE_TYPES[type].label}` }
      };
      setNodes([...nodes, newNode]);
      
      // Auto connect if there is a selected node
      if (selectedNode) {
        setEdges([...edges, { id: `e-${Date.now()}`, source: selectedNode, target: newNode.id }]);
      }
      setSelectedNode(newNode.id);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const addNode = (type) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type,
      position: { x: 300 + (nodes.length * 20), y: 200 + (nodes.length * 20) },
      data: { label: `New ${NODE_TYPES[type].label}` }
    };
    setNodes([...nodes, newNode]);
    if (selectedNode) {
        setEdges([...edges, { id: `e-${Date.now()}`, source: selectedNode, target: newNode.id }]);
    }
    setSelectedNode(newNode.id);
  };

  const deleteNode = (id) => {
    setNodes(nodes.filter(n => n.id !== id));
    setEdges(edges.filter(e => e.source !== id && e.target !== id));
    if (selectedNode === id) setSelectedNode(null);
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Please name your workflow");
      return;
    }
    // Find trigger node to set main trigger type
    const triggerNode = nodes.find(n => n.type === 'trigger');
    const mainTrigger = triggerNode?.data?.triggerType || 'manual';

    // Map nodes to ArkActionList format for ERPNext compatibility
    const actions = nodes
      .filter(n => n.type === 'action' || n.type === 'email' || n.type === 'update')
      .map((n, index) => ({
        action_type: n.type === 'email' ? 'SendEmail' : (n.type === 'update' ? 'UpdateDoc' : 'CallAPI'),
        params: JSON.stringify(n.data),
        order: index + 1,
        enabled: true
      }));

    onSave({
      name,
      trigger: mainTrigger,
      nodes, // Save visual state
      edges, // Save visual state
      actions, // Save ERPNext compatible action list
      is_active: true
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="h-16 border-b bg-white px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
          <div>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="font-bold text-lg border-transparent hover:border-slate-200 focus:border-slate-200 px-2 h-8"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onTestRun && onTestRun({ nodes, name, trigger: nodes.find(n => n.type === 'trigger')?.data?.triggerType || 'manual' })}>
            <Play className="w-4 h-4 mr-2" /> Test Run
          </Button>
          <Button onClick={handleSave} className="bg-slate-900 hover:bg-slate-800">
            <Save className="w-4 h-4 mr-2" /> Save Workflow
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar / Toolbox */}
        <div className="w-64 bg-white border-r p-4 overflow-y-auto z-10">
          <h3 className="font-semibold text-sm mb-4 text-slate-500 uppercase tracking-wider">Tools</h3>
          <div className="space-y-3">
            {Object.entries(NODE_TYPES).map(([type, config]) => (
              <div 
                key={type}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('type', type)}
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm cursor-grab active:cursor-grabbing transition-all"
                onClick={() => addNode(type)}
              >
                <div className={`w-8 h-8 rounded-md ${config.color} flex items-center justify-center text-white`}>
                  <config.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{config.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-800 mb-2 text-sm">AI Suggestions</h4>
            <p className="text-xs text-blue-600 mb-3">Based on your recent activity, try adding:</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full bg-white border-blue-200 text-blue-700 hover:bg-blue-50 justify-start"
              onClick={() => addNode('ai')}
            >
              <Brain className="w-3 h-3 mr-2" /> Sentiment Check
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div 
          className="flex-1 relative bg-slate-50 overflow-hidden"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{ 
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
            backgroundSize: '20px 20px' 
          }}
        >
          {/* Connection Lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {edges.map(edge => {
              const sourceNode = nodes.find(n => n.id === edge.source);
              const targetNode = nodes.find(n => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;

              return (
                <line 
                  key={edge.id}
                  x1={sourceNode.position.x + 100} 
                  y1={sourceNode.position.y + 30}
                  x2={targetNode.position.x} 
                  y2={targetNode.position.y + 30}
                  stroke="#94a3b8" 
                  strokeWidth="2" 
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
              </marker>
            </defs>
          </svg>

          {/* Nodes */}
          {nodes.map(node => {
            const config = NODE_TYPES[node.type] || NODE_TYPES.action;
            const isSelected = selectedNode === node.id;

            return (
              <motion.div
                key={node.id}
                layoutId={node.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                drag
                dragMomentum={false}
                onDragEnd={(e, info) => {
                    // Update node position in state
                    const newX = node.position.x + info.offset.x;
                    const newY = node.position.y + info.offset.y;
                    setNodes(prev => prev.map(n => n.id === node.id ? { ...n, position: { x: newX, y: newY } } : n));
                }}
                style={{ 
                  position: 'absolute', 
                  left: node.position.x, 
                  top: node.position.y,
                  touchAction: 'none'
                }}
                className={`
                  w-[200px] bg-white rounded-lg shadow-sm border-2 p-3 cursor-pointer group
                  ${isSelected ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-transparent hover:border-slate-300'}
                `}
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node.id);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center text-white shadow-sm`}>
                    <config.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{node.data.label}</p>
                    <p className="text-xs text-slate-500 truncate capitalize">{node.type}</p>
                  </div>
                </div>
                
                {/* Connecting dots */}
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-300 rounded-full border border-white" />
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-300 rounded-full border border-white" />

                {/* Delete button */}
                <button 
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteNode(node.id);
                    }}
                >
                    <X className="w-3 h-3" />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Properties Panel */}
        {selectedNode && (
          <div className="w-80 bg-white border-l p-6 overflow-y-auto shadow-xl z-20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Configuration</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedNode(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {(() => {
                const node = nodes.find(n => n.id === selectedNode);
                if (!node) return null;
                
                return (
                  <>
                    <div className="space-y-2">
                      <Label>Step Name</Label>
                      <Input 
                        value={node.data.label} 
                        onChange={(e) => setNodes(nodes.map(n => n.id === node.id ? { ...n, data: { ...n.data, label: e.target.value } } : n))}
                      />
                    </div>

                    {node.type === 'ai' && (
                       <div className="space-y-2">
                         <Label>AI Model</Label>
                         <Select 
                            value={node.data.aiModel || "gpt4"}
                            onValueChange={(v) => setNodes(nodes.map(n => n.id === node.id ? { ...n, data: { ...n.data, aiModel: v } } : n))}
                         >
                           <SelectTrigger><SelectValue /></SelectTrigger>
                           <SelectContent>
                             <SelectItem value="gpt4">GPT-4 (Reasoning)</SelectItem>
                             <SelectItem value="claude">Claude 3.5 (Analysis)</SelectItem>
                             <SelectItem value="sentiment">Sentiment Analyzer</SelectItem>
                             <SelectItem value="forecast">Predictive Forecasting</SelectItem>
                           </SelectContent>
                         </Select>
                         <div className="mt-2">
                            <Label>Prompt / Condition</Label>
                            <textarea 
                                className="w-full h-20 p-2 text-xs border rounded-md mt-1 resize-none focus:outline-none focus:ring-2 focus:ring-slate-200"
                                placeholder="Describe what the AI should evaluate..."
                                value={node.data.aiPrompt || ''}
                                onChange={(e) => setNodes(nodes.map(n => n.id === node.id ? { ...n, data: { ...n.data, aiPrompt: e.target.value } } : n))}
                            />
                         </div>
                         <p className="text-xs text-slate-500 mt-1">
                             Use AI to evaluate conditions or generate content based on previous steps.
                         </p>
                       </div>
                    )}
                    
                     {node.type === 'trigger' && (
                       <div className="space-y-2">
                         <Label>Trigger Event</Label>
                         <Select 
                            value={node.data.triggerType || "project_delay"} 
                            onValueChange={(v) => setNodes(nodes.map(n => n.id === node.id ? { ...n, data: { ...n.data, triggerType: v } } : n))}
                         >
                           <SelectTrigger><SelectValue /></SelectTrigger>
                           <SelectContent>
                             <SelectItem value="project_delay">Project Predicted Delay (AI)</SelectItem>
                             <SelectItem value="lead_sentiment">Lead Sentiment Drop (AI)</SelectItem>
                             <SelectItem value="new_ticket">New Support Ticket</SelectItem>
                             <SelectItem value="invoice_overdue">Invoice Overdue</SelectItem>
                           </SelectContent>
                         </Select>
                         <p className="text-xs text-slate-500 mt-1">
                            AI triggers will run predictive models on new data.
                         </p>
                       </div>
                    )}

                    {node.type === 'action' && (
                       <div className="space-y-2">
                         <Label>Action Type</Label>
                         <Select 
                            value={node.data.actionType || "email"}
                            onValueChange={(v) => setNodes(nodes.map(n => n.id === node.id ? { ...n, data: { ...n.data, actionType: v } } : n))}
                         >
                           <SelectTrigger><SelectValue /></SelectTrigger>
                           <SelectContent>
                             <SelectItem value="email">Send Email Notification</SelectItem>
                             <SelectItem value="slack">Send Slack Message</SelectItem>
                             <SelectItem value="notification">In-App Notification</SelectItem>
                             <SelectItem value="webhook">Call Webhook</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
                    )}

                    {node.type === 'update' && (
                       <div className="space-y-2">
                         <Label>Update Entity</Label>
                         <Select 
                            value={node.data.entityType || "project"}
                            onValueChange={(v) => setNodes(nodes.map(n => n.id === node.id ? { ...n, data: { ...n.data, entityType: v } } : n))}
                         >
                           <SelectTrigger><SelectValue /></SelectTrigger>
                           <SelectContent>
                             <SelectItem value="project">Project</SelectItem>
                             <SelectItem value="lead">Lead/Opportunity</SelectItem>
                             <SelectItem value="task">Task</SelectItem>
                             <SelectItem value="invoice">Invoice</SelectItem>
                           </SelectContent>
                         </Select>
                         <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                                <Label className="text-xs">Field</Label>
                                <Input 
                                    placeholder="e.g. status" 
                                    className="h-8 text-xs"
                                    value={node.data.fieldName || ''}
                                    onChange={(e) => setNodes(nodes.map(n => n.id === node.id ? { ...n, data: { ...n.data, fieldName: e.target.value } } : n))}
                                />
                            </div>
                            <div>
                                <Label className="text-xs">Value</Label>
                                <Input 
                                    placeholder="e.g. delayed" 
                                    className="h-8 text-xs"
                                    value={node.data.fieldValue || ''}
                                    onChange={(e) => setNodes(nodes.map(n => n.id === node.id ? { ...n, data: { ...n.data, fieldValue: e.target.value } } : n))}
                                />
                            </div>
                         </div>
                       </div>
                    )}
                    
                    {node.type === 'assign' && (
                       <div className="space-y-2">
                         <Label>Assign To</Label>
                         <Select 
                            value={node.data.assignStrategy || "ai"}
                            onValueChange={(v) => setNodes(nodes.map(n => n.id === node.id ? { ...n, data: { ...n.data, assignStrategy: v } } : n))}
                         >
                           <SelectTrigger><SelectValue /></SelectTrigger>
                           <SelectContent>
                             <SelectItem value="ai">AI Recommended Agent</SelectItem>
                             <SelectItem value="manager">Project Manager</SelectItem>
                             <SelectItem value="creator">Creator</SelectItem>
                             <SelectItem value="role">Specific Role</SelectItem>
                           </SelectContent>
                         </Select>
                         <p className="text-xs text-slate-500">
                            AI will analyze workload, skills, and availability to pick the best person.
                         </p>
                       </div>
                    )}

                    <div className="pt-4 border-t">
                        <Button variant="destructive" size="sm" className="w-full" onClick={() => deleteNode(node.id)}>
                            Delete Step
                        </Button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}