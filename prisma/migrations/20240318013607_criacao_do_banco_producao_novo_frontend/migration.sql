-- CreateEnum
CREATE TYPE "tipoVerba" AS ENUM ('PROVENTO', 'DESCONTO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "usuarioTransacaoId" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advogados" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "usuarioTransacaoId" INTEGER NOT NULL,

    CONSTRAINT "advogados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "naturezas" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "usuarioTransacaoId" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "naturezas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "andamentos" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "usuarioTransacaoId" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "andamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "usuarioTransacaoId" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "usuarioTransacaoId" INTEGER NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comarcas" (
    "id" SERIAL NOT NULL,
    "municipio" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "usuarioTransacaoId" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "comarcas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processos" (
    "id" SERIAL NOT NULL,
    "numeroProcessoPrincipal" TEXT NOT NULL,
    "tipoProcessoPrincipal" TEXT NOT NULL,
    "dataIntimacao" TEXT,
    "dataSentenca" TEXT,
    "dataPagamentoProcessoPrincipal" TEXT,
    "dataInicioBeneficio" TEXT,
    "dataInicioPagamentoBeneficio" TEXT,
    "valorRendaMensalInicial" DOUBLE PRECISION,
    "observacoesProcessoPrincipal" TEXT,
    "numeroProcessoFilho" TEXT,
    "tipoProcessoFilho" TEXT,
    "dataPagamentoProcessoFilho" TEXT,
    "valorProcessoFilho" DOUBLE PRECISION,
    "valorHonorariosProcessoFilho" DOUBLE PRECISION,
    "banco" TEXT,
    "observacoesProcessoFilho" TEXT,
    "naturezaId" INTEGER NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "advogadoId" INTEGER NOT NULL,
    "comarcaProcessoPrincipalId" INTEGER NOT NULL,
    "comarcaProcessoFilhoId" INTEGER,
    "usuarioTransacaoId" INTEGER NOT NULL,
    "processoPrincipalId" INTEGER,

    CONSTRAINT "processos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "despachos" (
    "id" SERIAL NOT NULL,
    "dataDespacho" TEXT NOT NULL,
    "observacao" TEXT NOT NULL,
    "processoId" INTEGER NOT NULL,
    "andamentoId" INTEGER NOT NULL,
    "usuarioTransacaoId" INTEGER NOT NULL,
    "dataValidade" TEXT,

    CONSTRAINT "despachos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientesConsignado" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "referencia" TEXT,
    "pis_pasep" TEXT,
    "carteira_identidade" TEXT,
    "cargo" TEXT,
    "regime_juridico" TEXT,
    "situacao_funcionario" TEXT,
    "tipo_cargo" TEXT,
    "valor_honorario" DOUBLE PRECISION,
    "descricao_honorario" TEXT,
    "status_honorario" BOOLEAN,
    "usuarioTransacaoId" INTEGER NOT NULL,

    CONSTRAINT "clientesConsignado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verbasConsignado" (
    "id" SERIAL NOT NULL,
    "codigo_verba" TEXT,
    "descricao" TEXT NOT NULL,
    "tipo" "tipoVerba" NOT NULL,
    "quantidade_atual" INTEGER,
    "quantidade_total" INTEGER,
    "valor" DOUBLE PRECISION NOT NULL,
    "desconto_obrigatorio_excecao_legal" BOOLEAN NOT NULL DEFAULT false,
    "clienteConsignadoId" INTEGER NOT NULL,
    "usuarioTransacaoId" INTEGER NOT NULL,

    CONSTRAINT "verbasConsignado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aliquotaINSS" (
    "id" SERIAL NOT NULL,
    "ano" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "aliquota" DOUBLE PRECISION NOT NULL,
    "faixa" DOUBLE PRECISION NOT NULL,
    "teto" DOUBLE PRECISION NOT NULL,
    "tetoCooperativa" DOUBLE PRECISION NOT NULL,
    "usuarioTransacaoId" INTEGER NOT NULL,

    CONSTRAINT "aliquotaINSS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indiceINPC" (
    "id" SERIAL NOT NULL,
    "ano" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "usuarioTransacaoId" INTEGER NOT NULL,

    CONSTRAINT "indiceINPC_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indiceIPCAE" (
    "id" SERIAL NOT NULL,
    "ano" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "usuarioTransacaoId" INTEGER NOT NULL,

    CONSTRAINT "indiceIPCAE_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indiceSELIC" (
    "id" SERIAL NOT NULL,
    "ano" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "usuarioTransacaoId" INTEGER NOT NULL,

    CONSTRAINT "indiceSELIC_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientesAuxilioMoradia" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "pis" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "dataNascimento" TEXT,
    "honorariosSucumbenciais" DOUBLE PRECISION,
    "textoImportado" TEXT,
    "dataInicioAuxilioMoradia" TEXT,
    "dataFimAuxilioMoradia" TEXT,
    "dataCitacaoAuxilioMoradia" TEXT,
    "usuarioTransacaoId" INTEGER NOT NULL,

    CONSTRAINT "clientesAuxilioMoradia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contribuicoesAuxilioMoradia" (
    "id" SERIAL NOT NULL,
    "clienteAuxilioMoradiaId" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "base" DOUBLE PRECISION NOT NULL,
    "empresa" TEXT NOT NULL,
    "valorAuxilioMoradia" DOUBLE PRECISION NOT NULL,
    "valorRecebidoAuxilioMoradia" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "indiceINPC" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorCorrecaoINPC" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "indiceIPCAE" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorCorrecaoIPCAE" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "indiceSELIC" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "valorCorrecaoSELIC" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "usuarioTransacaoId" INTEGER NOT NULL,

    CONSTRAINT "contribuicoesAuxilioMoradia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientesRestituicao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "pis" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "dataNascimento" TEXT,
    "dataProcesso" TEXT,
    "dataSentenca" TEXT,
    "dataInicioContribuicoes" TEXT NOT NULL,
    "honorariosSucumbenciais" DOUBLE PRECISION,
    "bancoId" TEXT,
    "agencia" TEXT,
    "tipoContaBancaria" TEXT,
    "numeroContaBancaria" TEXT,
    "digitoContaBancaria" TEXT,
    "ddd" INTEGER,
    "telefone" INTEGER,
    "senhaECAC" TEXT,
    "usuarioTransacaoId" INTEGER NOT NULL,
    "textoImportado" TEXT,

    CONSTRAINT "clientesRestituicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contribuicoesRestituicao" (
    "id" SERIAL NOT NULL,
    "clienteRestituicaoId" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "empresa" TEXT NOT NULL,
    "base" DOUBLE PRECISION NOT NULL,
    "aliquotaINSS" DOUBLE PRECISION NOT NULL,
    "valorDesconto" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "beneficio" BOOLEAN,
    "rpps" BOOLEAN,
    "cooperativa" BOOLEAN,
    "contribuinteIndividual11" BOOLEAN,
    "contribuinteIndividual20" BOOLEAN,
    "contribuicaoPersonalizada" BOOLEAN,
    "dataPagamentoGPS" TEXT,
    "mei" BOOLEAN,
    "usuarioTransacaoId" INTEGER NOT NULL,

    CONSTRAINT "contribuicoesRestituicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bancos" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "usuarioTransacaoId" INTEGER NOT NULL,

    CONSTRAINT "bancos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "advogados_nome_key" ON "advogados"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "naturezas_descricao_key" ON "naturezas"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "andamentos_descricao_key" ON "andamentos"("descricao");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_nome_key" ON "empresas"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_cpf_key" ON "clientes"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "clientesConsignado_cpf_key" ON "clientesConsignado"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "clientesConsignado_pis_pasep_key" ON "clientesConsignado"("pis_pasep");

-- CreateIndex
CREATE UNIQUE INDEX "clientesAuxilioMoradia_pis_key" ON "clientesAuxilioMoradia"("pis");

-- CreateIndex
CREATE UNIQUE INDEX "clientesAuxilioMoradia_cpf_key" ON "clientesAuxilioMoradia"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "bancos_codigo_key" ON "bancos"("codigo");

-- AddForeignKey
ALTER TABLE "advogados" ADD CONSTRAINT "advogados_usuarioTransacaoId_fkey" FOREIGN KEY ("usuarioTransacaoId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "naturezas" ADD CONSTRAINT "naturezas_usuarioTransacaoId_fkey" FOREIGN KEY ("usuarioTransacaoId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "andamentos" ADD CONSTRAINT "andamentos_usuarioTransacaoId_fkey" FOREIGN KEY ("usuarioTransacaoId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_usuarioTransacaoId_fkey" FOREIGN KEY ("usuarioTransacaoId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_usuarioTransacaoId_fkey" FOREIGN KEY ("usuarioTransacaoId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comarcas" ADD CONSTRAINT "comarcas_usuarioTransacaoId_fkey" FOREIGN KEY ("usuarioTransacaoId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processos" ADD CONSTRAINT "processos_naturezaId_fkey" FOREIGN KEY ("naturezaId") REFERENCES "naturezas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processos" ADD CONSTRAINT "processos_comarcaProcessoPrincipalId_fkey" FOREIGN KEY ("comarcaProcessoPrincipalId") REFERENCES "comarcas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processos" ADD CONSTRAINT "processos_comarcaProcessoFilhoId_fkey" FOREIGN KEY ("comarcaProcessoFilhoId") REFERENCES "comarcas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processos" ADD CONSTRAINT "processos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processos" ADD CONSTRAINT "processos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processos" ADD CONSTRAINT "processos_advogadoId_fkey" FOREIGN KEY ("advogadoId") REFERENCES "advogados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processos" ADD CONSTRAINT "processos_usuarioTransacaoId_fkey" FOREIGN KEY ("usuarioTransacaoId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "despachos" ADD CONSTRAINT "despachos_processoId_fkey" FOREIGN KEY ("processoId") REFERENCES "processos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "despachos" ADD CONSTRAINT "despachos_andamentoId_fkey" FOREIGN KEY ("andamentoId") REFERENCES "andamentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientesConsignado" ADD CONSTRAINT "clientesConsignado_usuarioTransacaoId_fkey" FOREIGN KEY ("usuarioTransacaoId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verbasConsignado" ADD CONSTRAINT "verbasConsignado_usuarioTransacaoId_fkey" FOREIGN KEY ("usuarioTransacaoId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verbasConsignado" ADD CONSTRAINT "verbasConsignado_clienteConsignadoId_fkey" FOREIGN KEY ("clienteConsignadoId") REFERENCES "clientesConsignado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aliquotaINSS" ADD CONSTRAINT "aliquotaINSS_usuarioTransacaoId_fkey" FOREIGN KEY ("usuarioTransacaoId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indiceINPC" ADD CONSTRAINT "indiceINPC_usuarioTransacaoId_fkey" FOREIGN KEY ("usuarioTransacaoId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indiceIPCAE" ADD CONSTRAINT "indiceIPCAE_usuarioTransacaoId_fkey" FOREIGN KEY ("usuarioTransacaoId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indiceSELIC" ADD CONSTRAINT "indiceSELIC_usuarioTransacaoId_fkey" FOREIGN KEY ("usuarioTransacaoId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientesAuxilioMoradia" ADD CONSTRAINT "clientesAuxilioMoradia_usuarioTransacaoId_fkey" FOREIGN KEY ("usuarioTransacaoId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contribuicoesAuxilioMoradia" ADD CONSTRAINT "contribuicoesAuxilioMoradia_usuarioTransacaoId_fkey" FOREIGN KEY ("usuarioTransacaoId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contribuicoesAuxilioMoradia" ADD CONSTRAINT "contribuicoesAuxilioMoradia_clienteAuxilioMoradiaId_fkey" FOREIGN KEY ("clienteAuxilioMoradiaId") REFERENCES "clientesAuxilioMoradia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientesRestituicao" ADD CONSTRAINT "clientesRestituicao_usuarioTransacaoId_fkey" FOREIGN KEY ("usuarioTransacaoId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientesRestituicao" ADD CONSTRAINT "clientesRestituicao_bancoId_fkey" FOREIGN KEY ("bancoId") REFERENCES "bancos"("codigo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contribuicoesRestituicao" ADD CONSTRAINT "contribuicoesRestituicao_usuarioTransacaoId_fkey" FOREIGN KEY ("usuarioTransacaoId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contribuicoesRestituicao" ADD CONSTRAINT "contribuicoesRestituicao_clienteRestituicaoId_fkey" FOREIGN KEY ("clienteRestituicaoId") REFERENCES "clientesRestituicao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bancos" ADD CONSTRAINT "bancos_usuarioTransacaoId_fkey" FOREIGN KEY ("usuarioTransacaoId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


--Atualizando sequence das tabelas
select setval('usuarios_id_seq', (select max(id) from usuarios) + 1);
select setval('advogados_id_seq', (select max(id) from advogados) + 1);
select setval('naturezas_id_seq', (select max(id) from naturezas) + 1);
select setval('andamentos_id_seq', (select max(id) from andamentos) + 1);
select setval('empresas_id_seq', (select max(id) from empresas) + 1);
select setval('clientes_id_seq', (select max(id) from clientes) + 1);
select setval('comarcas_id_seq', (select max(id) from comarcas) + 1);
select setval('processos_id_seq', (select max(id) from processos) + 1);
select setval('despachos_id_seq', (select max(id) from despachos) + 1);
--select setval("clientesConsignado_id_seq", (select max(id) from "clientesConsignado") + 1);
--select setval('verbasConsignado_id_seq', (select max(id) from "verbasConsignado") + 1);
--select setval('aliquotaINSS_id_seq', (select max(id) from "aliquotaINSS") + 1);
--select setval('indiceINPC_id_seq', (select max(id) from "indiceINPC") + 1);
--select setval('indiceIPCAE_id_seq', (select max(id) from "indiceIPCAE") + 1);
--select setval('indiceSELIC_id_seq', (select max(id) from "indiceSELIC") + 1);
--select setval('clientesAuxilioMoradia_id_seq', (select max(id) from "clientesAuxilioMoradia") + 1);
--select setval('contribuicoesAuxilioMoradia_id_seq', (select max(id) from "contribuicoesAuxilioMoradia") + 1);
--select setval('clientesRestituicao_id_seq', (select max(id) from "clientesRestituicao") + 1);
--select setval('contribuicoesRestituicao_id_seq', (select max(id) from "contribuicoesRestituicao") + 1);
select setval('bancos_id_seq', (select max(id) from bancos) + 1);