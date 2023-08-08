const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/submit', async (req, res) => {
  try {
    console.log('Received POST request to /submit');

    // Use the form data to fill the PDF
    const formData = req.body;
    console.log('Form data:', formData);

    // Load the field mapping
    const fieldsMappingPath = path.join(__dirname, 'public', 'fields_mapping.json');
    const fieldsMapping = JSON.parse(fs.readFileSync(fieldsMappingPath, 'utf-8'));

    // Define the PDF file paths
    const pdfPath = path.join(__dirname, 'public', 'securitashomeyoul.pdf');
    const date = new Date();
    const formattedDate = `${date.getFullYear()}${date.getMonth()+1}${date.getDate()}`;
    const clientName = formData['131105']; // Assuming the client's name is stored in formData with ID 131105
    const uniqueId = Date.now(); // Use the current timestamp as a unique ID
    const outputPdfPath = path.join(__dirname, 'public', `${formattedDate} - ${clientName} - ${uniqueId}.pdf`);

    // Load the PDF document
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Get the form of the document
    const form = pdfDoc.getForm();

    // Fill in the fields in the PDF using the field IDs
    console.log('Filling PDF');
    Object.keys(formData).forEach(fieldID => {
      const formField = form.getField(fieldID);
      if (formField) {
        formField.setText(formData[fieldID]);
      }
    });

    // Save the PDF document
    const filledPdfBytes = await pdfDoc.save();

    // Write the filled PDF to a file
    fs.writeFileSync(outputPdfPath, filledPdfBytes);

    // Send the filled PDF in the response
    console.log('Sending response');
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
