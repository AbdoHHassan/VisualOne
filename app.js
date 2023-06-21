window.onload = function() {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    const video = document.getElementById('myVideo');
    const startButton = document.getElementById('startButton');
    const imageContainer = document.getElementById('imageContainer');
    const messageContainer = document.getElementById('messageContainer');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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
            // Adjust particle position to stay within the image container
            if (this.x < imageContainer.offsetLeft + this.size || this.x > imageContainer.offsetLeft + imageContainer.offsetWidth - this.size) {
                this.speedX *= -1;
            }
            if (this.y < imageContainer.offsetTop + this.size || this.y > imageContainer.offsetTop + imageContainer.offsetHeight - this.size) {
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

    createParticles();

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    startButton.addEventListener('mousedown', function() {
        startButton.classList.add('fade-out');
        video.style.display = 'block';
        canvas.style.display = 'block';
        video.play();
        animateParticles();
        imageContainer.classList.add('fade-out');
        
        // Audio input
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            const audioContext = new AudioContext();
            const audioInput = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            const FFT_SIZE = 64;
            analyser.fftSize = FFT_SIZE;

            audioInput.connect(analyser);

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            function updateParticles() {
                analyser.getByteFrequencyData(dataArray);

                let average = dataArray.reduce((a, b) => a + b) / bufferLength;

                // Increase the scale of the particle size mapping
                let newSize = map(average, 0, 255, 5, 100);

                // Increase the scale of the particle speed mapping
                let newSpeed = map(average, 0, 255, 0.5, 2);

                for (let i = 0; i < particles.length; i++) {
                    particles[i].size = newSize;
                    particles[i].speedX = Math.random() * newSpeed - newSpeed / 2;
                    particles[i].speedY = Math.random() * newSpeed - newSpeed / 2;
                }

                requestAnimationFrame(updateParticles);
            }

            updateParticles();
        })
        .catch(function(err) {
            console.log('Audio input error: ' + err);
        });
    });

    // Speech recognition
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.lang = 'en-US';

        recognition.onresult = function(event) {
            const spokenText = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
            processSpeech(spokenText);
        };

        recognition.start();
    } else {
        console.log('Speech recognition not supported');
    }

    const phrases = {
        'joy': 'LET US MEDITATE ON A CRITICAL JOY',
        'poetry': 'POETRY THAT CAN NO LONGER REMAIN A LUXURY',
        'community': 'COMMUNITY IS THE ONLY PLAN',
        'time clocks': "THE TIME CLOCKS OF AI RUN ON COLONIAL TIME",
        'quicksand': 'A BLURRY JPEG OF CONCEPTUAL QUICKSAND'

        // Add more phrases and corresponding words as needed
    };

    function processSpeech(spokenText) {
        for (const word in phrases) {
            if (spokenText.includes(word)) {
                showMessage(phrases[word]);
                break;
            }
        }
    }

    function showMessage(message) {
        messageContainer.textContent = message;
        messageContainer.classList.add('fade-in');
        setTimeout(function() {
            messageContainer.classList.remove('fade-in');
        }, 5000); // Show message for 3 seconds
    }

    function map(value, in_min, in_max, out_min, out_max) {
        return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }
};
