const audio = document.getElementById("audioPlayer");
const playlistContainer = document.getElementById("playlist");
const musicTitle = document.getElementById("musicTitle");
const musicArtist = document.getElementById("musicArtist");
const playPauseIcon = document.getElementById("playPauseIcon");

let currentTrack = 0;

// Data Playlist
const playlistData = [
    {
        title: "Dna",
        artist: "Lagu • Lany",
        file: "Lany - dna.mp3",
        duration: "02:57",
        cover: "coverlanydna.jpg"
    },
    {
        title: "Out Of My League",
        artist: "Lagu • Lany",
        file: "Lany - Out Of My League.mp3",
        duration: "03:26",
        cover: "coverlanyml.png"
    },
    {
        title: "Open Arms",
        artist: "sza, travis scott",
        file: "open arms sza.mp3",
        duration: "03:36",
        cover: "cover open arms.jpg"
    }
];


// Buat Playlist
playlistData.forEach((song, index) => {
    const item = document.createElement('div');
    item.className = 'playlist-item';
    item.innerHTML = `
        <div class="song-info">
            <div class="song-title">${song.title}</div>
            <div class="song-artist">${song.artist}</div>
        </div>
        <div class="song-duration">${song.duration}</div>
    `;
    item.onclick = () => playSong(index);
    playlistContainer.appendChild(item);
});

// Fungsi Play Lagu
function playSong(index) {
    currentTrack = index;
    audio.src = playlistData[index].file;
    audio.play();
    updatePlayIcon(true);

    musicTitle.textContent = playlistData[index].title;
    musicArtist.textContent = playlistData[index].artist;

    // 👉 Ganti cover art-nya
    document.getElementById("coverArt").src = playlistData[index].cover;
}


// Fungsi Toggle Play/Pause
function togglePlay() {
    if (!audio.src) {
        playSong(currentTrack);
        return;
    }
    if (audio.paused) {
        audio.play();
        updatePlayIcon(true);
    } else {
        audio.pause();
        updatePlayIcon(false);
    }
}

// Update Icon Play/Pause
function updatePlayIcon(isPlaying) {
    playPauseIcon.src = isPlaying ? "pause1.png" : "playmusic.png";
}

// Next & Previous
function nextTrack() {
    currentTrack = (currentTrack + 1) % playlistData.length;
    playSong(currentTrack);
}

function prevTrack() {
    currentTrack = (currentTrack - 1 + playlistData.length) % playlistData.length;
    playSong(currentTrack);
}

// Auto Next Saat Lagu Habis
audio.onended = nextTrack;

// Set Volume Awal
audio.volume = 0.5;

const progressBar = document.getElementById("progressBar");
const currentTimeDisplay = document.getElementById("currentTime");
const totalTimeDisplay = document.getElementById("totalTime");

// Saat metadata lagu siap (durasi total)
audio.addEventListener("loadedmetadata", () => {
    progressBar.max = Math.floor(audio.duration);
    totalTimeDisplay.textContent = formatTime(audio.duration);
});

// Saat lagu diputar, update progress bar dan waktu
audio.addEventListener("timeupdate", () => {
    if (!progressBar.dragging) { // Cegah update saat user lagi geser
        progressBar.value = Math.floor(audio.currentTime);
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
    }
});

// Saat user geser progress bar
progressBar.addEventListener("input", () => {
    progressBar.dragging = true;
    currentTimeDisplay.textContent = formatTime(progressBar.value);
});

// Saat selesai geser, set waktu lagu
progressBar.addEventListener("change", () => {
    audio.currentTime = progressBar.value;
    progressBar.dragging = false;
});

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

const progressContainer = document.querySelector(".progress-container");
const progressFill = document.getElementById("progressBar");

let isDragging = false;

// Update waktu saat audio berjalan, hanya jika tidak sedang geser
audio.addEventListener("timeupdate", () => {
    if (!isDragging) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${progressPercent}%`;
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
    }
});

// Tampilkan total durasi lagu saat sudah siap
audio.addEventListener("loadedmetadata", () => {
    totalTimeDisplay.textContent = formatTime(audio.duration);
});

// Saat mouse klik di progress bar
progressContainer.addEventListener("mousedown", (e) => {
    isDragging = true;
    updateProgressBar(e);
});

// Saat mouse digerakkan sambil ditekan
progressContainer.addEventListener("mousemove", (e) => {
    if (isDragging) {
        updateProgressBar(e);
    }
});

// Saat mouse dilepas
document.addEventListener("mouseup", (e) => {
    if (isDragging) {
        isDragging = false;
        const rect = progressContainer.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const width = progressContainer.clientWidth;
        const newTime = (offsetX / width) * audio.duration;
        audio.currentTime = newTime;
    }
});

// Fungsi update progress bar putih saat digeser
function updateProgressBar(e) {
    const rect = progressContainer.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = progressContainer.clientWidth;
    const percentage = Math.max(0, Math.min(offsetX / width, 1));
    progressFill.style.width = `${percentage * 100}%`;
    
    const tempTime = percentage * audio.duration;
    currentTimeDisplay.textContent = formatTime(tempTime);
}

