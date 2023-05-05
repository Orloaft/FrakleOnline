import { GameType } from "@/services/roomService";
import React, { useState } from "react";
import styled from "styled-components";

interface GameModeInputProps {
  onGameModeChange: (mode: GameType) => void;
  mode: GameType;
}

const GameModeInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background-color: #1c1c1c;
  color: #fff;
  padding: 16px;
  border-radius: 8px;
`;

const GameModeInputRadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const GameModeInputRadio = styled.input`
  margin-right: 8px;
`;
export const GameModeInput: React.FC<GameModeInputProps> = ({
  onGameModeChange,
  mode,
}) => {
  return (
    <GameModeInputContainer>
      <GameModeInputRadioLabel>
        <GameModeInputRadio
          type="radio"
          value="default"
          checked={mode === 0}
          onChange={() => onGameModeChange(0)}
        />
        <span> Default</span>
      </GameModeInputRadioLabel>
      <GameModeInputRadioLabel>
        <GameModeInputRadio
          type="radio"
          value="timeAttack"
          checked={mode === 1}
          onChange={() => onGameModeChange(1)}
        />
        <span>Time Attack</span>
      </GameModeInputRadioLabel>
    </GameModeInputContainer>
  );
};
