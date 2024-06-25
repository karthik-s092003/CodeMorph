import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import CodeEditor from './CodeEditor';
import { useParams } from 'react-router-dom';
import Navbar from './navbar'; // Assuming Navbar is imported correctly
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:4000');

function CodeShare() {
  const { id } = useParams();
  const [code, setCode] = useState('');

  // useEffect for socket.io setup
  useEffect(() => {
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

  // Function to handle input change for connecting code
  const connectCode = (event) => {
    const inputCode = event.target.value;
    setCode(inputCode); // Update the state with the input field's value
    console.log(inputCode); // You can log the input value if needed
  };

  // Function to handle code changes in CodeEditor and emit to socket
  const handleChange = (newCode) => {
    setCode(newCode);
    socket.emit('code-change', newCode, id);
    // localStorage.setItem('code', newCode); // Uncomment if needed
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center w-screen h-screen pt-9 bg-black gap-4">
        <h1 className="text-white font-bold text-5xl">Code Share</h1>
        <div className="flex justify-between gap-10 w-[90vw] text-white font-bold">
          <div className="flex gap-5 justify-center items-center">
            <h1>ROOM ID: {id}</h1>
            <button className="bg-white text-black px-2 py-1 rounded">COPY</button>
          </div>
          <div className="flex gap-5 justify-center items-center">
            <input type="text" placeholder="enter code to connect "  onChange={connectCode} className="p-1 text-black " />
            <button className="bg-white text-black px-2 py-1 rounded">CONNECT</button>
          </div>
        </div>
        <CodeEditor code={code} onChange={handleChange} />
      </div>
    </>
  );
}

export default CodeShare;
