const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const pdfFillForm = require('pdf-fill-form');

const app = express();
app.use(bodyParser.json());

app.post('/pdf', async (req, res) => {
  try {
    // Read the readFields.txt file and parse the field names and values
    const readFields = fs.readFileSync('public/readFields.txt', 'utf8');
    const fields = readFields.split('\n').reduce((obj, line) => {
      const [name, value] = line.split('=');
      obj[name] = value;
      return obj;
    }, {});

    // Read the PDF file
    const pdfBuffer = fs.readFileSync('public/securitashomeyoul.pdf');

    // Fill in the fields in the PDF
    const filledPdf = await pdfFillForm.write(pdfBuffer, fields, { save: 'pdf' });

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
