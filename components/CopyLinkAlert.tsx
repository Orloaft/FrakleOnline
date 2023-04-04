import { useState, useEffect } from "react";

const CopyLinkAlert = ({ link }: { link: string }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      const timeout = setTimeout(() => {
        setVisible(false);
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    setVisible(true);
  };

  return (
    <>
      {" "}
      <div
        style={{
          position: "fixed",
          top: "25%",
          left: "50%",
          transform: "translate(-50%, -50%)",

          display: visible ? "flex" : "none",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
          animation: visible
            ? "fade-in 0.5s ease-out, fade-out 0.5s 4.5s ease-out forwards"
            : "none",
        }}
        className="alert"
      >
        <span style={{ marginRight: "10px" }}>Link copied to clipboard!</span>
      </div>
      <button className="button" onClick={handleCopyLink}>
        Copy Link
      </button>
    </>
  );
};

export default CopyLinkAlert;
