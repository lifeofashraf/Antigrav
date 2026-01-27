import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor" element={<Editor />} />
        </Routes>
      </div>
    </Router>
  );
}

// Temporary Placeholders
const Home = () => (
  <div className="p-10 flex flex-col items-center justify-center min-h-[50vh]">
    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
      Antigravity Resume
    </h1>
    <p className="mb-8 text-slate-600">Build your premium resume deterministically.</p>
    <a href="/editor" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
      Get Started
    </a>
  </div>
);

const Editor = () => (
  <div className="p-10">
    <h2 className="text-2xl font-bold mb-4">Resume Editor</h2>
    <p>Editor Component Coming Soon...</p>
  </div>
);

export default App;
