export const authCheckToken = async (req, res, next) => {
  try {
    if (!req?.headers["authorization"]) {
      res.status(401).json("unauthorized1");
      return false;
    }

    const token = req.headers["authorization"];

    if (token != process.env.UUID_TOKEN_SECRET_AUTHENTICATOR) {
      res.status(401).json("unauthorized2");
      return false;
    }
  } catch (error) {
    res.status(500).json("Ops! Algo deu errado tente novamente.");
    return false;
  }

  return next();
};
