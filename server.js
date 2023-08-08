const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { PDFDocument, PDFName } = require('pdf-lib');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

let idToNameMapping = {};

const loadFieldMapping = async (pdfPath) => {
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    fields.forEach(field => {
        idToNameMapping[field.getName()] = field.getName();
    });
};

loadFieldMapping(path.join(__dirname, 'public', 'securitashomeyoul.pdf'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/submit', async (req, res) => {
    try {
        console.log('Received POST request to /submit');

        const formData = req.body;
        console.log('Form data:', formData);

        const pdfPath = path.join(__dirname, 'public', 'securitashomeyoul.pdf');
        const date = new Date();
        const formattedDate = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
        const clientName = formData['131105'];  // You might need to change this to match field names
        const uniqueId = Date.now();
        const outputPdfPath = path.join(__dirname, 'public', `${formattedDate} - ${clientName} - ${uniqueId}.pdf`);

        console.log('Filling PDF fields...');
        const pdfBytes = fs.readFileSync(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const form = pdfDoc.getForm();

        for (let fieldName in formData) {
            const field = form.getField(fieldName);
            if (field) {
                field.setValue(formData[fieldName]);
            }
        }
        form.flatten();

        const filledPdfBytes = await pdfDoc.save();
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
