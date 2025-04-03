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
// Render user profile component
 const renderUserProfile = () => {
   return (
     <div className="profile-container">
       <div className="profile-header">
         <div className="profile-avatar">
           <span>{userProfile.name.charAt(0)}</span>
         </div>
         <div className="profile-details">
           <h2>{userProfile.name}</h2>
           <p>{userProfile.email}</p>
         </div>
       </div>
      
       <div className="profile-section">
         <h3>Investment Profile</h3>
         {result ? (
           <div className="profile-info">
             <p><strong>Your investor type:</strong> {result.type}</p>
             <p><strong>Focus:</strong> {result.focus}</p>
             <p><strong>Strategy:</strong> {result.strategy}</p>
           </div>
         ) : (
           <p>Take the investment questionnaire to determine your investor profile.</p>
         )}
       </div>
      
       <div className="profile-section">
         <h3>Portfolio Tracker</h3>
         <div className="portfolio-summary">
           <div className="portfolio-stat">
             <span className="stat-label">Portfolio Value</span>
             <span className="stat-value">$0.00</span>
           </div>
           <div className="portfolio-stat">
             <span className="stat-label">Monthly Contribution</span>
             <span className="stat-value">$0.00</span>
           </div>
           <div className="portfolio-stat">
             <span className="stat-label">Projected Annual Growth</span>
             <span className="stat-value">0%</span>
           </div>
         </div>
         <p className="profile-note">Feature coming soon: Link your investment accounts to track your portfolio performance.</p>
       </div>
      
       <div className="profile-section">
         <h3>Saved Articles</h3>
         {userProfile.savedArticles.length > 0 ? (
           <ul className="saved-articles">
             {userProfile.savedArticles.map((article, index) => (
               <li key={index}>{article}</li>
             ))}
           </ul>
         ) : (
           <p>You haven't saved any articles yet. Browse the educational content and bookmark articles that interest you.</p>
         )}
       </div>
     </div>
   );
 };
  // Render community forum component
 const renderCommunityForum = () => {
   return (
     <div className="forum-container">
       <h2>Community Forum</h2>
       <p>Connect with other investors, ask questions, and share experiences.</p>
      
       <div className="forum-post-button">
         <button className="post-button">+ New Discussion</button>
       </div>
      
       <div className="forum-filter">
         <select className="filter-dropdown">
           <option>Recent Discussions</option>
           <option>Most Replies</option>
           <option>Beginner Questions</option>
           <option>Advanced Topics</option>
         </select>
       </div>
      
       <div className="forum-posts">
         {forumPosts.map(post => (
           <div className="forum-post" key={post.id}>
             <div className="post-header">
               <h3 className="post-title">{post.title}</h3>
               <span className="post-meta">Posted by {post.author} · {post.timestamp}</span>
             </div>
             <p className="post-content">{post.content}</p>
            
             <div className="post-actions">
               <button className="action-button">Reply</button>
               <span className="reply-count">{post.replies.length} replies</span>
             </div>
            
             {post.replies.length > 0 && (
               <div className="post-replies">
                 {post.replies.map((reply, index) => (
                   <div className="reply" key={index}>
                     <span className="reply-author">{reply.author}</span>
                     <p className="reply-content">{reply.content}</p>
                   </div>
                 ))}
               </div>
             )}
           </div>
         ))}
       </div>
     </div>
   );
 };
