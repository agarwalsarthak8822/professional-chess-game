import {
  Board,
  ChessPiece,
  Position,
  PieceType,
  PieceColor,
  Move,
} from "@/types/chess";

export function createInitialBoard(): Board {
  const board: Board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));

  // Set up pawns
  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: "pawn", color: "black", hasMoved: false };
    board[6][col] = { type: "pawn", color: "white", hasMoved: false };
  }

  // Set up other pieces
  const pieceOrder: PieceType[] = [
    "rook",
    "knight",
    "bishop",
    "queen",
    "king",
    "bishop",
    "knight",
    "rook",
  ];

  for (let col = 0; col < 8; col++) {
    board[0][col] = { type: pieceOrder[col], color: "black", hasMoved: false };
    board[7][col] = { type: pieceOrder[col], color: "white", hasMoved: false };
  }

  return board;
}

export function isValidPosition(pos: Position): boolean {
  return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
}

export function getValidMoves(
  board: Board,
  from: Position,
  lastMove?: Move,
): Position[] {
  const piece = board[from.row][from.col];
  if (!piece) return [];

  let moves: Position[] = [];

  switch (piece.type) {
    case "pawn":
      moves = getPawnMoves(board, from, piece.color, lastMove);
      break;
    case "rook":
      moves = getRookMoves(board, from, piece.color);
      break;
    case "knight":
      moves = getKnightMoves(board, from, piece.color);
      break;
    case "bishop":
      moves = getBishopMoves(board, from, piece.color);
      break;
    case "queen":
      moves = getQueenMoves(board, from, piece.color);
      break;
    case "king":
      moves = getKingMoves(board, from, piece.color);
      break;
    default:
      return [];
  }

  // Filter out moves that would put own king in check
  return moves.filter((to) => {
    const testBoard = makeMove(board, from, to, lastMove);
    return !isInCheck(testBoard, piece.color);
  });
}

function getPawnMoves(
  board: Board,
  from: Position,
  color: PieceColor,
  lastMove?: Move,
): Position[] {
  const moves: Position[] = [];
  const direction = color === "white" ? -1 : 1;
  const startRow = color === "white" ? 6 : 1;

  // Forward move
  const oneStep = { row: from.row + direction, col: from.col };
  if (isValidPosition(oneStep) && !board[oneStep.row][oneStep.col]) {
    moves.push(oneStep);

    // Two squares forward from starting position
    if (from.row === startRow) {
      const twoStep = { row: from.row + 2 * direction, col: from.col };
      if (isValidPosition(twoStep) && !board[twoStep.row][twoStep.col]) {
        moves.push(twoStep);
      }
    }
  }

  // Diagonal captures
  const captureLeft = { row: from.row + direction, col: from.col - 1 };
  const captureRight = { row: from.row + direction, col: from.col + 1 };

  if (
    isValidPosition(captureLeft) &&
    board[captureLeft.row][captureLeft.col] &&
    board[captureLeft.row][captureLeft.col]!.color !== color
  ) {
    moves.push(captureLeft);
  }

  if (
    isValidPosition(captureRight) &&
    board[captureRight.row][captureRight.col] &&
    board[captureRight.row][captureRight.col]!.color !== color
  ) {
    moves.push(captureRight);
  }

  // En passant
  if (lastMove && lastMove.piece.type === "pawn") {
    const enPassantRow = color === "white" ? 3 : 4;
    const lastMoveStartRow = color === "white" ? 1 : 6;
    const lastMoveEndRow = color === "white" ? 3 : 4;

    if (
      from.row === enPassantRow &&
      lastMove.from.row === lastMoveStartRow &&
      lastMove.to.row === lastMoveEndRow &&
      Math.abs(lastMove.to.col - from.col) === 1
    ) {
      const enPassantCapture = {
        row: from.row + direction,
        col: lastMove.to.col,
      };
      if (isValidPosition(enPassantCapture)) {
        moves.push(enPassantCapture);
      }
    }
  }

  return moves;
}

function getBasicPawnMoves(
  board: Board,
  from: Position,
  color: PieceColor,
): Position[] {
  const moves: Position[] = [];
  const direction = color === "white" ? -1 : 1;
  const startRow = color === "white" ? 6 : 1;

  // Forward move
  const oneStep = { row: from.row + direction, col: from.col };
  if (isValidPosition(oneStep) && !board[oneStep.row][oneStep.col]) {
    moves.push(oneStep);

    // Two squares forward from starting position
    if (from.row === startRow) {
      const twoStep = { row: from.row + 2 * direction, col: from.col };
      if (isValidPosition(twoStep) && !board[twoStep.row][twoStep.col]) {
        moves.push(twoStep);
      }
    }
  }

  // Diagonal captures
  const captureLeft = { row: from.row + direction, col: from.col - 1 };
  const captureRight = { row: from.row + direction, col: from.col + 1 };

  if (
    isValidPosition(captureLeft) &&
    board[captureLeft.row][captureLeft.col] &&
    board[captureLeft.row][captureLeft.col]!.color !== color
  ) {
    moves.push(captureLeft);
  }

  if (
    isValidPosition(captureRight) &&
    board[captureRight.row][captureRight.col] &&
    board[captureRight.row][captureRight.col]!.color !== color
  ) {
    moves.push(captureRight);
  }

  return moves;
}

