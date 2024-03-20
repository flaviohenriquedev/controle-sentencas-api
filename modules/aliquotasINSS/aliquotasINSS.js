import { prisma } from "../../data/index.js";
import { getToken } from "../../services/util.js";

export const listarAliquotasINSS = async (req, res) => {
  const { take, skip } = req.query;

  const aliquotasINSS = await prisma.aliquotaINSS.findMany({
    take: take ? Number(take) : undefined,
    skip: skip ? Number(skip) : undefined,
    orderBy: [
      {
        ano: "desc",
      },
      {
        mes: "desc",
      },
      {
        aliquota: "desc",
      },
    ],
  });

  const aliquotasINSSCount = await prisma.aliquotaINSS.count();

  return res.status(200).json({
    registros: aliquotasINSS,
    quantRegistros: aliquotasINSSCount,
    refreshToken: getToken(req.auth.usuario),
  });
};

export const adicionarAliquotaINSS = async (req, res) => {
  const { ano, mes, aliquota } = req.body;

  const aliquotaINSSExistente = await prisma.aliquotaINSS.findFirst({
    where: {
      ano: ano,
      mes: mes,
      aliquota: aliquota,
    },
  });

  if (aliquotaINSSExistente) {
    return res.status(400).send({
      mensagem: "Já existe uma alíquota para o ano e mês informados!",
      refreshToken: getToken(req.auth.usuario),
    });
  }

  await prisma.aliquotaINSS.create({
    data: {
      ano: req.body.ano,
      mes: req.body.mes,
      aliquota: req.body.aliquota,
      faixa: req.body.faixa,
      teto: req.body.teto,
      tetoCooperativa: req.body.tetoCooperativa,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Alíquota criada com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const atualizarAliquotaINSS = async (req, res) => {
  const id = parseInt(req.params.id);
  const { ano, mes, aliquota } = req.body;

  const aliquotaINSSExistente = await prisma.aliquotaINSS.findFirst({
    where: {
      ano: ano,
      mes: mes,
      aliquota: aliquota,
      id: { not: id },
    },
  });

  if (aliquotaINSSExistente) {
    return res.status(400).send({
      mensagem: "Já existe uma alíquota para o ano e mês informados!",
      refreshToken: getToken(req.auth.usuario),
    });
  }

  await prisma.aliquotaINSS.update({
    where: {
      id: id,
    },
    data: {
      ano: req.body.ano,
      mes: req.body.mes,
      aliquota: req.body.aliquota,
      faixa: req.body.faixa,
      teto: req.body.teto,
      tetoCooperativa: req.body.tetoCooperativa,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Alíquota alterada com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const excluirAliquotaINSS = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.aliquotaINSS.delete({
    where: {
      id: id,
    },
  });

  return res.status(200).json({
    mensagem: "Alíquota excluída com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};
