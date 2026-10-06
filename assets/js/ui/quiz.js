// Multiple-choice quiz. Markup is produced by the build from `:::quiz`.
// Each option carries data-correct and its own explanation. Picking an
// option locks the question and reveals that option's explanation; a wrong
// pick offers "Try again" (resets the question) and "Show answer".
import { h, icon, qs, qsa } from './dom.js';

export function initQuizzes() {
  for (const quiz of qsa('[data-quiz]')) setup(quiz);
}

function setup(quiz) {
  const questions = qsa('[data-q]', quiz);
  const score = qs('.quiz__score', quiz);
  const state = new Map(); // question → 'correct' | 'wrong' | undefined

  const updateScore = () => {
    if (!score) return;
    const answered = [...state.values()].filter(Boolean).length;
    const right = [...state.values()].filter((v) => v === 'correct').length;
    score.textContent = answered ? `${right} of ${questions.length} correct` : `${questions.length} question${questions.length > 1 ? 's' : ''}`;
  };

  for (const q of questions) {
    const options = qsa('.quiz__option', q);
    const foot = qs('.quiz__foot', q) || q.appendChild(h('div', { class: 'quiz__foot' }));
    const live = h('p', { class: 'visually-hidden', 'aria-live': 'polite' });
    q.append(live);
    const letters = options.map((o) => qs('.quiz__marker', o)?.textContent || '');

    const reset = () => {
      state.set(q, undefined);
      options.forEach((o, i) => {
        o.disabled = false;
        o.classList.remove('is-correct', 'is-wrong', 'is-revealed', 'is-dimmed');
        o.removeAttribute('aria-disabled');
        const m = qs('.quiz__marker', o);
        if (m) m.textContent = letters[i];
      });
      foot.replaceChildren();
      live.textContent = '';
      updateScore();
      options[0]?.focus();
    };

    const revealAll = () => {
      options.forEach((o) => {
        o.classList.add('is-revealed');
        if (o.dataset.correct === 'true') mark(o, true);
        else if (!o.classList.contains('is-wrong')) o.classList.add('is-dimmed');
      });
    };

    options.forEach((opt) => {
      opt.addEventListener('click', () => {
        if (state.get(q)) return;
        const correct = opt.dataset.correct === 'true';
        options.forEach((o) => { o.disabled = true; });
        opt.classList.add('is-revealed');
        mark(opt, correct);
        const explanation = qs('.quiz__explain', opt)?.textContent || '';
        foot.replaceChildren();
        if (correct) {
          state.set(q, 'correct');
          revealAll();
          foot.append(h('p', { class: 'quiz__feedback is-good' }, 'Correct.'));
          live.textContent = `Correct. ${explanation}`;
        } else {
          state.set(q, 'wrong');
          options.forEach((o) => { if (o !== opt) o.classList.add('is-dimmed'); });
          const retry = h('button', { type: 'button', class: 'btn btn--sm', html: `${icon('replay')}<span>Try again</span>` });
          const show = h('button', { type: 'button', class: 'btn btn--sm btn--ghost' }, 'Show answer');
          retry.addEventListener('click', reset);
          show.addEventListener('click', () => { revealAll(); show.remove(); retry.focus(); });
          foot.append(h('p', { class: 'quiz__feedback is-bad' }, 'Not quite.'), retry, show);
          live.textContent = `Not quite. ${explanation}`;
          retry.focus({ preventScroll: true });
        }
        updateScore();
      });
    });
  }
  updateScore();
}

function mark(opt, correct) {
  opt.classList.add(correct ? 'is-correct' : 'is-wrong');
  opt.classList.remove('is-dimmed');
  const m = qs('.quiz__marker', opt);
  if (m) m.innerHTML = icon(correct ? 'check' : 'x');
}
