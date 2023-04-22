import { SocketGameController } from "@/components/SocketGameController";
import { UserForm } from "@/components/UserForm";
import { player } from "@/gameServices/roomService";
import styles from "@/styles/Home.module.css";

import { useEffect, useState } from "react";

export default function Main() {
  const [playerData, setPlayerData] = useState<player | null>(null);

  useEffect(() => {
    let user = localStorage.getItem("user");
    user && setPlayerData(JSON.parse(user));
  }, []);
  return (
    <>
      <div className={styles.home}>
        {(playerData && (
          <>
            <SocketGameController user={playerData} />
          </>
        )) || <UserForm setPlayerData={setPlayerData} />}
      </div>
    </>
  );
}
