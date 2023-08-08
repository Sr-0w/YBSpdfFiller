const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const pdfFillForm = require('pdf-fill-form');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

let idToNameMapping = {};

// Load the mapping between id and name when the server starts
pdfFillForm.read(path.join(__dirname, 'public', 'securitashomeyoul.pdf'))
    .then(fields => {
        fields.forEach(field => {
            idToNameMapping[field.id] = field.name;
        });
    })
    .catch(err => {
        console.error(err);
    });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/submit', async (req, res) => {
  try {
    console.log('Received POST request to /submit');

    // Use the form data to fill the PDF
    const formData = req.body;
    console.log('Form data:', formData);

    // Define the PDF file paths
    const pdfPath = path.join(__dirname, 'public', 'securitashomeyoul.pdf');
    const date = new Date();
    const formattedDate = `${date.getFullYear()}${date.getMonth()+1}${date.getDate()}`;
    const clientName = formData['131105']; 
    const uniqueId = Date.now(); 
    const outputPdfPath = path.join(__dirname, 'public', `${formattedDate} - ${clientName} - ${uniqueId}.pdf`);

    console.log('Loading PDF document from:', pdfPath);
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Get the form of the document
    const form = pdfDoc.getForm();

    console.log('Filling PDF fields...');
    Object.keys(formData).forEach(id => {
        const fieldName = idToNameMapping[id];
        const fieldValue = formData[id];
        const field = form.getField(fieldName);
        if (field) {
            field.setText(fieldValue);
        }
    });

    console.log('Saving modified PDF...');
    const filledPdfBytes = await pdfDoc.save();

    console.log('Writing filled PDF to:', outputPdfPath);
    fs.writeFileSync(outputPdfPath, filledPdfBytes);

    console.log('Sending response with filled PDF');
    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${path.basename(outputPdfPath)}`);
    res.sendFile(outputPdfPath);
  } catch (err) {
    console.error('An error occurred:', err);
    res.status(500).send('An error occurred while processing the PDF.');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
