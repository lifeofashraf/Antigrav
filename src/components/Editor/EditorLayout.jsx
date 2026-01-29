import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Download, Save, Loader2 } from 'lucide-react';

const EditorLayout = ({ children, preview, onExportPDF }) => {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        if (isExporting) return;
        setIsExporting(true);
        try {
            await onExportPDF?.();
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Left Sidebar: Form Editor */}
            <div className="w-1/2 flex flex-col border-r border-slate-200 bg-white h-full relative z-10 shadow-xl">
                <header className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                        Resume Builder
                    </h1>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Save className="w-4 h-4 mr-2" />
                            Save
                        </Button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
                    {children}
                </div>
            </div>

            {/* Right Sidebar: Live Preview */}
            <div className="w-1/2 flex flex-col h-full bg-slate-100/50">
                <header className="px-6 py-4 border-b border-slate-200/50 flex justify-between items-center bg-white/50 backdrop-blur-sm">
                    <span className="text-sm font-medium text-slate-500">Live Preview</span>
                    <Button size="sm" onClick={handleExport} disabled={isExporting}>
                        {isExporting ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Download className="w-4 h-4 mr-2" />
                        )}
                        {isExporting ? 'Exporting...' : 'Export PDF'}
                    </Button>
                </header>
                <div className="flex-1 overflow-y-auto p-8 flex justify-center">
                    <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl origin-top transform scale-90 mb-10">
                        {preview}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorLayout;

