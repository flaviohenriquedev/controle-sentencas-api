import { prisma } from "../../data/index.js";
import { formatarData, getToken } from "../../services/util.js";

import { salvarNovoDespacho } from "../despachos/service.js";

export const listarProcessos = async (req, res) => {
  const { filtro, take, skip } = req.query;

  const processos = await prisma.processos.findMany({
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
    where: getClausulaWhere(filtro),
    take: take ? Number(take) : undefined,
    skip: skip ? Number(skip) : undefined,
    orderBy: {
      numeroProcessoPrincipal: "asc",
    },
  });

  const processosRetorno = [];

  //Necessario para preecher os campos AutoComplete
  processos.map((processo) => {
    processosRetorno.push({
      ...processo,
      natureza: {
        codigo: processo.naturezaId,
        descricao: processo.natureza.descricao,
      },
      comarcaProcessoPrincipal: {
        codigo: processo.comarcaProcessoPrincipalId,
        descricao: processo.comarcaProcessoPrincipal.descricao,
      },
      cliente: {
        codigo: processo.clienteId,
        nome: processo.cliente.nome,
        descricao: `${processo.cliente.cpf}-${processo.cliente.nome}`,
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

  const processosCount = await prisma.processos.count({
    where: getClausulaWhere(filtro),
  });

  return res.status(200).json({
    registros: processosRetorno,
    quantRegistros: processosCount,
    refreshToken: getToken(req.auth.usuario),
  });
};

export const listarProcessoAutoComplete = async (req, res) => {
  const { filtro } = req.query;

  const processos = await prisma.processos.findMany({
    include: {
      cliente: {
        select: {
          nome: true,
          cpf: true,
        },
      },
    },
    where: getClausulaWhere(filtro),
    take: 5,
    orderBy: {
      numeroProcessoPrincipal: "asc",
    },
  });

  const processosRetorno = processos.map((processo) => ({
    codigo: processo.id,
    descricao: `${processo.numeroProcessoPrincipal} - ${processo.cliente.cpf}-${processo.cliente.nome}`,
  }));

  return res.status(200).json({
    registros: processosRetorno,
    refreshToken: getToken(req.auth.usuario),
  });
};

const getClausulaWhere = (filtro) => {
  if (!filtro || (filtro && typeof filtro !== "string")) {
    return {
      AND: [
        {
          numeroProcessoFilho: null,
        },
      ],
    };
  }

  const filtroCpf = filtro.replaceAll(".", "").replaceAll("-", "");
  const filtroCpfFormatado =
    filtro.length > 11
      ? null
      : filtro
          .split("")
          .map((char, index) =>
            index === 3 || index === 6
              ? `.${char}`
              : index === 9
              ? `-${char}`
              : char
          )
          .join("");

  const whereClause = filtro
    ? {
        AND: [
          {
            numeroProcessoFilho: null,
          },
        ],
        OR: [
          {
            numeroProcessoPrincipal: {
              contains: filtro,
              mode: "insensitive",
            },
          },
          {
            tipoProcessoPrincipal: {
              contains: filtro,
              mode: "insensitive",
            },
          },
          {
            cliente: {
              nome: {
                contains: filtro,
                mode: "insensitive",
              },
            },
          },
          {
            cliente: {
              cpf: {
                contains: filtro,
                mode: "insensitive",
              },
            },
          },
          {
            cliente: {
              cpf: {
                contains: filtroCpf,
                mode: "insensitive",
              },
            },
          },
          filtroCpfFormatado
            ? {
                cliente: {
                  cpf: {
                    contains: filtroCpfFormatado,
                    mode: "insensitive",
                  },
                },
              }
            : {},
        ],
      }
    : {
        AND: [
          {
            numeroProcessoFilho: null,
          },
        ],
      };

  return whereClause;
};

export const adicionarProcesso = async (req, res) => {
  const processo = await prisma.processos.create({
    data: {
      numeroProcessoPrincipal: req.body.numeroProcessoPrincipal,
      tipoProcessoPrincipal: req.body.tipoProcessoPrincipal,
      dataIntimacao: req.body.dataIntimacao,
      dataSentenca: req.body.dataSentenca,
      dataPagamentoProcessoPrincipal: req.body.dataPagamentoProcessoPrincipal,
      dataInicioBeneficio: req.body.dataInicioBeneficio,
      dataInicioPagamentoBeneficio: req.body.dataInicioPagamentoBeneficio,
      valorRendaMensalInicial: parseFloat(req.body.valorRendaMensalInicial),
      observacoesProcessoPrincipal: req.body.observacoesProcessoPrincipal,
      naturezaId: req.body.naturezaId,
      clienteId: req.body.clienteId,
      empresaId: req.body.empresaId,
      advogadoId: req.body.advogadoId,
      comarcaProcessoPrincipalId: req.body.comarcaProcessoPrincipalId,
      usuarioTransacaoId: req.auth.usuario.id,
      banco: req.body.banco,
    },
  });

  const despacho = {
    dataDespacho: formatarData(new Date(), "yyyy-MM-dd"),
    observacao: "Criação do Processo",
    processoId: processo.id,
    andamentoId: 1,
    usuarioTransacaoId: req.auth.usuario.id,
  };

  salvarNovoDespacho(despacho);

  return res.status(200).json({
    mensagem: "Processo criado com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const atualizarProcesso = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.processos.update({
    where: {
      id: id,
    },
    data: {
      numeroProcessoPrincipal: req.body.numeroProcessoPrincipal,
      tipoProcessoPrincipal: req.body.tipoProcessoPrincipal,
      dataIntimacao: req.body.dataIntimacao,
      dataSentenca: req.body.dataSentenca,
      dataPagamentoProcessoPrincipal: req.body.dataPagamentoProcessoPrincipal,
      dataInicioBeneficio: req.body.dataInicioBeneficio,
      dataInicioPagamentoBeneficio: req.body.dataInicioPagamentoBeneficio,
      valorRendaMensalInicial: parseFloat(req.body.valorRendaMensalInicial),
      observacoesProcessoPrincipal: req.body.observacoesProcessoPrincipal,
      naturezaId: req.body.naturezaId,
      clienteId: req.body.clienteId,
      empresaId: req.body.empresaId,
      advogadoId: req.body.advogadoId,
      comarcaProcessoPrincipalId: req.body.comarcaProcessoPrincipalId,
      usuarioTransacaoId: req.auth.usuario.id,
      banco: req.body.banco,
    },
  });

  return res.status(200).json({
    mensagem: "Processo atualizado com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const excluirProcesso = async (req, res) => {
  const id = parseInt(req.params.id);

  const processoVinculados = await prisma.processos.findMany({
    where: { processoPrincipalId: id },
  });

  if (processoVinculados && processoVinculados.length > 0) {
    return res.status(400).json({
      mensagem:
        "Não é possível realizar a exclusão desse processo pois ele possui processo secundário vinculado.",
      refreshToken: getToken(req.auth.usuario),
    });
  }

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
