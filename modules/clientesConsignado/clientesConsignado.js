import { prisma } from "../../data/index.js";
import { formatarData } from "../../services/util.js";

import { salvarNovaVerbaConsignado } from "../verbasConsignado/service.js";

export const listarClientesConsignado = async (req, res) => {
  const queryFiltro = req.query.filtro;

  if (queryFiltro) {
    const filtro = "%" + queryFiltro + "%";
    const filtroCpf =
      "%" + queryFiltro.replaceAll(".", "").replaceAll("-", "") + "%";

    const clientesConsignado = await prisma.clientesConsignado.findMany({
      where: {
        OR: [
          {
            nome: {
              contains: filtro,
              mode: "insensitive",
            },
          },
          {
            cpf: {
              contains: filtroCpf,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        nome: "asc",
      },
    });

    return res.status(200).json(clientesConsignado);
  } else {
    const clientesConsignado = await prisma.clientesConsignado.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return res.status(200).json(clientesConsignado);
  }
};

export const adicionarClienteConsignado = async (req, res) => {
  const clienteConsignadoExistente = await prisma.clientesConsignado.findFirst({
    where: {
      cpf: req.body.cpf,
    },
  });

  if (clienteConsignadoExistente) {
    return res
      .status(400)
      .json({ mensagem: "Já existe um cliente com o CPF informado" });
  }

  const clienteConsignado = await prisma.clientesConsignado.create({
    data: {
      nome: req.body.nome,
      cpf: req.body.cpf,
      referencia: req.body.referencia,
      pis_pasep: req.body.pis_pasep,
      carteira_identidade: req.body.carteira_identidade,
      cargo: req.body.cargo,
      regime_juridico: req.body.regime_juridico,
      situacao_funcionario: req.body.situacao_funcionario,
      tipo_cargo: req.body.tipo_cargo,
      valor_honorario: req.body.valor_honorario,
      descricao_honorario: req.body.descricao_honorario,
      status_honorario: req.body.status_honorario,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json("Cliente cadastrado com sucesso!");
};

export const atualizarClienteConsignado = async (req, res) => {
  const id = parseInt(req.params.id);

  console.log(req);

  const clienteConsignadoExistente = await prisma.clientesConsignado.findFirst({
    where: {
      cpf: req.body.cpf,
      id: { not: id },
    },
  });

  if (clienteConsignadoExistente) {
    return res
      .status(400)
      .json({ mensagem: "Já existe um cliente com o CPF informado" });
  }

  await prisma.clientesConsignado.update({    
    where: {
      id: id,
    },
    data: {      
      nome: req.body.nome,
      cpf: req.body.cpf,
      referencia: req.body.referencia,
      pis_pasep: req.body.pis_pasep,
      carteira_identidade: req.body.carteira_identidade,
      cargo: req.body.cargo,
      regime_juridico: req.body.regime_juridico,
      situacao_funcionario: req.body.situacao_funcionario,
      tipo_cargo: req.body.tipo_cargo,
      valor_honorario: req.body.valor_honorario,
      descricao_honorario: req.body.descricao_honorario,
      status_honorario: req.body.status_honorario,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json("Cliente atualizado com sucesso!");
};

export const excluirClienteConsignado = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.clientesConsignado.update({
    where: {
      id: id,
    },
    data: {
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  await prisma.clientesConsignado.delete({
    where: {
      id: id,
    },
  });

  return res.status(200).json("Cliente excluído com sucesso!");
};
