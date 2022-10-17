function recordAudio() {
  const mic = new Tone.UserMedia()
  const recorder = new Tone.Recorder()

  mic.connect(recorder)
  mic.open()

  return recorder
}

async function getAudio(recorder) {
  const data = await recorder.stop()
  const audioUrl = URL.createObjectURL(data)

  return audioUrl
}

function playAudio(audioUrl) {
  const player = new Tone.Player(audioUrl).toDestination()
  player.loop = true
  player.start()
}

// Interface
document.addEventListener("DOMContentLoaded", () => {
  window.recorders = []

  document.querySelectorAll(".record").forEach((button, index) => button.addEventListener("click", async (event) => {
    event.preventDefault()
    Tone.context.resume()
    
    if (event.target.innerText == "Record") {
      const mic = new Tone.UserMedia();
      const recorder = new Tone.Recorder();

      mic.connect(recorder);
      mic.open();

      window.recorders[index] = recorder
      recorder.start()
      
      event.target.innerText = "Play"

      return
    }

    if (event.target.innerText == "Play") {
      const data = await window.recorders[index].stop()
      const audioUrl = URL.createObjectURL(data)
      const player = new Tone.Player(audioUrl).toDestination();
      player.loop = true;
      player.start();
    }
  }))
})