function getRookMoves(
  board: Board,
  from: Position,
  color: PieceColor,
): Position[] {
  const moves: Position[] = [];
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  for (const [rowDir, colDir] of directions) {
    for (let i = 1; i < 8; i++) {
      const newPos = { row: from.row + i * rowDir, col: from.col + i * colDir };

      if (!isValidPosition(newPos)) break;

      const targetPiece = board[newPos.row][newPos.col];
      if (!targetPiece) {
        moves.push(newPos);
      } else {
        if (targetPiece.color !== color) {
          moves.push(newPos);
        }
        break;
      }
    }
  }

  return moves;
}

function getKnightMoves(
  board: Board,
  from: Position,
  color: PieceColor,
): Position[] {
  const moves: Position[] = [];
  const knightMoves = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ];

  for (const [rowOffset, colOffset] of knightMoves) {
    const newPos = { row: from.row + rowOffset, col: from.col + colOffset };

    if (isValidPosition(newPos)) {
      const targetPiece = board[newPos.row][newPos.col];
      if (!targetPiece || targetPiece.color !== color) {
        moves.push(newPos);
      }
    }
  }

  return moves;
}

function getBishopMoves(
  board: Board,
  from: Position,
  color: PieceColor,
): Position[] {
  const moves: Position[] = [];
  const directions = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ];

  for (const [rowDir, colDir] of directions) {
    for (let i = 1; i < 8; i++) {
      const newPos = { row: from.row + i * rowDir, col: from.col + i * colDir };

      if (!isValidPosition(newPos)) break;

      const targetPiece = board[newPos.row][newPos.col];
      if (!targetPiece) {
        moves.push(newPos);
      } else {
        if (targetPiece.color !== color) {
          moves.push(newPos);
        }
        break;
      }
    }
  }

  return moves;
}

function getQueenMoves(
  board: Board,
  from: Position,
  color: PieceColor,
): Position[] {
  return [
    ...getRookMoves(board, from, color),
    ...getBishopMoves(board, from, color),
  ];
}

function getKingMoves(
  board: Board,
  from: Position,
  color: PieceColor,
): Position[] {
  const moves: Position[] = [];
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (const [rowOffset, colOffset] of directions) {
    const newPos = { row: from.row + rowOffset, col: from.col + colOffset };

    if (isValidPosition(newPos)) {
      const targetPiece = board[newPos.row][newPos.col];
      if (!targetPiece || targetPiece.color !== color) {
        moves.push(newPos);
      }
    }
  }

  // Castling
  const king = board[from.row][from.col];
  if (king && !king.hasMoved && !isInCheck(board, color)) {
    const backRank = color === "white" ? 7 : 0;

    // Kingside castling
    const kingsideRook = board[backRank][7];
    if (
      kingsideRook &&
      kingsideRook.type === "rook" &&
      kingsideRook.color === color &&
      !kingsideRook.hasMoved &&
      !board[backRank][5] &&
      !board[backRank][6] &&
      !isSquareAttacked(
        board,
        { row: backRank, col: 5 },
        color === "white" ? "black" : "white",
      ) &&
      !isSquareAttacked(
        board,
        { row: backRank, col: 6 },
        color === "white" ? "black" : "white",
      )
    ) {
      moves.push({ row: backRank, col: 6 });
    }

    // Queenside castling
    const queensideRook = board[backRank][0];
    if (
      queensideRook &&
      queensideRook.type === "rook" &&
      queensideRook.color === color &&
      !queensideRook.hasMoved &&
      !board[backRank][1] &&
      !board[backRank][2] &&
      !board[backRank][3] &&
      !isSquareAttacked(
        board,
        { row: backRank, col: 2 },
        color === "white" ? "black" : "white",
      ) &&
      !isSquareAttacked(
        board,
        { row: backRank, col: 3 },
        color === "white" ? "black" : "white",
      )
    ) {
      moves.push({ row: backRank, col: 2 });
    }
  }

  return moves;
}

function getBasicKingMoves(
  board: Board,
  from: Position,
  color: PieceColor,
): Position[] {
  const moves: Position[] = [];
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (const [rowOffset, colOffset] of directions) {
    const newPos = { row: from.row + rowOffset, col: from.col + colOffset };
    if (isValidPosition(newPos)) {
      const targetPiece = board[newPos.row][newPos.col];
      if (!targetPiece || targetPiece.color !== color) {
        moves.push(newPos);
      }
    }
  }
  return moves;
}

