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
                option.value = component;
                option.textContent = component;
                componentsDropdown.appendChild(option);
            }
        });
});

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

    fetch('component_mapping.json')
        .then(response => response.json())
        .then(componentsData => {

            // Aggregate components from the dropdown list and set them in formData
            const componentListItems = document.querySelectorAll('#addedComponentsList li');
            componentListItems.forEach(item => {
                const componentName = item.childNodes[0].nodeValue.trim();
                const componentKey = componentsData[componentName];
                if (formData.has(componentKey)) {
                    formData.set(componentKey, (parseInt(formData.get(componentKey), 10) + 1).toString());
                } else {
                    formData.set(componentKey, '1');
                }
            });

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
            
            // Create a hidden input field for each component and append it to the form
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = mappedName;
            hiddenInput.value = "1"; // The value is '1' because each input represents one component
            document.getElementById('securitasForm').appendChild(hiddenInput);

            // Add a space and visual representation for the component in the list
            const space = document.createTextNode(' ');
            listItem.appendChild(space);
            addedComponentsList.appendChild(listItem);
        }
        componentsCount.value = '';
    }
});
