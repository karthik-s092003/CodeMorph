import React, { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import Navbar from '../components/navbar';
import { codeConverter } from '../components/services/Api';

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
    <div className='w-screen h-screen   backgroundimage'>
      <Navbar />
      <h1 className="text-white flex pt-5 justify-center font-bold text-5xl">Language Converter</h1>
      <div className="container mx-auto px-8 flex gap-3 mt-5">
        <div className="mb-4 rounded-md border border-gray-300">
          <h3 className="text-xl text-white p-2 bg-gray-800 rounded-t-md">Source Code</h3>
          <MonacoEditor
            height="70vh"
            width="80vh"
            language="javascript"
            theme="vs-dark"
            value={sourceCode}
            options={{
              selectOnLineNumbers: true,
            }}
            onChange={(newValue) => setSourceCode(newValue)}
          />
        </div>
        <div className="mb-4 flex flex-col justify-center items-center px-9">
          {loading && <div className=' w-20 h-20 m-5 loader1' />} {/* Loader */}
          <div className="mb-5">
            <label htmlFor="targetLanguage" className="font-bold text-white ">Select Target Language</label>
          </div>
          <div className="flex items-center">
          <select
  id="targetLanguage"
  value={targetLanguage}
  onChange={(e) => setTargetLanguage(e.target.value)}
  className="py-1 px-2 border border-gray-300 rounded-md mr-2 focus:outline-none focus:border-blue-500 font-bold "
>
  <option value="python">Python</option>
  <option value="c">C</option>
  <option value="java">Java</option>
  {/* Add more languages as needed */}
</select>
            <button
              onClick={handleConvert}
              className="px-4 py-2 bg-white text-black font-bold rounded-md hover:bg-black hover:text-white "
            >
              Convert
            </button>
          </div>
          {loading && <div className=' w-20 h-20 m-5 loader2' />} {/* Loader */}
        </div>
        <div className="mb-4 rounded-md border border-gray-300">
          <h3 className="text-xl text-white p-2 bg-gray-800 rounded-t-md">Converted Code ({targetLanguage})</h3>
          <MonacoEditor
            height="70vh"
            width="80vh"
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
