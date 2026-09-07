export default function FullPageSpinner({ label = "Loading…" }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-wine" />
      <p className="text-[10px] uppercase tracking-[1.5px] text-muted">{label}</p>
    </div>
  );
}
