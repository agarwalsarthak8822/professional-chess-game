import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Bot, Crown, Gamepad2, Sparkles, Trophy, Zap } from "lucide-react";

export type GameMode = "singleplayer" | "multiplayer";

interface GameModeSelectionProps {
  onSelectMode: (mode: GameMode) => void;
}

export function GameModeSelection({ onSelectMode }: GameModeSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-yellow-200 to-orange-300 bg-clip-text text-transparent">
              Chess Master
            </h1>
            <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg">
              <Crown className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Experience the ultimate chess challenge with our advanced AI opponent or enjoy classic multiplayer gameplay with friends!
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-slate-400">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm">Powered by Advanced AI</span>
            <Sparkles className="h-4 w-4" />
          </div>
        </div>

        {/* Enhanced Game Mode Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Single Player Card */}
          <Card className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-6 p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-fit shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
                <Bot className="h-16 w-16 text-white" />
              </div>
              <CardTitle className="text-3xl text-white font-bold mb-2">
                Single Player
              </CardTitle>
              <div className="flex items-center justify-center gap-2 text-blue-400">
                <Zap className="h-4 w-4" />
                <span className="text-sm font-medium">AI Challenge</span>
              </div>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-slate-300 text-lg leading-relaxed">
                Challenge our intelligent AI opponent and improve your chess skills with multiple difficulty levels
              </p>
              <div className="space-y-3 text-sm text-slate-400">
                <div className="flex items-center justify-center gap-3">
                  <Gamepad2 className="h-5 w-5 text-blue-400" />
                  <span>Advanced AI opponent</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  <span>Multiple difficulty levels</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  <span>Real-time analysis</span>
                </div>
              </div>
              <Button
                onClick={() => onSelectMode("singleplayer")}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                size="lg"
              >
                <Bot className="mr-2 h-5 w-5" />
                Play vs AI
              </Button>
            </CardContent>
          </Card>

          {/* Multiplayer Card */}
          <Card className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 hover:border-green-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto mb-6 p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full w-fit shadow-lg group-hover:shadow-green-500/50 transition-all duration-300">
                <Users className="h-16 w-16 text-white" />
              </div>
              <CardTitle className="text-3xl text-white font-bold mb-2">Multiplayer</CardTitle>
              <div className="flex items-center justify-center gap-2 text-green-400">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">Local Play</span>
              </div>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-slate-300 text-lg leading-relaxed">
                Play with a friend on the same device and enjoy classic chess together with beautiful animations
              </p>
              <div className="space-y-3 text-sm text-slate-400">
                <div className="flex items-center justify-center gap-3">
                  <Users className="h-5 w-5 text-green-400" />
                  <span>Local multiplayer</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Gamepad2 className="h-5 w-5 text-green-400" />
                  <span>Turn-based gameplay</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  <span>Competitive mode</span>
                </div>
              </div>
              <Button
                onClick={() => onSelectMode("multiplayer")}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
                size="lg"
              >
                <Users className="mr-2 h-5 w-5" />
                Play with Friend
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Features Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center justify-center gap-3">
            <Sparkles className="h-6 w-6 text-yellow-400" />
            Game Features
            <Sparkles className="h-6 w-6 text-yellow-400" />
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
              <div className="text-blue-400 text-2xl mb-2">♔</div>
              <div className="text-white font-medium">Full Chess Rules</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 hover:border-green-500/50 transition-all duration-300">
              <div className="text-green-400 text-2xl mb-2">♖</div>
              <div className="text-white font-medium">Castling & En Passant</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
              <div className="text-purple-400 text-2xl mb-2">♕</div>
              <div className="text-white font-medium">Pawn Promotion</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 hover:border-red-500/50 transition-all duration-300">
              <div className="text-red-400 text-2xl mb-2">⚡</div>
              <div className="text-white font-medium">Check & Checkmate</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-slate-400">
          <p className="text-sm">Built with React, TypeScript, and Advanced Chess AI</p>
          <p className="text-xs mt-2">Experience the future of chess gaming</p>
        </div>
      </div>
    </div>
  );
}
