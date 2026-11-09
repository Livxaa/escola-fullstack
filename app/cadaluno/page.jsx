'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/header";
import styles from "./cadaluno.module.css";

export default function CadAluno() {
    const router = useRouter();
    const [nome, setNome] = useState('');
    const [idade, setIdade] = useState('');
    const [serie, setSerie] = useState('');
    const [ra, setRa] = useState('');

    const [salvando, setSalvando] = useState(false);

    async function cadastrarAluno(evento){
        evento.preventDefault();
        if (salvando) return;

        if (!nome.trim() || !idade || !serie.trim() || !ra.trim()) {
            alert("Por favor, preencha todos os campos!");
            return;
        }

        try {
            setSalvando(true);
            const resposta = await fetch("/api/alunos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: nome.trim(),
                    idade: Number(idade),
                    serie: serie.trim(),
                    ra: ra.trim()
                })
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                alert(dados.mensagem || "Aluno cadastrado com sucesso!");
                router.push("/listaluno");
            } else {
                alert(dados.erro || "Erro ao cadastrar o aluno.");
            }
        } catch (erro) {
            console.error("Erro ao enviar dados do aluno:", erro);
            alert("Falha na comunicação com o servidor.");
        } finally {
            setSalvando(false);
        }
    }

    return (
        <>
            <Header />

            <main className={styles.container}>
                <div className={styles.card}>
                    <h2 className={styles.title}>
                        Cadastro de Alunos
                    </h2>

                    <p className={styles.subtitle}>
                        Preencha os dados do aluno para realizar o cadastro no sistema.
                    </p>

                    <form className={styles.form} onSubmit={cadastrarAluno}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="nome">Nome</label>
                            <input
                                id="nome"
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Digite o nome do aluno"
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="idade">Idade</label>
                            <input
                                id="idade"
                                type="number"
                                min="1"
                                max="120"
                                value={idade}
                                onChange={(e) => setIdade(e.target.value)}
                                placeholder="Digite a idade"
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="serie">Série</label>
                            <input
                                id="serie"
                                type="text"
                                value={serie}
                                onChange={(e) => setSerie(e.target.value)}
                                placeholder="Digite a série (ex: 1º EM, 3A)"
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="ra">RA</label>
                            <input
                                id="ra"
                                type="text"
                                value={ra}
                                onChange={(e) => setRa(e.target.value)}
                                placeholder="Digite o RA"
                                required
                            />
                        </div>

                        <button className={styles.button} type="submit" disabled={salvando}>
                            {salvando ? "Cadastrando..." : "Cadastrar Aluno"}
                        </button>
                    </form>
                </div>
            </main>
        </>
    );
}