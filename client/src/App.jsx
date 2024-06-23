import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import CodeEditor from './CodeEditor';

const socket = io('http://localhost:4000');

function App() {
  const [code, setCode] = useState('');

  useEffect(() => {
    // Retrieve code from localStorage on component mount
    const savedCode = localStorage.getItem('code');
    if (savedCode) {
      setCode(savedCode);
    }

    // Handle incoming code updates from server
    socket.on('code-update', (newCode) => {
      setCode(newCode);
    });

    // Clean up event listener on component unmount
    return () => {
      socket.off('code-update');
    };
  }, []);

  // Handle local code changes and emit to server
  const handleChange = (newCode) => {
    setCode(newCode); // Update local state
    socket.emit('code-change', newCode); // Emit to server
    localStorage.setItem('code', newCode); // Save code to localStorage
  };

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen bg-black gap-4">
      <h1 className="text-white font-bold text-5xl">Code Share</h1>
      <CodeEditor code={code} onChange={handleChange} />
    </div>
  );
}

export default App;
