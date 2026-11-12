'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/header";
import styles from "../cadaluno/cadaluno.module.css";
import professorStyles from "./cadprofessor.module.css";

const diasDaSemana = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
    "Domingo"
];

export default function CadProfessor() {
    const router = useRouter();
    const [nome, setNome] = useState("");
    const [nif, setNif] = useState("");
    const [diasAula, setDiasAula] = useState([]);
    const [idDisciplina, setIdDisciplina] = useState("");
    const [totalAulas, setTotalAulas] = useState("");
    const [disciplinas, setDisciplinas] = useState([]);
    const [erroDisciplinas, setErroDisciplinas] = useState("");
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        async function buscarDisciplinas() {
            try {
                const resposta = await fetch("/api/disciplinas");
                const dados = await resposta.json();

                if (!resposta.ok) {
                    throw new Error(dados.erro || "Erro ao buscar disciplinas.");
                }

                setDisciplinas(dados);
            } catch (erro) {
                console.error("Erro ao buscar disciplinas:", erro);
                setErroDisciplinas("Não foi possível carregar as disciplinas.");
            }
        }

        buscarDisciplinas();
    }, []);

    function alternarDia(dia) {
        setDiasAula((diasAtuais) =>
            diasAtuais.includes(dia)
                ? diasAtuais.filter((diaAtual) => diaAtual !== dia)
                : [...diasAtuais, dia]
        );
    }

    async function cadastrarProfessor(evento) {
        evento.preventDefault();
        if (salvando) return;

        try {
            setSalvando(true);
            const resposta = await fetch("/api/professores", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: nome.trim(),
                    nif: nif.trim(),
                    dias_aula: diasAula,
                    id_disciplina: Number(idDisciplina),
                    total_aulas_semana: Number(totalAulas)
                })
            });
            const dados = await resposta.json();

            if (!resposta.ok) {
                alert(dados.erro || "Erro ao cadastrar o professor.");
                return;
            }

            alert(dados.mensagem || "Professor cadastrado com sucesso!");
            router.push("/principal");
        } catch (erro) {
            console.error("Erro ao enviar dados do professor:", erro);
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
                    <h2 className={styles.title}>Cadastro de Professores</h2>
                    <p className={styles.subtitle}>
                        Preencha os dados do professor e sua disciplina responsável.
                    </p>

                    {erroDisciplinas && (
                        <p className={professorStyles.erro} role="alert">
                            {erroDisciplinas}
                        </p>
                    )}

                    <form className={styles.form} onSubmit={cadastrarProfessor}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="nome">Nome do professor</label>
                            <input
                                id="nome"
                                type="text"
                                value={nome}
                                onChange={(evento) => setNome(evento.target.value)}
                                placeholder="Digite o nome do professor"
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="nif">Matrícula (NIF)</label>
                            <input
                                id="nif"
                                type="text"
                                value={nif}
                                onChange={(evento) => setNif(evento.target.value)}
                                placeholder="Digite a matrícula (NIF)"
                                required
                            />
                        </div>

                        <fieldset className={styles.inputGroup}>
                            <legend>Dias que ministra aula</legend>
                            <div className={professorStyles.dias}>
                                {diasDaSemana.map((dia) => (
                                    <label key={dia}>
                                        <input
                                            type="checkbox"
                                            checked={diasAula.includes(dia)}
                                            onChange={() => alternarDia(dia)}
                                        />
                                        {dia}
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        <div className={styles.inputGroup}>
                            <label htmlFor="idDisciplina">
                                Disciplina que é responsável
                            </label>
                            <select
                                id="idDisciplina"
                                value={idDisciplina}
                                onChange={(evento) => setIdDisciplina(evento.target.value)}
                                required
                            >
                                <option value="">Selecione uma disciplina</option>
                                {disciplinas.map((disciplina) => (
                                    <option
                                        key={disciplina.id_disciplina}
                                        value={disciplina.id_disciplina}
                                    >
                                        {disciplina.nome}
                                    </option>
                                ))}
                            </select>
                            {disciplinas.length === 0 && !erroDisciplinas && (
                                <button
                                    className={styles.button}
                                    type="button"
                                    onClick={() => router.push("/caddisciplina")}
                                >
                                    Cadastrar uma disciplina primeiro
                                </button>
                            )}
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="totalAulas">Total de aulas na semana</label>
                            <input
                                id="totalAulas"
                                type="number"
                                min="1"
                                step="1"
                                value={totalAulas}
                                onChange={(evento) => setTotalAulas(evento.target.value)}
                                placeholder="Ex.: 20"
                                required
                            />
                        </div>

                        <button
                            className={styles.button}
                            type="submit"
                            disabled={salvando || disciplinas.length === 0}
                        >
                            {salvando ? "Cadastrando..." : "Cadastrar professor"}
                        </button>
                    </form>
                </section>
            </main>
        </>
    );
}
