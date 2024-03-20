import { prisma } from "../../data/index.js";

export async function salvarNovoDespacho(despacho) {
  await prisma.despachos.create({
    data: {
      dataDespacho: despacho.dataDespacho,
      observacao: despacho.observacao,
      dataValidade: despacho.dataValidade,
      processoId: despacho.processoId,
      andamentoId: despacho.andamentoId,
      usuarioTransacaoId: despacho.usuarioTransacaoId,
    },
  });
}
