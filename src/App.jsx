import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import EditorLayout from './components/Editor/EditorLayout';
import ResumeForm from './components/Editor/ResumeForm';
import PDFPreview from './components/Editor/PDFPreview';
import { initialResumeData } from './consts/initialData';
import ChatBot from './components/ui/ChatBot';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor" element={<EditorPage />} />
        </Routes>
      </div>
    </Router>
  );
}

const EditorPage = () => {
  const [resumeData, setResumeData] = useState(initialResumeData);

  const handleExportPDF = async () => {
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resumeData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate PDF');
      }

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeData.basics?.name || 'resume'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Export failed: ${error.message}`);
    }
  };

  return (
    <>
      <EditorLayout preview={<PDFPreview data={resumeData} />} onExportPDF={handleExportPDF}>
        <ResumeForm onUpdate={setResumeData} />
      </EditorLayout>
      <ChatBot resumeData={resumeData} />
    </>
  );
};

const Home = () => (
  <div className="p-10 flex flex-col items-center justify-center min-h-[80vh] text-center">
    <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent mb-6">
      Antigravity Resume
    </h1>
    <p className="mb-8 text-xl text-slate-600 max-w-2xl">
      Build a premium, deterministic resume utilizing LaTeX reliability and AI-enhanced content optimization.
    </p>
    <a href="/editor" className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30">
      Launch Editor
    </a>
  </div>
);

export default App;
