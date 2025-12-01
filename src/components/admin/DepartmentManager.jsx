import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Building2, Users, Calendar, FileText, Settings,
  Plus, Edit, Trash2, Briefcase, DollarSign, Cpu, Cog
} from 'lucide-react';

const defaultDepartments = [
  { id: '1', name: 'Administration', code: 'ADMIN', icon: 'Building2', color: '#6366f1', memberCount: 5, head: 'John Admin' },
  { id: '2', name: 'Finance', code: 'FIN', icon: 'DollarSign', color: '#22c55e', memberCount: 8, head: 'Sarah Finance' },
  { id: '3', name: 'Human Resources', code: 'HR', icon: 'Users', color: '#f97316', memberCount: 4, head: 'Mike HR' },
  { id: '4', name: 'Sales', code: 'SALES', icon: 'Briefcase', color: '#3b82f6', memberCount: 12, head: 'Anna Sales' },
  { id: '5', name: 'IT', code: 'IT', icon: 'Cpu', color: '#8b5cf6', memberCount: 6, head: 'David IT' },
  { id: '6', name: 'Operations', code: 'OPS', icon: 'Cog', color: '#ec4899', memberCount: 15, head: 'Lisa Ops' }
];

const iconMap = {
  Building2, Users, DollarSign, Briefcase, Cpu, Cog, Calendar, FileText, Settings
};

export default function DepartmentManager({ departments = defaultDepartments, onSave, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', color: '#3b82f6', icon: 'Building2' });

  const handleEdit = (dept) => {
    setEditDept(dept);
    setFormData({ name: dept.name, code: dept.code, color: dept.color, icon: dept.icon });
    setShowForm(true);
  };

  const handleSave = () => {
    onSave && onSave({ ...formData, id: editDept?.id });
    setShowForm(false);
    setEditDept(null);
    setFormData({ name: '', code: '', color: '#3b82f6', icon: 'Building2' });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Department Management
          </CardTitle>
          <Button onClick={() => setShowForm(true)} className="bg-lime-500 hover:bg-lime-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Department
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => {
              const Icon = iconMap[dept.icon] || Building2;
              return (
                <div 
                  key={dept.id} 
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  style={{ borderLeftColor: dept.color, borderLeftWidth: '4px' }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${dept.color}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: dept.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{dept.name}</h3>
                        <p className="text-xs text-slate-500">Code: {dept.code}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(dept)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete && onDelete(dept.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-slate-500">
                      <Users className="w-4 h-4" />
                      {dept.memberCount} members
                    </div>
                    <Badge variant="outline">{dept.head || 'No Head'}</Badge>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Calendar className="w-3 h-3 mr-1" /> Calendar
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileText className="w-3 h-3 mr-1" /> Tasks
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editDept ? 'Edit Department' : 'Add Department'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Department Name</Label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Marketing"
              />
            </div>
            <div>
              <Label>Code</Label>
              <Input 
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. MKT"
                maxLength={10}
              />
            </div>
            <div>
              <Label>Color</Label>
              <div className="flex gap-2 mt-2">
                {['#3b82f6', '#22c55e', '#f97316', '#8b5cf6', '#ec4899', '#6366f1'].map(color => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? 'border-slate-900' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData({ ...formData, color })}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-lime-500 hover:bg-lime-600">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}