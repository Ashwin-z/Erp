import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdCampaignForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(initialData || {
    name: "",
    advertiser: "",
    type: "Display",
    status: "Draft",
    start_date: null,
    end_date: null,
    budget_total: 0,
    budget_daily: 0,
    bid_strategy: "CPM",
    bid_amount: 0,
    target_locations: [],
    target_demographics: { age_range: "18-65", gender: "All" },
    ab_test_config: { enabled: false, variants: [] }
  });

  const [newLocation, setNewLocation] = useState("");

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addLocation = () => {
    if (newLocation && !formData.target_locations.includes(newLocation)) {
      setFormData(prev => ({ ...prev, target_locations: [...prev.target_locations, newLocation] }));
      setNewLocation("");
    }
  };

  const removeLocation = (loc) => {
    setFormData(prev => ({ ...prev, target_locations: prev.target_locations.filter(l => l !== loc) }));
  };

  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Campaign Name</Label>
          <Input 
            value={formData.name} 
            onChange={(e) => handleChange('name', e.target.value)} 
            placeholder="e.g. Summer Sale 2024"
          />
        </div>
        <div className="space-y-2">
          <Label>Advertiser</Label>
          <Input 
            value={formData.advertiser} 
            onChange={(e) => handleChange('advertiser', e.target.value)} 
            placeholder="Advertiser Name"
          />
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details & Schedule</TabsTrigger>
          <TabsTrigger value="targeting">Targeting</TabsTrigger>
          <TabsTrigger value="budget">Budget & Bidding</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={formData.type} onValueChange={(v) => handleChange('type', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Display">Display</SelectItem>
                  <SelectItem value="Native">Native</SelectItem>
                  <SelectItem value="Video">Video</SelectItem>
                  <SelectItem value="Popup">Popup</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => handleChange('status', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 flex flex-col">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.start_date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.start_date ? format(new Date(formData.start_date), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={formData.start_date ? new Date(formData.start_date) : undefined} onSelect={(d) => handleChange('start_date', d?.toISOString())} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2 flex flex-col">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.end_date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.end_date ? format(new Date(formData.end_date), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={formData.end_date ? new Date(formData.end_date) : undefined} onSelect={(d) => handleChange('end_date', d?.toISOString())} />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-4">
            <Switch 
              checked={formData.ab_test_config?.enabled} 
              onCheckedChange={(c) => handleChange('ab_test_config', { ...formData.ab_test_config, enabled: c })} 
            />
            <Label>Enable A/B Testing</Label>
          </div>
        </TabsContent>

        <TabsContent value="targeting" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Target Locations</Label>
            <div className="flex gap-2">
              <Input 
                value={newLocation} 
                onChange={(e) => setNewLocation(e.target.value)} 
                placeholder="Add country or region (e.g. Singapore)"
              />
              <Button onClick={addLocation} type="button" size="icon"><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.target_locations?.map(loc => (
                <div key={loc} className="bg-slate-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {loc}
                  <Trash2 className="h-3 w-3 cursor-pointer text-slate-500 hover:text-red-500" onClick={() => removeLocation(loc)} />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Age Range</Label>
              <Select 
                value={formData.target_demographics?.age_range} 
                onValueChange={(v) => handleChange('target_demographics', { ...formData.target_demographics, age_range: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-24">18-24</SelectItem>
                  <SelectItem value="25-34">25-34</SelectItem>
                  <SelectItem value="35-44">35-44</SelectItem>
                  <SelectItem value="45-54">45-54</SelectItem>
                  <SelectItem value="55+">55+</SelectItem>
                  <SelectItem value="18-65">All (18-65)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select 
                value={formData.target_demographics?.gender} 
                onValueChange={(v) => handleChange('target_demographics', { ...formData.target_demographics, gender: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Total Budget ($)</Label>
              <Input type="number" value={formData.budget_total} onChange={(e) => handleChange('budget_total', parseFloat(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Daily Budget ($)</Label>
              <Input type="number" value={formData.budget_daily} onChange={(e) => handleChange('budget_daily', parseFloat(e.target.value))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bid Strategy</Label>
              <Select value={formData.bid_strategy} onValueChange={(v) => handleChange('bid_strategy', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CPM">CPM (Cost per Mille)</SelectItem>
                  <SelectItem value="CPC">CPC (Cost per Click)</SelectItem>
                  <SelectItem value="CPA">CPA (Cost per Action)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Bid Amount ($)</Label>
              <Input type="number" value={formData.bid_amount} onChange={(e) => handleChange('bid_amount', parseFloat(e.target.value))} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSubmit(formData)} className="bg-indigo-600 hover:bg-indigo-700">
          {initialData ? 'Update Campaign' : 'Create Campaign'}
        </Button>
      </div>
    </div>
  );
}