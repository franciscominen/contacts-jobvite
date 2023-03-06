const request = require('request');
require('dotenv').config();

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.API_KEY;
const API_SC = process.env.API_SC;
const USER_EMAIL = process.env.USER_EMAIL;

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
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        console.log(`statusCode: ${response.statusCode}`);
        console.log(body);
        resolve();
      }
    });
  });
}

async function sendDataToJobvite() {
  try {
    const contacts = await generateDataToJobvite();

    const promises = [];

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
      promises.push(sendPostRequest(options));
    }

    await Promise.all(promises);

  } catch (error) {
    console.error(error);
    throw error;
  }
}

sendDataToJobvite()
