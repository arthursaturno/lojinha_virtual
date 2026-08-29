import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>Catalogo virtual</span>
          <h1>Ezzion Imports</h1>
          <p>
            Projeto Next.js com React e TypeScript configurado para iniciar o
            MVP do catalogo, painel administrativo e integracao com WhatsApp.
          </p>
        </section>
      </main>
    </div>
  );
}
