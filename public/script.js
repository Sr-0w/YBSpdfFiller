// Define componentsMapping and fieldsMapping at a higher scope
let componentsMapping = {};
let fieldsMapping = {};

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

// Fetch fields_mapping.json
fetch('fields_mapping.json')
    .then(response => response.json())
    .then(data => {
        fieldsMapping = data;
    })
    .catch(error => {
        console.error('Error fetching fields_mapping.json:', error);
    });

document.getElementById('securitasForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    var formData = new FormData(event.target);
    let dataToSend = {};

    // Convert field names to IDs
    formData.forEach((value, key) => {
        const fieldId = fieldsMapping[key];
        if (fieldId) {
            dataToSend[fieldId] = value;
        } else {
            dataToSend[key] = value;  // For components, the key is already an ID
        }
    });

    // Handle added components
    const addedComponents = document.querySelectorAll('#addedComponentsList li');
    addedComponents.forEach(component => {
        const componentName = component.textContent.trim();
        const componentValue = component.querySelector('input').value;
        const componentId = fieldsMapping[componentName];
        if (componentId) {
            dataToSend[componentId] = componentValue;
        }
    });

    console.log('Sending POST request with data:', dataToSend);
    fetch('/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
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
    const installationFields = document.querySelectorAll('[id^="Installation_"]');
    
    // Store initial installation values (useful for when the checkbox is unchecked)
    const initialInstallationValues = {};
    installationFields.forEach(field => {
        initialInstallationValues[field.id] = field.value;
    });

    const syncFields = () => {
        installationFields.forEach(field => {
            const clientFieldId = field.id.replace('Installation_', 'Contract_');
            const clientField = document.getElementById(clientFieldId);
            if (clientField) {
                if (checkbox.checked) {
                    field.value = clientField.value;
                    field.setAttribute('disabled', '');
                } else {
                    // Restore to initial value instead of just empty string
                    field.value = initialInstallationValues[field.id];
                    field.removeAttribute('disabled');
                }
            }
        });
    };

    checkbox.addEventListener('change', syncFields);
    
    // Ensure fields are in the correct state on load
    syncFields();
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
