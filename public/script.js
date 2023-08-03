document.getElementById('securitasForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var formData = new FormData(event.target);

    console.log('Sending POST request');
    fetch('/submit', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(filename => {
        console.log('Received response from server, redirecting to', filename);
        window.location.href = filename;
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
