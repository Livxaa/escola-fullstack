"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import Header from "../components/header";

export default function ListaNotas() {
  const [busca, setBusca] = useState("");
  const [notas, setNotas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch("/api/notas", { cache: "no-store" })
      .then((res) => res.json())
      .then((dados) => {
        setNotas(dados.notas || []);
      })
      .catch((error) => {
        console.error("Erro ao carregar relatório de notas:", error);
      })
      .finally(() => {
        setCarregando(false);
      });
  }, []);

  const notasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return notas;
    return notas.filter((item) =>
      item.aluno_nome?.toLowerCase().includes(termo) ||
      item.aluno_ra?.toLowerCase().includes(termo)
    );
  }, [notas, busca]);

  return (
    <>
      <Header />
      <main className={styles.container}>
        <p className={styles.eyebrow}>Secretaria escolar</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <h1>Relatório de Notas & Médias</h1>
          <Link
            href="/notaaluno"
            style={{
              background: "var(--olive)",
              color: "white",
              padding: "0.75rem 1.25rem",
              borderRadius: "8px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            + Lançar Notas
          </Link>
        </div>

        <label className={styles.searchLabel} htmlFor="busca-nota">
          Buscar por aluno ou RA:
        </label>
        <input
          className={styles.searchInput}
          id="busca-nota"
          type="search"
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
          placeholder="Nome do aluno ou RA..."
        />

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <caption className={styles.caption}>
              {notasFiltradas.length} registro(s) de notas cadastrado(s)
            </caption>
            <thead>
              <tr>
                <th scope="col">Aluno</th>
                <th scope="col">RA</th>
                <th scope="col">T1</th>
                <th scope="col">T2</th>
                <th scope="col">N1</th>
                <th scope="col">N2</th>
                <th scope="col">N3</th>
                <th scope="col">Média</th>
                <th scope="col">Situação</th>
              </tr>
            </thead>
            <tbody>
              {notasFiltradas.map((item) => (
                <tr key={item.id_nota}>
                  <td>
                    <strong>{item.aluno_nome}</strong>
                  </td>
                  <td>
                    <code>{item.aluno_ra}</code>
                  </td>
                  <td>{Number(item.t1).toFixed(1)}</td>
                  <td>{Number(item.t2).toFixed(1)}</td>
                  <td>{Number(item.n1).toFixed(1)}</td>
                  <td>{Number(item.n2).toFixed(1)}</td>
                  <td>{Number(item.n3).toFixed(1)}</td>
                  <td>
                    <strong style={{ fontSize: "1.05rem", color: "var(--text-dark)" }}>
                      {Number(item.media).toFixed(1)}
                    </strong>
                  </td>
                  <td>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.25rem 0.65rem",
                        borderRadius: "15px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        backgroundColor:
                          item.situacao === "Aprovado"
                            ? "#e8f5e9"
                            : item.situacao === "Recuperação"
                            ? "#fff8e1"
                            : "#ffebee",
                        color:
                          item.situacao === "Aprovado"
                            ? "#2e7d32"
                            : item.situacao === "Recuperação"
                            ? "#f57f17"
                            : "#c62828",
                      }}
                    >
                      {item.situacao}
                    </span>
                  </td>
                </tr>
              ))}

              {!carregando && notasFiltradas.length === 0 && (
                <tr>
                  <td className={styles.empty} colSpan="9">
                    Nenhuma nota lançada até o momento. Acesse &quot;Lançar Notas&quot; para registrar!
                  </td>
                </tr>
              )}

              {carregando && (
                <tr>
                  <td className={styles.empty} colSpan="9">
                    A carregar relatório de notas...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}