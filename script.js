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

    // Manejo de la pantalla de bienvenida (Intro)
    if (enterBtn && introOverlay) {
        enterBtn.addEventListener('click', () => {
            // Activa la animación de desvanecimiento CSS
            introOverlay.classList.add('hidden'); 
            
            // Intenta reproducir la música de fondo automáticamente
            audio.play().catch(error => {
                console.log("La reproducción automática fue bloqueada por el navegador: ", error);
            });

            // Espera a que termine la transición CSS (1s) para quitarlo del flujo de renderizado
            setTimeout(() => {
                introOverlay.style.display = "none";
            }, 1000);
        });
    }

    // Animación de entrada de las letras principales
    if (hero) {
        setTimeout(() => {
            hero.classList.add('animate');
        }, 300);
    }

    // ==========================================================================
    // 2. CONFIGURACIÓN DEL LIENZO (CANVAS)
    // ==========================================================================
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return; // Detiene la ejecución si no existe el lienzo en el DOM
    
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
    const particleCount = 180; 

    class Particle {
        constructor() {
            this.reset();
            // Distribución inicial aleatoria en la pantalla
            this.y = Math.random() * canvas.height; 
        }

        reset() {
            this.side = Math.random() > 0.5 ? 'left' : 'right';
            
            // Colores neón característicos (Rojo y Azul)
            if (this.side === 'left') {
                this.x = Math.random() * (canvas.width / 2);
                this.baseColor = 'rgba(0, 160, 255'; // Azul eléctrico
            } else {
                this.x = (canvas.width / 2) + Math.random() * (canvas.width / 2);
                this.baseColor = 'rgba(255, 30, 30'; // Rojo fuego
            }

            this.y = canvas.height + 20; 
            this.size = Math.random() * 8 + 6; // Tamaño notable (6px a 14px)
            this.speedY = -(Math.random() * 0.3 + 0.1); // Flujo ascendente lento
            this.speedX = (Math.random() - 0.5) * 0.15; // Balanceo horizontal suave
            this.opacity = Math.random() * 0.6 + 0.3; 
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;

            // Reinicia la partícula si sale de los límites visibles
            if (this.y < -30 || this.x < -30 || this.x > canvas.width + 30) {
                this.reset();
            }
        }

        draw() {
            ctx.save(); 

            // Efecto Glow ambiental
            ctx.shadowBlur = 20; 
            ctx.shadowColor = `${this.baseColor}, ${this.opacity})`; 

            // Degradado radial del núcleo al resplandor
            let gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            
            gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity + 0.3})`); 
            gradient.addColorStop(0.35, `rgba(255, 255, 255, ${this.opacity + 0.2})`); 
            gradient.addColorStop(0.7, `${this.baseColor}, ${this.opacity})`);
            gradient.addColorStop(1, `${this.baseColor}, 0)`); 

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();

            ctx.restore(); 
        }
    }

    // Inicialización del arreglo de partículas
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Ciclo infinito de renderizado
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
                if (audioIcon) audioIcon.className = "fa-solid fa-volume-xmark"; // Muestra ícono para Mutear
            } else {
                audio.pause();
                if (audioIcon) audioIcon.className = "fa-solid fa-volume-high";  // Muestra ícono para Desmutear
            }
        });
    }

    // Ejecución inicial del fondo animado
    animate();
});