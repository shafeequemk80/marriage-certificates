export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center font-sans px-4">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Certificate Management Portal
        </h1>
        <p className="text-sm text-slate-500">
          Please access via your designated organization subdomain.
        </p>
      </div>
    </div>
  );
}
