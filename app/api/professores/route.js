import db from "../../db/banco";
import { NextResponse } from "next/server";

const diasDaSemana = [
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
    "Domingo"
];

export async function GET() {
    try {
        const professores = db.prepare(`
            SELECT professores.*, disciplinas.nome AS disciplina_nome
            FROM professores
            INNER JOIN disciplinas
                ON professores.id_disciplina = disciplinas.id_disciplina
            ORDER BY professores.nome
        `).all().map((professor) => ({
            ...professor,
            dias_aula: JSON.parse(professor.dias_aula)
        }));

        return NextResponse.json(professores);
    } catch (erro) {
        console.error("Erro ao listar professores:", erro);
        return NextResponse.json(
            { erro: "Erro ao buscar professores." },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const dados = await request.json();
        const nome = typeof dados.nome === "string" ? dados.nome.trim() : "";
        const nif = typeof dados.nif === "string" ? dados.nif.trim() : "";
        const idDisciplina = Number(dados.id_disciplina);
        const totalAulas = Number(dados.total_aulas_semana);
        const diasAula = dados.dias_aula;

        if (
            !nome ||
            !nif ||
            !Number.isSafeInteger(idDisciplina) ||
            idDisciplina <= 0 ||
            !Number.isSafeInteger(totalAulas) ||
            totalAulas <= 0 ||
            !Array.isArray(diasAula) ||
            diasAula.length === 0 ||
            diasAula.some((dia) => !diasDaSemana.includes(dia)) ||
            new Set(diasAula).size !== diasAula.length
        ) {
            return NextResponse.json(
                { erro: "Preencha os dados do professor com valores válidos." },
                { status: 400 }
            );
        }

        const disciplina = db.prepare(
            "SELECT id_disciplina FROM disciplinas WHERE id_disciplina = ?"
        ).get(idDisciplina);

        if (!disciplina) {
            return NextResponse.json(
                { erro: "A disciplina selecionada não existe." },
                { status: 400 }
            );
        }

        const professorExistente = db.prepare(
            "SELECT id_professor FROM professores WHERE nif = ?"
        ).get(nif);

        if (professorExistente) {
            return NextResponse.json(
                { erro: "Já existe um professor cadastrado com este NIF." },
                { status: 409 }
            );
        }

        const resultado = db.prepare(`
            INSERT INTO professores
                (nome, nif, dias_aula, id_disciplina, total_aulas_semana)
            VALUES (?, ?, ?, ?, ?)
        `).run(
            nome,
            nif,
            JSON.stringify(diasAula),
            idDisciplina,
            totalAulas
        );

        return NextResponse.json({
            mensagem: "Professor cadastrado com sucesso!",
            id_professor: resultado.lastInsertRowid
        });
    } catch (erro) {
        console.error("Erro ao cadastrar professor:", erro);
        return NextResponse.json(
            { erro: "Erro ao cadastrar professor." },
            { status: 500 }
        );
    }
}
