import styles from "@/styles/Home.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.home}>
      <h1 className="title">
        <span>Space</span>
        <span>Dice</span>{" "}
      </h1>

      <Link href="/game" className="title" style={{ textDecoration: "none" }}>
        PLAY
      </Link>
    </div>
  );
}
