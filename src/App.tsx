import {
  useRx,
  useRxSet,
  useRxSuspenseSuccess,
  useRxValue,
} from "@effect-rx/rx-react"
import { Suspense, useState } from "react"
import "./App.css"
import * as Todos from "./Todos"
import { getIdRx } from "./worker/client"

export default function App() {
  return (
    <>
      <WorkerWrap />
      <h3>Stream list</h3>
      <Suspense fallback={<p>Loading...</p>}>
        <TodoStreamList />
      </Suspense>
      <PullButton />
      <br />
      <PerPageSelect />
      <h3>Effect list</h3>
      <Suspense fallback={<p>Loading...</p>}>
        <TodoEffectList />
      </Suspense>
    </>
  )
}

const TodoStreamList = () => {
  const result = useRxSuspenseSuccess(Todos.stream)
  return (
    <>
      <div style={{ textAlign: "left" }}>
        {result.value.items.map(todo => (
          <Todo key={todo.id} todo={todo} />
        ))}
      </div>
      <p>{result.waiting ? "Waiting" : "Loaded"}</p>
    </>
  )
}

const TodoEffectList = () => {
  const todos = useRxSuspenseSuccess(Todos.effect).value
  return (
    <>
      <div style={{ textAlign: "left" }}>
        {todos.map(todo => (
          <Todo key={todo.id} todo={todo} />
        ))}
      </div>
    </>
  )
}

function Todo({ todo }: { readonly todo: Todos.Todo }) {
  return (
    <p>
      <input checked={todo.completed} type="checkbox" disabled />
      &nbsp;{todo.title}
    </p>
  )
}

const PullButton = () => {
  const pull = useRxSet(Todos.stream)
  const done = useRxValue(Todos.streamIsDone)
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

function WorkerWrap() {
  const [mount, setMount] = useState(false)
  return (
    <>
      <button onClick={() => setMount(_ => !_)}>
        {mount ? "Stop" : "Start"} worker
      </button>
      {mount && <WorkerButton />}
    </>
  )
}

function WorkerButton() {
  const getById = useRxSet(getIdRx)
  return <button onClick={() => getById("123")}>Get ID from worker</button>
}