function isSquareAttacked(
  board: Board,
  square: Position,
  attackingColor: PieceColor,
): boolean {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === attackingColor) {
        const moves = getBasicMoves(board, { row, col }, piece);
        if (
          moves.some(
            (move) => move.row === square.row && move.col === square.col,
          )
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

function getBasicMoves(
  board: Board,
  from: Position,
  piece: ChessPiece,
): Position[] {
  // Get moves without checking for check (to avoid infinite recursion)
  switch (piece.type) {
    case "pawn":
      return getBasicPawnMoves(board, from, piece.color);
    case "rook":
      return getRookMoves(board, from, piece.color);
    case "knight":
      return getKnightMoves(board, from, piece.color);
    case "bishop":
      return getBishopMoves(board, from, piece.color);
    case "queen":
      return getQueenMoves(board, from, piece.color);
    case "king":
      return getBasicKingMoves(board, from, piece.color);
    default:
      return [];
  }
}

export function makeMove(
  board: Board,
  from: Position,
  to: Position,
  lastMove?: Move,
): Board {
  const newBoard = board.map((row) => [...row]);
  const piece = newBoard[from.row][from.col];

  if (!piece) return newBoard;

  // Handle castling
  if (piece.type === "king" && Math.abs(to.col - from.col) === 2) {
    const isKingside = to.col > from.col;
    const rookFromCol = isKingside ? 7 : 0;
    const rookToCol = isKingside ? 5 : 3;

    // Move rook
    const rook = newBoard[from.row][rookFromCol];
    if (rook) {
      newBoard[from.row][rookToCol] = { ...rook, hasMoved: true };
      newBoard[from.row][rookFromCol] = null;
    }
  }

  // Handle en passant capture
  if (
    piece.type === "pawn" &&
    lastMove &&
    lastMove.piece.type === "pawn" &&
    Math.abs(from.col - to.col) === 1 &&
    !newBoard[to.row][to.col]
  ) {
    // Remove the captured pawn
    newBoard[from.row][to.col] = null;
  }

  // Handle pawn promotion
  if (piece.type === "pawn") {
    const promotionRow = piece.color === "white" ? 0 : 7;
    if (to.row === promotionRow) {
      newBoard[to.row][to.col] = { ...piece, type: "queen", hasMoved: true };
      newBoard[from.row][from.col] = null;
      return newBoard;
    }
  }

  // Normal move
  newBoard[to.row][to.col] = { ...piece, hasMoved: true };
  newBoard[from.row][from.col] = null;

  return newBoard;
}

export function isInCheck(board: Board, kingColor: PieceColor): boolean {
  // Find the king
  let kingPos: Position | null = null;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === "king" && piece.color === kingColor) {
        kingPos = { row, col };
        break;
      }
    }
  }

  if (!kingPos) return false;

  // Use isSquareAttacked to avoid circular dependency
  return isSquareAttacked(
    board,
    kingPos,
    kingColor === "white" ? "black" : "white",
  );
}

export function isCheckmate(
  board: Board,
  color: PieceColor,
  lastMove?: Move,
): boolean {
  if (!isInCheck(board, color)) return false;

  // Try all possible moves for this color
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const moves = getValidMoves(board, { row, col }, lastMove);
        if (moves.length > 0) {
          return false; // Found at least one legal move
        }
      }
    }
  }

  return true; // No legal moves available
}

export function isStalemate(
  board: Board,
  color: PieceColor,
  lastMove?: Move,
): boolean {
  if (isInCheck(board, color)) return false;

  // Check if the player has any legal moves
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const moves = getValidMoves(board, { row, col }, lastMove);
        if (moves.length > 0) {
          return false; // Found a legal move
        }
      }
    }
  }

  return true; // No legal moves available
}

export function isInsufficientMaterial(board: Board): boolean {
  const pieces: ChessPiece[] = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        pieces.push(piece);
      }
    }
  }

  // King vs King
  if (pieces.length === 2) return true;

  // King and Bishop/Knight vs King
  if (pieces.length === 3) {
    const nonKingPiece = pieces.find((p) => p.type !== "king");
    return nonKingPiece?.type === "bishop" || nonKingPiece?.type === "knight";
  }

  // King and Bishop vs King and Bishop (same color squares)
  if (pieces.length === 4) {
    const bishops = pieces.filter((p) => p.type === "bishop");
    if (bishops.length === 2) {
      // This would require checking if bishops are on same color squares
      // For simplicity, we'll return false here
      return false;
    }
  }

  return false;
}

export function getPieceSymbol(piece: ChessPiece): string {
  const symbols = {
    king: piece.color === "white" ? "♔" : "♚",
    queen: piece.color === "white" ? "♕" : "♛",
    rook: piece.color === "white" ? "♖" : "♜",
    bishop: piece.color === "white" ? "♗" : "♝",
    knight: piece.color === "white" ? "♘" : "♞",
    pawn: piece.color === "white" ? "♙" : "♟",
  };

  return symbols[piece.type];
}
