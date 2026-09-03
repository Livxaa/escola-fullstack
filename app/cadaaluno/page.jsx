"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Header from "../components/header";

export default function CadaAluno() {
    const [nome, setNome] = useState("");
    const [idade, setIdade] = useState("");
    const [email, setEmail] = useState("");
    const [ra, setRa] = useState("");
    const [mensagem, setMensagem] = useState("");

    function handleSubmit(event) {
      event.preventDefault();
      setMensagem(`Aluno ${nome} cadastrado com sucesso!`);
    }

 return(
   <>
   <Header/>
   <main className={styles.container}>
   <p className={styles.eyebrow}>Secretaria escolar</p>
   <h1>Cadastro de Alunos</h1>
   <p className={styles.description}>Preencha os dados abaixo para realizar o cadastro.</p>
   <form onSubmit={handleSubmit} className={styles.form}>
     <label htmlFor="nome">Nome:</label>
     <input
       type="text"
       id="nome"
       name="nome"
       value={nome}
       onChange={(e) => setNome(e.target.value)}
       required
     />
     <label htmlFor="idade">Idade:</label>
     <input
       type="number"
       id="idade"
       name="idade"
      min="1"
      max="120"
       value={idade}
       onChange={(e) => setIdade(e.target.value)}
       required
     />
     <label htmlFor="email">Email:</label>
     <input
       type="email"
       id="email"
       name="email"
       value={email}
       onChange={(e) => setEmail(e.target.value)}
       required
     />
     <label htmlFor="ra">RA:</label>
     <input
       type="text"
       id="ra"
       name="ra"
       value={ra}
       onChange={(e) => setRa(e.target.value)}
       required
     />
     <button type="submit" className={styles.submitButton}>Cadastrar aluno</button>
     {mensagem && <p className={styles.success} role="status">{mensagem}</p>}
   </form>
   </main>
 </>)}