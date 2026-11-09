'use client';

import { useRouter } from "next/navigation";
import Header from "../components/header";
import styles from "../autenticacao.module.css";

export default function Registro() {
    const router = useRouter();

    function salvarRegistro(evento) {
        evento.preventDefault();
        router.push("/login");
    }

    return (
        <>
            <Header />

            <main className={styles.container}>
                <section className={styles.card}>
                    <h2 className={styles.title}>Criar conta</h2>
                    <p className={styles.subtitle}>
                        Preencha os dados para realizar seu registro.
                    </p>

                    <form className={styles.form} onSubmit={salvarRegistro}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="usuario">Usuário</label>
                            <input
                                id="usuario"
                                name="usuario"
                                type="text"
                                autoComplete="username"
                                placeholder="Digite seu usuário"
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="nome">Nome</label>
                            <input
                                id="nome"
                                name="nome"
                                type="text"
                                autoComplete="name"
                                placeholder="Digite seu nome"
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="senha">Senha</label>
                            <input
                                id="senha"
                                name="senha"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Crie uma senha"
                                required
                            />
                        </div>

                        <button className={styles.button} type="submit">
                            Salvar registro
                        </button>
                    </form>

                    <button
                        className={styles.secondaryButton}
                        type="button"
                        onClick={() => router.push("/login")}
                    >
                        Já tem uma conta? Entrar
                    </button>
                </section>
            </main>
        </>
    );
}
