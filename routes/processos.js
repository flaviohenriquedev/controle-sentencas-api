import express from "express";

import {
  listarProcessos,
  adicionarProcesso,
  atualizarProcesso,
  excluirProcesso,
} from "../modules/processos/processos.js";

const router = express.Router();

router.get("/", listarProcessos);
router.post("/", adicionarProcesso);
router.put("/:id", atualizarProcesso);
router.delete("/:id", excluirProcesso);

export default router;
