window.onload = function() {
  let currentScene = 'particles';

  function toggleScene() {
    if (currentScene === 'particles') {
      currentScene = 'mic';
      document.getElementById('myCanvas').style.display = 'none';
      document.getElementById('myVideo').style.display = 'none';
      document.getElementById('imageContainer').style.display = 'none';
      document.dispatchEvent(new CustomEvent('sceneChange', { detail: currentScene }));
    } else {
      currentScene = 'particles';
      document.getElementById('myCanvas').style.display = 'block';
      document.getElementById('myVideo').style.display = 'block';
      document.getElementById('imageContainer').style.display = 'block';
      document.dispatchEvent(new CustomEvent('sceneChange', { detail: currentScene }));
    }
  }

  // Keyboard event listener to switch scenes
  document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
      toggleScene();
    }
  });

  // Speech recognition
  if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';

    recognition.onresult = function(event) {
      const spokenText = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      document.dispatchEvent(new CustomEvent('speechRecognition', { detail: spokenText }));
    };

    recognition.start();
  } else {
    console.log('Speech recognition not supported');
  }
};
