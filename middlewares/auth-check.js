import jwt from "jsonwebtoken";

import { prisma } from "../data/index.js";

const decodedBearerToken = (bearerToken) => {
  const [type, token] = bearerToken.split(" ");

  if (type !== "Bearer") {
    return false;
  }

  return jwt.verify(token, process.env.JWT_SECRET);
};

export const authCheck = async (req, res, next) => {
  try {
    if (!req?.headers["authorization"]) {
      res.status(401).json("unauthorized");
      return false;
    }

    const decodedToken = decodedBearerToken(req.headers["authorization"]);

    if (!decodedToken?.sub) {
      res.status(401).json("unauthorized");
      return false;
    }

    const usuario = await prisma.usuarios.findUnique({
      where: { id: decodedToken.sub },
    });

    if (!usuario) {
      res.status(401).json("unauthorized");
      return false;
    }

    req.auth = {
      usuario,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json("unauthorized");
      return false;
    } else {
      res.status(500).json("Ops! Algo deu errado tente novamente.");
      return false;
    }
  }

  return next();
};