// Main application render
 return (
   <div className="app-container">
     <div className="app-header">
       <div className="logo" onClick={() => {setActiveTab('questionnaire'); setStep(0);}}><span>$</span></div>
       <h1 className="site-title" onClick={() => {setActiveTab('questionnaire'); setStep(0);}}>StockBuddy</h1>
       <nav className="main-nav">
         <ul>
           <li className={activeTab === 'questionnaire' ? 'active' : ''} onClick={() => setActiveTab('questionnaire')}>Questionnaire</li>
           <li className={activeTab === 'education' ? 'active' : ''} onClick={() => setActiveTab('education')}>Learn</li>
           <li className={activeTab === 'calculator' ? 'active' : ''} onClick={() => setActiveTab('calculator')}>Calculator</li>
           <li className={activeTab === 'community' ? 'active' : ''} onClick={() => setActiveTab('community')}>Community</li>
           <li className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>Profile</li>
         </ul>
       </nav>
     </div>
    
     <div className="container">
       {activeTab === 'questionnaire' && (
         <>
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
         </>
       )}
      
       {activeTab === 'education' && renderEducationalContent()}
       {activeTab === 'calculator' && renderCalculator()}
       {activeTab === 'community' && renderCommunityForum()}
       {activeTab === 'profile' && renderUserProfile()}
     </div>
    
     <footer className="app-footer">
       <div className="footer-content">
         <div className="footer-logo">StockBuddy</div>
         <div className="footer-links">
           <a href="#about">About Us</a>
           <a href="#terms">Terms of Use</a>
           <a href="#privacy">Privacy Policy</a>
           <a href="#contact">Contact</a>
         </div>
         <div className="footer-legal">© {new Date().getFullYear()} StockBuddy. All rights reserved. Educational use only. Not financial advice.</div>
       </div>
     </footer>
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
// Educational Content Pages
const IntroductionPage = ({ onNext }) => {
 return (
   <div className="educational-page">
     <div className="page-number">Page 1 of 4</div>
     <h2 className="page-title">Introduction to Investing</h2>
    
     <div className="article-content">
       <p>With the right tools and resources, investing can be much easier than you'd expect. Best of all, you don't need a lot of money to get started. Simply start out small, and gradually increase your contributions over time as your income and savings grow. The important thing is to start saving for your goals as early as you can, so your money has more time to potentially grow.</p>
      
       <div className="article-image">
         <div className="placeholder-image">
           <span>Investing Growth Illustration</span>
         </div>
       </div>
      
       <h3>Why Start Investing Early?</h3>
       <p>The earlier you start investing, the more time your money has to potentially grow through compound interest. Even small amounts invested consistently can grow significantly over time.</p>
      
       <div className="key-points">
         <h4>Key Takeaways:</h4>
         <ul>
           <li>Start small and increase contributions over time</li>
           <li>Begin investing as early as possible</li>
           <li>Consistency is more important than amount</li>
           <li>Time in the market matters more than timing the market</li>
         </ul>
       </div>
     </div>
    
     <div className="page-navigation">
       <button onClick={onNext} className="next-button">Next Page</button>
     </div>
   </div>
 );
};


const InvestmentOptionsPage = ({ onNext, onPrev }) => {
 return (
   <div className="educational-page">
     <div className="page-number">Page 2 of 4</div>
     <h2 className="page-title">What are your options?</h2>
    
     <div className="article-content">
       <div className="investment-options">
         <div className="investment-option">
           <h3>Stocks</h3>
           <p>When you buy a stock, you own a small piece of a company. If the company does well, the stock's value may go up, and you can sell it for a profit. But if the company struggles, the stock's value can drop.</p>
         </div>
        
         <div className="investment-option">
           <h3>Bonds</h3>
           <p>A bond is like a loan you give to a company or government. They promise to pay you back later with interest. It's generally safer than stocks but offers lower returns.</p>
         </div>
        
         <div className="investment-option">
           <h3>Mutual Funds</h3>
           <p>A mutual fund is a big pool of money collected from many investors. A professional manager uses this money to buy a mix of stocks, bonds, or other assets. This helps spread out risk, but you pay a fee for the management.</p>
         </div>
        
         <div className="investment-option">
           <h3>ETFs (Exchange-Traded Funds)</h3>
           <p>ETFs are similar to mutual funds but trade like stocks on the market. They offer diversification like mutual funds but often have lower fees and more flexibility.</p>
         </div>
       </div>
      
       <div className="option-comparison">
         <h3>Comparing Investment Options</h3>
         <table className="comparison-table">
           <thead>
             <tr>
               <th>Investment Type</th>
               <th>Risk Level</th>
               <th>Potential Return</th>
               <th>Liquidity</th>
               <th>Best For</th>
             </tr>
           </thead>
           <tbody>
             <tr>
               <td>Stocks</td>
               <td>High</td>
               <td>High</td>
               <td>High</td>
               <td>Long-term growth</td>
             </tr>
             <tr>
               <td>Bonds</td>
               <td>Low to Moderate</td>
               <td>Low to Moderate</td>
               <td>Moderate</td>
               <td>Income and stability</td>
             </tr>
             <tr>
               <td>Mutual Funds</td>
               <td>Varies</td>
               <td>Varies</td>
               <td>Moderate</td>
               <td>Diversification</td>
             </tr>
             <tr>
               <td>ETFs</td>
               <td>Varies</td>
               <td>Varies</td>
               <td>High</td>
               <td>Cost-effective diversification</td>
             </tr>
           </tbody>
         </table>
       </div>
     </div>
    
     <div className="page-navigation">
       <button onClick={onPrev} className="prev-button">Previous Page</button>
       <button onClick={onNext} className="next-button">Next Page</button>
     </div>
   </div>
 );
};


const QuestionnaireExplanationPage = ({ onNext, onPrev }) => {
 return (
   <div className="educational-page">
     <div className="page-number">Page 3 of 4</div>
     <h2 className="page-title">How is our questionnaire getting your investment journey started?</h2>
    
     <div className="article-content">
       <p>Retirement should always be the first investing goal on your list. But it's also important to plan and save for other goals like a house or a child's education. Once you've defined your investing goals using StockBuddy, it's time to consider your:</p>
      
       <div className="questionnaire-factors">
         <div className="factor">
           <h3>Financial situation</h3>
           <p>Figure out how much you're spending every month and how much is left over to save toward your goals.</p>
         </div>
        
         <div className="factor">
           <h3>Time horizon</h3>
           <p>Determine how much time you'll need to achieve your goals. For example, if you have many years until retirement, it's a long-term goal. If you're planning to buy a home in 5 years, that's a short-term goal. The longer your time frame, the more time to potentially benefit from the power of compounding, where your earnings generate their own earnings over time.</p>
         </div>
        
         <div className="factor">
           <h3>Risk tolerance</h3>
           <p>Think about the amount of market volatility and potential loss you're willing to accept. Your risk tolerance will likely vary depending on the time horizon for each of your goals. For example, the longer you have to reach your goal, the more time you have to weather market ups and downs, which means you may be comfortable taking on more risk.</p>
         </div>
       </div>
      
       <div className="questionnaire-diagram">
         <div className="diagram-header">StockBuddy Questionnaire Process</div>
         <div className="diagram-steps">
           <div className="diagram-step">
             <div className="step-number">1</div>
             <div className="step-content">Assess your financial goals and timeframe</div>
           </div>
           <div className="diagram-step">
             <div className="step-number">2</div>
             <div className="step-content">Determine your risk tolerance</div>
           </div>
           <div className="diagram-step">
             <div className="step-number">3</div>
             <div className="step-content">Evaluate your investment knowledge and preferences</div>
           </div>
           <div className="diagram-step">
             <div className="step-number">4</div>
             <div className="step-content">Generate personalized investment profile</div>
           </div>
         </div>
       </div>
     </div>
    
     <div className="page-navigation">
       <button onClick={onPrev} className="prev-button">Previous Page</button>
       <button onClick={onNext} className="next-button">Next Page</button>
     </div>
   </div>
 );
};


const MinimizeRiskPage = ({ onPrev }) => {
 return (
   <div className="educational-page">
     <div className="page-number">Page 4 of 4</div>
     <h2 className="page-title">Selecting your investments to minimize risk</h2>
    
     <div className="article-content">
       <p>There are many types of investments to choose from to suit your needs, including mutual funds, exchange-traded funds (ETFs), and individual stocks and bonds. Be sure to diversify your portfolio by choosing a variety of investment types to help lower your risk and improve your chances of achieving your investment goals. Here's how:</p>
      
       <div className="risk-strategies">
         <div className="strategy">
           <h3>Invest in different asset classes</h3>
           <p>A portfolio that includes stock, bonds, and cash can help reduce your risk of potential losses if one class underperforms. Mutual funds and ETFs offer an easy way to accomplish this because they invest in a diversified mix of individual investments.</p>
          
           <div className="strategy-illustration">
             <div className="asset-allocation">
               <div className="allocation-piece stocks" style={{width: '60%'}}>Stocks (60%)</div>
               <div className="allocation-piece bonds" style={{width: '30%'}}>Bonds (30%)</div>
               <div className="allocation-piece cash" style={{width: '10%'}}>Cash (10%)</div>
             </div>
             <div className="allocation-caption">Example of a balanced portfolio allocation</div>
           </div>
         </div>
        
         <div className="strategy">
           <h3>Invest in different sectors</h3>
           <p>Within each asset class, there are different sectors. For example, the stock market is divided into sectors such as technology, health care, and finance. By investing in different sectors, you can further reduce your risk.</p>
          
           <div className="sector-list">
             <div className="sector">Technology</div>
             <div className="sector">Healthcare</div>
             <div className="sector">Finance</div>
             <div className="sector">Consumer Goods</div>
             <div className="sector">Energy</div>
             <div className="sector">Real Estate</div>
           </div>
         </div>
       </div>
      
       <div className="risk-summary">
         <h3>Key Risk Management Strategies</h3>
         <ul>
           <li>Diversify across asset classes (stocks, bonds, cash)</li>
           <li>Spread investments across different industry sectors</li>
           <li>Consider geographical diversification (domestic and international)</li>
           <li>Rebalance your portfolio periodically</li>
           <li>Adjust your strategy as your time horizon changes</li>
         </ul>
       </div>
     </div>
    
     <div className="page-navigation">
       <button onClick={onPrev} className="prev-button">Previous Page</button>
     </div>
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
/* Forum Styles */
.forum-container {
 background-color: white;
 border-radius: 12px;
 padding: 32px;
 box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
 max-width: 900px;
 margin: 0 auto;
}


.forum-container h2 {
 font-size: 24px;
 font-weight: 700;
 color: #333;
 margin-bottom: 12px;
}


.forum-container > p {
 color: #666;
 margin-bottom: 24px;
}


.forum-post-button {
 margin-bottom: 24px;
}


.post-button {
 background-color: #3166db;
 color: white;
 font-weight: 600;
 padding: 10px 20px;
 border: none;
 border-radius: 6px;
 cursor: pointer;
 transition: background-color 0.2s;
}


.post-button:hover {
 background-color: #2855c0;
}


.forum-filter {
 margin-bottom: 24px;
}


.filter-dropdown {
 padding: 10px;
 border: 1px solid #ddd;
 border-radius: 4px;
 width: 200px;
 font-size: 14px;
}


.forum-posts {
 display: flex;
 flex-direction: column;
 gap: 24px;
}


.forum-post {
 border: 1px solid #eee;
 border-radius: 8px;
 padding: 20px;
}


.post-header {
 margin-bottom: 12px;
}


.post-title {
 font-size: 18px;
 font-weight: 600;
 color: #333;
 margin-bottom: 4px;
}


.post-meta {
 font-size: 14px;
 color: #777;
}


.post-content {
 color: #444;
 margin-bottom: 16px;
}


.post-actions {
 display: flex;
 align-items: center;
 gap: 16px;
 margin-bottom: 16px;
}


.action-button {
 background-color: #f0f0f0;
 border: none;
 padding: 6px 12px;
 border-radius: 4px;
 font-size: 14px;
 cursor: pointer;
}


.action-button:hover {
 background-color: #e0e0e0;
}


.reply-count {
 font-size: 14px;
 color: #666;
}


.post-replies {
 background-color: #f9f9f9;
 border-radius: 8px;
 padding: 16px;
}


.reply {
 margin-bottom: 16px;
 padding-bottom: 16px;
 border-bottom: 1px solid #eee;
}


.reply:last-child {
 margin-bottom: 0;
 padding-bottom: 0;
 border-bottom: none;
}


.reply-author {
 font-weight: 600;
 color: #333;
 margin-bottom: 4px;
 display: block;
}


.reply-content {
 font-size: 14px;
 color: #444;
}


/* Profile Styles */
.profile-container {
 background-color: white;
 border-radius: 12px;
 padding: 32px;
 box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
 max-width: 800px;
 margin: 0 auto;
}


.profile-header {
 display: flex;
 align-items: center;
 margin-bottom: 32px;
}


.profile-avatar {
 width: 80px;
 height: 80px;
 border-radius: 50%;
 background-color: #3166db;
 color: white;
 display: flex;
 align-items: center;
 justify-content: center;
 font-size: 36px;
 font-weight: 600;
 margin-right: 24px;
}


.profile-details h2 {
 font-size: 24px;
 font-weight: 700;
 color: #333;
 margin-bottom: 4px;
}


.profile-details p {
 color: #666;
}


.profile-section {
 margin-bottom: 32px;
 padding-bottom: 32px;
 border-bottom: 1px solid #eee;
}


.profile-section:last-child {
 margin-bottom: 0;
 padding-bottom: 0;
 border-bottom: none;
}


.profile-section h3 {
 font-size: 20px;
 font-weight: 600;
 color: #333;
 margin-bottom: 16px;
}


.profile-info {
 background-color: #f9f9f9;
 border-radius: 8px;
 padding: 20px;
}


.profile-info p {
 margin-bottom: 12px;
}


.profile-info p:last-child {
 margin-bottom: 0;
}


.portfolio-summary {
 display: grid;
 grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
 gap: 16px;
 margin-bottom: 16px;
}


.portfolio-stat {
 background-color: #f0f5ff;
 border-radius: 8px;
 padding: 16px;
 text-align: center;
}


.stat-label {
 display: block;
 font-size: 14px;
 color: #666;
 margin-bottom: 8px;
}


.stat-value {
 font-size: 24px;
 font-weight: 700;
 color: #3166db;
}


.profile-note {
 font-style: italic;
 color: #777;
 font-size: 14px;
}


.saved-articles {
 list-style-type: none;
}


.saved-articles li {
 padding: 12px 16px;
 border-bottom: 1px solid #eee;
}


.saved-articles li:last-child {
 border-bottom: none;
}


/* Responsive styles */
@media (max-width: 768px) {
 .app-header {
   flex-direction: column;
   align-items: center;
   padding: 16px;
 }
  .site-title {
   margin-right: 0;
   margin-bottom: 12px;
 }
  .main-nav ul {
   flex-wrap: wrap;
   justify-content: center;
 }
  .landing-page h1 {
   font-size: 36px;
 }
  .landing-page h2 {
   font-size: 20px;
 }
  .question-card {
   padding: 24px;
 }
  .options-grid {
   grid-template-columns: 1fr;
 }
  .feature-cards {
   grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
 }
  .result-header h3 {
   font-size: 28px;
 }
  .profile-cards {
   grid-template-columns: 1fr;
 }
  .educational-page {
   padding: 24px;
 }
  .investment-options {
   grid-template-columns: 1fr;
 }
  .comparison-table {
   display: block;
   overflow-x: auto;
 }
  .profile-header {
   flex-direction: column;
   text-align: center;
 }
  .profile-avatar {
   margin-right: 0;
   margin-bottom: 16px;
 }
}

