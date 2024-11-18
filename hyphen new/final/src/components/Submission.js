// src/components/Submission.js
import React, { useState } from 'react';
import axios from 'axios';

const Submission = () => {
  const [response, setResponse] = useState(null);

  const handleSubmit = async () => {
    try {
      const result = await axios.post('http://your-api-endpoint.com', { data: 'example' });
      setResponse(result.data);
    } catch (error) {
      console.error('Error making request:', error);
    }
  };

  return (
    <div>
      <button onClick={handleSubmit}>Submit</button>
      {response && <p>{response.message}</p>} {/* Displaying the response */}
    </div>
  );
};

export default Submission;
