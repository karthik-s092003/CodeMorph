import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/home'; 
import CodeShare from './components/CodeShare';
import CodeConverter from './language-converter/codeConverter';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/code-share/:id" element={<CodeShare/>} />
        <Route path="/lang-converter" element={<CodeConverter/>}/>
      </Routes>
    </Router>
  );
}

export default App;
