import express, { Request, Response } from "express";
import db, { inicializarBanco } from "./database";

const app = express();

app.use(express.json());

// Inicializa o banco quando o servidor começa
inicializarBanco();


// ==========================================
// POST /api/livros
// Criar livro
// ==========================================

app.post("/api/livros", (req: Request, res: Response) => {
  try {
    const { titulo, autor, status, categoria } = req.body;

    // Verifica se os campos obrigatórios existem
    if (
      typeof titulo !== "string" ||
      typeof autor !== "string" ||
      typeof categoria !== "string"
    ) {
      return res.status(400).json({
        erro: "Título, autor e categoria são obrigatórios."
      });
    }

    // Sanitização com trim()
    const tituloTratado = titulo.trim();
    const autorTratado = autor.trim();
    const categoriaTratada = categoria.trim();

    // Validação do título
    if (tituloTratado.length < 4) {
      return res.status(400).json({
        erro: "O título deve possuir pelo menos 4 caracteres."
      });
    }

    // Validação do autor
    if (autorTratado.length < 4) {
      return res.status(400).json({
        erro: "O autor deve possuir pelo menos 4 caracteres."
      });
    }

    // Validação da categoria
    if (categoriaTratada.length === 0) {
      return res.status(400).json({
        erro: "A categoria não pode ser vazia."
      });
    }

    // Status padrão
    let statusTratado = "disponível";

    if (typeof status === "string") {
      const statusRecebido = status.trim().toLowerCase();

      if (
        statusRecebido === "disponível" ||
        statusRecebido === "emprestado"
      ) {
        statusTratado = statusRecebido;
      }
    }

    // Prepared Statement
    const stmt = db.prepare(`
      INSERT INTO livros (
        titulo,
        autor,
        status,
        categoria
      )
      VALUES (?, ?, ?, ?)
    `);

    const resultado = stmt.run(
      tituloTratado,
      autorTratado,
      statusTratado,
      categoriaTratada
    );

    // Busca o livro recém-criado
    const livroCriado = db
      .prepare(`
        SELECT id, titulo, autor, status, categoria
        FROM livros
        WHERE id = ?
      `)
      .get(resultado.lastInsertRowid);

    return res.status(201).json(livroCriado);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro interno ao cadastrar livro."
    });
  }
});


// ==========================================
// GET /api/livros
// Listar livros
// ==========================================

app.get("/api/livros", (req: Request, res: Response) => {
  try {
    const search = req.query.search;

    // Caso não exista busca
    if (search === undefined) {
      const livros = db
        .prepare(`
          SELECT id, titulo, autor, status, categoria
          FROM livros
          ORDER BY id
        `)
        .all();

      return res.status(200).json(livros);
    }

    // Validação do search
    if (typeof search !== "string") {
      return res.status(400).json({
        erro: "O parâmetro search deve ser um texto."
      });
    }

    const busca = search.trim();

    // Prepared Statement + LIKE
    const livros = db
      .prepare(`
        SELECT id, titulo, autor, status, categoria
        FROM livros
        WHERE titulo LIKE ?
           OR autor LIKE ?
           OR categoria LIKE ?
        ORDER BY id
      `)
      .all(
        `%${busca}%`,
        `%${busca}%`,
        `%${busca}%`
      );

    return res.status(200).json(livros);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro interno ao listar livros."
    });
  }
});


// ==========================================
// Inicialização
// ==========================================

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});