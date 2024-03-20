import { prisma } from "../../data/index.js";
import { getToken } from "../../services/util.js";

export const listarNaturezas = async (req, res) => {
  const { filtro, take, skip } = req.query;

  const naturezas = await prisma.naturezas.findMany({
    where: getClausulaWhere(filtro, false),
    take: take ? Number(take) : undefined,
    skip: skip ? Number(skip) : undefined,
    orderBy: {
      id: "asc",
    },
  });

  const naturezasCount = await prisma.naturezas.count({
    where: getClausulaWhere(filtro, false),
  });

  return res.status(200).json({
    registros: naturezas,
    quantRegistros: naturezasCount,
    refreshToken: getToken(req.auth.usuario),
  });
};

export const listarNaturezasAutoComplete = async (req, res) => {
  const { filtro } = req.query;

  const naturezas = await prisma.naturezas.findMany({
    where: getClausulaWhere(filtro, true),
    take: 5,
    orderBy: {
      descricao: "asc",
    },
  });

  const naturezasRetorno = naturezas.map((natureza) => ({
    codigo: natureza.id,
    descricao: natureza.descricao,
  }));

  return res.status(200).json({
    registros: naturezasRetorno,
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
            descricao: {
              contains: filtro,
              mode: "insensitive",
            },
          },
        ],
      }
    : {};

  return whereClause;
};

export const adicionarNatureza = async (req, res) => {
  const naturezaExistente = await prisma.naturezas.findUnique({
    where: {
      descricao: req.body.descricao,
    },
  });

  if (naturezaExistente) {
    return res.status(400).json({
      mensagem: "Já existe uma natureza com a descrição informada!",
      refreshToken: getToken(req.auth.usuario),
    });
  }

  await prisma.naturezas.create({
    data: {
      descricao: req.body.descricao,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Natureza criada com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const atualizarNatureza = async (req, res) => {
  const id = parseInt(req.params.id);
  const { descricao } = req.body;

  const naturezaExistente = await prisma.naturezas.findFirst({
    where: {
      descricao: descricao,
      id: { not: id },
    },
  });

  if (naturezaExistente) {
    return res.status(400).json({
      mensagem: "Já existe uma natureza com a descrição informada!",
      refreshToken: getToken(req.auth.usuario),
    });
  }

  await prisma.naturezas.update({
    where: {
      id: id,
    },
    data: {
      descricao: req.body.descricao,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Natureza alterada com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const excluirNatureza = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.naturezas.delete({
    where: {
      id: id,
    },
  });

  return res.status(200).json({
    mensagem: "Natureza excluída com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const ativarNatureza = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.naturezas.update({
    where: {
      id,
    },
    data: {
      ativo: true,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Natureza ativado com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const inativarNatureza = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.naturezas.update({
    where: {
      id,
    },
    data: {
      ativo: false,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Natureza inativado com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};
