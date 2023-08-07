const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');


const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/submit', async (req, res) => {
    try {
        // Extract form data
        const formData = req.body;
        
        // Load the component mapping
        const componentMapping = JSON.parse(fs.readFileSync('component_mapping.json', 'utf-8'));
        
        // Load the PDF template
        const pdfBytes = fs.readFileSync('template.pdf');
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const form = pdfDoc.getForm();
        
        // Update client and installation details based on existing logic
        // ... (this will be based on the existing logic in the server.js content)
        
        // Update component fields based on componentMapping
        for (const component in componentMapping) {
            if (formData[component]) {
                const pdfFieldName = componentMapping[component];
                const field = form.getTextField(pdfFieldName);
                field.setText(formData[component].toString());
            }
        }
        
        // Serialize the PDF to bytes and send it as a response
        const pdfModifiedBytes = await pdfDoc.save();
        res.contentType("application/pdf");
        res.send(pdfModifiedBytes);
        
    } catch (error) {
        console.error("Error updating the PDF:", error);
        res.status(500).send("Internal Server Error");
    }
});

