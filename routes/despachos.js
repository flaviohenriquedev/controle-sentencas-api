import express from "express";

import {
  listarDespachos,
  adicionarDespacho,
  atualizarDespacho,
  excluirDespacho,
} from "../modules/despachos/index.js";

const router = express.Router();

router.get("/:processoId", listarDespachos);
router.post("/", adicionarDespacho);
router.put("/:id", atualizarDespacho);
router.delete("/:id", excluirDespacho);

export default router;
