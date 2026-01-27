import React, { useState } from 'react';
import { initialResumeData } from '../../consts/initialData';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import WorkExperienceFunc from './WorkExperience';
import EducationFunc from './EducationComponent';

const ResumeForm = ({ onUpdate }) => {
    const [data, setData] = useState(initialResumeData);

    const handleChange = (section, field, value) => {
        const newData = { ...data };
        if (section === 'basics') {
            newData.basics[field] = value;
        } else {
            newData[section] = value; // Handle root level arrays like 'work', 'education'
        }

        setData(newData);
        if (onUpdate) onUpdate(newData);
    };

    return (
        <div className="space-y-8 max-w-2xl mx-auto pb-20">
            {/* Personal Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Personal Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                        <Label>Full Name</Label>
                        <Input
                            value={data.basics.name}
                            onChange={(e) => handleChange('basics', 'name', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Job Title</Label>
                        <Input
                            value={data.basics.label}
                            onChange={(e) => handleChange('basics', 'label', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                            value={data.basics.email}
                            onChange={(e) => handleChange('basics', 'email', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                            value={data.basics.phone}
                            onChange={(e) => handleChange('basics', 'phone', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label>Summary</Label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={data.basics.summary}
                            onChange={(e) => handleChange('basics', 'summary', e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Work Experience */}
            <WorkExperienceFunc
                workData={data.work}
                onChange={(newWork) => handleChange('work', null, newWork)}
            />

            {/* Education */}
            <EducationFunc
                eduData={data.education}
                onChange={(newEdu) => handleChange('education', null, newEdu)}
            />

            {/* Skills Placeholder */}
            <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                Skills Section Coming Soon...
            </div>
        </div>
    );
};

export default ResumeForm;
