import { prisma } from "../../data/index.js";
import { getToken } from "../../services/util.js";

export const listarComarcas = async (req, res) => {
  const { filtro, take, skip } = req.query;

  const comarcas = await prisma.comarcas.findMany({
    where: getClausulaWhere(filtro, false),
    take: take ? Number(take) : undefined,
    skip: skip ? Number(skip) : undefined,
    orderBy: {
      descricao: "asc",
    },
  });

  const comarcasCount = await prisma.comarcas.count({
    where: getClausulaWhere(filtro, false),
  });

  return res.status(200).json({
    registros: comarcas,
    quantRegistros: comarcasCount,
    refreshToken: getToken(req.auth.usuario),
  });
};

export const listarComarcasAutoComplete = async (req, res) => {
  const { filtro } = req.query;

  const comarcas = await prisma.comarcas.findMany({
    where: getClausulaWhere(filtro, true),
    take: 5,
    orderBy: {
      descricao: "asc",
    },
  });

  const comarcasRetorno = comarcas.map((comarca) => ({
    codigo: comarca.id,
    descricao: comarca.descricao,
  }));

  return res.status(200).json({
    registros: comarcasRetorno,
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
            descricao: {
              contains: filtro,
              mode: "insensitive",
            },
          },
          {
            municipio: {
              contains: filtro,
              mode: "insensitive",
            },
          },
          {
            estado: {
              contains: filtro,
              mode: "insensitive",
            },
          },
          {
            tipo: {
              contains: filtro,
              mode: "insensitive",
            },
          },
        ],
      }
    : {};

  return whereClause;
};

export const adicionarComarca = async (req, res) => {
  await prisma.comarcas.create({
    data: {
      municipio: req.body.municipio,
      estado: req.body.estado,
      descricao: req.body.descricao,
      tipo: req.body.tipo,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Comarca criada com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const atualizarComarca = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.comarcas.update({
    where: {
      id: id,
    },
    data: {
      municipio: req.body.municipio,
      estado: req.body.estado,
      descricao: req.body.descricao,
      tipo: req.body.tipo,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Comarca atualizada com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const ativarComarca = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.comarcas.update({
    where: {
      id: id,
    },
    data: {
      ativo: true,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Comarca ativada com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const inativarComarca = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.comarcas.update({
    where: {
      id: id,
    },
    data: {
      ativo: false,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json({
    mensagem: "Comarca inativada com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};

export const excluirComarca = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.comarcas.update({
    where: {
      id: id,
    },
    data: {
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  await prisma.comarcas.delete({
    where: {
      id: id,
    },
  });

  return res.status(200).json({
    mensagem: "Comarca excluida com sucesso!",
    refreshToken: getToken(req.auth.usuario),
  });
};
