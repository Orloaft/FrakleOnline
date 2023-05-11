import Image from "next/image";

export const FadingBackground = () => {
  return (
    <div className="bg_fade_wrapper">
      <div className="overlay"></div>

      <div className="bg_fade">
        <div className="bg bg1"></div>
        <div className="bg bg2"></div>
        <div className="bg bg3"></div>
        <div className="bg bg4"></div>
        <div className="bg bg5"></div>
        <div className="bg bg6"></div>
      </div>
    </div>
  );
};
