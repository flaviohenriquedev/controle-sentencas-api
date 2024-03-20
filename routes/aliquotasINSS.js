import express from "express";

import {
  listarAliquotasINSS,
  adicionarAliquotaINSS,
  atualizarAliquotaINSS,
  excluirAliquotaINSS,
} from "../modules/aliquotasINSS/aliquotasINSS.js";

const router = express.Router();

router.get("/", listarAliquotasINSS);
router.post("/", adicionarAliquotaINSS);
router.put("/:id", atualizarAliquotaINSS);
router.delete("/:id", excluirAliquotaINSS);

export default router;
