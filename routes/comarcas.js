import express from "express";

import {
  listarComarcas,
  listarComarcasAutoComplete,
  adicionarComarca,
  atualizarComarca,
  excluirComarca,
  ativarComarca,
  inativarComarca,
} from "../modules/comarcas/comarcas.js";

const router = express.Router();

router.get("/", listarComarcas);
router.get("/auto-complete", listarComarcasAutoComplete);
router.post("/", adicionarComarca);
router.put("/:id", atualizarComarca);
router.patch("/ativar/:id", ativarComarca);
router.patch("/inativar/:id", inativarComarca);
router.delete("/:id", excluirComarca);

export default router;
