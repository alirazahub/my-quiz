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
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Quiz App</h1>
      <div className="mb-2">Multiple Choice Question (Select only One)</div>
      <Question
        question={currentQuestion}
        selectedAnswer={userAnswers[currentQuestionIndex]}
        onAnswerSelect={handleAnswerSelect}
      />
      <div className="mt-4">
        <button
          className="mr-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        <button
          className="mr-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Next
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSubmitAnswers}
        >
          Submit
        </button>
      </div>
      {score !== null && <p className="mt-4 bg-blue-300 p-5 text-center text-white">Score: {score}</p>}
    </div>
  );
};

const Question = ({ question, selectedAnswer, onAnswerSelect }) => {
  const options = question.options.split(',');

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">{question.question}</h3>
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
    className={`p-3 rounded cursor-pointer text-grey ${
      isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
    }`}
    onClick={onSelect}
  >
    {optionText}
  </div>
);

export default Quiz;
