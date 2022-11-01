const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const output = document.getElementById("output");
const bpmInput = document.getElementById("bpm");
const recordButton = document.getElementById("record");
const playButton = document.getElementById("play");
const deviceSelect = document.getElementById("deviceSelect");

const players = [];
const loops = [];

Tone.Transport.bpm.value = bpmInput.value;

const loop1 = new Tone.Loop((time) => {
  console.log(Tone.Time(time).toBarsBeatsSixteenths());
}, "0:1:0").start(0);

function startMetronome() {
  Tone.start();
  Tone.Transport.start();
}

function pauseMetronome() {
  Tone.Transport.pause();
}

function updateBPM(bpm) {
  Tone.Transport.bpm.value = bpm;
}

function startRecording() {
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

function getDeviceOptionsHTML() {
  Tone.UserMedia.enumerateDevices().then((devices) => {
    const html = devices
      .map((device) => {
        return `<option value="${device.deviceId}">${device.label}</option>`;
      })
      .join("");

    deviceSelect.innerHTML = html;
  });
}

startButton.addEventListener("click", startMetronome);
pauseButton.addEventListener("click", pauseMetronome);
bpmInput.addEventListener("change", (e) => updateBPM(e.target.value));
recordButton.addEventListener("click", startRecording);

getDeviceOptionsHTML();