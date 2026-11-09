'use client';

import { useRouter } from "next/navigation";
import Header from "../components/header";
import styles from "../autenticacao.module.css";

export default function Login() {
    const router = useRouter();

    function entrar(evento) {
        evento.preventDefault();
        router.push("/principal");
    }

    return (
        <>
            <Header />

            <main className={styles.container}>
                <section className={styles.card}>
                    <h2 className={styles.title}>Entrar no sistema</h2>
                    <p className={styles.subtitle}>
                        Informe seu usuário e sua senha para continuar.
                    </p>

                    <form className={styles.form} onSubmit={entrar}>
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
                            <label htmlFor="senha">Senha</label>
                            <input
                                id="senha"
                                name="senha"
                                type="password"
                                autoComplete="current-password"
                                placeholder="Digite sua senha"
                                required
                            />
                        </div>

                        <button className={styles.button} type="submit">
                            Entrar
                        </button>
                    </form>

                    <button
                        className={styles.secondaryButton}
                        type="button"
                        onClick={() => router.push("/registro")}
                    >
                        Criar uma conta
                    </button>
                </section>
            </main>
        </>
    );
}
