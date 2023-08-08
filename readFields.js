const pdfFillForm = require('pdf-fill-form');
const fs = require('fs');

let fieldMapping = {};

pdfFillForm.read('securitashomeyoul.pdf')
    .then(fields => {
        fields.forEach(field => {
            fieldMapping[field.id] = field.name;
        });
        fs.writeFileSync('fieldMapping.json', JSON.stringify(fieldMapping, null, 2));
    })
    .catch(err => {
        console.error(err);
    });
