import express from "express";

import {
  listarBancos,
  adicionarBanco,
  atualizarBanco,
  excluirBanco,
} from "../modules/bancos/bancos.js";

const router = express.Router();

router.get("/", listarBancos);
router.post("/", adicionarBanco);
router.put("/:id", atualizarBanco);
router.delete("/:id", excluirBanco);

export default router;
