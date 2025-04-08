import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { LiveProvider, LivePreview, LiveEditor, LiveError } from 'react-live';
import * as ReactQuery from '@tanstack/react-query';

interface CodeEditorProps {
  title: string;
  initialCode: string;
  language?: string;
  readOnly?: boolean;
  height?: string;
  onCodeChange?: (code: string) => void;
  onRun?: (code: string) => void;
  preview?: string;
  explanation?: React.ReactNode;
  analysis?: React.ReactNode;
  challenge?: React.ReactNode;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  title,
  initialCode,
  language = 'jsx',
  readOnly = false,
  height = '400px',
  onCodeChange,
  onRun,
  preview,
  explanation,
  analysis,
  challenge,
}) => {
  const [code, setCode] = useState(initialCode);
  const [activeTab, setActiveTab] = useState('explanation');
  const editorRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (editorRef.current) {
      // Auto-adjust height of textarea
      editorRef.current.style.height = 'auto';
      editorRef.current.style.height = `${editorRef.current.scrollHeight}px`;
    }
  }, [code]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    console.log('new change');
    onCodeChange?.(newCode);
  };

  const handleReset = () => {
    setCode(initialCode);
    onCodeChange?.(initialCode);
  };

  const handleRun = () => {
    onRun?.(code);
  };

  return (
    <Card className="border border-muted rounded-lg overflow-hidden mb-8">
      <CardHeader className="bg-muted px-4 py-3 flex-row justify-between items-center space-y-0">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-sm px-3 py-1 rounded hover:bg-background transition-colors"
          >
            Reset
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleRun}
            className="text-sm px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-opacity-80 transition-colors"
          >
            Run
          </Button>
        </div>
      </CardHeader>
      <LiveProvider code={code} scope={{ ReactQuery }} noInline >
      <style>
          {`
            pre {
              counter-reset: token-line;
            }
            .token-line::before {
              counter-increment: token-line;
              content: counter(token-line);
              padding-right: 10px;
              color: #888; /* Optional: Adjust the color for line numbers */
            }
          `}
        </style>
        <div className="flex flex-col md:flex-row">
          {/* Code editor panel */}
          <div className="w-full md:w-1/2 bg-sidebar border-r border-muted">
            <div
              className="p-4 code-editor font-code text-sm overflow-auto"
              style={{ maxHeight: height }}
            >
              <LiveEditor
                code={code}
                language={language}
                className={cn(
                  "w-full bg-transparent font-mono text-sm p-0 border-0 outline-none resize-none",
                  "whitespace-pre font-code tab-size-2"
                )}
                style={{
                  minHeight: height,
                  color: 'inherit',
                  counterIncrement: 'token-line',
                  content: 'conter(token-line)',
                }}
              />
            </div>
          </div>

          <div
            className="w-full md:w-1/2 p-6 bg-background flex items-center justify-center"
            style={{ minHeight: '300px' }}
          >
            <LivePreview />
            <LiveError />
          </div>
        </div>
      </LiveProvider>

      {(explanation || analysis || challenge) && (
        <div className="bg-muted border-t border-background">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex border-b border-background">
              <TabsList className="bg-transparent h-auto p-0">
                {explanation && (
                  <TabsTrigger
                    value="explanation"
                    className={`px-4 py-2 rounded-none hover:bg-sidebar transition-colors border-r border-background ${activeTab === 'explanation' ? 'bg-sidebar text-primary' : ''}`}
                  >
                    Explanation
                  </TabsTrigger>
                )}
                {analysis && (
                  <TabsTrigger
                    value="analysis"
                    className={`px-4 py-2 rounded-none hover:bg-sidebar transition-colors border-r border-background ${activeTab === 'analysis' ? 'bg-sidebar text-primary' : ''}`}
                  >
                    Code Analysis
                  </TabsTrigger>
                )}
                {challenge && (
                  <TabsTrigger
                    value="challenge"
                    className={`px-4 py-2 rounded-none hover:bg-sidebar transition-colors ${activeTab === 'challenge' ? 'bg-sidebar text-primary' : ''}`}
                  >
                    Challenge
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

            <CardContent className="p-4 text-sm" style={{ maxHeight: '150px', overflowY: 'auto' }}>
              {explanation && (
                <TabsContent value="explanation" className="m-0 p-0">
                  {explanation}
                </TabsContent>
              )}
              {analysis && (
                <TabsContent value="analysis" className="m-0 p-0">
                  {analysis}
                </TabsContent>
              )}
              {challenge && (
                <TabsContent value="challenge" className="m-0 p-0">
                  {challenge}
                </TabsContent>
              )}
            </CardContent>
          </Tabs>
        </div>
      )}
    </Card>
  );
};



export default CodeEditor;
