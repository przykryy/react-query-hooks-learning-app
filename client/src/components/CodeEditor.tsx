import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Code, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeEditorProps {
  code: string;
  onChange?: (code: string) => void;
  readOnly?: boolean;
  onRun?: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  code: initialCode, 
  onChange, 
  readOnly = false,
  onRun 
}) => {
  const [code, setCode] = useState(initialCode);
  const lines = code.split('\n');
  const { toast } = useToast();

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    if (onChange) {
      onChange(newCode);
    }
  };

  const handleRun = () => {
    if (onRun) {
      onRun(code);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    if (onChange) {
      onChange(initialCode);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied",
      description: "Code has been copied to clipboard",
      duration: 2000,
    });
  };

  // Generate line numbers
  const lineNumbers = Array.from({ length: lines.length }, (_, i) => i + 1);

  return (
    <div className="w-full code-editor code-font p-0 text-sm overflow-auto">
      <div className="relative">
        <div className="absolute top-0 left-0 w-[40px] pt-4 pb-2 pl-4 pr-0 line-number">
          {lineNumbers.map((num) => (
            <div key={num}>{num}</div>
          ))}
        </div>
        <textarea
          className={`w-full bg-transparent text-foreground font-code resize-none pl-[50px] pr-4 pt-4 pb-2 outline-none ${
            readOnly ? 'cursor-default' : ''
          }`}
          value={code}
          onChange={handleCodeChange}
          readOnly={readOnly}
          rows={lines.length + 1}
          spellCheck={false}
          style={{ 
            lineHeight: '1.5', 
            caretColor: '#61DAFB',
            fontFamily: 'JetBrains Mono, monospace'
          }}
        />
      </div>
      
      {!readOnly && (
        <div className="bg-[#1A1C21] border-t border-border p-2 flex justify-between items-center">
          <div className="flex space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRun}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              <Play className="h-4 w-4 mr-1" /> Run
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleReset}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4 mr-1" /> Reset
            </Button>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              <Code className="h-4 w-4 mr-1" /> Format
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCopy}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              <Copy className="h-4 w-4 mr-1" /> Copy
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
