import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flag, Check } from 'lucide-react';

interface LearningObjectivesProps {
  objectives: string[];
}

const LearningObjectives: React.FC<LearningObjectivesProps> = ({ objectives }) => {
  return (
    <Card className="bg-muted rounded-lg p-5 mb-8 max-w-3xl">
      <CardHeader className="p-0 pb-3 space-y-0">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Flag className="text-primary h-5 w-5 mr-2" />
          Learning Objectives
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="space-y-2 pl-6">
          {objectives.map((objective, index) => (
            <li key={index} className="flex items-start">
              <Check className="text-accent h-4 w-4 mt-0.5 mr-2 shrink-0" />
              <span>{objective}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default LearningObjectives;
