import React, { useState } from 'react';
import CodeEditor from '@/components/ui/code-editor';
import { useCodeExecution } from '@/hooks/use-code-execution';

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
  const { executeCode, result } = useCodeExecution();

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleRunCode = (codeToRun: string) => {
    executeCode(codeToRun);
  };

  return (
    <CodeEditor
      title={title}
      initialCode={code}
      onCodeChange={handleCodeChange}
      onRun={handleRunCode}
      preview={result}
      explanation={explanation}
      analysis={analysis}
      challenge={challenge}
    />
  );
};

export default CodeExample;
