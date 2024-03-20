import { prisma } from "../../data/index.js";

export const listarClientesAuxilioMoradia = async (req, res) => {
  const queryFiltro = req.query.filtro;

  if (queryFiltro) {
    const filtro = "%" + queryFiltro + "%";
    const filtroCpf =
      "%" + queryFiltro.replaceAll(".", "").replaceAll("-", "") + "%";

    const clientesAuxilioMoradia = await prisma.clientesAuxilioMoradia.findMany({
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
          {
            pis: {
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

    return res.status(200).json(clientesAuxilioMoradia);
  } else {
    const clientesAuxilioMoradia = await prisma.clientesAuxilioMoradia.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return res.status(200).json(clientesAuxilioMoradia);
  }
};

export const adicionarClienteAuxilioMoradia = async (req, res) => {
  const clienteAuxilioMoradiaExistente = await prisma.clientesAuxilioMoradia.findFirst({
    where: {
      OR: [
        {
          cpf: req.body.cpf,
        }, 
        {
          pis: req.body.pis,
        }
      ]        
    }
  })

  if (clienteAuxilioMoradiaExistente) {
    return res
      .status(400)
      .json({ mensagem: "Já existe um cliente com o CPF e/ou PIS informado" });
  }
    
  const clienteAuxilioMoradia = await prisma.clientesAuxilioMoradia.create({
    data: {
      nome: req.body.nome,
      pis: req.body.pis,
      cpf: req.body.cpf,
      dataNascimento: req.body.dataNascimento,
      honorariosSucumbenciais: req.body.honorariosSucumbenciais,
      textoImportado: req.body.textoImportado,
      dataInicioAuxilioMoradia: req.body.dataInicioAuxilioMoradia,
      dataFimAuxilioMoradia: req.body.dataFimAuxilioMoradia,
      dataCitacaoAuxilioMoradia: req.body.dataCitacaoAuxilioMoradia,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json("Cliente cadastrado com sucesso!");
};

export const atualizarClienteAuxilioMoradia = async (req, res) => {
  const id = parseInt(req.params.id);  

  const clienteAuxilioMoradiaExistente = await prisma.clientesAuxilioMoradia.findFirst({
    where: {
      OR: [
        {
          cpf: req.body.cpf,
          id: { not: id },
        },
        {
          pis: req.body.pis,
          id: { not: id }, 
        },
      ]      
    },
  });

  if (clienteAuxilioMoradiaExistente) {
    return res
      .status(400)
      .json({ mensagem: "Já existe um cliente com o CPF e/ou PIS informado" });
  }

  await prisma.clientesAuxilioMoradia.update({
    where: {
      id: id,
    },
    data: {
      nome: req.body.nome,
      pis: req.body.pis,
      cpf: req.body.cpf,
      dataNascimento: req.body.dataNascimento,
      honorariosSucumbenciais: req.body.honorariosSucumbenciais,
      textoImportado: req.body.textoImportado,
      dataInicioAuxilioMoradia: req.body.dataInicioAuxilioMoradia,
      dataFimAuxilioMoradia: req.body.dataFimAuxilioMoradia,
      dataCitacaoAuxilioMoradia: req.body.dataCitacaoAuxilioMoradia,
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  return res.status(200).json("Cliente atualizado com sucesso!");
};

export const excluirClienteAuxilioMoradia = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.clientesAuxilioMoradia.update({
    where: {
      id: id,
    },
    data: {
      usuarioTransacaoId: req.auth.usuario.id,
    },
  });

  await prisma.clientesAuxilioMoradia.delete({
    where: {
      id: id,
    },
  });

  return res.status(200).json("Cliente excluído com sucesso!");
};
