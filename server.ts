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

app.put("/api/livros/:id", (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        erro: "O ID deve ser um número inteiro positivo."
      });
    }

    const livroExistente = db
      .prepare(`
        SELECT id, titulo, autor, status, categoria
        FROM livros
        WHERE id = ?
      `)
      .get(id);

    if (!livroExistente) {
      return res.status(404).json({
        erro: "Livro não encontrado."
      });
    }

    const { titulo, autor, status, categoria } = req.body;

    if (
      typeof titulo !== "string" ||
      typeof autor !== "string" ||
      typeof categoria !== "string"
    ) {
      return res.status(400).json({
        erro: "Título, autor e categoria são obrigatórios."
      });
    }

    const tituloTratado = titulo.trim();
    const autorTratado = autor.trim();
    const categoriaTratada = categoria.trim();

    if (tituloTratado.length < 4) {
      return res.status(400).json({
        erro: "O título deve possuir pelo menos 4 caracteres."
      });
    }

    if (autorTratado.length < 4) {
      return res.status(400).json({
        erro: "O autor deve possuir pelo menos 4 caracteres."
      });
    }

    if (categoriaTratada.length === 0) {
      return res.status(400).json({
        erro: "A categoria não pode ser vazia."
      });
    }

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

    db.prepare(`
      UPDATE livros
      SET titulo = ?,
          autor = ?,
          status = ?,
          categoria = ?
      WHERE id = ?
    `).run(
      tituloTratado,
      autorTratado,
      statusTratado,
      categoriaTratada,
      id
    );

    const livroAtualizado = db
      .prepare(`
        SELECT id, titulo, autor, status, categoria
        FROM livros
        WHERE id = ?
      `)
      .get(id);

    return res.status(200).json(livroAtualizado);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro interno ao atualizar livro."
    });
  }
});

app.patch("/api/livros/:id", (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        erro: "O ID deve ser um número inteiro positivo."
      });
    }

    const livroExistente = db
      .prepare(`
        SELECT id, titulo, autor, status, categoria
        FROM livros
        WHERE id = ?
      `)
      .get(id);

    if (!livroExistente) {
      return res.status(404).json({
        erro: "Livro não encontrado."
      });
    }

    const campos: string[] = [];
    const valores: string[] = [];

    if (req.body.titulo !== undefined) {
      if (typeof req.body.titulo !== "string") {
        return res.status(400).json({
          erro: "O título deve ser um texto."
        });
      }

      const titulo = req.body.titulo.trim();

      if (titulo.length < 4) {
        return res.status(400).json({
          erro: "O título deve possuir pelo menos 4 caracteres."
        });
      }

      campos.push("titulo = ?");
      valores.push(titulo);
    }

    if (req.body.autor !== undefined) {
      if (typeof req.body.autor !== "string") {
        return res.status(400).json({
          erro: "O autor deve ser um texto."
        });
      }

      const autor = req.body.autor.trim();

      if (autor.length < 4) {
        return res.status(400).json({
          erro: "O autor deve possuir pelo menos 4 caracteres."
        });
      }

      campos.push("autor = ?");
      valores.push(autor);
    }

    if (req.body.status !== undefined) {
      if (typeof req.body.status !== "string") {
        return res.status(400).json({
          erro: "O status deve ser um texto."
        });
      }

      const status = req.body.status.trim().toLowerCase();

      if (
        status !== "disponível" &&
        status !== "emprestado"
      ) {
        return res.status(400).json({
          erro: "O status deve ser 'disponível' ou 'emprestado'."
        });
      }

      campos.push("status = ?");
      valores.push(status);
    }

    if (req.body.categoria !== undefined) {
      if (typeof req.body.categoria !== "string") {
        return res.status(400).json({
          erro: "A categoria deve ser um texto."
        });
      }

      const categoria = req.body.categoria.trim();

      if (categoria.length === 0) {
        return res.status(400).json({
          erro: "A categoria não pode ser vazia."
        });
      }

      campos.push("categoria = ?");
      valores.push(categoria);
    }

    if (campos.length === 0) {
      return res.status(400).json({
        erro: "Informe pelo menos um campo para atualizar."
      });
    }

    const atualizar = db.transaction(() => {
      const query = `
        UPDATE livros
        SET ${campos.join(", ")}
        WHERE id = ?
      `;

      db.prepare(query).run(...valores, id);
    });

    atualizar();

    const livroAtualizado = db
      .prepare(`
        SELECT id, titulo, autor, status, categoria
        FROM livros
        WHERE id = ?
      `)
      .get(id);

    return res.status(200).json(livroAtualizado);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro interno ao atualizar livro."
    });
  }
});

app.delete("/api/livros/:id", (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        erro: "O ID deve ser um número inteiro positivo."
      });
    }

    const livroExistente = db
      .prepare(`
        SELECT id
        FROM livros
        WHERE id = ?
      `)
      .get(id);

    if (!livroExistente) {
      return res.status(404).json({
        erro: "Livro não encontrado."
      });
    }

    db.prepare(`
      DELETE FROM livros
      WHERE id = ?
    `).run(id);

    return res.status(204).send();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro interno ao excluir livro."
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