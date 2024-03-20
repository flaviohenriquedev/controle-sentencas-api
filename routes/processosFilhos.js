import express from "express";

import {
  listarProcessosFilhos,
  adicionarProcessoFilho,
  atualizarProcessoFilho,
  excluirProcessoFilho,
} from "../modules/processosFilhos/processosFilhos.js";

const router = express.Router();

router.get("/:processoPrincipalId", listarProcessosFilhos);
router.post("/", adicionarProcessoFilho);
router.put("/:id", atualizarProcessoFilho);
router.delete("/:id", excluirProcessoFilho);

export default router;
