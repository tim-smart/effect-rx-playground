import {
  useRx,
  useRxSuspenseSuccess,
  useRxValue,
  useSetRx,
} from "@effect-rx/rx-react"
import "./App.css"
import * as Todos from "./Todos"
import { Suspense } from "react"

export default function App() {
  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <TodoList />
      </Suspense>
      <PullButton />
      <br />
      <PerPageSelect />
    </>
  )
}

const TodoList = () => {
  const result = useRxSuspenseSuccess(Todos.stream)
  return (
    <>
      <div style={{ textAlign: "left" }}>
        {result.value.items.map(todo => (
          <p key={todo.id}>
            <input checked={todo.completed} type="checkbox" />
            &nbsp;{todo.title}
          </p>
        ))}
      </div>
      <p>{result.isWaiting ? "Waiting" : "Loaded"}</p>
      <p>Progress: {result.value.done ? "Done" : "More..."}</p>
    </>
  )
}

const PullButton = () => {
  const pull = useSetRx(Todos.stream)
  const done = useRxValue(Todos.isDone)
  return (
    <button onClick={() => pull()} disabled={done}>
      Pull more
    </button>
  )
}

const PerPageSelect = () => {
  const [n, set] = useRx(Todos.perPage)
  return (
    <>
      <label>
        Per page:
        <select value={n} onChange={e => set(Number(e.target.value))}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={55}>55</option>
        </select>
      </label>
    </>
  )
}
