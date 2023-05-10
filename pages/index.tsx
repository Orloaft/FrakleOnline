import styles from "@/styles/Home.module.css";
import Link from "next/link";

import { FadingBackground } from "@/components/FadingBackground";
import { useEffect, useState } from "react";
import { SocketGameController } from "@/components/SocketGameController";
import { UserForm } from "@/components/UserForm";
import { player } from "@/services/GameState";
export default function Home() {
  const [title, setTitle] = useState<boolean>(true);
  const [playerData, setPlayerData] = useState<player | null>(null);

  useEffect(() => {
    let user = localStorage.getItem("user");
    user && setPlayerData(JSON.parse(user));
  }, []);
  return (
    <div className={styles.home}>
      <FadingBackground />
      {(title && (
        <div>
          <h1 className="title">
            <span>Space</span>
            <span>Dice</span>{" "}
          </h1>

          <button
            onClick={() => {
              setTitle(false);
            }}
            className="title"
            style={{
              border: "none",
              textDecoration: "none",
              background: "none",
              cursor: "pointer",
            }}
          >
            PLAY
          </button>
        </div>
      )) ||
        (playerData && (
          <>
            <SocketGameController user={playerData} />
          </>
        )) || <UserForm setPlayerData={setPlayerData} />}
    </div>
  );
}
