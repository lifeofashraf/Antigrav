import React, { useState } from 'react';
import { initialResumeData } from '../../consts/initialData';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import WorkExperienceFunc from './WorkExperience';
import EducationFunc from './EducationComponent';
import SkillsFunc from './SkillsComponent';
import ProjectsFunc from './ProjectsComponent';
import AITextArea from '../ui/AITextArea';
import ImportResumeModal from '../ui/ImportResumeModal';
import { Upload } from 'lucide-react';

const ResumeForm = ({ onUpdate }) => {
    const [data, setData] = useState(initialResumeData);
    const [showImportModal, setShowImportModal] = useState(false);

    const handleChange = (section, field, value) => {
        const newData = { ...data };
        if (section === 'basics') {
            newData.basics[field] = value;
        } else {
            newData[section] = value;
        }

        setData(newData);
        if (onUpdate) onUpdate(newData);
    };

    const handleImport = (importedData) => {
        // Merge imported data with defaults to ensure all fields exist
        const mergedData = {
            ...initialResumeData,
            ...importedData,
            basics: { ...initialResumeData.basics, ...importedData.basics }
        };
        setData(mergedData);
        if (onUpdate) onUpdate(mergedData);
    };

    return (
        <div className="space-y-8 max-w-2xl mx-auto pb-20">
            {/* Import Modal */}
            <ImportResumeModal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                onImport={handleImport}
            />

            {/* Import Button */}
            <div className="flex justify-end">
                <Button variant="outline" onClick={() => setShowImportModal(true)}>
                    <Upload className="w-4 h-4 mr-2" /> Import Existing Resume
                </Button>
            </div>

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
                    <div className="space-y-2">
                        <Label>LinkedIn / Website</Label>
                        <Input
                            value={data.basics.url || ''}
                            onChange={(e) => handleChange('basics', 'url', e.target.value)}
                            placeholder="https://linkedin.com/in/..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>City</Label>
                        <Input
                            value={data.basics.location?.city || ''}
                            onChange={(e) => {
                                const newLoc = { ...data.basics.location, city: e.target.value };
                                handleChange('basics', 'location', newLoc);
                            }}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Country Code</Label>
                        <Input
                            value={data.basics.location?.countryCode || ''}
                            onChange={(e) => {
                                const newLoc = { ...data.basics.location, countryCode: e.target.value };
                                handleChange('basics', 'location', newLoc);
                            }}
                        />
                    </div>
                    <div className="space-y-2 col-span-2">
                        <AITextArea
                            label="Summary"
                            sectionName="Professional Summary"
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

            {/* Skills */}
            <SkillsFunc
                skillsData={data.skills}
                onChange={(newSkills) => handleChange('skills', null, newSkills)}
            />

            {/* Projects */}
            <ProjectsFunc
                projectData={data.projects}
                onChange={(newProjects) => handleChange('projects', null, newProjects)}
            />
        </div>
    );
};

export default ResumeForm;
