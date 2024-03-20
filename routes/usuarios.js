import express from "express";
import {
  listarUsuarios,
  adicionarUsuario,
  atualizarUsuario,
  excluirUsuario,
  ativarUsuario,
  inativarUsuario,
  resetarSenha,
  alterarSenha,
} from "../modules/usuarios/usuarios.js";

const router = express.Router();

router.get("/", listarUsuarios);
router.post("/", adicionarUsuario);
router.put("/:id", atualizarUsuario);
router.patch("/ativar/:id", ativarUsuario);
router.patch("/inativar/:id", inativarUsuario);
router.patch("/resetar-senha/:id", resetarSenha);
router.patch("/alterar-senha", alterarSenha);
router.delete("/:id", excluirUsuario);

export default router;
