/**
 * @jest-environment jsdom
 */

/* eslint-disable no-undef */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useMachine } from "@xstate/react";
import TicTacToe from "../pages/TicTacToe";
import "@testing-library/jest-dom";

jest.mock("@xstate/react");

describe("TicTacToe Render and actions", () => {
  const send = jest.fn();

  beforeEach(() => {
    useMachine.mockReturnValue([
      {
        context: { board: Array(9).fill(null), turn: "x", result: null },
        value: "idle",
      },
      send,
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the board with 9 empty fields", () => {
    render(<TicTacToe />);
    expect(screen.getByText(/TicTacToe/i)).toBeInTheDocument();
    expect(screen.getByText(/START GAME/i)).toBeInTheDocument();
    const fields = screen.getAllByTestId("game-field");
    expect(fields).toHaveLength(9);
    fields.forEach((field) => expect(field).toBeEmptyDOMElement());
  });

  test("starts the game", () => {
    render(<TicTacToe />);
    fireEvent.click(screen.getByTestId("start-button"));
    expect(send).toHaveBeenCalledWith({ type: "START" });
    expect(screen.getByText(/"x" TRUN/i)).toBeInTheDocument();
  });

  test("restarts game after button click", () => {
    const send = jest.fn();
    useMachine.mockReturnValue([
      {
        context: { board: Array(9).fill(null), turn: "x", result: null },
        value: "playing",
      },
      send,
    ]);

    render(<TicTacToe />);
    fireEvent.click(screen.getByTestId("restart-button"));
    expect(send).toHaveBeenCalledWith({ type: "RESET" });
    expect(screen.getByTestId("restart-button")).toBeInTheDocument();
  });
});

describe("Playing game tests", () => {
  test('displays winner "x"', () => {
    useMachine.mockReturnValue([
      {
        context: { board: Array(9).fill("x"), turn: null, result: "x" },
        value: "won",
      },
      jest.fn(),
    ]);

    render(<TicTacToe />);
    expect(screen.getByText(/"x" WINS!/i)).toBeInTheDocument();
  });

  test('displays winner "o"', () => {
    useMachine.mockReturnValue([
      {
        context: { board: Array(9).fill("o"), turn: null, result: "o" },
        value: "won",
      },
      jest.fn(),
    ]);

    render(<TicTacToe />);
    expect(screen.getByText(/"o" WINS!/i)).toBeInTheDocument();
  });

  test("displays draw", () => {
    useMachine.mockReturnValue([
      {
        context: {
          board: ["x", "o", "x", "x", "x", "o", "o", "x", "o"],
          turn: null,
          result: "draw",
        },
        value: "draw",
      },
      jest.fn(),
    ]);

    render(<TicTacToe />);
    expect(screen.getByText(/DRAW!/i)).toBeInTheDocument();
  });

  test("move action triggered after click on field", () => {
    const send = jest.fn();
    useMachine.mockReturnValue([
      {
        context: {
          board: Array(9).fill(null),
          turn: "x",
          result: null,
        },
        value: "playing",
      },
      send,
    ]);

    render(<TicTacToe />);
    const fields = screen.getAllByTestId("game-field");
    fireEvent.click(fields[0]);

    expect(send).toHaveBeenCalledWith({ type: "MOVE", index: 0 });
  });
});
