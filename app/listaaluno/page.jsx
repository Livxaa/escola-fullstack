"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Header from "../components/header";

export default function ListaAlunos() {
    const [busca, setBusca] = useState("");
    const alunos = [
        { nome: "João Silva", idade: 15, email: "joao.silva@email.com", ra: "123456" },
    ];
    const alunosFiltrados = alunos.filter((aluno) =>
        Object.values(aluno).some((valor) =>
            String(valor).toLowerCase().includes(busca.toLowerCase())
        )
    );

    return (
        <>
            <Header />
            <main className={styles.container}>
                <p className={styles.eyebrow}>Secretaria escolar</p>
                <h1>Lista de Alunos</h1>
                <label className={styles.searchLabel} htmlFor="busca-aluno">
                    Buscar aluno
                </label>
                <input
                    className={styles.searchInput}
                    id="busca-aluno"
                    type="search"
                    value={busca}
                    onChange={(event) => setBusca(event.target.value)}
                    placeholder="Nome, e-mail ou RA"
                />
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <caption className={styles.caption}>Alunos cadastrados</caption>
                        <thead>
                            <tr>
                                <th scope="col">Nome</th>
                                <th scope="col">Idade</th>
                                <th scope="col">Email</th>
                                <th scope="col">RA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alunosFiltrados.map((aluno) => (
                                <tr key={aluno.ra}>
                                    <td>{aluno.nome}</td>
                                    <td>{aluno.idade}</td>
                                    <td>{aluno.email}</td>
                                    <td>{aluno.ra}</td>
                                </tr>
                            ))}
                            {alunosFiltrados.length === 0 && (
                                <tr>
                                    <td className={styles.empty} colSpan="4">Nenhum aluno encontrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </>
    );
}