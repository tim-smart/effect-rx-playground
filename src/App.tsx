/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRx, useRxSuspenseSuccess, useSetRx } from "@effect-rx/rx-react"
import "./App.css"
import { perPage, todos } from "./Todos"
import { Suspense } from "react"

export default function App() {
  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <Todos />
      </Suspense>
      <PageButton />
      <br />
      <PerPageInput />
    </>
  )
}

const Todos = () => {
  const result = useRxSuspenseSuccess(todos)
  return (
    <>
      <p>Waiting: {result.isWaiting ? "Waiting" : "Loaded"}</p>
      <p>Progress: {result.value.done ? "Done" : "More..."}</p>
      <ul>
        {result.value.items.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </>
  )
}

const PageButton = () => {
  const pull = useSetRx(todos)
  return <button onClick={() => pull()}>Pull more</button>
}

const PerPageInput = () => {
  const [n, set] = useRx(perPage)
  return (
    <>
      <label>
        Per page:
        <select value={n} onChange={e => set(Number(e.target.value))}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </label>
    </>
  )
}
