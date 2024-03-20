import express from "express";

import {
  listarEmpresas,
  adicionarEmpresa,
  atualizarEmpresa,
  excluirEmpresa,
  listarEmpresasAutoComplete,
  ativarEmpresa,
  inativarEmpresa,
} from "../modules/empresas/empresas.js";

const router = express.Router();

router.get("/", listarEmpresas);
router.get("/auto-complete", listarEmpresasAutoComplete);
router.post("/", adicionarEmpresa);
router.put("/:id", atualizarEmpresa);
router.patch("/ativar/:id", ativarEmpresa);
router.patch("/inativar/:id", inativarEmpresa);
router.delete("/:id", excluirEmpresa);

export default router;
