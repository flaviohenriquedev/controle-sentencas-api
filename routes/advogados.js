import express from "express";

import {
  listarAdvogados,
  listarAdvogadosAutoComplete,
  adicionarAdvogado,
  atualizarAdvogado,
  excluirAdvogado,
} from "../modules/advogados/advogados.js";

const router = express.Router();

router.get("/", listarAdvogados);
router.get("/auto-complete", listarAdvogadosAutoComplete);
router.post("/", adicionarAdvogado);
router.put("/:id", atualizarAdvogado);
router.delete("/:id", excluirAdvogado);

export default router;
