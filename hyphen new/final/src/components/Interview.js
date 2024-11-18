import React, { useState } from 'react';
import VideoRecorder from './VideoRecorder';
import './styles/Interview.css';

const Interview = () => {
    const questions = [
        "What are your strengths?",
        "What are your weaknesses?",
        "Why do you want this job?",
        "Where do you see yourself in five years?",
        "Why should we hire you?"
    ];

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const handleNextQuestion = () => {
        setCurrentQuestionIndex((prevIndex) => {
            if (prevIndex < questions.length - 1) {
                return prevIndex + 1;
            } else {
                return 0; // Restart the questions if at the end
            }
        });
    };

    return (
        <div className="interview-container">
            <h2 className="question-header">{questions[currentQuestionIndex]}</h2>
            {/* Ensure onStopRecording is passed correctly here */}
            <VideoRecorder onStopRecording={handleNextQuestion} />
        </div>
    );
};

export default Interview;
