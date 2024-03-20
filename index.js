import express from "express";
import cors from "cors";

import rotasAndamentos from "./routes/andamentos.js";
import rotasAuth from "./routes/auth.js";
import rotasClientes from "./routes/clientes.js";
import rotasComarcas from "./routes/comarcas.js";
import rotasDespachos from "./routes/despachos.js";
import rotasEmpresas from "./routes/empresas.js";
import rotasNaturezas from "./routes/naturezas.js";
import rotasProcessos from "./routes/processos.js";
import rotasProcessosFilhos from "./routes/processosFilhos.js";
import rotasUsuarios from "./routes/usuarios.js";
import rotasAdvogados from "./routes/advogados.js";
import rotasClientesConsignado from "./routes/clientesConsignado.js";
import rotasVerbasConsignado from "./routes/verbasConsignado.js";
import rotasClientesAuxilioMoradia from "./routes/clientesAuxilioMoradia.js";
import rotasContribuicoesAuxilioMoradia from "./routes/contribuicoesAuxilioMoradia.js";
import rotasAliquotasINSS from "./routes/aliquotasINSS.js";
import rotasIndicesINPC from "./routes/indicesINPC.js";
import rotasIndicesIPCAE from "./routes/indicesIPCAE.js";
import rotasIndicesSELIC from "./routes/indicesSELIC.js";
import rotasBancos from "./routes/bancos.js";

import rotasPerdComp from "./routes/perdComp.js";

import { authCheck } from "./middlewares/auth-check.js";
import { authCheckToken } from "./middlewares/auth-check-token.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: "*"}));

app.use("/auth", rotasAuth);

app.use("/andamentos", authCheck, rotasAndamentos);
app.use("/clientes", authCheck, rotasClientes);
app.use("/comarcas", authCheck, rotasComarcas);
app.use("/despachos", authCheck, rotasDespachos);
app.use("/empresas", authCheck, rotasEmpresas);
app.use("/naturezas", authCheck, rotasNaturezas);
app.use("/processos", authCheck, rotasProcessos);
app.use("/processosFilhos", authCheck, rotasProcessosFilhos);
app.use("/usuarios", authCheck, rotasUsuarios);
app.use("/advogados", authCheck, rotasAdvogados);
app.use("/clientesConsignado", authCheck, rotasClientesConsignado);
app.use("/clientesAuxilioMoradia", authCheck, rotasClientesAuxilioMoradia);
app.use("/verbasConsignado", authCheck, rotasVerbasConsignado);
app.use("/contribuicoesAuxilioMoradia", authCheck, rotasContribuicoesAuxilioMoradia);
app.use("/aliquotasINSS", authCheck, rotasAliquotasINSS);
app.use("/indicesINPC", authCheck, rotasIndicesINPC);
app.use("/indicesIPCAE", authCheck, rotasIndicesIPCAE);
app.use("/indicesSELIC", authCheck, rotasIndicesSELIC);
app.use("/bancos", authCheck, rotasBancos);

app.use("/perdcomp", authCheckToken, rotasPerdComp);

app.get("/", function (req, res) {
  res.send(process.env.PORT);
});

app.listen(process.env.PORT ? Number(process.env.PORT) : 3001);
