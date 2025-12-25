import React, { useEffect, useRef } from 'react';
import './AnimatedBackground.css';

const AnimatedBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener('resize', resize);

        const draw = () => {
            time += 0.003;

            // Create gradient background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#0a0a0f');
            gradient.addColorStop(0.5, '#1a1a2e');
            gradient.addColorStop(1, '#0a0a0f');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw animated gradient orbs with enhanced glow
            const drawOrb = (x, y, radius, color, opacity) => {
                // Outer glow
                const outerGlow = ctx.createRadialGradient(x, y, 0, x, y, radius * 1.5);
                outerGlow.addColorStop(0, `${color}${Math.floor(opacity * 0.3 * 255).toString(16).padStart(2, '0')}`);
                outerGlow.addColorStop(0.5, `${color}${Math.floor(opacity * 0.15 * 255).toString(16).padStart(2, '0')}`);
                outerGlow.addColorStop(1, `${color}00`);

                ctx.fillStyle = outerGlow;
                ctx.beginPath();
                ctx.arc(x, y, radius * 1.5, 0, Math.PI * 2);
                ctx.fill();

                // Main orb
                const orbGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                orbGradient.addColorStop(0, `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
                orbGradient.addColorStop(0.7, `${color}${Math.floor(opacity * 0.5 * 255).toString(16).padStart(2, '0')}`);
                orbGradient.addColorStop(1, `${color}00`);

                ctx.fillStyle = orbGradient;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            };

            // Animated orbs with more dynamic movement
            drawOrb(
                canvas.width * 0.2 + Math.sin(time) * 150,
                canvas.height * 0.3 + Math.cos(time * 0.8) * 120,
                350,
                '#3b82f6',
                0.2
            );

            drawOrb(
                canvas.width * 0.8 + Math.cos(time * 0.7) * 180,
                canvas.height * 0.6 + Math.sin(time * 0.9) * 140,
                400,
                '#8b5cf6',
                0.18
            );

            drawOrb(
                canvas.width * 0.5 + Math.sin(time * 1.2) * 100,
                canvas.height * 0.8 + Math.cos(time) * 110,
                320,
                '#06b6d4',
                0.15
            );

            drawOrb(
                canvas.width * 0.7 + Math.cos(time * 0.9) * 130,
                canvas.height * 0.2 + Math.sin(time * 1.1) * 90,
                280,
                '#ec4899',
                0.12
            );

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="animated-background" />;
};

export default AnimatedBackground;
