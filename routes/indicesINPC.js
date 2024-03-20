import express from "express";

import {
  listarIndicesINPC,
  adicionarIndiceINPC,
  atualizarIndiceINPC,
  excluirIndiceINPC,
} from "../modules/indicesINPC/indicesINPC.js";

const router = express.Router();

router.get("/", listarIndicesINPC);
router.post("/", adicionarIndiceINPC);
router.put("/:id", atualizarIndiceINPC);
router.delete("/:id", excluirIndiceINPC);

export default router;
