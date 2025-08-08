import { useState, useEffect } from "react";
import { Board, Position, GameState, PieceColor, Move } from "@/types/chess";
import { GameMode } from "./GameModeSelection";
import {
  createInitialBoard,
  getValidMoves,
  makeMove,
  isInCheck,
  isCheckmate,
  isStalemate,
  isInsufficientMaterial,
} from "@/lib/chess-logic";
import { getAIMove } from "@/lib/chess-ai";
import { ChessPiece } from "./ChessPiece";
import { cn } from "@/lib/utils";
import { RotateCcw, Crown, Sparkles } from "lucide-react";

interface ChessBoardProps {
  gameMode: GameMode;
  gameState: GameState;
  onGameStateChange: (gameState: GameState) => void;
  onAIThinking: (thinking: boolean) => void;
}

export function ChessBoard({
  gameMode,
  gameState,
  onGameStateChange,
  onAIThinking,
}: ChessBoardProps) {
  // AI move effect
  useEffect(() => {
    if (
      gameMode === "singleplayer" &&
      gameState.currentPlayer === "black" &&
      gameState.gameStatus === "playing"
    ) {
      onAIThinking(true);

      // Add a small delay for better UX
      const timer = setTimeout(() => {
        const lastMove =
          gameState.moveHistory[gameState.moveHistory.length - 1];
        const aiMove = getAIMove(gameState.board, 3, lastMove);

        if (aiMove) {
          const movingPiece =
            gameState.board[aiMove.from.row][aiMove.from.col]!;
          const capturedPiece = gameState.board[aiMove.to.row][aiMove.to.col];

          const newBoard = makeMove(
            gameState.board,
            aiMove.from,
            aiMove.to,
            lastMove,
          );

          // Check for special moves
          const isCastling =
            movingPiece.type === "king" &&
            Math.abs(aiMove.to.col - aiMove.from.col) === 2;
          const isEnPassant =
            movingPiece.type === "pawn" &&
            Math.abs(aiMove.from.col - aiMove.to.col) === 1 &&
            !capturedPiece;
          const isPromotion =
            movingPiece.type === "pawn" &&
            (aiMove.to.row === 0 || aiMove.to.row === 7);

          // Check game status after AI move
          const isWhiteInCheck = isInCheck(newBoard, "white");
          const isWhiteInCheckmate = isCheckmate(newBoard, "white", lastMove);
          const isWhiteInStalemate = isStalemate(newBoard, "white", lastMove);
          const isInsufficientMat = isInsufficientMaterial(newBoard);

          let gameStatus: GameState["gameStatus"] = "playing";
          let winner: PieceColor | null = null;

          if (isWhiteInCheckmate) {
            gameStatus = "checkmate";
            winner = "black";
          } else if (isWhiteInStalemate || isInsufficientMat) {
            gameStatus = "stalemate";
          } else if (isWhiteInCheck) {
            gameStatus = "check";
          }

          const newMove: Move = {
            from: aiMove.from,
            to: aiMove.to,
            piece: movingPiece,
            capturedPiece: capturedPiece || undefined,
            isCheck: isWhiteInCheck,
            isCheckmate: isWhiteInCheckmate,
            isStalemate: isWhiteInStalemate,
            isCastling,
            isEnPassant,
            promotedTo: isPromotion ? "queen" : undefined,
          };

          const newGameState: GameState = {
            board: newBoard,
            currentPlayer: "white",
            selectedSquare: null,
            validMoves: [],
            gameStatus,
            moveHistory: [...gameState.moveHistory, newMove],
            winner,
          };

          onGameStateChange(newGameState);
        }

        onAIThinking(false);
      }, 1000); // 1 second delay for AI "thinking"

      return () => clearTimeout(timer);
    }
  }, [
    gameState.currentPlayer,
    gameState.gameStatus,
    gameMode,
    onGameStateChange,
    onAIThinking,
    gameState.board,
    gameState.moveHistory,
  ]);

  const handleSquareClick = (row: number, col: number) => {
    // Don't allow moves during AI turn or if game is over
    if (
      (gameMode === "singleplayer" && gameState.currentPlayer === "black") ||
      gameState.gameStatus !== "playing"
    ) {
      return;
    }

    const clickedPosition: Position = { row, col };
    const clickedPiece = gameState.board[row][col];

    // If no square is selected
    if (!gameState.selectedSquare) {
      // Select a piece if it belongs to current player
      if (clickedPiece && clickedPiece.color === gameState.currentPlayer) {
        const lastMove =
          gameState.moveHistory[gameState.moveHistory.length - 1];
        const validMoves = getValidMoves(
          gameState.board,
          clickedPosition,
          lastMove,
        );
        const newGameState = {
          ...gameState,
          selectedSquare: clickedPosition,
          validMoves,
        };
        onGameStateChange(newGameState);
      }
      return;
    }

    // If clicking the same square, deselect
    if (
      gameState.selectedSquare.row === row &&
      gameState.selectedSquare.col === col
    ) {
      const newGameState = {
        ...gameState,
        selectedSquare: null,
        validMoves: [],
      };
      onGameStateChange(newGameState);
      return;
    }

    // If clicking another piece of the same color, select that piece instead
    if (clickedPiece && clickedPiece.color === gameState.currentPlayer) {
      const lastMove = gameState.moveHistory[gameState.moveHistory.length - 1];
      const validMoves = getValidMoves(
        gameState.board,
        clickedPosition,
        lastMove,
      );
      const newGameState = {
        ...gameState,
        selectedSquare: clickedPosition,
        validMoves,
      };
      onGameStateChange(newGameState);
      return;
    }

    // Check if the move is valid
    const isValidMove = gameState.validMoves.some(
      (move) => move.row === row && move.col === col,
    );

    if (isValidMove) {
      const lastMove = gameState.moveHistory[gameState.moveHistory.length - 1];
      const movingPiece =
        gameState.board[gameState.selectedSquare.row][
          gameState.selectedSquare.col
        ]!;

      // Make the move
      const newBoard = makeMove(
        gameState.board,
        gameState.selectedSquare,
        clickedPosition,
        lastMove,
      );
      const nextPlayer: PieceColor =
        gameState.currentPlayer === "white" ? "black" : "white";

      // Check for special moves
      const isCastling =
        movingPiece.type === "king" &&
        Math.abs(clickedPosition.col - gameState.selectedSquare.col) === 2;
      const isEnPassant =
        movingPiece.type === "pawn" &&
        Math.abs(gameState.selectedSquare.col - clickedPosition.col) === 1 &&
        !clickedPiece;
      const isPromotion =
        movingPiece.type === "pawn" &&
        (clickedPosition.row === 0 || clickedPosition.row === 7);

      // Check game status
      const isNextPlayerInCheck = isInCheck(newBoard, nextPlayer);
      const isNextPlayerInCheckmate = isCheckmate(
        newBoard,
        nextPlayer,
        lastMove,
      );
      const isNextPlayerInStalemate = isStalemate(
        newBoard,
        nextPlayer,
        lastMove,
      );
      const isInsufficientMat = isInsufficientMaterial(newBoard);

      let gameStatus: GameState["gameStatus"] = "playing";
      let winner: PieceColor | null = null;

      if (isNextPlayerInCheckmate) {
        gameStatus = "checkmate";
        winner = gameState.currentPlayer;
      } else if (isNextPlayerInStalemate || isInsufficientMat) {
        gameStatus = "stalemate";
      } else if (isNextPlayerInCheck) {
        gameStatus = "check";
      }

      const newMove: Move = {
        from: gameState.selectedSquare,
        to: clickedPosition,
        piece: movingPiece,
        capturedPiece: clickedPiece || undefined,
        isCheck: isNextPlayerInCheck,
        isCheckmate: isNextPlayerInCheckmate,
        isStalemate: isNextPlayerInStalemate,
        isCastling,
        isEnPassant,
        promotedTo: isPromotion ? "queen" : undefined,
      };

      const newGameState: GameState = {
        board: newBoard,
        currentPlayer: nextPlayer,
        selectedSquare: null,
        validMoves: [],
        gameStatus,
        moveHistory: [...gameState.moveHistory, newMove],
        winner,
      };

      onGameStateChange(newGameState);
    } else {
      // Invalid move, deselect
      const newGameState = {
        ...gameState,
        selectedSquare: null,
        validMoves: [],
      };
      onGameStateChange(newGameState);
    }
  };

  const isSquareSelected = (row: number, col: number): boolean => {
    return (
      gameState.selectedSquare?.row === row &&
      gameState.selectedSquare?.col === col
    );
  };

  const isValidMoveSquare = (row: number, col: number): boolean => {
    return gameState.validMoves.some(
      (move) => move.row === row && move.col === col,
    );
  };

  const resetGame = () => {
    const initialBoard = createInitialBoard();
    const newGameState: GameState = {
      board: initialBoard,
      currentPlayer: "white",
      selectedSquare: null,
      validMoves: [],
      gameStatus: "playing",
      moveHistory: [],
      winner: null,
    };
    onGameStateChange(newGameState);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Game Status Header */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Crown className="h-6 w-6 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">Chess Board</h2>
          <Crown className="h-6 w-6 text-yellow-400" />
        </div>
        <div className="flex items-center justify-center gap-2 text-slate-300">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm">Professional Chess Experience</span>
          <Sparkles className="h-4 w-4" />
        </div>
      </div>

      {/* Enhanced Chess Board */}
      <div className="relative">
        {/* Board Container with Professional Styling */}
        <div className="relative bg-gradient-to-br from-amber-800 to-amber-900 p-6 rounded-2xl shadow-2xl border-4 border-amber-700">
          {/* Board Grid */}
          <div className="grid grid-cols-8 gap-0 border-4 border-amber-600 rounded-xl overflow-hidden shadow-inner bg-amber-600">
            {Array.from({ length: 8 }, (_, row) =>
              Array.from({ length: 8 }, (_, col) => {
                const isLight = (row + col) % 2 === 0;
                const piece = gameState.board[row][col];
                const isSelected = isSquareSelected(row, col);
                const isValidMove = isValidMoveSquare(row, col);

                return (
                  <div
                    key={`${row}-${col}`}
                    className={cn(
                      "w-16 h-16 flex items-center justify-center relative cursor-pointer transition-all duration-300 group",
                      isLight 
                        ? "bg-gradient-to-br from-amber-100 to-amber-200" 
                        : "bg-gradient-to-br from-amber-600 to-amber-700",
                      isSelected && "ring-4 ring-blue-400 ring-inset shadow-lg",
                      isValidMove && "ring-4 ring-green-400 ring-inset shadow-lg",
                      !piece &&
                        isValidMove &&
                        "after:absolute after:w-4 after:h-4 after:bg-green-400 after:rounded-full after:opacity-60 after:animate-pulse",
                      // Disable pointer events during AI turn
                      gameMode === "singleplayer" &&
                        gameState.currentPlayer === "black" &&
                        "cursor-not-allowed opacity-75",
                      // Hover effects
                      "hover:scale-105 hover:shadow-lg",
                      isSelected && "animate-pulse",
                    )}
                    onClick={() => handleSquareClick(row, col)}
                  >
                    {/* Coordinate labels with enhanced styling */}
                    {col === 0 && (
                      <div className="absolute left-1 top-1 text-xs font-bold text-amber-800 select-none bg-amber-100/80 px-1 rounded">
                        {8 - row}
                      </div>
                    )}
                    {row === 7 && (
                      <div className="absolute right-1 bottom-1 text-xs font-bold text-amber-800 select-none bg-amber-100/80 px-1 rounded">
                        {String.fromCharCode(97 + col)}
                      </div>
                    )}

                    {piece && (
                      <ChessPiece
                        piece={piece}
                        isSelected={isSelected}
                        onClick={() => handleSquareClick(row, col)}
                      />
                    )}

                    {/* Enhanced valid move indicator for captured pieces */}
                    {piece && isValidMove && (
                      <div className="absolute inset-0 bg-red-400 opacity-30 rounded-full border-4 border-red-500 animate-pulse" />
                    )}

                    {/* Hover effect for empty squares */}
                    {!piece && (
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded" />
                    )}
                  </div>
                );
              }),
            )}
          </div>

          {/* Board Border Enhancement */}
          <div className="absolute inset-0 border-4 border-amber-500 rounded-2xl pointer-events-none"></div>
        </div>

        {/* AI Thinking Indicator */}
        {gameMode === "singleplayer" && gameState.currentPlayer === "black" && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full shadow-lg">
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              <span className="text-sm font-medium">AI is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Reset Button */}
      <button
        onClick={resetGame}
        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg"
      >
        <RotateCcw className="h-5 w-5" />
        New Game
      </button>

      {/* Game Mode Indicator */}
      <div className="flex items-center gap-2 text-slate-300 text-sm">
        <div className="w-2 h-2 rounded-full bg-green-400"></div>
        <span className="font-medium">
          {gameMode === "singleplayer" ? "AI Mode" : "Multiplayer Mode"}
        </span>
      </div>
    </div>
  );
}
