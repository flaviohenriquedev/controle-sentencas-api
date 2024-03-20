import { prisma } from "../../data/index.js";

export async function salvarNovaContribuicaoAuxilioMoradia(registro) {
  await prisma.contribuicoesAuxilioMoradia.create({
    data: {
      clienteAuxilioMoradiaId: registro.clienteAuxilioMoradiaId,
      ano: registro.ano,
      mes: registro.mes,
      base: registro.base,
      empresa: registro.empresa,
      valorAuxilioMoradia: registro.valorAuxilioMoradia,
      valorRecebidoAuxilioMoradia: registro.valorRecebidoAuxilioMoradia,
      usuarioTransacaoId: registro.usuarioTransacaoId,
    },
  });
}
