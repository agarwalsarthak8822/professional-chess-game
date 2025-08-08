import {
  Board,
  Position,
  PieceColor,
  Move,
  ChessPiece,
  PieceType,
} from "@/types/chess";
import {
  getValidMoves,
  makeMove,
  isInCheck,
  isCheckmate,
  isStalemate,
} from "./chess-logic";

// Piece values for evaluation
const PIECE_VALUES: Record<PieceType, number> = {
  pawn: 100,
  knight: 320,
  bishop: 330,
  rook: 500,
  queen: 900,
  king: 20000,
};

// Position tables for piece placement evaluation
const PAWN_TABLE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const KNIGHT_TABLE = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50],
];

const BISHOP_TABLE = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 10, 10, 5, 0, -10],
  [-10, 5, 5, 10, 10, 5, 5, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 5, 0, 0, 0, 0, 5, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20],
];

const ROOK_TABLE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [5, 10, 10, 10, 10, 10, 10, 5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [0, 0, 0, 5, 5, 0, 0, 0],
];

const QUEEN_TABLE = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-5, 0, 5, 5, 5, 5, 0, -5],
  [0, 0, 5, 5, 5, 5, 0, -5],
  [-10, 5, 5, 5, 5, 5, 0, -10],
  [-10, 0, 5, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20],
];

const KING_TABLE = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 30, 10, 0, 0, 10, 30, 20],
];

function getPieceSquareValue(
  piece: ChessPiece,
  row: number,
  col: number,
): number {
  const tables = {
    pawn: PAWN_TABLE,
    knight: KNIGHT_TABLE,
    bishop: BISHOP_TABLE,
    rook: ROOK_TABLE,
    queen: QUEEN_TABLE,
    king: KING_TABLE,
  };

  const table = tables[piece.type];
  const adjustedRow = piece.color === "white" ? 7 - row : row;
  return table[adjustedRow][col];
}

function evaluateBoard(board: Board): number {
  let score = 0;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        const pieceValue = PIECE_VALUES[piece.type];
        const positionValue = getPieceSquareValue(piece, row, col);
        const totalValue = pieceValue + positionValue;

        if (piece.color === "white") {
          score += totalValue;
        } else {
          score -= totalValue;
        }
      }
    }
  }

  return score;
}

function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean,
  lastMove?: Move,
): number {
  const playerColor: PieceColor = maximizingPlayer ? "black" : "white";

  // Check for terminal states
  if (isCheckmate(board, playerColor, lastMove)) {
    return maximizingPlayer ? -999999 : 999999;
  }

  if (isStalemate(board, playerColor, lastMove) || depth === 0) {
    return evaluateBoard(board);
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity;

    // Get all possible moves for black (AI)
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color === "black") {
          const moves = getValidMoves(board, { row, col }, lastMove);

          for (const move of moves) {
            const newBoard = makeMove(board, { row, col }, move, lastMove);
            const newMove: Move = {
              from: { row, col },
              to: move,
              piece,
            };

            const eval_score = minimax(
              newBoard,
              depth - 1,
              alpha,
              beta,
              false,
              newMove,
            );

            maxEval = Math.max(maxEval, eval_score);
            alpha = Math.max(alpha, eval_score);

            if (beta <= alpha) {
              break; // Alpha-beta pruning
            }
          }
        }
      }
    }

    return maxEval;
  } else {
    let minEval = Infinity;

    // Get all possible moves for white (human)
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color === "white") {
          const moves = getValidMoves(board, { row, col }, lastMove);

          for (const move of moves) {
            const newBoard = makeMove(board, { row, col }, move, lastMove);
            const newMove: Move = {
              from: { row, col },
              to: move,
              piece,
            };

            const eval_score = minimax(
              newBoard,
              depth - 1,
              alpha,
              beta,
              true,
              newMove,
            );

            minEval = Math.min(minEval, eval_score);
            beta = Math.min(beta, eval_score);

            if (beta <= alpha) {
              break; // Alpha-beta pruning
            }
          }
        }
      }
    }

    return minEval;
  }
}

export interface AIMove {
  from: Position;
  to: Position;
  score: number;
}

export function getAIMove(
  board: Board,
  difficulty: number = 3,
  lastMove?: Move,
): AIMove | null {
  let bestMove: AIMove | null = null;
  let bestScore = -Infinity;

  // Get all possible moves for black (AI)
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === "black") {
        const moves = getValidMoves(board, { row, col }, lastMove);

        for (const move of moves) {
          const newBoard = makeMove(board, { row, col }, move, lastMove);
          const newMove: Move = {
            from: { row, col },
            to: move,
            piece,
          };

          const score = minimax(
            newBoard,
            difficulty,
            -Infinity,
            Infinity,
            false,
            newMove,
          );

          if (score > bestScore) {
            bestScore = score;
            bestMove = {
              from: { row, col },
              to: move,
              score,
            };
          }
        }
      }
    }
  }

  return bestMove;
}

export function getRandomMove(board: Board, lastMove?: Move): AIMove | null {
  const allMoves: AIMove[] = [];

  // Get all possible moves for black (AI)
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === "black") {
        const moves = getValidMoves(board, { row, col }, lastMove);

        for (const move of moves) {
          allMoves.push({
            from: { row, col },
            to: move,
            score: 0,
          });
        }
      }
    }
  }

  if (allMoves.length === 0) return null;

  return allMoves[Math.floor(Math.random() * allMoves.length)];
}
