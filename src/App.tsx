import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 text-slate-100">
      <h1 className="text-4xl font-bold">PM0 Starter</h1>
      <p className="text-center text-lg text-slate-300">
        This placeholder view renders while you build your application.
      </p>
      <button
        className="rounded-lg bg-indigo-500 px-4 py-2 font-semibold text-white shadow transition hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
        onClick={() => setCount((value) => value + 1)}
      >
        Count is {count}
      </button>
    </main>
  )
}

export default App
