document.getElementById('securitasForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var formData = new FormData(event.target);

    // Get the client's name from the form data
    var clientName = formData.get('Contract_Name');

    // Get the current date and time
    var date = new Date();

    // Format the date as YYYYMMDD
    var formattedDate = date.getFullYear() + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2);

    // Create a unique ID using the current timestamp
    var uniqueId = Date.now();

    // Create the filename
    var filename = `${formattedDate} - ${clientName} - ${uniqueId}.pdf`;

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
        link.download = filename; // Set the download filename

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

