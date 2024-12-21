import inquirer from 'inquirer';
import qr from 'qr-image';
import fs from 'fs';
import http from 'http';

inquirer.prompt([
    {
        type: 'input',
        name: 'url',
        message: 'Enter the URL to generate a QR code:',
        validate: (input) => input ? true : 'URL cannot be empty!',
    }
]).then((answers) => {
    const url = answers.url;

    const qrCode = qr.image(url, { type: 'png' });
    const qrImagePath = 'qrcode.png';

    qrCode.pipe(fs.createWriteStream(qrImagePath)).on('finish', () => {
        console.log(`QR Code generated`);

        const server = http.createServer((req, res) => {
            if (req.url === '/qrcode') {
                fs.createReadStream(qrImagePath).pipe(res);
            } else {
                res.end('<h1>QR Code Server</h1><p>Go to <a href="/qrcode">/qrcode</a> to view the QR code.</p>');
            }
        });

        server.listen(8080, () => {
            console.log(`Server running`);
        });
    });
}).catch((error) => {
    console.error('Error:', error);
});