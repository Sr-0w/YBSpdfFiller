const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const pdffiller = require('pdffiller');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the "public" directory

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Send the HTML file for our form
});

app.post('/submit', (req, res) => {
    console.log('Received POST request');

    const sourcePDF = path.join(__dirname, 'securitashomeyoul.pdf');
    const outputFilename = 'securitashomeyoul.pdffilled.pdf';
    const outputPath = path.resolve(__dirname, 'public', outputFilename);

    const data = {
        Contract_Name: req.body.Contract_Name,
        Contract_FirstName: req.body.Contract_FirstName,
        Contract_Email: req.body.Contract_Email,
        Contract_Phone_1: req.body.Contract_Phone_1,
        Installation_Name: req.body.Installation_Name,
        Contract_address: req.body.Contract_address,
        Contract_PostalCode: req.body.Contract_PostalCode,
        Contract_City: req.body.Contract_City,
        Contract_Phone_2: req.body.Contract_Phone_2,
        Installation_Email: req.body.Installation_Email
    };

    pdffiller.fillForm(sourcePDF, data, outputPath, function (err) {
        if (err) {
            console.error('Error occurred while filling the PDF form:', err);
            // Respond with an error message or appropriate status code.
            res.status(500).send('Error occurred while generating the PDF.');
        } else {
            console.log('Finished filling PDF form, sending filename');
            // Respond with the file name or download link.
            res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`);
            res.sendFile(outputPath);
        }
    });
});

app.listen(3000, () => console.log('Server started on port 3000'));
