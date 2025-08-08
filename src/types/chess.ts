export type PieceType =
  | "king"
  | "queen"
  | "rook"
  | "bishop"
  | "knight"
  | "pawn";
export type PieceColor = "white" | "black";

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  piece: ChessPiece;
  capturedPiece?: ChessPiece;
  isCheck?: boolean;
  isCheckmate?: boolean;
  isStalemate?: boolean;
  isCastling?: boolean;
  isEnPassant?: boolean;
  promotedTo?: PieceType;
  notation?: string;
}

export type Board = (ChessPiece | null)[][];

export interface GameState {
  board: Board;
  currentPlayer: PieceColor;
  selectedSquare: Position | null;
  validMoves: Position[];
  gameStatus: "playing" | "check" | "checkmate" | "stalemate" | "draw";
  moveHistory: Move[];
  winner: PieceColor | null;
}
