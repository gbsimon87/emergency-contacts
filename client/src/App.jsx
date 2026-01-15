import "./App.css";

export default function App() {
  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-xl space-y-4">
        <h1 className="text-3xl font-bold">Emergency Contacts</h1>
        <p className="text-base">
          Find the right emergency number for your current country quickly.
        </p>
        <div className="rounded-xl border p-4">
          <p className="font-medium">Status</p>
          <p className="text-sm opacity-80">Client is running with Tailwind.</p>
        </div>
      </div>
    </main>
  );
}
