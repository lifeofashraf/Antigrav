import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import EditorLayout from './components/Editor/EditorLayout';
import ResumeForm from './components/Editor/ResumeForm';
import PDFPreview from './components/Editor/PDFPreview';
import { initialResumeData } from './consts/initialData';
import ChatBot from './components/ui/ChatBot';
import Home from './components/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="/editor" element={<EditorPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return currentUser ? children : <Navigate to="/login" />;
};

const EditorPage = () => {
  const [resumeData, setResumeData] = useState(initialResumeData);
  const [resumeId, setResumeId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const previewRef = useRef(null);
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();

  // Load existing resume if ID is in URL
  useEffect(() => {
    const loadResume = async () => {
      const id = searchParams.get('id');
      if (!id) return;

      setIsLoading(true);
      try {
        const { getResume } = await import('./services/resumeService');
        const resume = await getResume(id);
        if (resume) {
          setResumeData(resume);
          setResumeId(id);
        }
      } catch (error) {
        console.error('Failed to load resume:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadResume();
  }, [searchParams]);

  const handleSave = async () => {
    if (!currentUser) {
      alert('Please sign in to save your resume');
      return;
    }

    try {
      const { saveResume } = await import('./services/resumeService');
      const savedId = await saveResume(currentUser.uid, resumeData, resumeId);
      setResumeId(savedId);
      alert('Resume saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      alert(`Save failed: ${error.message}`);
    }
  };

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
        onSave={handleSave}
        previewRef={previewRef}
      >
        <ResumeForm onUpdate={setResumeData} />
      </EditorLayout>
      <ChatBot resumeData={resumeData} />
    </>
  );
};

export default App;
