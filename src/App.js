// App.js
import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    age: '',
    goal: '',
    savings: '',
    riskTolerance: '',
    marketReaction: '',
    involvement: '',
    options: []
  });
  const [result, setResult] = useState(null);

  const handleAnswerChange = (question, answer) => {
    const newAnswers = { ...answers, [question]: answer };
    setAnswers(newAnswers);
  };

  const handleOptionsChange = (option) => {
    const currentOptions = [...answers.options];
    const optionIndex = currentOptions.indexOf(option);
    
    if (optionIndex === -1) {
      currentOptions.push(option);
    } else {
      currentOptions.splice(optionIndex, 1);
    }
    
    setAnswers({ ...answers, options: currentOptions });
  };

  const handleSubmit = () => {
    const profile = calculateInvestorProfile(answers);
    setResult(profile);
    setStep(7); // Move to results page
  };

  const goToNext = () => {
    setStep(step + 1);
  };

  const goToPrevious = () => {
    setStep(step - 1);
  };

  const resetQuiz = () => {
    setAnswers({
      age: '',
      goal: '',
      savings: '',
      riskTolerance: '',
      marketReaction: '',
      involvement: '',
      options: []
    });
    setResult(null);
    setStep(0);
  };

  // Render the appropriate component based on current step
  const renderStep = () => {
    switch (step) {
      case 0:
        return <LandingPage onStart={() => goToNext()} />;
      case 1:
        return (
          <AgeQuestion 
            answer={answers.age} 
            onChange={(value) => handleAnswerChange('age', value)} 
            onNext={goToNext}
          />
        );
      case 2:
        return (
          <GoalQuestion 
            answer={answers.goal} 
            onChange={(value) => handleAnswerChange('goal', value)} 
            onNext={goToNext}
            onPrev={goToPrevious}
          />
        );
      case 3:
        return (
          <SavingsQuestion 
            answer={answers.savings} 
            onChange={(value) => handleAnswerChange('savings', value)} 
            onNext={goToNext}
            onPrev={goToPrevious}
          />
        );
      case 4:
        return (
          <RiskQuestion 
            answer={answers.riskTolerance} 
            onChange={(value) => handleAnswerChange('riskTolerance', value)} 
            onNext={goToNext}
            onPrev={goToPrevious}
          />
        );
      case 5:
        return (
          <MarketReactionQuestion 
            answer={answers.marketReaction} 
            onChange={(value) => handleAnswerChange('marketReaction', value)} 
            onNext={goToNext}
            onPrev={goToPrevious}
          />
        );
      case 6:
        return (
          <InvolvementQuestion 
            answer={answers.involvement} 
            options={answers.options}
            onAnswerChange={(value) => handleAnswerChange('involvement', value)}
            onOptionsChange={handleOptionsChange}
            onSubmit={handleSubmit}
            onPrev={goToPrevious}
          />
        );
      case 7:
        return <ResultsPage profile={result} onReset={resetQuiz} />;
      default:
        return <LandingPage onStart={() => goToNext()} />;
    }
  };

  return (
    <div className="app-container">
      <div className="container">
        {step > 0 && step < 7 && (
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress" 
                style={{ width: `${(step / 6) * 100}%` }} 
              />
            </div>
            <div className="progress-text">
              Question {step} of 6
            </div>
          </div>
        )}
        {renderStep()}
      </div>
    </div>
  );
};
