// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  where,
  deleteDoc
} from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRiWl1VRPHABfqYEdEmmcbvW_Q-rz04ds",
  authDomain: "stockbuddy-497e7.firebaseapp.com",
  projectId: "stockbuddy-497e7",
  storageBucket: "stockbuddy-497e7.firebasestorage.app",
  messagingSenderId: "372507670843",
  appId: "1:372507670843:web:e9e9013275a5c5bd7c1f1e",
  measurementId: "G-1HK4VG4R40"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const App = () => {
  // Original state variables
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
  
  // Enhanced calculator states
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [investmentYears, setInvestmentYears] = useState(10);
  const [investmentRate, setInvestmentRate] = useState(7);
  const [monthlyContribution, setMonthlyContribution] = useState(100);
  const [calculatedAmount, setCalculatedAmount] = useState(null);
  
  // Authentication states
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Forum states
  const [forumPosts, setForumPosts] = useState([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [postReply, setPostReply] = useState('');
  const [forumFilter, setForumFilter] = useState('recent');
  
  // User profile state
  const [userProfile, setUserProfile] = useState({
    name: 'Guest User',
    email: 'guest@example.com',
    investmentGoals: [],
    savedArticles: [],
    portfolioValue: 0
  });

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserProfile(currentUser.uid);
      } else {
        setUserProfile({
          name: 'Guest User',
          email: 'guest@example.com',
          investmentGoals: [],
          savedArticles: [],
          portfolioValue: 0
        });
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  // Fetch forum posts
  useEffect(() => {
    fetchForumPosts();
  }, [forumFilter]);
  
  // Fetch forum posts from Firestore
  const fetchForumPosts = async () => {
    try {
      let q;
      
      if (forumFilter === 'recent') {
        q = query(collection(db, "forumPosts"), orderBy("timestamp", "desc"));
      } else if (forumFilter === 'mostReplies') {
        q = query(collection(db, "forumPosts"), orderBy("replyCount", "desc"));
      } else if (forumFilter === 'beginner') {
        q = query(collection(db, "forumPosts"), where("category", "==", "beginner"), orderBy("timestamp", "desc"));
      } else if (forumFilter === 'advanced') {
        q = query(collection(db, "forumPosts"), where("category", "==", "advanced"), orderBy("timestamp", "desc"));
      }
      
      const querySnapshot = await getDocs(q);
      const posts = [];
      
      for (const docSnapshot of querySnapshot.docs) {
        const postData = docSnapshot.data();
        const repliesQuery = query(collection(db, "forumPosts", docSnapshot.id, "replies"), orderBy("timestamp", "asc"));
        const repliesSnapshot = await getDocs(repliesQuery);
        
        const replies = repliesSnapshot.docs.map(replyDoc => ({
          id: replyDoc.id,
          ...replyDoc.data()
        }));
        
        posts.push({
          id: docSnapshot.id,
          ...postData,
          replies
        });
      }
      
      setForumPosts(posts);
    } catch (error) {
      console.error("Error fetching forum posts: ", error);
    }
  };
  
  // Fetch user profile from Firestore
  const fetchUserProfile = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      
      if (userDoc.exists()) {
        setUserProfile({
          ...userDoc.data(),
          name: auth.currentUser.displayName || 'User'
        });
      } else {
        // Create a new user profile if it doesn't exist
        const newProfile = {
          name: auth.currentUser.displayName || 'User',
          email: auth.currentUser.email,
          investmentGoals: [],
          savedArticles: [],
          portfolioValue: 0
        };
        
        await setDoc(doc(db, "users", userId), newProfile);
        setUserProfile(newProfile);
      }
    } catch (error) {
      console.error("Error fetching user profile: ", error);
    }
  };
  
  // Authentication handlers
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, { displayName });
      
      // Create user document in Firestore
      await addDoc(collection(db, "users"), {
        uid: userCredential.user.uid,
        name: displayName,
        email: email,
        investmentGoals: [],
        savedArticles: [],
        portfolioValue: 0,
        createdAt: serverTimestamp()
      });
      
      setAuthModalOpen(false);
      setEmail('');
      setPassword('');
      setDisplayName('');
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setAuthModalOpen(false);
      setEmail('');
      setPassword('');
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  
  // Forum post handlers
  const handleCreatePost = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    
    try {
      const newPost = {
        title: newPostTitle,
        content: newPostContent,
        author: user.displayName || 'User',
        authorId: user.uid,
        timestamp: serverTimestamp(),
        category: 'beginner', // Default category
        replyCount: 0
      };
      
      await addDoc(collection(db, "forumPosts"), newPost);
      
      setNewPostTitle('');
      setNewPostContent('');
      setIsPostModalOpen(false);
      fetchForumPosts();
    } catch (error) {
      console.error("Error creating post: ", error);
    }
  };
  
  const handlePostReply = async (postId) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    
    if (!postReply.trim()) return;
    
    try {
      const replyData = {
        content: postReply,
        author: user.displayName || 'User',
        authorId: user.uid,
        timestamp: serverTimestamp()
      };
      
      // Add reply to the subcollection
      await addDoc(collection(db, "forumPosts", postId, "replies"), replyData);
      
      // Update post reply count
      const postRef = doc(db, "forumPosts", postId);
      const postDoc = await getDoc(postRef);
      
      if (postDoc.exists()) {
        await updateDoc(postRef, {
          replyCount: (postDoc.data().replyCount || 0) + 1
        });
      }
      
      setPostReply('');
      setSelectedPost(null);
      fetchForumPosts();
    } catch (error) {
      console.error("Error posting reply: ", error);
    }
  };
  
  // Investment calculator with monthly contributions
  const calculateInvestment = () => {
    // Calculate compound interest with monthly contributions
    let futureValue = investmentAmount;
    const monthlyRate = investmentRate / 100 / 12;
    const totalMonths = investmentYears * 12;
    
    // Formula: FV = P(1+r)^n + PMT * ((1+r)^n - 1) / r
    // Where FV = Future Value, P = Principal, r = monthly rate, n = total months, PMT = monthly payment
    if (monthlyContribution > 0) {
      futureValue = futureValue * Math.pow(1 + monthlyRate, totalMonths) + 
                     monthlyContribution * (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
    } else {
      futureValue = futureValue * Math.pow(1 + monthlyRate, totalMonths);
    }
    
    setCalculatedAmount(futureValue.toFixed(2));
  };

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
  
  // Render calculator component with monthly contributions
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
            <label htmlFor="monthly-contribution">Monthly Contribution ($)</label>
            <input
              type="number"
              id="monthly-contribution"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
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
            <p>
              Your initial investment of ${investmentAmount.toLocaleString()} 
              {monthlyContribution > 0 ? ` plus a monthly contribution of $${monthlyContribution.toLocaleString()}` : ''} 
              could grow to ${Number(calculatedAmount).toLocaleString()} after {investmentYears} years 
              at an average annual return of {investmentRate}%.
            </p>
            <div className="calculator-breakdown">
              <h4>Investment Breakdown</h4>
              <div className="breakdown-chart">
                <div className="breakdown-item principal">
                  <span className="breakdown-color"></span>
                  <span className="breakdown-label">Initial Investment: ${investmentAmount.toLocaleString()}</span>
                </div>
                {monthlyContribution > 0 && (
                  <div className="breakdown-item contributions">
                    <span className="breakdown-color"></span>
                    <span className="breakdown-label">Total Contributions: ${(monthlyContribution * investmentYears * 12).toLocaleString()}</span>
                  </div>
                )}
                <div className="breakdown-item growth">
                  <span className="breakdown-color"></span>
                  <span className="breakdown-label">
                    Investment Growth: $
                    {(Number(calculatedAmount) - investmentAmount - (monthlyContribution * investmentYears * 12)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
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
            <span>{user ? user.displayName?.charAt(0) || user.email.charAt(0) : 'G'}</span>
          </div>
          <div className="profile-details">
            <h2>{user ? user.displayName || user.email : 'Guest User'}</h2>
            <p>{user ? user.email : 'Not signed in'}</p>
            {!user && (
              <button 
                className="signin-button"
                onClick={() => {
                  setAuthModalOpen(true);
                  setAuthMode('login');
                }}
              >
                Sign In
              </button>
            )}
            {user && (
              <button className="signout-button" onClick={handleLogout}>Sign Out</button>
            )}
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
              <span className="stat-value">
                ${user ? userProfile.portfolioValue.toLocaleString() : '0.00'}
              </span>
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
          {user ? (
            <button className="update-portfolio-button">Update Portfolio</button>
          ) : (
            <p className="profile-note">Sign in to track your portfolio performance.</p>
          )}
        </div>
        
        <div className="profile-section">
          <h3>Saved Articles</h3>
          {user && userProfile.savedArticles && userProfile.savedArticles.length > 0 ? (
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
  
  // Render community forum component with Firebase integration
  const renderCommunityForum = () => {
    return (
      <div className="forum-container">
        <h2>Community Forum</h2>
        <p>Connect with other investors, ask questions, and share experiences.</p>
        
        <div className="forum-post-button">
          <button 
            className="post-button" 
            onClick={() => user ? setIsPostModalOpen(true) : setAuthModalOpen(true)}
          >
            + New Discussion
          </button>
        </div>
        
        <div className="forum-filter">
          <select 
            className="filter-dropdown"
            value={forumFilter}
            onChange={(e) => setForumFilter(e.target.value)}
          >
            <option value="recent">Recent Discussions</option>
            <option value="mostReplies">Most Replies</option>
            <option value="beginner">Beginner Questions</option>
            <option value="advanced">Advanced Topics</option>
          </select>
        </div>
        
        {isLoading ? (
          <div className="loading-spinner">Loading discussions...</div>
        ) : (
          <div className="forum-posts">
            {forumPosts.length === 0 ? (
              <div className="empty-forum">
                <p>No discussions yet. Be the first to start a conversation!</p>
              </div>
            ) : (
              forumPosts.map(post => (
                <div className="forum-post" key={post.id}>
                  <div className="post-header">
                    <h3 className="post-title">{post.title}</h3>
                    <span className="post-meta">
                      Posted by {post.author} · {formatTimestamp(post.timestamp)}
                    </span>
                  </div>
                  <p className="post-content">{post.content}</p>
                  
                  <div className="post-actions">
                    <button 
                      className="action-button"
                      onClick={() => {
                        if (user) {
                          setSelectedPost(post.id);
                        } else {
                          setAuthModalOpen(true);
                        }
                      }}
                    >
                      Reply
                    </button>
                    <span className="reply-count">{post.replies?.length || 0} replies</span>
                  </div>
                  
                  {post.replies && post.replies.length > 0 && (
                    <div className="post-replies">
                      {post.replies.map((reply, index) => (
                        <div className="reply" key={index}>
                          <span className="reply-author">{reply.author}</span>
                          <span className="reply-date">{formatTimestamp(reply.timestamp)}</span>
                          <p className="reply-content">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {selectedPost === post.id && (
                    <div className="reply-form">
                      <textarea
                        placeholder="Write your reply..."
                        value={postReply}
                        onChange={(e) => setPostReply(e.target.value)}
                        rows="3"
                      ></textarea>
                      <div className="reply-actions">
                        <button 
                          className="cancel-reply-button"
                          onClick={() => {
                            setSelectedPost(null);
                            setPostReply('');
                          }}
                        >
                          Cancel
                        </button>
                        <button 
                          className="submit-reply-button"
                          onClick={() => handlePostReply(post.id)}
                          disabled={!postReply.trim()}
                        >
                          Post Reply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  };
  
  // Format Firebase timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
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
        
        <div className="user-menu">
          {user ? (
            <div className="user-dropdown">
              <button className="user-button">
                <span className="user-initial">{user.displayName?.charAt(0) || user.email.charAt(0)}</span>
              </button>
              <div className="dropdown-content">
                <div className="dropdown-user-info">
                  <span className="dropdown-name">{user.displayName || 'User'}</span>
                  <span className="dropdown-email">{user.email}</span>
                </div>
                <button className="dropdown-item" onClick={() => setActiveTab('profile')}>Your Profile</button>
                <button className="dropdown-item" onClick={handleLogout}>Sign Out</button>
              </div>
            </div>
          ) : (
            <button 
              className="signin-button header-signin"
              onClick={() => {
                setAuthModalOpen(true);
                setAuthMode('login');
              }}
            >
              Sign In
            </button>
          )}
        </div>
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
      
      {/* Authentication Modal */}
      {authModalOpen && (
        <div className="modal-overlay">
          <div className="auth-modal">
          <div className="modal-header">
              <h2>{authMode === 'login' ? 'Sign In' : 'Create Account'}</h2>
              <button className="close-button" onClick={() => setAuthModalOpen(false)}>×</button>
            </div>
            
            <div className="modal-tabs">
              <button 
                className={`tab-button ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => setAuthMode('login')}
              >
                Sign In
              </button>
              <button 
                className={`tab-button ${authMode === 'register' ? 'active' : ''}`}
                onClick={() => setAuthMode('register')}
              >
                Register
              </button>
            </div>
            
            {authError && <div className="auth-error">{authError}</div>}
            
            {authMode === 'login' ? (
              <form className="auth-form" onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="auth-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            ) : (
              <form className="auth-form" onSubmit={handleRegister}>
                <div className="form-group">
                  <label htmlFor="displayName">Name</label>
                  <input
                    type="text"
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="register-email">Email</label>
                  <input
                    type="email"
                    id="register-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="register-password">Password</label>
                  <input
                    type="password"
                    id="register-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="6"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="auth-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      
      {/* Create Post Modal */}
      {isPostModalOpen && (
        <div className="modal-overlay">
          <div className="post-modal">
            <div className="modal-header">
              <h2>Start a New Discussion</h2>
              <button className="close-button" onClick={() => setIsPostModalOpen(false)}>×</button>
            </div>
            
            <form className="post-form">
              <div className="form-group">
                <label htmlFor="post-title">Title</label>
                <input
                  type="text"
                  id="post-title"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="What's your question or topic?"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="post-content">Content</label>
                <textarea
                  id="post-content"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Provide details about your question or topic..."
                  rows="5"
                  required
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="post-category">Category</label>
                <select id="post-category">
                  <option value="beginner">Beginner Question</option>
                  <option value="advanced">Advanced Topic</option>
                  <option value="discussion">General Discussion</option>
                  <option value="strategy">Strategy</option>
                </select>
              </div>
              
              <div className="post-form-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setIsPostModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="submit-post-button"
                  onClick={handleCreatePost}
                  disabled={!newPostTitle.trim() || !newPostContent.trim()}
                >
                  Post Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
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
          <img src="/images/investment-growth.jpg" alt="Investment Growth Chart" />
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
        
        <div className="article-image">
          <img src="/images/investment-options.jpg" alt="Different investment options illustration" />
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
        
        <div className="article-image">
          <img src="/images/investment-journey.jpg" alt="Investment journey roadmap" />
        </div>
        
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
        
        <div className="article-image">
          <img src="/images/portfolio-diversification.jpg" alt="Portfolio diversification illustration" />
        </div>
        
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