import { Rx } from "@effect-rx/rx-react"
import * as Http from "@effect/platform/HttpClient"
import * as Schema from "@effect/schema/Schema"
import { Effect, Layer, Option, Stream } from "effect"

export class Todo extends Schema.Class<Todo>("Todo")({
  id: Schema.Number,
  title: Schema.String,
  completed: Schema.Boolean,
}) {
  static readonly array = Schema.Array(Todo)
  static readonly chunk = Schema.Chunk(Todo)
}

const make = Effect.gen(function* () {
  const defaultClient = yield* Http.client.Client
  const client = defaultClient.pipe(
    Http.client.mapRequest(
      Http.request.prependUrl("https://jsonplaceholder.typicode.com"),
    ),
    Http.client.filterStatusOk,
  )

  const getTodos = Http.request.get("/todos")
  const stream = (perPage: number) =>
    Stream.paginateChunkEffect(1, page =>
      getTodos.pipe(
        Http.request.setUrlParams({
          _page: page.toString(),
          _limit: perPage.toString(),
        }),
        client,
        Http.response.schemaBodyJsonScoped(Todo.chunk),
        Effect.map(chunk => [
          chunk,
          Option.some(page + 1).pipe(
            Option.filter(() => chunk.length === perPage),
          ),
        ]),
      ),
    )
  const effect = getTodos.pipe(
    client,
    Http.response.schemaBodyJsonScoped(Todo.array),
  )

  return { stream, effect } as const
})

export class Todos extends Effect.Tag("Todos")<
  Todos,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(Todos, make).pipe(Layer.provide(Http.client.layer))
}

// Rx exports

const todosRuntime = Rx.runtime(Todos.Live)

export const perPage = Rx.make(5)

export const stream = todosRuntime.pull(
  get => Stream.unwrap(Todos.stream(get(perPage))),
  // .pipe(
  //   // preload the next page
  //   Stream.bufferChunks({ capacity: 1 }),
  // ),
)

export const effect = todosRuntime.rx(Todos.effect)

export const streamIsDone = Rx.make(get => {
  const r = get(stream)
  return r._tag === "Success" && r.value.done
})
