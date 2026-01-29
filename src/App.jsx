import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
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
  const previewRef = useRef(null);

  const handleExportPDF = async () => {
    if (!previewRef.current) {
      alert('Preview not ready');
      return;
    }

    try {
      // Capture the preview element at high resolution
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Calculate scaling to fit A4
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // Add image to PDF
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, Math.min(imgHeight, pdfHeight));

      // Download
      const fileName = `${resumeData.basics?.name?.replace(/[^a-z0-9]/gi, '_') || 'resume'}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Export failed: ${error.message}`);
    }
  };

  return (
    <>
      <EditorLayout
        preview={<PDFPreview data={resumeData} />}
        onExportPDF={handleExportPDF}
        previewRef={previewRef}
      >
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
