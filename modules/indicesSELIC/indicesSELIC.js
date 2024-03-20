import { prisma } from "../../data/index.js";
import { getToken } from "../../services/util.js";

export const listarIndicesSELIC = async (req, res) => {
  const { take, skip } = req.query;

  const indicesSELIC = await prisma.indiceSELIC.findMany({
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

  const indicesSELICCount = await prisma.indiceSELIC.count();

  return res.status(200).json({
    registros: indicesSELIC,
    quantRegistros: indicesSELICCount,
    refreshToken: getToken(req.auth.usuario),
  });
};

export const adicionarIndiceSELIC = async (req, res) => {
  const { ano, mes, valor } = req.body;

  const indiceSELICExistente = await prisma.indiceSELIC.findFirst({
    where: {
      ano: ano,
      mes: mes,
    },
  });

  if (indiceSELICExistente) {
    return res.status(400).send({
      mensagem: "Já existe um índice cadastrado para o ano e mês informados!",
      refreshToken: getToken(req.auth.usuario),
    });
  }

  await prisma.indiceSELIC.create({
    data: {
      ano: ano,
      mes: mes,
      valor: valor,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res
    .status(200)
    .json({
      mensagem: "Índice cadastrado com sucesso!",
      refreshToken: getToken(req.auth.usuario),
    });
};

export const atualizarIndiceSELIC = async (req, res) => {
  const id = parseInt(req.params.id);
  const { ano, mes } = req.body;

  const indiceSELICExistente = await prisma.indiceSELIC.findFirst({
    where: {
      ano: ano,
      mes: mes,
      id: { not: id },
    },
  });

  if (indiceSELICExistente) {
    return res.status(400).send({
      mensagem: "Já existe um índice cadastrado para o ano e mês informados!",
      refreshToken: getToken(req.auth.usuario),
    });
  }

  await prisma.indiceSELIC.update({
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

export const excluirIndiceSELIC = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.indiceSELIC.delete({
    where: {
      id: id,
    },
  });

  return res.status(200).json({
    mensagem: "Índice excluído com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};
