import styled, { keyframes } from "styled-components";

export const GameField = styled.div`
  background: #f5efff;
  border: 1px solid #cdc1ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
  font-weight: bold;
`;

export const GameBoard = styled.div`
  display: grid;
  grid-template-rows: 100px 100px 100px;
  grid-template-columns: 100px 100px 100px;
`;

const strikeFadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

export const Strike = styled.p`
  animation-name: ${strikeFadeIn};
  animation-duration: 0.5s;

  
  &.x {
  color: #a594f9;
  }

  &.o {
  color: #7371fc;
  }
`;
