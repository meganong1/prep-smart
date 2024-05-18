import Image from "next/image";
import styles from "./styles.module.css";

export default function Home() {
  return (
    <main className={styles.main}>

      <div className={styles.center}>
        <img
          className={styles.logo}
          src="/PrepSmartLogo.png"
          alt="PrepSmart Logo"
          width={200}
          height={100}
        />
      </div>
      <div className={styles.container}>
        <h1 className={styles.coolText}>PrepSmart</h1>
      </div>
    </main>
  );
}
