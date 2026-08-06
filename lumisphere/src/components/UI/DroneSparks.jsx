import React, { useEffect, useRef } from "react";

export default function DroneSparks({ active = false }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!active) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animationFrameId;

        const width = (canvas.width = 160);
        const height = (canvas.height = 160);

        const particles = [];
        const maxParticles = 40;

        class SparkParticle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = width / 2;
                this.y = height / 2;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 5 + 2;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed - 1.5;
                this.size = Math.random() * 2.5 + 1;
                this.alpha = 1;
                this.decay = Math.random() * 0.05 + 0.03;
                this.color = Math.random() > 0.3 ? "#22d3ee" : "#fef08a"; // Cyan / Gold sparks
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.15; // Gravity pull
                this.alpha -= this.decay;

                if (this.alpha <= 0) {
                    this.reset();
                }
            }

            draw(ctx) {
                if (this.alpha <= 0) return;
                ctx.save();
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.alpha;
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < maxParticles; i++) {
            particles.push(new SparkParticle());
        }

        const render = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach((p) => {
                p.update();
                p.draw(ctx);
            });
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [active]);

    if (!active) return null;

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none absolute -top-16 -left-16 z-30"
            style={{ width: "160px", height: "160px" }}
        />
    );
}
