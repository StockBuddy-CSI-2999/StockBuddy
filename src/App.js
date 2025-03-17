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

const SavingsQuestion = ({ answer, onChange, onNext, onPrev }) => {
  return (
    <div className="question-card">
      <h2>How much do you currently have saved for investing?</h2>
      <p>Your current savings level helps determine appropriate investment vehicles.</p>
      <div className="options-grid">
        <label className={`radio-option ${answer === 'less1k' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="savings"
            value="less1k"
            checked={answer === 'less1k'}
            onChange={() => onChange('less1k')}
          />
          <span className="option-text">Less than $1,000</span>
        </label>
        <label className={`radio-option ${answer === '1k-10k' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="savings"
            value="1k-10k"
            checked={answer === '1k-10k'}
            onChange={() => onChange('1k-10k')}
          />
          <span className="option-text">$1,000 - $10,000</span>
        </label>
        <label className={`radio-option ${answer === '10k-50k' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="savings"
            value="10k-50k"
            checked={answer === '10k-50k'}
            onChange={() => onChange('10k-50k')}
          />
          <span className="option-text">$10,000 - $50,000</span>
        </label>
        <label className={`radio-option ${answer === 'more50k' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="savings"
            value="more50k"
            checked={answer === 'more50k'}
            onChange={() => onChange('more50k')}
          />
          <span className="option-text">More than $50,000</span>
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

const RiskQuestion = ({ answer, onChange, onNext, onPrev }) => {
  return (
    <div className="question-card">
      <h2>What level of risk are you comfortable with?</h2>
      <p>Your risk tolerance is a key factor in determining your investment strategy.</p>
      <div className="options-grid">
        <label className={`radio-option ${answer === 'low' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="riskTolerance"
            value="low"
            checked={answer === 'low'}
            onChange={() => onChange('low')}
          />
          <span className="option-text">Minimal risk – I want my money to be safe, even if returns are low</span>
        </label>
        <label className={`radio-option ${answer === 'moderate' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="riskTolerance"
            value="moderate"
            checked={answer === 'moderate'}
            onChange={() => onChange('moderate')}
          />
          <span className="option-text">Moderate risk – I'm okay with some ups and downs for steady growth</span>
        </label>
        <label className={`radio-option ${answer === 'high' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="riskTolerance"
            value="high"
            checked={answer === 'high'}
            onChange={() => onChange('high')}
          />
          <span className="option-text">High risk – I'm willing to take big risks for high potential returns</span>
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
const MarketReactionQuestion = ({ answer, onChange, onNext, onPrev }) => {
  return (
    <div className="question-card">
      <h2>How would you react if your investment lost 20% in a short time?</h2>
      <p>Your reaction to market downturns helps gauge your actual risk tolerance.</p>
      <div className="options-grid">
        <label className={`radio-option ${answer === 'sell' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="marketReaction"
            value="sell"
            checked={answer === 'sell'}
            onChange={() => onChange('sell')}
          />
          <span className="option-text">Sell everything immediately to avoid further losses</span>
        </label>
        <label className={`radio-option ${answer === 'hold' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="marketReaction"
            value="hold"
            checked={answer === 'hold'}
            onChange={() => onChange('hold')}
          />
          <span className="option-text">Hold and wait to see if the market recovers</span>
        </label>
        <label className={`radio-option ${answer === 'buy' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="marketReaction"
            value="buy"
            checked={answer === 'buy'}
            onChange={() => onChange('buy')}
          />
          <span className="option-text">Buy more because I believe in long-term growth</span>
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
const InvolvementQuestion = ({ answer, options, onAnswerChange, onOptionsChange, onSubmit, onPrev }) => {
  return (
    <div className="question-card">
      <h2>How involved do you want to be in managing your investments?</h2>
      <p>Your preferred level of involvement will help determine suitable investment vehicles.</p>
      <div className="options-grid">
        <label className={`radio-option ${answer === 'hands-off' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="involvement"
            value="hands-off"
            checked={answer === 'hands-off'}
            onChange={() => onAnswerChange('hands-off')}
          />
          <span className="option-text">Hands-off – I prefer automated, low-maintenance strategies</span>
        </label>
        <label className={`radio-option ${answer === 'somewhat' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="involvement"
            value="somewhat"
            checked={answer === 'somewhat'}
            onChange={() => onAnswerChange('somewhat')}
          />
          <span className="option-text">Somewhat involved – I'll review my portfolio occasionally</span>
        </label>
        <label className={`radio-option ${answer === 'active' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="involvement"
            value="active"
            checked={answer === 'active'}
            onChange={() => onAnswerChange('active')}
          />
          <span className="option-text">Actively involved – I want to research and manage my own investments</span>
        </label>
      </div>
      
      <div className="checkbox-section">
        <h3>Which of these investment options do you feel comfortable with?</h3>
        <p>Select all that apply</p>
        
        <div className="options-grid">
          <label className={`checkbox-option ${options.includes('savings') ? 'selected' : ''}`}>
            <input
              type="checkbox"
              name="options"
              value="savings"
              checked={options.includes('savings')}
              onChange={() => onOptionsChange('savings')}
            />
            <span className="option-text">High-yield savings accounts & CDs</span>
          </label>
          <label className={`checkbox-option ${options.includes('bonds') ? 'selected' : ''}`}>
            <input
              type="checkbox"
              name="options"
              value="bonds"
              checked={options.includes('bonds')}
              onChange={() => onOptionsChange('bonds')}
            />
            <span className="option-text">Bonds & mutual funds</span>
          </label>
          <label className={`checkbox-option ${options.includes('index') ? 'selected' : ''}`}>
            <input
              type="checkbox"
              name="options"
              value="index"
              checked={options.includes('index')}
              onChange={() => onOptionsChange('index')}
            />
            <span className="option-text">Index funds & ETFs</span>
          </label>
          <label className={`checkbox-option ${options.includes('stocks') ? 'selected' : ''}`}>
            <input
              type="checkbox"
              name="options"
              value="stocks"
              checked={options.includes('stocks')}
              onChange={() => onOptionsChange('stocks')}
            />
            <span className="option-text">Individual stocks & real estate</span>
          </label>
          <label className={`checkbox-option ${options.includes('crypto') ? 'selected' : ''}`}>
            <input
              type="checkbox"
              name="options"
              value="crypto"
              checked={options.includes('crypto')}
              onChange={() => onOptionsChange('crypto')}
            />
            <span className="option-text">Cryptocurrency & venture capital</span>
          </label>
        </div>
      </div>
      
      <div className="navigation">
        <button
          onClick={onPrev}
          className="prev-button"
        >
          Previous
        </button>
        <button
          onClick={onSubmit}
          disabled={!answer || options.length === 0}
          className="submit-button"
        >
          Get Your Results
        </button>
      </div>
    </div>
  );
};
// Results Component
const calculateInvestorProfile = (answers) => {
  // Scoring system to determine investor profile
  let score = 0;

  // Age scoring
  if (answers.age === 'under25') score += 3;
  else if (answers.age === '25-35') score += 2;
  else if (answers.age === '36-50') score += 1;

  // Goal scoring
  if (answers.goal === 'long-term') score += 3;
  else if (answers.goal === 'medium-term') score += 2;
  else if (answers.goal === 'short-term') score += 0;

  // Savings scoring
  if (answers.savings === 'more50k') score += 1;

  // Risk tolerance scoring
  if (answers.riskTolerance === 'high') score += 3;
  else if (answers.riskTolerance === 'moderate') score += 2;
  else if (answers.riskTolerance === 'low') score += 0;
  // Market reaction scoring
  if (answers.marketReaction === 'buy') score += 3;
  else if (answers.marketReaction === 'hold') score += 1;
  else if (answers.marketReaction === 'sell') score -= 1;

  // Involvement scoring
  if (answers.involvement === 'active') score += 2;
  else if (answers.involvement === 'somewhat') score += 1;

  // Investment options scoring
  if (answers.options.includes('crypto')) score += 2;
  if (answers.options.includes('stocks')) score += 1;
  if (answers.options.includes('index')) score += 0.5;

  // Determine profile based on score
  if (score <= 4) {
    return {
      type: 'Conservative Saver',
      focus: 'Capital preservation with minimal risk',
      investments: 'High-yield savings accounts, certificates of deposit (CDs), government bonds',
      strategy: 'Low-volatility investments with steady, predictable returns',
      description: 'You prioritize safety and stability over growth potential. Your investment approach focuses on preserving capital while generating modest, reliable income.',
      color: 'blue'
    };
} else if (score <= 8) {
    return {
      type: 'Balanced Investor',
      focus: 'Stability with moderate growth potential',
      investments: 'A mix of index funds, ETFs, blue-chip stocks, and bonds',
      strategy: 'A diversified portfolio that balances risk and reward',
      description: 'You seek a balance between growth and security. Your portfolio should include both stable income-producing assets and growth-oriented investments.',
      color: 'green'
    };
  } else if (score <= 12) {
    return {
      type: 'Growth Seeker',
      focus: 'Long-term wealth accumulation with higher returns',
      investments: 'Growth stocks, diversified ETFs, real estate investment trusts (REITs)',
      strategy: 'A growth-focused approach that prioritizes appreciation over short-term stability',
      description: 'You emphasize long-term growth over current income. Your investment strategy focuses on capital appreciation with a higher tolerance for market fluctuations.',
      color: 'purple'
    };
  } else {
    return {
      type: 'Aggressive Investor',
      focus: 'Maximizing returns through high-risk investments',
      investments: 'Individual stocks, emerging markets, cryptocurrency, venture capital opportunities',
      strategy: 'High-risk, high-reward investments with active portfolio management',
      description: 'You aim for maximum returns and are willing to accept significant volatility. Your approach involves actively seeking opportunities with high growth potential.',
      color: 'red'
    };
  }
};
const ResultsPage = ({ profile, onReset }) => {
  const getHeaderClass = () => {
    switch(profile.color) {
      case 'blue': return 'result-header blue';
      case 'green': return 'result-header green';
      case 'purple': return 'result-header purple';
      case 'red': return 'result-header red';
      default: return 'result-header blue';
    }
  };

  return (
    <div className="results-container">
      <div className="result-card">
        <div className={getHeaderClass()}>
          <h2>Your Investment Profile</h2>
          <h3>{profile.type}</h3>
        </div>

        <div className="result-content">
          <div className="result-summary">
            <h4>Profile Summary</h4>
            <p>{profile.description}</p>

            <div className="profile-cards">
              <div className="profile-card">
                <h5>Investment Focus</h5>
                <p>{profile.focus}</p>
              </div>
              <div className="profile-card">
                <h5>Recommended Investments</h5>
                <p>{profile.investments}</p>
              </div>
              <div className="profile-card">
                <h5>Strategy</h5>
                <p>{profile.strategy}</p>
              </div>
            </div>
          </div>
<div className="next-steps">
            <h4>Next Steps</h4>
            <div className="next-steps-container">
              <h5>Start Your Investment Journey</h5>
              <ul>
                <li>Research financial institutions that offer the investment types recommended for your profile</li>
                <li>Consider consulting with a financial advisor for personalized guidance</li>
                <li>Start with a small amount and gradually increase your investments as you gain confidence</li>
                <li>Regularly review your portfolio performance and adjust as needed</li>
              </ul>
              <p className="disclaimer">
                Remember that all investments carry some level of risk, and past performance is not indicative of future results.
              </p>
            </div>
          </div>

          <div className="reset-container">
            <button
              onClick={onReset}
              className="reset-button"
            >
              Take the Quiz Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;







