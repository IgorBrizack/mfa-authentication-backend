import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./db/connection";

export const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("DataSource inicializado.");
    // Lógica adicional, como iniciar o servidor
  })
  .catch((error) => {
    console.error("Erro ao inicializar o DataSource:", error);
  });

app.get("/", (req, res) => {
  res.send("API está funcionando!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
