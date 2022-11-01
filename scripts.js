// Variables
const tracksContainer = document.querySelector(".tracks");
const metronome = document.querySelector(".metronome");
const bpmInput = document.getElementById("bpmInput");
const tracks = [];
const players = [];
const loops = [];
let metronomeLoop;

// Functions
function updateBPM(bpmValue) {
  Tone.Transport.bpm.value = bpmValue;
}

function startRecording(event) {
  Tone.start();

  const recorder = new Tone.Recorder();
  const mic = new Tone.UserMedia().connect(recorder);

  const button = event.target


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
  track.id = `track-${tracks.length}`
  track.innerHTML = `
    <button class="recordButton" onclick="startRecording(event)" data-id="${tracks.length}">Record</button>
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
  tracks.push(track)
  tracksContainer.append(track)
  listAvailableInputs()
}

function startMetronome() {
  metronomeLoop = new Tone.Loop(() => {
    metronome.classList.toggle("on")
  }, "0:1:0").start(0)
}

function initialize() {
  Tone.Transport.bpm.value = bpmInput.value;
  createNewTrack();
  startMetronome();
}

initialize()

// Events
bpmInput.addEventListener("change", e => {
  updateBPM(e.target.value)
})