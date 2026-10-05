import db from "../../db/banco";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Helper para validar campos obrigatórios e formato dos dados
function validarDadosAluno(dados) {
  if (!dados || typeof dados !== "object") {
    return "Dados do aluno inválidos ou não informados.";
  }

  const { nome, idade, serie, ra, email } = dados;

  if (!nome || typeof nome !== "string" || !nome.trim()) {
    return "O nome do aluno é obrigatório.";
  }

  const idadeNum = Number(idade);
  if (!Number.isInteger(idadeNum) || idadeNum <= 0 || idadeNum > 120) {
    return "A idade deve ser um número inteiro válido (entre 1 e 120 anos).";
  }

  if (!serie || typeof serie !== "string" || !serie.trim()) {
    return "A série é obrigatória.";
  }

  if (!ra || typeof ra !== "string" || !ra.trim()) {
    return "O RA do aluno é obrigatório.";
  }

  if (!email || typeof email !== "string" || !email.trim() || !email.includes("@")) {
    return "O e-mail do aluno é obrigatório e deve conter '@'.";
  }

  return null;
}

// Helper para tratar erros específicos de restrições UNIQUE do SQLite
function tratarErroConstraint(error) {
  const mensagem = error?.message || "";
  const codigo = error?.code || "";

  const isUnique =
    codigo === "SQLITE_CONSTRAINT_UNIQUE" ||
    codigo === "SQLITE_CONSTRAINT" ||
    mensagem.includes("UNIQUE constraint failed");

  if (!isUnique) return null;

  if (
    mensagem.includes("aluno.email") ||
    mensagem.includes("idx_aluno_email") ||
    /\bemail\b/i.test(mensagem)
  ) {
    return "Já existe um aluno cadastrado com este e-mail.";
  }

  if (
    mensagem.includes("aluno.ra") ||
    mensagem.includes("idx_aluno_ra") ||
    /\bra\b/i.test(mensagem)
  ) {
    return "Já existe um aluno cadastrado com este RA.";
  }

  return "RA ou e-mail já cadastrado para outro aluno.";
}

// GET: Retorna a lista de todos os alunos com suas notas e médias calculadas
export async function GET() {
  try {
    const alunos = db
      .prepare(
        `
      SELECT 
        a.id_aluno,
        a.nome,
        a.idade,
        a.serie,
        a.ra,
        a.email,
        n.id_nota,
        n.trabalho1 AS t1,
        n.trabalho2 AS t2,
        n.nota1 AS n1,
        n.nota2 AS n2,
        n.nota3 AS n3,
        CASE 
          WHEN n.id_nota IS NOT NULL 
          THEN ROUND((n.trabalho1 + n.trabalho2 + n.nota1 + n.nota2 + n.nota3) / 5.0, 1)
          ELSE NULL 
        END AS media,
        CASE
          WHEN n.id_nota IS NULL THEN 'Sem Notas'
          WHEN ROUND((n.trabalho1 + n.trabalho2 + n.nota1 + n.nota2 + n.nota3) / 5.0, 1) >= 6.0 THEN 'Aprovado'
          WHEN ROUND((n.trabalho1 + n.trabalho2 + n.nota1 + n.nota2 + n.nota3) / 5.0, 1) >= 5.0 THEN 'Recuperação'
          ELSE 'Reprovado'
        END AS situacao
      FROM aluno a
      LEFT JOIN notas n ON n.id_nota = (
        SELECT id_nota FROM notas WHERE aluno_id = a.id_aluno ORDER BY id_nota DESC LIMIT 1
      )
      ORDER BY a.nome ASC
    `
      )
      .all();

    return NextResponse.json(
      { alunos },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Erro ao listar alunos:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar a lista de alunos." },
      { status: 500 }
    );
  }
}

// POST: Cadastra um novo aluno no banco de dados SQLite
export async function POST(request) {
  try {
    let dados;
    try {
      dados = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Corpo da requisição deve ser um JSON válido." },
        { status: 400 }
      );
    }

    const erroValidacao = validarDadosAluno(dados);
    if (erroValidacao) {
      return NextResponse.json({ error: erroValidacao }, { status: 400 });
    }

    const stmt = db.prepare(
      "INSERT INTO aluno (nome, idade, serie, ra, email) VALUES (?, ?, ?, ?, ?)"
    );

    const resultado = stmt.run(
      dados.nome.trim(),
      Number(dados.idade),
      dados.serie.trim(),
      dados.ra.trim(),
      dados.email.trim().toLowerCase()
    );

    return NextResponse.json(
      {
        message: "Aluno cadastrado com sucesso!",
        id_aluno: Number(resultado.lastInsertRowid),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao cadastrar aluno:", error);

    const erroConstraint = tratarErroConstraint(error);
    if (erroConstraint) {
      return NextResponse.json({ error: erroConstraint }, { status: 400 });
    }

    return NextResponse.json(
      { error: error?.message || "Erro interno ao cadastrar aluno." },
      { status: 500 }
    );
  }
}

// PUT: Atualiza os dados de um aluno existente
export async function PUT(request) {
  try {
    let dados;
    try {
      dados = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Corpo da requisição deve ser um JSON válido." },
        { status: 400 }
      );
    }

    const id = Number(dados?.id_aluno ?? dados?.id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "ID de aluno inválido para atualização." },
        { status: 400 }
      );
    }

    const erroValidacao = validarDadosAluno(dados);
    if (erroValidacao) {
      return NextResponse.json({ error: erroValidacao }, { status: 400 });
    }

    const stmt = db.prepare(
      "UPDATE aluno SET nome = ?, idade = ?, serie = ?, ra = ?, email = ? WHERE id_aluno = ?"
    );

    const resultado = stmt.run(
      dados.nome.trim(),
      Number(dados.idade),
      dados.serie.trim(),
      dados.ra.trim(),
      dados.email.trim().toLowerCase(),
      id
    );

    if (resultado.changes === 0) {
      return NextResponse.json(
        { error: "Aluno não encontrado para atualização." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Aluno atualizado com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao atualizar aluno:", error);

    const erroConstraint = tratarErroConstraint(error);
    if (erroConstraint) {
      return NextResponse.json({ error: erroConstraint }, { status: 400 });
    }

    return NextResponse.json(
      { error: error?.message || "Erro interno ao atualizar aluno." },
      { status: 500 }
    );
  }
}

// DELETE: Exclui um aluno e suas notas associadas (ON DELETE CASCADE)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "ID de aluno inválido para exclusão." },
        { status: 400 }
      );
    }

    const resultado = db.prepare("DELETE FROM aluno WHERE id_aluno = ?").run(id);

    if (resultado.changes === 0) {
      return NextResponse.json(
        { error: "Aluno não encontrado para exclusão." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Aluno excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir aluno:", error);
    return NextResponse.json(
      { error: error?.message || "Erro interno ao excluir aluno." },
      { status: 500 }
    );
  }
}