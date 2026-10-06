// Stepper — step-through explanations built on ONE master GSAP timeline.
//
// Each step contributes `enter(tl)`: tweens that take the scene from the END
// state of the previous step to the END state of this step (tl is a fresh
// sub-timeline; positions inside it are relative to the step's start).
// The stepper lays the steps end to end with labels:
//
//   0 ── s0:start ─[step 0 tweens]─ s0 ── s1:start ─[step 1 tweens]─ s1 …
//
// Being "at step i" means the playhead sits on label `s{i}`. Because a GSAP
// timeline is deterministic, every navigation — next, back, dot jumps,
// replay, reduced motion — is just a seek and/or a play between labels, so
// the scene is always in exactly the state the author designed.
//
//   next  (i → i+1)   snap to s{i}, play to s{i+1}
//   other (i → j)     soft veil, seek to s{j}:start (= end of step j-1), play to s{j}
//   reduced motion    seek straight to s{j}
//
// Rules for `enter` (enforced with console warnings):
//   • use tl.to / tl.fromTo / tl.set — never tl.from (it breaks rebuilds and jumps)
//   • no infinite repeats (use ctx.ambient for idle loops)
//   • no side effects in tl.call() that matter for state — use onChange(i) instead
import { h, icon, clamp } from './dom.js';

const GAP = 0.02;          // seconds between a step's label and the next step's tweens
// Play-all pacing (POLISH S1): each step gets its animation plus ~0.25 s per caption word,
// 5–9 s in all at 1× (never slower than a reader). 2× halves animation and pause.
const MIN_STEP = 5;
const MAX_STEP = 9;
const PER_WORD = 0.25;
const MIN_PAUSE = 1.5;     // always let the settled state sit for a moment
const SPEED_KEY = 'so-play-speed';
const readSpeed = () => { try { return localStorage.getItem(SPEED_KEY) === '2' ? 2 : 1; } catch { return 1; } };
const saveSpeed = (v) => { try { localStorage.setItem(SPEED_KEY, String(v)); } catch { /* private mode */ } };

const strip = (html) => {
  const d = document.createElement('div');
  d.innerHTML = html || '';
  return (d.textContent || '').replace(/\s+/g, ' ').trim();
};

/**
 * @param ctx  figure context
 * @param opts {
 *   steps: [{ enter(tl, info), title?, caption? }],   // caption/title default to the writer's ctx.steps[i]
 *   onChange?(index, { direction, instant, from, initial }),
 *   onComplete?(),       // once, when the last step is first reached (unlock free exploration)
 *   phases?: [{ label, short?, steps: [i…] } | { label, short?, count }],   // grouped, labeled dots
 *   reset?(),            // restore anything enter() touches that isn't a tween (called before (re)build)
 *   autoplay?: false,    // play all steps the first time the figure scrolls into view
 *   loop?: false,        // play-all wraps around
 *   dwell?: number | (index) => seconds,   // pause after each step's animation during play-all
 *                        //   (default: reading time, see playTime below; custom values are capped too)
 *   maxStep?: 9,         // play-all: max seconds per step at 1× (animation + pause); raise only if a step needs it
 *   scene?: Element,     // what to veil during jumps (default: the stage's first svg/canvas)
 *   parent?: Element,    // where the controls go (default ctx.controls)
 *   captions?: true,     // render step captions into ctx.caption
 *   defaults?: {}        // sub-timeline defaults (duration 0.9, ease 'so.inOut')
 * }
 */
