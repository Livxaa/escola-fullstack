import Link from "next/link";
import estilos from './header.module.css'

export default function Header(){
    return(
        <header className={estilos.header}>
            <h1 className={estilos.title}>Projeto Escola</h1>
            <nav>
                <ul className={estilos.menu}>
                    <li><Link href='/'>Início</Link></li>
                    <li><Link href='/cadaluno'>Alunos - Cadastro</Link></li>
                    <li><Link href='/listaluno'>Alunos - Lista</Link></li>
                    <li><Link href='/cadnotas'>Notas - Cadastro</Link></li>
                    <li><Link href='/listnotas'>Notas - Lista</Link></li>
                </ul>
            </nav>
        </header>
    )
}

