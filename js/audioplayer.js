var audio = document.getElementById("myAudio");
audio.preload = "auto";
var audioSource = document.getElementById("audioSource");
var currentSongIndex = 0;
var songs = [
    "audiofiles/MusioSoundOff.ogg",
    "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/1.mp3",
    "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/3.mp3",
    "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/4.mp3",
    "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/5.mp3"
];

function toggleMenu() {
    var x = document.getElementById("navbar");
    if (x.className === "navbar") {
        x.className += " responsive";
    } else {
        x.className = "navbar";
    }
}

function playAudio() {
    audio.play();
}

function pauseAudio() {
    audio.pause();
}

function previousSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playCurrentSong();
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playCurrentSong();
}

function playSong(index) {
    currentSongIndex = index;
    playCurrentSong();
}

function playCurrentSong() {
    audioSource.src = songs[currentSongIndex];
    audio.load();
    audio.play();
    highlightCurrentSong();
}

function highlightCurrentSong() {
    var tracklistItems = document.querySelectorAll("#tracklist li");
    tracklistItems.forEach(function(item, index) {
        if (index === currentSongIndex) {
            item.classList.add("highlight");
        } else {
            item.classList.remove("highlight");
        }
    });
}

function updateProgressBar() {
    var progressBar = document.getElementById("progressBar");
    var additionalProgressBar = document.getElementById("additionalProgressBar");
    var timeDisplay = document.getElementById("timeDisplay");

    var percentage = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = percentage + "%";
    additionalProgressBar.style.width = percentage + "%";

    var currentTime = formatTime(audio.currentTime);
    var duration = formatTime(audio.duration);
    timeDisplay.textContent = currentTime + " / " + duration;

    // Aktualisiere die Position der Zeitanzeige
    var progressContainer = document.querySelector('.progress-container');
    var rect = progressContainer.getBoundingClientRect();
    var timeDisplayPosition = (percentage * rect.width) / 100;
    timeDisplay.style.left = rect.left + timeDisplayPosition + "px";
}

function seek(e) {
    var progressBar = document.querySelector('.progress-container');
    var rect = progressBar.getBoundingClientRect();
    var x = e.clientX - rect.left; // x position within the element.
    var width = rect.right - rect.left; // width of the element.
    var percent = x / width;
    audio.currentTime = percent * audio.duration;
    updateProgressBar();
}

function showTooltip(event) {
    var progressBar = document.querySelector('.progress-container');
    var additionalProgressBar = document.getElementById("additionalProgressBar");
    var tooltip = document.getElementById("tooltip");
    var percent = event.offsetX / progressBar.offsetWidth;
    var time = formatTime(percent * audio.duration);
    tooltip.textContent = time;
    tooltip.style.display = "block";

    // Setze die Breite der zusätzlichen Fortschrittsleiste entsprechend der Mausposition
    additionalProgressBar.style.width = event.offsetX + "px";

    // Positionierung des Tooltips
    tooltip.style.left = event.pageX - tooltip.offsetWidth / 2 + "px";
    //tooltip.style.top = progressBar.offsetTop - tooltip.offsetHeight - 10 + "px"; // 10px Abstand
}

function hideTooltip() {
    var tooltip = document.getElementById("tooltip");
    tooltip.style.display = "none";
}

function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

// Fügen Sie dem additionalProgressBar das mouseleave-Event hinzu
// Fügen Sie dem progressBar das mouseenter- und mouseleave-Event hinzu
var progressContainer = document.querySelector('.progress-container');
progressContainer.addEventListener("mouseenter", showAdditionalProgressBar);
progressContainer.addEventListener("mouseleave", hideAdditionalProgressBar);

// Neue Funktion, um den zusätzlichen Fortschrittsbalken anzuzeigen
function showAdditionalProgressBar() {
    var additionalProgressBar = document.getElementById("additionalProgressBar");
    additionalProgressBar.style.opacity = 1; // Stelle sicher, dass der Fortschrittsbalken sichtbar ist
}

// Neue Funktion, um den zusätzlichen Fortschrittsbalken zu verbergen
function hideAdditionalProgressBar() {
    var additionalProgressBar = document.getElementById("additionalProgressBar");
    additionalProgressBar.style.opacity = 0; // Stelle sicher, dass der Fortschrittsbalken unsichtbar ist
}

var isDragging = false;

function seekStart(event) {
    isDragging = true;
    seek(event);
}

function seekEnd() {
    if (isDragging) {
        isDragging = false;
        audio.play(); // Fortsetzen der Wiedergabe, wenn das Ziehen abgeschlossen ist
    }
}

function seekDrag(event) {
    if (isDragging) {
        seek(event);
    }
}



progressContainer.addEventListener("mousedown", seekStart);
progressContainer.addEventListener("mousemove", seekDrag);
progressContainer.addEventListener("mouseup", seekEnd);
progressContainer.addEventListener("mouseleave", seekEnd);
