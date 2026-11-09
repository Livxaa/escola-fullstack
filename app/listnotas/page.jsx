'use client';
import { useState, useEffect } from "react";
import Header from "../components/header";
import styles from './listanotas.module.css';

export default function ListNotas() {
    const [notas, setNotas] = useState([]);
    const [busca, setBusca] = useState('');
    const [notaEditando, setNotaEditando] = useState(null);

    // Campos do formulário de edição
    const [editT1, setEditT1] = useState('');
    const [editT2, setEditT2] = useState('');
    const [editN1, setEditN1] = useState('');
    const [editN2, setEditN2] = useState('');
    const [editN3, setEditN3] = useState('');

    useEffect(() => {
        buscarNotas();
    }, []);

    async function buscarNotas() {
        try {
            const resposta = await fetch('/api/notas');
            const dados = await resposta.json();
            setNotas(Array.isArray(dados) ? dados : []);
        } catch (erro) {
            console.error("Erro ao buscar notas:", erro);
        }
    }

    function abrirEdicao(nota) {
        setNotaEditando(nota);
        setEditT1(nota.t1);
        setEditT2(nota.t2);
        setEditN1(nota.n1);
        setEditN2(nota.n2);
        setEditN3(nota.n3);
    }

    function fecharEdicao() {
        setNotaEditando(null);
    }

    async function salvarEdicao(e) {
        e.preventDefault();
        try {
            const resposta = await fetch('/api/notas', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_nota: notaEditando.id_nota,
                    t1: parseFloat(editT1) || 0,
                    t2: parseFloat(editT2) || 0,
                    n1: parseFloat(editN1) || 0,
                    n2: parseFloat(editN2) || 0,
                    n3: parseFloat(editN3) || 0,
                })
            });
            const dados = await resposta.json();
            alert(dados.mensagem || dados.erro);
            if (resposta.ok) {
                fecharEdicao();
                buscarNotas();
            }
        } catch (erro) {
            console.error("Erro ao atualizar nota:", erro);
            alert("Erro ao atualizar nota.");
        }
    }

    async function excluirNota(id_nota) {
        if (!confirm("Deseja realmente excluir o registro de notas deste aluno?")) {
            return;
        }

        try {
            const resposta = await fetch('/api/notas', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_nota })
            });
            const dados = await resposta.json();
            alert(dados.mensagem || dados.erro);
            buscarNotas();
        } catch (erro) {
            console.error("Erro ao excluir nota:", erro);
            alert("Erro ao excluir nota.");
        }
    }

    const notasFiltradas = notas.filter((item) => {
        const termo = busca.trim().toLowerCase();
        if (!termo) return true;
        return (
            item.nome?.toLowerCase().includes(termo) ||
            item.ra?.toString().toLowerCase().includes(termo) ||
            item.serie?.toLowerCase().includes(termo)
        );
    });

    return (
        <>
            <Header />

            <main className={styles.main}>
                <section className={styles.tituloArea}>
                    <h2>Lista de Notas</h2>
                    <p>Consulte todas as notas cadastradas no sistema.</p>
                </section>

                <section className={styles.tabelaContainer}>
                    <div className={styles.actions}>
                        <input
                            type="text"
                            placeholder="Pesquisar por aluno, RA ou série..."
                            className={styles.search}
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />

                        <div className={styles.total}>
                            Total: {notasFiltradas.length} {notasFiltradas.length === 1 ? 'registro' : 'registros'}
                        </div>
                    </div>

                    <table className={styles.tabela}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>RA</th>
                                <th>T1</th>
                                <th>T2</th>
                                <th>N1</th>
                                <th>N2</th>
                                <th>N3</th>
                                <th>Média</th>
                                <th style={{ textAlign: "center" }}>Ações</th>
                            </tr>
                        </thead>

                        <tbody>
                            {notasFiltradas.length > 0 ? (
                                notasFiltradas.map((nota) => {
                                    const media = (
                                        (Number(nota.t1) + Number(nota.t2) + Number(nota.n1) + Number(nota.n2) + Number(nota.n3)) / 5
                                    ).toFixed(1);

                                    return (
                                        <tr key={nota.id_nota}>
                                            <td>{nota.id_nota}</td>
                                            <td><strong>{nota.nome}</strong></td>
                                            <td>{nota.ra}</td>
                                            <td>{Number(nota.t1).toFixed(1)}</td>
                                            <td>{Number(nota.t2).toFixed(1)}</td>
                                            <td>{Number(nota.n1).toFixed(1)}</td>
                                            <td>{Number(nota.n2).toFixed(1)}</td>
                                            <td>{Number(nota.n3).toFixed(1)}</td>
                                            <td>
                                                <strong style={{ color: Number(media) >= 6 ? '#2b6cb0' : '#c53030' }}>
                                                    {media}
                                                </strong>
                                            </td>
                                            <td style={{ textAlign: "center" }}>
                                                <button
                                                    className={styles.botaoEditar}
                                                    onClick={() => abrirEdicao(nota)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className={styles.botaoExcluir}
                                                    onClick={() => excluirNota(nota.id_nota)}
                                                >
                                                    Excluir
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="10" style={{ textAlign: "center", padding: "2rem", color: "#a0aec0" }}>
                                        Nenhuma nota encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </section>

                {/* Modal de Edição de Nota */}
                {notaEditando && (
                    <div className={styles.modalOverlay} onClick={fecharEdicao}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <h3>Editar Notas - {notaEditando.nome}</h3>
                            <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                RA: {notaEditando.ra}
                            </p>

                            <form onSubmit={salvarEdicao} className={styles.modalForm}>
                                <div className={styles.inputGroup}>
                                    <label>Trabalho 1 (T1)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="10"
                                        value={editT1}
                                        onChange={(e) => setEditT1(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Trabalho 2 (T2)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="10"
                                        value={editT2}
                                        onChange={(e) => setEditT2(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Nota 1 (N1)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="10"
                                        value={editN1}
                                        onChange={(e) => setEditN1(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Nota 2 (N2)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="10"
                                        value={editN2}
                                        onChange={(e) => setEditN2(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label>Nota 3 (N3)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="10"
                                        value={editN3}
                                        onChange={(e) => setEditN3(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className={styles.modalButtons}>
                                    <button type="submit" className={styles.btnSalvarModal}>
                                        Salvar Alterações
                                    </button>
                                    <button type="button" onClick={fecharEdicao} className={styles.btnCancelarModal}>
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}
