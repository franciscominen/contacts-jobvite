const request = require('request');
const { generateDataToJobvite } = require('./index.js');

function sendPostRequest(options) {
    request(options, (error, response, body) => {
        if (error) {
            console.error(error);
            return;
        }
        console.log(`statusCode: ${response.statusCode}`);
        console.log(body);
    });
}

async function sendDataToJobvite() {
    const data = await generateDataToJobvite();
    const contacts = JSON.parse(data);
    const batchSize = 500;

    try {
        for (let i = 0; i < contacts.length; i += batchSize) {
            const batch = contacts.slice(i, i + batchSize);
            const options = {
                method: 'POST',
                url: 'https://example.com/api/contacts',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: batch,
                json: true
            };
            sendPostRequest(options);
        }

        console.log(respuesta.data);

    } catch (error) {
        console.error(error);
    }
}
