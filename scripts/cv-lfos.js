
let context = new AudioContext()
let modulationGain = context.createGain()
modulationGain.gain.value = 0.15
let hfo = context.createOscillator()
hfo.type = 'triangle'
hfo.frequency.value = 50.0
let ampGain = context.createGain();
ampGain.gain.value = 0.15;

modulationGain.connect(ampGain.gain);
hfo.connect(ampGain);
ampGain.connect(context.destination);
hfo.start(0);

let controls = document.querySelector('#controls')
let waves = [
  {type: 'sine', label: '∿'},
  {type: 'square', label: '⎍'},
  {type: 'sawtooth', label: 'W'}
]

hfo_container = document.querySelector('#hfo-controls')
hfo_container.className = 'lfo-container'
let slider = create_slider(hfo, min=20, max=20000)
let selectWave = create_wave_selector(hfo)
hfo_container.appendChild(slider)
hfo_container.appendChild(selectWave)

document.querySelector('#add-lfo').addEventListener('click', create_modulator_lfo)


function create_modulator_lfo() {
  let lfo = context.createOscillator()
  let initial = Math.floor(Math.random() * 100)
  lfo.frequency.value = initial / 100
  lfo.connect(modulationGain)
  let selectWave = create_wave_selector(lfo)
  let slider = create_slider(lfo)
  let button = document.createElement('button')
  button.className = 'remove'
  button.appendChild(document.createTextNode('␡'))
  button.addEventListener('click', () => {
    lfo.disconnect(modulationGain)
    lfo.stop()
    slider.remove()
    selectWave.remove()
    button.remove()
    container.remove()
  }, false)
  container = document.createElement('div')
  container.className = 'lfo-container'
  control = controls.appendChild(container)
  control.appendChild(slider)
  control.appendChild(selectWave)
  control.appendChild(button)
  lfo.start(0)
}


function create_slider(lfo, min=1, max=1000) {
  let slider = document.createElement('input')
  slider.type = 'range'
  slider.setAttribute('min', min)
  slider.setAttribute('max', max)
  slider.setAttribute('step', 10)
  slider.value = lfo.frequency.value * 100
  slider.addEventListener('input', function () {
    lfo.frequency.value = this.value / 100
  }, false)
  return(slider)
}

function create_wave_selector(lfo) {
  let selectWave = document.createElement('select')
  let createOption = (wave) => {
    let option = document.createElement('option')
    option.value = wave.type
    option.appendChild(document.createTextNode(wave.label))
    return option
  }
  let appendOption = option =>  selectWave.appendChild(option)
  R.forEach(appendOption, R.map(createOption, waves))
  selectWave.onchange = function() { lfo.type = this.value }
  selectWave.value = R.nth(Math.floor(Math.random() * waves.length), waves).type
  selectWave.onchange()
  return(selectWave)
}
