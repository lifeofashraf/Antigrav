import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Groq } from 'groq-sdk';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { generateTex } from './latexTemplate.js';
import { randomUUID } from 'crypto';
import multer from 'multer';
import pdf from 'pdf-parse';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Multer config for PDF uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

// AI Service (Groq)
const groq = process.env.GROQ_API_KEY ? new Groq({
    apiKey: process.env.GROQ_API_KEY
}) : null;

// --- API Routes ---

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Parse Resume from Text/PDF using AI
app.post('/api/ai/parse-resume', upload.single('pdf'), async (req, res) => {
    if (!groq) {
        return res.status(503).json({ error: 'Groq API Key not configured' });
    }

    let resumeText = req.body.text || '';

    // If PDF uploaded, extract text
    if (req.file) {
        try {
            const pdfData = await pdf(req.file.buffer);
            resumeText = pdfData.text;
        } catch (err) {
            console.error("PDF Parse Error:", err);
            return res.status(400).json({ error: 'Failed to parse PDF file' });
        }
    }

    if (!resumeText.trim()) {
        return res.status(400).json({ error: 'No resume text provided' });
    }

    const extractionPrompt = `You are an expert resume parser. Extract structured data from the following resume text and return it as valid JSON matching this exact schema:

{
  "basics": {
    "name": "string",
    "label": "string (job title)",
    "email": "string",
    "phone": "string",
    "summary": "string",
    "location": { "city": "string", "countryCode": "string" }
  },
  "work": [{ "name": "string (company)", "position": "string", "startDate": "string", "endDate": "string", "summary": "string" }],
  "education": [{ "institution": "string", "studyType": "string", "area": "string", "startDate": "string", "endDate": "string" }],
  "skills": [{ "name": "string (category)", "keywords": ["string"] }],
  "projects": [{ "name": "string", "description": "string", "url": "string" }]
}

Return ONLY the JSON object, no markdown, no explanation.

RESUME TEXT:
${resumeText.substring(0, 8000)}`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: extractionPrompt }],
            model: "mixtral-8x7b-32768",
            max_tokens: 2000,
        });

        const responseText = completion.choices[0]?.message?.content || "{}";

        // Try to parse the JSON response
        let parsed;
        try {
            // Clean up potential markdown code blocks
            const cleanJson = responseText.replace(/```json\n?|\n?```/g, '').trim();
            parsed = JSON.parse(cleanJson);
        } catch (parseErr) {
            console.error("JSON Parse Error:", parseErr, responseText);
            return res.status(500).json({ error: 'AI returned invalid JSON', raw: responseText });
        }

        res.json({ resumeData: parsed });
    } catch (error) {
        console.error("Groq Parse Error:", error);
        res.status(500).json({ error: 'AI parsing failed' });
    }
});

// AI Optimization Endpoint
app.post('/api/ai/optimize', async (req, res) => {
    if (!groq) {
        return res.status(503).json({ error: 'Groq API Key not configured' });
    }
    const { section, content } = req.body;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a professional resume editor. Rewrite the following content to be more impactful, using action verbs and quantifiable results where possible. Return ONLY the rewritten text."
                },
                {
                    role: "user",
                    content: `Section: ${section}\nContent: ${content}`
                }
            ],
            model: "mixtral-8x7b-32768",
        });

        res.json({ suggestedContent: completion.choices[0]?.message?.content || "" });
    } catch (error) {
        console.error("Groq Error:", error);
        res.status(500).json({ error: 'AI optimization failed' });
    }
});

// AI Chatbot Endpoint (Conversational)
app.post('/api/ai/chat', async (req, res) => {
    if (!groq) {
        return res.status(503).json({ error: 'Groq API Key not configured' });
    }
    const { messages, resumeContext } = req.body;

    // Build system prompt with resume context
    const systemPrompt = `You are "ResumeBot", a friendly AI assistant helping users build professional resumes.

CURRENT RESUME DATA:
${resumeContext ? JSON.stringify(resumeContext, null, 2) : "No resume data yet."}

YOUR ROLE:
- Guide users through resume building
- Suggest improvements to their content
- Answer questions about resume best practices
- Be encouraging and professional
- Keep responses concise (2-3 sentences max unless asked for detail)
- When suggesting text, format it clearly so they can copy it`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
            model: "mixtral-8x7b-32768",
            max_tokens: 500,
        });

        res.json({
            reply: completion.choices[0]?.message?.content || "I couldn't generate a response.",
            role: "assistant"
        });
    } catch (error) {
        console.error("Groq Chat Error:", error);
        res.status(500).json({ error: 'AI chat failed' });
    }
});

// PDF Generation Endpoint (LaTeX)
app.post('/api/generate-pdf', (req, res) => {
    const resumeData = req.body;
    const texContent = generateTex(resumeData);

    // Create Temp Directory
    const jobId = randomUUID();
    const tempDir = path.join(__dirname, 'temp', jobId);

    if (!fs.existsSync(path.join(__dirname, 'temp'))) {
        fs.mkdirSync(path.join(__dirname, 'temp'));
    }
    fs.mkdirSync(tempDir);

    const texPath = path.join(tempDir, 'resume.tex');
    const pdfPath = path.join(tempDir, 'resume.pdf');

    // Write .tex file
    fs.writeFileSync(texPath, texContent);

    // Compile
    // Use -interaction=nonstopmode to prevent hanging on errors
    const cmd = `pdflatex -interaction=nonstopmode -output-directory=${tempDir} ${texPath}`;

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error("LaTeX Compilation Failed:", stdout);
            // Cleanup on error
            try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) { }
            return res.status(500).json({ error: 'LaTeX compilation failed', logs: stdout });
        }

        // Send File
        if (fs.existsSync(pdfPath)) {
            res.sendFile(pdfPath, {}, (err) => {
                // Cleanup after send
                try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) { }
            });
        } else {
            try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (e) { }
            res.status(500).json({ error: 'PDF file was not created' });
        }
    });
});

// Catch-All Handler (Serve React App)
// Catch-All Handler (Serve React App)
// Fix for Express 5: '*' is no longer valid. Using Regex /.*/ to match all routes.
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    if (!process.env.GROQ_API_KEY) console.warn("WARNING: GROQ_API_KEY is missing.");
});
