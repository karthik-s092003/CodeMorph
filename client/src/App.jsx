import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/home'; 
import CodeShare from './components/CodeShare';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/code-share/:id" element={<CodeShare/>} />
      </Routes>
    </Router>
  );
}

export default App;
