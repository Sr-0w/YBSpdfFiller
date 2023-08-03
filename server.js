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

    // Define the PDF file paths
    const pdfPath = path.join(__dirname, 'public', 'securitashomeyoul.pdf');

    // Get the current date and time
    const date = new Date();

    // Format the date as YYYYMMDD
    const formattedDate = `${date.getFullYear()}${('0' + (date.getMonth() + 1)).slice(-2)}${('0' + date.getDate()).slice(-2)}`;

    // Get the client's name from the form data
    const clientName = formData.Contract_Name;

    // Create a unique ID using the current timestamp
    const uniqueId = Date.now();

    // Create the filename
    const filename = `${formattedDate} - ${clientName} - ${uniqueId}.pdf`;

    const outputPdfPath = path.join(__dirname, 'public', filename);

    // Load the PDF document
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Get the form of the document
    const form = pdfDoc.getForm();

    // Fill in the fields in the PDF
    console.log('Filling PDF');
    Object.keys(formData).forEach(field => {
      const formField = form.getField(field);
      if (formField) {
        formField.setText(formData[field]);
      }
    });

    // Save the PDF document
    const filledPdfBytes = await pdfDoc.save();

    // Write the filled PDF to a file
    fs.writeFileSync(outputPdfPath, filledPdfBytes);

    // Send the filled PDF in the response
    console.log('Sending response');
    res.contentType('application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`); // Include the filename in the response headers
    res.sendFile(outputPdfPath);
  } catch (err) {
    console.error('An error occurred:', err);
    res.status(500).send('An error occurred while processing the PDF.');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
