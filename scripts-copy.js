initialized = false
let mic, recorder, player

// Interface
const recBtn = document.getElementById("start_btn")
const playBtn = document.getElementById("play_btn")

// Disable the rec button if UserMedia is not supported
recBtn.disabled = !Tone.UserMedia.supported

// Rec / Stop
recBtn.addEventListener("click", async () => {
  Tone.context.resume(); // https://github.com/Tonejs/Tone.js/issues/341

  // Initialization
  if (!initialized) {
    mic = new Tone.UserMedia();
    recorder = new Tone.Recorder();
    mic.connect(recorder);
    mic.open();
    initialized = true;
  }

  if (recBtn.innerText == "Stop") {
    var data = await recorder.stop();
    var blobUrl = URL.createObjectURL(data);
    player = new Tone.Player(blobUrl, () => {
      playBtn.disabled = false;
    }).toDestination();
    recBtn.innerText = "Record";
  } else {
    recorder.start();
    recBtn.innerText = "Stop";
  }
});

// Play / Stop
playBtn.addEventListener("click", () => {
  if (playBtn.innerText == "Stop") {
    player.stop();
    playBtn.innerText = "Play";
  } else {
    player.loop = true;
    player.start();
    playBtn.innerText = "Stop";
  }
});
