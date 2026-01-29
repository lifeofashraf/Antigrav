import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useRef } from 'react';
import { toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import EditorLayout from './components/Editor/EditorLayout';
import ResumeForm from './components/Editor/ResumeForm';
import PDFPreview from './components/Editor/PDFPreview';
import { initialResumeData } from './consts/initialData';
import ChatBot from './components/ui/ChatBot';
import Home from './components/Home';

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
      // Capture the preview element using html-to-image (supports oklch/Tailwind v4)
      const dataUrl = await toJpeg(previewRef.current, {
        quality: 0.95,
        backgroundColor: '#ffffff',
        pixelRatio: 2, // Higher resolution
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

      // Calculate img dimensions to fit width
      const imgProps = pdf.getImageProperties(dataUrl);
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(dataUrl, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add subsequent pages if content overflows
      while (heightLeft > 0) {
        position -= pdfHeight; // Move image up by one page height
        pdf.addPage();
        pdf.addImage(dataUrl, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

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

export default App;
