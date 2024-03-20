import { prisma } from "../../data/index.js";
import { getToken } from "../../services/util.js";

export const listarAndamentos = async (req, res) => {
  const { filtro, take, skip } = req.query;

  const andamentos = await prisma.andamentos.findMany({
    where: getClausulaWhere(filtro, false),
    take: take ? Number(take) : undefined,
    skip: skip ? Number(skip) : undefined,
    orderBy: {
      descricao: "asc",
    },
  });

  const andamentosCount = await prisma.andamentos.count({
    where: getClausulaWhere(filtro, false),
  });

  return res.status(200).json({
    registros: andamentos,
    quantRegistros: andamentosCount,
    refreshToken: getToken(req.auth.usuario),
  });
};

export const listarAndamentosAutoComplete = async (req, res) => {
  const { filtro } = req.query;

  const andamentos = await prisma.andamentos.findMany({
    where: getClausulaWhere(filtro, true),
    take: 5,
    orderBy: {
      descricao: "asc",
    },
  });

  const andamentosRetorno = andamentos.map((andamento) => ({
    codigo: andamento.id,
    descricao: andamento.descricao,
  }));

  return res.status(200).json({
    registros: andamentosRetorno,
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

export const adicionarAndamento = async (req, res) => {
  const andamentoExistente = await prisma.andamentos.findUnique({
    where: {
      descricao: req.body.descricao,
    },
  });

  if (andamentoExistente) {
    return res.status(400).json({
      mensagem: "Já existe um andamento com a descrição informada!",
      refreshToken: getToken(req.auth.usuario),
    });
  }

  await prisma.andamentos.create({
    data: {
      descricao: req.body.descricao,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Andamento criado com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const atualizarAndamento = async (req, res) => {
  const id = parseInt(req.params.id);
  const { descricao } = req.body;

  const andamentoExistente = await prisma.andamentos.findFirst({
    where: {
      descricao: descricao,
      id: { not: id },
    },
  });

  if (andamentoExistente) {
    return res.status(400).json({
      mensagem: "Já existe um andamento com a descrição informada!",
      refreshToken: getToken(req.auth.usuario),
    });
  }

  await prisma.andamentos.update({
    where: {
      id: id,
    },
    data: {
      descricao: req.body.descricao,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Andamento alterado com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const excluirAndamento = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.andamentos.delete({
    where: {
      id: id,
    },
  });

  return res.status(200).json({
    mensagem: "Andamento excluído com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const ativarAndamento = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.andamentos.update({
    where: {
      id: id,
    },
    data: {
      ativo: true,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Andamento ativada com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const inativarAndamento = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.andamentos.update({
    where: {
      id: id,
    },
    data: {
      ativo: false,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Andamento inativada com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};
