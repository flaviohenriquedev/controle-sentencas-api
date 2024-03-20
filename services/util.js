import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {omit} from "ramda";
import nodemailer from "nodemailer";

export const adicionarZeroAEsquerda = (number, digits) => {
    if (typeof number !== "number" || typeof digits !== "number") {
        throw new Error("Os parâmetros devem ser números!");
    }

    if (digits < 1) {
        throw new Error("A quantidade de dígitos deve ser pelo menos 1!");
    }

    const formattedNumber = String(number).padStart(digits, "0");
    return formattedNumber;
};

export const formatarData = (date, format) => {
    if (!(date instanceof Date) || typeof format !== "string") {
        throw new Error(
            "Os parâmetros devem ser uma instância de Date e uma string!"
        );
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    const formattedDate = format
        .replace("yyyy", year)
        .replace("MM", month)
        .replace("dd", day)
        .replace("HH", hours)
        .replace("mm", minutes)
        .replace("ss", seconds);

    return formattedDate;
};

export const enviarEmail = ({to, subject, html, text, res}) => {
    const transport = nodemailer.createTransport({
        host: process.env.HOST_SMTP,
        port: process.env.PORT_SMTP,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    transport
        .sendMail({
            from: `${process.env.SISTEMA_NOME} <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
            text,
        })
        .then(() => {
        })
        .catch((error) => {
            console.error("Erro Metodo enviarEmail", error);
            return res.status(500).json("Ops! Algo deu errado tente novamente.");
        });
};

export const encryptingPassword = async (password) => {
    const saltRounds = 10;

    return await bcrypt.hash(password, saltRounds);
};

export const extrairNomePrimeiraLetraSobrenome = (nome) => {
    if (typeof nome !== "string" || nome.trim() === "") {
        return "Nome Usuário";
    }

    const partesNome = nome.split(" ");
    const primeiroNome = partesNome[0];
    let primeiraLetraSobrenome = "";

    if (partesNome.length >= 2) {
        const sobrenome = partesNome[1];
        primeiraLetraSobrenome = sobrenome[0];
    }

    if (primeiraLetraSobrenome === "") {
        return primeiroNome;
    }

    return primeiroNome + " " + primeiraLetraSobrenome;
};

export const getToken = (usuario) => {
    const token = jwt.sign(
        {
            sub: usuario.id,
            nome: usuario.nome,
            iat: Math.floor(Date.now() / 1000) - 30,
            exp: Math.floor(Date.now() / 1000) + 3600,
        },
        process.env.JWT_SECRET
    );
    return {
        usuario: omit(["password"], usuario),
        token,
        expira: Math.floor(Date.now() / 1000) + 3600,
        nomeUsuario: extrairNomePrimeiraLetraSobrenome(usuario.nome),
    };
};
