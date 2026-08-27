import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, X, RefreshCw, Trophy, Sparkles, Volume2 } from "lucide-react";
import { AudioEngine } from "../../utils/AudioEngine";
import { SecretsManager } from "../../utils/SecretsManager";

export default function RetroArcadeModal({ isOpen, onClose }) {
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => {
        try {
            return parseInt(localStorage.getItem("lumisphere_arcade_highscore") || "0", 10);
        } catch (e) {
            return 0;
        }
    });
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animationFrameId;

        const width = (canvas.width = 600);
        const height = (canvas.height = 400);

        // Paddle state
        let paddleWidth = 100;
        let paddleHeight = 12;
        let paddleX = (width - paddleWidth) / 2;

        // Ball state
        let ballX = width / 2;
        let ballY = height - 30;
        let ballDx = 4;
        let ballDy = -4;
        let ballRadius = 7;

        // Brick state
        const brickRowCount = 5;
        const brickColumnCount = 7;
        const brickWidth = 72;
        const brickHeight = 18;
        const brickPadding = 8;
        const brickOffsetTop = 40;
        const brickOffsetLeft = 20;

        const bricks = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }

        let currentScore = 0;

        const handleMove = (clientX) => {
            const rect = canvas.getBoundingClientRect();
            const relativeX = clientX - rect.left;
            if (relativeX > 0 && relativeX < width) {
                paddleX = relativeX - paddleWidth / 2;
            }
        };

        const handleMouseMove = (e) => handleMove(e.clientX);
        const handleTouchMove = (e) => {
            if (e.touches && e.touches.length > 0) {
                handleMove(e.touches[0].clientX);
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
                paddleX = Math.max(0, paddleX - 25);
            } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
                paddleX = Math.min(width - paddleWidth, paddleX + 25);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("touchmove", handleTouchMove, { passive: true });
        window.addEventListener("keydown", handleKeyDown);

        const collisionDetection = () => {
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    const b = bricks[c][r];
                    if (b.status === 1) {
                        if (
                            ballX > b.x &&
                            ballX < b.x + brickWidth &&
                            ballY > b.y &&
                            ballY < b.y + brickHeight
                        ) {
                            ballDy = -ballDy;
                            b.status = 0;
                            currentScore += 10;
                            setScore(currentScore);
                            AudioEngine.playMechKeyClick("blue");

                            if (currentScore > highScore) {
                                setHighScore(currentScore);
                                try {
                                    localStorage.setItem("lumisphere_arcade_highscore", currentScore.toString());
                                } catch (e) {}
                            }

                            if (currentScore >= 100) {
                                SecretsManager.unlockAchievement("arcade");
                            }
                        }
                    }
                }
            }
        };

        const drawBall = () => {
            ctx.beginPath();
            ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
            ctx.fillStyle = "#22d3ee";
            ctx.shadowColor = "#22d3ee";
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.closePath();
        };

        const drawPaddle = () => {
            ctx.beginPath();
            ctx.rect(paddleX, height - paddleHeight - 10, paddleWidth, paddleHeight);
            ctx.fillStyle = "#fbbf24";
            ctx.shadowColor = "#fbbf24";
            ctx.shadowBlur = 12;
            ctx.fill();
            ctx.closePath();
        };

        const drawBricks = () => {
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    if (bricks[c][r].status === 1) {
                        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                        bricks[c][r].x = brickX;
                        bricks[c][r].y = brickY;

                        ctx.beginPath();
                        ctx.rect(brickX, brickY, brickWidth, brickHeight);
                        ctx.fillStyle = r % 2 === 0 ? "rgba(236,72,153,0.85)" : "rgba(168,85,247,0.85)";
                        ctx.strokeStyle = "#ffffff";
                        ctx.lineWidth = 1;
                        ctx.fill();
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            drawBricks();
            drawBall();
            drawPaddle();
            collisionDetection();

            // Ball bouncing off walls
            if (ballX + ballDx > width - ballRadius || ballX + ballDx < ballRadius) {
                ballDx = -ballDx;
                AudioEngine.playMouseClick();
            }

            if (ballY + ballDy < ballRadius) {
                ballDy = -ballDy;
                AudioEngine.playMouseClick();
            } else if (ballY + ballDy > height - ballRadius - 10) {
                if (ballX > paddleX && ballX < paddleX + paddleWidth) {
                    ballDy = -ballDy * 1.05; // Speed up
                    AudioEngine.playCoffeeClink();
                } else {
                    setGameOver(true);
                    AudioEngine.playDroneRepair();
                    cancelAnimationFrame(animationFrameId);
                    return;
                }
            }

            ballX += ballDx;
            ballY += ballDy;

            animationFrameId = requestAnimationFrame(draw);
        };

        if (gameStarted && !gameOver) {
            draw();
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("keydown", handleKeyDown);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isOpen, gameStarted, gameOver, highScore]);

    if (!isOpen || typeof document === "undefined") return null;

    const startGame = () => {
        setScore(0);
        setGameOver(false);
        setGameStarted(true);
        AudioEngine.playHoloProject();
        SecretsManager.unlockAchievement("arcade");
    };

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.88, rotate: -2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.88 }}
                    className="relative w-full max-w-2xl rounded-2xl bg-neutral-950 border-4 border-pink-500/50 shadow-[0_0_60px_rgba(236,72,153,0.3)] overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="bg-neutral-900 px-6 py-4 border-b border-pink-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/40 animate-bounce">
                                <Gamepad2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-mono text-sm font-bold text-pink-300">
                                    CYBERPUNK RETRO ARCADE
                                </h3>
                                <p className="text-[11px] font-mono text-neutral-400">
                                    8-Bit Brick Breaker Mini-Game
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
                                <Trophy className="w-4 h-4" />
                                <span>HI-SCORE: {highScore}</span>
                            </div>

                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Game Canvas Box */}
                    <div className="relative p-6 flex flex-col items-center bg-black">
                        <canvas
                            ref={canvasRef}
                            className="rounded-xl border border-neutral-800 shadow-2xl cursor-none"
                            style={{ width: "600px", height: "400px" }}
                        />

                        {/* Start Overlay */}
                        {!gameStarted && (
                            <div className="absolute inset-0 bg-black/80 backdrop-blur flex flex-col items-center justify-center p-6 text-center font-mono">
                                <Sparkles className="w-12 h-12 text-pink-400 animate-spin mb-4" />
                                <h3 className="text-xl font-bold text-pink-300 mb-2">
                                    SECRET RETRO ARCADE UNLOCKED
                                </h3>
                                <p className="text-xs text-neutral-400 mb-6 max-w-sm">
                                    Move your mouse left & right to control the paddle and break all cyber bricks!
                                </p>
                                <button
                                    onClick={startGame}
                                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-mono font-bold text-sm rounded-xl shadow-lg shadow-pink-500/30 transition transform hover:scale-105"
                                >
                                    Insert Token & Play
                                </button>
                            </div>
                        )}

                        {/* Game Over Overlay */}
                        {gameOver && (
                            <div className="absolute inset-0 bg-black/85 backdrop-blur flex flex-col items-center justify-center p-6 text-center font-mono">
                                <h3 className="text-2xl font-bold text-red-500 mb-2 animate-pulse">
                                    GAME OVER
                                </h3>
                                <p className="text-sm text-neutral-300 mb-1">FINAL SCORE: {score}</p>
                                <p className="text-xs text-amber-400 mb-6">BEST SCORE: {highScore}</p>
                                <button
                                    onClick={startGame}
                                    className="px-6 py-3 bg-pink-500 hover:bg-pink-400 text-neutral-950 font-mono font-bold text-sm rounded-xl shadow-lg transition flex items-center gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    <span>Play Again</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer Stats */}
                    <div className="bg-neutral-900 px-6 py-3 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400">
                        <span>Current Score: {score}</span>
                        <span>Controls: Mouse Position</span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
}
