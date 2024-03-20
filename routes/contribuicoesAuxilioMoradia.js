import express from "express";

import {
  listarContribuicoesAuxilioMoradia,
  adicionarContribuicaoAuxilioMoradia,
  atualizarContribuicaoAuxilioMoradia,
  excluirContribuicaoAuxilioMoradia,
} from "../modules/contribuicoesAuxilioMoradia/index.js";

const router = express.Router();

router.get("/:clienteAuxilioMoradiaId", listarContribuicoesAuxilioMoradia);
router.post("/", adicionarContribuicaoAuxilioMoradia);
router.put("/:id", atualizarContribuicaoAuxilioMoradia);
router.delete("/:id", excluirContribuicaoAuxilioMoradia);

export default router;
