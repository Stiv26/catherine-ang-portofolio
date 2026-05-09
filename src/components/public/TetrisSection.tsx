"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, ChevronDown, ArrowUp } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";

// ─── Constants ────────────────────────────────────────────────────────────────

const COLS = 10;
const ROWS = 20;
const PIECES = ["I", "O", "T", "S", "Z", "J", "L"] as const;
type Piece = (typeof PIECES)[number];

// SRS rotation shapes [rotation][cell] = [col, row] relative to piece origin
const SHAPES: Record<Piece, [number, number][][]> = {
  I: [[[0,1],[1,1],[2,1],[3,1]],[[2,0],[2,1],[2,2],[2,3]],[[0,2],[1,2],[2,2],[3,2]],[[1,0],[1,1],[1,2],[1,3]]],
  O: [[[1,0],[2,0],[1,1],[2,1]],[[1,0],[2,0],[1,1],[2,1]],[[1,0],[2,0],[1,1],[2,1]],[[1,0],[2,0],[1,1],[2,1]]],
  T: [[[1,0],[0,1],[1,1],[2,1]],[[1,0],[1,1],[2,1],[1,2]],[[0,1],[1,1],[2,1],[1,2]],[[1,0],[0,1],[1,1],[1,2]]],
  S: [[[1,0],[2,0],[0,1],[1,1]],[[1,0],[1,1],[2,1],[2,2]],[[1,1],[2,1],[0,2],[1,2]],[[0,0],[0,1],[1,1],[1,2]]],
  Z: [[[0,0],[1,0],[1,1],[2,1]],[[2,0],[1,1],[2,1],[1,2]],[[0,1],[1,1],[1,2],[2,2]],[[1,0],[0,1],[1,1],[0,2]]],
  J: [[[0,0],[0,1],[1,1],[2,1]],[[1,0],[2,0],[1,1],[1,2]],[[0,1],[1,1],[2,1],[2,2]],[[1,0],[1,1],[0,2],[1,2]]],
  L: [[[2,0],[0,1],[1,1],[2,1]],[[1,0],[1,1],[1,2],[2,2]],[[0,1],[1,1],[2,1],[0,2]],[[0,0],[1,0],[1,1],[1,2]]],
};

const COLORS: Record<Piece, string> = {
  I: "#E8789A",
  O: "#C9A8E0",
  T: "#FFAD87",
  S: "#7ECFBA",
  Z: "#F4A7B9",
  J: "#85C8E8",
  L: "#FFD4A3",
};

const SCORE_TABLE = [0, 100, 300, 500, 800];
const tickMs = (lvl: number) => Math.max(80, 800 - (lvl - 1) * 70);

// ─── Game logic helpers ────────────────────────────────────────────────────────

type Cell = string | null;
type Board = Cell[][];

interface Tetromino {
  type: Piece;
  x: number;
  y: number;
  rot: number;
}

const mkBoard = (): Board =>
  Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(null));

const absCells = (t: Tetromino): [number, number][] =>
  SHAPES[t.type][t.rot].map(([dc, dr]) => [t.x + dc, t.y + dr]);

const isValid = (board: Board, t: Tetromino): boolean =>
  absCells(t).every(([c, r]) => c >= 0 && c < COLS && r < ROWS && (r < 0 || board[r][c] === null));

const lockPiece = (board: Board, t: Tetromino): Board => {
  const b = board.map((r) => [...r]);
  absCells(t).forEach(([c, r]) => { if (r >= 0) b[r][c] = COLORS[t.type]; });
  return b;
};

const clearLines = (board: Board): [Board, number] => {
  const kept = board.filter((row) => row.some((c) => c === null));
  const n = ROWS - kept.length;
  return [[...Array.from({ length: n }, () => Array<Cell>(COLS).fill(null)), ...kept], n];
};

const getGhost = (board: Board, t: Tetromino): Tetromino => {
  let g = { ...t };
  while (isValid(board, { ...g, y: g.y + 1 })) g = { ...g, y: g.y + 1 };
  return g;
};

const spawn = (type: Piece): Tetromino => ({ type, x: 3, y: -2, rot: 0 });
const rnd = (): Piece => PIECES[Math.floor(Math.random() * PIECES.length)];

// ─── Hook: press-and-hold repeat ──────────────────────────────────────────────

function usePressRepeat(fn: () => void, delay = 80, init = 180) {
  const t1 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t2 = useRef<ReturnType<typeof setInterval> | null>(null);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const start = useCallback(() => {
    fnRef.current();
    t1.current = setTimeout(() => {
      t2.current = setInterval(() => fnRef.current(), delay);
    }, init);
  }, [delay, init]);

  const stop = useCallback(() => {
    if (t1.current) clearTimeout(t1.current);
    if (t2.current) clearInterval(t2.current);
  }, []);

  return [start, stop] as const;
}

