document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // 1. AUDIO & ELEMENTOS PRINCIPALES
    // ==========================================================================
    const audio = new Audio('images/music.mp3');
    audio.loop = true;
    audio.volume = 0.2;

    const introOverlay = document.getElementById('intro-overlay');
    const enterBtn = document.getElementById('enter-btn');
    const hero = document.querySelector('.hero');

    if (enterBtn && introOverlay) {
        enterBtn.addEventListener('click', () => {
            introOverlay.classList.add('hidden'); 
            
            audio.play().catch(error => {
                console.log("La reproducción automática fue bloqueada por el navegador: ", error);
            });

            setTimeout(() => {
                introOverlay.style.display = "none";
            }, 1000);
        });
    }
    if (hero) {
        setTimeout(() => {
            hero.classList.add('animate');
        }, 300);
    }

    // ==========================================================================
    // 2. CONFIGURACIÓN DEL LIENZO (CANVAS)
    // ==========================================================================
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth || 1920;
        canvas.height = window.innerHeight || 1080;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // ==========================================================================
    // 3. SISTEMA DE DESTELLOS DEL MUNDO DEL REVÉS
    // ==========================================================================
    const particles = [];
    const particleCount = 100; 

    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height; 
        }

        reset() {
            this.x = Math.random() * canvas.width;
            
            this.baseColor = 'rgba(255, 30, 30'; 

            this.y = canvas.height + 20; 
            
            this.size = Math.random() * 15 + 15;
            this.speedY = -(Math.random() * 0.3 + 0.1);
            this.speedX = (Math.random() - 0.5) * 0.15;
            this.opacity = Math.random() * 0.6 + 0.3;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;

            if (this.y < -30 || this.x < -30 || this.x > canvas.width + 30) {
                this.reset();
            }
        }

        draw() {
            ctx.save(); 

            ctx.shadowBlur = 20; 
            ctx.shadowColor = `${this.baseColor}, ${this.opacity})`; 

            let gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            
            gradient.addColorStop(0, `${this.baseColor}, ${this.opacity})`); 
            gradient.addColorStop(0.5, `${this.baseColor}, ${this.opacity * 0.6})`); 
            gradient.addColorStop(1, `${this.baseColor}, 0)`);

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();

            ctx.restore(); 
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    }

    // ==========================================================================
    // 4. CONTROL DE AUDIO INTERACTIVO (MUTE / UNMUTE)
    // ==========================================================================
    const muteBtn = document.getElementById('muteBtn');
    
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            const audioIcon = document.getElementById('audioIcon');

            if (audio.paused) {
                audio.play().catch(err => console.log("Error al reanudar: ", err));
                if (audioIcon) audioIcon.className = "fa-solid fa-volume-high";
            } else {
                audio.pause();
                if (audioIcon) audioIcon.className = "fa-solid fa-volume-xmark";
            }
        });
    }

    animate();
});