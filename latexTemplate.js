/**
 * LaTeX Resume Template Generator
 * ATS-friendly, clean output with standard packages only
 */

const escapeLatex = (str) => {
    if (!str) return "";
    return String(str)
        .replace(/\\/g, '\\textbackslash{}')
        .replace(/&/g, '\\&')
        .replace(/%/g, '\\%')
        .replace(/\$/g, '\\$')
        .replace(/#/g, '\\#')
        .replace(/_/g, '\\_')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/~/g, '\\textasciitilde{}')
        .replace(/\^/g, '\\textasciicircum{}')
        .replace(/</g, '\\textless{}')
        .replace(/>/g, '\\textgreater{}');
};

export const generateTex = (data) => {
    const { basics = {}, work = [], education = [], skills = [], projects = [] } = data || {};

    const name = escapeLatex(basics.name || "Your Name");
    const label = escapeLatex(basics.label || "");
    const email = basics.email ? escapeLatex(basics.email) : "";
    const phone = basics.phone ? escapeLatex(basics.phone) : "";
    const city = basics.location?.city ? escapeLatex(basics.location.city) : "";
    const country = basics.location?.countryCode ? escapeLatex(basics.location.countryCode) : "";
    const summary = basics.summary ? escapeLatex(basics.summary) : "";

    // Build contact line
    const contactParts = [];
    if (email) contactParts.push(email);
    if (phone) contactParts.push(phone);
    if (city) contactParts.push(city + (country ? `, ${country}` : ""));
    const contactLine = contactParts.join(" \\textbar{} ");

    // Work Experience Section
    let workSection = "";
    if (work && work.length > 0) {
        const workItems = work.map(job => {
            const position = escapeLatex(job.position || "");
            const company = escapeLatex(job.name || "");
            const startDate = escapeLatex(job.startDate || "");
            const endDate = escapeLatex(job.endDate || "Present");
            const jobSummary = escapeLatex(job.summary || "");

            let highlights = "";
            if (job.highlights && job.highlights.length > 0) {
                highlights = job.highlights.map(h => `    \\item ${escapeLatex(h)}`).join("\n");
            } else if (jobSummary) {
                highlights = `    \\item ${jobSummary}`;
            }

            return `\\textbf{${position}} \\hfill ${startDate} -- ${endDate} \\\\
\\textit{${company}}
${highlights ? `\\begin{itemize}[leftmargin=0.5cm, topsep=0pt, parsep=0pt, itemsep=2pt]
${highlights}
\\end{itemize}` : ""}`;
        }).join("\n\\vspace{0.3cm}\n");

        workSection = `\\section*{Experience}
${workItems}`;
    }

    // Education Section
    let eduSection = "";
    if (education && education.length > 0) {
        const eduItems = education.map(edu => {
            const institution = escapeLatex(edu.institution || "");
            const degree = escapeLatex(edu.studyType || "");
            const field = escapeLatex(edu.area || "");
            const startDate = escapeLatex(edu.startDate || "");
            const endDate = escapeLatex(edu.endDate || "Present");

            return `\\textbf{${institution}} \\hfill ${startDate} -- ${endDate} \\\\
\\textit{${degree}${degree && field ? " in " : ""}${field}}`;
        }).join("\n\\vspace{0.2cm}\n");

        eduSection = `\\section*{Education}
${eduItems}`;
    }

    // Skills Section
    let skillsSection = "";
    if (skills && skills.length > 0) {
        const skillItems = skills.map(skill => {
            const skillName = escapeLatex(skill.name || "");
            const keywords = skill.keywords ? skill.keywords.map(k => escapeLatex(k)).join(", ") : "";
            return `\\textbf{${skillName}:} ${keywords}`;
        }).join(" \\\\\n");

        skillsSection = `\\section*{Skills}
${skillItems}`;
    }

    // Projects Section
    let projectsSection = "";
    if (projects && projects.length > 0) {
        const projectItems = projects.map(proj => {
            const projName = escapeLatex(proj.name || "");
            const projDesc = escapeLatex(proj.description || "");
            const startDate = escapeLatex(proj.startDate || "");
            const endDate = escapeLatex(proj.endDate || "");
            const dateRange = startDate ? ` \\hfill ${startDate}${endDate ? ` -- ${endDate}` : ""}` : "";

            return `\\textbf{${projName}}${dateRange} \\\\
${projDesc}`;
        }).join("\n\\vspace{0.2cm}\n");

        projectsSection = `\\section*{Projects}
${projectItems}`;
    }

    return `\\documentclass[11pt,a4paper]{article}

% --- PACKAGES ---
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage[margin=1.5cm]{geometry}
\\usepackage{enumitem}
\\usepackage{parskip}
\\usepackage[hidelinks]{hyperref}

% --- FORMATTING ---
\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\renewcommand{\\section}[1]{\\vspace{0.4cm}{\\large\\bfseries\\MakeUppercase{#1}}\\vspace{0.2cm}\\hrule\\vspace{0.3cm}}

\\begin{document}

% --- HEADER ---
\\begin{center}
{\\LARGE\\textbf{${name}}}${label ? ` \\\\ \\vspace{0.1cm} {\\large ${label}}` : ""}
\\vspace{0.2cm}

${contactLine ? `{\\small ${contactLine}}` : ""}
\\end{center}

${summary ? `\\section*{Summary}
${summary}
` : ""}
${workSection}

${eduSection}

${skillsSection}

${projectsSection}

\\end{document}
`;
};
