
const escapeLatex = (str) => {
    if (!str) return "";
    return String(str)
        .replace(/\\/g, '\\textbackslash{}')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/\$/g, '\\$')
        .replace(/&/g, '\\&')
        .replace(/#/g, '\\#')
        .replace(/\^/g, '\\textasciicircum{}')
        .replace(/_/g, '\\_')
        .replace(/~/g, '\\textasciitilde{}')
        .replace(/%/g, '\\%');
};

export const generateTex = (data) => {
    const { basics, work, education, skills } = data;

    return `
\\documentclass[a4paper,10pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{geometry}
\\usepackage{fontawesome5}

\\geometry{left=1.5cm, top=1.5cm, right=1.5cm, bottom=1.5cm}

\\titleformat{\\section}{\\large\\bfseries\\uppercase}{}{0em}{}[\\titlerule]

\\begin{document}

% --- HEADER ---
\\begin{center}
    {\\Huge\\textbf{${escapeLatex(basics.name || "Your Name")}}} \\\\
    \\vspace{2mm}
    {\\large ${escapeLatex(basics.label || "")}} \\\\
    \\vspace{2mm}
    \\small
    ${basics.email ? `\\faEnvelope\\ ${escapeLatex(basics.email)}` : ""} 
    ${basics.phone ? `\\ $|$\\ \\faPhone\\ ${escapeLatex(basics.phone)}` : ""}
    ${basics.location?.city ? `\\ $|$\\ \\faMapMarker*\\ ${escapeLatex(basics.location.city)}` : ""}
    ${basics.url ? `\\ $|$\\ \\faGlobe\\ \\href{${basics.url}}{${escapeLatex(basics.url)}}` : ""}
\\end{center}

% --- SUMMARY ---
${basics.summary ? `
\\section{Summary}
${escapeLatex(basics.summary)}
\\vspace{3mm}
` : ""}

% --- EXPERIENCE ---
${work && work.length > 0 ? `
\\section{Experience}
\\begin{itemize}[leftmargin=0in, label={}]
    ${work.map(job => `
    \\item
        \\begin{tabular*}{0.98\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
            \\textbf{${escapeLatex(job.position)}} & \\textit{${escapeLatex(job.startDate)} -- ${escapeLatex(job.endDate || "Present")}} \\\\
            \\textit{${escapeLatex(job.name)}} & 
        \\end{tabular*}\\vspace{-5pt}
        \\begin{itemize}[leftmargin=0.2in]
            ${job.summary ? `\\item ${escapeLatex(job.summary)}` : ""}
            ${job.highlights && job.highlights.length > 0 ? job.highlights.map(h => `\\item ${escapeLatex(h)}`).join('\n') : ""}
        \\end{itemize}
    `).join('\n')}
\\end{itemize}
` : ""}

% --- EDUCATION ---
${education && education.length > 0 ? `
\\section{Education}
\\begin{itemize}[leftmargin=0in, label={}]
    ${education.map(edu => `
    \\item
        \\begin{tabular*}{0.98\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
            \\textbf{${escapeLatex(edu.institution)}} & \\textit{${escapeLatex(edu.startDate)} -- ${escapeLatex(edu.endDate || "Present")}} \\\\
            \\textit{${escapeLatex(edu.studyType)} in ${escapeLatex(edu.area)}} & 
        \\end{tabular*}
    `).join('\n')}
\\end{itemize}
` : ""}

% --- SKILLS ---
${skills && skills.length > 0 ? `
\\section{Technical Skills}
\\begin{itemize}[leftmargin=0.2in, label={}]
    \\small{\\item{
     ${skills.map(s => `\\textbf{${escapeLatex(s.name)}}: ${s.keywords ? s.keywords.map(k => escapeLatex(k)).join(", ") : ""}`).join(" \\\\ ")}
    }}
\\end{itemize}
` : ""}

\\end{document}
    `;
};
