import React, { useState, useRef } from 'react';


import './styles/VideoRecorder.css';

const VideoRecorder = ({ onStopRecording }) => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const videoRef = useRef(null);
    const [questionNumber, setQuestionNumber] = useState(1);
    const [totalQuestions] = useState(3);
    const [transcript, setTranscript] = useState('');
    const [codeOutput, setCodeOutput] = useState(''); // For compiler output
    const [code, setCode] = useState(''); // For storing code input
    const [feedback, setFeedback] = useState(''); // For displaying feedback
    const [textAnswer, setTextAnswer] = useState(''); // For storing text-based answers

    const correctAnswers = [
        "React is a JavaScript library for building user interfaces.", // Correct answer for question 1
        `function sum(a, b) {
            return a + b;
        }
        console.log(sum(2, 3));`, // Correct code for question 2
        null // No correct answer for question 3 (text-based)
    ];

    const questions = [
        {
            text: "What is React?",
            type: "text"
        },
        {
            text: "Write a simple function in JavaScript to sum two numbers.",
            type: "code"
        },
        {
            text: "Explain the concept of closures in JavaScript.",
            type: "text"
        }
    ];

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                setTranscript((prev) => prev + event.results[i][0].transcript + ' ');
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        console.log('Interim transcript:', interimTranscript);
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            videoRef.current.srcObject = stream;
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            const chunks = [];
            mediaRecorder.ondataavailable = (event) => {
                chunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                uploadVideo(blob);
                stream.getTracks().forEach((track) => track.stop());

                if (onStopRecording) {
                    onStopRecording();
                }

                recognition.stop();
            };

            mediaRecorder.start();
            setIsRecording(true);
            recognition.start();
        } catch (err) {
            console.error("Error accessing media devices:", err);
            alert("Unable to access media devices. Please check your camera and microphone settings.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const uploadVideo = async (videoBlob) => {
        const formData = new FormData();
        formData.append('video', videoBlob, 'recorded-video.webm');

        try {
            const response = await fetch('http://localhost:3001/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                console.log('Video uploaded and stored successfully');
            } else {
                console.error('Failed to upload video');
                //alert('Failed to upload video. Please try again.');
            }
        } catch (error) {
            console.error('Error uploading video:', error);
            //alert('Error uploading video. Please check your network connection.');
        }
    };

    const runCode = async () => {
        if (code.trim() === '') {
            setCodeOutput('Please enter some code to run.');
            return;
        }

        try {
            const response = await fetch('https://emkc.org/api/v2/piston/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    language: 'javascript',
                    source: code
                })
            });

            const data = await response.json();
            if (data.output) {
                setCodeOutput(data.output);
                compareCode(data.output);
            } else if (data.stderr) {
                setCodeOutput(data.stderr);
            } else {
                setCodeOutput('No output received.');
            }
        } catch (error) {
            console.error('Error running code:', error);
            setCodeOutput('Error running code.');
        }
    };

    const compareCode = (userOutput) => {
        const correctAnswer = correctAnswers[questionNumber - 1];
        if (correctAnswer) {
            const isCorrect = userOutput.trim() === correctAnswer.trim();
            setFeedback(isCorrect ? 'Correct answer!' : 'Incorrect answer..');
        } else {
            setFeedback('No correct answer to compare for this question.');
        }
    };

    const handleTextSubmit = () => {
        const correctAnswer = correctAnswers[questionNumber - 1];
        if (correctAnswer) {
            const isCorrect = textAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
            setFeedback(isCorrect ? 'Correct answer!' : 'Incorrect answer.');
        } else {
            setFeedback('No correct answer to compare for this question.');
        }
    };

    const currentQuestion = questions[questionNumber - 1];

    return (
        <div className="exam-container">
            <div className="top-bar">
                <div className="exam-title">My AI Interview Exam</div>
                <div className="question-number">
                    Question {questionNumber} of {totalQuestions}
                </div>
            </div>
            <div className="main-content">
                <div className="camera-view">
                    <video ref={videoRef} autoPlay muted className="video-preview" />
                    <div className="controls">
                        {!isRecording ? (
                            <button onClick={startRecording} className="btn btn-start">Start Recording</button>
                        ) : (
                            <button onClick={stopRecording} className="btn btn-stop">Stop Recording</button>
                        )}
                    </div>
                </div>
                <div className="question-section">
                    {currentQuestion ? (
                        <>
                            <div className="question-text">{currentQuestion.text}</div>
                            {currentQuestion.type === 'code' ? (
                                <>
                                    <textarea
                                        className="code-input"
                                        placeholder="Write your code here..."
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                    />
                                    <button onClick={runCode} className="btn btn-run-code">Run Code</button>
                                    <pre className="code-output">{codeOutput}</pre>
                                    <div className="feedback">{feedback}</div>
                                </>
                            ) : (
                                <>
                                    <textarea
                                        className="answer-input"
                                        placeholder="Type your answer here..."
                                        value={textAnswer}
                                        onChange={(e) => setTextAnswer(e.target.value)}
                                    />
                                    <button onClick={handleTextSubmit} className="btn btn-submit">Submit Answer</button>
                                    <div className="feedback">{feedback}</div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="question-text">No question available.</div>
                    )}
                </div>
            </div>
            <div className="controls-section">
                <button className="btn btn-previous" onClick={() => setQuestionNumber(Math.max(questionNumber - 1, 1))}>Previous</button>
                <button className="btn btn-next" onClick={() => setQuestionNumber(Math.min(questionNumber + 1, totalQuestions))}>Next</button>
                <button className="btn btn-finish" onClick={() => window.location.href = '/f1.html'}>Finish Now</button>
                <button className="btn btn-my-assistance" onClick={() => window.location.href = 'assistance.html'}>My Assistance</button>
            </div>
            <div className="transcription">
                <h3>Transcript:</h3>
                <p>{transcript}</p>
            </div>
        </div>
    );
};

export default VideoRecorder;
