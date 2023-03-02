let DATA_HIRING_ROOM = [];
let DATA_TO_JOBVITE = [];

/* Esta funcion realiza un map para adaptar la informacion de contactos
de Hiring Room a Jobvite, para luego poder enviar ese array con la info
utlizando el metodo POST a la api de Jobvite */

async function generateDataToJobvite() {
    const res = await fetch('./utils/hiring-room.json');
    DATA_HIRING_ROOM = await res.json();

    // console.log('Hiring Room: ', DATA_HIRING_ROOM);

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

        return DATA_TO_JOBVITE.push(
            {
                mergeDuplicates: true,
                contactStatus: data.etapa,
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
                emails: [
                    data.email
                ],
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
                customField: [
                    {
                        fieldCode: 'Salario Pretendido',
                        value: data.salarioPretendido
                    },
                    {
                        fieldCode: 'Fecha de postulacion',
                        value: data.fechaPostulacion
                    },
                    {
                        fieldCode: 'DNI',
                        value: data.dni
                    },
                    {
                        fieldCode: 'Nombre de vacante',
                        value: data.vacanteNombre
                    }
                ],
                tags: data.detail.postulant.conocimientos,
                notes: [
                    data.detail.postulant.experienciasLaborales,
                    data.detail.postulant.estudios,
                    data.detail.postulant.referencias
                ]
            }
        )
    })

    console.log('Jobvite Contact POST', DATA_TO_JOBVITE)
}

generateDataToJobvite()
