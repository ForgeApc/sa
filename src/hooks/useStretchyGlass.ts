import { useEffect } from 'react';

const SKIP = new Set(['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA', 'A']);

export function useStretchyGlass() {
  useEffect(() => {
    const onDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (SKIP.has(target.tagName)) return;
      if (target.closest('button, input, select, a, [role="button"]')) return;

      const el = target.closest<HTMLElement>('.glass, .glass-flat');
      if (!el) return;

      const startX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
      const startY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

      el.style.transition = 'none';
      el.style.willChange = 'transform';
      document.body.style.userSelect = 'none';

      const onMove = (e: MouseEvent | TouchEvent) => {
        const cx = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        const cy = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

        const dx = Math.max(-50, Math.min(50, cx - startX));
        const dy = Math.max(-50, Math.min(50, cy - startY));

        const tx    = dx * 0.08;
        const ty    = dy * 0.08;
        const skewX = dy * 0.14;
        const skewY = dx * 0.14;
        const scale = 1 - (Math.abs(dx) + Math.abs(dy)) * 0.0003;

        el.style.transform = `translate(${tx}px,${ty}px) skewX(${skewX}deg) skewY(${skewY}deg) scale(${Math.max(0.93, scale)})`;
      };

      const onUp = () => {
        document.body.style.userSelect = '';
        // Spring back with elastic overshoot
        el.style.transition = 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)';
        el.style.transform = '';
        setTimeout(() => { el.style.willChange = ''; el.style.transition = ''; }, 750);

        document.removeEventListener('mousemove', onMove as EventListener);
        document.removeEventListener('mouseup', onUp);
        document.removeEventListener('touchmove', onMove as EventListener);
        document.removeEventListener('touchend', onUp);
      };

      document.addEventListener('mousemove', onMove as EventListener);
      document.addEventListener('mouseup', onUp);
      document.addEventListener('touchmove', onMove as EventListener, { passive: true });
      document.addEventListener('touchend', onUp);
    };

    document.addEventListener('mousedown', onDown as EventListener);
    document.addEventListener('touchstart', onDown as EventListener, { passive: true });

    return () => {
      document.removeEventListener('mousedown', onDown as EventListener);
      document.removeEventListener('touchstart', onDown as EventListener);
    };
  }, []);
}
