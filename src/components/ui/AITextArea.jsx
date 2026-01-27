import React, { useState } from 'react';
import { Button } from './Button';
import { Sparkles, Loader2 } from 'lucide-react';
import { Label } from './Label';

const AITextArea = ({ label, value, onChange, sectionName, placeholder }) => {
    const [loading, setLoading] = useState(false);

    const handleOptimize = async () => {
        if (!value) return;
        setLoading(true);
        try {
            const response = await fetch('/api/ai/optimize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    section: sectionName || "Resume Content",
                    content: value
                })
            });
            const data = await response.json();
            if (data.suggestedContent) {
                // Determine event format based on what the parent expects
                // Using a synthetic event to match standard input behavior
                const syntheticEvent = { target: { value: data.suggestedContent } };
                onChange(syntheticEvent);
            }
        } catch (error) {
            console.error("AI Error:", error);
            alert("Failed to optimize content. Check console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                {label && <Label>{label}</Label>}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-6 px-2 text-xs"
                    onClick={handleOptimize}
                    disabled={loading || !value}
                >
                    {loading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                    {loading ? "Optimizing..." : "AI Improve"}
                </Button>
            </div>
            <textarea
                className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );
};

export default AITextArea;
