import express from "express";

import {
  listarAndamentos,
  listarAndamentosAutoComplete,
  adicionarAndamento,
  atualizarAndamento,
  excluirAndamento,
  ativarAndamento,
  inativarAndamento,
} from "../modules/andamentos/andamentos.js";

const router = express.Router();

router.get("/", listarAndamentos);
router.get("/auto-complete", listarAndamentosAutoComplete);
router.post("/", adicionarAndamento);
router.put("/:id", atualizarAndamento);
router.patch("/ativar/:id", ativarAndamento);
router.patch("/inativar/:id", inativarAndamento);
router.delete("/:id", excluirAndamento);

export default router;
