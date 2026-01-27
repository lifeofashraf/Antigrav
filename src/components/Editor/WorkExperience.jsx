import React from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Plus, Trash2 } from 'lucide-react';

const WorkExperienceFunc = ({ workData = [], onChange }) => {
    const addEntry = () => {
        const newEntry = {
            name: "",
            position: "",
            startDate: "",
            endDate: "",
            summary: "",
            highlights: []
        };
        onChange([...workData, newEntry]);
    };

    const removeEntry = (index) => {
        const newData = [...workData];
        newData.splice(index, 1);
        onChange(newData);
    };

    const updateEntry = (index, field, value) => {
        const newData = [...workData];
        newData[index][field] = value;
        onChange(newData);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Work Experience</CardTitle>
                <Button size="sm" onClick={addEntry} variant="outline">
                    <Plus className="w-4 h-4 mr-2" /> Add Position
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                {workData.length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-md border border-dashed">
                        No work experience added yet.
                    </p>
                )}

                {workData.map((entry, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-lg relative bg-slate-50/50">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                            onClick={() => removeEntry(index)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Company Name</Label>
                                <Input
                                    value={entry.name}
                                    onChange={(e) => updateEntry(index, 'name', e.target.value)}
                                    placeholder="e.g. Google"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Position</Label>
                                <Input
                                    value={entry.position}
                                    onChange={(e) => updateEntry(index, 'position', e.target.value)}
                                    placeholder="e.g. Senior Developer"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input
                                    type="date"
                                    value={entry.startDate}
                                    onChange={(e) => updateEntry(index, 'startDate', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input
                                    type="date"
                                    value={entry.endDate}
                                    onChange={(e) => updateEntry(index, 'endDate', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label>Summary</Label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={entry.summary}
                                    onChange={(e) => updateEntry(index, 'summary', e.target.value)}
                                    placeholder="Describe your responsibilities..."
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default WorkExperienceFunc;
