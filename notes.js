const fullText = `eh, santai… gua nggak ngilang kok, cuma pura-pura sibuk biar keliatan misterius padahal mah au sibuk ngapain.

Abis kemarin gua nanya hal nggak jelas itu, gua pikir mending gua kasih lu ruang dulu biar nggak cape mikir. Takutnya kalau gua nongol mulu lu bosen… kayak minum es teh manis, manisnya pas, nggak kebanyakan kaya lu, wkwkwk punchlinenya ga jelas jir

Jadi gua diem sebentar, bukan berarti nggak peduli. Justru biar lu kangen gua dikit hahaha padahal mah engga tapi kalo kangen mah bilang wkwkwkwk

tapi, gua masih di sini. tenang aja, nggak ke mana-mana. cuma lagi balikin jadi kaya yang dulu biar lu ga mager liat notif gua.`;

const output = document.getElementById("output");
const playPauseBtn = document.getElementById("playPauseBtn");
const charCount = document.getElementById("charCount");

let index = 0;
let interval = null;
let paused = true;
let finished = false;

function updateCharCount() {
  charCount.textContent = `${index}/${fullText.length} chars`;
}

function typeWriter() {
  if (!paused && index < fullText.length) {
    output.textContent += fullText.charAt(index);
    index++;
    updateCharCount();

    // Scroll ke bawah otomatis selama mengetik
    output.scrollTop = output.scrollHeight;

    if (index >= fullText.length) {
      clearInterval(interval);
      interval = null;
      playPauseBtn.textContent = "▶ PLAY";
      paused = true;
      finished = true;

      // Aktifkan scroll setelah selesai
      output.style.overflowY = "auto";
    }
  }
}

function togglePause() {
  if (finished) {
    // Reset semua
    index = 0;
    output.textContent = "";
    finished = false;
    output.style.overflowY = "hidden"; // Sembunyikan scroll lagi
  }

  paused = !paused;
  playPauseBtn.textContent = paused ? "▶ PLAY" : "⏸ PAUSE";

  if (!paused && !interval) {
    interval = setInterval(typeWriter, 50);
  } else if (paused && interval) {
    clearInterval(interval);
    interval = null;
  }
}

function skipText() {
  clearInterval(interval);
  interval = null;
  output.textContent = fullText;
  index = fullText.length;
  updateCharCount();
  playPauseBtn.textContent = "▶ PLAY";
  paused = true;
  finished = true;

  // Aktifkan scroll langsung
  output.style.overflowY = "auto";
  output.scrollTop = output.scrollHeight;
}

// Inisialisasi awal
output.style.overflowY = "hidden";
updateCharCount();
