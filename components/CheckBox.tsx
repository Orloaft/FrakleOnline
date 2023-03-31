import React, { useState } from "react";

export default function Checkbox({
  setIsPrivate,
  isPrivate,
}: {
  isPrivate: boolean;
  setIsPrivate: (b: boolean) => void;
}) {
  return (
    <label>
      <input
        type="checkbox"
        checked={isPrivate}
        onChange={() => setIsPrivate(!isPrivate)}
      />
      <span>Private</span>
    </label>
  );
}
