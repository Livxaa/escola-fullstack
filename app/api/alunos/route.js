import db from "../../db/banco";
import { NextResponse } from "next/server";
//listar alunos ordenando pelo nome
export async function GET(){
    const alunos = db.prepare('SELECT * FROM alunos ORDER BY nome').all();
    return NextResponse.json(alunos)
}

export async function POST(request){
    try {
        const dados = await request.json();
        
        if (!dados.nome || !dados.idade || !dados.serie || !dados.ra) {
            return NextResponse.json(
                { erro: "Preencha todos os campos obrigatórios (nome, idade, série e RA)!" },
                { status: 400 }
            );
        }

        const alunoExistente = db.prepare("SELECT id_aluno FROM alunos WHERE ra = ?").get(dados.ra);
        if (alunoExistente) {
            return NextResponse.json(
                { erro: "Já existe um aluno cadastrado com este RA!" },
                { status: 400 }
            );
        }

        const sql = db.prepare(`INSERT INTO alunos (nome, idade, serie, ra) VALUES (?,?,?,?)`);
        sql.run(dados.nome, Number(dados.idade), dados.serie, String(dados.ra));
        return NextResponse.json({
            mensagem: "Aluno cadastrado com sucesso!"
        });
    } catch (error) {
        console.error('Erro ao realizar o cadastro:', error);
        return NextResponse.json(
            { erro: "Erro ao cadastrar aluno: " + (error?.message || "Erro desconhecido") },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const dados = await request.json();
        const sql = db.prepare(`
            UPDATE alunos
            SET nome = ?, idade = ?, serie = ?, ra = ?
            WHERE id_aluno = ?
        `);
        sql.run(dados.nome, dados.idade, dados.serie, dados.ra, dados.id_aluno);
        return NextResponse.json({
            mensagem: "Aluno atualizado com sucesso!"
        });
    } catch (erro) {
        console.error('Erro ao editar o aluno ', erro);
        return NextResponse.json({ erro: "Erro ao editar o aluno." }, { status: 500 });
    };
}

// excluir aluno pelo id_aluno
export async function DELETE(request) {
    try {
        const dados = await request.json();
        console.log('dados do aluno ', dados);
        
        const sql = db.prepare(`DELETE FROM alunos WHERE id_aluno = ?`);
        sql.run(dados.id_aluno);
        return NextResponse.json({
            mensagem: "Aluno excluído com sucesso!"
        });
    } catch (erro) {
        console.error('Erro ao excluir o aluno ', erro);
        return NextResponse.json({ erro: 'Erro ao excluir o aluno.' }, { status: 500 });
    }
}
