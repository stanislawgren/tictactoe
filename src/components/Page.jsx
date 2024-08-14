import styled from "styled-components";

export const Page = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #e5d9f2;
  transition: all 500ms linear;

  &.o {
    color: white;
    background-color: #7371fc;
    transition: all 500ms linear;
  }

  &.x {
    color: white;
    background-color: #a594f9;
    transition: all 500ms linear;
  }

  &.draw {
    color: white;
    background-color: #cdc1ff;
    transition: all 500ms linear;
  }
`;