// ─── Mobile control button ─────────────────────────────────────────────────────

function Btn({
  onStart, onStop, children, wide, accent,
}: {
  onStart: () => void;
  onStop?: () => void;
  children: React.ReactNode;
  wide?: boolean;
  accent?: boolean;
}) {
  return (
    <button
      onPointerDown={(e) => { e.preventDefault(); onStart(); }}
      onPointerUp={onStop}
      onPointerLeave={onStop}
      onPointerCancel={onStop}
      className={[
        "select-none touch-none transition-transform active:scale-90 flex items-center justify-center rounded-2xl font-bold",
        wide ? "h-14 flex-1" : "w-14 h-14",
        accent
          ? "bg-accent-deep text-white shadow-glow"
          : "bg-bg-primary border border-border-soft text-text-primary",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

// ─── Next piece mini-grid ──────────────────────────────────────────────────────

function NextPreview({ type }: { type: Piece }) {
  const shape = SHAPES[type][0];
  const filled = new Set(shape.map(([c, r]) => `${c},${r}`));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3 }}>
      {Array.from({ length: 16 }, (_, i) => {
        const c = i % 4, r = Math.floor(i / 4);
        const on = filled.has(`${c},${r}`);
        return (
          <div
            key={i}
            style={{
              width: 14, height: 14, borderRadius: 2,
              backgroundColor: on ? COLORS[type] : "transparent",
              border: on ? "1px solid rgba(255,255,255,0.15)" : undefined,
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

type GameState = "idle" | "playing" | "paused" | "over";

export default function TetrisSection() {
  const [board, setBoard] = useState<Board>(mkBoard);
  const [piece, setPiece] = useState<Tetromino | null>(null);
  const [next, setNext] = useState<Piece>(rnd);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [isNewBest, setIsNewBest] = useState(false);

  // Mutable refs so callbacks stay stable
  const S = useRef({ board, piece, next, score, lines, level, gameState });
  S.current = { board, piece, next, score, lines, level, gameState };

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ─── drop: move piece down one row, or lock ───────────────────────────────

  const drop = useCallback(() => {
    const { board, piece, next, score, lines, level, gameState } = S.current;
    if (gameState !== "playing" || !piece) return;

    const moved = { ...piece, y: piece.y + 1 };
    if (isValid(board, moved)) { setPiece(moved); return; }

    // Lock + clear
    const locked = lockPiece(board, piece);
    const [cleared, n] = clearLines(locked);
    const newLines = lines + n;
    const newLevel = Math.floor(newLines / 10) + 1;
    const newScore = score + SCORE_TABLE[n] * level;

    setBoard(cleared);
    setLines(newLines);
    setLevel(newLevel);
    setScore(newScore);

    const spawned = spawn(next);
    const newNext = rnd();
    setNext(newNext);

    if (!isValid(cleared, spawned)) {
      setGameState("over");
      setBest((prev) => {
        if (newScore > prev) { setIsNewBest(true); return newScore; }
        return prev;
      });
      setPiece(null);
    } else {
      setPiece(spawned);
    }
  }, []);

  // ─── Tick effect ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (gameState !== "playing") {
      if (tickRef.current) clearInterval(tickRef.current);
      return;
    }
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = setInterval(drop, tickMs(level));
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [gameState, level, drop]);

  // ─── Actions ──────────────────────────────────────────────────────────────

  const startGame = useCallback(() => {
    const t = rnd(), n = rnd();
    setBoard(mkBoard());
    setPiece(spawn(t));
    setNext(n);
    setScore(0); setLines(0); setLevel(1);
    setIsNewBest(false);
    setGameState("playing");
  }, []);

  const togglePause = useCallback(() => {
    setGameState((s) => (s === "playing" ? "paused" : "playing"));
  }, []);

  const moveLeft = useCallback(() => {
    const { board, piece, gameState } = S.current;
    if (gameState !== "playing" || !piece) return;
    const m = { ...piece, x: piece.x - 1 };
    if (isValid(board, m)) setPiece(m);
  }, []);

  const moveRight = useCallback(() => {
    const { board, piece, gameState } = S.current;
    if (gameState !== "playing" || !piece) return;
    const m = { ...piece, x: piece.x + 1 };
    if (isValid(board, m)) setPiece(m);
  }, []);

  const rotatePiece = useCallback(() => {
    const { board, piece, gameState } = S.current;
    if (gameState !== "playing" || !piece) return;
    const rot = (piece.rot + 1) % 4;
    const rotated = { ...piece, rot };
    for (const [dx, dy] of [[0,0],[-1,0],[1,0],[-2,0],[2,0],[0,-1]] as [number,number][]) {
      const k = { ...rotated, x: rotated.x + dx, y: rotated.y + dy };
      if (isValid(board, k)) { setPiece(k); return; }
    }
  }, []);

  const softDrop = useCallback(() => {
    const { board, piece, gameState } = S.current;
    if (gameState !== "playing" || !piece) return;
    const m = { ...piece, y: piece.y + 1 };
    if (isValid(board, m)) setPiece(m);
  }, []);

  const hardDrop = useCallback(() => {
    const { board, piece, gameState } = S.current;
    if (gameState !== "playing" || !piece) return;
    const g = getGhost(board, piece);
    setPiece(g);
    setTimeout(drop, 16);
  }, [drop]);

  // ─── Keyboard ─────────────────────────────────────────────────────────────

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, () => void> = {
        ArrowLeft: moveLeft,
        ArrowRight: moveRight,
        ArrowDown: softDrop,
        ArrowUp: rotatePiece,
        " ": hardDrop,
        p: () => { const s = S.current.gameState; if (s === "playing" || s === "paused") togglePause(); },
        P: () => { const s = S.current.gameState; if (s === "playing" || s === "paused") togglePause(); },
      };
      if (map[e.key]) { e.preventDefault(); map[e.key](); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moveLeft, moveRight, softDrop, rotatePiece, hardDrop, togglePause]);

  // ─── Press-repeat hooks for mobile hold ───────────────────────────────────

  const [startLeft, stopLeft] = usePressRepeat(moveLeft);
  const [startRight, stopRight] = usePressRepeat(moveRight);
  const [startDown, stopDown] = usePressRepeat(softDrop);

  // ─── Render data ──────────────────────────────────────────────────────────

  const ghostPiece = piece && gameState === "playing" ? getGhost(board, piece) : null;
  const ghostSet = ghostPiece
    ? new Set(absCells(ghostPiece).map(([c, r]) => `${c},${r}`))
    : new Set<string>();
  const activeMap = piece
    ? new Map(absCells(piece).map(([c, r]) => [`${c},${r}`, COLORS[piece.type]]))
    : new Map<string, string>();

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <section id="tetris" className="py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-80 h-80 bg-accent-lavender/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-soft/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        <ScrollReveal className="text-center mb-10">
          <p className="font-accent text-xl text-accent-deep">take a break</p>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-text-primary mt-1">
            Play Tetris
          </h2>
          <p className="hidden md:block text-text-tertiary text-sm mt-3 font-mono">
            ← → move · ↑ rotate · ↓ soft drop · Space hard drop · P pause
          </p>
        </ScrollReveal>

        {/* ── Game layout ───────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-5">

          {/* Board */}
          <div className="relative w-full max-w-[300px] sm:max-w-[280px] shrink-0">
            {/* Grid */}
            <div
              className="rounded-2xl overflow-hidden border-2 border-accent-primary/25 bg-[#0d0d12]"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                gap: "1px",
                padding: "4px",
              }}
            >
              {Array.from({ length: ROWS * COLS }, (_, i) => {
                const c = i % COLS, r = Math.floor(i / COLS);
                const key = `${c},${r}`;
                const locked = board[r][c];
                const active = activeMap.get(key);
                const isGhost = ghostSet.has(key) && !active;
                const color = active || locked;

                return (
                  <div
                    key={key}
                    style={{
                      aspectRatio: "1",
                      borderRadius: 3,
                      backgroundColor: color ?? (isGhost ? "rgba(232,120,154,0.12)" : "transparent"),
                      border: color
                        ? "1px solid rgba(255,255,255,0.12)"
                        : isGhost
                        ? "1px dashed rgba(232,120,154,0.35)"
                        : "1px solid rgba(255,255,255,0.03)",
                      boxShadow: color ? `inset 0 1px 0 rgba(255,255,255,0.18)` : undefined,
                    }}
                  />
                );
              })}
            </div>

            {/* Overlay: idle / paused / game over */}
            {gameState !== "playing" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-[#0d0d12]/85 backdrop-blur-sm">
                {gameState === "idle" && (
                  <>
                    <p className="font-display text-3xl font-bold text-white mb-1">Tetris</p>
                    <p className="text-white/50 text-sm font-mono mb-6">
                      {best > 0 ? `Best: ${best.toLocaleString()}` : "Can you beat my score?"}
                    </p>
                    <button
                      onClick={startGame}
                      className="flex items-center gap-2 px-7 py-3 rounded-full bg-accent-primary text-white font-body font-semibold text-sm hover:bg-accent-deep transition-all shadow-glow"
                    >
                      <Play size={15} fill="white" />
                      Start Game
                    </button>
                  </>
                )}
                {gameState === "paused" && (
                  <>
                    <p className="font-display text-2xl font-bold text-white mb-5">Paused</p>
                    <div className="flex gap-3">
                      <button
                        onClick={togglePause}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-accent-primary text-white font-body font-medium text-sm hover:bg-accent-deep transition-all"
                      >
                        <Play size={14} fill="white" /> Resume
                      </button>
                      <button
                        onClick={startGame}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 text-white font-body font-medium text-sm hover:bg-white/20 transition-all"
                      >
                        <RotateCcw size={14} /> Restart
                      </button>
                    </div>
                  </>
                )}
                {gameState === "over" && (
                  <>
                    <p className="font-display text-2xl font-bold text-white mb-1">Game Over</p>
                    <p className="font-mono text-accent-primary text-2xl font-bold my-1">
                      {score.toLocaleString()}
                    </p>
                    {isNewBest && (
                      <p className="text-xs font-mono text-green-400 mb-1">✦ New best score!</p>
                    )}
                    <p className="text-white/40 text-xs font-mono mb-6">
                      Level {level} · {lines} lines
                    </p>
                    <button
                      onClick={startGame}
                      className="flex items-center gap-2 px-7 py-3 rounded-full bg-accent-primary text-white font-body font-semibold text-sm hover:bg-accent-deep transition-all shadow-glow"
                    >
                      <Play size={15} fill="white" />
                      Play Again
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Side panel — horizontal on mobile, vertical on desktop */}
          <div className="flex flex-row flex-wrap lg:flex-col gap-3 w-full max-w-[300px] sm:max-w-[280px] lg:max-w-none lg:w-32">
            {/* Stats */}
            {[
              { label: "Score", value: score.toLocaleString() },
              { label: "Best", value: best.toLocaleString(), accent: true },
              { label: "Level", value: level },
              { label: "Lines", value: lines },
            ].map(({ label, value, accent }) => (
              <div
                key={label}
                className="flex-1 lg:flex-none bg-bg-primary border border-border-soft rounded-2xl p-3 text-center min-w-[60px]"
              >
                <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider">{label}</p>
                <p className={`font-display text-lg font-bold mt-0.5 leading-none ${accent ? "text-accent-deep" : "text-text-primary"}`}>
                  {value}
                </p>
              </div>
            ))}

            {/* Next piece */}
            <div className="bg-bg-primary border border-border-soft rounded-2xl p-3 flex flex-col items-center gap-2">
              <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider">Next</p>
              <NextPreview type={next} />
            </div>

            {/* Controls */}
            <div className="flex lg:flex-col gap-2">
              <button
                onClick={gameState === "idle" || gameState === "over" ? startGame : togglePause}
                className="flex-1 lg:flex-none p-3 rounded-2xl bg-accent-soft text-accent-deep hover:bg-accent-primary hover:text-white transition-all flex items-center justify-center"
              >
                {gameState === "playing" ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button
                onClick={startGame}
                className="flex-1 lg:flex-none p-3 rounded-2xl bg-bg-secondary border border-border-soft text-text-secondary hover:text-text-primary transition-all flex items-center justify-center"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile D-pad controls ─────────────────────────────────────── */}
        <div className="mt-6 flex flex-col items-center gap-3 lg:hidden select-none">
          {/* Row 1: Rotate */}
          <Btn onStart={rotatePiece} accent>
            <ArrowUp size={22} />
          </Btn>

          {/* Row 2: Left / Soft drop / Right */}
          <div className="flex gap-3">
            <Btn onStart={startLeft} onStop={stopLeft}>
              <ChevronLeft size={24} />
            </Btn>
            <Btn onStart={startDown} onStop={stopDown}>
              <ChevronDown size={24} />
            </Btn>
            <Btn onStart={startRight} onStop={stopRight}>
              <ChevronRight size={24} />
            </Btn>
          </div>

          {/* Row 3: Hard drop */}
          <Btn onStart={hardDrop} wide accent>
            <span className="text-sm font-semibold tracking-wide">DROP ↓↓</span>
          </Btn>

          <p className="text-[11px] font-mono text-text-tertiary mt-1">
            Tap ↑ to rotate · Hold ←→ to move · DROP for instant place
          </p>
        </div>
      </div>
    </section>
  );
}
