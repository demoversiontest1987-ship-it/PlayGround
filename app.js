

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const SAVE_KEY = 'halcyon-dream-v1';
const palettes = {
  skin: [
    { name: 'Porcelain', color: '#f4d5c3' }, { name: 'Warm sand', color: '#d9a987' },
    { name: 'Golden', color: '#bd8063' }, { name: 'Cocoa', color: '#875744' }, { name: 'Umber', color: '#593b38' }
  ],
  hair: [
    { name: 'Midnight', color: '#282136' }, { name: 'Espresso', color: '#50332f' },
    { name: 'Chestnut', color: '#9b5849' }, { name: 'Rose', color: '#c76f83' }, { name: 'Silver', color: '#c9bfd5' }
  ],
  eyes: [
    { name: 'Amber', color: '#bd8057' }, { name: 'Ocean', color: '#6f9cae' },
    { name: 'Moss', color: '#82947b' }, { name: 'Violet', color: '#9d7bb5' }
  ],
  hairStyles: [
    { name: 'Midnight wave', short: 'Wave' }, { name: 'Soft bob', short: 'Bob' }, { name: 'Long & loose', short: 'Long' }, { name: 'Moonlit crop', short: 'Crop' }
  ],
  outfits: [
    { name: 'Silk & smoke', short: 'Silk', color: '#74455f' }, { name: 'Velvet night', short: 'Velvet', color: '#34314e' },
    { name: 'City poet', short: 'Poet', color: '#866b61' }
  ],
  personalities: [
    { name: 'Dreamy', detail: 'Notices the little things.', quote: '“I was hoping you’d imagine me.”' },
    { name: 'Witty', detail: 'Finds a spark in everything.', quote: '“You look like trouble. The interesting kind.”' },
    { name: 'Thoughtful', detail: 'Asks the questions that stay.', quote: '“Tell me what you never say out loud.”' },
    { name: 'Bold', detail: 'Meets the night eye to eye.', quote: '“Come on. The city is ours tonight.”' }
  ]
};
const defaultState = () => ({ name: 'Lia', skin: 1, hair: 0, eyes: 0, hairStyle: 0, outfit: 0, personality: 0, night: 0, chemistry: 0, memories: [], choices: [], screen: 'title' });
let state = defaultState();
let soundEnabled = true;
let toastTimer;
const story = [
  { scene: 'rooftop', place: 'The rooftop garden', time: '00:13', mood: 'the city is listening', kicker: 'night one · the invitation', title: 'The rooftop garden', line: '“You came,” she says, as if she had been saving the words for you.', narration: 'A garden floats above the sleeping city. She is 25, and the night feels wide open; nothing is expected of either of you.', replies: [
    { text: 'Ask what she sees in the constellations.', note: 'curiosity · +14 chemistry', response: '“A map,” she smiles. “But I think the best part is getting a little lost together.”', memory: 'A map in the stars', delta: 14 },
    { text: 'Tell her the rooftop feels peaceful with her here.', note: 'honesty · +18 chemistry', response: 'Her shoulders soften. “I like that you said how you feel, instead of what you think I want to hear.”', memory: 'A place to be still', delta: 18 },
    { text: 'Offer your hand, then let her decide.', note: 'respect · +20 chemistry', response: 'She considers your open hand, then takes it. “Thank you for leaving the choice with me.”', memory: 'Her hand in yours', delta: 20 }
  ] },
  { scene: 'bookshop', place: 'The last-light bookshop', time: '01:26', mood: 'rain writes on the windows', kicker: 'night two · borrowed worlds', title: 'A story between shelves', line: '“If you could step into any story,” she asks, “would you want to know how it ends?”', narration: 'The shop smells of paper and rain. Somewhere between the shelves, the rest of the city grows quiet.', replies: [
    { text: '“I’d rather be surprised by the middle.”', note: 'playfulness · +14 chemistry', response: '“Good answer,” she says, slipping a book back onto the shelf. “Beginnings are easy. It’s what we do next that matters.”', memory: 'A book left open', delta: 14 },
    { text: 'Ask which story she would choose for herself.', note: 'listen · +20 chemistry', response: '“One where I get to write a few pages,” she says. “And where nobody rushes me to the ending.”', memory: 'Her unwritten chapter', delta: 20 },
    { text: 'Invite her to make up an ending together.', note: 'imagination · +17 chemistry', response: 'Her eyes brighten. Together, you give the lost heroine a home—and a door she can open whenever she likes.', memory: 'An ending made together', delta: 17 }
  ] },
  { scene: 'kitchen', place: 'The all-night kitchen', time: '02:41', mood: 'warm light, softer voices', kicker: 'night three · something simple', title: 'Two cups of tea', line: 'She slides a mug across the counter. “It’s not fancy, but I made it the way you like.”', narration: 'Outside, a passing tram turns the rain silver. In here, the small kindness feels enormous.', replies: [
    { text: 'Thank her, and ask what comforts her.', note: 'care · +20 chemistry', response: '“Being remembered,” she says. “Not perfectly. Just enough to know someone was paying attention.”', memory: 'Tea made just right', delta: 20 },
    { text: 'Offer to wash the cups while she rests.', note: 'gentleness · +16 chemistry', response: '“A very glamorous dream,” she laughs, and stays beside you anyway.', memory: 'The easy quiet', delta: 16 },
    { text: 'Share a small truth about yourself.', note: 'vulnerability · +18 chemistry', response: 'She listens without interrupting. When you finish, she says, “I’m glad you trusted me with that.”', memory: 'A truth held gently', delta: 18 }
  ] },
  { scene: 'arcade', place: 'The neon arcade', time: '03:58', mood: 'the night turns playful', kicker: 'night four · the almost-dawn', title: 'One more round', line: '“Winner chooses where we go next,” she says, already reaching for the controls.', narration: 'Colored lights scatter across her smile. For once, neither of you is trying to make the moment mean anything more than it does.', replies: [
    { text: 'Let her win, but demand a rematch.', note: 'teasing · +14 chemistry', response: '“I knew you were letting me win,” she grins. “Next time, no mercy.”', memory: 'A rematch promised', delta: 14 },
    { text: 'Play honestly, cheering for both of you.', note: 'partnership · +19 chemistry', response: 'The score is close enough to be unimportant. You celebrate every lucky shot like a shared victory.', memory: 'A victory for two', delta: 19 },
    { text: 'Ask where she wants to go after this.', note: 'agency · +22 chemistry', response: 'She looks toward the paling sky. “The observatory. But only if you want to come with me.”', memory: 'Her choice, shared', delta: 22 }
  ] },
  { scene: 'observatory', place: 'The hilltop observatory', time: '04:49', mood: 'morning gathers at the edge', kicker: 'night five · a door left open', title: 'Before the first light', line: '“When the dream ends,” she says, “I want to believe I still get to choose what happens next.”', narration: 'The dome opens to a sky going pale. The closeness between you is quiet, mutual, and unhurried; what follows is yours to choose together.', replies: [
    { text: '“You always get to choose. I’d like to see you again.”', note: 'commitment · +22 chemistry', response: 'She reaches for your hand. “Then let’s meet again—not because a dream says so, but because we both want to.”', memory: 'An invitation to return', delta: 22 },
    { text: 'Ask what kind of future she wants for herself.', note: 'respect · +20 chemistry', response: '“One I get to help make,” she says. “And maybe one with you in it, if you still want that.”', memory: 'A future of her own', delta: 20 },
    { text: 'Stay beside her and watch the sun arrive.', note: 'presence · +17 chemistry', response: 'You sit together in the hush. She leans close only after you meet her halfway, and the moment fades softly into morning.', memory: 'The first light, together', delta: 17 }
  ] }
];
function escapeHTML(value) { return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]); }
function safeName(value) { const cleaned = String(value || '').replace(/[<>]/g, '').replace(/[\u0000-\u001f]/g, '').trim().slice(0, 16); return cleaned || 'Lia'; }
function save() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); $('#saveStateText').textContent = 'autosaved'; }
  catch { $('#saveStateText').textContent = 'not saved'; }
  $('#continueBtn').hidden = state.screen === 'title' && state.night === 0;
}
function load() {
  try {
    const stored = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
    if (!stored || typeof stored !== 'object') return;
    const fresh = defaultState();
    state = { ...fresh, ...stored };
    state.name = safeName(state.name);
    for (const key of ['skin', 'hair', 'eyes', 'hairStyle', 'outfit', 'personality']) {
      const limit = { skin: palettes.skin.length, hair: palettes.hair.length, eyes: palettes.eyes.length, hairStyle: palettes.hairStyles.length, outfit: palettes.outfits.length, personality: palettes.personalities.length }[key];
      state[key] = Number.isInteger(state[key]) && state[key] >= 0 && state[key] < limit ? state[key] : fresh[key];
    }
    state.night = Math.min(story.length, Math.max(0, Number(state.night) || 0));
    state.chemistry = Math.min(100, Math.max(0, Number(state.chemistry) || 0));
    state.memories = Array.isArray(state.memories) ? state.memories.slice(0, story.length) : [];
    state.choices = Array.isArray(state.choices) ? state.choices.slice(0, story.length) : [];
    if (!['title', 'creator', 'game', 'ending'].includes(state.screen)) state.screen = 'title';
  } catch { state = defaultState(); }
}
function setScreen(screen) {
  if (!['title', 'creator', 'game', 'ending'].includes(screen)) return;
  state.screen = screen;
  $$('.screen').forEach((el) => el.classList.toggle('is-active', el.id === `${screen}Screen`));
  document.body.dataset.screen = screen;
  $('#topMetaText').textContent = screen === 'game' ? 'five nights between heartbeats' : 'a dream girl story';
  $('#continueBtn').hidden = screen === 'title' && state.night === 0;
  save(); window.scrollTo({ top: 0, behavior: 'smooth' });
}
function portraitSVG() {
  const skin = palettes.skin[state.skin].color, hair = palettes.hair[state.hair].color;
  const eyes = palettes.eyes[state.eyes].color, outfit = palettes.outfits[state.outfit].color;
  const styles = [
    'M124 169Q87 112 121 60Q145 18 204 29Q263 37 268 100L258 190 242 126Q226 91 199 83Q167 115 126 116Z',
    'M120 144Q100 74 132 42Q174 9 228 40Q266 63 254 143L238 118Q211 136 151 121Z',
    'M119 177Q85 105 121 57Q147 19 202 27Q266 35 270 106L258 227 239 130Q213 98 193 82Q167 116 127 119Z',
    'M126 126Q111 71 143 41Q178 12 223 42Q251 61 249 122L235 107Q211 116 195 91Q170 120 137 112Z'
  ];
  const backHair = styles[state.hairStyle];
  return `<svg viewBox="0 0 390 520" role="img" aria-label="Portrait of ${escapeHTML(state.name)}, an adult woman" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="dress" x2="0" y2="1"><stop stop-color="${outfit}"/><stop offset="1" stop-color="#201729"/></linearGradient><radialGradient id="halo"><stop stop-color="#ffd4bc" stop-opacity=".32"/><stop offset="1" stop-color="#d79dcd" stop-opacity="0"/></radialGradient></defs><ellipse cx="195" cy="252" rx="173" ry="226" fill="url(#halo)"/><path d="${backHair}" fill="${hair}"/><path d="M91 520Q98 402 150 374L159 333h76l8 41q57 25 65 146Z" fill="url(#dress)"/><path d="M156 337q39 32 78 0v48q-39 29-78 0Z" fill="${skin}"/><path d="M132 118Q135 73 190 69Q248 72 250 123L243 197Q236 255 194 268Q151 253 139 197Z" fill="${skin}"/><path d="M134 154q-16-13-17 7t21 28M248 154q16-13 17 7t-21 28" fill="${skin}"/><path d="M153 171q14-10 27 0M207 171q14-10 27 0" fill="none" stroke="#50343a" stroke-width="4" stroke-linecap="round"/><ellipse cx="167" cy="181" rx="6" ry="8" fill="${eyes}"/><ellipse cx="220" cy="181" rx="6" ry="8" fill="${eyes}"/><circle cx="169" cy="179" r="2" fill="#fff"/><circle cx="222" cy="179" r="2" fill="#fff"/><path d="M192 181q-8 22 2 24" fill="none" stroke="#b77d70" stroke-width="3" stroke-linecap="round"/><path d="M177 222q16 13 32 0" fill="none" stroke="#a65e69" stroke-width="3" stroke-linecap="round"/><path d="${backHair}" fill="${hair}"/><path d="M128 143Q133 66 191 61Q249 65 255 145Q231 124 220 95Q194 119 146 119Z" fill="${hair}"/><path d="M147 128q-7 54 3 82M238 129q9 42-1 67" fill="none" stroke="${hair}" stroke-width="14" stroke-linecap="round"/><path d="M157 382q37 28 78 0M129 440q68-25 133 0" fill="none" stroke="#f2c8bc" stroke-opacity=".35" stroke-width="3"/><circle cx="147" cy="205" r="4" fill="#f4d3a3"/><circle cx="240" cy="205" r="4" fill="#f4d3a3"/></svg>`;
}
function renderPortraits() {
  const svg = portraitSVG();
  ['titlePortrait', 'creatorPortrait', 'gamePortrait', 'endingPortrait'].forEach((id) => { const node = document.getElementById(id); if (node) node.innerHTML = svg; });
  $('#designName').textContent = state.name;
  $('#designVibe').textContent = palettes.personalities[state.personality].name;
  $('#designQuote').textContent = palettes.personalities[state.personality].quote;
  $('#speakerName').textContent = state.name;
  $('#speakerAvatar').textContent = state.name.slice(0, 1).toUpperCase();
}
function renderCreator() {
  const groups = [
    ['skinOptions', palettes.skin, 'skin', 'swatch'], ['hairColorOptions', palettes.hair, 'hair', 'swatch swatch--hair'], ['eyeOptions', palettes.eyes, 'eyes', 'swatch swatch--eye']
  ];
  groups.forEach(([id, items, key, className]) => {
    const container = $(`#${id}`); container.replaceChildren();
    items.forEach((item, index) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = className;
      button.style.setProperty('--c', item.color); button.title = item.name; button.setAttribute('aria-label', item.name);
      button.setAttribute('aria-pressed', String(state[key] === index));
      button.addEventListener('click', () => { state[key] = index; buildCreator(); save(); }); container.append(button);
    });
  });
  const tiles = (id, items, key, subtitle = false) => {
    const container = $(`#${id}`); container.replaceChildren();
    items.forEach((item, index) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'style-tile';
      button.setAttribute('aria-pressed', String(state[key] === index));
      button.innerHTML = `<strong>${escapeHTML(item.short || item.name)}</strong>${subtitle ? `<small>${escapeHTML(item.name)}</small>` : ''}`;
      button.addEventListener('click', () => { state[key] = index; buildCreator(); save(); }); container.append(button);
    });
  };
  tiles('hairStyleOptions', palettes.hairStyles, 'hairStyle'); tiles('outfitOptions', palettes.outfits, 'outfit', true);
  const personalities = $('#personalityOptions'); personalities.replaceChildren();
  palettes.personalities.forEach((item, index) => {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'personality';
    button.setAttribute('aria-pressed', String(state.personality === index));
    button.innerHTML = `<strong>${escapeHTML(item.name)}</strong><span>${escapeHTML(item.detail)}</span>`;
    button.addEventListener('click', () => { state.personality = index; buildCreator(); save(); }); personalities.append(button);
  });
  $('#skinValue').textContent = palettes.skin[state.skin].name; $('#hairValue').textContent = palettes.hairStyles[state.hairStyle].name;
  $('#eyeValue').textContent = palettes.eyes[state.eyes].name; $('#outfitValue').textContent = palettes.outfits[state.outfit].name;
  $('#personalityValue').textContent = palettes.personalities[state.personality].name; $('#nameInput').value = state.name;
  renderPortraits();
}
function buildCreator() { renderCreator(); }

