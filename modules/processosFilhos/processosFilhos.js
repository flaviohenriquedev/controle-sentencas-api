import { prisma } from "../../data/index.js";
import { formatarData, getToken } from "../../services/util.js";

import { salvarNovoDespacho } from "../despachos/service.js";

export const listarProcessosFilhos = async (req, res) => {
  const processoPrincipalId = parseInt(req.params.processoPrincipalId);
  const { take, skip } = req.query;
  const processosFilhos = await prisma.processos.findMany({
    include: {
      natureza: {
        select: {
          descricao: true,
        },
      },
      comarcaProcessoPrincipal: {
        select: {
          descricao: true,
        },
      },
      comarcaProcessoFilho: {
        select: {
          descricao: true,
        },
      },
      cliente: {
        select: {
          nome: true,
          cpf: true,
        },
      },
      empresa: {
        select: {
          nome: true,
        },
      },
      advogado: {
        select: {
          nome: true,
        },
      },
    },
    where: {
      processoPrincipalId: processoPrincipalId,
    },
    take: take ? Number(take) : undefined,
    skip: skip ? Number(skip) : undefined,
    orderBy: {
      id: "asc",
    },
  });

  const processosFilhosRetorno = [];

  //Necessario para preecher os campos AutoComplete
  processosFilhos.map((processo) => {
    processosFilhosRetorno.push({
      ...processo,
      natureza: {
        codigo: processo.naturezaId,
        descricao: processo.natureza.descricao,
      },
      comarcaProcessoPrincipal: {
        codigo: processo.comarcaProcessoPrincipalId,
        descricao: processo.comarcaProcessoPrincipal.descricao,
      },
      comarcaProcessoFilho: {
        codigo: processo.comarcaProcessoFilhoId,
        descricao: processo.comarcaProcessoFilho.descricao,
      },
      cliente: {
        codigo: processo.clienteId,
        nome: processo.cliente.nome,
        descricao: processo.cliente.cpf + "-" + processo.cliente.nome,
      },
      empresa: {
        codigo: processo.empresaId,
        descricao: processo.empresa.nome,
      },
      advogado: {
        codigo: processo.advogadoId,
        descricao: processo.advogado.nome,
      },
    });
  });

  const processosFilhosCount = await prisma.processos.count({
    where: {
      processoPrincipalId: processoPrincipalId,
    },
  });

  return res.status(200).json({
    registros: processosFilhosRetorno,
    quantRegistros: processosFilhosCount,
    refreshToken: getToken(req.auth.usuario),
  });
};

export const adicionarProcessoFilho = async (req, res) => {
  const processoPrincipal = await prisma.processos.findFirst({
    where: {
      id: req.body.processoPrincipalId,
    },
  });

  if (!processoPrincipal) {
    return res.status(400).json({
      mensagem: "O processo principal informado não foi encontrado",
      refreshToken: getToken(req.auth.usuario),
    });
  }

  const processoFilhoExistente = await prisma.processos.findFirst({
    where: {
      numeroProcessoPrincipal: req.body.numeroProcessoPrincipal,
      numeroProcessoFilho: req.body.numeroProcessoFilho,
    },
  });

  if (processoFilhoExistente) {
    return res.status(400).json({
      mensagem:
        "Já existe um Processo Filho com o número informado para este processo principal",
      refreshToken: getToken(req.auth.usuario),
    });
  }

  const processoFilho = await prisma.processos.create({
    data: {
      numeroProcessoPrincipal: processoPrincipal.numeroProcessoPrincipal,
      tipoProcessoPrincipal: processoPrincipal.tipoProcessoPrincipal,
      numeroProcessoFilho: req.body.numeroProcessoFilho,
      tipoProcessoFilho: req.body.tipoProcessoFilho,
      dataPagamentoProcessoFilho: req.body.dataPagamentoProcessoFilho,
      banco: req.body.banco,
      valorProcessoFilho: parseFloat(req.body.valorProcessoFilho) || null,
      valorHonorariosProcessoFilho:
        parseFloat(req.body.valorHonorariosProcessoFilho) || null,
      observacoesProcessoFilho: req.body.observacoesProcessoFilho,
      naturezaId: processoPrincipal.naturezaId,
      comarcaProcessoPrincipalId: processoPrincipal.comarcaProcessoPrincipalId,
      comarcaProcessoFilhoId: req.body.comarcaProcessoFilhoId,
      clienteId: processoPrincipal.clienteId,
      empresaId: processoPrincipal.empresaId,
      advogadoId: processoPrincipal.advogadoId,
      processoPrincipalId: processoPrincipal.id,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  const despacho = {
    dataDespacho: formatarData(new Date(), "yyyy-MM-dd"),
    observacao: "CADASTRAMENTO DO PROCESSO",
    processoId: processoFilho.id,
    andamentoId: 1,
    usuarioTransacaoId: req.auth.usuario.id,
  };

  salvarNovoDespacho(despacho);

  return res.status(200).json({
    mensagem: "Processo criado com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const atualizarProcessoFilho = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.processos.update({
    where: {
      id: id,
    },
    data: {
      numeroProcessoPrincipal: req.body.numeroProcessoPrincipal,
      numeroProcessoFilho: req.body.numeroProcessoFilho,
      tipoProcessoFilho: req.body.tipoProcessoFilho,
      dataPagamentoProcessoFilho: req.body.dataPagamentoProcessoFilho,
      banco: req.body.banco,
      valorProcessoFilho: parseFloat(req.body.valorProcessoFilho) || null,
      valorHonorariosProcessoFilho:
        parseFloat(req.body.valorHonorariosProcessoFilho) || null,
      observacoesProcessoFilho: req.body.observacoesProcessoFilho,
      comarcaProcessoFilhoId: req.body.comarcaProcessoFilhoId,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Processo atualizado com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const excluirProcessoFilho = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.processos.update({
    where: {
      id: id,
    },
    data: {
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  await prisma.processos.delete({
    where: {
      id: id,
    },
  });

  return res.status(200).json({
    mensagem: "Processo excluido com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};
