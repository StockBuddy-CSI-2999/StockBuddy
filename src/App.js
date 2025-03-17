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
