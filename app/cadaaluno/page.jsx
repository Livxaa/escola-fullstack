"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import Header from "../components/header";

export default function CadastrarAluno() {
  const [form, setForm] = useState({
    nome: "",
    idade: "",
    serie: "",
    ra: "",
    email: "",
  });

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [alunosRecentes, setAlunosRecentes] = useState([]);

  // Carrega alunos para exibir na prévia logo abaixo do form
  function carregarAlunosRecentes() {
    fetch("/api/alunos", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setAlunosRecentes(data.alunos || []);
      })
      .catch((e) => console.error("Erro ao carregar alunos:", e));
  }

  useEffect(() => {
    carregarAlunosRecentes();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setCarregando(true);
    setErro("");
    setSucesso("");

    // Validação de idade
    const idadeNum = Number(form.idade);
    if (!Number.isInteger(idadeNum) || idadeNum <= 0) {
      setErro("Por favor, informe uma idade válida (número positivo).");
      setCarregando(false);
      return;
    }

    try {
      const payload = {
        nome: form.nome.trim(),
        idade: idadeNum,
        serie: form.serie.trim(),
        ra: form.ra.trim(),
        email: form.email.trim(),
      };

      const resposta = await fetch("/api/alunos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let dados = {};
      try {
        dados = await resposta.json();
      } catch {
        throw new Error("Resposta inválida do servidor. Tente novamente.");
      }

      if (!resposta.ok) {
        throw new Error(dados?.error || "Falha ao registrar aluno na base de dados.");
      }

      setSucesso(`Aluno "${payload.nome}" cadastrado com sucesso no banco de dados!`);
      // Limpa os campos para novo cadastro
      setForm({ nome: "", idade: "", serie: "", ra: "", email: "" });
      // Atualiza a prévia imediatamente
      carregarAlunosRecentes();

      // Redireciona suavemente após 1 segundo
      setTimeout(() => {
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = "/listaaluno";
      }, 1000);
    } catch (err) {
      console.error("Erro na submissão do formulário:", err);
      setErro(err.message || "Ocorreu um erro inesperado ao conectar à base de dados.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <>
      <Header />
      <main className={styles.container}>
        <div style={{ width: "100%", maxWidth: "600px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <Link href="/listaaluno" style={{ color: "var(--olive)", fontWeight: 600, fontSize: "0.9rem" }}>
            ← Ver Lista de Alunos Cadastrados
          </Link>
          <span style={{ fontSize: "0.85rem", color: "var(--text-light)" }}>
            Total salvo: <strong>{alunosRecentes.length}</strong>
          </span>
        </div>

        <p className={styles.eyebrow}>Secretaria Escolar</p>
        <h1 className={styles.title}>Cadastrar Novo Aluno</h1>

        <form onSubmit={handleSubmit} className={styles.form} noValidate={false}>
          {erro && (
            <div className={styles.alertError} role="alert">
              <span>⚠️</span>
              <span>{erro}</span>
            </div>
          )}

          {sucesso && (
            <div className={styles.alertSuccess} role="status" style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>✅</span>
                <strong>{sucesso}</strong>
              </div>
              <Link
                href="/listaaluno"
                style={{
                  background: "#15803d",
                  color: "#ffffff",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Abrir Lista de Alunos Agora →
              </Link>
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="nome">Nome Completo:</label>
            <input
              id="nome"
              name="nome"
              type="text"
              required
              placeholder="Ex: Carlos Oliveira"
              value={form.nome}
              onChange={handleChange}
              disabled={carregando}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="idade">Idade:</label>
            <input
              id="idade"
              name="idade"
              type="number"
              min="1"
              max="120"
              required
              placeholder="Ex: 17"
              value={form.idade}
              onChange={handleChange}
              disabled={carregando}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="serie">Série / Turma:</label>
            <input
              id="serie"
              name="serie"
              type="text"
              required
              placeholder="Ex: 3º Ano A"
              value={form.serie}
              onChange={handleChange}
              disabled={carregando}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="ra">Registro Acadêmico (RA):</label>
            <input
              id="ra"
              name="ra"
              type="text"
              required
              placeholder="Ex: 2026A123"
              value={form.ra}
              onChange={handleChange}
              disabled={carregando}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">E-mail Institucional:</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Ex: carlos.oliveira@escola.com"
              value={form.email}
              onChange={handleChange}
              disabled={carregando}
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className={styles.saveButton}
          >
            {carregando ? "A salvar no banco..." : "Cadastrar Aluno no Banco"}
          </button>
        </form>

        {/* Prévia dos alunos já salvos para confirmação visual imediata */}
        <section style={{ width: "100%", maxWidth: "600px", marginTop: "2.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-dark)", marginBottom: "0.75rem" }}>
            Alunos Registrados no Banco ({alunosRecentes.length}):
          </h2>
          <div style={{ background: "var(--white)", borderRadius: "10px", border: "1px solid var(--cream-dark)", padding: "1rem", boxShadow: "var(--shadow-soft)" }}>
            {alunosRecentes.length === 0 ? (
              <p style={{ color: "var(--text-light)", fontSize: "0.9rem", textAlign: "center", margin: "1rem 0" }}>
                Nenhum aluno cadastrado ainda. Preencha o formulário acima para registrar o primeiro!
              </p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {alunosRecentes.map((aluno) => (
                  <li
                    key={aluno.id_aluno}
                    style={{
                      padding: "0.6rem 0",
                      borderBottom: "1px solid #f1f5f9",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "0.9rem",
                    }}
                  >
                    <div>
                      <strong style={{ color: "var(--text-dark)" }}>{aluno.nome}</strong>
                      <span style={{ color: "var(--text-light)", marginLeft: "0.5rem", fontSize: "0.8rem" }}>
                        ({aluno.serie} - RA: {aluno.ra})
                      </span>
                    </div>
                    <span style={{ color: "#64748b", fontSize: "0.8rem" }}>{aluno.email}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </>
  );
}