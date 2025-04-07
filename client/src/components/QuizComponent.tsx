import React, { useState } from 'react';
import { Quiz, QuizQuestion } from '@/types';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface QuizComponentProps {
  quiz: Quiz;
  moduleId: string;
  onComplete?: (score: number) => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ quiz, moduleId, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  
  const handleAnswerSelect = (optionIndex: number) => {
    if (isSubmitted) return;
    
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswers[currentQuestionIndex] === undefined) {
      toast({
        title: "Select an answer",
        description: "Please select an answer before submitting",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitted(true);
    
    // Update score if answer is correct
    if (selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswerIndex) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsSubmitted(false);
    } else {
      // Quiz is completed
      const finalScore = score + (selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswerIndex ? 1 : 0);
      setIsCompleted(true);
      
      // Save progress to API (this would typically use the user's ID)
      if (onComplete) {
        onComplete(finalScore);
      }
      
      // In a real app with auth, we would save progress:
      /*
      apiRequest('POST', '/api/progress', {
        userId: 1, // This would come from auth
        moduleId,
        completed: true,
        quizScore: finalScore,
      });
      */
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setIsSubmitted(false);
    setIsCompleted(false);
    setScore(0);
  };

  if (isCompleted) {
    const percentage = Math.round((score / totalQuestions) * 100);
    return (
      <div className="bg-card rounded-lg overflow-hidden border border-border">
        <div className="bg-[#1A1C21] p-4 border-b border-border">
          <h3 className="text-lg font-medium text-foreground">Quiz Completed</h3>
        </div>
        
        <div className="p-6 flex flex-col items-center">
          <div className="text-6xl font-bold mb-4 text-primary">{score}/{totalQuestions}</div>
          <p className="text-foreground text-xl mb-6">You scored {percentage}%</p>
          
          {percentage >= 70 ? (
            <div className="bg-accent/10 text-accent p-4 rounded-lg mb-6 flex items-start">
              <Check className="h-5 w-5 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">Great job!</p>
                <p className="text-sm mt-1">You've mastered this topic. You can move on to the next module.</p>
              </div>
            </div>
          ) : (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">Keep practicing</p>
                <p className="text-sm mt-1">Review the material and try again to improve your understanding.</p>
              </div>
            </div>
          )}
          
          <div className="flex gap-4">
            <Button variant="outline" onClick={resetQuiz}>
              Retry Quiz
            </Button>
            <Button>
              Next Module
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border">
      <div className="bg-[#1A1C21] p-4 border-b border-border">
        <h3 className="text-lg font-medium text-foreground">{quiz.title}</h3>
        <p className="text-muted-foreground text-sm mt-1">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
      </div>
      
      <div className="p-4">
        <div className="mb-6">
          <p className="font-medium text-foreground mb-4">{currentQuestion.question}</p>
          
          <RadioGroup 
            value={selectedAnswers[currentQuestionIndex]?.toString()} 
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
            className="space-y-3"
          >
            {currentQuestion.options.map((option, index) => (
              <div 
                key={index} 
                className={`flex items-start p-3 rounded-md ${
                  isSubmitted && index === currentQuestion.correctAnswerIndex
                    ? 'bg-accent/10'
                    : isSubmitted && index === selectedAnswers[currentQuestionIndex] && index !== currentQuestion.correctAnswerIndex
                      ? 'bg-destructive/10'
                      : 'hover:bg-muted'
                }`}
              >
                <RadioGroupItem 
                  value={index.toString()} 
                  id={`option-${index}`} 
                  disabled={isSubmitted}
                  className="mt-1 mr-3"
                />
                <Label 
                  htmlFor={`option-${index}`} 
                  className={`text-foreground ${
                    isSubmitted && index === currentQuestion.correctAnswerIndex
                      ? 'text-accent font-medium'
                      : isSubmitted && index === selectedAnswers[currentQuestionIndex] && index !== currentQuestion.correctAnswerIndex
                        ? 'text-destructive font-medium'
                        : ''
                  }`}
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          {isSubmitted && (
            <div className={`mt-4 p-3 rounded-md ${
              selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswerIndex
                ? 'bg-accent/10 text-accent'
                : 'bg-destructive/10 text-destructive'
            }`}>
              <p className="font-medium">
                {selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswerIndex
                  ? 'Correct!'
                  : 'Incorrect'}
              </p>
              <p className="text-sm mt-1">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          {!isSubmitted ? (
            <Button onClick={handleSubmitAnswer}>
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Complete Quiz'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;
