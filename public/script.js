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
// Map the components to their corresponding IDs in the PDF form using component_mapping.json
const componentsMapping = {
    "Pack de base": "Aantal basispakket",
    "Incendie et CO (1 dét. fumée, 1 dét. CO et 1 dét chaleur)": "Aantal paquet Fire and CO",
    // ... (add all mappings from component_mapping.json)
};

const addedComponents = document.querySelectorAll('#addedComponentsList li input');
addedComponents.forEach(input => {
    const componentName = input.previousSibling.textContent.trim();
    const fieldValue = input.value;
    if (componentsMapping[componentName]) {
        formData.set(componentsMapping[componentName], fieldValue);
    }
});

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

// Populate the components dropdown
const componentsDropdown = document.getElementById('componentsDropdown');
const componentsData = {"Pack de base": "Aantal basispakket", "Incendie et CO (1 d\u00e9t. fum\u00e9e, 1 d\u00e9t. CO et 1 d\u00e9t chaleur)": "Aantal paquet Fire and CO", "Contact Pack (5 contacts)": "Aantal paquet contacts", "Smoke Pack (2 d\u00e9t fum\u00e9e)": "Aantal paquet smoke", "CAM Pack(1 cam\u00e9ra int\u00e9rieure et 1cam\u00e9ra ext\u00e9rieure)": "Aantal Pack Camera", "D\u00e9tecteur mouvement (PIR)": "Aantal Bewegingsdetector", "Contact magn\u00e9tique": "Aantal magneetcontacten", "D\u00e9tecteur d'eau": "Abonnement deurbel", "D\u00e9tecteur mouvement avec cam\u00e9ra (PIRcam)": "Aantal fotodetectoren", "D\u00e9tecteur de fum\u00e9e": "Aantal rookmelders", "D\u00e9tecteur de CO": "Aantal CO Detectors", "D\u00e9tecteur de chaleur": "Aantal heat Detectors", "IP cam\u00e9ra int\u00e9rieure": "Aantal binnencameras", "IP cam\u00e9ra ext\u00e9rieure": "Aantal buitencameras", "Cam\u00e9ra PoE dome": "Aantal POE DOME cameras", "Cam\u00e9ra PoE bullet": "Aantal POE BULLET cameras", "Sir\u00e8ne int\u00e9rieure": "Aantal Binnensirene", "Sir\u00e8ne ext\u00e9rieure": "Aantal Buitensirene", "Prise intelligente": "Aantal smartplug", "Sonnette intelligente": "Aantal deurbel abo", "Ampoule intelligente": "Aantal slimme lampen", "Coffre \u00e0 clefs": "Aantal sleutelkoffer", "D\u00e9tecteur bris de vitre acoustic": "Aantal Glassbreaks", "SVR 1T": "Aantal svr", "Adaptateur garage": "Aantal garage door adaptors", "Senseur temp\u00e9rature": "Aantal temperator sensors", "Contact magn\u00e9tique mince": "Aantal magnetic contact slim", "Serrure intelligente": "Aantal Smart Locks", "D\u00e9tecteur bris de vitre shock": "Aantal Glass and shock", "PIR ext\u00e9rieur": "Aantal buiten PIRCAM", "Switch 4 PoE": "Aantal POE Switch", "Clavier": "Aantal keypads", "Bouton panique": "Abonnement cam", "T\u00e9l\u00e9commande": "Aantal afstandsbediening", "Bracelet panique": "Aantal panic wrist", "Carrillon": "Aantal gong", "F1 amplificateur": "Aantal F1 Range Extender", "Pack animaux (6 contacts, 1 bris de vitre et 1 cam\u00e9ra int\u00e9rieure)": "Aantal Pack Pet", "Home Alone (5 contacts et 1 cam\u00e9ra ext\u00e9rieure)": "Aantal Pack Home Alone", "Ouverture de garage": "Aantal Garage Door Opener"}; // Components data from component_mapping.json
for (const component in componentsData) {
    const option = document.createElement('option');
    option.value = component;
    option.textContent = component;
    componentsDropdown.appendChild(option);
}

// Handle the add component button
const addComponentBtn = document.getElementById('addComponentBtn');
const addedComponentsList = document.getElementById('addedComponentsList');
const componentsCount = document.getElementById('componentsCount');
addComponentBtn.addEventListener('click', function(event) {
    event.preventDefault();
    const selectedComponent = componentsDropdown.value;
    const count = parseInt(componentsCount.value, 10);
    if (selectedComponent && count) {
        for (let i = 0; i < count; i++) {
            const listItem = document.createElement('li');
            listItem.textContent = selectedComponent;
            
            // Add a space between component name and input field
            const space = document.createTextNode(' ');
            listItem.appendChild(space);
            
            // Add an input field for text entry next to the component
            const textInput = document.createElement('input');
            textInput.type = 'text';
            textInput.placeholder = 'Enter text...';
            listItem.appendChild(textInput);

            addedComponentsList.appendChild(listItem);
        }
        
        // Reset components count input
        componentsCount.value = '';
    }
});
