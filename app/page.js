import Header from "./components/header";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <Header />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className={styles.hero}>
        {/* Ornamental grid background */}
        <div className={styles.heroGrid} aria-hidden="true">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className={styles.heroGridDot} />
          ))}
        </div>

        {/* Decorative diamonds */}
        <div className={styles.heroDiamonds} aria-hidden="true">
          <span className={`${styles.d} ${styles.d1}`} />
          <span className={`${styles.d} ${styles.d2}`} />
          <span className={`${styles.d} ${styles.d3}`} />
        </div>

        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroLeft}>
            <p className="section-label">Bem-vindo à nossa instituição</p>

            <h1 className={styles.heroTitle}>
              Formando <em>Líderes</em> com Tradição e Excelência
            </h1>

            <p className={styles.heroDesc}>
              Uma escola comprometida com a formação integral do aluno — acadêmica,
              humanista e cidadã — há décadas sendo referência em educação de qualidade.
            </p>

            <div className={styles.heroActions}>
              <a href="/cadaaluno" className={styles.btnPrimary}>
                Faça sua Matrícula
              </a>
              <a href="#sobre" className={styles.btnOutline}>
                Conheça a Escola
              </a>
            </div>

            {/* Stats row */}
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>1.200+</span>
                <span className={styles.statLabel}>Alunos</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statNumber}>80+</span>
                <span className={styles.statLabel}>Professores</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statNumber}>30</span>
                <span className={styles.statLabel}>Anos de história</span>
              </div>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.heroCard}>
              <div className={styles.heroCardInner}>
                <div className={styles.heroIllustration}>
                  <div className={styles.bookStack}>
                    <div className={`${styles.book} ${styles.bookA}`} />
                    <div className={`${styles.book} ${styles.bookB}`} />
                    <div className={`${styles.book} ${styles.bookC}`} />
                  </div>
                  <div className={styles.circleOrn} />
                  <div className={styles.heroQuote}>
                    <p className={styles.heroQuoteText}>
                      "A educação é a arma mais poderosa que você pode usar para mudar o mundo."
                    </p>
                    <span className={styles.heroQuoteAuthor}>— Nelson Mandela</span>
                  </div>
                </div>
              </div>
              {/* Corner ornament */}
              <div className={styles.cornerTL} aria-hidden="true" />
              <div className={styles.cornerBR} aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollLine} />
          <span>Role para baixo</span>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────── */}
      <section id="sobre" className={styles.about}>
        <div className={`container ${styles.aboutGrid}`}>
          <div className={styles.aboutVisual}>
            <div className={styles.aboutImgWrap}>
              <div className={styles.aboutImgMain}>
                <div className={styles.aboutImgPlaceholder}>
                  <span className={styles.buildingIcon}>🏫</span>
                </div>
              </div>
              <div className={styles.aboutBadge}>
                <span className={styles.badgeYear}>Desde</span>
                <span className={styles.badgeNum}>1994</span>
              </div>
              {/* Ornament behind image */}
              <div className={styles.aboutDotGrid} aria-hidden="true" />
            </div>
          </div>

          <div className={styles.aboutText}>
            <p className="section-label">Nossa História</p>
            <h2 className="section-title" style={{ marginTop: "0.6rem" }}>
              Três décadas moldando <em style={{ fontStyle: "italic", color: "var(--burgundy)" }}>futuros</em>
            </h2>
            <p className={styles.aboutPara}>
              Fundada em 1994, nossa escola nasceu com o propósito de oferecer ensino público de
              excelência para toda a comunidade. Ao longo dos anos, construímos uma tradição de
              resultados acadêmicos, formação humana e protagonismo estudantil.
            </p>
            <p className={styles.aboutPara}>
              Contamos com infraestrutura moderna, corpo docente altamente qualificado e um ambiente
              acolhedor que incentiva a curiosidade, a criatividade e o espírito crítico.
            </p>

            <div className={styles.pillars}>
              {[
                { icon: "📚", title: "Excelência Acadêmica", desc: "Metodologias inovadoras e resultados comprovados." },
                { icon: "🤝", title: "Valores Humanos", desc: "Formação integral com ética e responsabilidade." },
                { icon: "🌱", title: "Sustentabilidade", desc: "Educação ambiental integrada ao currículo." },
              ].map((p) => (
                <div key={p.title} className={styles.pillar}>
                  <span className={styles.pillarIcon}>{p.icon}</span>
                  <div>
                    <strong className={styles.pillarTitle}>{p.title}</strong>
                    <p className={styles.pillarDesc}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BANNER ───────────────────────────────────── */}
      <section className={styles.banner}>
        <div className={styles.bannerPattern} aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className={styles.bannerDiamond} />
          ))}
        </div>
        <div className={`container ${styles.bannerContent}`}>
          <p className={styles.bannerQuote}>
            "Educar não é transferir conhecimento, mas criar possibilidades para a sua produção."
          </p>
          <span className={styles.bannerAuthor}>— Paulo Freire</span>
        </div>
      </section>

      {/* ── COURSES / NÍVEIS ─────────────────────────── */}
      <section className={styles.courses}>
        <div className="container">
          <div className={styles.sectionHead}>
            <p className="section-label">O que oferecemos</p>
            <h2 className="section-title" style={{ marginTop: "0.6rem" }}>
              Níveis de Ensino
            </h2>
          </div>

          <div className={styles.courseGrid}>
            {[
              {
                num: "01",
                title: "Ensino Fundamental I",
                years: "1º ao 5º Ano",
                desc: "Base sólida em alfabetização, matemática, ciências e artes com metodologia lúdica e criativa.",
                color: "var(--olive)",
              },
              {
                num: "02",
                title: "Ensino Fundamental II",
                years: "6º ao 9º Ano",
                desc: "Aprofundamento curricular com foco em raciocínio crítico, ciências humanas e exatas.",
                color: "var(--burgundy)",
              },
              {
                num: "03",
                title: "Ensino Médio",
                years: "1ª a 3ª Série",
                desc: "Preparação para ENEM e vestibulares com turmas de reforço, projetos e orientação vocacional.",
                color: "var(--olive-dark)",
              },
            ].map((c) => (
              <article key={c.num} className={styles.courseCard}>
                <div className={styles.courseNum} style={{ color: c.color }}>{c.num}</div>
                <div className={styles.courseBody}>
                  <span className={styles.courseYears}>{c.years}</span>
                  <h3 className={styles.courseTitle}>{c.title}</h3>
                  <p className={styles.courseDesc}>{c.desc}</p>
                </div>
                <div className={styles.courseAccent} style={{ background: c.color }} />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACTIVITIES ───────────────────────────────── */}
      <section className={styles.activities}>
        <div className="container">
          <div className={styles.sectionHead}>
            <p className="section-label">Além da sala de aula</p>
            <h2 className="section-title" style={{ marginTop: "0.6rem" }}>
              Atividades & Projetos
            </h2>
          </div>

          <div className={styles.actGrid}>
            {[
              { emoji: "🎭", label: "Teatro & Artes" },
              { emoji: "⚽", label: "Esportes" },
              { emoji: "🔬", label: "Laboratório" },
              { emoji: "🎵", label: "Música" },
              { emoji: "🌐", label: "Inglês & Espanhol" },
              { emoji: "💻", label: "Tecnologia" },
            ].map((a) => (
              <div key={a.label} className={styles.actCard}>
                <span className={styles.actEmoji}>{a.emoji}</span>
                <span className={styles.actLabel}>{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────── */}
      <section className={styles.testimonials}>
        <div className="container">
          <div className={styles.sectionHead}>
            <p className="section-label">Depoimentos</p>
            <h2 className="section-title" style={{ marginTop: "0.6rem" }}>
              O que dizem sobre nós
            </h2>
          </div>

          <div className={styles.testiGrid}>
            {[
              {
                text: "A escola mudou a vida do meu filho. O comprometimento dos professores é extraordinário e o ambiente é sempre acolhedor.",
                name: "Maria Aparecida Silva",
                role: "Mãe de aluno do 7º Ano",
                initials: "MA",
              },
              {
                text: "Fui aluno aqui por 9 anos. As amizades, os projetos e a qualidade do ensino me prepararam para a universidade e para a vida.",
                name: "Lucas Ferreira",
                role: "Ex-aluno, hoje universitário",
                initials: "LF",
              },
              {
                text: "Como professora, me orgulho de fazer parte de uma instituição que valoriza a inovação pedagógica e o bem-estar dos alunos.",
                name: "Prof.ª Ana Beatriz Costa",
                role: "Professora de Ciências",
                initials: "AB",
              },
            ].map((t) => (
              <div key={t.name} className={styles.testiCard}>
                <div className={styles.testiQuoteIcon}>"</div>
                <p className={styles.testiText}>{t.text}</p>
                <div className={styles.testiAuthor}>
                  <div className={styles.testiAvatar}>{t.initials}</div>
                  <div>
                    <strong className={styles.testiName}>{t.name}</strong>
                    <span className={styles.testiRole}>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NUMBERS ──────────────────────────────────── */}
      <section className={styles.numbers}>
        <div className="container">
          <div className={styles.numbersGrid}>
            {[
              { value: "98%", label: "Taxa de aprovação no ENEM" },
              { value: "1.2k", label: "Alunos matriculados" },
              { value: "80+", label: "Professores especializados" },
              { value: "30", label: "Anos de excelência" },
            ].map((n) => (
              <div key={n.label} className={styles.numberItem}>
                <span className={styles.numberValue}>{n.value}</span>
                <span className={styles.numberLabel}>{n.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className={styles.cta}>
        <div className={styles.ctaPattern} aria-hidden="true" />
        <div className={`container ${styles.ctaContent}`}>
          <h2 className={styles.ctaTitle}>
            Venha fazer parte da nossa família escolar
          </h2>
          <p className={styles.ctaDesc}>
            Vagas abertas para o próximo ano letivo. Processo de matrícula simplificado e 100% digital.
          </p>
          <div className={styles.ctaButtons}>
            <a href="/cadaaluno" className={styles.ctaBtnPrimary}>
              Realizar Matrícula
            </a>
            <a href="#sobre" className={styles.ctaBtnSecondary}>
              Saber Mais
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <div className={styles.footerLogo}>
                <div className={styles.footerLogoIcon}>
                  <span className={styles.diamond} />
                </div>
                <span className={styles.footerLogoText}>Escola Estadual</span>
              </div>
              <p className={styles.footerTagline}>
                Formando cidadãos, construindo futuros.
              </p>
            </div>

            <div className={styles.footerLinks}>
              <strong className={styles.footerGroupTitle}>Sistema</strong>
              <a href="/cadaaluno" className={styles.footerLink}>Cadastro de Alunos</a>
              <a href="/listaaluno" className={styles.footerLink}>Lista de Alunos</a>
              <a href="/notaaluno" className={styles.footerLink}>Cadastro de Notas</a>
              <a href="/listanota" className={styles.footerLink}>Lista de Notas</a>
            </div>

            <div className={styles.footerLinks}>
              <strong className={styles.footerGroupTitle}>Contato</strong>
              <span className={styles.footerLink}>📍 Rua das Acácias, 200</span>
              <span className={styles.footerLink}>📞 (11) 3000-0000</span>
              <span className={styles.footerLink}>✉️ secretaria@escola.edu.br</span>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>© {new Date().getFullYear()} Escola Estadual. Todos os direitos reservados.</p>
            <div className={styles.footerOrnament}>
              <span className={styles.footerDiamond} />
              <span className={styles.footerDiamond} />
              <span className={styles.footerDiamond} />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
