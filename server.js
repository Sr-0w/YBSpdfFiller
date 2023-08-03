const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const pdfFillForm = require('pdf-fill-form');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/submit', async (req, res) => {
  try {
    // Use the form data to fill the PDF
    const formData = req.body;

    // Read the PDF file
    const pdfBuffer = fs.readFileSync('./public/securitashomeyoul.pdf');

    // Fill in the fields in the PDF
    const filledPdf = await pdfFillForm.write(pdfBuffer, formData, { save: 'pdf' });

    // Send the filled PDF in the response
    res.contentType('application/pdf');
    res.send(filledPdf);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while processing the PDF.');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
