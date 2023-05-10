import { useContext } from "react";
import CopyLinkAlert from "./CopyLinkAlert";
import { Room } from "./Room";
import UpdateContext from "./context/updateContext";

export const RoomView = ({
  room,
  onGameModeChange,
  leaveRoom,
  user,
}: {
  room: any;
  onGameModeChange: any;
  leaveRoom: any;
  user: any;
}) => {
  const updateRequest = useContext(UpdateContext);
  return (
    <>
      <Room room={room} onGameModeChange={onGameModeChange} />
      <button className="button" onClick={leaveRoom}>
        Leave
      </button>
      {room.host.id === user.id && (
        <>
          {" "}
          <button
            className="button"
            onClick={() => {
              updateRequest && updateRequest({ type: 4, roomId: room.id });
            }}
          >
            Start game
          </button>
          <CopyLinkAlert
            link={
              "https://" +
              process.env.NEXT_PUBLIC_SERVER_URL +
              "/invite/" +
              room.id
            }
          />
        </>
      )}
    </>
  );
};
