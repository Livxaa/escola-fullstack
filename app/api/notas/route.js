import db from "../../db/banco";
import { NextResponse } from "next/server";

// Listar notas com dados do aluno
export async function GET() {
    try {
        const notas = db.prepare(`
            SELECT 
                notas.id_nota, 
                notas.id_aluno,
                notas.t1, 
                notas.t2, 
                notas.n1, 
                notas.n2, 
                notas.n3, 
                alunos.nome, 
                alunos.ra,
                alunos.serie,
                alunos.idade
            FROM notas 
            INNER JOIN alunos ON notas.id_aluno = alunos.id_aluno
            ORDER BY alunos.nome
        `).all();
        return NextResponse.json(notas);
    } catch (erro) {
        console.error("Erro ao listar notas:", erro);
        return NextResponse.json({ erro: "Erro ao buscar notas." }, { status: 500 });
    }
}

// Salvar / Criar nota
export async function POST(request) {
    try {
        const dados = await request.json();
        const t1 = parseFloat(dados.trabalho1 ?? dados.t1) || 0;
        const t2 = parseFloat(dados.trabalho2 ?? dados.t2) || 0;
        const n1 = parseFloat(dados.nota1 ?? dados.n1) || 0;
        const n2 = parseFloat(dados.nota2 ?? dados.n2) || 0;
        const n3 = parseFloat(dados.nota3 ?? dados.n3) || 0;
        const id_aluno = dados.id_aluno;

        if (!id_aluno) {
            return NextResponse.json({ erro: "ID do aluno é obrigatório." }, { status: 400 });
        }

        // Verifica se o aluno já tem nota cadastrada
        const notaExistente = db.prepare("SELECT id_nota FROM notas WHERE id_aluno = ?").get(id_aluno);

        if (notaExistente) {
            const updateSql = db.prepare(`
                UPDATE notas 
                SET t1 = ?, t2 = ?, n1 = ?, n2 = ?, n3 = ? 
                WHERE id_aluno = ?
            `);
            updateSql.run(t1, t2, n1, n2, n3, id_aluno);
            return NextResponse.json({ mensagem: "Notas atualizadas com sucesso!" });
        } else {
            const insertSql = db.prepare(`
                INSERT INTO notas (id_aluno, t1, t2, n1, n2, n3) 
                VALUES (?, ?, ?, ?, ?, ?)
            `);
            insertSql.run(id_aluno, t1, t2, n1, n2, n3);
            return NextResponse.json({ mensagem: "Nota cadastrada com sucesso!" });
        }
    } catch (erro) {
        console.error("Erro ao realizar o cadastro de notas:", erro);
        return NextResponse.json({ erro: "Erro ao salvar notas." }, { status: 500 });
    }
}

// Editar nota
export async function PUT(request) {
    try {
        const dados = await request.json();
        const id_nota = dados.id_nota;
        const t1 = parseFloat(dados.trabalho1 ?? dados.t1) || 0;
        const t2 = parseFloat(dados.trabalho2 ?? dados.t2) || 0;
        const n1 = parseFloat(dados.nota1 ?? dados.n1) || 0;
        const n2 = parseFloat(dados.nota2 ?? dados.n2) || 0;
        const n3 = parseFloat(dados.nota3 ?? dados.n3) || 0;

        if (!id_nota) {
            return NextResponse.json({ erro: "ID da nota é obrigatório." }, { status: 400 });
        }

        const sql = db.prepare(`
            UPDATE notas
            SET t1 = ?, t2 = ?, n1 = ?, n2 = ?, n3 = ?
            WHERE id_nota = ?
        `);
        sql.run(t1, t2, n1, n2, n3, id_nota);
        return NextResponse.json({
            mensagem: "Nota atualizada com sucesso!"
        });
    } catch (erro) {
        console.error("Erro ao editar nota:", erro);
        return NextResponse.json({ erro: "Erro ao editar a nota." }, { status: 500 });
    }
}

// Excluir nota pelo id_nota
export async function DELETE(request) {
    try {
        const dados = await request.json();
        const id_nota = dados.id_nota;

        if (!id_nota) {
            return NextResponse.json({ erro: "ID da nota é obrigatório." }, { status: 400 });
        }

        const sql = db.prepare(`DELETE FROM notas WHERE id_nota = ?`);
        sql.run(id_nota);
        return NextResponse.json({
            mensagem: "Nota excluída com sucesso!"
        });
    } catch (erro) {
        console.error("Erro ao excluir a nota:", erro);
        return NextResponse.json({ erro: "Erro ao excluir a nota." }, { status: 500 });
    }
}
