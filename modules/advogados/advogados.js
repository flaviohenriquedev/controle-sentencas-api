import { prisma } from "../../data/index.js";
import { getToken } from "../../services/util.js";

export const listarAdvogados = async (req, res) => {
  const { filtro, take, skip } = req.query;

  const advogados = await prisma.advogados.findMany({
    where: getClausulaWhere(filtro),
    take: take ? Number(take) : undefined,
    skip: skip ? Number(skip) : undefined,
    orderBy: {
      nome: "asc",
    },
  });

  const advogadosCount = await prisma.advogados.count({
    where: getClausulaWhere(filtro),
  });

  return res.status(200).json({
    registros: advogados,
    quantRegistros: advogadosCount,
    refreshToken: getToken(req.auth.usuario),
  });
};

export const listarAdvogadosAutoComplete = async (req, res) => {
  const { filtro } = req.query;

  const advogados = await prisma.advogados.findMany({
    where: getClausulaWhere(filtro),
    take: 5,
    orderBy: {
      nome: "asc",
    },
  });

  const advogadosRetorno = advogados.map((advogado) => ({
    codigo: advogado.id,
    descricao: advogado.nome,
  }));

  return res.status(200).json({
    registros: advogadosRetorno,
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
        ],
      }
    : {};

  return whereClause;
};

export const adicionarAdvogado = async (req, res) => {
  const advogadoExistente = await prisma.advogados.findUnique({
    where: {
      nome: req.body.nome,
    },
  });

  if (advogadoExistente) {
    return res.status(400).json({
      mensagem: "Já existe um advogado com o nome informado!",
      refreshToken: getToken(req.auth.usuario),
    });
  }

  await prisma.advogados.create({
    data: {
      nome: req.body.nome,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Advogado criado com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const atualizarAdvogado = async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome } = req.body;

  const advogadoExistente = await prisma.advogados.findFirst({
    where: {
      nome: nome,
      id: { not: id },
    },
  });

  if (advogadoExistente) {
    return res.status(400).json({
      mensagem: "Já existe um advogado com o nome informado!",
      refreshToken: getToken(req.auth.usuario),
    });
  }

  await prisma.advogados.update({
    where: {
      id: id,
    },
    data: {
      nome: req.body.nome,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Advogado alterado com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const excluirAdvogado = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.advogados.delete({
    where: {
      id: id,
    },
  });

  return res.status(200).json({
    mensagem: "Advogado excluído com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};
