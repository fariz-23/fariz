const thumbnails = document.querySelectorAll('.galeri img');
const lightbox = document.getElementById('lightbox');
const lightboxVideo = document.getElementById('lightboxVideo');
const videoTitle = document.getElementById('videoTitle');
const videoCounter = document.getElementById('videoCounter');
const playPauseButton = document.getElementById('playPauseButton');
const playPauseIcon = document.getElementById('playPauseIcon');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const lightboxArea = document.querySelector('.lightbox-image-box');

let currentIndex = 0;
let hideTimeout;
let controlsVisible = true;

function showControls() {
    playPauseButton.classList.remove('hidden');
    prevButton.classList.remove('hidden');
    nextButton.classList.remove('hidden');
    controlsVisible = true;
}

function hideControls() {
    playPauseButton.classList.add('hidden');
    prevButton.classList.add('hidden');
    nextButton.classList.add('hidden');
    controlsVisible = false;
}


function resetHideControlsTimer() {
    clearTimeout(hideTimeout);
    showControls();
    hideTimeout = setTimeout(() => {
        hideControls();
    }, 2000);
}

// Buka lightbox
thumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
        openLightbox(index);
    });
});

function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    resetHideControlsTimer();
}

function closeLightbox() {
    lightbox.style.display = 'none';
    lightboxVideo.pause();
    lightboxVideo.currentTime = 0;
    document.body.style.overflow = '';
}

function updateLightbox() {
    const videoSrc = thumbnails[currentIndex].dataset.video;
    lightboxVideo.src = videoSrc;
    lightboxVideo.volume = 1;         // Tambahkan ini
    lightboxVideo.play();
    videoTitle.textContent = `Video ${currentIndex + 1}`;
    videoCounter.textContent = `${currentIndex + 1} / ${thumbnails.length}`;
    playPauseIcon.src = 'pause1.png'; // Default ke pause karena langsung play
}


// Tombol play/pause
playPauseButton.addEventListener('click', (e) => {
    e.stopPropagation();
    if (lightboxVideo.paused) {
        lightboxVideo.play();
        playPauseIcon.src = 'pause1.png';
    } else {
        lightboxVideo.pause();
        playPauseIcon.src = 'play1.png';
    }
    resetHideControlsTimer();
});

// Tombol prev/next
prevButton.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
    updateLightbox();
});

nextButton.addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % thumbnails.length;
    updateLightbox();
});

// Klik layar: toggle show/hide kalau klik bukan tombol
lightboxArea.addEventListener('click', (e) => {
    const isControl = e.target.closest('.center-button, .side-button');
    if (!isControl) {
        if (controlsVisible) {
            hideControls();
            clearTimeout(hideTimeout);
        } else {
            showControls();
            resetHideControlsTimer();
        }
    }
});
