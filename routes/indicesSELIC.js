import express from "express";

import {
  listarIndicesSELIC,
  adicionarIndiceSELIC,
  atualizarIndiceSELIC,
  excluirIndiceSELIC,
} from "../modules/indicesSELIC/indicesSELIC.js";

const router = express.Router();

router.get("/", listarIndicesSELIC);
router.post("/", adicionarIndiceSELIC);
router.put("/:id", atualizarIndiceSELIC);
router.delete("/:id", excluirIndiceSELIC);

export default router;
