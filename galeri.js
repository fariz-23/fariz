// Ambil elemen
const thumbnails = document.querySelectorAll('.galeri img');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const titleText = document.getElementById('photoTitle');
const counterText = document.getElementById('photoCounter');

let currentIndex = 0;

// Klik thumbnail
thumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
        openLightbox(index);
    });
});

// Buka lightbox
function openLightbox(index) {
    currentIndex = index;
    lightbox.style.display = 'flex';
    updateLightboxContent();
}

// Update isi lightbox
function updateLightboxContent() {
    lightboxImage.src = thumbnails[currentIndex].src;
    titleText.textContent = `Foto ${currentIndex + 1}`;
    counterText.textContent = `${currentIndex + 1} / ${thumbnails.length}`;
}

// Tutup lightbox
function closeLightbox() {
    lightbox.style.display = 'none';
}

// Navigasi foto
function prevImage() {
    currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
    updateLightboxContent();
}

function nextImage() {
    currentIndex = (currentIndex + 1) % thumbnails.length;
    updateLightboxContent();
}

