'use client';

import { useState, useEffect } from "react";
import Header from "../components/header";
import styles from "./cadnotas.module.css";
import { useRouter } from "next/navigation";

export default function CadNotas() {
    const router = useRouter();
    const [id_aluno, setIdAluno] = useState('');
    const [trabalho1, setTrabalho1] = useState('');
    const [trabalho2, setTrabalho2] = useState('');
    const [nota1, setNota1] = useState('');
    const [nota2, setNota2] = useState('');
    const [nota3, setNota3] = useState('');
    const [alunos, setAlunos] = useState([]);

    useEffect(() => {
        buscarAlunos();
    }, []);

    async function buscarAlunos() {
        try {
            const resposta = await fetch("/api/alunos");
            const dados = await resposta.json();
            setAlunos(Array.isArray(dados) ? dados : []);
        } catch (erro) {
            console.error("Erro ao buscar alunos:", erro);
        }
    }

    async function salvarNota(event) {
        event.preventDefault();
        try {
            const resposta = await fetch("/api/notas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_aluno,
                    trabalho1,
                    trabalho2,
                    nota1,
                    nota2,
                    nota3
                })
            });
            const dados = await resposta.json();
            alert(dados.mensagem || dados.erro);
            if (resposta.ok) {
                router.push("/listnotas");
            }
        } catch (erro) {
            console.error("Erro ao salvar nota:", erro);
            alert("Erro ao salvar nota.");
        }
    }

    return (
        <>
            <Header />

            <main className={styles.main}>
                <section className={styles.container}>
                    <div className={styles.painel}>
                        <h2>Cadastro de Notas</h2>

                        <form className={styles.form} onSubmit={salvarNota}>
                            <div className={styles.campo}>
                                <label htmlFor="id_aluno">Aluno</label>
                                <select
                                    id="id_aluno"
                                    value={id_aluno}
                                    onChange={(event) => setIdAluno(event.target.value)}
                                    required
                                >
                                    <option value="">Selecione um aluno</option>
                                    {alunos.map((aluno) => (
                                        <option key={aluno.id_aluno} value={aluno.id_aluno}>
                                            {aluno.nome} - RA: {aluno.ra} ({aluno.serie})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.campo}>
                                <label htmlFor="trabalho1">Trabalho 1 (T1)</label>
                                <input
                                    id="trabalho1"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    placeholder="Ex: 8.5"
                                    value={trabalho1}
                                    onChange={(e) => setTrabalho1(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.campo}>
                                <label htmlFor="trabalho2">Trabalho 2 (T2)</label>
                                <input
                                    id="trabalho2"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    placeholder="Ex: 9.0"
                                    value={trabalho2}
                                    onChange={(e) => setTrabalho2(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.campo}>
                                <label htmlFor="nota1">Nota 1 (N1)</label>
                                <input
                                    id="nota1"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    placeholder="Ex: 7.0"
                                    value={nota1}
                                    onChange={(e) => setNota1(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.campo}>
                                <label htmlFor="nota2">Nota 2 (N2)</label>
                                <input
                                    id="nota2"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    placeholder="Ex: 8.0"
                                    value={nota2}
                                    onChange={(e) => setNota2(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.campo}>
                                <label htmlFor="nota3">Nota 3 (N3)</label>
                                <input
                                    id="nota3"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    placeholder="Ex: 10.0"
                                    value={nota3}
                                    onChange={(e) => setNota3(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={styles.botao}
                            >
                                Salvar Nota
                            </button>
                        </form>
                    </div>
                </section>
            </main>
        </>
    );
}
