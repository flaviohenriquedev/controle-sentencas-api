import express from "express";

import {
  listarVerbasConsignado,
  adicionarVerbaConsignado,
  atualizarVerbaConsignado,
  excluirVerbaConsignado,
} from "../modules/verbasConsignado/index.js";

const router = express.Router();

router.get("/:clienteConsignadoId", listarVerbasConsignado);
router.post("/", adicionarVerbaConsignado);
router.put("/:id", atualizarVerbaConsignado);
router.delete("/:id", excluirVerbaConsignado);

export default router;
