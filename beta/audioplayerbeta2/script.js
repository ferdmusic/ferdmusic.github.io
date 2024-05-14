const githubColors = [
  // '#f6f8fa', // Canvas
  '#0366d6', // Primary
  '#24292e', // Text
  '#586069', // Secondary
  // '#a8bbd0', // Meta
  // '#959da5', // Icon
  // '#e1e4e8', // Border
  // '#f6f8fa', // Bg
  '#0366d6', // Link text
  '#28a745', // Success
  '#22863a', // Success dark
  '#40c463', // Success light
  '#cb2431', // Danger
  '#b31d28', // Danger dark
  '#f97583', // Danger light
  '#f9826c', // Orange
  '#975fd7', // Purple
  '#6f42c1', // Purple dark
  '#b392f0', // Purple light
];

function formatTimecode(seconds) {
  let minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Funktion zum Abrufen der Liste der Audiodateien
async function getAudioFiles() {
  const response = await fetch('assets/audio/audiofiles.json');
  const files = await response.json();
  const filesWithPath = files.map(file => `assets/audio/${file}`);
  return filesWithPath;
}

// Funktion zum Erstellen der Songliste
async function createSongList() {
  const files = await getAudioFiles();
  const songs = files.map((file, index) => {
    // Extract the filename without the extension for the title
    let title = file.split('/').pop().split('.').slice(0, -1).join('.');
    return {
      src: file,
      artist: 'Ferdmusic', // Set the artist name to 'Ferdmusic'
      title: title // Set the title to the filename without the extension
    };
  });
  return songs;
}

// Verwenden Sie die erstellte Songliste
createSongList().then(songs => {
  let container = document.querySelector('.container'); // Define container here

  // Erstellen Sie für jeden Song einen Player
  songs.forEach((song, index) => {
    // Erstellen Sie ein neues div-Element für den Player
    let player = document.createElement('div');
    player.className = 'audio-player';
    player.id = 'player' + index; // Geben Sie jedem Player eine eindeutige ID

    // Fügen Sie den HTML-Inhalt zum Player hinzu
    player.innerHTML = `
      <button id="playButton${index}" class="play-button">
          <img id="playButtonIcon${index}" class="play-button-icon" src="assets/icons/play.svg" alt="Play Button" />
      </button>
      <div class="player-body">
          <p class="title">${song.artist} - ${song.title}</p>
          <div id="waveform${index}" class="waveform"></div>
          <div class="controls">
              <div class="volume">
                  <img id="volumeIcon${index}" class="volume-icon" src="assets/icons/volume.svg" alt="Volume" />
                  <input id="volumeSlider${index}" class="volume-slider" type="range" name="volume-slider" min="0" max="100" value="50" />
              </div>
              <div class="timecode">
                  <span id="currentTime${index}">00:00:00</span>
                  <span>/</span>
                  <span id="totalDuration${index}">00:00:00</span>
              </div>
          </div>
      </div>
    `;

    // Fügen Sie den Player zum Hauptcontainer hinzu
    container.appendChild(player);
  });

  // Initialisieren Sie wavesurfer.js für jeden Player
  songs.forEach((song, index) => {
    const randomColorIndex = Math.floor(Math.random() * githubColors.length);
    const randomColor = githubColors[randomColorIndex];
    let wavesurfer = WaveSurfer.create({
      container: '#waveform' + index,
      waveColor: randomColor,
      progressColor: randomColor
    });

    wavesurfer.load(song.src);

    let playButton = document.querySelector('#playButton' + index);
    let playButtonIcon = document.querySelector('#playButtonIcon' + index);
    let volumeIcon = document.querySelector('#volumeIcon' + index);
    let volumeSlider = document.querySelector('#volumeSlider' + index);
    let currentTime = document.querySelector('#currentTime' + index);
    let totalDuration = document.querySelector('#totalDuration' + index);

    playButton.addEventListener('click', function () {
      wavesurfer.playPause();

      const isPlaying = wavesurfer.isPlaying();

      if (isPlaying) {
        playButtonIcon.src = 'assets/icons/pause.svg';
      } else {
        playButtonIcon.src = 'assets/icons/play.svg';
      }
    });

    volumeIcon.addEventListener('click', function () {
      wavesurfer.toggleMute();

      const isMuted = wavesurfer.getMute();

      if (isMuted) {
        volumeIcon.src = 'assets/icons/mute.svg';
        volumeSlider.disabled = true;
      } else {
        volumeSlider.disabled = false;
        volumeIcon.src = 'assets/icons/volume.svg';
      }
    });

    volumeSlider.addEventListener('input', function (e) {
      const volume = e.target.value / 100;
      wavesurfer.setVolume(volume);
      localStorage.setItem('audio-player-volume', volume);
    });

    wavesurfer.on('ready', () => {
      wavesurfer.setVolume(volumeSlider.value / 100);
      const duration = wavesurfer.getDuration();
      totalDuration.innerHTML = formatTimecode(duration);
    });

    wavesurfer.on('audioprocess', () => {
      const time = wavesurfer.getCurrentTime();
      currentTime.innerHTML = formatTimecode(time);
    });

    wavesurfer.on('finish', () => {
      playButtonIcon.src = 'assets/icons/play.svg';
    });
  });
});

