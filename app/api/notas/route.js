import db from "../../db/banco";
import { NextResponse } from "next/server";

const campos = ["trabalho1", "trabalho2", "nota1", "nota2", "nota3"];

function respostaErro(mensagem, status = 400) {
  return NextResponse.json({ error: mensagem }, { status });
}

function validarNota(valor) {
  const numero = Number(valor);
  return Number.isFinite(numero) && numero >= 0 && numero <= 10;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const notas = db.prepare(`
      SELECT
        n.id_nota,
        n.trabalho1 AS t1,
        n.trabalho2 AS t2,
        n.nota1 AS n1,
        n.nota2 AS n2,
        n.nota3 AS n3,
        n.aluno_id,
        a.nome AS aluno_nome,
        a.ra AS aluno_ra,
        ROUND((n.trabalho1 + n.trabalho2 + n.nota1 + n.nota2 + n.nota3) / 5.0, 1) AS media,
        CASE
          WHEN ROUND((n.trabalho1 + n.trabalho2 + n.nota1 + n.nota2 + n.nota3) / 5.0, 1) >= 6.0 THEN 'Aprovado'
          WHEN ROUND((n.trabalho1 + n.trabalho2 + n.nota1 + n.nota2 + n.nota3) / 5.0, 1) >= 5.0 THEN 'Recuperação'
          ELSE 'Reprovado'
        END AS situacao
      FROM notas n
      INNER JOIN aluno a ON a.id_aluno = n.aluno_id
      ORDER BY a.nome
    `).all();

    return NextResponse.json(
      { notas },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error(error);
    return respostaErro("Não foi possível listar as notas.", 500);
  }
}

export async function POST(request) {
  try {
    const dados = await request.json();
    const alunoId = Number(dados.aluno_id);
    const valores = campos.map((campo) => dados[campo] ?? dados[campo.replace("trabalho", "t")] ?? dados[campo.replace("nota", "n")]);

    if (!Number.isInteger(alunoId) || alunoId <= 0) {
      return respostaErro("Informe um aluno válido.");
    }

    if (!valores.every((valor) => validarNota(valor))) {
      return respostaErro("Todas as notas devem ser números entre 0 e 10.");
    }

    const aluno = db.prepare("SELECT id_aluno FROM aluno WHERE id_aluno = ?").get(alunoId);
    if (!aluno) {
      return respostaErro("Aluno não encontrado na base de dados.", 404);
    }

    // Verifica se o aluno já possui notas cadastradas para atualizar (Upsert)
    const notaExistente = db.prepare("SELECT id_nota FROM notas WHERE aluno_id = ?").get(alunoId);

    let idNota;
    if (notaExistente) {
      db.prepare(`
        UPDATE notas 
        SET trabalho1 = ?, trabalho2 = ?, nota1 = ?, nota2 = ?, nota3 = ?
        WHERE aluno_id = ?
      `).run(...valores.map(Number), alunoId);
      idNota = notaExistente.id_nota;
    } else {
      const resultado = db.prepare(`
        INSERT INTO notas (trabalho1, trabalho2, nota1, nota2, nota3, aluno_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(...valores.map(Number), alunoId);
      idNota = Number(resultado.lastInsertRowid);
    }

    const media = Number((valores.reduce((acc, v) => acc + Number(v), 0) / 5).toFixed(1));
    const situacao = media >= 6.0 ? "Aprovado" : media >= 5.0 ? "Recuperação" : "Reprovado";

    return NextResponse.json(
      { 
        message: "Notas salvas com sucesso!", 
        id_nota: idNota,
        media,
        situacao
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return respostaErro("Não foi possível salvar a nota.", 500);
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dados = await request.json();
    const id = Number(dados.id_nota ?? dados.id_notas ?? searchParams.get("id"));
    const valores = campos.map((campo) => dados[campo] ?? dados[campo.replace("trabalho", "t")] ?? dados[campo.replace("nota", "n")]);

    if (!Number.isInteger(id) || id <= 0) {
      return respostaErro("Informe um id de nota válido.");
    }

    if (!valores.every((valor) => validarNota(valor))) {
      return respostaErro("Todas as notas devem estar entre 0 e 10.");
    }

    const resultado = db.prepare(`
      UPDATE notas
      SET trabalho1 = ?, trabalho2 = ?, nota1 = ?, nota2 = ?, nota3 = ?
      WHERE id_nota = ?
    `).run(...valores.map(Number), id);

    if (resultado.changes === 0) {
      return respostaErro("Nota não encontrada.", 404);
    }

    return NextResponse.json({ message: "Nota atualizada com sucesso!" });
  } catch (error) {
    console.error(error);
    return respostaErro("Não foi possível atualizar a nota.", 500);
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id") ?? 0);

    if (!Number.isInteger(id) || id <= 0) {
      return respostaErro("Informe um id de nota válido.");
    }

    const resultado = db.prepare("DELETE FROM notas WHERE id_nota = ?").run(id);

    if (resultado.changes === 0) {
      return respostaErro("Nota não encontrada.", 404);
    }

    return NextResponse.json({ message: "Nota excluída com sucesso!" });
  } catch (error) {
    console.error(error);
    return respostaErro("Não foi possível excluir a nota.", 500);
  }
}
