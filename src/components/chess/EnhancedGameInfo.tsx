import { GameState } from "@/types/chess";
import { GameMode } from "./GameModeSelection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Crown,
  Users,
  Clock,
  Trophy,
  Bot,
  User,
  ArrowLeft,
  Sparkles,
  Zap,
  Target,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedGameInfoProps {
  gameState: GameState;
  gameMode: GameMode;
  onBackToMenu: () => void;
  isAIThinking?: boolean;
}

export function EnhancedGameInfo({
  gameState,
  gameMode,
  onBackToMenu,
  isAIThinking = false,
}: EnhancedGameInfoProps) {
  const getStatusColor = () => {
    switch (gameState.gameStatus) {
      case "check":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white";
      case "checkmate":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
      case "playing":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
    }
  };

  const getStatusText = () => {
    if (
      isAIThinking &&
      gameState.currentPlayer === "black" &&
      gameMode === "singleplayer"
    ) {
      return "AI is thinking...";
    }

    switch (gameState.gameStatus) {
      case "check":
        return `${gameState.currentPlayer === "white" ? "White" : "Black"} is in Check!`;
      case "checkmate":
        return `Checkmate! ${gameState.winner === "white" ? "White" : "Black"} Wins!`;
      case "playing":
        if (gameMode === "singleplayer") {
          return gameState.currentPlayer === "white"
            ? "Your turn"
            : "AI's turn";
        }
        return `${gameState.currentPlayer === "white" ? "White" : "Black"} to move`;
      case "stalemate":
        return "Stalemate - It's a Draw!";
      case "draw":
        return "Draw - Game Ended";
      default:
        return "Game Over";
    }
  };

  const getCurrentPlayerInfo = () => {
    if (gameMode === "singleplayer") {
      return gameState.currentPlayer === "white"
        ? {
            icon: User,
            label: "You (White)",
            color: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
            bgColor: "bg-blue-500/20",
          }
        : {
            icon: Bot,
            label: "AI (Black)",
            color: "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
            bgColor: "bg-purple-500/20",
          };
    } else {
      return gameState.currentPlayer === "white"
        ? {
            icon: User,
            label: "Player 1 (White)",
            color: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
            bgColor: "bg-blue-500/20",
          }
        : {
            icon: User,
            label: "Player 2 (Black)",
            color: "bg-gradient-to-r from-green-500 to-green-600 text-white",
            bgColor: "bg-green-500/20",
          };
    }
  };

  const playerInfo = getCurrentPlayerInfo();
  const PlayerIcon = playerInfo.icon;

  return (
    <div className="space-y-6">
      {/* Enhanced Back to Menu Button */}
      <Button
        onClick={onBackToMenu}
        variant="outline"
        size="sm"
        className="w-full bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700 hover:border-blue-500 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 text-white transition-all duration-300 transform hover:scale-105"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Menu
      </Button>

      {/* Enhanced Game Mode Info */}
      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            {gameMode === "singleplayer" ? (
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                <Bot className="h-5 w-5 text-white" />
              </div>
            ) : (
              <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
            )}
            <span className="text-white font-bold">
              {gameMode === "singleplayer" ? "Single Player" : "Multiplayer"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-300">
            {gameMode === "singleplayer"
              ? "Playing against advanced AI opponent"
              : "Local multiplayer chess experience"}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Current Game Status */}
      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-bold">Game Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Badge className={cn("text-sm font-bold px-4 py-2", getStatusColor())}>
              {isAIThinking &&
              gameState.currentPlayer === "black" &&
              gameMode === "singleplayer" ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  {getStatusText()}
                </div>
              ) : (
                getStatusText()
              )}
            </Badge>
            {gameState.gameStatus === "checkmate" && (
              <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Current Player */}
      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <PlayerIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-bold">Current Turn</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-8 h-8 rounded-full border-4 shadow-lg",
                gameState.currentPlayer === "white"
                  ? "bg-white border-gray-300 shadow-white/50"
                  : "bg-gray-800 border-gray-600 shadow-gray-800/50",
              )}
            />
            <Badge className={cn("text-sm font-bold px-4 py-2", playerInfo.color)}>
              {playerInfo.label}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Move History */}
      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-bold">Move History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-40 overflow-y-auto space-y-3 custom-scrollbar">
            {gameState.moveHistory.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400 font-medium">No moves yet</p>
                <p className="text-slate-500 text-sm">Start playing to see move history</p>
              </div>
            ) : (
              gameState.moveHistory.slice(-8).map((move, index) => {
                const moveNumber = gameState.moveHistory.length - 7 + index;
                const fromSquare = `${String.fromCharCode(97 + move.from.col)}${8 - move.from.row}`;
                const toSquare = `${String.fromCharCode(97 + move.to.col)}${8 - move.to.row}`;

                return (
                  <div key={index} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50 hover:border-slate-500/50 transition-all duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-xs font-mono">
                        {moveNumber}.
                      </span>
                      <span className="font-mono text-white font-bold">
                        {fromSquare} → {toSquare}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {move.capturedPiece && (
                        <Badge variant="destructive" className="text-xs px-2 py-1">
                          Capture
                        </Badge>
                      )}
                      {move.isCheck && (
                        <Badge className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-xs px-2 py-1">
                          Check
                        </Badge>
                      )}
                      {move.isCastling && (
                        <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs px-2 py-1">
                          Castling
                        </Badge>
                      )}
                      {move.isEnPassant && (
                        <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs px-2 py-1">
                          En Passant
                        </Badge>
                      )}
                      {move.promotedTo && (
                        <Badge className="bg-green-500/20 text-green-300 border border-green-500/30 text-xs px-2 py-1">
                          Promotion
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Game Instructions */}
      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-bold">How to Play</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-300 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <p>Click a piece to select it</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
            <p>Valid moves are highlighted in green</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
            <p>Click a highlighted square to move</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
            <p>Capture opponent pieces by moving to their square</p>
          </div>
          {gameMode === "singleplayer" && (
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>Wait for AI to make its move</p>
            </div>
          )}
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
            <p>Protect your King from checkmate!</p>
          </div>
        </CardContent>
      </Card>

      {/* Game Statistics */}
      <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-bold">Game Stats</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{gameState.moveHistory.length}</div>
              <div className="text-xs text-slate-400">Total Moves</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {gameState.moveHistory.filter(m => m.capturedPiece).length}
              </div>
              <div className="text-xs text-slate-400">Captures</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
