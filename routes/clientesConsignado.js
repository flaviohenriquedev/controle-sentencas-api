import express from "express";

import {
  listarClientesConsignado,
  adicionarClienteConsignado,
  atualizarClienteConsignado,
  excluirClienteConsignado,
} from "../modules/clientesConsignado/clientesConsignado.js";

const router = express.Router();

router.get("/", listarClientesConsignado);
router.post("/", adicionarClienteConsignado);
router.put("/:id", atualizarClienteConsignado);
router.delete("/:id", excluirClienteConsignado);

export default router;
