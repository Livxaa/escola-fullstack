import Link from "next/link";
import Header from "../components/header";
import styles from "./principal.module.css";

export default function Principal() {
    return (
        <>
            <Header />

            <main className={styles.container}>
                <section className={styles.hero}>
                    <h2>Bem-vindo ao Sistema Escolar</h2>

                    <p>
                        Plataforma para gerenciamento de alunos, notas e
                        informações acadêmicas da unidade SESI Mirandópolis.
                    </p>

                    <Link href="/listaluno" className={styles.button}>
                        Acessar Sistema
                    </Link>
                </section>

                <section className={styles.cards}>
                    <Link href="/caddisciplina" className={styles.card}>
                        <h3>📚 Cadastro de Disciplinas</h3>
                        <p>
                            Cadastre disciplinas e defina a pontuação mínima para aprovação.
                        </p>
                    </Link>

                    <Link href="/cadprofessor" className={styles.card}>
                        <h3>👩‍🏫 Cadastro de Professores</h3>
                        <p>
                            Registre professores, dias de aula, disciplina responsável e carga semanal.
                        </p>
                    </Link>

                    <Link href="/cadaluno" className={styles.card}>
                        <h3>👨‍🎓 Cadastro de Alunos</h3>
                        <p>
                            Realize o cadastro e gerenciamento dos alunos da
                            instituição.
                        </p>
                    </Link>

                    <Link href="/listaluno" className={styles.card}>
                        <h3>📋 Lista de Alunos</h3>
                        <p>
                            Consulte rapidamente os alunos cadastrados.
                        </p>
                    </Link>

                    <Link href="/cadnotas" className={styles.card}>
                        <h3>📝 Lançamento de Notas</h3>
                        <p>
                            Cadastre e atualize notas dos estudantes.
                        </p>
                    </Link>

                    <Link href="/listnotas" className={styles.card}>
                        <h3>📊 Lista de Notas</h3>
                        <p>
                            Acompanhe o desempenho acadêmico dos alunos.
                        </p>
                    </Link>
                </section>

                <section className={styles.stats}>
                    <div className={styles.statCard}>
                        <h3>150+</h3>
                        <span>Alunos</span>
                    </div>

                    <div className={styles.statCard}>
                        <h3>12</h3>
                        <span>Turmas</span>
                    </div>

                    <div className={styles.statCard}>
                        <h3>25</h3>
                        <span>Disciplinas</span>
                    </div>

                    <div className={styles.statCard}>
                        <h3>98%</h3>
                        <span>Frequência</span>
                    </div>
                </section>

                <section className={styles.about}>
                    <h2>Funcionalidades</h2>

                    <div className={styles.featureGrid}>
                        <div className={styles.feature}>
                            <h4>⚡ Gestão Rápida</h4>
                            <p>
                                Interface intuitiva para cadastro e consulta.
                            </p>
                        </div>

                        <div className={styles.feature}>
                            <h4>🔐 Segurança</h4>
                            <p>
                                Armazenamento seguro das informações escolares.
                            </p>
                        </div>

                        <div className={styles.feature}>
                            <h4>📈 Indicadores</h4>
                            <p>
                                Acompanhe métricas e desempenho dos alunos.
                            </p>
                        </div>

                        <div className={styles.feature}>
                            <h4>🤖 Tecnologia</h4>
                            <p>
                                Sistema moderno baseado em Next.js.
                            </p>
                        </div>
                    </div>
                </section>

                <footer className={styles.footer}>
                    <p>
                        © 2026 Sistema Escolar SESI Mirandópolis
                    </p>
                </footer>
            </main>
        </>
    );
}