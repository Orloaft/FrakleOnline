import { uuid } from "uuidv4";

export const GameLog = (props: { log: string[] }) => {
  return (
    <div style={{ maxHeight: "50%", overflow: "scroll" }}>
      {props.log.map((l) => {
        return (
          <div
            key={uuid()}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              fontSize: "1rem",
              backgroundColor: `#1d1e29`,
            }}
          >
            <span> {l} </span>
          </div>
        );
      })}
    </div>
  );
};
