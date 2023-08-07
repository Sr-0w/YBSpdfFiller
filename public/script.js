document.getElementById('securitasForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var formData = new FormData(event.target);

    // If the "Same as client data" checkbox is checked, copy the client data to the installation data
    if (document.getElementById('sameAsClientData').checked) {
        formData.set('Installation_Name', formData.get('Contract_Name'));
        formData.set('Installation_FirstName', formData.get('Contract_FirstName'));
        formData.set('Installation_Email', formData.get('Contract_Email'));
        formData.set('Installation_Street', formData.get('Contract_address'));
        formData.set('Installation_StreetNr', formData.get('Contract_StreetNr'));
        formData.set('Installation_PostalCode', formData.get('Contract_PostalCode'));
        formData.set('Installation_City', formData.get('Contract_City'));
        formData.set('Installation_Phone_1', formData.get('Contract_Phone_1'));
        formData.set('Installation_Phone_2', formData.get('Contract_Phone_2'));
    }

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
        // Get the filename from the response headers
        const contentDisposition = response.headers.get('Content-Disposition');
        const filename = contentDisposition.split('=')[1];

        return response.blob().then(blob => ({ blob, filename }));
      })
      .then(({ blob, filename }) => {
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

// Add event listener to the checkbox
document.addEventListener('DOMContentLoaded', (event) => {
    const checkbox = document.getElementById('sameAsClientData');
    const installationFields = document.querySelectorAll('#Installation_Name, #Installation_FirstName, #Installation_Email, #Installation_Phone_1, #Installation_Phone_2, #Installation_StreetNr, #Installation_Street, #Installation_PostalCode, #Installation_City');
    
    checkbox.addEventListener('change', (event) => {
        if (checkbox.checked) {
            installationFields.forEach(field => {
                field.setAttribute('disabled', '');
            });
        } else {
            installationFields.forEach(field => {
                field.removeAttribute('disabled');
            });
        }
    });
});

// Function to handle the addition of components
function addComponent() {
    // Get the dropdown and the selected component
    let dropdown = document.getElementById('componentDropdown');
    let selectedComponent = dropdown.options[dropdown.selectedIndex].value;

    // Only proceed if a valid component is selected
    if (selectedComponent !== 'default') {
        // Create an input field for the selected component
        let inputDiv = document.createElement('div');
        inputDiv.classList.add('input-group', 'mb-3');

        let prependDiv = document.createElement('div');
        prependDiv.classList.add('input-group-prepend');

        let inputLabel = document.createElement('span');
        inputLabel.classList.add('input-group-text');
        inputLabel.innerText = selectedComponent;

        let quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.name = selectedComponent;
        quantityInput.placeholder = 'Quantité';
        quantityInput.classList.add('form-control');

        prependDiv.appendChild(inputLabel);
        inputDiv.appendChild(prependDiv);
        inputDiv.appendChild(quantityInput);

        // Append the input field to the form
        document.getElementById('componentsContainer').appendChild(inputDiv);

        // Reset the dropdown to default
        dropdown.selectedIndex = 0;
    }
}

// Attach the function to the "+" button
document.getElementById('addComponentBtn').addEventListener('click', addComponent);
