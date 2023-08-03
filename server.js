const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const HummusRecipe = require('hummus-recipe'); // Add this line

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

    // Define the PDF file paths
    const pdfPath = path.join(__dirname, 'public', 'securitashomeyoul.pdf');
    const outputPdfPath = path.join(__dirname, 'public', 'filledPdf.pdf');

    // Create a new HummusRecipe instance
    const pdfDoc = new HummusRecipe(pdfPath, outputPdfPath);

    // Fill in the fields in the PDF
    console.log('Filling PDF');
    Object.keys(formData).forEach(field => {
      pdfDoc
        .editPage(1) // Edit the first page
        .text(formData[field], 'form.' + field) // Fill the form field
        .endPage();
    });

    // End the PDF editing
    pdfDoc.endPDF();

    // Send the filled PDF in the response
    console.log('Sending response');
    res.contentType('application/pdf');
    res.sendFile(outputPdfPath);
  } catch (err) {
    console.error('An error occurred:', err);
    res.status(500).send('An error occurred while processing the PDF.');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
