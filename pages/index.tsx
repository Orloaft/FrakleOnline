import styles from "@/styles/Home.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.home}>
      <h1 className="title">Space Dice</h1>

      <Link href="/game">
        <div className={styles.play}>
          <div className={styles.letter}>p</div>
          <div className={styles.letter}>l</div>
          <div className={styles.letter}>a</div>
          <div className={styles.letter}>y</div>
        </div>
      </Link>
    </div>
  );
}
