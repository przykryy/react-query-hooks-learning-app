import React, { useState, useEffect } from 'react';
import { RefreshCw, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import useCodeExecution from '@/lib/hooks/useCodeExecution';

interface CodePreviewProps {
  code: string;
}

const CodePreview: React.FC<CodePreviewProps> = ({ code }) => {
  const { result, execute, isLoading } = useCodeExecution();
  
  useEffect(() => {
    execute(code);
  }, [code, execute]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="text-xs text-muted-foreground mb-2 flex justify-between items-center">
        <span>PREVIEW</span>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={() => execute(code)}
            title="Refresh Preview"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                title="Open in Full Screen"
              >
                <Maximize className="h-3.5 w-3.5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl h-[80vh]">
              <div className="flex-1 bg-background rounded overflow-auto p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-primary animate-pulse">Loading preview...</div>
                  </div>
                ) : (
                  <div className="preview-content" dangerouslySetInnerHTML={{ __html: result || '' }} />
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="flex-1 bg-background rounded overflow-auto flex items-center justify-center p-4">
        {isLoading ? (
          <div className="text-primary animate-pulse">Loading preview...</div>
        ) : (
          <div className="preview-content" dangerouslySetInnerHTML={{ __html: result || '' }} />
        )}
      </div>
    </div>
  );
};

export default CodePreview;
