/**
 * Fixed layers that make the app feel “alive” without stealing focus.
 * Interview angle: shows intentional art direction + performance hygiene (pointer-events: none).
 */
export function AmbientBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute -left-[20%] top-[-10%] h-[50vmin] w-[50vmin] rounded-full bg-hotel-gold/10 blur-[120px] animate-aurora" />
      <div className="absolute -right-[15%] bottom-[-20%] h-[55vmin] w-[55vmin] rounded-full bg-stone-300/40 blur-[130px] animate-float" />
      <div className="absolute left-1/2 top-1/3 h-[40vmin] w-[40vmin] -translate-x-1/2 rounded-full bg-hotel-accent/5 blur-[100px]" />
    </div>
  );
}
