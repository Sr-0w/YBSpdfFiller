document.getElementById('secur<option value="Pack de base">Pack de base</option><option value="Clavier">Clavier</option><option value="Bouton panique">Bouton panique</option><option value="Télécommande">Télécommande</option><option value="Bracelet panique">Bracelet panique</option><option value="Contact magnétique">Contact magnétique</option><option value="Détecteur mouvement avec caméra (PIRcam)">Détecteur mouvement avec caméra (PIRcam)</option><option value="Détecteur mouvement (PIR)">Détecteur mouvement (PIR)</option><option value="PIR extérieur">PIR extérieur</option><option value="Détecteur bris de vitre acoustic">Détecteur bris de vitre acoustic</option><option value="Détecteur bris de vitre shock">Détecteur bris de vitre shock</option><option value="Contact magnétique mince">Contact magnétique mince</option><option value="Adaptateur garage">Adaptateur garage</option><option value="Prise intelligente">Prise intelligente</option><option value="Sonnette intelligente">Sonnette intelligente</option><option value="Ampoule intelligente">Ampoule intelligente</option><option value="Serrure intelligente">Serrure intelligente</option><option value="Senseur température">Senseur température</option><option value="Incendie et CO">Incendie et CO</option><option value="Pack animaux">Pack animaux</option><option value="Home Alone">Home Alone</option><option value="Détecteur de fumée">Détecteur de fumée</option><option value="Détecteur d'eau">Détecteur d'eau</option><option value="Détecteur de CO">Détecteur de CO</option><option value="Détecteur de chaleur">Détecteur de chaleur</option><option value="Sirène intérieure">Sirène intérieure</option><option value="Sirène extérieure">Sirène extérieure</option><option value="IP caméra intérieure">IP caméra intérieure</option><option value="IP caméra extérieure">IP caméra extérieure</option><option value="Caméra PoE dome">Caméra PoE dome</option><option value="Caméra PoE bullet">Caméra PoE bullet</option><option value="SVR 1T">SVR 1T</option><option value="Switch 4 PoE">Switch 4 PoE</option><option value="Coffre à clefs">Coffre à clefs</option><option value="Carrillon">Carrillon</option><option value="F1 amplificateur">F1 amplificateur</option><option value="Ouverture de garage">Ouverture de garage</option><option value="CAM Pack">CAM Pack</option><option value="Smoke Pack">Smoke Pack</option><option value="Contact Pack">Contact Pack</option>itasForm').addEventListener('submit', function(event) {
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

document.getElementById('addComponentBtn').addEventListener('click', function() {
    let selectedComponent = document.getElementById('componentSelector').value;
    let componentList = document.getElementById('componentList');
    let newComponent = document.createElement('li');
    newComponent.innerText = selectedComponent;
    componentList.appendChild(newComponent);
    // Add the selected component to an array or list to be sent to the server on form submission
});
