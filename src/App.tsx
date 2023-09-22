import {
  useRx,
  useRxSuspenseSuccess,
  useRxValue,
  useSetRx,
} from "@effect-rx/rx-react"
import "./App.css"
import * as Todos from "./Todos"
import { Suspense, useCallback } from "react"
import { ValueNotifier } from "value-notifier-ts"
import { useValueListenable } from "value-notifier-ts/react"

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
          <Todo key={todo.value.id} notifier={todo} />
        ))}
      </div>
      <p>{result.isWaiting ? "Waiting" : "Loaded"}</p>
      <p>Progress: {result.value.done ? "Done" : "More..."}</p>
    </>
  )
}

function Todo({ notifier }: { readonly notifier: ValueNotifier<Todos.Todo> }) {
  const todo = useValueListenable(notifier)
  const toggle = useCallback(() => {
    notifier.update(todo => ({ ...todo, completed: !todo.completed }))
  }, [notifier])
  return (
    <p>
      <input checked={todo.completed} type="checkbox" onChange={toggle} />
      &nbsp;{todo.title}
    </p>
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
