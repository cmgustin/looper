// Variables
const tracksContainer = document.querySelector(".tracks");
const metronome = document.querySelector(".metronome");
const bpmInput = document.getElementById("bpmInput");
const tracks = [];
const players = [];
const loops = [];

// Functions
function play() {
  Tone.Transport.start()
}

function pausePlayback() {
  Tone.Transport.pause()
}

function stopPlayback() {
  Tone.Transport.stop()
}

function updateBPM(bpmValue) {
  Tone.Transport.bpm.value = bpmValue;
}

function startRecording(event) {
  Tone.start();

  const recorder = new Tone.Recorder();
  const mic = new Tone.UserMedia().connect(recorder);

  const button = event.target
  const trackId = event.target.dataset.id
  const inputSource = document.querySelector(`#track-${trackId} .selectInputDevice`).value;
  const numberOfBars = document.querySelector(`#track-${trackId} .numberOfBars`).value;
  const numberOfBarsConverted = Tone.Time(numberOfBars * 2).toBarsBeatsSixteenths()
  const progressBar = document.querySelector(`#track-${trackId} .progress`)

  mic
    .open(inputSource)
    .then(() => {
      recorder.start();

      Tone.Transport.scheduleRepeat(time => {
        const timeArray = Tone.Time(time).toBarsBeatsSixteenths().split(":");
        const bars = timeArray[0]
        const beats = timeArray[1]

        if (bars % numberOfBars == 0 && beats == 0) {
          progressBar.innerHTML = "[]"
        } else {
          progressBar.innerHTML += "[]"
        }

      }, "0:1:0")

      Tone.Transport.schedule((time) => {
        recorder.stop().then((blob) => {
          const url = URL.createObjectURL(blob);
          const player = new Tone.Player(url).toDestination();
          const loop = new Tone.Loop((time) => {
            player.start(time);
          }, numberOfBarsConverted).start(Tone.now());

          players.push(player);
          loops.push(loop);
        });
      }, numberOfBarsConverted);

      Tone.Transport.start();
    })
    .catch((e) => {
      console.log("mic not open");
    });
}

function loadAvailableInputs(select) {
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
      loadAvailableInputs(select);
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
    <span class="progress"></span>
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
  Tone.Transport.scheduleRepeat(() => {
    metronome.classList.toggle("on")
  }, "4n")
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