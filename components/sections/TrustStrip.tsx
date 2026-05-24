// Stat strip + "powered by" row. Numbers are placeholders — replace as we
// actually have real traction to brag about.
const STATS = [
  { value: '1,200+', label: 'Verified hosts' },
  { value: '60+',     label: 'Cities live' },
  { value: '4.8★',    label: 'Average rating' },
  { value: '99.9%',   label: 'Call uptime' },
];

const POWERED = ['Agora', 'Razorpay', 'Firebase', 'AWS Mumbai'];

export default function TrustStrip() {
  return (
    <section className="border-y border-border bg-bg-elev/30">
      <div className="max-w-site mx-auto px-6 md:px-10 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="gradient-text text-3xl md:text-4xl font-extrabold tracking-tight">
                {s.value}
              </div>
              <div className="mt-1 text-xs md:text-sm text-text-dim font-medium">
                {s.label}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8">
          <span className="text-[11px] uppercase tracking-[0.18em] text-text-muted font-bold">
            Powered by
          </span>
          <div className="flex flex-wrap gap-x-8 gap-y-3 justify-center">
            {POWERED.map((p) => (
              <span key={p} className="text-text-dim font-semibold text-sm tracking-wide">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
