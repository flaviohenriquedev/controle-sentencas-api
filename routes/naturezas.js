import express from "express";

import {
  listarNaturezas,
  adicionarNatureza,
  atualizarNatureza,
  excluirNatureza,
  listarNaturezasAutoComplete,
  ativarNatureza,
  inativarNatureza,
} from "../modules/naturezas/naturezas.js";

const router = express.Router();

router.get("/", listarNaturezas);
router.get("/auto-complete", listarNaturezasAutoComplete);
router.post("/", adicionarNatureza);
router.put("/:id", atualizarNatureza);
router.patch("/ativar/:id", ativarNatureza);
router.patch("/inativar/:id", inativarNatureza);
router.delete("/:id", excluirNatureza);

export default router;
