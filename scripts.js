// Variables
const tracksContainer = document.querySelector(".tracks");
const players = [];
const loops = [];

// Functions
function updateBPM(bpmValue) {
  Tone.Transport.bpm.value = bpmValue;
}

function startRecording(event) {
  Tone.start();

  const recorder = new Tone.Recorder();
  const mic = new Tone.UserMedia().connect(recorder);

  mic
    .open()
    .then(() => {
      recorder.start();

      Tone.Transport.schedule((time) => {
        recorder.stop().then((blob) => {
          const url = URL.createObjectURL(blob);
          const player = new Tone.Player(url).toDestination();
          const loop = new Tone.Loop((time) => {
            player.start(time);
          }, "1:0:0").start(Tone.now());

          players.push(player);
          loops.push(loop);
        });
      }, "1:0:0");

      Tone.Transport.start();
    })
    .catch((e) => {
      console.log("mic not open");
    });
}

function loadInputs(select) {
  Tone.UserMedia.enumerateDevices().then((devices) => {
    const html = devices.map((device) => {
        return `<option value="${device.deviceId}">${device.label}</option>`;
      }).join("");

    select.innerHTML = html;
  });
}

function listAvailableInputs() {
  document.querySelectorAll(".selectInputDevice").forEach(select => {
    if (!select.classList.contains("initialized")) {
      loadInputs(select);
      select.classList.add("initialized");
    }
  })
}

function getTrackHTML() {
  const track = document.createElement("div")
  track.className = "track"
  track.innerHTML = `
    <button class="recordButton" onclick="startRecording(event)">Record</button>
    <select class="selectInputDevice" name="selectInputDevice">
      <option>Choose your device...</option>
    </select>
    <label>Bars</label>
    <input type="number" value="1" class="numberOfBars">
    <progress value="0" max="100"></progress>
  `;
  return track
}

function createNewTrack() {
  const track = getTrackHTML()
  tracksContainer.append(track)
  listAvailableInputs()
}

Tone.Transport.bpm.value = bpmInput.value;

createNewTrack()

// startButton.addEventListener("click", startMetronome);
// pauseButton.addEventListener("click", pauseMetronome);
// bpmInput.addEventListener("change", (e) => updateBPM(e.target.value));
// recordButton.addEventListener("click", startRecording);

// getDeviceOptionsHTML();