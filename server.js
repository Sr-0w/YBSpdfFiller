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
    const date = new Date();
    const formattedDate = `${date.getFullYear()}${date.getMonth()+1}${date.getDate()}`;
    const clientName = formData.Contract_Name; // Assuming the client's name is stored in formData.Contract_Name
    const uniqueId = Date.now(); // Use the current timestamp as a unique ID
    const outputPdfPath = path.join(__dirname, 'public', `${formattedDate} - ${clientName} - ${uniqueId}.pdf`);

    // Load the PDF document
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Get the form of the document
    const form = pdfDoc.getForm();

    // Fill in the fields in the PDF
// Handle the new dropdown and input fields
formData.elements.forEach(element => {{
  const componentKey = component_mapping[element.type];
  if (componentKey) {{
    const formField = form.getField(componentKey);
    if (formField) {{
      // Increment the current value by 1 (or by the provided value if it's an input field)
      const currentValue = parseInt(formField.getText()) || 0;
      formField.setText(String(currentValue + 1));
    }}
  }}
}});

    console.log('Filling PDF');
    Object.keys(formData).forEach(field => {
      // Ignore the "sameAsClientData" field
      if (field !== 'sameAsClientData') {
        const formField = form.getField(field);
        if (formField) {
          formField.setText(formData[field]);
        }
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
// hello git ?