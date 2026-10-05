"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import Header from "../components/header";

export default function NotaAluno() {
  const [alunos, setAlunos] = useState([]);
  const [alunoId, setAlunoId] = useState("");
  const [t1, setT1] = useState("");
  const [t2, setT2] = useState("");
  const [n1, setN1] = useState("");
  const [n2, setN2] = useState("");
  const [n3, setN3] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    fetch("/api/alunos", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setAlunos(data.alunos || []);
      })
      .catch((err) => console.error("Erro ao carregar alunos:", err));
  }, []);

  // Quando o usuário seleciona um aluno, preenche com as notas existentes (se houver)
  function handleSelectAluno(e) {
    const id = e.target.value;
    setAlunoId(id);
    setMensagem("");
    setErro("");

    const selecionado = alunos.find((a) => String(a.id_aluno) === id);
    if (selecionado) {
      setT1(selecionado.t1 !== null && selecionado.t1 !== undefined ? String(selecionado.t1) : "");
      setT2(selecionado.t2 !== null && selecionado.t2 !== undefined ? String(selecionado.t2) : "");
      setN1(selecionado.n1 !== null && selecionado.n1 !== undefined ? String(selecionado.n1) : "");
      setN2(selecionado.n2 !== null && selecionado.n2 !== undefined ? String(selecionado.n2) : "");
      setN3(selecionado.n3 !== null && selecionado.n3 !== undefined ? String(selecionado.n3) : "");
    } else {
      setT1("");
      setT2("");
      setN1("");
      setN2("");
      setN3("");
    }
  }

  // Cálculo da média em tempo real
  const mediaCalculada = useMemo(() => {
    const notas = [t1, t2, n1, n2, n3];
    const preenchidas = notas.filter((n) => n !== "" && !isNaN(Number(n)));
    if (preenchidas.length === 0) return null;
    const soma = preenchidas.reduce((acc, curr) => acc + Number(curr), 0);
    return Number((soma / 5).toFixed(1));
  }, [t1, t2, n1, n2, n3]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!alunoId) {
      setErro("Selecione um aluno para registrar as notas.");
      return;
    }

    setSalvando(true);
    setMensagem("");
    setErro("");

    try {
      const resposta = await fetch("/api/notas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aluno_id: Number(alunoId),
          trabalho1: Number(t1) || 0,
          trabalho2: Number(t2) || 0,
          nota1: Number(n1) || 0,
          nota2: Number(n2) || 0,
          nota3: Number(n3) || 0,
        }),
      });

      const dados = await resposta.json();
      if (!resposta.ok) {
        throw new Error(dados.error || "Erro ao salvar notas.");
      }

      setMensagem(`Notas gravadas com sucesso! Média final: ${dados.media} (${dados.situacao}).`);
    } catch (err) {
      setErro(err.message || "Não foi possível gravar as notas.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <Header />
      <main className={styles.container}>
        <p className={styles.eyebrow}>Secretaria escolar</p>
        <h1>Cadastro de Notas & Média</h1>
        <p className={styles.description}>
          Selecione o aluno e preencha as notas. A média aritmética escolar será calculada automaticamente.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {erro && (
            <div style={{ background: "#fef2f2", color: "#991b1b", padding: "0.8rem", borderRadius: "8px" }}>
              ⚠️ {erro}
            </div>
          )}

          {mensagem && (
            <div className={styles.success} role="status">
              ✅ {mensagem}{" "}
              <Link href="/listaaluno" style={{ textDecoration: "underline", fontWeight: "bold" }}>
                Ver na Lista de Alunos
              </Link>
            </div>
          )}

          <label htmlFor="aluno">Selecione o Aluno:</label>
          <select
            id="aluno"
            name="aluno"
            value={alunoId}
            onChange={handleSelectAluno}
            required
            style={{
              width: "100%",
              padding: "0.85rem 1rem",
              borderRadius: "8px",
              border: "1px solid var(--cream-medium)",
              font: "inherit",
              background: "var(--white)",
            }}
          >
            <option value="">-- Escolha um aluno cadastrado --</option>
            {alunos.map((a) => (
              <option key={a.id_aluno} value={a.id_aluno}>
                {a.nome} (RA: {a.ra} - {a.serie})
              </option>
            ))}
          </select>

          <div className={styles.row}>
            <div>
              <label htmlFor="t1">Trabalho 1 (T1):</label>
              <input
                type="number"
                id="t1"
                name="t1"
                placeholder="0,0 – 10,0"
                min="0"
                max="10"
                step="0.1"
                value={t1}
                onChange={(e) => setT1(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="t2">Trabalho 2 (T2):</label>
              <input
                type="number"
                id="t2"
                name="t2"
                placeholder="0,0 – 10,0"
                min="0"
                max="10"
                step="0.1"
                value={t2}
                onChange={(e) => setT2(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div>
              <label htmlFor="n1">Prova 1 (N1):</label>
              <input
                type="number"
                id="n1"
                name="n1"
                placeholder="0,0 – 10,0"
                min="0"
                max="10"
                step="0.1"
                value={n1}
                onChange={(e) => setN1(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="n2">Prova 2 (N2):</label>
              <input
                type="number"
                id="n2"
                name="n2"
                placeholder="0,0 – 10,0"
                min="0"
                max="10"
                step="0.1"
                value={n2}
                onChange={(e) => setN2(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="n3">Prova 3 (N3):</label>
              <input
                type="number"
                id="n3"
                name="n3"
                placeholder="0,0 – 10,0"
                min="0"
                max="10"
                step="0.1"
                value={n3}
                onChange={(e) => setN3(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Painel de Média em Tempo Real */}
          <div
            style={{
              marginTop: "1.2rem",
              padding: "1rem",
              background: "var(--cream)",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong style={{ display: "block", color: "var(--text-dark)", fontSize: "0.95rem" }}>
                Média Calculada (T1 + T2 + N1 + N2 + N3) ÷ 5
              </strong>
              <small style={{ color: "var(--text-light)" }}>
                Critério: Aprovado ≥ 6.0 | Recuperação 5.0 a 5.9 | Reprovado &lt; 5.0
              </small>
            </div>
            <div style={{ textAlign: "right" }}>
              <span
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 800,
                  color:
                    mediaCalculada === null
                      ? "#64748b"
                      : mediaCalculada >= 6.0
                      ? "#2e7d32"
                      : mediaCalculada >= 5.0
                      ? "#f57f17"
                      : "#c62828",
                }}
              >
                {mediaCalculada !== null ? mediaCalculada.toFixed(1) : "0.0"}
              </span>
            </div>
          </div>

          <button type="submit" disabled={salvando} className={styles.submitButton}>
            {salvando ? "A salvar notas..." : "Gravar Notas e Média"}
          </button>
        </form>
      </main>
    </>
  );
}