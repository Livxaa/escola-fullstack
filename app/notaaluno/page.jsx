"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Header from "../components/header";

export default function NotaAluno() {
  const [aluno, setAluno] = useState("");
  const [t1, setT1] = useState("");
  const [t2, setT2] = useState("");
  const [n1, setN1] = useState("");
  const [n2, setN2] = useState("");
  const [n3, setN3] = useState("");
  const [mensagem, setMensagem] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setMensagem(`Notas do aluno "${aluno}" cadastradas com sucesso!`);
    setAluno("");
    setT1("");
    setT2("");
    setN1("");
    setN2("");
    setN3("");
  }

  return (
    <>
      <Header />
      <main className={styles.container}>
        <p className={styles.eyebrow}>Secretaria escolar</p>
        <h1>Cadastro de Notas</h1>
        <p className={styles.description}>
          Preencha os dados abaixo para registrar as notas do aluno.
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="aluno">Aluno:</label>
          <input
            type="text"
            id="aluno"
            name="aluno"
            placeholder="Nome do aluno"
            value={aluno}
            onChange={(e) => setAluno(e.target.value)}
            required
          />

          <div className={styles.row}>
            <div>
              <label htmlFor="t1">T1 (Trabalho 1):</label>
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
              <label htmlFor="t2">T2 (Trabalho 2):</label>
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
              <label htmlFor="n1">N1 (Nota 1):</label>
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
              <label htmlFor="n2">N2 (Nota 2):</label>
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
              <label htmlFor="n3">N3 (Nota 3):</label>
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

          <button type="submit" className={styles.submitButton}>
            Cadastrar notas
          </button>
          {mensagem && (
            <p className={styles.success} role="status">
              {mensagem}
            </p>
          )}
        </form>
      </main>
    </>
  );
}