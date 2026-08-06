import React, { useEffect, useRef } from "react";

export default function CoffeeMugSteam({ active = true, density = 1.0 }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animationFrameId;

        let width = (canvas.width = 120);
        let height = (canvas.height = 140);

        const particles = [];
        const maxParticles = Math.floor(35 * density);

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = width / 2 + (Math.random() * 24 - 12);
                this.y = height - 15;
                this.radius = Math.random() * 8 + 4;
                this.maxRadius = this.radius * (Math.random() * 2.5 + 2);
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = -(Math.random() * 0.9 + 0.6);
                this.alpha = 0;
                this.maxAlpha = Math.random() * 0.28 + 0.15;
                this.life = 0;
                this.maxLife = Math.random() * 90 + 70;
            }

            update() {
                this.life++;
                this.x += this.vx + Math.sin(this.life * 0.05) * 0.45;
                this.y += this.vy;

                // Radius expands as steam rises
                const progress = this.life / this.maxLife;
                this.radius = this.maxRadius * Math.pow(progress, 0.7);

                // Alpha fades in then out
                if (progress < 0.25) {
                    this.alpha = (progress / 0.25) * this.maxAlpha;
                } else {
                    this.alpha = (1 - (progress - 0.25) / 0.75) * this.maxAlpha;
                }

                if (this.life >= this.maxLife || this.y < 0) {
                    this.reset();
                }
            }

            draw(ctx) {
                if (this.alpha <= 0) return;
                ctx.save();
                ctx.beginPath();
                const gradient = ctx.createRadialGradient(
                    this.x,
                    this.y,
                    0,
                    this.x,
                    this.y,
                    Math.max(1, this.radius)
                );
                gradient.addColorStop(0, `rgba(255, 245, 230, ${this.alpha * (active ? 1 : 0.2)})`);
                gradient.addColorStop(0.6, `rgba(240, 220, 200, ${this.alpha * 0.4 * (active ? 1 : 0.2)})`);
                gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

                ctx.fillStyle = gradient;
                ctx.arc(this.x, this.y, Math.max(1, this.radius), 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < maxParticles; i++) {
            const p = new Particle();
            p.life = Math.random() * p.maxLife; // Stagger lifecycle
            particles.push(p);
        }

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            if (active) {
                particles.forEach((p) => {
                    p.update();
                    p.draw(ctx);
                });
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [active, density]);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 z-20"
            style={{ width: "120px", height: "140px" }}
        />
    );
}
