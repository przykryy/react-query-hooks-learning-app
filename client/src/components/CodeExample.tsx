import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeEditor from './CodeEditor';
import CodePreview from './CodePreview';
import { CodeExample as CodeExampleType } from '@/types';

interface CodeExampleProps {
  example: CodeExampleType;
}

const CodeExample: React.FC<CodeExampleProps> = ({ example }) => {
  const [activeTabId, setActiveTabId] = useState(example.defaultTabId);
  const [modifiedCode, setModifiedCode] = useState<Record<string, string>>(
    example.tabs.reduce((acc, tab) => ({ ...acc, [tab.id]: tab.code }), {})
  );
  
  const handleCodeChange = (tabId: string, newCode: string) => {
    setModifiedCode(prev => ({
      ...prev,
      [tabId]: newCode
    }));
  };

  return (
    <div className="mb-8 bg-card rounded-lg overflow-hidden border border-border shadow-lg">
      <Tabs defaultValue={example.defaultTabId} onValueChange={setActiveTabId}>
        <div className="flex items-center border-b border-border bg-[#1A1C21]">
          <TabsList className="bg-transparent h-auto p-0">
            {example.tabs.map(tab => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={`px-4 py-2 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary`}
              >
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 max-h-[400px] overflow-auto">
            {example.tabs.map(tab => (
              <TabsContent key={tab.id} value={tab.id} className="m-0 p-0">
                <CodeEditor 
                  code={modifiedCode[tab.id]} 
                  onChange={(code) => handleCodeChange(tab.id, code)}
                />
              </TabsContent>
            ))}
          </div>
          
          <div className="w-full md:w-1/2 border-t md:border-t-0 md:border-l border-border p-4 flex flex-col max-h-[400px]">
            <CodePreview code={modifiedCode[activeTabId]} />
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default CodeExample;
