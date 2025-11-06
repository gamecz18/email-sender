// Thunderstorm Canvas Animation
class ThunderstormAnimation {
    constructor() {
        this.canvas = document.getElementById('thunderstorm-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.raindrops = [];
        this.lightningBolts = [];
        this.clouds = [];
        this.lightningTimer = 0;
        this.flashActive = false;

        this.init();
        this.createClouds();
        this.createRain();
        this.animate();
        this.scheduleLightning();
    }

    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // Create cloud particles
    createClouds() {
        const cloudCount = 15;
        for (let i = 0; i < cloudCount; i++) {
            this.clouds.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height * 0.4,
                radius: Math.random() * 60 + 40,
                speed: Math.random() * 0.5 + 0.1,
                opacity: Math.random() * 0.3 + 0.1
            });
        }
    }

    // Create rain particles
    createRain() {
        const rainCount = 300;
        for (let i = 0; i < rainCount; i++) {
            this.raindrops.push(this.createRaindrop());
        }
    }

    createRaindrop() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            length: Math.random() * 20 + 10,
            speed: Math.random() * 5 + 5,
            opacity: Math.random() * 0.5 + 0.3
        };
    }

    // Draw clouds
    drawClouds() {
        this.clouds.forEach(cloud => {
            this.ctx.fillStyle = `rgba(30, 41, 59, ${cloud.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
            this.ctx.fill();

            // Update cloud position
            cloud.x += cloud.speed;
            if (cloud.x > this.canvas.width + cloud.radius) {
                cloud.x = -cloud.radius;
            }
        });
    }

    // Draw rain
    drawRain() {
        this.raindrops.forEach(drop => {
            this.ctx.strokeStyle = `rgba(174, 194, 224, ${drop.opacity})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(drop.x, drop.y);
            this.ctx.lineTo(drop.x, drop.y + drop.length);
            this.ctx.stroke();

            // Update raindrop position
            drop.y += drop.speed;
            drop.x += 1; // Slight wind effect

            // Reset raindrop when it goes off screen
            if (drop.y > this.canvas.height) {
                drop.x = Math.random() * this.canvas.width;
                drop.y = -drop.length;
            }
        });
    }

    // Create lightning bolt
    createLightningBolt(startX, startY) {
        const segments = [];
        let x = startX;
        let y = startY;
        const endY = this.canvas.height * 0.7;

        while (y < endY) {
            const nextX = x + (Math.random() - 0.5) * 100;
            const nextY = y + Math.random() * 50 + 30;

            segments.push({ x1: x, y1: y, x2: nextX, y2: nextY });

            // Add branches randomly
            if (Math.random() > 0.7) {
                const branchX = nextX + (Math.random() - 0.5) * 80;
                const branchY = nextY + Math.random() * 40 + 20;
                segments.push({
                    x1: nextX,
                    y1: nextY,
                    x2: branchX,
                    y2: branchY,
                    isBranch: true
                });
            }

            x = nextX;
            y = nextY;
        }

        return {
            segments: segments,
            opacity: 1,
            fadeRate: 0.05,
            glowIntensity: Math.random() * 20 + 10
        };
    }

    // Draw lightning
    drawLightning() {
        this.lightningBolts = this.lightningBolts.filter(bolt => {
            bolt.opacity -= bolt.fadeRate;

            if (bolt.opacity > 0) {
                bolt.segments.forEach(segment => {
                    // Glow effect
                    this.ctx.shadowBlur = bolt.glowIntensity;
                    this.ctx.shadowColor = 'rgba(255, 255, 255, 1)';

                    // Main lightning bolt
                    this.ctx.strokeStyle = `rgba(200, 220, 255, ${bolt.opacity})`;
                    this.ctx.lineWidth = segment.isBranch ? 2 : 4;
                    this.ctx.beginPath();
                    this.ctx.moveTo(segment.x1, segment.y1);
                    this.ctx.lineTo(segment.x2, segment.y2);
                    this.ctx.stroke();

                    // Core bright line
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${bolt.opacity})`;
                    this.ctx.lineWidth = segment.isBranch ? 1 : 2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(segment.x1, segment.y1);
                    this.ctx.lineTo(segment.x2, segment.y2);
                    this.ctx.stroke();
                });

                // Reset shadow
                this.ctx.shadowBlur = 0;
                return true;
            }
            return false;
        });
    }

    // Schedule random lightning
    scheduleLightning() {
        const triggerLightning = () => {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * 100;
            this.lightningBolts.push(this.createLightningBolt(x, y));

            // Screen flash effect
            this.createScreenFlash();

            // Schedule next lightning (random interval between 2-8 seconds)
            setTimeout(triggerLightning, Math.random() * 6000 + 2000);
        };

        // Initial delay
        setTimeout(triggerLightning, Math.random() * 3000 + 1000);
    }

    // Create screen flash effect
    createScreenFlash() {
        if (this.flashActive) return;

        this.flashActive = true;
        const flash = document.createElement('div');
        flash.className = 'lightning-flash';
        document.body.appendChild(flash);

        setTimeout(() => {
            flash.remove();
            this.flashActive = false;
        }, 200);
    }

    // Main animation loop
    animate() {
        // Clear canvas with semi-transparent fill for trail effect
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw elements in order
        this.drawClouds();
        this.drawRain();
        this.drawLightning();

        requestAnimationFrame(() => this.animate());
    }
}

// Interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Initialize thunderstorm animation
    new ThunderstormAnimation();

    // Add click event to trigger lightning
    document.addEventListener('click', (e) => {
        const canvas = document.getElementById('thunderstorm-canvas');
        const ctx = canvas.getContext('2d');

        // Create small particle burst at click location
        for (let i = 0; i < 10; i++) {
            const angle = (Math.PI * 2 * i) / 10;
            const x = e.clientX;
            const y = e.clientY;

            setTimeout(() => {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.beginPath();
                ctx.arc(
                    x + Math.cos(angle) * 30,
                    y + Math.sin(angle) * 30,
                    3,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }, i * 20);
        }
    });

    // Add hover effect to glass cards
    const glassCards = document.querySelectorAll('.glass-card');
    glassCards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Smooth scroll for buttons
    const buttons = document.querySelectorAll('.btn-glass-primary, .btn-glass-secondary');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Ripple effect
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
            `;

            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add CSS animation for ripple
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    console.log('⚡ Thunderstorm Glass website loaded successfully!');
    console.log('🌧️ Click anywhere to create particle effects');
    console.log('💨 Lightning strikes will occur randomly');
});
