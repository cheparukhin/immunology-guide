// Self & Other — illustration library
// svg.js: tiny, namespace-correct SVG DOM helpers shared by every art module.

export const SVG_NS = 'http://www.w3.org/2000/svg';
export const TAU = Math.PI * 2;

/** Round a number for compact path strings (2 decimals, no trailing zeros). */
export function n(v) {
  return Math.round(v * 100) / 100;
}

/**
 * Create an SVG element.
 * el('circle', { cx: 0, cy: 0, r: 4, fill: '#fff' })
 * Attribute values of null / undefined / false are skipped.
 * `children` may be an element, a string (text node) or an array of either.
 */
export function el(tag, attrs = {}, children) {
  const node = document.createElementNS(SVG_NS, tag);
  setAttrs(node, attrs);
  if (children != null) append(node, children);
  return node;
}

export function setAttrs(node, attrs = {}) {
  for (const k in attrs) {
    const v = attrs[k];
    if (v == null || v === false) continue;
    node.setAttribute(k, v === true ? '' : String(v));
  }
  return node;
}

export function append(parent, children) {
  if (children == null) return parent;
  if (Array.isArray(children)) {
    for (const c of children) append(parent, c);
  } else if (typeof children === 'string') {
    parent.appendChild(document.createTextNode(children));
  } else {
    parent.appendChild(children);
  }
  return parent;
}

/** A <g>, optionally tagged with data-part. */
export function group(attrs = {}, children) {
  return el('g', attrs, children);
}

/** A named part: <g data-part="name">. */
export function part(name, attrs = {}, children) {
  return el('g', { 'data-part': name, ...attrs }, children);
}

/** Create a root <svg> element (xmlns set, so it also serializes standalone). */
export function svgRoot({ width, height, viewBox, className, title } = {}) {
  const s = document.createElementNS(SVG_NS, 'svg');
  s.setAttribute('xmlns', SVG_NS);
  if (viewBox) s.setAttribute('viewBox', viewBox);
  else if (width && height) s.setAttribute('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`);
  if (width) s.setAttribute('width', width);
  if (height) s.setAttribute('height', height);
  if (className) s.setAttribute('class', className);
  if (title) {
    s.setAttribute('role', 'img');
    const t = document.createElementNS(SVG_NS, 'title');
    t.textContent = title;
    s.appendChild(t);
  }
  return s;
}

/** Path string for a circle (as a sub-path, so many circles can share one <path>). */
export function circleD(cx, cy, r) {
  return `M${n(cx - r)} ${n(cy)}a${n(r)} ${n(r)} 0 1 0 ${n(2 * r)} 0a${n(r)} ${n(r)} 0 1 0 ${n(-2 * r)} 0Z`;
}

/** Path for an ellipse (sub-path). Rotation in degrees. */
export function ellipseD(cx, cy, rx, ry, rot = 0) {
  const a = (rot * Math.PI) / 180;
  const c = Math.cos(a), s = Math.sin(a);
  const x1 = cx - rx * c, y1 = cy - rx * s;
  const x2 = cx + rx * c, y2 = cy + rx * s;
  return `M${n(x1)} ${n(y1)}A${n(rx)} ${n(ry)} ${n(rot)} 1 0 ${n(x2)} ${n(y2)}A${n(rx)} ${n(ry)} ${n(rot)} 1 0 ${n(x1)} ${n(y1)}Z`;
}

/**
 * Path for a capsule ("stadium") from (x1,y1) to (x2,y2) with total width w.
 * The end caps are semicircles. Used for protein domains.
 */
export function capsuleD(x1, y1, x2, y2, w) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1e-6;
  const ux = dx / len, uy = dy / len;
  const px = -uy * (w / 2), py = ux * (w / 2);
  const r = w / 2;
  return (
    `M${n(x1 + px)} ${n(y1 + py)}L${n(x2 + px)} ${n(y2 + py)}` +
    `A${n(r)} ${n(r)} 0 0 0 ${n(x2 - px)} ${n(y2 - py)}` +
    `L${n(x1 - px)} ${n(y1 - py)}A${n(r)} ${n(r)} 0 0 0 ${n(x1 + px)} ${n(y1 + py)}Z`
  );
}

/** Rounded rectangle path centred on (cx, cy). */
export function roundRectD(cx, cy, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  const x = cx - w / 2, y = cy - h / 2;
  return (
    `M${n(x + r)} ${n(y)}H${n(x + w - r)}A${n(r)} ${n(r)} 0 0 1 ${n(x + w)} ${n(y + r)}` +
    `V${n(y + h - r)}A${n(r)} ${n(r)} 0 0 1 ${n(x + w - r)} ${n(y + h)}` +
    `H${n(x + r)}A${n(r)} ${n(r)} 0 0 1 ${n(x)} ${n(y + h - r)}` +
    `V${n(y + r)}A${n(r)} ${n(r)} 0 0 1 ${n(x + r)} ${n(y)}Z`
  );
}

/** Regular polygon path (sub-path). */
export function polygonD(cx, cy, r, sides, rot = 0) {
  let d = '';
  for (let i = 0; i < sides; i++) {
    const a = rot + (i / sides) * TAU;
    d += (i ? 'L' : 'M') + n(cx + r * Math.cos(a)) + ' ' + n(cy + r * Math.sin(a));
  }
  return d + 'Z';
}

/** Apply a transform string to an element (appends to existing unless replace). */
export function transform(node, t, replace = true) {
  if (replace) node.setAttribute('transform', t);
  else node.setAttribute('transform', `${node.getAttribute('transform') || ''} ${t}`.trim());
  return node;
}

/** Convenience: place a node at (x, y) with optional rotation (deg) and scale. */
export function place(node, x = 0, y = 0, rot = 0, scale = 1) {
  let t = `translate(${n(x)} ${n(y)})`;
  if (rot) t += ` rotate(${n(rot)})`;
  if (scale !== 1) t += ` scale(${n(scale)})`;
  node.setAttribute('transform', t);
  return node;
}

export const deg = (rad) => (rad * 180) / Math.PI;
export const rad = (d) => (d * Math.PI) / 180;
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
