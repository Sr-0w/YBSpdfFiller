// Define componentsMapping at a higher scope
let componentsMapping = {};

// Fetch component_mapping.json and use it in the script
fetch('component_mapping.json')
    .then(response => response.json())
    .then(data => {
        componentsMapping = data;

        // Populate the components dropdown
        const componentsDropdown = document.getElementById('componentsDropdown');
        for (const component in componentsMapping) {
            const option = document.createElement('option');
            option.value = component;
            option.textContent = component;
            componentsDropdown.appendChild(option);
        }
    })
    .catch(error => {
        console.error('Error fetching component_mapping.json:', error);
    });

document.getElementById('securitasForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    var formData = new FormData(event.target);

    // If the "Same as client data" checkbox is checked, copy the client data to the installation data
    if (document.getElementById('sameAsClientData').checked) {
        formData.set('65545', formData.get('65536')); // Installation_Name to Contract_Name
        formData.set('65546', formData.get('65537')); // Installation_FirstName to Contract_FirstName
        formData.set('65547', formData.get('65538')); // Installation_Email to Contract_Email
        formData.set('65551', formData.get('65542')); // Installation_Street to Contract_address
        formData.set('65550', formData.get('65541')); // Installation_StreetNr to Contract_StreetNr
        formData.set('65552', formData.get('65543')); // Installation_PostalCode to Contract_PostalCode
        formData.set('65553', formData.get('65544')); // Installation_City to Contract_City
        formData.set('65548', formData.get('65539')); // Installation_Phone_1 to Contract_Phone_1
        formData.set('65549', formData.get('65540')); // Installation_Phone_2 to Contract_Phone_2
    }
    

    const addedComponents = document.getElementById('addedComponentsList').children;
    for (let i = 0; i < addedComponents.length; i++) {
        const component = addedComponents[i];
        const componentName = component.textContent.trim();  // Get component name from the displayed text
        const inputValue = component.querySelector('input').value;
        const mappedId = componentsMapping[componentName];
        if (mappedId) {
            formData.set(mappedId.toString(), inputValue);
        }
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
    const installationFields = document.querySelectorAll('#131082, #131083, #131084, #131089, #131090, #131086, #131085, #131087, #131088');
    
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
