import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, ArrowRight, GitBranch, Box, 
  PlayCircle, Settings, Trash2, Users,
  Save, MousePointer2, AlertTriangle, XCircle,
  Clock, HelpCircle, Split, Repeat, Globe, Play, 
  Terminal, Bug, Sparkles, CheckCircle2, X, Zap,
  FileJson, PlaySquare, AlertCircle
} from 'lucide-react';
import CommentsPanel from '@/components/shared/CommentsPanel';
import VersionHistoryPanel from '@/components/shared/VersionHistoryPanel';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from 'sonner';

export default function VisualWorkflowBuilder({ onSave }) {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState([
    { id: 'start', type: 'Trigger', label: 'When Order Created', x: 300, y: 50 },
    { id: '1', type: 'Condition', label: 'Value > $1000?', x: 300, y: 200 },
    { id: '2', type: 'Action', label: 'Send Approval Email', x: 100, y: 400 },
    { id: '3', type: 'Action', label: 'Auto-Approve', x: 500, y: 400 },
  ]);

  const [edges, setEdges] = useState([
    { id: 'e1', source: 'start', target: '1' },
    { id: 'e2', source: '1', target: '2', label: 'Yes' },
    { id: 'e3', source: '1', target: '3', label: 'No' },
  ]);

  const [selectedNode, setSelectedNode] = useState(null);
  const [connectionMode, setConnectionMode] = useState(false);
  const [connectSource, setConnectSource] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [testConsoleOpen, setTestConsoleOpen] = useState(false);
  const [testInput, setTestInput] = useState('{\n  "orderId": "ORD-123",\n  "amount": 5000,\n  "currency": "USD"\n}');
  const [testLogs, setTestLogs] = useState([]);
  const [testCases, setTestCases] = useState([
    { name: "High Value Order", input: '{\n  "orderId": "ORD-123",\n  "amount": 5000,\n  "currency": "USD"\n}' },
    { name: "Low Value Order", input: '{\n  "orderId": "ORD-456",\n  "amount": 50,\n  "currency": "USD"\n}' }
  ]);
  const [aiSuggestions, setAiSuggestions] = useState({});
  const canvasRef = useRef(null);

  // AI Analysis
  const analyzeWorkflow = () => {
    toast.info("AI analyzing workflow structure...");
    setTimeout(() => {
      const newSuggestions = {};
      
      // 1. Detect Performance Bottlenecks
      const sequentialActions = nodes.filter(n => n.type === 'Action' || n.type === 'API');
      if (sequentialActions.length > 1) {
         const firstAction = sequentialActions[0];
         newSuggestions[firstAction.id] = { 
             type: 'optimization', 
             message: 'Optimization: Run subsequent actions in Parallel to reduce latency by ~40%.' 
         };
      }

      // 2. Suggest Error Handling Mechanisms
      nodes.forEach(node => {
         if (node.type === 'API' || node.type === 'Action') {
             // Check if node has an error path
             const hasErrorPath = edges.some(e => e.source === node.id && (e.label === 'Error' || e.label === 'Fail'));
             if (!hasErrorPath && !newSuggestions[node.id]) {
                 newSuggestions[node.id] = { 
                     type: 'error-handling', 
                     message: `Reliability: ${node.type} node lacks error handling. Recommendation: Add Retry Policy or Fallback path.` 
                 };
             }
         }
      });

      // Best Practices
      const startNode = nodes.find(n => n.id === 'start');
      if (startNode && !newSuggestions[startNode.id]) {
          newSuggestions[startNode.id] = { type: 'best-practice', message: 'Security: Ensure input validation schema is strict.' };
      }

      setAiSuggestions(newSuggestions);
      toast.success(`AI Analysis Complete: ${Object.keys(newSuggestions).length} insights found.`);
    }, 1500);
  };

  // Test Workflow
  const runTest = async () => {
    setIsRunning(true);
    setTestConsoleOpen(true);
    setTestLogs([{ time: new Date().toLocaleTimeString(), type: 'info', message: 'Starting workflow execution...', nodeId: 'system' }]);
    
    let currentInput = {};
    try {
      currentInput = JSON.parse(testInput);
    } catch (e) {
      toast.error("Invalid JSON input");
      setIsRunning(false);
      return;
    }

    // Mock Execution Engine
    for (const node of nodes) {
        setActiveNodeId(node.id);
        
        // Log Execution
        setTestLogs(prev => [...prev, { 
          time: new Date().toLocaleTimeString(), 
          type: 'info', 
          message: `Executing node: ${node.label}`,
          nodeId: node.id,
          details: `Input: ${JSON.stringify(currentInput).substring(0, 50)}...`
        }]);

        // Simulate Processing & Output
        await new Promise(r => setTimeout(r, 800));
        
        // Mock branching logic for demo
        if (node.type === 'Condition') {
           const passed = currentInput.amount > 1000;
           setTestLogs(prev => [...prev, { 
             time: new Date().toLocaleTimeString(), 
             type: 'success', 
             message: `Condition Evaluated: ${passed}`,
             nodeId: node.id 
           }]);
        } else if (Math.random() > 0.9) {
           // Random simulated error
           setTestLogs(prev => [...prev, { 
             time: new Date().toLocaleTimeString(), 
             type: 'error', 
             message: `Node execution failed: Timeout`,
             nodeId: node.id 
           }]);
           break; 
        }
    }
    
    setActiveNodeId(null);
    setIsRunning(false);
    setTestLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), type: 'info', message: 'Workflow execution finished.', nodeId: 'system' }]);
  };

  const saveTestCase = () => {
    const name = prompt("Enter test case name:");
    if (name) {
      setTestCases([...testCases, { name, input: testInput }]);
      toast.success("Test case saved");
    }
  };

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('nodeType', type);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (connectionMode) {
      const rect = canvasRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('nodeType');
    if (!type) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 3. Intelligent Defaults & 4. Node Recommendations
    let label = `New ${type}`;
    let config = { description: '' };
    
    // Intelligent Context Awareness
    if (type === 'Condition') {
        // Infer from previous nodes (mock)
        label = 'High Value Check';
        config = { condition: 'order.amount > 10000' };
        toast.success("AI Context: Auto-configured for 'High Value' check based on Trigger.");
    } else if (type === 'API') {
        label = 'Enrich User Data';
        config = { method: 'GET', url: 'https://api.clearbit.com/v1/enrich' };
        toast.info("AI Suggestion: Use specialized 'Enrichment' node for better data quality instead of generic API.");
    } else if (type === 'Action') {
        label = 'Send Slack Alert';
        config = { channel: '#alerts' };
    }

    const newNode = {
      id: `node_${Date.now()}`,
      type,
      label,
      x: x - 100,
      y: y - 30,
      config
    };

    setNodes([...nodes, newNode]);
  };

  const deleteNode = (id) => {
    setNodes(nodes.filter(n => n.id !== id));
    setEdges(edges.filter(e => e.source !== id && e.target !== id));
    if (selectedNode?.id === id) setSelectedNode(null);
  };

  const handleConnect = (id) => {
    if (!connectionMode) return;
    
    if (!connectSource) {
      setConnectSource(id);
      toast.info("Select target node");
    } else {
      if (connectSource === id) {
        setConnectSource(null);
        return;
      }
      if (edges.find(e => e.source === connectSource && e.target === id)) {
        toast.error("Connection already exists");
        setConnectSource(null);
        return;
      }

      setEdges([...edges, { 
        id: `e_${Date.now()}`, 
        source: connectSource, 
        target: id 
      }]);
      setConnectSource(null);
      toast.success("Connected!");
    }
  };

  const isOrphan = (nodeId) => {
    if (nodeId === 'start') return false;
    return !edges.find(e => e.target === nodeId);
  };

  const updateNodeConfig = (key, value) => {
    if (!selectedNode) return;
    setNodes(nodes.map(n => n.id === selectedNode.id ? { ...n, label: key === 'label' ? value : n.label, config: { ...n.config, [key]: value } } : n));
    setSelectedNode(prev => ({ ...prev, label: key === 'label' ? value : prev.label, config: { ...prev.config, [key]: value } }));
  };

  return (
    <div className="h-[800px] flex border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
      {/* Config Sidebar */}
      {selectedNode && (
        <div className="w-80 border-r border-slate-800 bg-slate-900 p-4 flex flex-col gap-4 z-30 shadow-xl">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <h3 className="font-bold text-white">Node Properties</h3>
            <Button size="sm" variant="ghost" onClick={() => setSelectedNode(null)}><XCircle className="w-4 h-4" /></Button>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-slate-400">Node ID</Label>
              <Input value={selectedNode.id} disabled className="bg-slate-800 border-slate-700 font-mono text-xs" />
            </div>
            <div>
              <Label className="text-xs text-slate-400">Type</Label>
              <Badge variant="outline" className="mt-1">{selectedNode.type}</Badge>
            </div>
            <div>
              <Label className="text-xs text-slate-400">Label</Label>
              <Input 
                value={selectedNode.label} 
                onChange={(e) => updateNodeConfig('label', e.target.value)}
                className="bg-slate-800 border-slate-700" 
              />
            </div>
            <div>
              <Label className="text-xs text-slate-400">Description</Label>
              <Input 
                value={selectedNode.config?.description || ''} 
                onChange={(e) => updateNodeConfig('description', e.target.value)}
                placeholder="Enter details..."
                className="bg-slate-800 border-slate-700" 
              />
            </div>
            
            {/* Type Specific Configs */}
            {selectedNode.type === 'Condition' && (
             <div className="p-3 bg-slate-800/50 rounded border border-slate-700 space-y-2">
               <Label className="text-xs text-orange-400">Branch Logic (Multi-criteria)</Label>
               <div className="space-y-1">
                   <div className="flex gap-1">
                       <Input placeholder="IF value > 5000" className="bg-slate-900 border-slate-800 h-6 text-[10px]" />
                       <Badge variant="outline" className="text-[10px]">THEN A</Badge>
                   </div>
                   <div className="flex gap-1">
                       <Input placeholder="ELSE IF value < 100" className="bg-slate-900 border-slate-800 h-6 text-[10px]" />
                       <Badge variant="outline" className="text-[10px]">THEN B</Badge>
                   </div>
                   <div className="flex gap-1">
                       <Input placeholder="ELSE" disabled className="bg-slate-900 border-slate-800 h-6 text-[10px]" />
                       <Badge variant="outline" className="text-[10px]">THEN C</Badge>
                   </div>
               </div>
             </div>
            )}
            {selectedNode.type === 'API' && (
             <div className="p-3 bg-slate-800/50 rounded border border-slate-700 space-y-2">
               <Label className="text-xs text-slate-400">Endpoint URL</Label>
               <Input placeholder="https://api.example.com/v1..." className="bg-slate-900 border-slate-800 h-8 text-xs font-mono" />
               <div className="flex gap-2">
                  <select className="bg-slate-900 border border-slate-800 rounded text-xs px-2 h-8 text-white flex-1">
                     <option>GET</option>
                     <option>POST</option>
                  </select>
                  <Button size="sm" variant="secondary" className="h-8 text-xs">Auth</Button>
               </div>
             </div>
            )}
            {selectedNode.type === 'Loop' && (
             <div className="p-3 bg-slate-800/50 rounded border border-slate-700 space-y-2">
               <Label className="text-xs text-indigo-400">Loop Items</Label>
               <Input placeholder="Items Array Variable" className="bg-slate-900 border-slate-800 h-8 text-xs" />
             </div>
            )}
            {selectedNode.type === 'Delay' && (
              <div className="p-3 bg-slate-800/50 rounded border border-slate-700 space-y-2">
                <Label className="text-xs text-pink-400">Wait Duration</Label>
                <div className="flex gap-2">
                  <Input placeholder="0" type="number" className="bg-slate-900 border-slate-800 h-8 text-xs" />
                  <select className="bg-slate-900 border border-slate-800 rounded text-xs px-2 text-white">
                    <option>Minutes</option>
                    <option>Hours</option>
                    <option>Days</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-auto pt-4 border-t border-slate-800">
            <Button variant="destructive" size="sm" className="w-full" onClick={() => deleteNode(selectedNode.id)}>
              <Trash2 className="w-4 h-4 mr-2" /> Delete Node
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col relative">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center z-20">
          <div className="flex gap-2 overflow-x-auto pb-1">
            <div draggable onDragStart={(e) => handleDragStart(e, 'Action')} className="px-3 py-2 bg-emerald-600/20 border border-emerald-500/50 rounded cursor-move flex items-center text-sm text-emerald-400 hover:bg-emerald-600/30 whitespace-nowrap">
              <Plus className="w-4 h-4 mr-2" /> Action
            </div>
            <div draggable onDragStart={(e) => handleDragStart(e, 'Condition')} className="px-3 py-2 bg-orange-600/20 border border-orange-500/50 rounded cursor-move flex items-center text-sm text-orange-400 hover:bg-orange-600/30 whitespace-nowrap">
              <GitBranch className="w-4 h-4 mr-2" /> Condition
            </div>
            <div draggable onDragStart={(e) => handleDragStart(e, 'Delay')} className="px-3 py-2 bg-pink-600/20 border border-pink-500/50 rounded cursor-move flex items-center text-sm text-pink-400 hover:bg-pink-600/30 whitespace-nowrap">
              <Clock className="w-4 h-4 mr-2" /> Delay
            </div>
            <div draggable onDragStart={(e) => handleDragStart(e, 'Parallel')} className="px-3 py-2 bg-cyan-600/20 border border-cyan-500/50 rounded cursor-move flex items-center text-sm text-cyan-400 hover:bg-cyan-600/30 whitespace-nowrap">
              <Split className="w-4 h-4 mr-2" /> Parallel
            </div>
            <div draggable onDragStart={(e) => handleDragStart(e, 'SubWorkflow')} className="px-3 py-2 bg-purple-600/20 border border-purple-500/50 rounded cursor-move flex items-center text-sm text-purple-400 hover:bg-purple-600/30 whitespace-nowrap">
              <Box className="w-4 h-4 mr-2" /> Sub-Workflow
            </div>
            <div draggable onDragStart={(e) => handleDragStart(e, 'Loop')} className="px-3 py-2 bg-indigo-600/20 border border-indigo-500/50 rounded cursor-move flex items-center text-sm text-indigo-400 hover:bg-indigo-600/30 whitespace-nowrap">
              <Repeat className="w-4 h-4 mr-2" /> Loop
            </div>
            <div draggable onDragStart={(e) => handleDragStart(e, 'API')} className="px-3 py-2 bg-slate-600/20 border border-slate-500/50 rounded cursor-move flex items-center text-sm text-slate-400 hover:bg-slate-600/30 whitespace-nowrap">
              <Globe className="w-4 h-4 mr-2" /> API Request
            </div>
          </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={connectionMode ? "secondary" : "outline"}
            className={connectionMode ? "bg-blue-500/20 text-blue-400 border-blue-500" : "border-slate-700"}
            onClick={() => {
              setConnectionMode(!connectionMode);
              setConnectSource(null);
            }}
          >
            <MousePointer2 className="w-4 h-4 mr-2" /> 
            {connectionMode ? (connectSource ? "Select Target..." : "Select Source") : "Connect Nodes"}
          </Button>

          <Button 
             size="sm" 
             variant={isRunning ? "default" : "outline"} 
             className={isRunning ? "bg-green-600 animate-pulse" : "border-slate-700"} 
             onClick={runTest}
             disabled={isRunning}
          >
            <Play className="w-4 h-4 mr-2" /> {isRunning ? 'Running...' : 'Test Run'}
          </Button>

          <Button 
             size="sm" 
             variant="outline"
             className="border-slate-700 text-purple-400 hover:text-purple-300 hover:bg-purple-900/20" 
             onClick={analyzeWorkflow}
          >
            <Sparkles className="w-4 h-4 mr-2" /> AI Analyze
          </Button>

          <Button 
             size="sm" 
             variant={testConsoleOpen ? "secondary" : "outline"} 
             className="border-slate-700" 
             onClick={() => setTestConsoleOpen(!testConsoleOpen)}
          >
            <Terminal className="w-4 h-4 mr-2" /> Console
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button size="sm" variant="outline" className="border-slate-700 relative">
                <Users className="w-4 h-4 mr-2" /> Collaboration
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-slate-950 border-slate-800 text-white flex flex-col gap-4 w-[400px] sm:w-[540px]">
              <SheetHeader>
                 <SheetTitle>Workflow Collaboration</SheetTitle>
              </SheetHeader>
              <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden">
                <div className="h-1/2 border border-slate-800 rounded-lg overflow-hidden">
                  <VersionHistoryPanel />
                </div>
                <div className="h-1/2 border border-slate-800 rounded-lg overflow-hidden">
                  <CommentsPanel resourceType="Workflow" resourceId="wf_123" />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" /> Save
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        ref={canvasRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="flex-1 relative overflow-hidden bg-slate-950 cursor-crosshair"
        style={{
          backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      >
        <div className="absolute top-4 left-4 bg-slate-900/80 p-2 rounded border border-slate-800 text-xs text-slate-400 pointer-events-none">
          Drag nodes from toolbar • Toggle Connect mode to link nodes
        </div>

        {/* SVG Layer for Edges */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
            </marker>
          </defs>
          {edges.map(edge => {
            const source = nodes.find(n => n.id === edge.source);
            const target = nodes.find(n => n.id === edge.target);
            if (!source || !target) return null;

            return (
              <g key={edge.id}>
                <line 
                  x1={source.x + 100} 
                  y1={source.y + 40} 
                  x2={target.x + 100} 
                  y2={target.y + 40} 
                  stroke="#475569" 
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
                {edge.label && (
                  <rect 
                    x={(source.x + target.x)/2 + 90} 
                    y={(source.y + target.y)/2 + 30} 
                    width="40" height="20" 
                    fill="#0f172a" 
                    rx="4"
                  />
                )}
                {edge.label && (
                  <text 
                    x={(source.x + target.x)/2 + 110} 
                    y={(source.y + target.y)/2 + 45} 
                    textAnchor="middle" 
                    fill="#94a3b8" 
                    fontSize="10"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}
          
          {/* Connection Line Draft */}
          {connectionMode && connectSource && (
            <line 
               x1={nodes.find(n => n.id === connectSource).x + 100} 
               y1={nodes.find(n => n.id === connectSource).y + 40}
               x2={mousePos.x}
               y2={mousePos.y}
               stroke="#3b82f6" 
               strokeWidth="2" 
               strokeDasharray="5,5"
               className="animate-pulse"
            />
          )}
        </svg>

        {/* Nodes */}
        {nodes.map(node => {
           const isOrphaned = isOrphan(node.id);
           const isConnecting = connectSource === node.id;
           const suggestion = aiSuggestions[node.id];
           
           const nodeColor = 
             node.type === 'Trigger' ? 'bg-blue-900/80 border-blue-500' :
             node.type === 'Condition' ? 'bg-orange-900/80 border-orange-500' :
             node.type === 'Action' ? 'bg-emerald-900/80 border-emerald-500' :
             node.type === 'Delay' ? 'bg-pink-900/80 border-pink-500' :
             node.type === 'Parallel' ? 'bg-cyan-900/80 border-cyan-500' :
             node.type === 'Loop' ? 'bg-indigo-900/80 border-indigo-500' :
             node.type === 'API' ? 'bg-slate-700 border-slate-400' :
             'bg-slate-800 border-slate-600';

           return (
             <div
               key={node.id}
               style={{ left: node.x, top: node.y }}
               className={`
                 absolute w-[200px] p-3 rounded-lg border-2 shadow-xl backdrop-blur transition-all z-10
                 ${nodeColor}
                 ${isOrphaned ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-slate-950' : ''}
                 ${isConnecting ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-950 scale-105' : ''}
                 ${connectionMode ? 'cursor-crosshair hover:scale-105' : 'cursor-grab active:cursor-grabbing'}
                 ${selectedNode?.id === node.id ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950' : ''}
                 ${activeNodeId === node.id ? 'ring-4 ring-green-500 ring-offset-2 ring-offset-slate-950 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : ''}
               `}
               onClick={(e) => {
                  e.stopPropagation();
                  if (connectionMode) handleConnect(node.id);
                  else setSelectedNode(node);
               }}
               onDoubleClick={() => navigate(createPageUrl('WorkflowNodeDetail') + `?id=${node.id}&type=${node.type}&label=${encodeURIComponent(node.label)}`)}
             >
               <div className="flex justify-between items-start mb-2">
                 <span className="text-[10px] uppercase tracking-wider font-bold opacity-70 text-white flex items-center gap-1">
                   {node.type === 'Trigger' && <PlayCircle className="w-3 h-3" />}
                   {node.type === 'Condition' && <GitBranch className="w-3 h-3" />}
                   {node.type === 'Action' && <Zap className="w-3 h-3" />}
                   {node.type === 'Delay' && <Clock className="w-3 h-3" />}
                   {node.type === 'Parallel' && <Split className="w-3 h-3" />}
                   {node.type === 'Loop' && <Repeat className="w-3 h-3" />}
                   {node.type === 'API' && <Globe className="w-3 h-3" />}
                   {node.type}
                 </span>
                 <button 
                   onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }}
                   className="text-slate-400 hover:text-red-400"
                 >
                   <Trash2 className="w-3 h-3" />
                 </button>
               </div>
               
               <div className="text-sm font-bold text-white mb-1">{node.label}</div>
               
               {isOrphaned && (
                 <div className="flex items-center gap-1 text-[10px] text-red-400 mt-2 bg-red-500/10 p-1 rounded">
                   <AlertTriangle className="w-3 h-3" /> Disconnected
                 </div>
               )}

               {suggestion && (
                 <div className={`
                   flex items-start gap-1 text-[10px] mt-2 p-1.5 rounded border shadow-sm backdrop-blur-md max-w-[180px]
                   ${suggestion.type === 'error-handling' ? 'bg-red-500/30 text-red-200 border-red-500/60' : 
                     suggestion.type === 'optimization' ? 'bg-amber-500/30 text-amber-200 border-amber-500/60' : 
                     'bg-blue-500/30 text-blue-200 border-blue-500/60'}
                 `}>
                   <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" /> 
                   <span className="leading-tight">{suggestion.message}</span>
                 </div>
               )}
             </div>
           );
        })}
      </div>

      {/* Test Console Panel */}
      {testConsoleOpen && (
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-slate-900 border-t border-slate-800 z-40 flex flex-col shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-950">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-400" />
              <span className="font-bold text-sm text-slate-200">Test Console</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setTestConsoleOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 flex overflow-hidden">
            {/* Input Section */}
            <div className="w-1/3 border-r border-slate-800 p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                 <Label className="text-xs text-slate-400">Test Data (JSON)</Label>
                 <div className="flex gap-1">
                   <select 
                     className="bg-slate-800 border-slate-700 rounded text-[10px] px-1 h-6 text-white"
                     onChange={(e) => {
                       const tc = testCases.find(c => c.name === e.target.value);
                       if(tc) setTestInput(tc.input);
                     }}
                   >
                     <option value="">Load Case...</option>
                     {testCases.map(tc => <option key={tc.name} value={tc.name}>{tc.name}</option>)}
                   </select>
                   <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={saveTestCase} title="Save Case">
                     <Save className="w-3 h-3" />
                   </Button>
                 </div>
              </div>
              <textarea 
                className="flex-1 bg-slate-950 border border-slate-800 rounded p-2 text-xs font-mono text-blue-300 focus:outline-none focus:border-blue-500 resize-none"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
              />
            </div>
            {/* Logs Section */}
            <div className="flex-1 p-4 flex flex-col bg-slate-950 font-mono">
              <Label className="text-xs text-slate-400 mb-2">Execution Logs</Label>
              <div className="flex-1 overflow-y-auto space-y-1 pr-2">
                {testLogs.length === 0 && <span className="text-slate-600 text-xs italic">No execution logs yet. Run a test to see output.</span>}
                {testLogs.map((log, i) => (
                  <div key={i} className="text-xs flex gap-2 hover:bg-slate-900 p-1 rounded">
                    <span className="text-slate-500">[{log.time}]</span>
                    <span className={`
                      ${log.type === 'error' ? 'text-red-400' : 
                        log.type === 'success' ? 'text-green-400' : 'text-blue-300'}
                    `}>
                      {log.message}
                    </span>
                    {log.details && <span className="text-slate-500 truncate">- {log.details}</span>}
                  </div>
                ))}
                {isRunning && (
                   <div className="text-xs text-slate-500 animate-pulse pl-2">Processing...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}