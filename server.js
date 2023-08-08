const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const pdfFillForm = require('pdf-fill-form');
const { PDFDocument } = require('pdf-lib');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

let idToNameMapping = {};

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

        const formData = req.body;
        console.log('Form data:', formData);

        const pdfPath = path.join(__dirname, 'public', 'securitashomeyoul.pdf');
        const date = new Date();
        const formattedDate = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
        const clientName = formData['131105'];
        const uniqueId = Date.now();
        const outputPdfPath = path.join(__dirname, 'public', `${formattedDate} - ${clientName} - ${uniqueId}.pdf`);

        console.log('Filling PDF fields...');
        let fillData = {};
        for (let id in formData) {
            const fieldName = idToNameMapping[id];
            fillData[fieldName] = formData[id];
        }

        let output = await pdfFillForm.write(pdfPath, fillData, { "save": "pdf" });

        // Load the filled PDF with pdf-lib
        const pdfDoc = await PDFDocument.load(output);

        // Add JavaScript to trigger calculations
        pdfDoc.addJavaScript('calculateScript', 'this.calculateNow();');

        const pdfBytesWithScript = await pdfDoc.save();

        fs.writeFileSync(outputPdfPath, pdfBytesWithScript);
        
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
