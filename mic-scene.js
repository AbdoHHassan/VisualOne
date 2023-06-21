document.addEventListener('sceneChange', function(event) {
  if (event.detail === 'mic') {
    startMicScene();
  }
});

function startMicScene() {
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');
  const micParticles = [];
  let mic;
  let fft;

  class MicParticle {
    constructor(x, y, size, speed) {
      this.pos = createVector(x, y);
      this.vel = p5.Vector.random2D().mult(speed);
      this.size = size;
      this.color = color(random(100, 255), random(100, 255), random(100, 255));
    }

    update() {
      this.pos.add(this.vel);
    }

    display() {
      fill(this.color);
      noStroke();
      ellipse(this.pos.x, this.pos.y, this.size, this.size);
    }

    resize(newSize) {
      this.size = newSize;
    }

    isOffscreen() {
      return (
        this.pos.x < 0 ||
        this.pos.x > width ||
        this.pos.y < 0 ||
        this.pos.y > height
      );
    }
  }

  function setupMicVisualization() {
    mic = new p5.AudioIn();
    mic.start();
    fft = new p5.FFT();
    fft.setInput(mic);
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, CENTER);
    textSize(100);
    textStyle(BOLD);
  }

  function drawMicVisualization() {
    background(0);

    // Cosmic Breath visualization
    let spectrum = fft.analyze();

    // Adjust the number of particles based on the volume of sound input
    let numParticles = map(mic.getLevel(), 0, 1, 1, 5); // Modify the range for fewer particles

    // Create new particles based on the spectrum data
    for (let i = 0; i < numParticles; i++) {
      let index = floor(map(i, 0, numParticles, 0, spectrum.length - 1));
      let freq = spectrum[index];

      // Adjust particle properties based on the frequency
      let size = map(freq, 0, 255, 10, 100);
      let speed = map(freq, 0, 255, 0.5, 5);

      micParticles.push(new MicParticle(width / 2, height / 2, size, speed));
    }

    // Update and display particles
    for (let i = micParticles.length - 1; i >= 0; i--) {
      micParticles[i].update();
      micParticles[i].display();

      // Change the size of existing particles based on sound input
      let index = floor(map(i, 0, micParticles.length - 1, 0, spectrum.length - 1));
      let freq = spectrum[index];
      let newSize = map(freq, 0, 255, 10, 100);
      micParticles[i].resize(newSize);

      // Remove particles that move off-screen
      if (micParticles[i].isOffscreen()) {
        micParticles.splice(i, 1);
      }
    }
  }

  setupMicVisualization();
  drawMicVisualization();
  requestAnimationFrame(animateMicParticles);
}
