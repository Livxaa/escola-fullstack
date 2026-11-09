'use client';
import { useState, useEffect } from 'react';
import Header from "../components/header";
import styles from "./listaluno.module.css";
import { useRouter } from "next/navigation";

export default function ListAluno() {
    const [alunos, setAlunos] = useState([]);
    const [busca, setBusca] = useState('');
    const router = useRouter();

    useEffect(() => {
        buscarAlunos();
    }, []);

    async function buscarAlunos() {
        try {
            const resposta = await fetch('/api/alunos');
            const dados = await resposta.json();
            setAlunos(Array.isArray(dados) ? dados : []);
        } catch (erro) {
            console.error("Erro ao buscar alunos:", erro);
        }
    }

    function editarAluno(id) {
        router.push(`/editaluno/${id}`);
    }

    async function excluirAluno(id_aluno) {
        if (!confirm("Deseja realmente excluir este aluno?")) {
            return;
        }

        try {
            const resposta = await fetch("/api/alunos", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id_aluno }),
            });

            const dados = await resposta.json();
            alert(dados.mensagem || dados.erro);
            buscarAlunos();
        } catch (erro) {
            console.error("Erro ao excluir aluno:", erro);
            alert("Erro ao excluir aluno.");
        }
    }

    const alunosFiltrados = alunos.filter((aluno) => {
        const termo = busca.trim().toLowerCase();
        if (!termo) return true;
        return (
            aluno.nome?.toLowerCase().includes(termo) ||
            aluno.ra?.toString().toLowerCase().includes(termo) ||
            aluno.serie?.toLowerCase().includes(termo)
        );
    });

    return (
        <>
            <Header />

            <main className={styles.container}>
                <section className={styles.headerSection}>
                    <h2>Lista de Alunos</h2>
                    <p>Consulte todos os alunos cadastrados no sistema.</p>
                </section>

                <section className={styles.tableCard}>
                    <div className={styles.actions}>
                        <input
                            type="text"
                            placeholder="Pesquisar por nome, RA ou série..."
                            className={styles.search}
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />

                        <div className={styles.total}>
                            Total: {alunosFiltrados.length} {alunosFiltrados.length === 1 ? 'aluno' : 'alunos'}
                        </div>
                    </div>

                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Idade</th>
                                <th>Série</th>
                                <th>RA</th>
                                <th style={{ textAlign: "center" }}>Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            {alunosFiltrados.length > 0 ? (
                                alunosFiltrados.map((aluno) => (
                                    <tr key={aluno.id_aluno}>
                                        <td>{aluno.id_aluno}</td>
                                        <td><strong>{aluno.nome}</strong></td>
                                        <td>{aluno.idade}</td>
                                        <td>{aluno.serie}</td>
                                        <td>{aluno.ra}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <button 
                                                className={styles.botaoEditar}
                                                onClick={() => editarAluno(aluno.id_aluno)}
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                className={styles.botaoExcluir}
                                                onClick={() => excluirAluno(aluno.id_aluno)}
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center", padding: "2rem", color: "#a0aec0" }}>
                                        Nenhum aluno encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>
            </main>
        </>
    );
}