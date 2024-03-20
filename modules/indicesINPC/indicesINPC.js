import { prisma } from "../../data/index.js";
import { getToken } from "../../services/util.js";

export const listarIndicesINPC = async (req, res) => {
  const { take, skip } = req.query;

  const indicesINPC = await prisma.indiceINPC.findMany({
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

  const indicesINPCCount = await prisma.indiceINPC.count();

  return res.status(200).json({
    registros: indicesINPC,
    quantRegistros: indicesINPCCount,
    refreshToken: getToken(req.auth.usuario),
  });
};

export const adicionarIndiceINPC = async (req, res) => {
  const { ano, mes, valor } = req.body;

  const indiceINPCExistente = await prisma.indiceINPC.findFirst({
    where: {
      ano: ano,
      mes: mes,
    },
  });

  if (indiceINPCExistente) {
    return res.status(400).send({
      mensagem: "Já existe um índice cadastrado para o ano e mês informados!",
      refreshToken: getToken(req.auth.usuario),
    });
  }

  await prisma.indiceINPC.create({
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

export const atualizarIndiceINPC = async (req, res) => {
  const id = parseInt(req.params.id);
  const { ano, mes } = req.body;

  const indiceINPCExistente = await prisma.indiceINPC.findFirst({
    where: {
      ano: ano,
      mes: mes,
      id: { not: id },
    },
  });

  if (indiceINPCExistente) {
    return res.status(400).send({
      mensagem: "Já existe um índice cadastrado para o ano e mês informados!",
      refreshToken: getToken(req.auth.usuario),
    });
  }

  await prisma.indiceINPC.update({
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

export const excluirIndiceINPC = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.indiceINPC.delete({
    where: {
      id: id,
    },
  });

  return res.status(200).json({
    mensagem: "Índice excluído com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};
