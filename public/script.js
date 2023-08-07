let componentsData = {};

// Fetch and populate the dropdown upon page load
document.addEventListener('DOMContentLoaded', function() {
    fetch('component_mapping.json')
        .then(response => response.json())
        .then(data => {
            componentsData = data;

            // Populate the dropdown
            const componentsDropdown = document.getElementById('componentsDropdown');
            for (const component in componentsData) {
                const option = document.createElement('option');
                option.value = component.toString();  // Convert component name to string
                option.textContent = component.toString();  // Convert component name to string
                componentsDropdown.appendChild(option);
            }
        });
});

document.getElementById('securitasForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var formData = new FormData(event.target);

    const formDataObject = Object.fromEntries(formData);

    // Convert component names using the mapping
    for (let key in formDataObject) {
        if (componentsData[key]) {
            formDataObject[componentsData[key]] = formDataObject[key];
            delete formDataObject[key];
        }
    }

    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataObject)  // Send the mapped data
    })
        })
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const contentDisposition = response.headers.get('Content-Disposition');
        const filename = contentDisposition.split('=')[1];
        return response.blob().then(blob => ({ blob, filename }));
    })
    .then(({ blob, filename }) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
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
    const selectedComponent = document.getElementById('componentsDropdown').value;
    const count = parseInt(componentsCount.value, 10);
    const mappedName = componentsData[selectedComponent];

    if (selectedComponent && count) {
        for (let i = 0; i < count; i++) {
            const listItem = document.createElement('li');
            listItem.textContent = selectedComponent;

            // Check if a hidden input for this component already exists
            let hiddenInput = document.querySelector(`input[name="${mappedName}"]`);
            if (hiddenInput) {
                // If it exists, increment its value
                hiddenInput.value = (parseInt(hiddenInput.value, 10) + 1).toString();
            } else {
                // Otherwise, create a new hidden input for this component
                hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = mappedName;
                hiddenInput.value = '1';
                document.getElementById('securitasForm').appendChild(hiddenInput);
            }

            addedComponentsList.appendChild(listItem);
        }
        componentsCount.value = '';
    }
});
