import Navbar from "./navbar";
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import CodeEditor from './CodeEditor';
import { useParams } from 'react-router-dom';

const socket = io('http://localhost:4000');

function CodeShare() {
  const [code, setCode] = useState('');
  const { id } = useParams();

  useEffect(() => {
    // const savedCode = localStorage.getItem('code');
    // if (savedCode) {
    //   setCode(savedCode);
    // }

    socket.emit('join-room', id);

    const handleCodeUpdate = (newCode) => {
      setCode(newCode);
    };

    socket.on('code-update', handleCodeUpdate);

    return () => {
      socket.emit('leave-room', id);
      socket.off('code-update', handleCodeUpdate);
    };
  }, [id]);

  const handleChange = (newCode) => {
    setCode(newCode);
    socket.emit('code-change', newCode, id);
    // localStorage.setItem('code', newCode);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center w-screen h-screen bg-black gap-4">
        <h1 className="text-white font-bold text-5xl">Code Share</h1>
        <CodeEditor code={code} onChange={handleChange} />
      </div>
    </>
  );
}

export default CodeShare;
