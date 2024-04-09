//2. Se crea la ruta por defecto y se prueba la conexion aDB
import express from "express";
const router = express.Router();

import {
  consultarTransferencias,
  crearTransferencia,
  consultarUltimasTransferencias,
  consultarSaldo,
} from "../controllers/ControllerProject.js";

router.get("/", (req, res) => res.send("Servidor Express ES6 Iniciado"));

//1. Se crea la ruta para consultar todas las transferencias
router.get("/transferencias", async (req, res) => {
  try {
    const transferencias = await consultarTransferencias();
    res.json(transferencias);
  } catch (error) {
    res.status(500).json({ error: "Error al consultar transferencias" });
  }
});

//2. Se crea la ruta para crear
router.post("/crear", async (req, res) => {
  const { descripcion, fecha, monto, cuenta_origen, cuenta_destino } = req.body;
  const consulta = await crearTransferencia(
    descripcion,
    fecha,
    monto,
    cuenta_origen,
    cuenta_destino
  );
  res.json(consulta);
});

//3. Se crea la ruta para consultar las 10 ultimas transferencias
router.get("/transferencias/:cuenta", async (req, res) => {
  try {
    const { cuenta } = req.params;
    const transferencias = await consultarUltimasTransferencias(cuenta);
    res.json(transferencias);
  } catch (error) {
    res.status(500).json({
      error: "Error al consultar las últimas transferencias de la cuenta",
    });
  }
});

//4. Se crea la ruta para consultar el saldo de una cuenta
router.get("/saldo/:cuenta", async (req, res) => {
  try {
    const { cuenta } = req.params;
    const saldo = await consultarSaldo(cuenta);
    res.json(saldo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al consultar el saldo de la cuenta" });
  }
});

router.get("*", (req, res) => res.send("ruta no encontrada"));

export default router;
