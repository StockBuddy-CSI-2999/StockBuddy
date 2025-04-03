// App.js
import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [step, setStep] = useState(0);
  const [page, setPage] = useState(0); // Educational content page tracker
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
  const [activeTab, setActiveTab] = useState('questionnaire'); // For navigation between features
  
  // New states for additional features
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [investmentYears, setInvestmentYears] = useState(10);
  const [investmentRate, setInvestmentRate] = useState(7);
  const [calculatedAmount, setCalculatedAmount] = useState(null);
  
  // For community forum
  const [forumPosts, setForumPosts] = useState([
    {
      id: 1,
      author: 'InvestorJane',
      title: 'Best ETFs for beginners?',
      content: 'I\'m new to investing and looking for recommendations on good ETFs for someone just starting out. Any suggestions?',
      replies: [
        { author: 'FinanceGuru', content: 'I\'d recommend looking at broad market ETFs like VTI or SPY to start with. They give you exposure to the entire market with low fees.' },
        { author: 'RetirementPlanner', content: 'Don\'t forget about bond ETFs like AGG to balance your portfolio if you\'re concerned about volatility.' }
      ],
      timestamp: '2 days ago'
    },
    {
      id: 2,
      author: 'NewSaver',
      title: 'How much should I be saving each month?',
      content: 'I\'m 25 and just started my first job. How much of my income should I be putting away for investments?',
      replies: [
        { author: 'WealthBuilder', content: 'Try to save at least 15-20% of your income. Start with your employer 401k match if available, then max out a Roth IRA, and then consider additional investments.' },
      ],
      timestamp: '5 days ago'
    },
    {
      id: 3,
      author: 'RetirementDreamer',
      title: 'Is real estate a good investment?',
      content: 'I\'m considering buying a rental property as an investment. Does anyone have experience with this versus stock market investing?',
      replies: [
        { author: 'PropertyPro', content: 'Real estate can be a great addition to your portfolio, but it\'s more work than passive investing. Be prepared for maintenance costs and potential vacancies.' },
        { author: 'DiversifiedInvestor', content: 'You might want to look into REITs first. They give you exposure to real estate without the hassle of being a landlord.' }
      ],
      timestamp: '1 week ago'
    }
  ]);
  
  // For user profile
  const [userProfile, setUserProfile] = useState({
    name: 'Guest User',
    email: 'guest@example.com',
    investmentGoals: [],
    savedArticles: [],
    portfolioValue: 0
  });

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
  
  const calculateInvestment = () => {
    // Simple compound interest calculation
    const amount = investmentAmount * Math.pow(1 + (investmentRate / 100), investmentYears);
    setCalculatedAmount(amount.toFixed(2));
  };
  
  const nextEducationPage = () => {
    if (page < 3) {
      setPage(page + 1);
    }
  };
  
  const prevEducationPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
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
  
  // Render educational content based on current page
  const renderEducationalContent = () => {
    switch(page) {
      case 0:
        return <IntroductionPage onNext={nextEducationPage} />;
      case 1:
        return <InvestmentOptionsPage onNext={nextEducationPage} onPrev={prevEducationPage} />;
      case 2:
        return <QuestionnaireExplanationPage onNext={nextEducationPage} onPrev={prevEducationPage} />;
      case 3:
        return <MinimizeRiskPage onPrev={prevEducationPage} />;
      default:
        return <IntroductionPage onNext={nextEducationPage} />;
    }
  };
  
  // Render calculator component
  const renderCalculator = () => {
    return (
      <div className="calculator-container">
        <h2>Investment Growth Calculator</h2>
        <p>See how your investments could grow over time with the power of compound interest.</p>
        
        <div className="calculator-input">
          <div className="input-group">
            <label htmlFor="investment-amount">Initial Investment ($)</label>
            <input
              type="number"
              id="investment-amount"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(Number(e.target.value))}
              min="0"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="investment-years">Time Period (Years)</label>
            <input
              type="number"
              id="investment-years"
              value={investmentYears}
              onChange={(e) => setInvestmentYears(Number(e.target.value))}
              min="1"
              max="50"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="investment-rate">Estimated Annual Return (%)</label>
            <input
              type="number"
              id="investment-rate"
              value={investmentRate}
              onChange={(e) => setInvestmentRate(Number(e.target.value))}
              min="0"
              max="20"
              step="0.1"
            />
          </div>
          
          <button className="calculate-button" onClick={calculateInvestment}>Calculate</button>
        </div>
        
        {calculatedAmount && (
          <div className="calculator-result">
            <h3>Projected Value</h3>
            <div className="result-value">${Number(calculatedAmount).toLocaleString()}</div>
            <p>Your initial investment of ${investmentAmount.toLocaleString()} could grow to ${Number(calculatedAmount).toLocaleString()} after {investmentYears} years at an average annual return of {investmentRate}%.</p>
            <p className="disclaimer">This is a simplified calculation for educational purposes only. Actual results may vary due to various factors including market fluctuations, fees, and taxes.</p>
          </div>
        )}
      </div>
    );
  };
