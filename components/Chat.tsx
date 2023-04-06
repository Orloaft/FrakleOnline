import { useState } from "react";
import { uuid } from "uuidv4";

export const Chat = ({
  messages,
  sendMessage,
}: {
  messages: string[];
  sendMessage: (msg: string) => void;
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [displayed, setDisplayed] = useState<boolean>(false);
  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    sendMessage(event.target.message.value);
    setInputValue("");
  };
  return (
    <div className="chat-box">
      <div
        style={{ cursor: "grab" }}
        onClick={() => {
          setDisplayed(!displayed);
        }}
        className="chat-box-header"
      >
        <span>CHAT</span>
      </div>
      {displayed && (
        <>
          <div className="chat-box-body">
            {messages.map((message, index) => (
              <div key={uuid()} className="chat-message">
                {message}
              </div>
            ))}
          </div>
          <form className="chat-box-footer" onSubmit={handleSubmit}>
            <input
              type="text"
              name="message"
              placeholder="Type a message..."
              value={inputValue}
              onChange={handleInputChange}
              autoComplete="off"
            />
            <button type="submit">Send</button>
          </form>
        </>
      )}
    </div>
  );
};
