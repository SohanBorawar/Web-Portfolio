export default function Loading() {
  return (
    <div className="min-h-screen bg-background px-mobile pt-32 text-on-surface sm:px-10 lg:px-desktop">
      <div className="mx-auto max-w-site">
        <div className="h-12 w-64 rounded-xl bg-surface-container-high" />
        <div className="mt-6 h-4 w-full max-w-xl rounded-full bg-surface-container-high" />
        <div className="mt-3 h-4 w-4/5 max-w-lg rounded-full bg-surface-container-high" />
      </div>
    </div>
  );
}
