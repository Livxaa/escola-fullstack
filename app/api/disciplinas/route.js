import db from "../../db/banco";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const disciplinas = db.prepare(
            "SELECT * FROM disciplinas ORDER BY nome"
        ).all();
        return NextResponse.json(disciplinas);
    } catch (erro) {
        console.error("Erro ao listar disciplinas:", erro);
        return NextResponse.json(
            { erro: "Erro ao buscar disciplinas." },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const dados = await request.json();
        const nome = typeof dados.nome === "string" ? dados.nome.trim() : "";
        const pontuacaoInformada = dados.pontuacao_minima;
        const pontuacaoMinima = Number(pontuacaoInformada);
        const pontuacaoValida =
            (typeof pontuacaoInformada === "number" ||
                (typeof pontuacaoInformada === "string" &&
                    pontuacaoInformada.trim() !== "")) &&
            Number.isFinite(pontuacaoMinima) &&
            pontuacaoMinima >= 0 &&
            pontuacaoMinima <= 10;

        if (!nome || !pontuacaoValida) {
            return NextResponse.json(
                { erro: "Informe o nome e uma pontuação mínima entre 0 e 10." },
                { status: 400 }
            );
        }

        const resultado = db.prepare(
            "INSERT INTO disciplinas (nome, pontuacao_minima) VALUES (?, ?)"
        ).run(nome, pontuacaoMinima);

        return NextResponse.json({
            mensagem: "Disciplina cadastrada com sucesso!",
            id_disciplina: resultado.lastInsertRowid
        });
    } catch (erro) {
        console.error("Erro ao cadastrar disciplina:", erro);
        return NextResponse.json(
            { erro: "Erro ao cadastrar disciplina." },
            { status: 500 }
        );
    }
}
