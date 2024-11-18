import React, { useState } from 'react';

function Question({ questionText, correctAnswer }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      setFeedback('Correct!');
    } else {
      setFeedback('Incorrect. Please try again.');
    }
  };

  return (
    <div>
      <h2>{questionText}</h2>
      <input
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
      <p>{feedback}</p>
    </div>
  );
}

export default Question;
