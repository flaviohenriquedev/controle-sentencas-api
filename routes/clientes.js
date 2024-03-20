import express from "express";

import {
  listarClientes,
  adicionarCliente,
  atualizarCliente,
  excluirCliente,
  listarClientesAutoComplete,
} from "../modules/clientes/clientes.js";

const router = express.Router();

router.get("/", listarClientes);
router.get("/auto-complete", listarClientesAutoComplete);
router.post("/", adicionarCliente);
router.put("/:id", atualizarCliente);
router.delete("/:id", excluirCliente);

export default router;
