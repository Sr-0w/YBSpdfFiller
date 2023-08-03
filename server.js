const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const pdfFillForm = require('pdf-fill-form');
const path = require('path'); // Add this line

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

    // Read the PDF file
    console.log('Reading PDF file');
    const pdfPath = path.join(__dirname, 'public', 'securitashomeyoul.pdf'); // Add this line
    const pdfBuffer = fs.readFileSync(pdfPath); // Modify this line

    // Fill in the fields in the PDF
    console.log('Filling PDF');
    const filledPdf = await pdfFillForm.write(pdfBuffer, formData, { save: 'pdf' });

    // Send the filled PDF in the response
    console.log('Sending response');
    res.contentType('application/pdf');
    res.send(filledPdf);
  } catch (err) {
    console.error('An error occurred:', err);
    res.status(500).send('An error occurred while processing the PDF.');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
