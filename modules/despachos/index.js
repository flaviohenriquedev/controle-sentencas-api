import { prisma } from "../../data/index.js";
import { getToken } from "../../services/util.js";

import { salvarNovoDespacho } from "./service.js";

export const listarDespachos = async (req, res) => {
  const processoId = parseInt(req.params.processoId);

  if (!processoId) {
    return res.status(400).json({
      mensagem: "Não foi identificado um número de processo valido",
      refreshToken: getToken(req.auth.usuario),
    });
  }

  const despachos = await prisma.despachos.findMany({
    where: {
      processoId: processoId,
    },
    include: {
      andamento: {
        select: {
          descricao: true,
        },
      },
    },
    orderBy: {
      dataDespacho: "asc",
    },
  });

  const despachosRetorno = [];

  //Necessario para preecher o campo AutoComplete
  despachos.map((despacho) => {
    despachosRetorno.push({
      ...despacho,
      andamento: {
        codigo: despacho.andamentoId,
        descricao: despacho.andamento.descricao,
      },
    });
  });

  return res.status(200).json({
    registros: despachosRetorno,
    refreshToken: getToken(req.auth.usuario),
  });
};

export const adicionarDespacho = async (req, res) => {
  const despacho = {
    dataDespacho: req.body.dataDespacho,
    observacao: req.body.observacao,
    dataValidade: req.body.dataValidade,
    processoId: req.body.processoId,
    andamentoId: req.body.andamentoId,
    usuarioTransacaoId: req.auth.usuario.id,
  };

  await salvarNovoDespacho(despacho);

  return res.status(200).json({
    mensagem: "Despacho criado com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const atualizarDespacho = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.despachos.update({
    where: {
      id: id,
    },
    data: {
      dataDespacho: req.body.dataDespacho,
      observacao: req.body.observacao,
      dataValidade: req.body.dataValidade,
      processoId: req.body.processoId,
      andamentoId: req.body.andamentoId,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Despacho alterado com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const excluirDespacho = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.despachos.delete({
    where: {
      id: id,
    },
  });

  return res.status(200).json({
    mensagem: "Despacho excluído com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};
