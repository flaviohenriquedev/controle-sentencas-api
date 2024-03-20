import bcrypt from "bcrypt";
import { omit } from "ramda";

import { prisma } from "../../data/index.js";
import {
  encryptingPassword,
  enviarEmail,
  getToken,
} from "../../services/util.js";

export const listarUsuarios = async (req, res) => {
  const { filtro, take, skip } = req.query;

  const usuarios = await prisma.usuarios.findMany({
    where: getClausulaWhere(filtro),
    take: take ? Number(take) : undefined,
    skip: skip ? Number(skip) : undefined,
    orderBy: {
      nome: "asc",
    },
  });

  const returnUsuarios = usuarios.map((usuario) => omit(["password"], usuario));

  const usuariosCount = await prisma.usuarios.count({
    where: getClausulaWhere(filtro),
  });

  return res.status(200).json({
    registros: returnUsuarios,
    quantRegistros: usuariosCount,
    refreshToken: getToken(req.auth.usuario),
  });
};

export const listarUsuariosAutoComplete = async (req, res) => {
  const { filtro } = req.query;

  const usuarios = await prisma.usuarios.findMany({
    where: getClausulaWhere(filtro, true),
    take: 5,
    orderBy: {
      nome: "asc",
    },
  });

  const usuariosRetorno = usuarios.map((usuario) => ({
    codigo: usuario.id,
    descricao: usuario.descricao,
  }));

  return res.status(200).json({
    registros: usuariosRetorno,
    refreshToken: getToken(req.auth.usuario),
  });
};

const getClausulaWhere = (filtro, isSomenteAtivos) => {
  if (!filtro || (filtro && typeof filtro !== "string")) {
    return {};
  }

  const whereClause = filtro
    ? {
        AND: [
          isSomenteAtivos
            ? {
                ativo: true,
              }
            : {},
        ],
        OR: [
          {
            nome: {
              contains: filtro,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: filtro,
              mode: "insensitive",
            },
          },
        ],
      }
    : {};

  return whereClause;
};

