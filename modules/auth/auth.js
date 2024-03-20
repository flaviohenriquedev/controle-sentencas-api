import bcrypt from "bcrypt";

import {prisma} from "../../data/index.js";
import {encryptingPassword, enviarEmail, getToken,} from "../../services/util.js";

export const authChecked = async (req, res) => {
    res.status(200).json(true);
};

export const forgotPassword = async (req, res) => {
    try {
        const usuario = await prisma.usuarios.findUnique({
            where: {email: req.body.email},
        });

        if (usuario) {
            const newPassword = usuario.data_nascimento
                .replaceAll("-", "")
                .concat((Math.random() + 1).toString(36).substring(7));

            const hashedPassword = await encryptingPassword(newPassword);

            await prisma.usuarios.update({
                where: {
                    id: usuario.id,
                },
                data: {
                    password: hashedPassword,
                    usuarioTransacaoId: req?.auth?.usuario?.id ? req.auth.usuario.id : 2,
                },
            });

            enviarEmail({
                to: usuario.email,
                subject: `Esqueci Minha Senha - ${process.env.SISTEMA_NOME}`,
                html: `<h2>Olá, ${usuario.nome}!</h2>
          <h3>Esqueceu sua senha?</h3>
          <h3>Alteramos sua senha para que possa acessar o sistema <a href="${process.env.SISTEMA_HOST}">${process.env.SISTEMA_NOME}</a> e altere-a você mesmo para a senha que desejar, sua senha temporária é:</h3>
          <p><strong>Senha: </strong>${newPassword}</p>
          <h5>Caso você não tenha requerido a redefinição de senha, favor entrar em contato com o administrador do sistema!</h5>
          Att. ${process.env.SISTEMA_NOME} 😉!`,
                text: `Olá, ${usuario.nome}!

          Esqueceu sua senha?
          Alteramos sua senha para que possa acessar o sistema ${process.env.SISTEMA_NOME} e altere-a você mesmo para a senha que desejar, sua senha temporária é:
          Senha: ${newPassword}

          Caso você não tenha requerido a redefinição de senha, favor entrar em contato com o administrador do sistema!

          Att. ${process.env.SISTEMA_NOME} 😉!`,
            });
        }

        res.status(200).json("Foi encaminhado ao seu email, uma senha temporária.");
    } catch (error) {
        res.status(200).json("Foi encaminhado ao seu email, uma nova temporária.");
    }
};

export const login = async (req, res) => {
    let email, password;

    try {
        [email, password] = decodedBasicToken(req.headers.authorization);
    } catch (error) {
        res.status(400).json(error);
        return false;
    }

    try {
        const usuario = await prisma.usuarios.findUnique({
            where: {email},
        });

        if (!usuario) {
            res.status(404).json("Usuário ou senha incorretos.");
            return false;
        }

        if (!usuario.ativo) {
            res
                .status(401)
                .json("Usuário inativo, procure o administrador do sistema.");
            return false;
        }

        const passwordEqual = await bcrypt.compare(password, usuario.password);

        if (!passwordEqual) {
            res.status(404).json("Usuário ou senha não encontrados.");
            return false;
        }

        res.status(200).json(getToken(usuario));
    } catch (error) {
        res.status(500).json("Ops! Algo deu errado, tente novamente.");
    }
};

export class TokenTypeError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }
}

export const decodedBasicToken = (basicToken) => {
    const [type, credencials] = basicToken.split(" ");

    if (type !== "Basic") {
        throw new TokenTypeError("Wrong token type");
    }

    const decoded = Buffer.from(credencials, "base64").toString();
    const encoded = Buffer.from(decoded, "utf-8").toString("base64");

    if (encoded !== credencials) {
        throw new TokenTypeError("Wrong credentials is not correct encoded");
    }

    if (decoded.indexOf(":") === -1) {
        throw new TokenTypeError("Wrong credentials format");
    }

    return decoded.split(":");
};

export const getTokenRefreshed = async (req, res) => {
    try {
        const userId = parseInt(req.params.id)

        const usuario = await prisma.usuarios.findUnique({
            where: {id: userId},
        });

        res.status(200).json(getToken(usuario));
    } catch (error) {
        res.status(500).json("Ops! Algo deu errado na geração de um novo token.");
    }
}
