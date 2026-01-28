import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { Upload, FileText, X, Loader2, Sparkles } from 'lucide-react';

const ImportResumeModal = ({ isOpen, onClose, onImport }) => {
    const [mode, setMode] = useState('paste'); // 'paste' or 'upload'
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handlePasteSubmit = async () => {
        if (!text.trim()) {
            setError('Please paste your resume text');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/ai/parse-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            const data = await response.json();

            if (data.resumeData) {
                onImport(data.resumeData);
                onClose();
            } else {
                setError(data.error || 'Failed to parse resume');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setError('Please upload a PDF file');
            return;
        }

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('pdf', file);

        try {
            const response = await fetch('/api/ai/parse-resume', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if (data.resumeData) {
                onImport(data.resumeData);
                onClose();
            } else {
                setError(data.error || 'Failed to parse PDF');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-indigo-600" />
                        <h2 className="text-xl font-bold text-slate-900">Import Existing Resume</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Mode Tabs */}
                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => setMode('paste')}
                        className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 ${mode === 'paste'
                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <FileText className="w-4 h-4" /> Paste Text
                    </button>
                    <button
                        onClick={() => setMode('upload')}
                        className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 ${mode === 'upload'
                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <Upload className="w-4 h-4" /> Upload PDF
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {mode === 'paste' ? (
                        <div className="space-y-4">
                            <p className="text-sm text-slate-600">
                                Paste your resume text below and our AI will automatically extract the information.
                            </p>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Paste your resume content here..."
                                className="w-full h-64 p-4 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                                disabled={loading}
                            />
                            <Button
                                onClick={handlePasteSubmit}
                                disabled={loading || !text.trim()}
                                className="w-full"
                            >
                                {loading ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Parsing...</>
                                ) : (
                                    <><Sparkles className="w-4 h-4 mr-2" /> Parse with AI</>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-slate-600">
                                Upload a PDF resume and our AI will extract the information automatically.
                            </p>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition"
                            >
                                {loading ? (
                                    <Loader2 className="w-12 h-12 mx-auto text-indigo-600 animate-spin" />
                                ) : (
                                    <>
                                        <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                                        <p className="text-slate-600 font-medium">Click to upload PDF</p>
                                        <p className="text-sm text-slate-400 mt-1">Max 5MB</p>
                                    </>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImportResumeModal;
