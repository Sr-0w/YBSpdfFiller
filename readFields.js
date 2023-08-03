const pdfFillForm = require('pdf-fill-form');
const fs = require('fs');

pdfFillForm.read('securitashomeyoul.pdf')
    .then(fields => {
        console.log(fields);
    })
    .catch(err => {
        console.error(err);
    });