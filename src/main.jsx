import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import TicTacToe from "./pages/TicTacToe.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TicTacToe />
  </StrictMode>
);
