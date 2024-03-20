import { prisma } from "../../data/index.js";

import { salvarNovaContribuicaoAuxilioMoradia } from "./service.js";

export const listarContribuicoesAuxilioMoradia = async (req, res) => {
  const clienteAuxilioMoradiaId = parseInt(req.params.clienteAuxilioMoradiaId);

  const clienteAuxilioMoradiaExistente =
    await prisma.clientesAuxilioMoradia.findFirst({
      where: {
        id: clienteAuxilioMoradiaId,
      },
    });

  if (!clienteAuxilioMoradiaExistente) {
    return res.status(400).json("O cliente informado não foi encontrado!");
  }

  const contribuicoesAuxilioMoradia =
    await prisma.contribuicoesAuxilioMoradia.findMany({
      where: {
        clienteAuxilioMoradiaId: clienteAuxilioMoradiaId,
      },
      orderBy: [
        {
          ano: "desc",
        },
        {
          mes: "desc",
        },
      ],
    });

  const contribuicoesAuxilioMoradiaRetorno = [];

  contribuicoesAuxilioMoradia.map((contribuicaoAuxilioMoradia) => {
    contribuicoesAuxilioMoradiaRetorno.push({
      ...contribuicaoAuxilioMoradia,
    });
  });

  return res.status(200).json(contribuicoesAuxilioMoradiaRetorno);
};

export const adicionarContribuicaoAuxilioMoradia = async (req, res) => {
  const contribuicaoAuxilioMoradia = {
    clienteAuxilioMoradiaId: req.body.clienteAuxilioMoradiaId,
    ano: req.body.ano,
    mes: req.body.mes,
    base: req.body.base,
    empresa: req.body.empresa,
    valorAuxilioMoradia: req.body.valorAuxilioMoradia,
    valorRecebidoAuxilioMoradia: req.body.valorRecebidoAuxilioMoradia,
    usuarioTransacaoId: req.auth.usuario.id,
  };

  await salvarNovaContribuicaoAuxilioMoradia(contribuicaoAuxilioMoradia);

  return res.status(200).json("Contribuição cadastrada com sucesso!");
};

export const atualizarContribuicaoAuxilioMoradia = async (req, res) => {
  const id = parseInt(req.params.id);

  const contribuicaoAuxilioMoradiaExistente =
    await prisma.contribuicoesAuxilioMoradia.findFirst({
      where: {
        id: id,
      },
    });

  if (!contribuicaoAuxilioMoradiaExistente) {
    return res
      .status(400)
      .json({ mensagem: "A contribuição informada não foi encontrada" });
  }

  await prisma.contribuicoesAuxilioMoradia.update({
    where: {
      id: id,
    },
    data: {
      ano: req.body.ano,
      mes: req.body.mes,
      base: req.body.base,
      empresa: req.body.empresa,
      valorAuxilioMoradia: req.body.valorAuxilioMoradia,
      valorRecebidoAuxilioMoradia: req.body.valorRecebidoAuxilioMoradia,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json("Despacho alterado com sucesso!");
};

export const excluirContribuicaoAuxilioMoradia = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.contribuicoesAuxilioMoradia.delete({
    where: {
      id: id,
    },
  });

  return res.status(200).json("Contribuição excluída com sucesso!");
};
