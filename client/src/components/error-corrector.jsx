import React, { useState } from 'react';
import Navbar from './navbar';
import { Comment } from 'react-loader-spinner';

import { errorCorrector } from './services/Api';

const ErrorCorrector = () => {
  const [sourceCode, setSourceCode] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    setLoading(true);
    try {
      const res = await errorCorrector(sourceCode);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { userCode: sourceCode, correctedCode: res },
      ]);
      setSourceCode('');
    } catch (error) {
      console.error('Error converting code:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen overflow-auto backgroundimage flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex-grow flex flex-col items-center p-6">
        <div className="w-full max-w-4xl min-h-[85vh] max-h-[85vh] bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col">
          <h1 className="text-3xl font-bold mb-6 text-white">Code Error Corrector</h1>
          <div className="flex-grow flex flex-col space-y-4 overflow-y-auto p-4 bg-gray-50 rounded-lg shadow-lg">
            <div className="flex-grow flex flex-col space-y-4">
              {chatHistory.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-600 text-center p-9">
                    Welcome to the platform that helps you fix your code quickly and easily. Just upload your code, and CodeFixer will provide instant corrections and suggestions to improve it. Debugging has never been easier!
                  </p>
                </div>
              ) : (
                chatHistory.map((entry, index) => (
                  <div key={index}>
                    <div className="flex justify-end">
                      <div className="bg-blue-100 p-4 rounded-lg max-w-lg break-words mb-4 shadow-md">
                        <h2 className="text-sm font-semibold mb-2 text-gray-600">Your Code:</h2>
                        <pre className="whitespace-pre-wrap text-gray-800">{entry.userCode}</pre>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-green-100 p-4 rounded-lg max-w-lg break-words mb-4 shadow-md">
                        <h2 className="text-sm font-semibold mb-2 text-gray-600">Corrected Code:</h2>
                        <pre className="whitespace-pre-wrap text-gray-800">{entry.correctedCode}</pre>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-end">
                  <div className="bg-blue-100 p-4 rounded-lg max-w-lg break-words mb-4 shadow-md">
                    <h2 className="text-sm font-semibold mb-2 text-gray-600">Your Code (Pending):</h2>
                    <pre className="whitespace-pre-wrap text-gray-800">{sourceCode}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-2 p-4 bg-gray-200 rounded-lg w-full mt-4 shadow-lg">
            <div className="flex items-center space-x-4">
              <textarea
                className="flex-grow p-3 border border-gray-300 rounded-lg resize-none h-20 shadow-sm"
                placeholder="Paste your code here..."
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
              />
              <button
                className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition"
                onClick={handleConvert}
                disabled={loading}
              >
                {loading ? (
                  <Comment
                    visible={true}
                    height="50"
                    width="90"
                    ariaLabel="comment-loading"
                    wrapperStyle={{}}
                    wrapperClass="comment-wrapper"
                    color="#fff"
                    backgroundColor="blue"
                  />
                ) : (
                  'Correct Code'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorCorrector;
