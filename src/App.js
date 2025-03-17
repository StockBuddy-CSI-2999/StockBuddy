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

// Landing Page Component
const LandingPage = ({ onStart }) => {
  return (
    <div className="landing-page">
      <div className="logo">$</div>
      <h1>StockBuddy</h1>
      <h2>Your Personal Investment Guide</h2>
      <p>
        Welcome to StockBuddy, your friendly guide to the world of investing. 
        Answer a few questions about your financial situation and goals, 
        and we'll recommend a personalized investment strategy just for you.
      </p>
      <div className="feature-cards">
        <div className="feature-card">
          <div className="feature-icon">🛡️</div>
          <h3>Simple to Understand</h3>
          <p>Complex financial concepts explained in plain language</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">👥</div>
          <h3>Personalized Advice</h3>
          <p>Custom recommendations based on your specific situation</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📈</div>
          <h3>Growth Strategies</h3>
          <p>Learn how to grow your wealth over time</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🏆</div>
          <h3>Expert Guidance</h3>
          <p>Backed by proven investment principles</p>
        </div>
      </div>
      <button
        onClick={onStart}
        className="start-button"
      >
        Start Your Journey
      </button>
    </div>
  );
};

// Question Components
const AgeQuestion = ({ answer, onChange, onNext }) => {
  return (
    <div className="question-card">
      <h2>What is your age?</h2>
      <p>Different age groups typically have different investment horizons and risk capacities.</p>
      <div className="options-grid">
        <label className={`radio-option ${answer === 'under25' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="age"
            value="under25"
            checked={answer === 'under25'}
            onChange={() => onChange('under25')}
          />
          <span className="option-text">Under 25</span>
        </label>
        <label className={`radio-option ${answer === '25-35' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="age"
            value="25-35"
            checked={answer === '25-35'}
            onChange={() => onChange('25-35')}
          />
          <span className="option-text">25-35</span>
        </label>
        <label className={`radio-option ${answer === '36-50' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="age"
            value="36-50"
            checked={answer === '36-50'}
            onChange={() => onChange('36-50')}
          />
          <span className="option-text">36-50</span>
        </label>
        <label className={`radio-option ${answer === '51+' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="age"
            value="51+"
            checked={answer === '51+'}
            onChange={() => onChange('51+')}
          />
          <span className="option-text">51+</span>
        </label>
      </div>
      <div className="navigation">
        <button
          onClick={onNext}
          disabled={!answer}
          className="next-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const GoalQuestion = ({ answer, onChange, onNext, onPrev }) => {
  return (
    <div className="question-card">
      <h2>What is your primary investment goal?</h2>
      <p>Your timeframe and objectives will help determine the most suitable investment strategy.</p>
      <div className="options-grid">
        <label className={`radio-option ${answer === 'short-term' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="goal"
            value="short-term"
            checked={answer === 'short-term'}
            onChange={() => onChange('short-term')}
          />
          <span className="option-text">Short-term savings (1-3 years, e.g., emergency fund, big purchase)</span>
        </label>
        <label className={`radio-option ${answer === 'medium-term' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="goal"
            value="medium-term"
            checked={answer === 'medium-term'}
            onChange={() => onChange('medium-term')}
          />
          <span className="option-text">Medium-term growth (3-10 years, e.g., buying a house, education)</span>
        </label>
        <label className={`radio-option ${answer === 'long-term' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="goal"
            value="long-term"
            checked={answer === 'long-term'}
            onChange={() => onChange('long-term')}
          />
          <span className="option-text">Long-term wealth accumulation (10+ years, e.g., retirement, financial independence)</span>
        </label>
      </div>
      <div className="navigation">
        <button
          onClick={onPrev}
          className="prev-button"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!answer}
          className="next-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};
