document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const resultDiv = document.querySelector('#prediction-result');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        resultDiv.textContent = 'Processing...';
        resultDiv.style.color = '#000';

        const data = {
            crop_type: document.querySelector('select[name="crop_type"]').value,
            soil_type: document.querySelector('select[name="soil_type"]').value,
            rainfall: parseFloat(document.querySelector('input[name="rainfall"]').value),
            temperature: parseFloat(document.querySelector('input[name="temperature"]').value)
        };

        console.log('Sending data:', data); // Debug log

        try {
            const response = await fetch('http://localhost:5001/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            console.log('Response status:', response.status); // Debug log

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Response data:', result); // Debug log

            resultDiv.textContent = `Predicted Yield: ${result.yield_prediction.toFixed(2)} kg/hectare`;
            resultDiv.style.color = '#28a745';
        } catch (error) {
            console.error('Error details:', error); // Debug log
            resultDiv.textContent = `Error: ${error.message}`;
            resultDiv.style.color = '#dc3545';
        }
    });
});