export const adicionarUsuario = async (req, res) => {
  const newPassword = (Math.random() + 1).toString(36).substring(2);

  const hashedPassword = await encryptingPassword(newPassword);

  const usuarioIsEmailJaExistente = await prisma.usuarios.findUnique({
    where: {
      email: req.body.email,
    },
  });

  if (usuarioIsEmailJaExistente) {
    return res.status(400).json({
      mensagem: "O Email já está em uso por outro usuário",
      refreshToken: getToken(req.auth.usuario),
    });
  }

  await prisma.usuarios.create({
    data: {
      nome: req.body.nome,
      email: req.body.email,
      password: hashedPassword,
      usuarioTransacaoId: req?.auth?.usuario?.id ? req.auth.usuario.id : null,
    },
  });

  enviarEmail({
    to: req.body.email,
    subject: `Bem vindo ao ${process.env.SISTEMA_NOME}`,
    html: `<h2>Olá, ${req.body.nome}!</h2>
    <h3>Suas credenciais de acesso ao Sistema <a href="${process.env.SISTEMA_HOST}">${process.env.SISTEMA_NOME}</a> são:</h3>
    <p><strong>Usuário: </strong>${req.body.email}</p>
    <p><strong>Senha: </strong>${newPassword}</p>
    Te esperamos lá! 😉`,
    text: `Olá, ${req.body.nome}!

    Suas credenciais de acesso ao Sistema ${process.env.SISTEMA_NOME} são:
    Usuário: ${req.body.email}
    Senha: ${newPassword}
    Link de acesso: ${process.env.SISTEMA_HOST}

    Te esperamos lá! 😉`,
  });

  return res.status(200).json({
    mensagem:
      "Usuário criado com sucesso!\nUm e-mail foi enviado ao novo usuário com suas credenciais.",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const atualizarUsuario = async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, email } = req.body;

  // Verifique se o email já está em uso por outro usuário (excluindo o usuário atual)
  const usuarioExistente = await prisma.usuarios.findFirst({
    where: {
      email: email,
      id: { not: id },
    },
  });

  if (usuarioExistente) {
    return res.status(400).json({
      mensagem: "O Email já está em uso por outro usuário",
      refreshToken: getToken(req.auth.usuario),
    });
  }

  await prisma.usuarios.update({
    where: {
      id,
    },
    data: {
      nome: nome,
      email: email,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Usuário alterado com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const ativarUsuario = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.usuarios.update({
    where: {
      id,
    },
    data: {
      ativo: true,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Usuário ativado com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const inativarUsuario = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.usuarios.update({
    where: {
      id,
    },
    data: {
      ativo: false,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Usuário inativado com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const excluirUsuario = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.usuarios.update({
    where: {
      id,
    },
    data: {
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  await prisma.usuarios.delete({
    where: {
      id: id,
    },
  });

  return res.status(200).json({
    mensagem: "Usuário excluído com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const resetarSenha = async (req, res) => {
  const id = parseInt(req.params.id);

  const usuario = await prisma.usuarios.findUnique({
    where: {
      id,
    },
  });

  if (!usuario) {
    return res.status(500).json({
      mensagem: "Ops! Algo deu errado tente novamente",
      refreshToken: getToken(req.auth.usuario),
    });
  }

  const newPassword = (Math.random() + 1).toString(36).substring(2);

  const hashedPassword = await encryptingPassword(newPassword);

  await prisma.usuarios.update({
    where: {
      id: usuario.id,
    },
    data: {
      password: hashedPassword,
      usuarioTransacaoId: req?.auth?.usuario?.id ? req.auth.usuario.id : null,
    },
  });

  enviarEmail({
    to: usuario.email,
    subject: `Redefinição de Senha - ${process.env.SISTEMA_NOME}`,
    html: `<h2>Olá, ${usuario.nome}!</h2>
    <h3>Sua senha foi redefinida no <a href="${process.env.SISTEMA_HOST}">${process.env.SISTEMA_NOME}</a>, sua nova senha é:</h3>
    <p><strong>Senha: </strong>${newPassword}</p>
    <h5>Caso você não tenha requerido a redefinição de senha, favor entrar em contato com o administrador do sistema!</h5>
    Att. ${process.env.SISTEMA_NOME} 😉!`,
    text: `Olá, ${usuario.nome}!

    Sua senha foi redefinida no ${process.env.SISTEMA_NOME}, sua nova senha é:
    Senha: ${newPassword}

    Caso você não tenha requerido a redefinição de senha, favor entrar em contato com o administrador do sistema!

    Att. ${process.env.SISTEMA_NOME} 😉!`,
  });

  return res.status(200).json({
    mensagem:
      "Senha Resetada com sucesso!\nUm e-mail foi enviado ao usuário com sua nova senha.",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const alterarSenha = async (req, res) => {
  const id = parseInt(req.auth.usuario.id);
  const senhaAtual = req.body.senhaAtual;
  const novaSenha = req.body.novaSenha;

  const usuario = await prisma.usuarios.findUnique({
    where: {
      id,
    },
  });

  if (!usuario) {
    return res.status(400).json({
      mensagem: "Ops! Algo deu errado tente novamente",
      refreshToken: getToken(req.auth.usuario),
    });
  }

  const passwordEqual = await bcrypt.compare(senhaAtual, usuario.password);

  if (!passwordEqual) {
    return res.status(400).json({
      mensagem: "A senha atual informada esta errada!",
      refreshToken: getToken(req.auth.usuario),
    });
  }

  const hashedPassword = await encryptingPassword(novaSenha);

  await prisma.usuarios.update({
    where: {
      id: usuario.id,
    },
    data: {
      password: hashedPassword,
      usuarioTransacaoId: req?.auth?.usuario?.id ? req.auth.usuario.id : null,
    },
  });

  enviarEmail({
    to: usuario.email,
    subject: `Alteração de Senha - ${process.env.SISTEMA_NOME}`,
    html: `<h2>Olá, ${usuario.nome}!</h2>
    <h3>Você acaba de alterar sua senha no <a href="${process.env.SISTEMA_HOST}">${process.env.SISTEMA_NOME}</a>,</h3>
    <h5>Caso você não tenha realizado a alteração de sua senha, favor entrar em contato com o administrador do sistema!</h5>
    Att. ${process.env.SISTEMA_NOME} 😉!`,
    text: `Olá, ${usuario.nome}!

    Você acaba de alterar sua senha no ${process.env.SISTEMA_NOME},

    Caso você não tenha realizado a alteração de sua senha, favor entrar em contato com o administrador do sistema!

    Att. ${process.env.SISTEMA_NOME} 😉!`,
  });

  return res.status(200).json({
    mensagem: "Senha Alterada com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};
