import React from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Plus, Trash2 } from 'lucide-react';

const SkillsFunc = ({ skillsData = [], onChange }) => {
    const addEntry = () => {
        const newEntry = {
            name: "",
            level: "",
            keywords: []
        };
        onChange([...skillsData, newEntry]);
    };

    const removeEntry = (index) => {
        const newData = [...skillsData];
        newData.splice(index, 1);
        onChange(newData);
    };

    const updateEntry = (index, field, value) => {
        const newData = [...skillsData];
        newData[index][field] = value;
        onChange(newData);
    };

    const handleKeywordsChange = (index, value) => {
        // Split comma-separated string into array
        const keywordsArray = value.split(',').map(s => s.trim()).filter(s => s);
        updateEntry(index, 'keywords', keywordsArray);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Skills</CardTitle>
                <Button size="sm" onClick={addEntry} variant="outline">
                    <Plus className="w-4 h-4 mr-2" /> Add Skill Category
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                {skillsData.length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-md border border-dashed">
                        No skills added yet.
                    </p>
                )}

                {skillsData.map((entry, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-lg relative bg-slate-50/50">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                            onClick={() => removeEntry(index)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label>Category Name</Label>
                                <Input
                                    value={entry.name}
                                    onChange={(e) => updateEntry(index, 'name', e.target.value)}
                                    placeholder="e.g. Languages or Frameworks"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Skills (Comma separated)</Label>
                                <Input
                                    value={entry.keywords ? entry.keywords.join(', ') : ''}
                                    onChange={(e) => handleKeywordsChange(index, e.target.value)}
                                    placeholder="e.g. Java, Python, C++, Go"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default SkillsFunc;
