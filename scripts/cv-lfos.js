
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

document.querySelector('#add-lfo').addEventListener('click', () => {
  let lfo = context.createOscillator()
  let initial = Math.floor(Math.random() * 100)
  lfo.frequency.value = initial / 100
  lfo.connect(modulationGain)
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
  let slider = document.createElement('input')
  slider.type = 'range'
  slider.setAttribute('min', 1)
  slider.setAttribute('max', 1000)
  slider.setAttribute('step', 10)
  slider.value = initial
  slider.addEventListener('input', function () {
    lfo.frequency.value = this.value / 100
  }, false)
  let button = document.createElement('button')
  button.className = 'remove'
  button.appendChild(document.createTextNode('␡'))
  button.addEventListener('click', () => {
    lfo.disconnect(modulationGain)
    lfo.stop()
    slider.remove()
    selectWave.remove()
    button.remove()
  }, false)
  controls.appendChild(slider)
  controls.appendChild(selectWave)
  controls.appendChild(button)
  lfo.start(0)
})