function renderStory() {
  const index = Math.min(state.night, story.length - 1);
  const chapter = story[index];
  const scene = $('#scenePanel');
  scene.dataset.scene = chapter.scene;
  $('#scenePlace').textContent = chapter.place;
  $('#sceneTime').textContent = chapter.time;
  $('#sceneMood').textContent = chapter.mood;
  $('#nightStamp').textContent = `night ${String(index + 1).padStart(2, '0')}`;
  $('#chapterKicker').textContent = chapter.kicker;
  $('#chapterTitle').textContent = chapter.title;
  $('#dialogueText').textContent = chapter.line;
  $('#narratorText').textContent = chapter.narration;
  $('#narratorText').hidden = false;
  $('#speakerTag').textContent = palettes.personalities[state.personality].name.toLowerCase();
  $('#choicesWrap').hidden = false;
  $('#continueWrap').hidden = true;
  const choices = $('#choices');
  choices.replaceChildren();
  chapter.replies.forEach((reply, index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'choice';
    button.innerHTML = `<span class="choice-index">0${index + 1}</span><span class="choice-copy">${escapeHTML(reply.text)}<small>${escapeHTML(reply.note)}</small></span><svg class="icon"><use href="#i-chevron"/></svg>`;
    button.addEventListener('click', () => selectChoice(index));
    choices.append(button);
  });
  const dots = $('#progressDots'); dots.replaceChildren();
  story.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = `progress-dot${i < state.night ? ' is-done' : ''}${i === index ? ' is-current' : ''}`;
    dots.append(dot);
  });
  const percent = Math.min(100, Math.max(0, state.chemistry));
  $('#affectionText').textContent = `${percent}%`;
  $('#affectionFill').style.width = `${percent}%`;
  $('#affectionLabel').textContent = percent < 25 ? 'a quiet spark' : percent < 50 ? 'finding a rhythm' : percent < 75 ? 'closer, night by night' : 'something tender, growing';
  createSceneStars();
  renderPortraits();
}
function createSceneStars() {
  const container = $('#sceneStars');
  if (container.childElementCount) return;
  for (let i = 0; i < 38; i += 1) {
    const star = document.createElement('i');
    star.className = 'scene-star';
    star.style.left = `${(i * 47 + 13) % 100}%`;
    star.style.top = `${(i * 31 + 7) % 67}%`;
    star.style.setProperty('--delay', `${(i % 9) * -0.37}s`);
    star.style.setProperty('--size', `${i % 7 === 0 ? 3 : 1 + (i % 2)}px`);
    container.append(star);
  }
}
function selectChoice(choiceIndex) {
  const chapterIndex = Math.min(state.night, story.length - 1);
  const reply = story[chapterIndex].replies[choiceIndex];
  if (!reply) return;
  state.chemistry = Math.min(100, state.chemistry + reply.delta);
  state.memories[chapterIndex] = reply.memory;
  state.choices[chapterIndex] = choiceIndex;
  state.night = chapterIndex + 1;
  $('#dialogueText').textContent = reply.response;
  $('#narratorText').hidden = true;
  $('#choicesWrap').hidden = true;
  $('#continueWrap').hidden = false;
  $('#continueStoryLabel').textContent = chapterIndex === story.length - 1 ? 'Meet me in the morning' : 'Keep the night going';
  const dots = $$('#progressDots .progress-dot');
  dots[chapterIndex]?.classList.add('is-done');
  $('#affectionText').textContent = `${state.chemistry}%`;
  $('#affectionFill').style.width = `${state.chemistry}%`;
  $('#affectionLabel').textContent = state.chemistry < 25 ? 'a quiet spark' : state.chemistry < 50 ? 'finding a rhythm' : state.chemistry < 75 ? 'closer, night by night' : 'something tender, growing';
  save(); playChime();
}
function advanceStory() {
  if (state.night >= story.length) {
    renderEnding(); setScreen('ending');
  } else {
    renderStory(); save();
    $('#dialoguePanel').scrollTop = 0;
  }
}
function renderEnding() {
  const chemistry = Math.min(100, state.chemistry);
  const title = chemistry >= 58 ? 'A dream worth\nkeeping.' : 'A beginning\nof your own.';
  $('#endingTitle').innerHTML = chemistry >= 58 ? 'A dream worth<br /><em>keeping.</em>' : 'A beginning<br /><em>of your own.</em>';
  $('#endingEra').textContent = chemistry >= 58 ? 'the morning after · together' : 'the morning after · a new beginning';
  $('#endingBody').textContent = chemistry >= 58
    ? `Morning gathers at the edge of the observatory. ${state.name} looks toward the first light, then back at you. “I don’t know what a dream is supposed to keep,” she says, “but I know I want to remember how you made room for me to choose.” The city fades gently—not as an ending, but as an invitation to meet again.`
    : `The first light finds you both beneath the observatory dome. ${state.name} smiles, calm and unafraid of what comes next. “Maybe I’m not meant to be anyone’s perfect dream,” she says. “Maybe I’m just me—and that’s a good place to begin.” The night ends softly, leaving the future open to both of you.`;
  $('#endingChemistry').textContent = `${chemistry}%`;
  $('#endingMemories').textContent = String(state.memories.filter(Boolean).length);
  const strip = $('#memoryStrip'); strip.replaceChildren();
  state.memories.filter(Boolean).forEach((memory, index) => {
    const item = document.createElement('div'); item.className = 'memory';
    item.innerHTML = `<small>night ${index + 1}</small><span>${escapeHTML(memory)}</span>`;
    strip.append(item);
  });
  renderPortraits();
}
function resetStory() {
  state.night = 0; state.chemistry = 0; state.memories = []; state.choices = [];
  save(); renderStory(); setScreen('game');
}
function showToast(message) {
  const toast = $('#toast'); toast.textContent = message; toast.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2300);
}
function openModal({ kicker = 'a gentle pause', title, body, actions = [] }) {
  $('#modalKicker').textContent = kicker;
  $('#modalTitle').textContent = title;
  $('#modalBody').textContent = body;
  const container = $('#modalActions'); container.replaceChildren();
  actions.forEach(({ label, className = 'btn btn-primary', action }) => {
    const button = document.createElement('button'); button.type = 'button'; button.className = className; button.textContent = label;
    button.addEventListener('click', () => { closeModal(); action?.(); }); container.append(button);
  });
  $('#modalBackdrop').hidden = false;
  document.body.classList.add('modal-open');
  container.querySelector('button')?.focus();
}
function closeModal() {
  $('#modalBackdrop').hidden = true; document.body.classList.remove('modal-open');
}
function askRestart() {
  openModal({
    kicker: 'begin again', title: 'Start the story over?',
    body: 'Your character will stay the same, but the five-night story and its memories will begin again.',
    actions: [
      { label: 'Keep this dream', className: 'btn btn-ghost', action: () => {} },
      { label: 'Start over', action: resetStory }
    ]
  });
}
function openMenu() {
  openModal({
    kicker: 'a gentle pause', title: 'Take your time.',
    body: 'Your story is saved automatically. You can keep dreaming, change her look, or return to the title.',
    actions: [
      { label: 'Back to the story', className: 'btn btn-primary', action: () => {} },
      { label: 'Edit her look', className: 'btn btn-ghost', action: () => { buildCreator(); setScreen('creator'); } },
      { label: 'Return to title', className: 'btn btn-ghost', action: () => setScreen('title') }
    ]
  });
}
function playChime() {
  if (!soundEnabled) return;
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    const context = new Audio();
    const gain = context.createGain(); gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.045, context.currentTime + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.65);
    gain.connect(context.destination);
    [523.25, 659.25].forEach((frequency, index) => {
      const oscillator = context.createOscillator(); oscillator.type = 'sine'; oscillator.frequency.value = frequency;
      oscillator.connect(gain); oscillator.start(context.currentTime + index * 0.12); oscillator.stop(context.currentTime + 0.7);
    });
    window.setTimeout(() => context.close(), 900);
  } catch { /* Audio is an optional enhancement. */ }
}
function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => showToast('Fullscreen is unavailable here.'));
  else document.exitFullscreen?.();
}
function randomName() {
  const names = ['Mira', 'Nora', 'Iris', 'Cleo', 'Noemi', 'Ayla', 'June', 'Sora', 'Elise', 'Vera'];
  let suggestion = names[Math.floor(Math.random() * names.length)];
  if (suggestion === state.name) suggestion = names[(names.indexOf(suggestion) + 1) % names.length];
  state.name = suggestion; $('#nameInput').value = suggestion; renderPortraits(); save();
}
function continueSaved() {
  if (state.night >= story.length || state.screen === 'ending') {
    renderEnding(); setScreen('ending');
  } else if (state.night > 0 || state.screen === 'game') {
    renderStory(); setScreen('game');
  } else {
    buildCreator(); setScreen('creator');
  }
}
function init() {
  load();
  buildCreator();
  $('#startBtn').addEventListener('click', () => { buildCreator(); setScreen('creator'); });
  $('#continueBtn').addEventListener('click', continueSaved);
  $('#meetBtn').addEventListener('click', () => {
    state.name = safeName($('#nameInput').value);
    if (state.night >= story.length) resetStory();
    else if (state.night > 0) setScreen('game');
    else { state.chemistry = 0; state.memories = []; state.choices = []; renderStory(); setScreen('game'); playChime(); }
  });
  $('#nameInput').addEventListener('input', (event) => {
    state.name = safeName(event.target.value); renderPortraits(); save();
  });
  $('#nameInput').addEventListener('blur', (event) => { event.target.value = state.name; });
  $('#nameDice').addEventListener('click', randomName);
  $('#continueStoryBtn').addEventListener('click', advanceStory);
  $('#menuBtn').addEventListener('click', openMenu);
  $('#restartBtn').addEventListener('click', askRestart);
  $('#againBtn').addEventListener('click', () => { resetStory(); });
  $('#homeBtn').addEventListener('click', () => setScreen('title'));
  $('#brandBtn').addEventListener('click', () => setScreen('title'));
  $('#soundBtn').addEventListener('click', () => {
    soundEnabled = !soundEnabled; document.body.classList.toggle('is-muted', !soundEnabled);
    $('#soundBtn').setAttribute('aria-label', soundEnabled ? 'Turn sound off' : 'Turn sound on');
    showToast(soundEnabled ? 'Soft sound effects are on.' : 'Sound effects are off.');
    if (soundEnabled) playChime();
  });
  $('#fullBtn').addEventListener('click', toggleFullscreen);
  $('#modalClose').addEventListener('click', closeModal);
  $('#modalBackdrop').addEventListener('click', (event) => { if (event.target === $('#modalBackdrop')) closeModal(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !$('#modalBackdrop').hidden) closeModal();
    if (event.key === 'Escape' && !$('#modalBackdrop').hidden) return;
    if (event.key === 'Enter' && $('#gameScreen').classList.contains('is-active') && !$('#continueWrap').hidden) advanceStory();
  });
  createSceneStars();
  renderPortraits();
  if (state.screen === 'ending') renderEnding();
  if (state.screen === 'game') renderStory();
  $$('.screen').forEach((el) => el.classList.toggle('is-active', el.id === `${state.screen}Screen`));
  $('#topMetaText').textContent = state.screen === 'game' ? 'five nights between heartbeats' : 'a dream girl story';
  document.body.dataset.screen = state.screen;
  $('#continueBtn').hidden = state.screen === 'title' && state.night === 0;
  if (!state.chemistry) $('#affectionFill').style.width = '0%';
}

init();
