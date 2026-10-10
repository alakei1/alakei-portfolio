/** 3D-tilt + свечение курсора — только desktop с мышью */

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const canHover = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export function initTilt() {
  if (prefersReducedMotion()) return;
  if (!canHover()) return;

  document.querySelectorAll('.card').forEach((card) => {
    const glow = document.createElement('div');
    glow.className = 'card__cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    card.appendChild(glow);

    let raf = null;
    let targetX = 0, targetY = 0, targetRX = 0, targetRY = 0;
    let currentX = 0, currentY = 0, currentRX = 0, currentRY = 0;

    function animate() {
      currentX  += (targetX  - currentX)  * 0.15;
      currentY  += (targetY  - currentY)  * 0.15;
      currentRX += (targetRX - currentRX) * 0.15;
      currentRY += (targetRY - currentRY) * 0.15;

      card.style.setProperty('--mx', currentX + 'px');
      card.style.setProperty('--my', currentY + 'px');
      card.style.setProperty('--rx', currentRX.toFixed(2) + 'deg');
      card.style.setProperty('--ry', currentRY.toFixed(2) + 'deg');

      const moving =
        Math.abs(targetRX - currentRX) > 0.01 ||
        Math.abs(targetRY - currentRY) > 0.01 ||
        Math.abs(targetX - currentX) > 0.1 ||
        Math.abs(targetY - currentY) > 0.1;

      raf = moving ? requestAnimationFrame(animate) : null;
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;

      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const max = 5;
      targetRY = ((targetX - cx) / cx) * max;
      targetRX = -((targetY - cy) / cy) * max;

      if (!raf) raf = requestAnimationFrame(animate);
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      targetRX = 0;
      targetRY = 0;
      if (!raf) raf = requestAnimationFrame(animate);
    }, { passive: true });
  });
}