'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/header";
import styles from "../cadaluno/cadaluno.module.css";

export default function CadDisciplina() {
    const router = useRouter();
    const [nome, setNome] = useState("");
    const [pontuacaoMinima, setPontuacaoMinima] = useState("");
    const [salvando, setSalvando] = useState(false);

    async function cadastrarDisciplina(evento) {
        evento.preventDefault();
        if (salvando) return;

        try {
            setSalvando(true);
            const resposta = await fetch("/api/disciplinas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: nome.trim(),
                    pontuacao_minima: Number(pontuacaoMinima)
                })
            });
            const dados = await resposta.json();

            if (!resposta.ok) {
                alert(dados.erro || "Erro ao cadastrar a disciplina.");
                return;
            }

            alert(dados.mensagem || "Disciplina cadastrada com sucesso!");
            router.push("/principal");
        } catch (erro) {
            console.error("Erro ao enviar dados da disciplina:", erro);
            alert("Falha na comunicação com o servidor.");
        } finally {
            setSalvando(false);
        }
    }

    return (
        <>
            <Header />
            <main className={styles.container}>
                <section className={styles.card}>
                    <h2 className={styles.title}>Cadastro de Disciplinas</h2>
                    <p className={styles.subtitle}>
                        Informe o nome e a pontuação mínima para aprovação.
                    </p>

                    <form className={styles.form} onSubmit={cadastrarDisciplina}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="nome">Nome da disciplina</label>
                            <input
                                id="nome"
                                type="text"
                                value={nome}
                                onChange={(evento) => setNome(evento.target.value)}
                                placeholder="Digite o nome da disciplina"
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="pontuacaoMinima">
                                Pontuação mínima para passar
                            </label>
                            <input
                                id="pontuacaoMinima"
                                type="number"
                                min="0"
                                max="10"
                                step="0.1"
                                value={pontuacaoMinima}
                                onChange={(evento) => setPontuacaoMinima(evento.target.value)}
                                placeholder="Ex.: 6.0"
                                required
                            />
                        </div>

                        <button className={styles.button} type="submit" disabled={salvando}>
                            {salvando ? "Cadastrando..." : "Cadastrar disciplina"}
                        </button>
                    </form>
                </section>
            </main>
        </>
    );
}
