import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Fetch questions from API
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/questions')
      .then((response) => {
        setQuestions(response.data);
        setUserAnswers(new Array(response.data.length).fill(null));
      })
      .catch((error) => {
        console.error('Error fetching questions:', error);
      });
  }, []);

  // Handle user answer selection
  const handleAnswerSelect = (selectedAnswer) => {
    setUserAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[currentQuestionIndex] = selectedAnswer;
      return updatedAnswers;
    });
  };

  // Submit answers to API
  const handleSubmitAnswers = () => {
    axios
      .post('http://localhost:5000/api/submit', { answers: userAnswers })
      .then((response) => {
        setScore(response.data.score);
      })
      .catch((error) => {
        console.error('Error submitting answers:', error);
      });
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div style={{width:"500px",margin:"0 auto"}}>
      <h1 style={{textAlign:"center"}}>Quiz App</h1>
      <div style={{}}>Multiple Choice Question</div>
      <Question
        question={currentQuestion}
        selectedAnswer={userAnswers[currentQuestionIndex]}
        onAnswerSelect={handleAnswerSelect}
      />
      <div>
        <button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
          Previous
        </button>
        <button onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1}>
          Next
        </button>
        <button onClick={handleSubmitAnswers}>Submit</button>
      </div>
      {score !== null && <p>Score: {score}</p>}
    </div>
  );
};

const Question = ({ question, selectedAnswer, onAnswerSelect }) => {
  const options = question.options.split(',');

  return (
    <div>
      <h3>{question.question}</h3>
      {options.map((option, index) => (
        <Option
          key={index}
          optionText={option}
          isSelected={index + 1 === selectedAnswer}
          onSelect={() => onAnswerSelect(index + 1)}
        />
      ))}
    </div>
  );
};

const Option = ({ optionText, isSelected, onSelect }) => (
  <div
    style={{ backgroundColor: isSelected ? 'lightblue' : 'white', cursor: 'pointer' }}
    onClick={onSelect}
  >
    {optionText}
  </div>
);

export default Quiz;
