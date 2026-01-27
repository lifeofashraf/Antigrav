import React from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Plus, Trash2 } from 'lucide-react';

const EducationFunc = ({ eduData = [], onChange }) => {
    const addEntry = () => {
        const newEntry = {
            institution: "",
            area: "",
            studyType: "",
            startDate: "",
            endDate: "",
            score: ""
        };
        onChange([...eduData, newEntry]);
    };

    const removeEntry = (index) => {
        const newData = [...eduData];
        newData.splice(index, 1);
        onChange(newData);
    };

    const updateEntry = (index, field, value) => {
        const newData = [...eduData];
        newData[index][field] = value;
        onChange(newData);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Education</CardTitle>
                <Button size="sm" onClick={addEntry} variant="outline">
                    <Plus className="w-4 h-4 mr-2" /> Add Education
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                {eduData.length === 0 && (
                    <p className="text-sm text-slate-500 text-center py-4 bg-slate-50 rounded-md border border-dashed">
                        No education added yet.
                    </p>
                )}

                {eduData.map((entry, index) => (
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
                            <div className="space-y-2 col-span-2">
                                <Label>Institution</Label>
                                <Input
                                    value={entry.institution}
                                    onChange={(e) => updateEntry(index, 'institution', e.target.value)}
                                    placeholder="e.g. University of Design"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Degree / Study Type</Label>
                                <Input
                                    value={entry.studyType}
                                    onChange={(e) => updateEntry(index, 'studyType', e.target.value)}
                                    placeholder="e.g. Bachelor's"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Area of Study</Label>
                                <Input
                                    value={entry.area}
                                    onChange={(e) => updateEntry(index, 'area', e.target.value)}
                                    placeholder="e.g. Computer Science"
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
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default EducationFunc;
