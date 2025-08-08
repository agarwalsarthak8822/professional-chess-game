import { ChessPiece as PieceType } from "@/types/chess";
import { getPieceSymbol } from "@/lib/chess-logic";
import { cn } from "@/lib/utils";

interface ChessPieceProps {
  piece: PieceType;
  isSelected?: boolean;
  onClick: () => void;
}

export function ChessPiece({ piece, isSelected, onClick }: ChessPieceProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center w-full h-full cursor-pointer transition-all duration-300 hover:scale-110 relative group",
        isSelected && "scale-110 drop-shadow-2xl z-10",
      )}
      onClick={onClick}
    >
      {/* Piece Background Glow */}
      <div
        className={cn(
          "absolute inset-0 rounded-full transition-all duration-300",
          piece.color === "white"
            ? "bg-white/20 group-hover:bg-white/30"
            : "bg-gray-800/20 group-hover:bg-gray-800/30",
          isSelected && "bg-yellow-400/30 animate-pulse",
        )}
      />

      {/* Main Piece Symbol */}
      <span
        className={cn(
          "text-4xl select-none transition-all duration-300 relative z-10",
          piece.color === "white"
            ? "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] filter brightness-110"
            : "text-gray-800 drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)] filter brightness-90",
          isSelected && "animate-pulse scale-110",
          "group-hover:scale-110 group-hover:brightness-125",
        )}
      >
        {getPieceSymbol(piece)}
      </span>

      {/* Selection Ring */}
      {isSelected && (
        <div className="absolute inset-0 border-4 border-yellow-400 rounded-full animate-pulse" />
      )}

      {/* Hover Effect */}
      <div
        className={cn(
          "absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          piece.color === "white"
            ? "bg-gradient-to-br from-white/20 to-transparent"
            : "bg-gradient-to-br from-gray-800/20 to-transparent",
        )}
      />

      {/* Piece Type Indicator (for accessibility) */}
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {piece.type.charAt(0).toUpperCase() + piece.type.slice(1)}
        </div>
      </div>
    </div>
  );
}
