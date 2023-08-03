document.getElementById('securitasForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var formData = new FormData(event.target);

    console.log('Sending POST request');
    fetch('/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob(); // Convert the response data to a Blob
      })
      .then(blob => {
        const url = URL.createObjectURL(blob); // Create a URL for the Blob
        window.open(url, '_blank'); // Open the URL in a new tab or window
      })
      .catch(error => {
        console.error('Error:', error);
      });
});
