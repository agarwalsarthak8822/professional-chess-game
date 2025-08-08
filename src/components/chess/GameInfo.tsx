import { GameState } from "@/types/chess";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Users, Clock, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameInfoProps {
  gameState: GameState;
}

export function GameInfo({ gameState }: GameInfoProps) {
  const getStatusColor = () => {
    switch (gameState.gameStatus) {
      case "check":
        return "bg-yellow-100 text-yellow-800";
      case "checkmate":
        return "bg-red-100 text-red-800";
      case "playing":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = () => {
    switch (gameState.gameStatus) {
      case "check":
        return `${gameState.currentPlayer === "white" ? "White" : "Black"} is in Check!`;
      case "checkmate":
        return `Checkmate! ${gameState.winner === "white" ? "White" : "Black"} Wins!`;
      case "playing":
        return `${gameState.currentPlayer === "white" ? "White" : "Black"} to move`;
      case "stalemate":
        return "Stalemate - It's a Draw!";
      case "draw":
        return "Draw - Game Ended";
      default:
        return "Game Over";
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Game Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Crown className="h-5 w-5" />
            Game Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Badge className={cn("text-sm font-medium", getStatusColor())}>
              {getStatusText()}
            </Badge>
            {gameState.gameStatus === "checkmate" && (
              <Trophy className="h-6 w-6 text-yellow-500" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Player */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" />
            Current Turn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-6 h-6 rounded-full border-2",
                gameState.currentPlayer === "white"
                  ? "bg-white border-gray-300"
                  : "bg-gray-800 border-gray-600",
              )}
            />
            <span className="font-medium capitalize">
              {gameState.currentPlayer}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Move History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5" />
            Move History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {gameState.moveHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground">No moves yet</p>
            ) : (
              gameState.moveHistory.slice(-5).map((move, index) => {
                const moveNumber = gameState.moveHistory.length - 4 + index;
                const fromSquare = `${String.fromCharCode(97 + move.from.col)}${8 - move.from.row}`;
                const toSquare = `${String.fromCharCode(97 + move.to.col)}${8 - move.to.row}`;

                return (
                  <div key={index} className="text-sm flex items-center gap-2">
                    <span className="text-muted-foreground w-6">
                      {moveNumber}.
                    </span>
                    <span className="font-mono">
                      {fromSquare} → {toSquare}
                    </span>
                    {move.capturedPiece && (
                      <Badge variant="destructive" className="text-xs">
                        Capture
                      </Badge>
                    )}
                    {move.isCheck && (
                      <Badge variant="secondary" className="text-xs">
                        Check
                      </Badge>
                    )}
                    {move.isCastling && (
                      <Badge variant="outline" className="text-xs">
                        Castling
                      </Badge>
                    )}
                    {move.isEnPassant && (
                      <Badge variant="outline" className="text-xs">
                        En Passant
                      </Badge>
                    )}
                    {move.promotedTo && (
                      <Badge variant="outline" className="text-xs">
                        Promotion
                      </Badge>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Game Instructions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">How to Play</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• Click a piece to select it</p>
          <p>• Valid moves are highlighted in green</p>
          <p>• Click a highlighted square to move</p>
          <p>• Capture opponent pieces by moving to their square</p>
          <p>• Castling: Move King 2 squares toward Rook</p>
          <p>• En Passant: Special pawn capture move</p>
          <p>• Pawn Promotion: Pawns become Queens at end</p>
          <p>• Protect your King from checkmate!</p>
        </CardContent>
      </Card>
    </div>
  );
}
