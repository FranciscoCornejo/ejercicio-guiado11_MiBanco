//3. se configura la base de datos usando dotenv
import pkg from "pg";
const { Pool } = pkg;

//nueva forma de importar dotenv
process.loadEnvFile();

//desestructuramos las variables de entorno
const { DB_USER, DB_PASSWORD, DB_HOST, DB_DATABASE } = process.env;

//creamos el objeto de configuracion
const config = {
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  database: DB_DATABASE,
  allowExitOnIdle: true, //con esta instruccion luego de realizar la consulta cancelamos la coneccion
};

//creamos el pool
const pool = new Pool(config);

//probamos la coneccion
const getDate = async () => {
  //getDate es una promesa que podria tener cualquier nombre
  try {
    const result = await pool.query("SELECT NOW()");
    //const result2 = await pool.query("SELECT * FROM users");
    console.log(result.rows[0].now);
    //console.log(result2.rows);
    return result.rows;
  } catch (error) {
    console.error("Error al conectarse a la base de datos:", error);
  }
};
getDate();

export default pool;
