document.getElementById('runBtn').addEventListener('click', function() {
    const code = document.getElementById('code').value;
    const languageId = document.getElementById('language').value;

    if (code.trim() === '') {
        alert('Please write some code to execute.');
        return;
    }

    const requestData = {
        source_code: code,
        language_id: languageId,
        stdin: '',
        expected_output: 'reversed_string' // Example expected output for demonstration
    };

    const runBtn = document.getElementById('runBtn');
    runBtn.disabled = true;
    runBtn.textContent = 'Running...';

    fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'x-rapidapi-key': '748c34dd45msh645d06909437d47p131bb0jsn01e8908b731d' // Replace with your RapidAPI key
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        const outputElement = document.getElementById('output');
        const feedbackElement = document.getElementById('feedback');
        
        if (data.stdout) {
            outputElement.textContent = data.stdout;
            // Assuming we know the correct answer for validation
            if (data.stdout.trim() === 'expected_output') {
                feedbackElement.textContent = 'Accepted';
                feedbackElement.style.color = 'green';
            } else {
                feedbackElement.textContent = 'Wrong Answer';
                feedbackElement.style.color = 'red';
            }
        } else if (data.stderr) {
            outputElement.textContent = `Error: ${data.stderr}`;
            feedbackElement.textContent = 'Error occurred while running the code.';
            feedbackElement.style.color = 'red';
        } else {
            outputElement.textContent = 'Something went wrong!';
            feedbackElement.textContent = 'Error occurred while running the code.';
            feedbackElement.style.color = 'red';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('feedback').textContent = 'An error occurred.';
    })
    .finally(() => {
        runBtn.disabled = false;
        runBtn.textContent = 'Run Code';
    });
});
