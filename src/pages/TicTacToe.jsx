import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import { GameField, GameBoard, Strike } from "../components/Game";
import { Button } from "../components/Button";
import { Page } from "../components/Page";
import React from "react";

const ticTacToeMachine = createMachine(
  {
    id: "tictactoe",
    initial: "idle",
    context: {
      turn: null,
      board: new Array(9).fill(null),
      moves: 0,
      result: null,
    },
    states: {
      idle: {
        on: {
          START: {
            actions: assign(() => {
              return {
                turn: "x",
              };
            }),
            target: "playing",
          },
        },
      },
      playing: {
        always: [
          {
            guard: "checkWin",
            actions: assign(({ context }) => {
              const winningLines = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6],
              ];

              for (let i = 0; i < winningLines.length; i++) {
                const [pos1, pos2, pos3] = winningLines[i];

                if (
                  context.board[pos1] &&
                  context.board[pos1] === context.board[pos2] &&
                  context.board[pos1] === context.board[pos3]
                ) {
                  return { result: context.board[pos1] };
                }
              }

              return { result: null };
            }),
            target: "won",
          },
          {
            guard: "checkDraw",
            actions: assign(() => {
              return {
                result: "draw",
              };
            }),
            target: "draw",
          },
        ],
        on: {
          MOVE: {
            guard: "validMove",
            actions: assign(({ context, event }) => {
              const newBoard = [...context.board];
              newBoard[event.index] = context.turn;

              return {
                turn: context.turn === "x" ? "o" : "x",
                board: newBoard,
                moves: context.moves + 1,
              };
            }),
          },
          RESET: {
            actions: assign(() => {
              return {
                turn: null,
                board: new Array(9).fill(null),
                moves: 0,
                result: null,
              };
            }),
            target: "idle",
          },
        },
      },
      won: {
        on: {
          RESET: {
            actions: assign(() => {
              return {
                turn: null,
                board: new Array(9).fill(null),
                moves: 0,
                result: null,
              };
            }),
            target: "idle",
          },
        },
      },
      draw: {
        on: {
          RESET: {
            actions: assign(() => {
              return {
                turn: null,
                board: new Array(9).fill(null),
                moves: 0,
                result: null,
              };
            }),
            target: "idle",
          },
        },
      },
    },
  },
  {
    guards: {
      checkDraw: ({ context }) => {
        return context.moves >= 9 && !context.result;
      },
      validMove: ({ context, event }) => {
        return !context.board[event.index];
      },
      checkWin: ({ context }) => {
        const winningLines = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
        ];

        for (let i = 0; i < winningLines.length; i++) {
          const [pos1, pos2, pos3] = winningLines[i];

          if (
            context.board[pos1] &&
            context.board[pos1] === context.board[pos2] &&
            context.board[pos1] === context.board[pos3]
          ) {
            return true;
          }
        }

        return false;
      },
    },
  }
);

function TicTacToe() {
  const [current, send] = useMachine(ticTacToeMachine, { devTools: true });
  const { board, turn, result } = current.context;

  return (
    <Page className={result}>
      <h1>TicTacToe</h1>
      {turn && !result && <h2>&quot;{turn}&quot; TRUN</h2>}
      {(result === "o" || result === "x") && (
        <h2>&quot;{result}&quot; WINS!</h2>
      )}
      {result === "draw" && <h2>DRAW!</h2>}
      <GameBoard>
        {board.map((_, index) => {
          return (
            <GameField
              data-testid="game-field"
              onClick={() => send({ type: "MOVE", index: index })}
              key={index}
            >
              {board[index] && (
                <Strike
                  data-testid={`${board[index]}_mark`}
                  className={board[index]}
                >
                  {board[index]}
                </Strike>
              )}
            </GameField>
          );
        })}
      </GameBoard>
      {current.value === "idle" ? (
        <Button
          data-testid="start-button"
          onClick={() => send({ type: "START" })}
        >
          START GAME
        </Button>
      ) : (
        <Button
          data-testid="restart-button"
          onClick={() => send({ type: "RESET" })}
        >
          RESTART GAME
        </Button>
      )}
    </Page>
  );
}

export default TicTacToe;
