# Instalation

```npm i```
```npm run dev```

Project was coded in React using Vite.js

# Description

As in instructions I've used XState for State management for game. Here is schema:

![image](https://github.com/user-attachments/assets/1714413e-7508-4d0d-aa23-5b8a39b7b1f9)

After clicking on Start Game, game is started and state goes from "idle" to "playing", and button is changed to "RESTART GAME"

![image](https://github.com/user-attachments/assets/a08536be-a383-4a15-bc7c-34fb2c4bd0f8)

![image](https://github.com/user-attachments/assets/82ba88ac-6a70-4dd9-9514-9da8d4e4eb49)

Game status is checked by guards, so if there is a winner, game state goes to "won" and "result" is changed to winner.
If there was a draw, state changes to "draw", as well as "result" value.

Game winner is checked by searching if there are matching symbols in winning lines. I think this is the simplest and fastest solution to check it.

```
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
      }
```

Draw is checked by number of "moves". If there was 9 moves, and there was no winner, state goes to "draw".

There is also guard for checking possibility of move, simply checking if field is marked.

```!context.board[event.index]```

Tests are checking if board is properly rendered, and if actions are triggered correclty.

![image](https://github.com/user-attachments/assets/5fc3de59-13e4-4ec2-8478-c3dc1142ed22)



