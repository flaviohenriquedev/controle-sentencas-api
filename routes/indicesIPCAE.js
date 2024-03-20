import express from "express";

import {
  listarIndicesIPCAE,
  adicionarIndiceIPCAE,
  atualizarIndiceIPCAE,
  excluirIndiceIPCAE,
} from "../modules/indicesIPCAE/indicesIPCAE.js";

const router = express.Router();

router.get("/", listarIndicesIPCAE);
router.post("/", adicionarIndiceIPCAE);
router.put("/:id", atualizarIndiceIPCAE);
router.delete("/:id", excluirIndiceIPCAE);

export default router;
