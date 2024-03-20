import express from "express";

import {
  listarClientesAuxilioMoradia,
  adicionarClienteAuxilioMoradia,
  atualizarClienteAuxilioMoradia,
  excluirClienteAuxilioMoradia,
} from "../modules/clientesAuxilioMoradia/clientesAuxilioMoradia.js";

const router = express.Router();

router.get("/", listarClientesAuxilioMoradia);
router.post("/", adicionarClienteAuxilioMoradia);
router.put("/:id", atualizarClienteAuxilioMoradia);
router.delete("/:id", excluirClienteAuxilioMoradia);

export default router;
