import "./App.css";
import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/react";

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
            guard: "checkDraw",
            actions: assign(({ context }) => {
              return {
                turn: context.turn,
                board: [...context.board],
                moves: context.moves,
                result: "draw",
              };
            }),
            target: "draw",
          },
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
        console.log(context);
        return context.moves >= 9;
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
  const { board, turn, moves, result } = current.context;

  return (
    <div>
      TicTacToe
      {result == "draw" && <div>game result is draw</div>}
      {result == "x" && <div>X won the game</div>}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {board.map((_, index) => {
          return (
            <div
              style={{
                flexBasis: "32%",
                backgroundColor: "grey",
                width: "50px",
                height: "50px",
                border: "1px solid white",
              }}
              onClick={() => send({ type: "MOVE", index: index })}
              key={index}
            >
              {board[index]}
            </div>
          );
        })}
      </div>
      {current.value === "idle" ? (
        <button onClick={() => send({ type: "START" })}>START GAME</button>
      ) : (
        <button onClick={() => send({ type: "RESET" })}>RESTART GAME</button>
      )}
    </div>
  );
}

export default TicTacToe;
