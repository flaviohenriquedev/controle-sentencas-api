import { prisma } from "../../data/index.js";

import { salvarNovaVerbaConsignado } from "./service.js";

export const listarVerbasConsignado = async (req, res) => {
  const clienteConsignadoId = parseInt(req.params.clienteConsignadoId);

  if (!clienteConsignadoId) {
    return res
      .status(400)
      .json(        
        "Não foi identificado um cliente válido para os filtros das verbas"
      );
  }

  const verbasConsignado = await prisma.verbasConsignado.findMany({
    where: {
      clienteConsignadoId: clienteConsignadoId,
    },
    orderBy: {
      id: "asc",
    },
  });

  const verbasConsignadoRetorno = [];

  //Necessario para preecher o campo AutoComplete
  verbasConsignado.map((verbaConsignado) => {
    verbasConsignadoRetorno.push({
      ...verbaConsignado,
    });
  });

  return res.status(200).json(verbasConsignadoRetorno);
};

export const adicionarVerbaConsignado = async (req, res) => {
  const verbaConsignado = {
    codigo_verba: req.body.codigo_verba,
    descricao: req.body.descricao,
    tipo: req.body.tipo,
    quantidade_atual: req.body.quantidade_atual,
    quantidade_total: req.body.quantidade_total,
    valor: req.body.valor,
    desconto_obrigatorio_excecao_legal: req.body.desconto_obrigatorio_excecao_legal,
    clienteConsignadoId: req.body.clienteConsignadoId,    
    usuarioTransacaoId: req.auth.usuario.id,
  };

  await salvarNovaVerbaConsignado(verbaConsignado);

  return res.status(200).json("Verba criada com sucesso!");
};

export const atualizarVerbaConsignado = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.verbasConsignado.update({
    where: {
      id: id,
    },
    data: {
      codigo_verba: req.body.codigo_verba,
      descricao: req.body.descricao,
      tipo: req.body.tipo,
      quantidade_atual: req.body.quantidade_atual,
      quantidade_total: req.body.quantidade_total,
      valor: req.body.valor,
      desconto_obrigatorio_excecao_legal: req.body.desconto_obrigatorio_excecao_legal,
      clienteConsignadoId: req.body.clienteConsignadoId,      
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json("Verba alterada com sucesso!");
};

export const excluirVerbaConsignado = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.verbasConsignado.delete({
    where: {
      id: id,
    },
  });

  return res.status(200).json("Verba excluída com sucesso!");
};
