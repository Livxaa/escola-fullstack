"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Header from "../components/header";

export default function ListaNotas() {
  const [busca, setBusca] = useState("");

  const notas = [
    { aluno: "João Silva",    t1: 8.5, t2: 7.0, n1: 9.0, n2: 7.5, n3: 8.0 },
    { aluno: "Maria Souza",   t1: 9.0, t2: 9.5, n1: 8.5, n2: 9.0, n3: 9.5 },
    { aluno: "Pedro Costa",   t1: 6.0, t2: 7.5, n1: 6.5, n2: 7.0, n3: 7.0 },
  ];

  const notasFiltradas = notas.filter((item) =>
    Object.values(item).some((valor) =>
      String(valor).toLowerCase().includes(busca.toLowerCase())
    )
  );

  return (
    <>
      <Header />
      <main className={styles.container}>
        <p className={styles.eyebrow}>Secretaria escolar</p>
        <h1>Relatório de Notas</h1>
        <label className={styles.searchLabel} htmlFor="busca-nota">
          Buscar aluno
        </label>
        <input
          className={styles.searchInput}
          id="busca-nota"
          type="search"
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
          placeholder="Nome do aluno"
        />
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <caption className={styles.caption}>Notas cadastradas</caption>
            <thead>
              <tr>
                <th scope="col">Aluno</th>
                <th scope="col">T1</th>
                <th scope="col">T2</th>
                <th scope="col">N1</th>
                <th scope="col">N2</th>
                <th scope="col">N3</th>
              </tr>
            </thead>
            <tbody>
              {notasFiltradas.map((item, index) => (
                <tr key={index}>
                  <td>{item.aluno}</td>
                  <td>{item.t1.toFixed(1)}</td>
                  <td>{item.t2.toFixed(1)}</td>
                  <td>{item.n1.toFixed(1)}</td>
                  <td>{item.n2.toFixed(1)}</td>
                  <td>{item.n3.toFixed(1)}</td>
                </tr>
              ))}
              {notasFiltradas.length === 0 && (
                <tr>
                  <td className={styles.empty} colSpan="6">
                    Nenhum registro encontrado.
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