import React, { useState } from 'react';
import { 
  Calculator, Plus, Trash2, Save, GripVertical 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function SalaryStructureBuilder() {
  const [components, setComponents] = useState([
    { id: 1, name: 'Basic Salary', type: 'Earning', formula: 'base', fixed: true },
    { id: 2, name: 'House Rent Allowance', type: 'Earning', formula: 'base * 0.4', fixed: false },
    { id: 3, name: 'Provident Fund', type: 'Deduction', formula: 'base * 0.12', fixed: false },
  ]);

  const addComponent = () => {
    setComponents([...components, { id: Date.now(), name: '', type: 'Earning', formula: '', fixed: false }]);
  };

  const updateComponent = (id, field, value) => {
    setComponents(components.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeComponent = (id) => {
    setComponents(components.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-slate-800">Structure Formula Builder</h3>
        </div>
        <Button onClick={addComponent} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" /> Add Component
        </Button>
      </div>

      <div className="space-y-3">
        {components.map((comp) => (
            <div key={comp.id} className="flex items-start gap-3 p-3 bg-white border rounded-lg shadow-sm group hover:border-indigo-200 transition-colors">
                <GripVertical className="w-5 h-5 text-slate-300 mt-2 cursor-move" />
                
                <div className="flex-1 grid grid-cols-12 gap-3">
                    <div className="col-span-4">
                        <Input 
                            placeholder="Component Name" 
                            value={comp.name} 
                            onChange={e => updateComponent(comp.id, 'name', e.target.value)}
                            className="h-9"
                            readOnly={comp.fixed}
                        />
                    </div>
                    <div className="col-span-3">
                         <Select 
                            value={comp.type} 
                            onValueChange={v => updateComponent(comp.id, 'type', v)} 
                            disabled={comp.fixed}
                         >
                            <SelectTrigger className="h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Earning">Earning</SelectItem>
                                <SelectItem value="Deduction">Deduction</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="col-span-5">
                        <div className="relative">
                            <Input 
                                placeholder="Formula (e.g. base * 0.5)" 
                                value={comp.formula} 
                                onChange={e => updateComponent(comp.id, 'formula', e.target.value)}
                                className="h-9 font-mono text-xs"
                            />
                            <Badge variant="outline" className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] h-5">
                                fx
                            </Badge>
                        </div>
                    </div>
                </div>

                {!comp.fixed && (
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 text-slate-400 hover:text-red-500"
                        onClick={() => removeComponent(comp.id)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                )}
            </div>
        ))}
      </div>

      <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-500 font-mono">
        <p><strong>Available Variables:</strong> base, gross_pay, days_worked, total_working_days</p>
        <p><strong>Examples:</strong> <code>base * 0.5</code>, <code>gross_pay &gt; 5000 ? 200 : 0</code></p>
      </div>
      
      <div className="flex justify-end pt-2">
        <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Save className="w-4 h-4 mr-2" /> Save Structure
        </Button>
      </div>
    </div>
  );
}