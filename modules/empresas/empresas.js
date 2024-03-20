import { prisma } from "../../data/index.js";
import { getToken } from "../../services/util.js";

export const listarEmpresas = async (req, res) => {
  const { filtro, take, skip } = req.query;

  const empresas = await prisma.empresas.findMany({
    where: getClausulaWhere(filtro, false),
    take: take ? Number(take) : undefined,
    skip: skip ? Number(skip) : undefined,
    orderBy: {
      nome: "asc",
    },
  });

  const empresasCount = await prisma.empresas.count({
    where: getClausulaWhere(filtro, false),
  });

  return res.status(200).json({
    registros: empresas,
    quantRegistros: empresasCount,
    refreshToken: getToken(req.auth.usuario),
  });
};

export const listarEmpresasAutoComplete = async (req, res) => {
  const { filtro } = req.query;

  const empresas = await prisma.empresas.findMany({
    where: getClausulaWhere(filtro, true),
    take: 5,
    orderBy: {
      nome: "asc",
    },
  });

  const empresasRetorno = empresas.map((empresa) => ({
    codigo: empresa.id,
    descricao: empresa.nome,
  }));

  return res.status(200).json({
    registros: empresasRetorno,
    refreshToken: getToken(req.auth.usuario),
  });
};

const getClausulaWhere = (filtro, isSomenteAtivos) => {
  if (!filtro || (filtro && typeof filtro !== "string")) {
    return {};
  }

  const whereClause = filtro
    ? {
        AND: [
          isSomenteAtivos
            ? {
                ativo: true,
              }
            : {},
        ],
        OR: [
          {
            nome: {
              contains: filtro,
              mode: "insensitive",
            },
          },
        ],
      }
    : {};

  return whereClause;
};

export const adicionarEmpresa = async (req, res) => {
  const nome = req.body.nome;

  const empresaExistente = await prisma.empresas.findUnique({
    where: {
      nome: nome,
    },
  });

  if (empresaExistente) {
    return res.status(400).json({
      mensagem: "Já existe uma empresa com o nome informado!",
      refreshToken: getToken(req.auth.usuario),
    });
  }

  await prisma.empresas.create({
    data: {
      nome: req.body.nome,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Empresa criada com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const atualizarEmpresa = async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome } = req.body;

  const empresaExistente = await prisma.empresas.findFirst({
    where: {
      nome: nome,
      id: { not: id },
    },
  });

  if (empresaExistente) {
    return res.status(400).send({
      mensagem: "Já existe uma empresa com o nome informado!",
      refreshToken: getToken(req.auth.usuario),
    });
  }

  await prisma.empresas.update({
    where: {
      id: id,
    },
    data: {
      nome: req.body.nome,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Empresa alterada com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const excluirEmpresa = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.empresas.delete({
    where: {
      id: id,
    },
  });

  return res.status(200).json({
    mensagem: "Empresa excluída com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const ativarEmpresa = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.empresas.update({
    where: {
      id,
    },
    data: {
      ativo: true,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Empresa ativado com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const inativarEmpresa = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.empresas.update({
    where: {
      id,
    },
    data: {
      ativo: false,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Empresa inativado com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};
