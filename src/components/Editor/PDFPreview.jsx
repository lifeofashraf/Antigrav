import React from 'react';

const PDFPreview = ({ data }) => {
    if (!data) return null;

    return (
        <div className="p-16 h-full text-slate-900 font-serif overflow-hidden">
            {/* Header */}
            <header className="border-b-2 border-slate-900 pb-6 mb-6">
                <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">{data.basics.name || "Your Name"}</h1>
                <p className="text-lg text-slate-600 font-sans tracking-wide uppercase">{data.basics.label || "Professional Role"}</p>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500 font-sans">
                    {data.basics.email && <span>{data.basics.email}</span>}
                    {data.basics.phone && <span>• {data.basics.phone}</span>}
                    {data.basics.location?.city && <span>• {data.basics.location?.city}, {data.basics.location?.countryCode}</span>}
                    {data.basics.url && <span>• {data.basics.url}</span>}
                </div>
            </header>

            {/* Summary */}
            {data.basics.summary && (
                <section className="mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-3">About</h3>
                    <p className="leading-relaxed text-slate-700">
                        {data.basics.summary}
                    </p>
                </section>
            )}

            {/* Work Experience */}
            {data.work && data.work.length > 0 && (
                <section className="mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Experience</h3>
                    <div className="space-y-6">
                        {data.work.map((job, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className="font-bold text-lg text-slate-800">{job.position}</h4>
                                    <span className="text-sm text-slate-500 italic">
                                        {job.startDate} — {job.endDate || "Present"}
                                    </span>
                                </div>
                                <div className="text-slate-600 font-medium mb-2">{job.name}</div>
                                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                    {job.summary}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {data.education && data.education.length > 0 && (
                <section className="mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Education</h3>
                    <div className="space-y-6">
                        {data.education.map((edu, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className="font-bold text-lg text-slate-800">{edu.institution}</h4>
                                    <span className="text-sm text-slate-500 italic">
                                        {edu.startDate} — {edu.endDate || "Present"}
                                    </span>
                                </div>
                                <div className="text-slate-600 font-medium">
                                    {edu.studyType} in {edu.area}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {data.projects && data.projects.length > 0 && (
                <section className="mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Projects</h3>
                    <div className="space-y-4">
                        {data.projects.map((proj, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-lg text-slate-800">{proj.name}</h4>
                                        {proj.url && <a href={proj.url} className="text-xs text-blue-500 underline" target="_blank">Link</a>}
                                    </div>
                                    <span className="text-sm text-slate-500 italic">
                                        {proj.startDate} — {proj.endDate || "Present"}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed">
                                    {proj.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
                <section className="mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Technical Skills</h3>
                    <div className="grid grid-cols-2 gap-y-2">
                        {data.skills.map((skill, index) => (
                            <div key={index} className="text-sm">
                                <span className="font-bold text-slate-800">{skill.name}:</span> <span className="text-slate-600">{skill.keywords ? skill.keywords.join(", ") : ""}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default PDFPreview;
