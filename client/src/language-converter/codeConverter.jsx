import React, { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import Navbar from '../components/navbar';
import { codeConverter } from '../components/services/Api';

const CodeConverter = () => {
  const [sourceCode, setSourceCode] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('python');
  const [convertedCode, setConvertedCode] = useState('');

  const handleConvert = async () => {
    try {
      const res = await codeConverter(sourceCode, targetLanguage);
      setConvertedCode(res.trim()); // Remove leading/trailing whitespace
    } catch (error) {
      console.error('Error converting code:', error);
    }
  };

  return (
    <div className='w-screen'>
      <Navbar/>
      <div className="container mx-auto py-8">
        <div className="mb-4 rounded-md border border-gray-300">
          <h3 className="text-xl p-2 bg-gray-100 rounded-t-md">Source Code</h3>
          <MonacoEditor
            height="70vh"
            width="97.5vw"
            language="javascript"
            theme="vs-dark"
            value={sourceCode}
            options={{
              selectOnLineNumbers: true,
            }}
            onChange={(newValue) => setSourceCode(newValue)}
          />
        </div>
        <div className="mb-4 flex items-center">
          <label htmlFor="targetLanguage" className="mr-2">Select Target Language:</label>
          <select
            id="targetLanguage"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="py-1 px-2 border border-gray-300 rounded-md"
          >
            <option value="python">Python</option>
            <option value="c">C</option>
            <option value="java">Java</option>
            {/* Add more languages as needed */}
          </select>
          <button onClick={handleConvert} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
            Convert
          </button>
        </div>
        <div className="rounded-md border border-gray-300">
          <h3 className="text-xl p-2 bg-gray-100 rounded-t-md">Converted Code ({targetLanguage})</h3>
          <MonacoEditor
            height="70vh"
            width="97.5vw"
            language={targetLanguage}
            theme="vs-dark"
            value={convertedCode}
            options={{
              readOnly: true,
              selectOnLineNumbers: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeConverter;
