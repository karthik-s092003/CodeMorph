import React, { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';

const CodeEditor = ({ code, readOnly, onChange }) => {
  const [localCode, setLocalCode] = useState(code);

  useEffect(() => {
    setLocalCode(code); // Sync localCode with code prop on update
  }, [code]);

  const handleEditorChange = (value, event) => {
    setLocalCode(value);
    onChange(value); // Propagate change to parent component
  };

  return (
    <MonacoEditor
      height="85vh"
      width="90vw"
      language="javascript"
      theme="vs-dark"
      value={localCode}
      options={{ readOnly }}
      onChange={handleEditorChange}
    />
  );
};

export default CodeEditor;
