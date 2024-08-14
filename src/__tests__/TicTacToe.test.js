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

describe("TicTacToe Component", () => {
  beforeEach(() => {
    useMachine.mockReturnValue([
      {
        context: { board: Array(9).fill(null), turn: "x", result: null },
        value: "idle",
      },
      jest.fn(),
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the TicTacToe component", () => {
    render(<TicTacToe />);
    expect(screen.getByText(/TicTacToe/i)).toBeInTheDocument();
    expect(screen.getByText(/START GAME/i)).toBeInTheDocument();
  });

  test("renders the board with 9 empty fields", () => {
    render(<TicTacToe />);
    const fields = screen.getAllByTestId("game-field");
    expect(fields).toHaveLength(9);
    fields.forEach((field) => expect(field).toBeEmptyDOMElement());
  });

  test("starts the game", () => {
    const send = jest.fn();
    useMachine.mockReturnValue([
      {
        context: { board: Array(9).fill(null), turn: "x", result: null },
        value: "idle",
      },
      send,
    ]);

    render(<TicTacToe />);
    fireEvent.click(screen.getByText(/START GAME/i));
    expect(send).toHaveBeenCalledWith({ type: "START" });
    expect(screen.getByText(/"x" TRUN/i)).toBeInTheDocument();
  });

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

  test("displays draw", () => {
    useMachine.mockReturnValue([
      {
        context: { board: Array(9).fill("x"), turn: null, result: "draw" },
        value: "draw",
      },
      jest.fn(),
    ]);

    render(<TicTacToe />);
    expect(screen.getByText(/DRAW!/i)).toBeInTheDocument();
  });

  test("marks field on the board when clicked", () => {
    const send = jest.fn();
    useMachine.mockReturnValue([
      {
        context: { board: Array(9).fill(null), turn: "x", result: null },
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
