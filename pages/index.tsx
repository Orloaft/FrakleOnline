import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { useEffect } from "react";
import io from "Socket.IO-client";
import axios from "axios";
let socket;
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  useEffect(() => socketInitializer(), []);

  const socketInitializer = () => {
    axios
      .get("/api/socket")
      .then((res) => {
        socket = io();

        socket.on("connect", () => {
          console.log("connected");
        });
      })
      .catch((err) => err);
  };
  return (
    <div className={styles.home}>
      <h1>
        <div className={styles.lofi}>
          <div className={styles.letter}>D</div>
          <div className={styles.letter}>I</div>
          <div className={styles.letter}>C</div>
          <div className={styles.letter}>E</div>
        </div>
      </h1>
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
