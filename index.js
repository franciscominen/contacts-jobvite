const request = require('request');
const fs = require('fs');
const path = require('path');

const API_KEY = 'gigait_candidate_api_key';
const API_SC = '5b034ef7a56281c735e254e0359f5c22';
const USER_EMAIL = 'samuel.martinez@grupo-giga.com';

let DATA_HIRING_ROOM = [];
let DATA_TO_JOBVITE = [];
const filePath = path.join(__dirname, 'utils', 'hiring-room.json');

function generateDataToJobvite() {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                reject(err)
                return;
            }

            DATA_HIRING_ROOM = JSON.parse(data);

            DATA_HIRING_ROOM.map(data => {

                const experienciasLaborales = data.experienciasLaborales.map(exp => {
                    return exp.empresa;
                })
                const puesto = data.experienciasLaborales.map(exp => {
                    return exp.puesto;
                })
                const descripcion = data.experienciasLaborales.map(exp => {
                    return exp.descripcion;
                })

                DATA_TO_JOBVITE.push(
                    {
                        mergeDuplicates: true,
                        contactStatus: 'New',
                        firstName: data.nombre,
                        middleName: '',
                        lastName: data.apellido,
                        company: experienciasLaborales[0],
                        jobTitle: puesto[0],
                        emailStatus: '',
                        resume: descripcion[0],
                        coverLetter: '',
                        sourceType: data.fuente,
                        sourceName: data.fuente,
                        primaryEmail: data.email,
                        emails: [],
                        primaryPhone: data.telefonoCelular,
                        homePhone: [
                            data.telefonoFijo
                        ],
                        workPhone: [
                            data.telefonoCelular
                        ],
                        cellPhone: [
                            data.telefonoCelular
                        ],
                        urls: '',
                        facebook: data.detail.postulant.redesSociales.facebook,
                        likedin: data.detail.postulant.redesSociales.likedin,
                        twitter: data.detail.postulant.redesSociales.twitter,
                        assignedTo: '',
                        gender: data.detail.postulant.genero,
                        race: '',
                        address: data.direccion.direccion,
                        city: data.direccion.ciudad,
                        state: data.direccion.provincia,
                        zip: data.direccion.ciudadId,
                        countryName: data.direccion.pais,
                        customField: [],
                        tags: data.detail.postulant.conocimientos,
                        notes: [
                            { fechaPostulacion: data.fechaPostulacion },
                            { vacanteNombre: data.vacanteNombre },
                            { DNI: data.dni },
                            { salarioPretendido: data.salarioPretendido },
                            { experiencia: data.detail.postulant.experienciasLaborales },
                            { estudios: data.detail.postulant.estudios },
                            { referencias: data.detail.postulant.referencias },
                        ]
                    }
                )
            });

            resolve(DATA_TO_JOBVITE);
        });
    });
}

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
    try {
        const contacts = await generateDataToJobvite();
        // const contacts = JSON.parse(data);
        // console.log('contacts', contacts[0])

        for (let i = 0; i < 3; i++) { // modify this line to specify the number of contacts to send
            const options = {
                method: 'POST',
                url: `https://api.jvistg2.com/api/v2/contact?api=${API_KEY}&sc=${API_SC}&userEmail=${USER_EMAIL}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: contacts[i],
                json: true
            };
            sendPostRequest(options);
        }

    } catch (error) {
        console.error(error);
    }
}

sendDataToJobvite()
