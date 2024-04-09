//4.
import pool from "../config/db.js";

const consultarTransferencias = async () => {
  try {
    const consulta = "SELECT * FROM transferencias";
    const respuesta = await pool.query(consulta);
    console.log("Transferencias: ", respuesta.rows);
    return respuesta.rows;
  } catch (error) {
    console.error("Error al consultar transferencias:", error.message);
    throw error; //Relanzamos el error para manejarlo en un nivel superior
  }
};

const crearTransferencia = async (
  descripcion,
  fecha,
  monto,
  cuenta_origen,
  cuenta_destino
) => {
  let client;

  try {
    client = await pool.connect();

    await client.query("BEGIN");
    const consulta =
      "INSERT INTO transferencias (descripcion, fecha, monto, cuenta_origen, cuenta_destino) VALUES ($1, $2, $3 , $4, $5) RETURNING *"; // Agrega RETURNING * para obtener el registro insertado
    const values = [descripcion, fecha, monto, cuenta_origen, cuenta_destino];
    const respuesta = await client.query(consulta, values);

    await client.query("COMMIT");
    const ultimoRegistro = respuesta.rows[0]; //se obtiene el último registro insertado
    console.log("Transferencia creada con éxito:", ultimoRegistro);
    return ultimoRegistro; //Retorna el último registro insertado
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK");
      console.error("Error al realizar la transferencia:", error.message);
    }
    throw error; //Lanza el error para que sea manejado por el controlador
  } finally {
    if (client) {
      client.release();
    }
  }
};

const consultarUltimasTransferencias = async (cuenta) => {
  try {
    const consulta = `
      SELECT *
      FROM transferencias
      WHERE cuenta_origen = $1 OR cuenta_destino = $1
      ORDER BY fecha DESC
      LIMIT 10;
    `;
    const values = [cuenta];
    const respuesta = await pool.query(consulta, values);
    return respuesta.rows;
  } catch (error) {
    console.error("Error al consultar las transferencias:", error);
    throw error;
  }
};

const consultarSaldo = async (cuenta) => {
  try {
    const consulta = `
      SELECT saldo
      FROM cuentas
      WHERE id = $1;
    `;
    const values = [cuenta];
    const respuesta = await pool.query(consulta, values);
    console.log("Saldo consultado:", respuesta.rows[0]);
    return respuesta.rows[0];
  } catch (error) {
    console.error("Error al consultar el saldo:", error.message);
    throw error;
  }
};

export {
  consultarTransferencias,
  crearTransferencia,
  consultarUltimasTransferencias,
  consultarSaldo,
};
