import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Groq } from 'groq-sdk';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
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

// PDF Generation Endpoint (LaTeX)
app.post('/api/generate-pdf', (req, res) => {
    const resumeData = req.body;
    // TODO: Implement proper LaTeX template injection here
    // For now, checks if system has pdflatex

    exec('pdflatex --version', (error, stdout, stderr) => {
        if (error) {
            console.error("LaTeX check failed:", error);
            return res.status(500).json({ error: 'LaTeX environment not found on server' });
        }
        res.json({ message: "LaTeX environment detected. PDF generation logic coming soon." });
    });
});

// Catch-All Handler (Serve React App)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    if (!process.env.GROQ_API_KEY) console.warn("WARNING: GROQ_API_KEY is missing.");
});
