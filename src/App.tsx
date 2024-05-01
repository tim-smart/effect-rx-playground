import {
  RxRef,
  useRx,
  useRxRef,
  useRxSet,
  useRxSuspenseSuccess,
  useRxValue,
} from "@effect-rx/rx-react"
import "./App.css"
import * as Todos from "./Todos"
import { Suspense, useCallback } from "react"

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
          <Todo key={todo.value.id} todoRef={todo} />
        ))}
      </div>
      <p>{result.waiting ? "Waiting" : "Loaded"}</p>
    </>
  )
}

function Todo({ todoRef }: { readonly todoRef: RxRef.RxRef<Todos.Todo> }) {
  const todo = useRxRef(todoRef)
  const toggle = useCallback(() => {
    todoRef.update(todo => ({ ...todo, completed: !todo.completed }))
  }, [todoRef])
  return (
    <p>
      <input checked={todo.completed} type="checkbox" onChange={toggle} />
      &nbsp;{todo.title}
    </p>
  )
}

const PullButton = () => {
  const pull = useRxSet(Todos.stream)
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
