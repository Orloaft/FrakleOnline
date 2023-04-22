import { SocketGameController } from "@/components/SocketGameController";
import { UserForm } from "@/components/UserForm";
import { player } from "@/gameServices/roomService";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
export default function RoomInvite() {
  const [playerData, setPlayerData] = useState<player | null>(null);

  useEffect(() => {
    let user = localStorage.getItem("user");
    user && setPlayerData(JSON.parse(user));
  }, []);
  let router = useRouter();
  return (
    <div className={styles.home}>
      {(playerData && (
        <SocketGameController
          user={playerData}
          roomid={router.query.roomid as string}
        />
      )) || <UserForm setPlayerData={setPlayerData} />}
    </div>
  );
}
