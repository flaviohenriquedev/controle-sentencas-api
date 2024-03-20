import { prisma } from "../../data/index.js";

export async function salvarNovaVerbaConsignado(verbaConsignado) {
  await prisma.verbasConsignado.create({
    data: {
      codigo_verba: verbaConsignado.codigo_verba,
      descricao: verbaConsignado.descricao,
      tipo: verbaConsignado.tipo,
      quantidade_atual: verbaConsignado.quantidade_atual,
      quantidade_total: verbaConsignado.quantidade_total,      
      valor: parseFloat(verbaConsignado.valor),
      desconto_obrigatorio_excecao_legal: verbaConsignado.desconto_obrigatorio_excecao_legal,
      clienteConsignadoId: verbaConsignado.clienteConsignadoId,      
      usuarioTransacaoId: verbaConsignado.usuarioTransacaoId,
    },
  });
}
