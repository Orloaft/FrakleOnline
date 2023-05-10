import Image from "next/image";

export const FadingBackground = () => {
  return (
    <div className="bg_fade_wrapper">
      <div className="bg_fade">
        <Image
          className="bg1"
          src="/backgroundSD-1.jpg"
          fill
          style={{ objectFit: "cover" }}
          alt="bg"
        />
        <Image
          className="bg2"
          src="/backgroundSD-2.jpg"
          fill
          style={{ objectFit: "cover" }}
          alt="bg"
        />
        <Image
          className="bg3"
          src="/backgroundSD-3.jpg"
          fill
          style={{ objectFit: "cover" }}
          alt="bg"
        />
        <Image
          className="bg4"
          src="/backgroundSD-4.jpg"
          fill
          style={{ objectFit: "cover" }}
          alt="bg"
        />
        <Image
          className="bg5"
          src="/backgroundSD-5.jpg"
          fill
          style={{ objectFit: "cover" }}
          alt="bg"
        />
        <Image
          className="bg6"
          src="/backgroundSD-6.jpg"
          fill
          style={{ objectFit: "cover" }}
          alt="bg"
        />
      </div>
    </div>
  );
};
