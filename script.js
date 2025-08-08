const audio = document.getElementById("audioPlayer");
const volumeSlider = document.getElementById("volumeSlider");
const playIcon = document.getElementById("playIcon");

const openBtn = document.querySelector(".open-btn");
const seekSlider = document.getElementById("seekSlider");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

audio.volume = 0.5;

// Daftar lagu
const songs = [
    { title: "Lagu 1", src: "LANY - dna.mp3" },
    { title: "Lagu 2", src: "LANY - Out Of My League.mp3" },
    { title: "Lagu 3", src: "open arms sza.mp3" }
];

let currentSongIndex = 0;
let autoReplyStep = 0;
let galleryMode = false;

// Volume slider
volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value;
    updateSliderColor();
});

function updateSliderColor() {
    const value = volumeSlider.value * 100;
    volumeSlider.style.backgroundImage = `
        linear-gradient(to right, #ffffff 0%, #ffffff ${value}%, #ccc ${value}%, #ccc 100%)
    `;
}
updateSliderColor();

// Play/Pause
function togglePlayPause() {
    if (!audio.src) {
        loadAndPlaySong();
        return;
    }

    if (audio.paused || audio.ended) {
        audio.play()
            .then(() => playIcon.src = "pause.png")
            .catch(err => console.error("Play error:", err));
    } else {
        audio.pause();
        playIcon.src = "play.png";
    }
}

// Prev/Next
function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadAndPlaySong();
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadAndPlaySong();
}

// Load dan putar lagu
function loadAndPlaySong() {
    audio.src = songs[currentSongIndex].src;
    audio.load();
    audio.play()
        .then(() => playIcon.src = "pause.png")
        .catch(err => {
            console.error("Play error:", err);
            alert("Gagal memutar lagu. Pastikan file MP3-nya ada.");
        });
}

// Waktu & Seekbar
audio.addEventListener("loadedmetadata", () => {
    seekSlider.max = audio.duration;
    durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    seekSlider.value = audio.currentTime;
    currentTimeEl.textContent = formatTime(audio.currentTime);
});

seekSlider.addEventListener("input", () => {
    audio.currentTime = seekSlider.value;
});

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Fitur chat
function addMessage(text, side) {
    const messageList = document.getElementById("message-list"); // ambil langsung saat fungsi dipanggil
    const message = document.createElement("div");
    message.className = `message ${side}`;
    const time = new Date();
    const timeText = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`;
    message.innerHTML = `<div>${text}</div><span class="time">${timeText}</span>`;
    messageList.appendChild(message);
    messageList.scrollTop = messageList.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById("inputMessage");
    const text = input.value.trim();
    if (text) {
        
        addMessage(text, 'right');
        input.value = "";

        setTimeout(() => {
            if (autoReplyStep === 0) {
                addMessage("iiikan eluu wkwkwk", 'left');
                autoReplyStep++;
            } else if (autoReplyStep === 1) {
                addMessage("hhaha gombal bet, coba pencet liat galeri dah, ^_^", 'left');
                autoReplyStep++;
                openBtn.textContent = "Lihat Galeri";
                openBtn.onclick = () => window.location.href = "galeri.html";
            }
        }, 500);
    }
}

// Trigger input
function triggerInput() {
    if (galleryMode) {
        openGallery();
    } else {
        document.getElementById("inputMessage").focus();
    }
}

// Buka galeri (override halaman)
function openGallery() {
    document.body.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; background:#000;">
            <img src="gambar1.jpg" alt="Foto Galeri" style="max-width:90%; border:5px solid white; border-radius:10px;">
            <p style="color:white; font-family:'Silkscreen',cursive; font-size:18px; margin-top:20px;">Ini Galeri Kamu!</p>
        </div>
    `;                                                    
}               

document.addEventListener("DOMContentLoaded", () => {
    console.log("Halaman siap");
    addMessage("tau ga la ikan ikan apa yang lucu?", 'left');

    
});




