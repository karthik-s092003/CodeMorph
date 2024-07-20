import React, { useState } from 'react';
import Navbar from '../components/navbar';
import { errorCorrector } from '../components/services/Api';

const ErrorCorrector = () => {
  const [sourceCode, setSourceCode] = useState('');
  const [correctedCode, setCorrectedCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    setLoading(true);
    try {
      const res = await errorCorrector(sourceCode);
      setCorrectedCode(res);
    } catch (error) {
      console.error('Error converting code:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen backgroundimage flex flex-col">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-full p-4 overflow-auto">
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 flex flex-col space-y-4 h-full overflow-auto">
          <h1 className="text-2xl font-bold mb-4">Code Error Corrector</h1>
          <div className="flex flex-col space-y-4 h-full overflow-auto">
            <div className="flex space-x-2">
              <textarea
                className="w-full p-4 border rounded-lg resize-none overflow-auto h-40"
                placeholder="Paste your code here..."
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
              />
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={handleConvert}
                disabled={loading}
              >
                {loading ? 'Correcting...' : 'Correct Code'}
              </button>
            </div>
            {sourceCode && (
              <div className="bg-gray-100 p-4 rounded-lg self-end w-full max-w-lg overflow-auto">
                <h2 className="text-sm font-semibold mb-2">Your Code:</h2>
                <pre className="whitespace-pre-wrap">{sourceCode}</pre>
              </div>
            )}
            {correctedCode && (
              <div className="bg-gray-100 p-4 rounded-lg self-start w-full max-w-lg overflow-auto">
                <h2 className="text-sm font-semibold mb-2">Corrected Code:</h2>
                <pre className="whitespace-pre-wrap">{correctedCode}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorCorrector;
