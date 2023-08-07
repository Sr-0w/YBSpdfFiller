let componentsData = {};

// Load component mapping data immediately when the script runs
fetch('component_mapping.json')
    .then(response => response.json())
    .then(componentsData => {
        const mappedData = {};
        for (const [key, value] of formData.entries()) {
            const stringKey = String(key); // Convert key to string explicitly
            
            if (componentsData[stringKey]) {
                const mappedKey = componentsData[stringKey];
                if (mappedData[mappedKey]) {
                    // If the component is already present, add to its count
                    mappedData[mappedKey] += parseInt(value, 10);
                } else {
                    mappedData[mappedKey] = parseInt(value, 10);
                }
            } else {
                mappedData[stringKey] = value; // Keep non-component data as strings
            }
        }

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

    const mappedData = {};
    for (const [key, value] of formData.entries()) {
        if (componentsData[key]) {
            mappedData[componentsData[key]] = value;
        } else {
            mappedData[key] = value;
        }
    }

    // Aggregate components from the dropdown list
    const componentTally = {};
    const componentListItems = document.querySelectorAll('#addedComponentsList li');
    componentListItems.forEach(item => {
        const componentName = item.childNodes[0].nodeValue.trim();
        const componentKey = componentsData[componentName];
        if (componentTally[componentKey]) {
            componentTally[componentKey]++;
        } else {
            componentTally[componentKey] = 1;
        }
    });

    // Add the aggregated component data to the POST data
    for (const component in componentTally) {
        mappedData[component] = componentTally[component].toString(); // Convert to string here
    }

    console.log('Sending POST request');
    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mappedData)
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
