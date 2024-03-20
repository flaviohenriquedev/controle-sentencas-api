import { prisma } from "../../data/index.js";
import { getToken } from "../../services/util.js";

export const listarIndicesIPCAE = async (req, res) => {
  const { take, skip } = req.query;

  const indicesIPCAE = await prisma.indiceIPCAE.findMany({
    take: take ? Number(take) : undefined,
    skip: skip ? Number(skip) : undefined,
    orderBy: [
      {
        ano: "desc",
      },
      {
        mes: "desc",
      },
    ],
  });

  const indicesIPCAECount = await prisma.indiceIPCAE.count();

  return res.status(200).json({
    registros: indicesIPCAE,
    quantRegistros: indicesIPCAECount,
    refreshToken: getToken(req.auth.usuario),
  });
};

export const adicionarIndiceIPCAE = async (req, res) => {
  const { ano, mes, valor } = req.body;

  const indiceIPCAEExistente = await prisma.indiceIPCAE.findFirst({
    where: {
      ano: ano,
      mes: mes,
    },
  });

  if (indiceIPCAEExistente) {
    return res.status(400).send({
      mensagem: "Já existe um índice cadastrado para o ano e mês informados!",
      refreshToken: getToken(req.auth.usuario),
    });
  }

  await prisma.indiceIPCAE.create({
    data: {
      ano: ano,
      mes: mes,
      valor: valor,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Índice cadastrado com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const atualizarIndiceIPCAE = async (req, res) => {
  const id = parseInt(req.params.id);
  const { ano, mes } = req.body;

  const indiceIPCAEExistente = await prisma.indiceIPCAE.findFirst({
    where: {
      ano: ano,
      mes: mes,
      id: { not: id },
    },
  });

  if (indiceIPCAEExistente) {
    return res.status(400).send({
      mensagem: "Já existe um índice cadastrado para o ano e mês informados!",
      refreshToken: getToken(req.auth.usuario),
    });
  }

  await prisma.indiceIPCAE.update({
    where: {
      id: id,
    },
    data: {
      ano: req.body.ano,
      mes: req.body.mes,
      valor: req.body.valor,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Índice alterado com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const excluirIndiceIPCAE = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.indiceIPCAE.delete({
    where: {
      id: id,
    },
  });

  return res.status(200).json({
    mensagem: "Índice excluído com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};
