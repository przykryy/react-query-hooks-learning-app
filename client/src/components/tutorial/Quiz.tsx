import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProgress } from '@/hooks/use-progress';

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;
}

interface QuizProps {
  title: string;
  questions: QuizQuestion[];
  tutorialId: string;
}

const Quiz: React.FC<QuizProps> = ({ title, questions, tutorialId }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();
  const { updateQuizProgress } = useProgress();

  const handleAnswerChange = (questionId: string, optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleSubmit = () => {
    // Check if all questions are answered
    if (Object.keys(answers).length !== questions.length) {
      toast({
        title: "Incomplete Quiz",
        description: "Please answer all questions before submitting.",
        variant: "destructive"
      });
      return;
    }

    // Calculate score
    let correctCount = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setIsSubmitted(true);

    // Update progress
    updateQuizProgress(tutorialId, finalScore, answers);

    toast({
      title: `Quiz Completed!`,
      description: `You scored ${finalScore}% on this quiz.`,
      variant: finalScore >= 70 ? "default" : "destructive"
    });
  };

  const resetQuiz = () => {
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };

  return (
    <Card className="mb-12 max-w-3xl">
      <CardHeader className="bg-sidebar px-5 py-3 border-b border-background flex flex-row items-center space-y-0">
        <HelpCircle className="h-5 w-5 text-primary mr-2" />
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="p-5">
        {questions.map((question, index) => (
          <div key={question.id} className="mb-6 last:mb-0">
            <h4 className="font-medium mb-3">{index + 1}. {question.question}</h4>
            <RadioGroup 
              value={answers[question.id]} 
              onValueChange={(value) => handleAnswerChange(question.id, value)}
              disabled={isSubmitted}
            >
              <div className="space-y-2">
                {question.options.map(option => (
                  <div key={option.id} className="flex items-center">
                    <RadioGroupItem 
                      id={`${question.id}-${option.id}`} 
                      value={option.id} 
                      className="mr-3"
                    />
                    <Label 
                      htmlFor={`${question.id}-${option.id}`} 
                      className={`cursor-pointer ${
                        isSubmitted && option.id === question.correctAnswer 
                          ? 'text-accent' 
                          : isSubmitted && answers[question.id] === option.id && option.id !== question.correctAnswer 
                            ? 'text-destructive' 
                            : ''
                      }`}
                    >
                      {option.text}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        ))}
      </CardContent>
      
      <CardFooter className="px-5 py-3 flex justify-between">
        {!isSubmitted ? (
          <Button 
            onClick={handleSubmit} 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Submit Answers
          </Button>
        ) : (
          <div className="w-full">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Your Score: </span>
              <span className={`font-bold ${score >= 70 ? 'text-accent' : 'text-destructive'}`}>{score}%</span>
            </div>
            <Button 
              onClick={resetQuiz} 
              variant="outline"
              className="w-full"
            >
              Try Again
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default Quiz;
