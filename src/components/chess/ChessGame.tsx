import { useState } from "react";
import { GameState } from "@/types/chess";
import { createInitialBoard } from "@/lib/chess-logic";
import { GameModeSelection, GameMode } from "./GameModeSelection";
import { ChessBoard } from "./ChessBoard";
import { EnhancedGameInfo } from "./EnhancedGameInfo";

export function ChessGame() {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: createInitialBoard(),
    currentPlayer: "white",
    selectedSquare: null,
    validMoves: [],
    gameStatus: "playing",
    moveHistory: [],
    winner: null,
  }));

  const handleGameStateChange = (newGameState: GameState) => {
    setGameState(newGameState);
  };

  const handleModeSelect = (mode: GameMode) => {
    setGameMode(mode);
    // Reset game state when starting new game
    setGameState({
      board: createInitialBoard(),
      currentPlayer: "white",
      selectedSquare: null,
      validMoves: [],
      gameStatus: "playing",
      moveHistory: [],
      winner: null,
    });
  };

  const handleBackToMenu = () => {
    setGameMode(null);
    setIsAIThinking(false);
    // Reset game state
    setGameState({
      board: createInitialBoard(),
      currentPlayer: "white",
      selectedSquare: null,
      validMoves: [],
      gameStatus: "playing",
      moveHistory: [],
      winner: null,
    });
  };

  if (!gameMode) {
    return <GameModeSelection onSelectMode={handleModeSelect} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">♔ Chess Game ♛</h1>
          <p className="text-slate-300">
            {gameMode === "singleplayer"
              ? "Challenge the AI and test your skills!"
              : "Play with a friend on the same device"}
          </p>
        </div>

        {/* Game Layout */}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
          {/* Chess Board */}
          <div className="flex-shrink-0">
            <ChessBoard
              gameMode={gameMode}
              gameState={gameState}
              onGameStateChange={handleGameStateChange}
              onAIThinking={setIsAIThinking}
            />
          </div>

          {/* Game Information Panel */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <EnhancedGameInfo
              gameState={gameState}
              gameMode={gameMode}
              onBackToMenu={handleBackToMenu}
              isAIThinking={isAIThinking}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-slate-400 text-sm">
          <p>Built with React, TypeScript, and Advanced Chess AI</p>
        </div>
      </div>
    </div>
  );
}
