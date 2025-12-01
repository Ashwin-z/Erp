import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Layout, Plus, Eye, Code, Sparkles, Image, Type,
  Square, Link2, Settings, Smartphone, Monitor, Tablet, Save
} from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import ModuleDashboard from '../components/modules/ModuleDashboard';

const templates = [
  { id: 1, name: 'Product Landing', preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop', category: 'Marketing' },
  { id: 2, name: 'Coming Soon', preview: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop', category: 'Launch' },
  { id: 3, name: 'Event Promo', preview: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop', category: 'Events' },
  { id: 4, name: 'Service Page', preview: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=300&h=200&fit=crop', category: 'Business' }
];

const components = [
  { id: 'hero', name: 'Hero Section', icon: Layout },
  { id: 'text', name: 'Text Block', icon: Type },
  { id: 'image', name: 'Image', icon: Image },
  { id: 'button', name: 'Button', icon: Square },
  { id: 'form', name: 'Contact Form', icon: Settings },
  { id: 'cta', name: 'CTA Banner', icon: Link2 }
];

export default function WebBuilder() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCompany, setActiveCompany] = useState("1");
  const [activeTab, setActiveTab] = useState('editor');
  const [viewport, setViewport] = useState('desktop');
  const [aiPrompt, setAiPrompt] = useState('');
  const [generating, setGenerating] = useState(false);

  const stats = [
    { label: 'Published Pages', value: 12, icon: Layout, color: 'bg-blue-500', trend: 20 },
    { label: 'Total Views', value: '45.2K', icon: Eye, color: 'bg-green-500', trend: 35 },
    { label: 'Avg Time on Page', value: '2:45', icon: Settings, color: 'bg-purple-500', trend: 12 },
    { label: 'Conversions', value: 156, icon: Link2, color: 'bg-amber-500', trend: 28 }
  ];

  const handleAIGenerate = async () => {
    setGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setGenerating(false);
    }, 2000);
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
                <h1 className="text-2xl font-bold text-slate-900">Web Builder</h1>
                <p className="text-slate-500">Create landing pages with drag-and-drop and AI</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button className="bg-lime-500 hover:bg-lime-600">
                  <Plus className="w-4 h-4 mr-2" />
                  New Page
                </Button>
              </div>
            </div>

            <ModuleDashboard stats={stats} />

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="pages">My Pages</TabsTrigger>
                <TabsTrigger value="ai">AI Generator</TabsTrigger>
              </TabsList>

              <TabsContent value="editor">
                <div className="grid lg:grid-cols-4 gap-6">
                  {/* Components Panel */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Components</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {components.map((comp) => (
                        <div
                          key={comp.id}
                          className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-move hover:bg-slate-100 transition-colors"
                          draggable
                        >
                          <comp.icon className="w-5 h-5 text-slate-600" />
                          <span className="text-sm font-medium">{comp.name}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Canvas */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-sm">Canvas</CardTitle>
                        <div className="flex gap-1">
                          <Button 
                            variant={viewport === 'desktop' ? 'default' : 'ghost'} 
                            size="icon"
                            onClick={() => setViewport('desktop')}
                          >
                            <Monitor className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant={viewport === 'tablet' ? 'default' : 'ghost'} 
                            size="icon"
                            onClick={() => setViewport('tablet')}
                          >
                            <Tablet className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant={viewport === 'mobile' ? 'default' : 'ghost'} 
                            size="icon"
                            onClick={() => setViewport('mobile')}
                          >
                            <Smartphone className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className={`bg-white border-2 border-dashed border-slate-200 rounded-lg min-h-[500px] flex items-center justify-center mx-auto ${
                          viewport === 'mobile' ? 'w-80' : viewport === 'tablet' ? 'w-[500px]' : 'w-full'
                        }`}>
                          <div className="text-center text-slate-400">
                            <Layout className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Drag components here</p>
                            <p className="text-sm">or use AI to generate</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Properties */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Properties</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-500 text-center py-8">
                        Select an element to edit its properties
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="templates">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {templates.map((template) => (
                    <Card key={template.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                      <div className="aspect-video overflow-hidden">
                        <img src={template.preview} alt={template.name} className="w-full h-full object-cover" />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{template.name}</p>
                            <Badge variant="secondary">{template.category}</Badge>
                          </div>
                          <Button size="sm">Use</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="ai">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      AI Page Generator
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-w-2xl mx-auto space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Describe your page</label>
                        <Textarea 
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          placeholder="E.g., Create a modern landing page for a SaaS product with a hero section, features grid, pricing table, and contact form. Use blue and white colors with a professional look."
                          rows={4}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Style</label>
                          <select className="w-full p-2 border rounded-lg">
                            <option>Modern</option>
                            <option>Minimal</option>
                            <option>Bold</option>
                            <option>Corporate</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Color Scheme</label>
                          <select className="w-full p-2 border rounded-lg">
                            <option>Blue & White</option>
                            <option>Green & Black</option>
                            <option>Purple & Gold</option>
                            <option>Custom</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Type</label>
                          <select className="w-full p-2 border rounded-lg">
                            <option>Landing Page</option>
                            <option>Product Page</option>
                            <option>Coming Soon</option>
                            <option>Event</option>
                          </select>
                        </div>
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500"
                        onClick={handleAIGenerate}
                        disabled={generating}
                      >
                        {generating ? (
                          <>Generating...</>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate with AI
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </div>
  );
}