export function createStepper(ctx, opts = {}) {
  const gsap = ctx.gsap;
  const {
    steps: defs = [],
    onChange,
    onComplete,
    reset,
    autoplay = false,
    loop = false,
    dwell,
    scene: sceneOpt,
    phases: phasesOpt,
    maxStep = MAX_STEP,
    parent = ctx.controls,
    captions = true,
    defaults = {},
  } = opts;

  const n = defs.length;
  const writer = ctx.steps || [];
  if (writer.length && writer.length !== n) {
    console.warn(`[figure ${ctx.id}] stepper has ${n} steps but the draft provides ${writer.length} step captions`);
  }
  const items = defs.map((d, i) => {
    const html = d.caption ?? writer[i]?.html ?? '';
    return { enter: d.enter, title: d.title ?? writer[i]?.title ?? '', html, text: strip(html) };
  });

  // Phases: consecutive groups of steps with a label (FIGURE-AUDIT §4 rule 16).
  let phases = null;
  if (Array.isArray(phasesOpt) && phasesOpt.length) {
    let at = 0;
    phases = phasesOpt.map((p) => {
      const steps = Array.isArray(p.steps) ? p.steps.slice() : Array.from({ length: p.count || 0 }, (_, k) => at + k);
      at = Math.max(at, ...steps.map((x) => x + 1));
      return { label: p.label || '', short: p.short || p.label || '', steps };
    });
    const covered = phases.flatMap((p) => p.steps).sort((a, b) => a - b);
    if (covered.length !== n || covered.some((v, k) => v !== k)) console.warn(`[figure ${ctx.id}] stepper phases should cover steps 0…${n - 1} exactly once, in order`);
  }
  const phaseOf = (i) => (phases ? phases.find((p) => p.steps.includes(i)) : null);

  let master = null;
  let index = -1;            // -1 = before the first step has played
  let nav = null;            // tween moving the master playhead
  let veilTl = null;
  let playing = false;       // "play all" mode
  let dwellCall = null;
  let destroyed = false;
  let completed = false;
  let speed = readSpeed();   // play-all speed (1 or 2), remembered per viewer
  let fill = null;           // progress-fill tween on the active dot (play-all)

  // ------------------------------------------------------------- timeline
  function warnBadTweens(sub, i) {
    for (const t of sub.getChildren(true, true, false)) {
      if (t.vars && t.vars.runBackwards && !t.vars.startAt) {
        console.warn(`[figure ${ctx.id}] step ${i + 1} uses tl.from(); use tl.fromTo() or tl.set()+tl.to() so jumps and rebuilds stay correct`);
        break;
      }
    }
  }

  function build() {
    master = gsap.timeline({ paused: true });
    try { reset?.(); } catch (e) { console.error(`[figure ${ctx.id}] stepper reset() threw`, e); }
    let t = 0;
    items.forEach((it, i) => {
      const sub = gsap.timeline({ defaults: { duration: 0.9, ease: 'so.inOut', ...defaults } });
      try { it.enter?.(sub, { index: i, ctx, compact: ctx.compact }); } catch (e) { console.error(`[figure ${ctx.id}] step ${i + 1} enter() threw`, e); }
      warnBadTweens(sub, i);
      let d = sub.duration();
      if (!Number.isFinite(d)) {
        console.error(`[figure ${ctx.id}] step ${i + 1} has an infinite repeat; move idle loops to ctx.ambient()`);
        d = 1;
      }
      master.addLabel(`s${i}:start`, t);
      master.add(sub, t + GAP);
      t += GAP + d;
      master.addLabel(`s${i}`, t);
    });
    // Prime: render everything once (records start values in order), then back to 0.
    master.progress(1, true).progress(0, true);
  }

  const labelTime = (name) => master.labels[name] ?? 0;

  function scene() {
    return sceneOpt || ctx.stage.querySelector(':scope > svg, :scope > canvas, :scope > .fig__layer');
  }

  function killMotion() {
    nav?.kill();
    nav = null;
    if (veilTl) {
      veilTl.kill();
      veilTl = null;
      const el = scene();
      if (el) gsap.set(el, { clearProps: 'opacity' });
    }
  }

  function playTo(i, done) {
    const target = labelTime(`s${i}`);
    const dur = Math.max(0, target - master.time()) / (playing ? speed : 1);
    nav = gsap.to(master, {
      time: target, duration: dur, ease: 'none', overwrite: true,
      onComplete: () => { nav = null; done?.(); },
    });
  }

  function veilThen(mid) {
    const el = scene();
    if (!el) { mid(); return; }
    veilTl = gsap.timeline({ onComplete: () => { veilTl = null; gsap.set(el, { clearProps: 'opacity' }); } })
      .to(el, { opacity: 0.1, duration: 0.16, ease: 'power1.in' })
      .add(mid)
      .to(el, { opacity: 1, duration: 0.45, ease: 'power1.out' });
  }

  // ------------------------------------------------------------- navigation
  function go(target, { user = true, instant = false, initial = false } = {}) {
    if (destroyed || !n) return;
    target = clamp(Math.round(target), 0, n - 1);
    if (user) stopPlaying();
    const from = index;
    if (target === from && !initial) return;
    const direction = Math.sign(target - from);
    killMotion();
    const quick = instant || ctx.reducedMotion;
    const done = () => { if (playing) scheduleNext(); };

    if (quick) {
      master.seek(`s${target}`, true);
      done();
    } else if (target === from + 1) {
      master.seek(from >= 0 ? `s${from}` : 0, true);
      playTo(target, done);
    } else {
      veilThen(() => { master.seek(`s${target}:start`, true); playTo(target, done); });
    }
    index = target;
    paint();
    if (playing && !quick) startFill(target);
    if (target === n - 1 && !completed) {
      completed = true;          // guided-then-free: unlock free controls once the end is reached
      try { onComplete?.(); } catch (e) { console.error(`[figure ${ctx.id}] stepper onComplete threw`, e); }
    }
    if (!initial) ctx.announce(`Step ${target + 1} of ${n}${phaseOf(target) ? `, ${phaseOf(target).label}` : ''}${items[target].title ? `: ${items[target].title}` : ''}. ${items[target].text}`);
    try { onChange?.(target, { direction, instant: quick, from, initial }); } catch (e) { console.error(`[figure ${ctx.id}] stepper onChange threw`, e); }
  }

  // ------------------------------------------------------------- play all
  /** Seconds step i's own animation takes at 1×. */
  const animTime = (i) => (master ? Math.max(0, labelTime(`s${i}`) - labelTime(`s${i}:start`) - GAP) : 0);
  /** Pause after step i's animation during play-all, at 1×. */
  function pauseTime(i) {
    const anim = animTime(i);
    const cap = Math.max(MIN_PAUSE, maxStep - anim);
    let custom = typeof dwell === 'function' ? dwell(i) : dwell;
    if (typeof custom === 'number' && Number.isFinite(custom)) return clamp(custom, 0, cap);
    const words = items[i]?.text.split(/\s+/).filter(Boolean).length || 0;
    return clamp(clamp(anim + PER_WORD * words, MIN_STEP, maxStep) - anim, MIN_PAUSE, cap);
  }
  const readingTime = (i) => pauseTime(i) / speed;

  // Thin progress fill on the active dot (and under the count on phones) while playing.
  function startFill(i, anim = animTime(i) / speed) {
    fill?.kill();
    fill = null;
    if (ctx.reducedMotion) { root.style.setProperty('--play-p', '0'); return; }
    const total = anim + readingTime(i);
    fill = gsap.fromTo(root, { '--play-p': 0 }, { '--play-p': 1, duration: Math.max(0.1, total), ease: 'none' });
    if (!ctx.visible) fill.pause();
  }
  function stopFill() {
    fill?.kill();
    fill = null;
    root.style.setProperty('--play-p', '0');
  }

  function scheduleNext(delay) {
    dwellCall?.kill();
    if (!playing) return;
    if (index >= n - 1) {
      if (loop) { dwellCall = gsap.delayedCall(delay ?? readingTime(index), () => go(0, { user: false })); }
      else { playing = false; stopFill(); paintPlay(); }
      return;
    }
    dwellCall = gsap.delayedCall(delay ?? readingTime(index), () => { if (playing) go(index + 1, { user: false }); });
    if (!ctx.visible) dwellCall.pause();
  }

  function play() {
    if (!n) return;
    playing = true;
    paintPlay();
    if (index >= n - 1 || index < 0) { go(0, { user: false, initial: index < 0 }); return; }
    if (nav) {                       // a step is animating; its completion schedules the next
      nav.timeScale(speed);
      startFill(index, Math.max(0, labelTime(`s${index}`) - master.time()) / speed);
      return;
    }
    scheduleNext(0.35);
    if (!ctx.reducedMotion) {        // the current step is already shown: fill over the short wait
      fill?.kill();
      fill = gsap.fromTo(root, { '--play-p': 0.85 }, { '--play-p': 1, duration: 0.35, ease: 'none' });
    }
  }

  function stopPlaying() {
    if (!playing) return;
    playing = false;
    dwellCall?.kill();
    dwellCall = null;
    stopFill();
    paintPlay();
  }

  function replay() {
    stopPlaying();
    playing = true;
    paintPlay();
    go(0, { user: false });
  }

  // ------------------------------------------------------------- UI
  const root = h('div', { class: 'stepper', role: 'group', 'aria-label': 'Step through the figure' });
  const prevBtn = h('button', { type: 'button', class: 'btn btn--ghost btn--icon', 'aria-label': 'Previous step', html: icon('prev') });
  const nextBtn = h('button', { type: 'button', class: 'btn btn--icon', 'aria-label': 'Next step', html: icon('next') });
  const dots = h('div', { class: 'step-dots' });
  const count = h('span', { class: 'step-count', 'aria-hidden': 'true' });
  const playBtn = h('button', { type: 'button', class: 'btn btn--play' });
  // Play-all speed (1× / 2×): shown while playing, remembered per viewer.
  const speedBtn = h('button', { type: 'button', class: 'btn btn--ghost btn--sm stepper__speed', hidden: true });
  const paintSpeed = () => {
    speedBtn.textContent = `${speed}×`;
    speedBtn.setAttribute('aria-label', `Play speed ${speed}×. Switch to ${speed === 1 ? 2 : 1}×`);
    speedBtn.title = 'Play speed';
  };
  paintSpeed();
  speedBtn.addEventListener('click', () => {
    const k = speed === 1 ? 2 : 0.5;
    speed = speed === 1 ? 2 : 1;
    saveSpeed(speed);
    paintSpeed();
    // Apply to what is already running: the step animation, the pending pause and the fill.
    for (const t of [nav, dwellCall, fill]) if (t) t.timeScale(t.timeScale() * k);
  });
  const dotEls = items.map((it, i) => {
    const b = h('button', {
      type: 'button', class: 'step-dot',
      'aria-label': `Step ${i + 1}${it.title ? `: ${it.title}` : ''}`,
      'data-tip': it.title ? `${i + 1} · ${it.title}` : `Step ${i + 1}`,
    });
    b.addEventListener('click', () => go(i));
    dots.append(b);
    return b;
  });
  if (n > 12) root.classList.add('is-crowded');
  let dotsArea = dots;
  let phaseEls = [];
  const phaseNow = h('span', { class: 'stepper__phase-now', 'aria-hidden': 'true' });
  if (phases) {
    dotsArea = h('div', { class: 'step-phases' });
    phaseEls = phases.map((p) => {
      const group = h('div', { class: 'step-dots' }, ...p.steps.map((i) => dotEls[i]).filter(Boolean));
      const el = h('div', { class: 'step-phase', role: 'group', 'aria-label': p.label }, h('span', { class: 'step-phase__label', 'aria-hidden': 'true' }, p.label), group);
      dotsArea.append(el);
      return el;
    });
    root.classList.add('has-phases');
  }
  root.append(
    h('div', { class: 'stepper__nav' }, prevBtn, dotsArea, h('span', { class: 'stepper__count' }, phases ? phaseNow : null, count), nextBtn),
    h('span', { class: 'stepper__spacer' }),
    speedBtn,
    playBtn,
  );
  prevBtn.addEventListener('click', () => { if (index > 0) go(index - 1); });
  nextBtn.addEventListener('click', () => { if (index < n - 1) go(index + 1); });
  playBtn.addEventListener('click', () => {
    if (playing) stopPlaying();
    else if (index >= n - 1) replay();
    else play();
  });
  root.addEventListener('keydown', (e) => {
    if (e.target.closest('input, select, textarea, [role="radiogroup"]')) return;
    let handled = true;
    if (e.key === 'ArrowRight') go(index + 1);
    else if (e.key === 'ArrowLeft') go(Math.max(0, index - 1));
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(n - 1);
    else handled = false;
    if (handled) e.preventDefault();
  });
  // Any other interaction with the figure stops play-all.
  const ownBtn = (t) => playBtn.contains(t) || speedBtn.contains(t);
  ctx.on(ctx.el, 'pointerdown', (e) => { if (!ownBtn(e.target)) stopPlaying(); }, { capture: true });
  ctx.on(ctx.el, 'keydown', (e) => { if (!ownBtn(e.target) && e.key !== 'Tab' && e.key !== 'Shift') stopPlaying(); }, { capture: true });
  // Pause the dwell timer (and the progress fill) while off-screen.
  ctx.onVisible((v) => {
    if (dwellCall) v ? dwellCall.resume() : dwellCall.pause();
    if (fill) v ? fill.resume() : fill.pause();
  });
  if (parent) parent.append(root);

  // Captions: every caption occupies the same grid cell, so height never jumps.
  // The build pre-renders the writer's captions (to reserve their space); replace them.
  ctx.caption.querySelector(':scope > .fig__steps[data-prerender]')?.remove();
  let capEls = [];
  if (captions && n) {
    const wrap = h('div', { class: 'fig__steps' });
    capEls = items.map((it, i) => {
      const ph = phaseOf(i);
      const num = h('span', { class: 'fig__step-num', html: `Step ${i + 1} <span class="of">of ${n}</span>${ph ? ` <span class="ph">· ${ph.label}</span>` : ''}${it.title ? ` <span class="t">· ${it.title}</span>` : ''}` });
      const el = h('div', { class: 'fig__step', 'aria-hidden': 'true' }, num, h('p', { class: 'fig__step-text', html: it.html }));
      wrap.append(el);
      return el;
    });
    ctx.caption.prepend(wrap);
  }
  ctx._arrangeSteps?.();     // stepper created after mount: put bar + caption in place now

  // Caption height (POLISH S5): the box fits the active caption but is never shorter than the
  // median caption, so short captions leave no big gap and most steps don't move what's below.
  // Longer captions grow it smoothly. Re-fits when any caption's size changes (fonts, width).
  let fitQueued = false;
  let fitted = false;
  function fitCaptions() {
    fitQueued = false;
    const wrap = capEls[0]?.parentElement;
    if (!wrap || !wrap.isConnected || destroyed) return;
    wrap.classList.add('is-fit');
    const hs = capEls.map((c) => c.offsetHeight);
    if (!hs.some(Boolean)) return;                     // not laid out yet (hidden)
    const sorted = [...hs].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const target = Math.max(median, hs[Math.max(0, index)]);
    if (!fitted || ctx.reducedMotion) {
      wrap.style.transition = 'none';
      wrap.style.height = `${target}px`;
      void wrap.offsetHeight;
      wrap.style.transition = '';
      fitted = true;
    } else wrap.style.height = `${target}px`;
  }
  const queueFit = () => { if (!fitQueued && capEls.length) { fitQueued = true; requestAnimationFrame(fitCaptions); } };
  if (capEls.length && 'ResizeObserver' in window) {
    const capRO = new ResizeObserver(queueFit);
    capEls.forEach((c) => capRO.observe(c));
    ctx.cleanup(() => capRO.disconnect());
  }

  function paintPlay() {
    root.classList.toggle('is-playing', playing);
    speedBtn.hidden = !playing;
    const atEnd = index >= n - 1 && !playing;
    const [ic, label] = playing ? ['pause', 'Pause'] : atEnd ? ['replay', 'Replay'] : ['play', 'Play all'];
    playBtn.innerHTML = `${icon(ic)}<span class="btn__text">${label}</span>`;
    playBtn.setAttribute('aria-label', playing ? 'Pause' : atEnd ? 'Replay all steps' : 'Play all steps');
  }

  function paint() {
    const i = Math.max(0, index);
    // aria-disabled (not disabled) keeps focus on the button at either end.
    prevBtn.setAttribute('aria-disabled', String(i <= 0));
    nextBtn.setAttribute('aria-disabled', String(i >= n - 1));
    count.textContent = `${i + 1} / ${n}`;
    dotEls.forEach((d, k) => {
      d.classList.toggle('is-done', k < i);
      if (k === i) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current');
    });
    if (phases) {
      const cur = phaseOf(i);
      phaseEls.forEach((el, k) => el.classList.toggle('is-current', phases[k] === cur));
      phaseNow.textContent = cur ? `${cur.short} ·` : '';
    }
    capEls.forEach((c, k) => {
      c.classList.toggle('is-active', k === i);
      c.setAttribute('aria-hidden', String(k !== i));
    });
    queueFit();
    paintPlay();
  }

  // ------------------------------------------------------------- start
  build();
  paint();
  if (n) {
    if (ctx.reducedMotion) {
      go(0, { user: false, instant: true, initial: true });
    } else {
      ctx.onceVisible(() => {
        if (index >= 0 || destroyed) return;
        go(0, { user: false, initial: true });
        if (autoplay) { playing = true; paintPlay(); }
      }, 0.35);
    }
  }

  const api = {
    el: root,
    /** Go to step i (0-based). opts: { instant } */
    go: (i, o = {}) => go(i, { user: true, ...o }),
    next: () => go(index + 1),
    prev: () => go(Math.max(0, index - 1)),
    play,
    pause: stopPlaying,
    replay,
    /** Rebuild the timeline (e.g. after a toggle changed what enter() draws) and restore the current step. */
    rebuild() {
      killMotion();
      const i = index;
      master.progress(0, true);
      master.kill();
      build();
      if (i >= 0) master.seek(`s${i}`, true);
    },
    get index() { return Math.max(0, index); },
    get count() { return n; },
    get playing() { return playing; },
    get timeline() { return master; },
    destroy() {
      destroyed = true;
      stopPlaying();
      stopFill();
      killMotion();
      master?.kill();
      root.remove();
      capEls[0]?.parentElement?.remove();
    },
  };
  ctx.cleanup(api.destroy);
  return api;
}
