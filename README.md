# 📚 Biblioteca API

> API RESTful para gerenciamento de livros de uma biblioteca comunitária.

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5+-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

</div>

---

## 📖 Sobre o projeto

O **Biblioteca API** é uma API RESTful desenvolvida para facilitar o gerenciamento do acervo de uma biblioteca comunitária.

A aplicação permite **cadastrar, consultar, atualizar e excluir livros**, utilizando uma API simples, segura e organizada.

O projeto foi desenvolvido como parte de um **desafio prático de desenvolvimento de APIs RESTful**, com foco em:

- 🌐 Arquitetura REST
- 🗄️ Persistência de dados
- 🔐 Segurança contra SQL Injection
- ✅ Validação de dados
- 🧪 Testes de endpoints
- 🌿 Boas práticas com Git e GitHub

---

## 🎯 Objetivos

O projeto tem como principais objetivos:

- Criar uma API RESTful funcional;
- Implementar operações CRUD;
- Trabalhar com banco de dados SQLite;
- Validar dados recebidos pela API;
- Utilizar Prepared Statements;
- Implementar tratamento adequado de erros;
- Criar testes para os principais endpoints;
- Praticar trabalho colaborativo utilizando Git.

---

# 🛠️ Tecnologias utilizadas

| Tecnologia | Utilização |
|---|---|
| 🟢 **Node.js** | Ambiente de execução |
| 🔷 **TypeScript** | Linguagem de programação |
| ⚫ **Express** | Criação da API REST |
| 🗃️ **SQLite** | Banco de dados |
| 🔒 **better-sqlite3** | Comunicação com SQLite |
| 🧪 **REST Client** | Testes da API |
| 🌿 **Git** | Controle de versão |
| 🐙 **GitHub** | Versionamento e colaboração |

---

# 📚 Modelo de dados

A entidade principal da aplicação é o **Livro**.

```text
┌─────────────────────────────┐
│           LIVRO             │
├─────────────────────────────┤
│ id          → INTEGER       │
│ titulo      → TEXT          │
│ autor       → TEXT          │
│ status      → TEXT          │
│ categoria   → TEXT          │
└─────────────────────────────┘
