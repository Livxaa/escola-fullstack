"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./header.module.css";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        {/* Logo / Brand */}
        <Link href="/" className={styles.brand}>
          <div className={styles.brandIcon}>
            <span className={styles.diamond} />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>Escola Estadual</span>
            <span className={styles.brandSub}>Excelência · Tradição · Futuro</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>Início</Link>
          <Link href="/cadaaluno" className={styles.navLink}>Cadastro</Link>
          <Link href="/listaaluno" className={styles.navLink}>Alunos</Link>
          <Link href="/notaaluno" className={styles.navLink}>Notas</Link>
          <Link href="/listanota" className={styles.navLink}>Relatórios</Link>
          <Link href="/cadaaluno" className={styles.navCta}>
            Inscreva-se
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Início</Link>
          <Link href="/cadaaluno" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Cadastro</Link>
          <Link href="/listaaluno" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Alunos</Link>
          <Link href="/notaaluno" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Notas</Link>
          <Link href="/listanota" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>Relatórios</Link>
        </div>
      )}
    </header>
  );
}
