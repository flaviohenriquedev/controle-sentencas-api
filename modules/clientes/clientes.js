import { prisma } from "../../data/index.js";
import { getToken } from "../../services/util.js";

export const listarClientes = async (req, res) => {
  const { filtro, take, skip } = req.query;

  const clientes = await prisma.clientes.findMany({
    where: getClausulaWhere(filtro),
    take: take ? Number(take) : undefined,
    skip: skip ? Number(skip) : undefined,
    orderBy: {
      nome: "asc",
    },
  });

  const clientesCount = await prisma.clientes.count({
    where: getClausulaWhere(filtro),
  });

  return res.status(200).json({
    registros: clientes,
    quantRegistros: clientesCount,
    refreshToken: getToken(req.auth.usuario),
  });
};

export const listarClientesAutoComplete = async (req, res) => {
  const { filtro } = req.query;

  const clientes = await prisma.clientes.findMany({
    where: getClausulaWhere(filtro),
    take: 5,
    orderBy: {
      nome: "asc",
    },
  });

  const clientesRetorno = clientes.map((cliente) => ({
    codigo: cliente.id,
    descricao: `${cliente.cpf}-${cliente.nome}`,
  }));

  return res.status(200).json({
    registros: clientesRetorno,
    refreshToken: getToken(req.auth.usuario),
  });
};

const getClausulaWhere = (filtro) => {
  if (!filtro || (filtro && typeof filtro !== "string")) {
    return {};
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
        OR: [
          {
            nome: {
              contains: filtro,
              mode: "insensitive",
            },
          },
          {
            cpf: {
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
          filtroCpfFormatado
            ? {
                cpf: {
                  contains: filtroCpfFormatado,
                  mode: "insensitive",
                },
              }
            : {},
        ],
      }
    : {};

  return whereClause;
};

export const adicionarCliente = async (req, res) => {
  const clienteExistente = await prisma.clientes.findUnique({
    where: {
      cpf: req.body.cpf,
    },
  });

  if (clienteExistente) {
    return res.status(400).json({
      mensagem: "Já existe um cliente com o CPF informado!",
      refreshToken: getToken(req.auth.usuario),
    });
  }

  const cliente = await prisma.clientes.create({
    data: {
      nome: req.body.nome,
      cpf: req.body.cpf,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Cliente criado com sucesso!",
    registro: cliente,
    refreshToken: getToken(req.auth.usuario),
  });
};

export const atualizarCliente = async (req, res) => {
  const id = parseInt(req.params.id);
  const { cpf } = req.body;

  const clienteExistente = await prisma.clientes.findFirst({
    where: {
      cpf: cpf,
      id: { not: id },
    },
  });

  if (clienteExistente) {
    return res.status(400).json({
      mensagem: "Já existe cliente com o CPF informado!",
      refreshToken: getToken(req.auth.usuario),
    });
  }

  const cliente = await prisma.clientes.update({
    where: {
      id: id,
    },
    data: {
      nome: req.body.nome,
      cpf: req.body.cpf,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Cliente alterado com sucesso!",
    registro: cliente,
    refreshToken: getToken(req.auth.usuario),
  });
};

export const excluirCliente = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.clientes.delete({
    where: {
      id: id,
    },
  });

  return res.status(200).json({
    mensagem: "Cliente excluído com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};
