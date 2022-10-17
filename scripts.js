initialized = false;
let mic, recorder, player;
let players = new Tone.Players()
players.toDestination()

// Rec / Stop
const recordButtons = document.querySelectorAll(".record")
const playButtons = document.querySelectorAll(".play")

recordButtons.forEach((button, index) => button.addEventListener("click", async () => {
  Tone.context.resume(); // https://github.com/Tonejs/Tone.js/issues/341

  // Initialization
  if (!initialized) {
    mic = new Tone.UserMedia();
    recorder = new Tone.Recorder();

    mic.connect(recorder);
    mic.open();

    initialized = true;
  }

  if (button.innerText == "Stop") {
    const data = await recorder.stop();
    const blobUrl = URL.createObjectURL(data);

    players.add(index, blobUrl);
    button.innerText = "Record";
  } else {
    recorder.start();
    button.innerText = "Stop";
  }
}));

// Play / Stop
playButtons.forEach((button, index) => button.addEventListener("click", () => {
  if (button.innerText == "Stop") {
    players.player(index).stop()
    button.innerText = "Play";
  } else {
    players.player(index).loop = true
    players.player(index).start()
    button.innerText = "Stop";
  }
}));
