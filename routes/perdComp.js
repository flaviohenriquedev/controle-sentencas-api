import express from "express";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const criarPasta = (caminho) => {
  try {
    fs.mkdirSync(caminho, { recursive: true });
  } catch (error) {
    console.error(`Erro ao criar pasta ${caminho}: ${error.message}`);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destFolder = join(
      __dirname,
      "..",
      "docs",
      "pdfs-perdcomp",
      req.params.idCapacalc,      
    );

    criarPasta(destFolder);
    cb(null, destFolder);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
const router = express.Router();

router.post(
  "/salvar-arquivos-pdf/:idCapacalc",
  upload.single("pdf"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).send("Nenhum arquivo enviado.");
    }

    console.log(`Recebido arquivo ${req.file.originalname}`);

    res.status(200).send("Arquivo recebido com sucesso!");
  }
);

export default router;
