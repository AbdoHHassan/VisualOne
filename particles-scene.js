document.addEventListener('sceneChange', function(event) {
  if (event.detail === 'particles') {
    startParticlesScene();
  }
});

function startParticlesScene() {
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');
  const particles = [];
  const gravity = 0.02;

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = 10;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY + gravity;
      this.boundaryCheck();
    }

    boundaryCheck() {
      if (this.x < 0 || this.x > canvas.width) {
        this.speedX *= -1;
      }
      if (this.y < 0 || this.y > canvas.height) {
        this.speedY *= -1;
      }
    }

    draw() {
      ctx.fillStyle = 'rgba(173, 216, 230, 1)';
      ctx.strokeStyle = 'rgba(173, 216, 230, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }

  function createParticles() {
    const particleCount = 100;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animateParticles);
  }

  createParticles();
  animateParticles();
}
