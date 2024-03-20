import { prisma } from "../../data/index.js";
import { getToken } from "../../services/util.js";

export const listarBancos = async (req, res) => {
  const { filtro, take, skip } = req.query;

  const bancos = await prisma.bancos.findMany({
    where: getClausulaWhere(filtro),
    take: take ? Number(take) : undefined,
    skip: skip ? Number(skip) : undefined,
    orderBy: {
      nome: "asc",
    },
  });

  const bancosCount = await prisma.bancos.count({
    where: getClausulaWhere(filtro),
  });

  return res.status(200).json({
    registros: bancos,
    quantRegistros: bancosCount,
    refreshToken: getToken(req.auth.usuario),
  });
};

export const listarBancosAutoComplete = async (req, res) => {
  const { filtro } = req.query;

  const bancos = await prisma.bancos.findMany({
    where: getClausulaWhere(filtro),
    take: 5,
    orderBy: {
      nome: "asc",
    },
  });

  const bancosRetorno = bancos.map((banco) => ({
    codigo: banco.id,
    descricao: `${banco.codigo}-${banco.nome}`,
  }));

  return res.status(200).json({
    registros: bancosRetorno,
    refreshToken: getToken(req.auth.usuario),
  });
};

const getClausulaWhere = (filtro) => {
  if (!filtro || (filtro && typeof filtro !== "string")) {
    return {};
  }

  const whereClause = filtro
    ? {
        OR: [
          {
            nome: {
              contains: filtro,
              mode: "insensitive",
            },
          },
          {
            codigo: {
              contains: filtro,
              mode: "insensitive",
            },
          },
        ],
      }
    : {};

  return whereClause;
};

export const adicionarBanco = async (req, res) => {
  const bancoExistente = await prisma.bancos.findUnique({
    where: {
      codigo: req.body.codigo,
    },
  });

  if (bancoExistente) {
    return res.status(400).json({
      mensagem: "Já existe um banco com o código informado!",
      refreshToken: getToken(req.auth.usuario),
    });
  }

  await prisma.bancos.create({
    data: {
      codigo: req.body.codigo,
      nome: req.body.nome,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Banco cadastrado com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const atualizarBanco = async (req, res) => {
  const id = parseInt(req.params.id);
  const { codigo } = req.body;

  const bancoExistente = await prisma.bancos.findFirst({
    where: {
      codigo: codigo,
      id: { not: id },
    },
  });

  if (bancoExistente) {
    return res.status(400).json({
      mensagem: "Já existe um banco com o código informado!",
      refreshToken: getToken(req.auth.usuario),
    });
  }

  await prisma.bancos.update({
    where: {
      id: id,
    },
    data: {
      codigo: req.body.codigo,
      nome: req.body.nome,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Banco alterado com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const excluirBanco = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.bancos.delete({
    where: {
      id: id,
    },
  });

  return res.status(200).json({
    mensagem: "Banco excluído com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};
