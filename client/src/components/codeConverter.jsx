import React, { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import Navbar from './navbar';
import { codeConverter } from './services/Api';

const CodeConverter = () => {
  const [sourceCode, setSourceCode] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('python');
  const [convertedCode, setConvertedCode] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  const handleConvert = async () => {
    setLoading(true); // Start loading
    try {
      const res = await codeConverter(sourceCode, targetLanguage);
      setConvertedCode(res.trim()); // Remove leading/trailing whitespace
    } catch (error) {
      console.error('Error converting code:', error);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className='w-screen h-screen backgroundimage'>
      <Navbar />
      <h1 className="text-white text-center py-6 font-bold text-3xl md:text-4xl lg:text-5xl">Language Converter</h1>
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 flex flex-col gap-6 md:flex-row md:gap-8">
        {/* Source Code Editor */}
        <div className="flex-1 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <h3 className="text-lg md:text-xl text-white p-3 bg-gray-800 border-b border-gray-700">Source Code</h3>
          <MonacoEditor
            height="60vh"
            language="javascript"
            theme="vs-dark"
            value={sourceCode}
            options={{
              selectOnLineNumbers: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false
            }}
            onChange={(newValue) => setSourceCode(newValue)}
          />
        </div>
        
        {/* Conversion Controls */}
        <div className="  flex flex-col justify-center items-center px-6 py-10 bg-gray-100 rounded-lg shadow-md">
  <div className="flex flex-col items-center">
    {loading && (
      <div className="w-12 h-12  loader1 mb-4" />
    )} {/* Loader */}
    <label htmlFor="targetLanguage" className="text-xl font-medium text-black mb-3">
      Select Target Language
    </label>
    <select
      id="targetLanguage"
      value={targetLanguage}
      onChange={(e) => setTargetLanguage(e.target.value)}
      className="py-2 px-3 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
    >
      <option value="python">Python</option>
      <option value="c">C</option>
      <option value="java">Java</option>
      {/* Add more languages as needed */}
    </select>
    <button
      onClick={handleConvert}
      className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
    >
      Convert
    </button>
  </div>
  {loading && (
    <div className="w-12 h-12   loader2 mt-4" />
  )} {/* Loader */}
</div>
        {/* Converted Code Editor */}
        <div className="flex-1 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <h3 className="text-lg md:text-xl text-white p-3 bg-gray-800 border-b border-gray-700">Converted Code ({targetLanguage})</h3>
          <MonacoEditor
            height="60vh"
            language={targetLanguage}
            theme="vs-dark"
            value={convertedCode}
            options={{
              readOnly: true,
              selectOnLineNumbers: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeConverter;
