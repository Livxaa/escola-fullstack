"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import Header from "../components/header";

export default function ListaAlunos() {
  const [busca, setBusca] = useState("");
  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroMsg, setErroMsg] = useState("");

  // Estado para Modal de Edição de Aluno
  const [alunoEditando, setAlunoEditando] = useState(null);
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);
  const [erroEdicao, setErroEdicao] = useState("");

  // Estado para Modal de Cadastro Rápido de Aluno
  const [criandoAluno, setCriandoAluno] = useState(false);
  const [novoAlunoForm, setNovoAlunoForm] = useState({
    nome: "",
    idade: "",
    serie: "",
    ra: "",
    email: "",
  });
  const [salvandoNovo, setSalvandoNovo] = useState(false);
  const [erroNovo, setErroNovo] = useState("");

  // Estado para Modal de Lançamento e Cálculo de Notas
  const [alunoNotas, setAlunoNotas] = useState(null);
  const [notasForm, setNotasForm] = useState({
    t1: "",
    t2: "",
    n1: "",
    n2: "",
    n3: "",
  });
  const [salvandoNotas, setSalvandoNotas] = useState(false);
  const [erroNotas, setErroNotas] = useState("");

  // Função centralizada para carregar dados
  const carregarAlunos = useCallback(async () => {
    setCarregando(true);
    setErroMsg("");
    try {
      const resposta = await fetch("/api/alunos", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (!resposta.ok) {
        throw new Error("Erro ao carregar dados do servidor.");
      }
      const dados = await resposta.json();
      setAlunos(dados.alunos || []);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      setErroMsg("Não foi possível carregar a lista de alunos.");
    } finally {
      setCarregando(false);
    }
  }, []);

  // Efeito inicial + listener de foco na janela
  useEffect(() => {
    carregarAlunos();

    function aoFocarJanela() {
      carregarAlunos();
    }

    window.addEventListener("focus", aoFocarJanela);
    return () => {
      window.removeEventListener("focus", aoFocarJanela);
    };
  }, [carregarAlunos]);

  // Fechar modais ao pressionar a tecla ESC
  useEffect(() => {
    function tratarTeclaEsc(e) {
      if (e.key === "Escape") {
        setAlunoEditando(null);
        setCriandoAluno(false);
        setAlunoNotas(null);
      }
    }
    window.addEventListener("keydown", tratarTeclaEsc);
    return () => window.removeEventListener("keydown", tratarTeclaEsc);
  }, []);

  // Filtro de busca (Exige pelo menos 3 caracteres)
  const alunosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    // Se a busca estiver vazia, retorna todos os alunos
    if (termo.length === 0) {
      return alunos;
    }

    // Se digitou 1 ou 2 caracteres, não retorna nada (aguarda 3 caracteres)
    if (termo.length < 3) {
      return [];
    }

    return alunos.filter((aluno) => {
      return (
        aluno.nome?.toLowerCase().includes(termo) ||
        aluno.ra?.toLowerCase().includes(termo) ||
        aluno.email?.toLowerCase().includes(termo) ||
        aluno.serie?.toLowerCase().includes(termo)
      );
    });
  }, [alunos, busca]);

  // Estatísticas gerais
  const stats = useMemo(() => {
    const total = alunos.length;
    const comNotas = alunos.filter(
      (a) => a.media !== null && a.media !== undefined
    );
    const mediaGeral =
      comNotas.length > 0
        ? (
            comNotas.reduce((acc, a) => acc + Number(a.media), 0) /
            comNotas.length
          ).toFixed(1)
        : "—";
    const aprovados = alunos.filter((a) => a.situacao === "Aprovado").length;
    return { total, mediaGeral, aprovados };
  }, [alunos]);

  // Exclusão de aluno
  async function excluirAluno(idAluno, nomeAluno) {
    const confirmou = window.confirm(
      `Tem certeza que deseja excluir o aluno "${nomeAluno}"?\nEsta ação também removerá todas as suas notas associadas.`
    );
    if (!confirmou) return;

    try {
      const resposta = await fetch(`/api/alunos?id=${idAluno}`, {
        method: "DELETE",
      });
      if (!resposta.ok) {
        const d = await resposta.json();
        throw new Error(d.error || "Erro ao excluir aluno.");
      }
      await carregarAlunos();
    } catch (error) {
      console.error(error);
      alert(error.message || "Não foi possível excluir o aluno.");
    }
  }

  // Abertura do modal de edição
  function abrirEdicao(aluno) {
    setAlunoEditando({
      id_aluno: aluno.id_aluno,
      nome: aluno.nome || "",
      idade: aluno.idade || "",
      serie: aluno.serie || "",
      ra: aluno.ra || "",
      email: aluno.email || "",
    });
    setErroEdicao("");
  }

  // Salvamento da edição
  async function salvarEdicao(e) {
    e.preventDefault();
    setSalvandoEdicao(true);
    setErroEdicao("");

    try {
      const resposta = await fetch("/api/alunos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alunoEditando),
      });

      const dados = await resposta.json();
      if (!resposta.ok) {
        throw new Error(dados.error || "Erro ao atualizar dados do aluno.");
      }

      setAlunoEditando(null);
      await carregarAlunos();
    } catch (err) {
      setErroEdicao(err.message);
    } finally {
      setSalvandoEdicao(false);
    }
  }

  // Salvamento do cadastro rápido de novo aluno
  async function salvarNovoAluno(e) {
    e.preventDefault();
    setSalvandoNovo(true);
    setErroNovo("");

    const idadeNum = Number(novoAlunoForm.idade);
    if (!Number.isInteger(idadeNum) || idadeNum <= 0) {
      setErroNovo("Por favor, informe uma idade válida (número positivo).");
      setSalvandoNovo(false);
      return;
    }

    try {
      const resposta = await fetch("/api/alunos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: novoAlunoForm.nome.trim(),
          idade: idadeNum,
          serie: novoAlunoForm.serie.trim(),
          ra: novoAlunoForm.ra.trim(),
          email: novoAlunoForm.email.trim(),
        }),
      });

      const dados = await resposta.json();
      if (!resposta.ok) {
        throw new Error(dados.error || "Erro ao cadastrar novo aluno.");
      }

      setCriandoAluno(false);
      setNovoAlunoForm({ nome: "", idade: "", serie: "", ra: "", email: "" });
      await carregarAlunos();
    } catch (err) {
      setErroNovo(err.message);
    } finally {
      setSalvandoNovo(false);
    }
  }

  // Abertura do modal de notas
  function abrirNotas(aluno) {
    setAlunoNotas(aluno);
    setNotasForm({
      t1: aluno.t1 !== null && aluno.t1 !== undefined ? String(aluno.t1) : "",
      t2: aluno.t2 !== null && aluno.t2 !== undefined ? String(aluno.t2) : "",
      n1: aluno.n1 !== null && aluno.n1 !== undefined ? String(aluno.n1) : "",
      n2: aluno.n2 !== null && aluno.n2 !== undefined ? String(aluno.n2) : "",
      n3: aluno.n3 !== null && aluno.n3 !== undefined ? String(aluno.n3) : "",
    });
    setErroNotas("");
  }

  // Cálculo da média em tempo real no formulário de notas
  const mediaAoVivo = useMemo(() => {
    const vals = [notasForm.t1, notasForm.t2, notasForm.n1, notasForm.n2, notasForm.n3];
    const numVals = vals.map((v) => (v === "" || isNaN(v) ? null : Number(v)));
    if (numVals.some((v) => v === null)) return null;

    const soma = numVals.reduce((acc, v) => acc + v, 0);
    return Number((soma / 5).toFixed(1));
  }, [notasForm]);

  // Salvamento de notas
  async function salvarNotas(e) {
    e.preventDefault();
    setSalvandoNotas(true);
    setErroNotas("");

    try {
      const resposta = await fetch("/api/notas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aluno_id: alunoNotas.id_aluno,
          trabalho1: Number(notasForm.t1),
          trabalho2: Number(notasForm.t2),
          nota1: Number(notasForm.n1),
          nota2: Number(notasForm.n2),
          nota3: Number(notasForm.n3),
        }),
      });

      const dados = await resposta.json();
      if (!resposta.ok) {
        throw new Error(dados.error || "Erro ao salvar notas.");
      }

      setAlunoNotas(null);
      await carregarAlunos();
    } catch (err) {
      setErroNotas(err.message);
    } finally {
      setSalvandoNotas(false);
    }
  }

  return (
    <>
      <Header />
      <main className={styles.container}>
        <p className={styles.eyebrow}>Secretaria Escolar</p>
        <div className={styles.headerRow}>
          <h1>Lista de Alunos &amp; Desempenho</h1>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={carregarAlunos}
              style={{
                background: "#f1f5f9",
                color: "#334155",
                border: "1px solid #cbd5e1",
                padding: "0.75rem 1.1rem",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
              title="Recarregar lista do banco de dados"
            >
              🔄 Atualizar
            </button>
            <button
              type="button"
              className={styles.newButton}
              onClick={() => {
                setCriandoAluno(true);
                setErroNovo("");
              }}
            >
              + Novo Aluno Rápido
            </button>
            <Link
              href="/cadaaluno"
              className={styles.newButton}
              style={{ background: "var(--burgundy)" }}
            >
              Ir para Cadastro Completo
            </Link>
          </div>
        </div>

        {/* Resumo com estatísticas */}
        <div className={styles.statsBar}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total de Alunos</span>
            <span className={styles.statValue}>{stats.total}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Média Geral da Escola</span>
            <span className={styles.statValue}>{stats.mediaGeral}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Alunos Aprovados</span>
            <span className={styles.statValue}>{stats.aprovados}</span>
          </div>
        </div>

        <label className={styles.searchLabel} htmlFor="busca-aluno">
          Pesquisar aluno:
        </label>
        <input
          className={styles.searchInput}
          id="busca-aluno"
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Digite no mínimo 3 caracteres para buscar..."
        />

        {/* Aviso de feedback ao digitar menos de 3 caracteres */}
        {busca.trim().length > 0 && busca.trim().length < 3 && (
          <p style={{ color: "#eab308", fontSize: "0.85rem", marginTop: "0.4rem", fontWeight: 500 }}>
            ⚠️ Digite pelo menos 3 caracteres para realizar a pesquisa.
          </p>
        )}

        {erroMsg && <div className={styles.alertBox}>{erroMsg}</div>}

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <caption className={styles.caption}>
              {alunosFiltrados.length} aluno(s) exibido(s)
            </caption>
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Idade</th>
                <th scope="col">Série</th>
                <th scope="col">RA</th>
                <th scope="col">E-mail</th>
                <th scope="col">Média</th>
                <th scope="col">Situação</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {alunosFiltrados.map((aluno) => {
                const badgeClass =
                  aluno.situacao === "Aprovado"
                    ? styles.badgeApproved
                    : aluno.situacao === "Recuperação"
                    ? styles.badgeWarning
                    : aluno.situacao === "Reprovado"
                    ? styles.badgeDanger
                    : styles.badgeNeutral;

                return (
                  <tr key={aluno.id_aluno}>
                    <td className={styles.alunoNome}>{aluno.nome}</td>
                    <td>{aluno.idade} anos</td>
                    <td>{aluno.serie}</td>
                    <td>
                      <code>{aluno.ra}</code>
                    </td>
                    <td>{aluno.email}</td>
                    <td>
                      {aluno.media !== null && aluno.media !== undefined ? (
                        <span className={styles.mediaNota}>
                          {Number(aluno.media).toFixed(1)}
                        </span>
                      ) : (
                        <span style={{ color: "#9ca3af" }}>—</span>
                      )}
                    </td>
                    <td>
                      <span className={`${styles.badge} ${badgeClass}`}>
                        {aluno.situacao || "Pendente"}
                      </span>
                    </td>
                    <td className={styles.actionsCell}>
                      <button
                        className={styles.gradesButton}
                        onClick={() => abrirNotas(aluno)}
                        title="Calcular e Lançar Notas"
                      >
                        📊 Notas / Média
                      </button>
                      <button
                        className={styles.editButton}
                        onClick={() => abrirEdicao(aluno)}
                        title="Editar Dados do Aluno"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() =>
                          excluirAluno(aluno.id_aluno, aluno.nome)
                        }
                        title="Excluir Aluno"
                      >
                        🗑️ Excluir
                      </button>
                    </td>
                  </tr>
                );
              })}

              {!carregando && alunosFiltrados.length === 0 && (
                <tr>
                  <td className={styles.empty} colSpan={8}>
                    {busca.trim().length > 0 && busca.trim().length < 3
                      ? "Aguardando no mínimo 3 caracteres para pesquisar..."
                      : "Nenhum aluno encontrado."}
                  </td>
                </tr>
              )}

              {carregando && (
                <tr>
                  <td className={styles.empty} colSpan={8}>
                    A carregar dados escolares...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Modal de Edição de Aluno ── */}
        {alunoEditando && (
          <div
            className={styles.modalOverlay}
            onClick={() => setAlunoEditando(null)}
          >
            <div
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Editar Aluno</h2>
                <button
                  className={styles.closeButton}
                  onClick={() => setAlunoEditando(null)}
                >
                  ×
                </button>
              </div>

              <form onSubmit={salvarEdicao}>
                <div className={styles.modalBody}>
                  {erroEdicao && (
                    <div className={styles.alertBox}>{erroEdicao}</div>
                  )}

                  <div className={styles.formGroup}>
                    <label>Nome Completo:</label>
                    <input
                      type="text"
                      required
                      value={alunoEditando.nome}
                      onChange={(e) =>
                        setAlunoEditando({
                          ...alunoEditando,
                          nome: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Idade:</label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      required
                      value={alunoEditando.idade}
                      onChange={(e) =>
                        setAlunoEditando({
                          ...alunoEditando,
                          idade: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Série / Turma:</label>
                    <input
                      type="text"
                      required
                      value={alunoEditando.serie}
                      onChange={(e) =>
                        setAlunoEditando({
                          ...alunoEditando,
                          serie: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Registro Acadêmico (RA):</label>
                    <input
                      type="text"
                      required
                      value={alunoEditando.ra}
                      onChange={(e) =>
                        setAlunoEditando({
                          ...alunoEditando,
                          ra: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>E-mail:</label>
                    <input
                      type="email"
                      required
                      value={alunoEditando.email}
                      onChange={(e) =>
                        setAlunoEditando({
                          ...alunoEditando,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => setAlunoEditando(null)}
                    disabled={salvandoEdicao}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={salvandoEdicao}
                  >
                    {salvandoEdicao ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Modal de Lançamento e Cálculo da Média de Notas ── */}
        {alunoNotas && (
          <div
            className={styles.modalOverlay}
            onClick={() => setAlunoNotas(null)}
          >
            <div
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <div>
                  <h2 className={styles.modalTitle}>Lançar Notas & Média</h2>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#64748b",
                      margin: 0,
                    }}
                  >
                    Aluno: <strong>{alunoNotas.nome}</strong> (RA:{" "}
                    {alunoNotas.ra})
                  </p>
                </div>
                <button
                  className={styles.closeButton}
                  onClick={() => setAlunoNotas(null)}
                >
                  ×
                </button>
              </div>

              <form onSubmit={salvarNotas}>
                <div className={styles.modalBody}>
                  {erroNotas && (
                    <div className={styles.alertBox}>{erroNotas}</div>
                  )}

                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#475569",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Informe as notas de <strong>0 a 10</strong>. A média final
                    será calculada automaticamente:
                  </p>

                  <div className={styles.gridNotas}>
                    <div className={styles.formGroup}>
                      <label>Trabalho 1 (T1):</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        required
                        value={notasForm.t1}
                        onChange={(e) =>
                          setNotasForm({ ...notasForm, t1: e.target.value })
                        }
                        placeholder="0.0 a 10.0"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Trabalho 2 (T2):</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        required
                        value={notasForm.t2}
                        onChange={(e) =>
                          setNotasForm({ ...notasForm, t2: e.target.value })
                        }
                        placeholder="0.0 a 10.0"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Prova 1 (N1):</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        required
                        value={notasForm.n1}
                        onChange={(e) =>
                          setNotasForm({ ...notasForm, n1: e.target.value })
                        }
                        placeholder="0.0 a 10.0"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Prova 2 (N2):</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        required
                        value={notasForm.n2}
                        onChange={(e) =>
                          setNotasForm({ ...notasForm, n2: e.target.value })
                        }
                        placeholder="0.0 a 10.0"
                      />
                    </div>

                    <div
                      className={styles.formGroup}
                      style={{ gridColumn: "span 2" }}
                    >
                      <label>Prova 3 (N3):</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        required
                        value={notasForm.n3}
                        onChange={(e) =>
                          setNotasForm({ ...notasForm, n3: e.target.value })
                        }
                        placeholder="0.0 a 10.0"
                      />
                    </div>
                  </div>

                  {/* Card com a média calculada em tempo real */}
                  <div className={styles.mediaLiveCard}>
                    <div>
                      <div className={styles.mediaLiveLabel}>
                        Média Ponderada / Final
                      </div>
                      <div className={styles.mediaLiveFormula}>
                        Fórmula: (T1 + T2 + N1 + N2 + N3) ÷ 5
                      </div>
                    </div>
                    <div className={styles.mediaLiveValue}>
                      <div className={styles.mediaLiveNumber}>
                        {mediaAoVivo !== null ? mediaAoVivo.toFixed(1) : "—"}
                      </div>
                      <div>
                        {mediaAoVivo !== null ? (
                          mediaAoVivo >= 6.0 ? (
                            <span
                              className={`${styles.badge} ${styles.badgeApproved}`}
                            >
                              Aprovado (≥ 6.0)
                            </span>
                          ) : mediaAoVivo >= 5.0 ? (
                            <span
                              className={`${styles.badge} ${styles.badgeWarning}`}
                            >
                              Recuperação (5.0 a 5.9)
                            </span>
                          ) : (
                            <span
                              className={`${styles.badge} ${styles.badgeDanger}`}
                            >
                              Reprovado (&lt; 5.0)
                            </span>
                          )
                        ) : (
                          <span
                            className={`${styles.badge} ${styles.badgeNeutral}`}
                          >
                            Aguardando notas
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => setAlunoNotas(null)}
                    disabled={salvandoNotas}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={salvandoNotas}
                  >
                    {salvandoNotas
                      ? "Salvando Notas..."
                      : "Gravar Notas e Média"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Modal de Cadastro Rápido de Aluno ── */}
        {criandoAluno && (
          <div
            className={styles.modalOverlay}
            onClick={() => setCriandoAluno(false)}
          >
            <div
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>
                  Novo Aluno (Cadastro Rápido)
                </h2>
                <button
                  className={styles.closeButton}
                  onClick={() => setCriandoAluno(false)}
                >
                  ×
                </button>
              </div>

              <form onSubmit={salvarNovoAluno}>
                <div className={styles.modalBody}>
                  {erroNovo && (
                    <div className={styles.alertBox}>{erroNovo}</div>
                  )}

                  <div className={styles.formGroup}>
                    <label>Nome Completo:</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Carlos Santana"
                      value={novoAlunoForm.nome}
                      onChange={(e) =>
                        setNovoAlunoForm({
                          ...novoAlunoForm,
                          nome: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Idade:</label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      required
                      placeholder="Ex: 16"
                      value={novoAlunoForm.idade}
                      onChange={(e) =>
                        setNovoAlunoForm({
                          ...novoAlunoForm,
                          idade: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Série / Turma:</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 3º Ano B"
                      value={novoAlunoForm.serie}
                      onChange={(e) =>
                        setNovoAlunoForm({
                          ...novoAlunoForm,
                          serie: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Registro Acadêmico (RA):</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 2026B010"
                      value={novoAlunoForm.ra}
                      onChange={(e) =>
                        setNovoAlunoForm({
                          ...novoAlunoForm,
                          ra: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>E-mail Institucional:</label>
                    <input
                      type="email"
                      required
                      placeholder="Ex: carlos.santana@escola.com"
                      value={novoAlunoForm.email}
                      onChange={(e) =>
                        setNovoAlunoForm({
                          ...novoAlunoForm,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => setCriandoAluno(false)}
                    disabled={salvandoNovo}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={salvandoNovo}
                  >
                    {salvandoNovo ? "Cadastrando..." : "Cadastrar Aluno"}
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