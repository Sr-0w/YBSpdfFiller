
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
    
    // Map the components using component_mapping.json
    const componentsData = {
        "Pack de base": "Aantal basispakket",
        // ... (other mappings)
        "Ouverture de garage": "Aantal Garage Door Opener"
    };
    const addedComponentsElems = document.querySelectorAll('#addedComponentsList li input[type="text"]');
    addedComponentsElems.forEach(elem => {
        const parentLi = elem.parentElement;
        const componentName = parentLi.childNodes[0].nodeValue.trim();
        const mappedName = componentsData[componentName];
        if (mappedName) {
            formData.set(mappedName, elem.value);
        }
    });

    console.log('Sending POST request');
    fetch('/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData)) // Convert formData to JSON
      })
      .then(response => {
        // ... (rest of the logic)
      });
});

// Add event listener to the checkbox
// ... (rest of the original logic)
