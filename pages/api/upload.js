import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import  pool  from './dbConfig';

const upload = multer({ dest: 'public/uploads/' });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al cargar el archivo' });
    }

    const { path } = req.file;
    const results = [];

    fs.createReadStream(path)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => {
        pool.connect((err, client, done) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Error al conectar a la base de datos');
          }

          client.query('BEGIN', (err) => {
            if (err) {
              console.error('Error al iniciar la transacción:', err);
              client.query('ROLLBACK', () => {
                return res.status(500).send('Error al iniciar la transacción');
              });
            } else {
              const insertPromises = results.map((row) => {

                // Tabla Empleado

                const {
                  id_empleado,
                  nombre,
                  edad,
                  antiguedad,
                  universidad,
                  area_manager,
                  direccion,
                  puesto,
                  pc_cat,
                  habilitado,
                  fecha_nacimiento,
                  cet,
                  idm4
                } = row;

                const empleadoQuery = 'INSERT INTO empleado(id_empleado, nombre, edad, antiguedad, universidad, area_manager, direccion, puesto, pc_cat, habilitado, fecha_nacimiento, cet, idm4) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)';
                const empleadoValues = [
                  id_empleado,
                  nombre,
                  edad,
                  antiguedad,
                  universidad,
                  area_manager,
                  direccion,
                  puesto,
                  pc_cat,
                  habilitado,
                  fecha_nacimiento,
                  cet,
                  idm4
                ];

                // Tabla Evaluacion

                const {
                  id_evaluacion,
                  año,
                  performance,
                  potencial,
                  curva
                } = row;

                const evaluacionQuery = "INSERT INTO evaluacion(id_evaluacion, año, performance, potencial, curva, id_empleado) VALUES($1, $2, $3, $4, $5, $6)";
                const evaluacionValues = [
                  id_evaluacion,
                  año,
                  performance,
                  potencial,
                  curva,
                  id_empleado
                ];

                // Tabla Resumen

                const {
                  id_resumen,
                  resumen_perfil
                } = row;

                const resumenQuery = "INSERT INTO resumen(id_resumen, resumen_perfil, id_empleado) VALUES($1, $2, $3)";
                const resumenValues = [
                  id_resumen,
                  resumen_perfil,
                  id_empleado
                ];

                // Tabla Comentario

                const {
                  id_comentario,
                  nota,
                  promedio_notas,
                  comentario
                } = row;

                const comentarioQuery = "INSERT INTO comentarios(id_comentario, nota, promedio_notas, comentario, id_empleado) VALUES($1, $2, $3, $4, $5)";
                const comentarioValues = [
                  id_comentario,
                  nota,
                  promedio_notas,
                  comentario,
                  id_empleado
                ];

                // Tabla Trayectoria

                const {
                  id_trayectoria,
                  empresa,
                  fecha_inicio,
                  fecha_fin
                } = row;

                const trayectoriaQuery = "INSERT INTO trayectoria(id_trayectoria, empresa, puesto, id_empleado, fecha_inicio, fecha_fin) VALUES($1, $2, $3, $4, $5, $6)";
                const trayectoriaValues = [
                  id_trayectoria,
                  empresa,
                  puesto,
                  id_empleado,
                  fecha_inicio,
                  fecha_fin
                ];

                const promises = [
                  client.query(empleadoQuery, empleadoValues),
                  client.query(evaluacionQuery, evaluacionValues),
                  client.query(resumenQuery, resumenValues),
                  client.query(comentarioQuery, comentarioValues),
                  client.query(trayectoriaQuery, trayectoriaValues),
                ];

                return Promise.all(promises)
                  .catch((err) => {
                    console.error('Error al insertar el registro:', err);
                    client.query('ROLLBACK');
                    throw err;
                  });
              });

              Promise.all(insertPromises)
                .then(() => {
                  client.query('COMMIT', (err) => {
                    if (err) {
                      console.error('Error al confirmar la transacción:', err);
                      client.query('ROLLBACK');
                      return res.status(500).send('Error al confirmar la transacción');
                    }

                    done();
                    return res.status(200).send('Archivo CSV cargado correctamente y registros insertados en la base de datos');
                  });
                })
                .catch(() => {
                  done();
                  return res.status(500).send('Error al insertar los registros');
                });
            }
          });
        });
      });
  });
}