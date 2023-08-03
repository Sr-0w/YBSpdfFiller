document.getElementById('securitasForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var formData = new FormData(event.target);

    console.log('Sending POST request');
    fetch('/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData)) // Convert formData to JSON
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob(); // Convert the response data to a Blob
      })
      .then(blob => {
        const url = URL.createObjectURL(blob); // Create a URL for the Blob

        // Create a link element
        const link = document.createElement('a');
        link.href = url;
        link.download = 'filledPdf.pdf'; // Set the download filename

        // Append the link to the body
        document.body.appendChild(link);

        // Simulate a click on the link
        link.click();

        // Remove the link from the body
        document.body.removeChild(link);
      })
      .catch(error => {
        console.error('Error:', error);
      });
});
