import React, { useState } from 'react';
import CodeEditor from '@/components/ui/code-editor';

interface CodeExampleProps {
  title: string;
  initialCode: string;
  explanation: React.ReactNode;
  analysis?: React.ReactNode;
  challenge?: React.ReactNode;
}

const CodeExample: React.FC<CodeExampleProps> = ({
  title,
  initialCode,
  explanation,
  analysis,
  challenge,
}) => {
  const [code, setCode] = useState(initialCode);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  return (
    <CodeEditor
      title={title}
      initialCode={code}
      onCodeChange={handleCodeChange}
      preview={code}
      explanation={explanation}
      analysis={analysis}
      challenge={challenge}
    />
  );
};

export default CodeExample;
